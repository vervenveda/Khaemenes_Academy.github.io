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
  if(!look||typeof look!=="object"||Array.isArray(look))return false;
  const a=key(id),p=photoKey(id);
  const oldA=read(a),oldP=read(p);
  try{
   g.localStorage.setItem(a,JSON.stringify(look));
   if(photo!==null){
    if(photo==="")g.localStorage.removeItem(p);
    else g.localStorage.setItem(p,photo);
   }
   return true;
  }catch{
   try{if(oldA===null)g.localStorage.removeItem(a);else g.localStorage.setItem(a,oldA);
    if(oldP===null)g.localStorage.removeItem(p);else g.localStorage.setItem(p,oldP);
   }catch{}
   return false;
  }
 },
 refresh(){g.KhaemenesFamilyParentHero?.refresh?.()}
});
if(!core.register(adapter))return;
g.KhaemenesFamilyParentLookStudio=Object.freeze({version:"universal-1.0",open:mode=>core.open(mode)});
})();
