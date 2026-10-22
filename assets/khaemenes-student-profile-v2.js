/*
  Khaemenes Academy Student Profile Contract v2.0
  Learner-authored preferences + evidence index only.
  This module never awards grades, changes placement, unlocks lessons, or authenticates a person.
*/
(function attachKhaemenesStudentProfileV2(global){
  "use strict";

  const VERSION="2.0.0";
  const SCHEMA="khaemenes.student-profile.v2";
  const STORE_KEY="khaemenes_student_profile_v2";
  const ACTIVE_KEY="khaemenes_active_learner_v1";
  const FAMILY_KEY="khaemenes_family_registry_v1";
  const MAX_EVIDENCE=120;

  const allowed=Object.freeze({
    theme:new Set(["academy","parchment","forest","midnight","ocean","plum"]),
    textSize:new Set(["small","standard","large","extra-large"]),
    lineSpacing:new Set(["standard","comfortable","wide"]),
    readingWidth:new Set(["narrow","comfortable","wide"]),
    contrast:new Set(["standard","high"]),
    density:new Set(["comfortable","compact"]),
    collaboration:new Set(["independent","guided","collaborative","flexible"]),
    evidenceStatus:new Set(["developing","demonstrated","mastered"]),
    reviewState:new Set(["student","system","family","teacher","pending"])
  });

  const now=()=>new Date().toISOString();
  const clean=(value,max=240)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
  const cleanArray=(value,maxItems=12,maxChars=100)=>{
    const list=Array.isArray(value)?value:String(value??"").split(/[\n,]+/);
    const seen=new Set();
    return list.map(item=>clean(item,maxChars)).filter(item=>item&&!seen.has(item)&&seen.add(item)).slice(0,maxItems);
  };
  const readJSON=(key,fallback=null)=>{try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const writeJSON=(key,value)=>{try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function activeLearner(){
    const R=registry();
    const direct=R?.getLearner?.()||null;
    if(direct?.learnerId)return direct;
    try{
      const id=readJSON(ACTIVE_KEY,null),family=readJSON(FAMILY_KEY,null);
      if(typeof id!=="string")return null;
      if(Array.isArray(family?.learners))return family.learners.find(item=>item?.learnerId===id)||null;
      return family?.learners?.[id]?.learnerId===id?family.learners[id]:null;
    }catch{return null}
  }
  function learnerId(value){
    if(typeof value==="string"&&value.trim())return clean(value,120);
    if(value?.learnerId)return clean(value.learnerId,120);
    return clean(activeLearner()?.learnerId||"",120);
  }

  function emptyRecord(id){
    return {
      schema:SCHEMA,version:2,learnerId:id,
      compass:{weekOf:"",weeklyGoal:"",whyMatters:"",strategy:"",helpNeeded:"",reflection:"",nextChange:""},
      learningMap:{strengths:[],learningPreferences:[],supports:[],focusReset:[],interests:[],growthSkills:[],collaboration:"flexible"},
      workspace:{theme:"academy",textSize:"standard",lineSpacing:"comfortable",readingWidth:"comfortable",contrast:"standard",reducedMotion:false,density:"comfortable",preferredLanguage:"",tts:false,simplifiedDashboard:false},
      evidence:[],
      updatedAt:null
    };
  }
  function normalizeCompass(value={}){
    return {
      weekOf:clean(value.weekOf,32),
      weeklyGoal:clean(value.weeklyGoal,280),
      whyMatters:clean(value.whyMatters,280),
      strategy:clean(value.strategy,280),
      helpNeeded:clean(value.helpNeeded,280),
      reflection:clean(value.reflection,400),
      nextChange:clean(value.nextChange,280)
    };
  }
  function normalizeLearningMap(value={}){
    return {
      strengths:cleanArray(value.strengths),
      learningPreferences:cleanArray(value.learningPreferences),
      supports:cleanArray(value.supports),
      focusReset:cleanArray(value.focusReset),
      interests:cleanArray(value.interests),
      growthSkills:cleanArray(value.growthSkills),
      collaboration:allowed.collaboration.has(value.collaboration)?value.collaboration:"flexible"
    };
  }
  function normalizeWorkspace(value={}){
    return {
      theme:allowed.theme.has(value.theme)?value.theme:"academy",
      textSize:allowed.textSize.has(value.textSize)?value.textSize:"standard",
      lineSpacing:allowed.lineSpacing.has(value.lineSpacing)?value.lineSpacing:"comfortable",
      readingWidth:allowed.readingWidth.has(value.readingWidth)?value.readingWidth:"comfortable",
      contrast:allowed.contrast.has(value.contrast)?value.contrast:"standard",
      reducedMotion:Boolean(value.reducedMotion),
      density:allowed.density.has(value.density)?value.density:"comfortable",
      preferredLanguage:clean(value.preferredLanguage,40),
      tts:Boolean(value.tts),
      simplifiedDashboard:Boolean(value.simplifiedDashboard)
    };
  }
  function evidenceId(value={}){
    const raw=clean(value.id||[value.courseId,value.category,value.title].filter(Boolean).join("-"),140).toLowerCase();
    return raw.replace(/[^a-z0-9._:-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,140);
  }
  function normalizeEvidence(value={}){
    const id=evidenceId(value);
    if(!id)return null;
    return {
      id,
      title:clean(value.title||"Learning Evidence",140),
      category:clean(value.category||"Academic Evidence",80),
      courseId:clean(value.courseId,100),
      school:clean(value.school,100),
      stage:clean(value.stage,40),
      status:allowed.evidenceStatus.has(value.status)?value.status:"developing",
      sourceType:clean(value.sourceType||"learner",40),
      sourceLabel:clean(value.sourceLabel||"Student work",120),
      evidenceHref:/^https?:\/\//i.test(String(value.evidenceHref||""))?String(value.evidenceHref).slice(0,500):"",
      reviewState:allowed.reviewState.has(value.reviewState)?value.reviewState:"student",
      summary:clean(value.summary,320),
      updatedAt:clean(value.updatedAt,40)||now()
    };
  }
  function normalizeRecord(value,id){
    const base=emptyRecord(id);
    const evidence=Array.isArray(value?.evidence)?value.evidence.map(normalizeEvidence).filter(Boolean).slice(0,MAX_EVIDENCE):[];
    return {
      ...base,
      compass:normalizeCompass(value?.compass),
      learningMap:normalizeLearningMap(value?.learningMap),
      workspace:normalizeWorkspace(value?.workspace),
      evidence,
      updatedAt:clean(value?.updatedAt,40)||null
    };
  }
  function readStore(){
    const value=readJSON(STORE_KEY,null);
    return value&&typeof value==="object"&&!Array.isArray(value)&&value.learners&&typeof value.learners==="object"
      ? value
      : {schema:SCHEMA,version:2,learners:{},updatedAt:null};
  }
  function writeStore(store,id){
    store.schema=SCHEMA;store.version=2;store.updatedAt=now();
    const ok=writeJSON(STORE_KEY,store);
    if(ok&&typeof global.dispatchEvent==="function"&&typeof CustomEvent==="function"){
      global.dispatchEvent(new CustomEvent("khaemenes-student-profile-changed",{detail:{learnerId:id,updatedAt:store.updatedAt}}));
    }
    return ok;
  }
  function read(target){
    const id=learnerId(target);if(!id)return null;
    const store=readStore();
    return normalizeRecord(store.learners?.[id],id);
  }
  function saveRecord(record,target){
    const id=learnerId(target||record?.learnerId);if(!id)return false;
    const currentActive=activeLearner();
    if(!target&&currentActive?.learnerId!==id)return false;
    const store=readStore();
    const normalized=normalizeRecord(record,id);normalized.updatedAt=now();
    store.learners={...(store.learners||{}),[id]:normalized};
    return writeStore(store,id);
  }
  function updateSection(section,patch,target){
    if(!["compass","learningMap","workspace"].includes(section))return false;
    const id=learnerId(target);if(!id)return false;
    const record=read(id)||emptyRecord(id);
    const merged={...(record[section]||{}),...(patch&&typeof patch==="object"?patch:{})};
    record[section]=section==="compass"?normalizeCompass(merged):section==="learningMap"?normalizeLearningMap(merged):normalizeWorkspace(merged);
    return saveRecord(record,id);
  }
  function upsertEvidence(item,target){
    const id=learnerId(target);if(!id)return false;
    const normalized=normalizeEvidence(item);if(!normalized)return false;
    const record=read(id)||emptyRecord(id);
    const existing=record.evidence.find(x=>x.id===normalized.id)||null;
    if(existing){
      const fields=["title","category","courseId","school","stage","status","sourceType","sourceLabel","evidenceHref","reviewState","summary"];
      const unchanged=fields.every(key=>String(existing[key]??"")===String(normalized[key]??""));
      if(unchanged)return true;
    }
    const prior=record.evidence.filter(x=>x.id!==normalized.id);
    record.evidence=[normalized,...prior].slice(0,MAX_EVIDENCE);
    return saveRecord(record,id);
  }
  function removeEvidence(idValue,target){
    const id=learnerId(target);if(!id)return false;
    const record=read(id)||emptyRecord(id),evidenceIdValue=evidenceId({id:idValue});
    record.evidence=record.evidence.filter(item=>item.id!==evidenceIdValue);
    return saveRecord(record,id);
  }
  function classifyContinuations(snapshots=[]){
    const list=Array.isArray(snapshots)?snapshots.filter(Boolean):[];
    const review=[],today=[],next=[];
    for(const item of list){
      const status=String(item.status||"continue").toLowerCase();
      if(item.stale||["corrections","mastery","paused"].includes(status))review.push(item);
      else if(["assessment","complete"].includes(status))next.push(item);
      else today.push(item);
    }
    return {today:today.slice(0,6),review:review.slice(0,6),next:next.slice(0,6)};
  }
  function exportPayload(target){
    const id=learnerId(target),record=id?read(id):null,learner=id?(registry()?.getLearner?.(id)||activeLearner()):null;
    if(!id||!record)return null;
    return {
      format:"khaemenes-student-profile-export-v2",
      exportedAt:now(),
      learner:{learnerId:id,nickname:clean(learner?.nickname||learner?.displayName||"Learner",80),grade:clean(learner?.grade,20),stage:clean(learner?.stage,40)},
      profile:record,
      authority:{identity:"Khaemenes Academy Family Registry",preferences:"learner-owned local profile",academicRecords:"source course engines remain authoritative"},
      privacy:{localBrowser:true,advertiserAccess:false,containsCredentials:false}
    };
  }
  function clearPreferences(target){
    const id=learnerId(target);if(!id)return false;
    const record=read(id)||emptyRecord(id);
    record.compass=emptyRecord(id).compass;
    record.learningMap=emptyRecord(id).learningMap;
    record.workspace=emptyRecord(id).workspace;
    return saveRecord(record,id);
  }
  function privacy(){
    return Object.freeze({
      localBrowser:true,
      identityAuthority:"Khaemenes Academy Family Registry",
      academicAuthority:"Course and assessment engines",
      storesCredentials:false,
      storesPasswords:false,
      changesPlacement:false,
      awardsMastery:false,
      bypassesPrerequisites:false
    });
  }

  global.KhaemenesStudentProfileV2=Object.freeze({
    version:VERSION,schema:SCHEMA,storageKey:STORE_KEY,maxEvidence:MAX_EVIDENCE,
    activeLearner,read,updateCompass:(patch,target)=>updateSection("compass",patch,target),
    updateLearningMap:(patch,target)=>updateSection("learningMap",patch,target),
    updateWorkspace:(patch,target)=>updateSection("workspace",patch,target),
    upsertEvidence,removeEvidence,classifyContinuations,exportPayload,clearPreferences,privacy
  });
})(window);
