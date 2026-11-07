/* Kindergarten universal Picture & Colors adapter — isolated source.
 * Grown-up consent on every commit; native learner visual record + garden
 * preferences and local backups preserved. No assessment/grade writes.
 */
(()=>{"use strict";
const w=window,d=document,core=w.KhaemenesUniversalProfileLookEditor;
if(w.KhaemenesKindergartenUniversalLookAdapter||!core?.register)return;
if(d.body?.dataset.profileStage!=="kindergarten")return;
const KEY="khaemenes_kindergarten_visual_profile_v1:",SCHEMA="khaemenes.kindergarten-visual.v1";
const COLORS=new Set(["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"]);
const BADGES=new Set(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
const FRAMES=new Set(["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"]);
const FONTS=new Set(["academy","friendly","classic","modern","handwriting"]);
const k=id=>KEY+encodeURIComponent(id);
const raw=key=>{try{return w.localStorage.getItem(key)}catch{return null}};
function identity(){try{
 const r=w.KhaemenesFamilyRegistry,a=r?.getLearner?.(),active=r?.activeIds?.()?.learnerId;
 if(!a?.learnerId||String(a.stage).toLowerCase()!=="kindergarten"||active&&active!==a.learnerId)return null;
 return {id:a.learnerId,displayName:a.nickname||"Kindergarten learner"};
}catch{return null}}
const adultConfirmed=()=>d.getElementById("adultConfirm")?.checked===true;
function record(id){try{
 const value=JSON.parse(raw(k(id))||"{}");
 if(!value||typeof value!=="object"||Array.isArray(value)||value.learnerId&&value.learnerId!==id||value.schema&&value.schema!==SCHEMA)return null;
 return value;
}catch{return null}}
const adapter=Object.freeze({
 showDisplayName:false,maxPhotoChars:180000,getIdentity:identity,
 readLook(id){
  if(identity()?.id!==id)return {};
  const old=record(id),extras=old?.universalLook||{};
  return {displayName:"",background:"parchment",badge:BADGES.has(extras.badge)?extras.badge:"★",
   frame:FRAMES.has(extras.frame)?extras.frame:"circle",
   cardColor:COLORS.has(extras.cardColor)?extras.cardColor:"",
   nameFont:FONTS.has(extras.nameFont)?extras.nameFont:"academy"};
 },
 readPhoto(id){if(identity()?.id!==id)return "";const photo=record(id)?.photo;return typeof photo==="string"&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(photo)&&photo.length<180000?photo:""},
 commit({id,look,photo,badgeTouched}){
  if(identity()?.id!==id||!adultConfirmed())return false;
  if(!FRAMES.has(look?.frame)||!BADGES.has(look?.badge)||!FONTS.has(look?.nameFont)||look.cardColor&&!COLORS.has(look.cardColor))return false;
  const prior=raw(k(id)),old=record(id);
  if(old===null||photo!==null&&photo!==""&&(!/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(photo)||photo.length>=180000))return false;
  const next={...old,schema:SCHEMA,learnerId:id,updatedAt:new Date().toISOString(),
    photo:photo===null?(old.photo||""):photo,
    universalLook:{badge:badgeTouched===true?look.badge:(old.universalLook?.badge||""),
      frame:look.frame,cardColor:look.cardColor||"",nameFont:look.nameFont}};
  try{
   w.localStorage.setItem(k(id),JSON.stringify(next));
   if(identity()?.id!==id||!adultConfirmed())throw Error("Learner or guardian context changed");
   w.dispatchEvent(new CustomEvent("khaemenes-kindergarten-universal-look-updated",{detail:{learnerId:id}}));
   return true;
  }catch{
   try{if(prior===null)w.localStorage.removeItem(k(id));else w.localStorage.setItem(k(id),prior)}catch{}
   return false;
  }
 },
 refresh(){w.KhaemenesKindergartenUniversalLookEntry?.refresh?.()}
});
if(core.register(adapter))w.KhaemenesKindergartenUniversalLookAdapter=adapter;
})();
