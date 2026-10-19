/*
 * Khaemenes Academy Family Backup Vault v1.0.0
 * ------------------------------------------------------------
 * Browser-local verified family backup / restore helper.
 * Restores Academy family identity only. It never restores or rewrites
 * course grades, assessment attempts, private learner reflections, or chats.
 */
(function attachKhaemenesFamilyBackupVault(global){
"use strict";

const VERSION="1.0.0";
const SCHEMA="khaemenes-family-backup-v2";
const ROLLBACK_KEY="khaemenes_family_restore_rollback_v1";
const MAX_FILE_BYTES=2_000_000;
const MAX_ROLLBACKS=3;

const R=()=>global.KhaemenesFamilyRegistry||null;
const P=()=>global.KhaemenesParentActionCenter||null;
const $=s=>document.querySelector(s);
const read=(k,f=null)=>{try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function stable(value){
  if(value===null||typeof value!=="object")return JSON.stringify(value);
  if(Array.isArray(value))return "["+value.map(stable).join(",")+"]";
  return "{"+Object.keys(value).sort().map(k=>JSON.stringify(k)+":"+stable(value[k])).join(",")+"}";
}
function hex(buffer){return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,"0")).join("")}
async function digest(value){
  if(!global.crypto?.subtle?.digest)throw new Error("secure-digest-unavailable");
  const data=new TextEncoder().encode(stable(value));
  return hex(await global.crypto.subtle.digest("SHA-256",data));
}
function authority(){
  return Object.freeze({
    restoresFamilyRegistry:true,
    restoresCourseGrades:false,
    restoresAssessmentAttempts:false,
    restoresPrivateLearnerReflections:false,
    restoresChildConversations:false,
    restoresAnswerKeys:false,
    overwritesOtherFamilies:false
  });
}
function baseEnvelope(){
  const registry=R();
  if(!registry)throw new Error("family-registry-unavailable");
  const familyExport=registry.exportFamily();
  const brief=P()?.safeBrief?.()||null;
  return {
    schema:SCHEMA,
    version:2,
    createdAt:new Date().toISOString(),
    origin:String(location.origin||""),
    payload:{familyExport,weeklyFamilyBrief:brief},
    authority:authority()
  };
}
async function createEnvelope(){
  const envelope=baseEnvelope();
  envelope.integrity={algorithm:"SHA-256",digest:await digest({
    schema:envelope.schema,
    version:envelope.version,
    createdAt:envelope.createdAt,
    origin:envelope.origin,
    payload:envelope.payload,
    authority:envelope.authority
  })};
  return envelope;
}
async function verifyEnvelope(value){
  if(!value||typeof value!=="object")return {ok:false,reason:"Backup is not a JSON object."};
  if(value.schema===SCHEMA){
    if(value.version!==2)return {ok:false,reason:"Unsupported backup version."};
    if(value.integrity?.algorithm!=="SHA-256"||!value.integrity?.digest)return {ok:false,reason:"Verified backup checksum is missing."};
    const actual=await digest({
      schema:value.schema,
      version:value.version,
      createdAt:value.createdAt,
      origin:value.origin,
      payload:value.payload,
      authority:value.authority
    });
    if(actual!==value.integrity.digest)return {ok:false,reason:"Backup checksum does not match. The file may be incomplete or altered."};
    const familyExport=value.payload?.familyExport;
    const check=R()?.validateFamilyExport?.(familyExport);
    if(!check?.ok)return {ok:false,reason:"Family records failed structural validation: "+(check?.errors||[]).join(", ")};
    return {ok:true,verified:true,familyExport,weeklyFamilyBrief:value.payload?.weeklyFamilyBrief||null,summary:check.summary,createdAt:value.createdAt};
  }
  if(/^khaemenes-family-export-v1\.[23]$/.test(String(value.format||""))){
    const check=R()?.validateFamilyExport?.(value);
    if(!check?.ok)return {ok:false,reason:"Legacy family backup failed structural validation: "+(check?.errors||[]).join(", ")};
    return {ok:true,verified:false,legacy:true,familyExport:value,weeklyFamilyBrief:null,summary:check.summary,createdAt:value.exportedAt||null};
  }
  return {ok:false,reason:"This is not a supported Khaemenes family backup."};
}
function rollbackList(){
  const list=read(ROLLBACK_KEY,[]);
  return Array.isArray(list)?list.slice(-MAX_ROLLBACKS):[];
}
function saveRollback(){
  const registry=R();if(!registry)return false;
  let familyExport=null;
  try{familyExport=registry.exportFamily()}catch{return false}
  const list=rollbackList();
  list.push({
    schema:"khaemenes-family-rollback-v1",
    createdAt:new Date().toISOString(),
    active:registry.activeIds?.()||null,
    familyExport
  });
  return write(ROLLBACK_KEY,list.slice(-MAX_ROLLBACKS));
}
function hasRollback(){return rollbackList().length>0}
function downloadJson(value,name){
  const blob=new Blob([JSON.stringify(value,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function downloadVerifiedBackup(){
  setStatus("Preparing a verified family backup…");
  try{
    const envelope=await createEnvelope();
    const date=envelope.createdAt.slice(0,10);
    downloadJson(envelope,"khaemenes-family-backup-"+date+".json");
    setStatus("Verified family backup downloaded. Keep a second copy somewhere safe.");
    return envelope;
  }catch(error){
    setStatus(error?.message==="secure-digest-unavailable"
      ?"This browser cannot create the required SHA-256 integrity checksum."
      :"Backup could not be created: "+String(error?.message||error));
    throw error;
  }
}
function setStatus(message,ok=false){
  const out=$("#familyBackupStatus");
  if(!out)return;
  out.textContent=message;
  out.setAttribute("data-state",ok?"ok":"info");
}
function previewText(check){
  const s=check.summary||{};
  return [
    "Family: "+(s.displayName||"Khaemenes Family"),
    "Adults: "+(s.adults||0),
    "Learners: "+(s.learners||0),
    "Exported: "+(check.createdAt?new Date(check.createdAt).toLocaleString():"Unknown"),
    "Integrity: "+(check.verified?"SHA-256 verified":"Legacy backup — structurally valid but no checksum")
  ].join("\n");
}
async function readFile(file){
  if(!file)throw new Error("no-file-selected");
  if(file.size>MAX_FILE_BYTES)throw new Error("backup-file-too-large");
  const text=await file.text();
  return JSON.parse(text);
}
async function restoreFile(file){
  const value=await readFile(file);
  const check=await verifyEnvelope(value);
  if(!check.ok)throw new Error(check.reason);
  const message=previewText(check)+"\n\nRestore this family on this browser?\n\nOther family identities are preserved. The current version of this family is saved automatically so you can undo the restore.";
  if(!global.confirm(message))return {restored:false,cancelled:true};
  saveRollback();
  const result=R().restoreFamilyExport(check.familyExport);
  setStatus("Family restored successfully. A pre-restore rollback snapshot is available on this browser.",true);
  updateUndo();
  global.dispatchEvent(new CustomEvent("khaemenes-family-backup-restored",{detail:{familyId:result.familyId,verified:Boolean(check.verified)}}));
  return {...result,verified:Boolean(check.verified)};
}
function undoLastRestore(){
  const list=rollbackList();
  const last=list[list.length-1];
  if(!last?.familyExport){setStatus("No rollback snapshot is available.");return false}
  if(!global.confirm("Restore the family snapshot saved immediately before the last backup restore?"))return false;
  const result=R().restoreFamilyExport(last.familyExport);
  list.pop();write(ROLLBACK_KEY,list);
  setStatus("The pre-restore family snapshot has been restored.",true);
  updateUndo();
  global.dispatchEvent(new CustomEvent("khaemenes-family-backup-undo",{detail:{familyId:result.familyId}}));
  return true;
}
function updateUndo(){
  const btn=$("#undoFamilyRestore");
  if(btn)btn.disabled=!hasRollback();
}
function bind(){
  const exportBtn=$("#exportFamily"),restoreBtn=$("#restoreFamily"),fileInput=$("#restoreFamilyFile"),undoBtn=$("#undoFamilyRestore");
  if(!exportBtn||exportBtn.dataset.backupVaultBound==="true")return;
  exportBtn.dataset.backupVaultBound="true";
  exportBtn.addEventListener("click",event=>{event.preventDefault();downloadVerifiedBackup().catch(()=>{})});
  restoreBtn?.addEventListener("click",()=>fileInput?.click());
  fileInput?.addEventListener("change",async()=>{
    const file=fileInput.files?.[0];
    fileInput.value="";
    if(!file)return;
    setStatus("Checking backup integrity…");
    try{await restoreFile(file)}catch(error){setStatus("Restore stopped: "+String(error?.message||error))}
  });
  undoBtn?.addEventListener("click",undoLastRestore);
  updateUndo();
}
let timer=0;
function schedule(){clearTimeout(timer);timer=setTimeout(bind,80)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
for(const eventName of ["pageshow","khaemenes-family-ready","khaemenes-family-changed"])global.addEventListener(eventName,schedule);

global.KhaemenesFamilyBackupVault=Object.freeze({
  version:VERSION,
  schema:SCHEMA,
  createEnvelope,
  verifyEnvelope,
  downloadVerifiedBackup,
  restoreFile,
  undoLastRestore,
  hasRollback,
  authority:authority()
});
})(window);
