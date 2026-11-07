/* Preschool universal Picture & Colors adapter.
 * Presentation identity only; guardian consent mandatory on EVERY commit.
 * Native Pre-K visual schema, older avatars/themes, photo backup and handoff are preserved.
 */
(()=>{"use strict";
const w=window,d=document,core=w.KhaemenesUniversalProfileLookEditor;
if(w.KhaemenesPreschoolUniversalLookAdapter||!core?.register||d.body?.dataset.profileStage!=="preschool")return;
const VISUAL="khaemenes_preschool_visual_profile_v1:",VERSION="khaemenes.prek-visual.v1";
const COLS=new Set(["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"]);
const BADGES=new Set(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
const FRAMES=new Set(["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"]);
const key=id=>VISUAL+encodeURIComponent(id);
const raw=k=>{try{return w.localStorage.getItem(k)}catch{return null}};
const identity=()=>{try{
 if(w.location.origin!=="https://vervenveda.com")return null;
 const r=w.KhaemenesFamilyRegistry,l=r?.getLearner?.();
 if(!l?.learnerId||String(l.stage).toLowerCase()!=="preschool")return null;
 const selected=r?.activeIds?.()?.learnerId;if(selected&&selected!==l.learnerId)return null;
 return {id:l.learnerId,displayName:l.nickname||"Pre-K learner"};
}catch{return null}};
const approval=()=>d.getElementById("adultConfirm")?.checked===true;
function record(id){
 try{const x=JSON.parse(raw(key(id))||"{}");if(!x||typeof x!=="object"||Array.isArray(x)||x.learnerId&&x.learnerId!==id||x.schema&&x.schema!==VERSION)return null;return x}catch{return null}
}
function extras(id){const e=record(id)?.universalLook;return e&&typeof e==="object"&&!Array.isArray(e)?e:{}}
const adapter=Object.freeze({
 showDisplayName:false,
 maxPhotoChars:180000,
 getIdentity:identity,
 readLook(id){
  if(identity()?.id!==id)return {};
  const old=record(id),x=extras(id);
  const legacyFrame={diamond:"rhombus",hexagon:"octagon"};
  return {displayName:"",background:"parchment",badge:BADGES.has(x.badge)?x.badge:"★",frame:FRAMES.has(x.frame)?x.frame:(legacyFrame[old?.frame]||old?.frame||"square"),cardColor:COLS.has(x.cardColor)?x.cardColor:""};
 },
 readPhoto(id){if(identity()?.id!==id)return "";const p=record(id)?.photo;return typeof p==="string"&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(p)&&p.length<180000?p:""},
 commit({id,look,photo}){
  if(identity()?.id!==id||!approval())return false;
  if(!FRAMES.has(look?.frame)||!BADGES.has(look?.badge)||look.cardColor&&!COLS.has(look.cardColor))return false;
  const before=raw(key(id)),old=record(id);
  if(old===null)return false;
  if(photo!==null&&photo!==""&&(!/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(photo)||photo.length>=180000))return false;
  // Carry the stage's original frame as a harmless fallback. Rich frame belongs
  // to the nested universalLook namespace and is included in existing exports.
  const legacyFrames={rhombus:"diamond",octagon:"hexagon"};
  const legacy=legacyFrames[look.frame]||(new Set(["circle","oval","square"]).has(look.frame)?look.frame:(old.frame||"square"));
  const updated={...old,schema:VERSION,learnerId:id,frame:legacy,
   photo:photo===null?(old.photo||""):photo,updatedAt:new Date().toISOString(),
   universalLook:{badge:look.badge==="★"&&!old.universalLook?.badge?"":look.badge,frame:look.frame,cardColor:look.cardColor||""}};
  try{
   w.localStorage.setItem(key(id),JSON.stringify(updated));
   if(identity()?.id!==id||!approval())throw Error("Profile selection or adult approval changed");
   w.dispatchEvent(new CustomEvent("khaemenes-prek-universal-look-updated",{detail:{learnerId:id}}));
   return true;
  }catch{
   try{if(before===null)w.localStorage.removeItem(key(id));else w.localStorage.setItem(key(id),before)}catch{}
   return false;
  }
 },
 refresh(){w.KhaemenesPreschoolUniversalLookEntry?.refresh?.()}
});
if(!core.register(adapter))return;
w.KhaemenesPreschoolUniversalLookAdapter=adapter;
})();
