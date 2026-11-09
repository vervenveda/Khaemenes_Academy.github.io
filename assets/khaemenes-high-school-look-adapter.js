/* High School 09–12 adapter candidate for universal Picture & Colors.
 * NOT activated on grade pages until acceptance gates pass.
 * Never writes family registry, course records, student passwords or parent keys.
 */
(()=>{"use strict";
const g=window,d=document,core=g.KhaemenesUniversalProfileLookEditor;
if(g.KhaemenesHighUniversalLookAdapter||!core?.register)return;
const grade=String(d.body?.dataset.grade||"").padStart(2,"0");
if(!["09","10","11","12"].includes(grade))return;
const E=id=>encodeURIComponent(id),ks={
 badge:id=>"khaemenes.grade09.profile.badge:"+E(id),
 photo:id=>"khaemenes.grade09.profile.photo:"+E(id),
 sections:id=>"khaemenes.grade09.profile.background.sections.v1:"+E(id),
 page:id=>"khaemenes.grade09.profile.background:"+E(id),
 hero:id=>"khaemenes.grade09.profile.yearbook.hero:"+E(id)
};
const read=k=>{try{return g.localStorage.getItem(k)}catch{return null}};
const restore=(k,v)=>{if(v===null)g.localStorage.removeItem(k);else g.localStorage.setItem(k,v)};
const identity=()=>{try{
 const id=JSON.parse(read("khaemenes_active_learner_v1")||"null");
 if(typeof id!=="string"||!id)return null;
 const data=JSON.parse(read("khaemenes_family_registry_v1")||"null");
 const learner=data?.learners?.[id];
 if(learner?.learnerId!==id||learner.stage!=="high"||String(Number(learner.grade)).padStart(2,"0")!==grade)return null;
 const linked=g.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 if(linked&&linked!==id)return null;
 return {id,displayName:learner.displayName||learner.name||"Student"};
}catch{return null}};
const settings=id=>{try{const v=JSON.parse(read(ks.sections(id))||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}catch{return {}}};
const adapter=Object.freeze({
 showDisplayName:false,
 allowYearbook:true,
 getIdentity:identity,
 readLook(id){
  if(identity()?.id!==id)return {};
  const data=settings(id),setting=data.identity||{};
  const design=g.KhaemenesGrade09Design;
  const selected=design?.read?.()?.avatarShape;
  const frame=selected==="hectagon"?"oval":selected==="soft-square"?"square":selected;
  const custom=setting.mode==="custom"&&/^#[0-9a-f]{6}$/i.test(setting.color||"")?setting.color:"";
  let badge=read(ks.badge(id));
  const options=["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"];
  if(!options.includes(badge))badge="★";
  return {displayName:"",badge,frame:frame||"circle",background:"parchment",cardColor:custom,nameFont:["academy","friendly","classic","modern","handwriting"].includes(setting.nameFont)?setting.nameFont:"academy"};
 },
 readHeroImage(id){if(identity()?.id!==id)return "";const hero=read(ks.hero(id));return typeof hero==="string"&&hero.length<180000&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(hero)?hero:""},
 readPhoto(id){
  if(identity()?.id!==id)return "";
  const current=read(ks.photo(id));if(current)return current;
  // Historical Grade 10–12 appearance records are read, never mutated here.
  if(grade!=="09"){
   try{const prior=JSON.parse(read("khaemenes.grade"+grade.replace(/^0/,"")+".profile.appearance:"+E(id))||"{}");return typeof prior.photo==="string"?prior.photo:""}catch{}
  }
  return "";
 },
 commit({id,look,photo,heroImage=null}){
  if(identity()?.id!==id||!g.KhaemenesGrade09Design?.read||!g.KhaemenesGrade09Design?.write)return false;
  const current=g.KhaemenesGrade09Design.read();
  if(!current||typeof current!=="object")return false;
  const supported=["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"];
  if(!supported.includes(look?.frame)||!["academy","friendly","classic","modern","handwriting"].includes(look?.nameFont))return false;
  if(heroImage!==null&&!(heroImage===""||(typeof heroImage==="string"&&heroImage.length<180000&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(heroImage))))return false;
  const legacyKey=grade!=="09"?"khaemenes.grade"+String(Number(grade))+".profile.appearance:"+E(id):null;
  const old={};for(const key of [ks.badge(id),ks.photo(id),ks.hero(id),ks.sections(id),...(legacyKey?[legacyKey]:[])])old[key]=read(key);
  const nextSections=settings(id);
  const identitySetting=nextSections.identity&&typeof nextSections.identity==="object"?nextSections.identity:{};
  const newSections={...nextSections,identity:{...identitySetting,mode:look.cardColor?"custom":(identitySetting.mode==="page"?"page":"default"),color:look.cardColor||"#f4f0e7",nameFont:look.nameFont}};
  try{
   g.localStorage.setItem(ks.badge(id),look.badge);
   g.localStorage.setItem(ks.sections(id),JSON.stringify(newSections));
   if(photo!==null){
    if(photo===""){
     g.localStorage.removeItem(ks.photo(id));
     // Clear only the legacy picture field, preserving other appearance fields.
     if(legacyKey&&old[legacyKey]){const oldLegacy=JSON.parse(old[legacyKey]);if(oldLegacy&&typeof oldLegacy==="object"&&Object.hasOwn(oldLegacy,"photo")){const newer={...oldLegacy};delete newer.photo;g.localStorage.setItem(legacyKey,JSON.stringify(newer))}}
    }else g.localStorage.setItem(ks.photo(id),photo)
   }
   if(heroImage!==null){if(heroImage)g.localStorage.setItem(ks.hero(id),heroImage);else g.localStorage.removeItem(ks.hero(id))}
   if(identity()?.id!==id)throw Error("Identity switched");
   if(g.KhaemenesGrade09Design.write({...current,avatarShape:look.frame})!==true)throw Error("Frame write failed");
   g.dispatchEvent(new Event("khaemenes-grade09-design-changed"));
   g.dispatchEvent(new Event("khaemenes-high-profile-appearance-changed"));
   return true;
  }catch{
   try{for(const [k,v] of Object.entries(old))restore(k,v)}catch{}
   try{g.KhaemenesGrade09Design.write(current)}catch{}
   return false;
  }
 },
 refresh(){const id=identity()?.id,hero=id?read(ks.hero(id)):"";const target=d.querySelector(".grade09-local-masthead .hero");if(target){if(hero&&hero.length<180000&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(hero)){target.style.setProperty("background-image",`linear-gradient(rgba(36,48,56,.70),rgba(36,48,56,.78)),url("${hero}")`,"important");target.style.setProperty("background-size","cover","important");target.style.setProperty("background-position","center","important")}else target.style.removeProperty("background-image")};g.dispatchEvent(new Event("khaemenes-high-profile-appearance-changed"))}
});
if(!core.register(adapter))return;
g.KhaemenesHighUniversalLookAdapter=adapter;
 adapter.refresh();
})();
