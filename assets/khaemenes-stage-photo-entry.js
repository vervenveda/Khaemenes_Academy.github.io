/* Middle School / Higher Learning stage photo entry.
 * Reuses the Academy universal editor. This file owns only learner-scoped
 * browser-local appearance; it neither verifies accounts nor writes grades.
 */
(function attachAcademyStagePhotoEntry(global){
 "use strict";
 if(global.KhaemenesStagePhotoEntry)return;
 const STORE="khaemenes.stage.profile.look.v1:";
 const VALID_STAGES=new Set(["middle","higher"]);
 const CLIPS=Object.freeze({
  rhombus:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
  star:"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)",
  kite:"polygon(50% 0%,90% 38%,50% 100%,10% 38%)",
  semicircle:"polygon(0 100%,0 50%,4% 31%,15% 15%,31% 4%,50% 0%,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)",
  octagon:"polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)"
 });
 const SHAPES=new Set(["circle","square","oval","rectangle","rhombus","heart","star","octagon","semicircle","kite"]);
 const BADGES=new Set(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
 const $=id=>document.getElementById(id);
 function selected(stage){
  const l=global.KhaemenesFamilyRegistry?.getLearner?.()||null;
  if(!l?.learnerId)return null;
  if(stage==="middle"&&!(l.stage==="middle"&&/^0[6-8]$/.test(String(l.grade||""))))return null;
  if(stage==="higher"&&!(l.stage==="higher"&&l.selfDirectedAdult===true))return null;
  return l;
 }
 function key(stage,id){return STORE+stage+":"+encodeURIComponent(id)}
 function snapshot(stage,id){
  try{
   const record=JSON.parse(localStorage.getItem(key(stage,id))||"null");
   return record?.stage===stage&&record?.learnerId===id&&record?.schema==="academy-stage-photo-v1"?record:null;
  }catch{return null}
 }
 function create(stage,hostId){
  if(!VALID_STAGES.has(stage))return false;
  const editor=global.KhaemenesUniversalProfileLookEditor;
  const host=$(hostId);
  if(!editor||!host||host.dataset.stagePhotoEntry==="1")return false;
  const wrap=document.createElement("div");wrap.className="academy-stage-photo-entry";
  wrap.style.cssText="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;margin:15px auto;padding:15px;border:1px solid #b48b45;border-radius:7px;background:#f4f0e7;color:#243038;max-width:800px;text-align:center";
  const portrait=document.createElement("div");portrait.style.cssText="display:grid;place-items:center;overflow:hidden;width:106px;height:106px;background:#243038;color:#fff8e9;border:2px solid #b48b45;border-radius:50%;font:400 46px/1.1 Nunito,Arial,sans-serif";
  portrait.setAttribute("aria-label","Selected learner picture");
  const controls=document.createElement("div");controls.style.cssText="flex:1 1 220px;display:grid;gap:8px";
  const heading=document.createElement("p");heading.textContent=stage==="higher"?"My Scholar Picture & Colors":"My Middle School Picture & Colors";
  heading.style.cssText="font:400 20px/1.4 Cinzel,Georgia,serif;margin:0";
  const note=document.createElement("p");note.textContent="Optional picture, badge, frame and colors. Saved only on this device, not uploaded or synced. Photos can be seen by others using this browser.";
  note.style.cssText="font:400 16px/1.5 Nunito,Arial,sans-serif;margin:0";
  const open=document.createElement("button");open.type="button";open.textContent="Customize My Picture";
  open.style.cssText="min-height:44px;padding:9px 14px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.4 Nunito,Arial,sans-serif;cursor:pointer";
  open.addEventListener("click",()=>{if(!selected(stage))return;editor.open("picture")});
  const yearbook=document.createElement("button");yearbook.type="button";yearbook.textContent="Open My Yearbook";yearbook.style.cssText="min-height:44px;padding:9px 14px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.4 Nunito,Arial,sans-serif;cursor:pointer";
yearbook.addEventListener("click",()=>{const l=selected(stage);if(l)global.KhaemenesYearbookProfileImages?.openYearbook?.(l.learnerId)});
controls.append(heading,note,open,yearbook);wrap.append(portrait,controls);
  const adapter={
  allowYearbook:true,
   getIdentity(){const l=selected(stage);return l?{id:l.learnerId,displayName:l.nickname||"Learner"}:null},
   readLook(id){return snapshot(stage,id)?.look||{}},
   readPhoto(id){return snapshot(stage,id)?.photo||""},
   maxPhotoChars:180000,
   showDisplayName:false,
   commit({id,look,photo}){
    const l=selected(stage);if(!l||l.learnerId!==id)return false;
    const current=snapshot(stage,id);
    const image=photo===null?current?.photo||"":photo;
    if(typeof image!=="string"||(image&&!/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(image))||image.length>=180000)return false;
    if(!SHAPES.has(look?.frame)||!BADGES.has(look?.badge))return false;
    const safeLook={
     frame:look.frame,badge:look.badge,background:look.background,
     cardColor:look.cardColor,nameFont:look.nameFont,displayName:""
    };
    const value=JSON.stringify({schema:"academy-stage-photo-v1",stage,learnerId:id,look:safeLook,photo:image,updatedAt:new Date().toISOString()});
    try{localStorage.setItem(key(stage,id),value);return localStorage.getItem(key(stage,id))===value}catch{return false}
   },
   refresh(){paint()}
  };
  if(!editor.register(adapter))return false;
  host.dataset.stagePhotoEntry="1";host.append(wrap);
  function paint(){
   const l=selected(stage);
   wrap.hidden=!l;
   portrait.replaceChildren();
   if(!l)return;
   const record=snapshot(stage,l.learnerId),look=record?.look||{},photo=record?.photo||"";
   if(photo){const img=document.createElement("img");img.src=photo;img.alt="Student-selected local profile picture";img.style.cssText="width:100%;height:100%;object-fit:cover";portrait.append(img)}
   else portrait.textContent=BADGES.has(look.badge)?look.badge:"★";
   portrait.style.clipPath=CLIPS[look.frame]||"none";
   portrait.style.borderRadius=["circle","oval"].includes(look.frame)?"50%":"7px";
  }
  global.addEventListener("khaemenes-family-changed",paint);
  global.addEventListener("pageshow",paint);
  global.addEventListener("storage",paint);
  paint();return true;
 }
 global.KhaemenesStagePhotoEntry=Object.freeze({version:"1.0.0",create});
})(window);
