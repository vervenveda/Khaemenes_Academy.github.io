/* Kindergarten family daily-plan — browser-local, decorative completion only.
 * Never writes formal lesson completion, grades, mastery receipts or placement.
 * Local adult selection is NOT authenticated parent authority.
 */
(function(g){"use strict";
 if(g.KhaemenesKinderFamilyDailyPlan)return;
 const PREFIX="khaemenes.kindergarten.family.daily.v1:";
 const ACTIVITIES=Object.freeze([
  Object.freeze({id:"read",label:"Read together",icon:"📚",hint:"Share a picture book or story"}),
  Object.freeze({id:"numbers",label:"Number garden",icon:"🔢",hint:"Count and sort familiar objects"}),
  Object.freeze({id:"create",label:"Make something",icon:"🎨",hint:"Draw, build or make art"}),
  Object.freeze({id:"move",label:"Move & play",icon:"🌿",hint:"Stretch, dance or play outside"}),
  Object.freeze({id:"explore",label:"Little discovery",icon:"🔍",hint:"Notice something interesting"}),
  Object.freeze({id:"kindness",label:"Kindness moment",icon:"💛",hint:"Practice helping or sharing"}),
  Object.freeze({id:"music",label:"Music time",icon:"🎵",hint:"Sing, listen or make rhythms"}),
  Object.freeze({id:"quiet",label:"Quiet reset",icon:"🌙",hint:"Rest, breathe or reflect"})
 ]);
 const allow=new Set(ACTIVITIES.map(a=>a.id));
 const DEFAULT=Object.freeze(["read","numbers","create","move","kindness"]);
 const safeId=id=>typeof id==="string"&&id.length>=1&&id.length<=180&&/^[a-zA-Z0-9_:-]+$/.test(id);
 const registry=()=>g.KhaemenesFamilyRegistry;
 const selected=()=>registry()?.getLearner?.()||null;
 function eligible(id){
  const l=selected();return Boolean(safeId(id)&&l?.learnerId===id&&l.stage==="kindergarten");
 }
 function adultAllowed(id){
  const r=registry(),active=r?.activeIds?.()||{},l=selected(),a=r?.getAdult?.(active.adultId);
  return Boolean(eligible(id)&&a?.adultId===active.adultId&&
   Array.isArray(a.familyIds)&&a.familyIds.includes(l.familyId)&&
   r?.canAdult?.(a.adultId,id,"education.manage")===true);
 }
 const key=id=>PREFIX+encodeURIComponent(id);
 const read=id=>{try{return JSON.parse(g.localStorage.getItem(key(id))||"null")}catch{return null}};
 const dateKey=()=>{const t=new Date();return [String(t.getFullYear()).padStart(4,"0"),String(t.getMonth()+1).padStart(2,"0"),String(t.getDate()).padStart(2,"0")].join("-")};
 function normalize(v,id){
  const items=Array.isArray(v?.activities)?[...new Set(v.activities.filter(x=>allow.has(x)))].slice(0,5):[...DEFAULT];
  const done={};
  if(v?.done&&typeof v.done==="object"&&!Array.isArray(v.done)){
   for(const [day,arr] of Object.entries(v.done).slice(-14)){
    if(/^\d{4}-\d{2}-\d{2}$/.test(day)&&Array.isArray(arr))
      done[day]=[...new Set(arr.filter(x=>items.includes(x)))].slice(0,5);
   }
  }
  return {schema:"khaemenes-kinder-family-daily-v1",learnerId:id,activities:items.length?items:[...DEFAULT],done};
 }
 function state(id){
  if(!eligible(id))return null;
  const raw=read(id);
  // No attempt to upgrade another learner's or invalid record.
  return normalize(raw?.learnerId===id&&raw?.schema==="khaemenes-kinder-family-daily-v1"?raw:null,id);
 }
 function persist(id,record){
  if(!eligible(id))return false;
  const raw=JSON.stringify(record);
  try{
   g.localStorage.setItem(key(id),raw);
   if(g.localStorage.getItem(key(id))!==raw)return false;
   g.dispatchEvent?.(new CustomEvent("khaemenes-kinder-daily-plan-changed",{detail:{learnerId:id}}));
   return true;
  }catch{return false}
 }
 function configure(id,ids){
  if(!adultAllowed(id)||!Array.isArray(ids)||ids.length<1||ids.length>5||
     new Set(ids).size!==ids.length||ids.some(x=>!allow.has(x)))return false;
  const rec=state(id);if(!rec)return false;
  rec.activities=ids.slice();
  for(const day of Object.keys(rec.done))rec.done[day]=rec.done[day].filter(x=>ids.includes(x));
  return persist(id,rec);
 }
 function checkIn(id,activity,complete=true,day=dateKey()){
  if(!eligible(id)||!/^\d{4}-\d{2}-\d{2}$/.test(day)||day!==dateKey())return false;
  const rec=state(id);if(!rec?.activities.includes(activity)||typeof complete!=="boolean")return false;
  const values=new Set(rec.done[day]||[]);
  if(complete)values.add(activity);else values.delete(activity);
  rec.done[day]=[...values];
  return persist(id,rec);
 }
 function today(id){
  const rec=state(id);if(!rec)return null;
  const day=dateKey();
  return {learnerId:id,day,activities:rec.activities.map(activityId=>({
   ...ACTIVITIES.find(item=>item.id===activityId),
   checked:(rec.done[day]||[]).includes(activityId)
  }))};
 }
 g.KhaemenesKinderFamilyDailyPlan=Object.freeze({
  version:"1.0",ACTIVITIES,DEFAULT,state,today,configure,checkIn,adultAllowed
 });
})(window);
