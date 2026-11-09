/* Elementary Grades 1–5: universal Picture & Colors adapter.
 * Additive. Existing photo/background/backup and guardian code remains authoritative.
 * Extra decorations live in an isolated per-learner key; no academic data touched.
 */
(()=>{"use strict";
const w=window,d=document,core=w.KhaemenesUniversalProfileLookEditor;
if(w.KhaemenesElementaryLookAdapter||!core?.register)return;
if(d.body?.dataset.profileStage!=="elementary")return;
const LEGACY="khaemenes_elementary_visual_profile_v1:", EXTRA="khaemenes.elementary.profile.decor.v1:";
const FRAMES=new Set(["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"]);
const BADGES=new Set(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
const COLORS=new Set(["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"]);
const FONTS=new Set(["academy","friendly","classic","modern","handwriting"]);
const key=(prefix,id)=>prefix+encodeURIComponent(id);
const raw=k=>{try{return w.localStorage.getItem(k)}catch{return null}};
const heroKey=id=>"khaemenes.elementary.yearbook.hero:"+encodeURIComponent(id);
const heroValid=v=>v===""||(typeof v==="string"&&v.length<180000&&v.startsWith("data:image/jpeg;base64,")&&new RegExp("^[A-Za-z0-9+/=]+$").test(v.slice(23)));
function applyHero(){const id=identity()?.id,source=id?raw(heroKey(id)):null,el=d.querySelector(".card.hero");if(!el)return;
 if(source&&heroValid(source)){el.style.setProperty("background-image",`linear-gradient(rgba(244,240,231,.76),rgba(244,240,231,.84)),url("${source}")`,"important");el.style.setProperty("background-size","cover","important");el.style.setProperty("background-position","center","important")}
 else el.style.removeProperty("background-image")}

const decode=k=>{try{return JSON.parse(raw(k)||"null")}catch{return null}};
const restore=(k,v)=>{if(v===null)w.localStorage.removeItem(k);else w.localStorage.setItem(k,v)};
function identity(){
 try{
  const r=w.KhaemenesFamilyRegistry,l=r?.getLearner?.(),active=r?.activeIds?.()?.learnerId;
  if(!l?.learnerId||l.stage!=="elementary"||!/^0[1-5]$/.test(String(l.grade)))return null;
  if(active&&active!==l.learnerId)return null;
  return {id:l.learnerId,displayName:l.nickname||"Young Scholar",grade:String(l.grade)};
 }catch{return null}
}
const approved=()=>d.getElementById("adultConfirm")?.checked===true;
const original=id=>{const v=decode(key(LEGACY,id));return v&&typeof v==="object"&&!Array.isArray(v)&&v.learnerId===id&&v.schema==="khaemenes.elementary-visual.v1"?v:null};
const extras=id=>{const v=decode(key(EXTRA,id));return v&&v.schema==="khaemenes.elementary-decoration.v1"&&v.learnerId===id?v:null};
const adapter=Object.freeze({
 showDisplayName:false,maxPhotoChars:180000,getIdentity:identity,allowYearbook:true,
 readLook(id){
  if(identity()?.id!==id)return {};
  const v=extras(id)||{};
  return {displayName:"",background:"parchment",badge:BADGES.has(v.badge)?v.badge:"★",
   frame:FRAMES.has(v.frame)?v.frame:"circle",cardColor:COLORS.has(v.cardColor)?v.cardColor:"",
   nameFont:FONTS.has(v.nameFont)?v.nameFont:"academy"};
 },
 readHeroImage(id){if(identity()?.id!==id)return "";const x=raw(heroKey(id));return x&&heroValid(x)?x:""},
 readPhoto(id){if(identity()?.id!==id)return "";const v=original(id)?.photo||"";return /^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(v)&&v.length<180000?v:""},
 commit({id,look,photo,badgeTouched,heroImage=null}){
  if(identity()?.id!==id||!approved()||!FRAMES.has(look?.frame)||!BADGES.has(look?.badge)||!FONTS.has(look?.nameFont))return false;
  if(look.cardColor&&!COLORS.has(look.cardColor))return false;
  if(photo!==null&&photo!==""&&(!/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(photo)||photo.length>=180000))return false;
  if(heroImage!==null&&!heroValid(heroImage))return false;
  const lk=key(LEGACY,id),dk=key(EXTRA,id),oldL=raw(lk),oldD=raw(dk),oldH=raw(heroKey(id)),old=original(id),prior=extras(id);
  if(oldL!==null&&!old)return false; // fail closed for unfamiliar legacy schemas
  const newLegacy=photo===null?null:{
   ...(old||{schema:"khaemenes.elementary-visual.v1",learnerId:id,avatar:"🌟",theme:"parchment"}),
   schema:"khaemenes.elementary-visual.v1",learnerId:id,photo:photo||"",updatedAt:new Date().toISOString()
  };
  const newDecor={schema:"khaemenes.elementary-decoration.v1",learnerId:id,updatedAt:new Date().toISOString(),
   badge:badgeTouched===true?look.badge:(prior?.badge||""),sourceAvatar:(old?.avatar||"🌟"),frame:look.frame,
   cardColor:look.cardColor||"",nameFont:look.nameFont};
  try{
   if(newLegacy)w.localStorage.setItem(lk,JSON.stringify(newLegacy));
   w.localStorage.setItem(dk,JSON.stringify(newDecor));
   if(heroImage!==null){if(heroImage)w.localStorage.setItem(heroKey(id),heroImage);else w.localStorage.removeItem(heroKey(id))}
   if(identity()?.id!==id||!approved())throw Error("Guardian or learner selection changed");
   w.dispatchEvent(new CustomEvent("khaemenes-elementary-universal-look-updated",{detail:{learnerId:id}}));
   return true;
  }catch{
   try{restore(lk,oldL);restore(dk,oldD);restore(heroKey(id),oldH)}catch{}
   return false;
  }
 },
 refresh(){w.KhaemenesElementaryProfileEnhancement?.refresh?.();applyHero()}
});
if(core.register(adapter)){w.KhaemenesElementaryLookAdapter=adapter;adapter.refresh()}
window.addEventListener("khaemenes-family-changed",()=>adapter.refresh());
})();
