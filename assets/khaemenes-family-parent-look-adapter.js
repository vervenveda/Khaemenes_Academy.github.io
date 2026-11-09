/* Parent adapter for shared Picture & Colors editor.
 * Browser-local personalization only, no server auth or academic record writes.
 * Single owner: existing Family Parent Hero; adapter persists to its existing keys.
 */
(()=>{"use strict";
const g=window;
if(g.KhaemenesFamilyParentLookStudio?.version==="universal-1.0")return;
const core=g.KhaemenesUniversalProfileLookEditor;
if(!core?.register)return;
const key=id=>"khaemenes.parent.profile.appearance.v1:"+encodeURIComponent(id);
const photoKey=id=>"khaemenes.parent.profile.photo.v1:"+encodeURIComponent(id);
const read=k=>{try{return g.localStorage.getItem(k)}catch{return null}};
const FRAME_IDS=new Set(["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"]);
const BADGE_IDS=new Set(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
const COLOR_IDS=new Set(["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"]);
const BACKGROUNDS=new Set(["charcoal","forest","navy","burgundy","gold","parchment"]);
const NAME_FONTS=new Set(["academy","friendly","classic","modern","handwriting"]);
const photoValid=x=>x===""||(typeof x==="string"&&x.length<400000&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(x));
function cleanLook(look){
 if(!look||typeof look!=="object"||Array.isArray(look))return null;
 if(!FRAME_IDS.has(look.frame)||!BADGE_IDS.has(look.badge)||!BACKGROUNDS.has(look.background)||
    !(look.cardColor===""||COLOR_IDS.has(look.cardColor))||!NAME_FONTS.has(look.nameFont)||
    typeof look.displayName!=="string"||look.displayName.length>70)return null;
 return {displayName:look.displayName.trim().slice(0,70),background:look.background,
         frame:look.frame,badge:look.badge,cardColor:look.cardColor,nameFont:look.nameFont};
}
const identity=()=>{try{
 const r=g.KhaemenesFamilyRegistry,selected=r?.activeIds?.()?.adultId,adult=r?.getAdult?.();
 if(!adult||!selected||adult.adultId!==selected)return null;
 return {id:selected,displayName:adult.displayName||"Parent / Guardian"};
}catch{return null}};
const adapter=Object.freeze({
 getIdentity:identity,
 readLook(id){if(identity()?.id!==id)return {};try{return JSON.parse(read(key(id))||"{}")||{}}catch{return {}}},
 readPhoto(id){return identity()?.id===id?read(photoKey(id)):""},
 commit({id,look,photo}){
  if(identity()?.id!==id)return false;
  const safe=cleanLook(look);
  if(!safe||!(photo===null||photoValid(photo)))return false;
  const a=key(id),p=photoKey(id),oldA=read(a),oldP=read(p),next=JSON.stringify(safe);
  const rollback=()=>{
   try{
    if(oldA===null)g.localStorage.removeItem(a);else g.localStorage.setItem(a,oldA);
    if(oldP===null)g.localStorage.removeItem(p);else g.localStorage.setItem(p,oldP);
   }catch{}
  };
  try{
   g.localStorage.setItem(a,next);
   if(photo!==null){
    if(photo==="")g.localStorage.removeItem(p);
    else g.localStorage.setItem(p,photo);
   }
   if(identity()?.id!==id||read(a)!==next||(photo!==null&&read(p)!==(photo||null))){
    rollback();return false;
   }
   return true;
  }catch{rollback();return false}
 },
 refresh(){g.KhaemenesFamilyParentHero?.refresh?.()}
});
if(!core.register(adapter))return;
g.KhaemenesFamilyParentLookStudio=Object.freeze({version:"universal-1.0",open:mode=>core.open(mode)});
})();
