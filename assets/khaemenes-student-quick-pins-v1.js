(function attachKhaemenesStudentQuickPinsV1(global){
"use strict";

const VERSION="1.0.0";
const KEY="khaemenes_student_quick_pins_v1";
const LEGACY_G9="khaemenes-grade09-quick-pins-v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const FAMILY_KEY="khaemenes_family_registry_v1";
const RESOURCES=Object.freeze({
  "prealgebra-games":Object.freeze({id:"prealgebra-games",title:"Pre-Algebra Games",subtitle:"Mathematics practice",category:"Game",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/#games",mark:"∑"}),
  "academy-arcade":Object.freeze({id:"academy-arcade",title:"Verve N Veda Arcade",subtitle:"Logic · vocabulary · strategy",category:"Game",href:"https://vervenveda.com/arcade.github.io/",mark:"◇"}),
  "scientific-calculator":Object.freeze({id:"scientific-calculator",title:"Scientific Calculator",subtitle:"Mathematics tool",category:"Tool",href:"https://vervenveda.com/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/",mark:"ƒ"}),
  "the-verifier":Object.freeze({id:"the-verifier",title:"The Verifier",subtitle:"Research and source checking",category:"Resource",href:"https://vervenveda.com/theverifier.github.io/",mark:"✓"}),
  "citation-studio":Object.freeze({id:"citation-studio",title:"Evidence Citation Studio",subtitle:"Research evidence tool",category:"Resource",href:"https://vervenveda.com/proresource_hub.github.io/Protools/Evidence_Citation_Studio/",mark:"§"}),
  "electives-hall":Object.freeze({id:"electives-hall",title:"Electives Hall",subtitle:"Explore current and future electives",category:"Elective",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/electives/",mark:"✦"})
});
function cleanIds(value){
  if(!Array.isArray(value))return [];
  const seen=new Set();
  return value.filter(id=>typeof id==="string"&&RESOURCES[id]&&!seen.has(id)&&seen.add(id));
}
function activeLearner(){
  const direct=global.KhaemenesFamilyRegistry?.getLearner?.()||global.KhaemenesStudentProfileV2?.activeLearner?.()||null;
  if(direct?.learnerId)return direct;
  try{
    const id=JSON.parse(global.localStorage.getItem(ACTIVE_KEY)||"null");
    const family=JSON.parse(global.localStorage.getItem(FAMILY_KEY)||"null");
    if(typeof id!=="string")return null;
    return Array.isArray(family?.learners)
      ? family.learners.find(item=>item?.learnerId===id)||null
      : family?.learners?.[id]||null;
  }catch{return null}
}
function readStore(){
  try{
    const value=JSON.parse(global.localStorage.getItem(KEY)||"null");
    return value&&value.version===1&&value.learners&&typeof value.learners==="object"
      ? value
      : {version:1,learners:{},updatedAt:null};
  }catch{return {version:1,learners:{},updatedAt:null}}
}
function emit(id){
  try{global.dispatchEvent(new CustomEvent("khaemenes-student-quick-pins-changed",{detail:{learnerId:id}}))}catch{}
}
function writeStore(store,id){
  try{
    store.version=1;store.updatedAt=new Date().toISOString();
    global.localStorage.setItem(KEY,JSON.stringify(store));emit(id);return true;
  }catch{return false}
}
function legacyKey(id){return LEGACY_G9+":learner:"+encodeURIComponent(id)}
function migrateLegacy(id){
  if(!id)return [];
  const store=readStore(),current=cleanIds(store.learners?.[id]);
  let legacy=[];
  try{legacy=cleanIds(JSON.parse(global.localStorage.getItem(legacyKey(id))||"[]"))}catch{}
  const merged=cleanIds([...current,...legacy]);
  if(merged.join("|")!==current.join("|")){
    store.learners={...(store.learners||{}),[id]:merged};
    writeStore(store,id);
  }
  return merged;
}
function ids(target){
  const active=activeLearner(),id=typeof target==="string"?target:target?.learnerId||active?.learnerId;
  if(!id)return [];
  return migrateLegacy(id);
}
function list(target){return ids(target).map(id=>RESOURCES[id]).filter(Boolean)}
function isPinned(id,target){return ids(target).includes(id)}
function setPinned(id,on=true,target){
  if(!RESOURCES[id])return false;
  const active=activeLearner(),targetId=typeof target==="string"?target:target?.learnerId||active?.learnerId;
  if(!active?.learnerId||String(active.learnerId)!==String(targetId))return false;
  const store=readStore(),current=cleanIds(store.learners?.[targetId]||migrateLegacy(targetId));
  store.learners=store.learners&&typeof store.learners==="object"?store.learners:{};
  store.learners[targetId]=cleanIds(on?[...current,id]:current.filter(x=>x!==id));
  return writeStore(store,targetId);
}
function toggle(id,target){const next=!isPinned(id,target);return setPinned(id,next,target)?next:null}
function clear(target){
  const active=activeLearner(),targetId=typeof target==="string"?target:target?.learnerId||active?.learnerId;
  if(!active?.learnerId||String(active.learnerId)!==String(targetId))return false;
  const store=readStore();store.learners=store.learners&&typeof store.learners==="object"?store.learners:{};
  store.learners[targetId]=[];return writeStore(store,targetId);
}
global.KhaemenesStudentQuickPinsV1=Object.freeze({
  version:VERSION,storageKey:KEY,resources:RESOURCES,activeLearner,list,isPinned,setPinned,toggle,clear,
  policy:Object.freeze({learnerOwned:true,presentationOnly:true,changesEnrollment:false,changesGrades:false,changesMastery:false,changesPlacement:false})
});
})(window);
