/*
  Khaemenes Academy Student Profile Contract v3 storage / v2-compatible API
  Learner-authored preferences + evidence index only.
  This module never awards grades, changes placement, unlocks lessons, or authenticates a person.
*/
(function attachKhaemenesStudentProfileV2(global){
  "use strict";

  const VERSION="3.0.0";
  const SCHEMA="khaemenes.student-profile.v3";
  const LEGACY_SCHEMA="khaemenes.student-profile.v2";
  const LEGACY_STORE_KEY="khaemenes_student_profile_v2";
  const STORE_PREFIX="khaemenes.student-profile.v3:";
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
      schema:SCHEMA,version:3,learnerId:id,revision:0,
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
    const authority=value?.provenance?.authority==="course"||value?.sourceType==="system"||value?.sourceType==="course"||value?.reviewState==="system"?"course":"learner";
    return {
      id,
      title:clean(value.title||"Learning Evidence",140),
      category:clean(value.category||"Academic Evidence",80),
      courseId:clean(value.courseId,100),
      school:clean(value.school,100),
      stage:clean(value.stage,40),
      status:allowed.evidenceStatus.has(value.status)?value.status:"developing",
      sourceType:authority==="course"?"course":"learner",
      sourceLabel:clean(value.sourceLabel||(authority==="course"?"Course-published evidence":"Learner-added evidence"),120),
      evidenceHref:/^https?:\/\//i.test(String(value.evidenceHref||""))?String(value.evidenceHref).slice(0,500):"",
      reviewState:authority==="course"?"system":"student",
      summary:clean(value.summary,320),
      provenance:{
        authority,
        sourceId:clean(value?.provenance?.sourceId||(authority==="course"?value.courseId||id:id),140),
        sourceUpdatedAt:clean(value?.provenance?.sourceUpdatedAt||value.updatedAt,40),
        lastSeenAt:clean(value?.provenance?.lastSeenAt,40)||now(),
        archived:Boolean(value?.provenance?.archived),
        archivedAt:clean(value?.provenance?.archivedAt,40)
      },
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
      revision:Number.isInteger(Number(value?.revision))?Math.max(0,Number(value.revision)):0,
      updatedAt:clean(value?.updatedAt,40)||null
    };
  }
  function recordKey(id){return STORE_PREFIX+encodeURIComponent(id)}
  function backupKey(id){return recordKey(id)+":backup"}
  function parseEnvelope(raw,id){
    if(!raw)return null;
    try{
      const value=JSON.parse(raw);
      if(!value||value.schema!==SCHEMA||Number(value.version)!==3||String(value.learnerId||"")!==String(id)||!value.record)return null;
      return {
        schema:SCHEMA,version:3,learnerId:id,
        revision:Math.max(0,Number(value.revision)||0),
        updatedAt:clean(value.updatedAt,40)||null,
        record:normalizeRecord({...value.record,revision:Math.max(0,Number(value.revision)||0)},id)
      };
    }catch{return null}
  }
  function legacyRecord(id){
    const value=readJSON(LEGACY_STORE_KEY,null);
    if(!value||typeof value!=="object"||Array.isArray(value)||!value.learners||typeof value.learners!=="object")return null;
    const prior=value.learners[id];
    return prior?normalizeRecord(prior,id):null;
  }
  function readEnvelope(id,{migrate=true}={}){
    const primary=parseEnvelope(global.localStorage.getItem(recordKey(id)),id);
    if(primary)return primary;
    const backup=parseEnvelope(global.localStorage.getItem(backupKey(id)),id);
    if(backup)return backup;
    const legacy=legacyRecord(id);
    if(!legacy)return null;
    const envelope={schema:SCHEMA,version:3,learnerId:id,revision:1,updatedAt:legacy.updatedAt||now(),record:{...legacy,revision:1}};
    const active=activeLearner();
    if(migrate&&active?.learnerId&&String(active.learnerId)===String(id)){
      try{global.localStorage.setItem(recordKey(id),JSON.stringify(envelope))}catch{}
    }
    return envelope;
  }
  function emit(id,envelope){
    if(typeof global.dispatchEvent==="function"&&typeof CustomEvent==="function"){
      global.dispatchEvent(new CustomEvent("khaemenes-student-profile-changed",{detail:{learnerId:id,revision:envelope.revision,updatedAt:envelope.updatedAt}}));
    }
  }
  function writeEnvelope(id,record,expectedRevision){
    const current=readEnvelope(id,{migrate:false});
    const currentRevision=current?.revision||0;
    if(Number.isInteger(expectedRevision)&&currentRevision!==expectedRevision)return {ok:false,reason:"revision-conflict",currentRevision};
    const normalized=normalizeRecord(record,id);
    const revision=currentRevision+1,updatedAt=now();
    normalized.revision=revision;normalized.updatedAt=updatedAt;
    const envelope={schema:SCHEMA,version:3,learnerId:id,revision,updatedAt,record:normalized};
    try{
      if(current)global.localStorage.setItem(backupKey(id),JSON.stringify(current));
      global.localStorage.setItem(recordKey(id),JSON.stringify(envelope));
      emit(id,envelope);
      return {ok:true,envelope};
    }catch{return {ok:false,reason:"storage-failure",currentRevision}}
  }
  function read(target){
    const id=learnerId(target);if(!id)return null;
    const envelope=readEnvelope(id);
    return envelope?normalizeRecord({...envelope.record,revision:envelope.revision},id):emptyRecord(id);
  }
  function saveRecord(record,target){
    const id=learnerId(target||record?.learnerId);if(!id)return false;
    const currentActive=activeLearner();
    if(!currentActive?.learnerId||String(currentActive.learnerId)!==String(id))return false;
    const expected=Number.isInteger(Number(record?.revision))?Number(record.revision):undefined;
    return writeEnvelope(id,record,expected).ok;
  }
  function updateSection(section,patch,target){
    if(!["compass","learningMap","workspace"].includes(section))return false;
    const id=learnerId(target);if(!id)return false;
    const record=read(id)||emptyRecord(id);
    const merged={...(record[section]||{}),...(patch&&typeof patch==="object"?patch:{})};
    record[section]=section==="compass"?normalizeCompass(merged):section==="learningMap"?normalizeLearningMap(merged):normalizeWorkspace(merged);
    return saveRecord(record,id);
  }
  function evidenceSame(a,b){
    const scalar=["title","category","courseId","school","stage","status","sourceType","sourceLabel","evidenceHref","reviewState","summary"];
    if(!scalar.every(key=>String(a?.[key]??"")===String(b?.[key]??"")))return false;
    return String(a?.provenance?.authority||"")===String(b?.provenance?.authority||"")
      &&String(a?.provenance?.sourceId||"")===String(b?.provenance?.sourceId||"")
      &&String(a?.provenance?.sourceUpdatedAt||"")===String(b?.provenance?.sourceUpdatedAt||"")
      &&Boolean(a?.provenance?.archived)===Boolean(b?.provenance?.archived);
  }
  function addLearnerEvidence(item,target){
    const id=learnerId(target);if(!id)return false;
    const nowStamp=now();
    const normalized=normalizeEvidence({
      ...item,status:"developing",sourceType:"learner",sourceLabel:"Learner-added evidence",reviewState:"student",
      provenance:{authority:"learner",sourceId:evidenceId(item),sourceUpdatedAt:nowStamp,lastSeenAt:nowStamp,archived:false,archivedAt:""},
      updatedAt:nowStamp
    });
    if(!normalized)return false;
    const record=read(id)||emptyRecord(id);
    const prior=record.evidence.filter(x=>x.id!==normalized.id);
    record.evidence=[normalized,...prior].slice(0,MAX_EVIDENCE);
    return saveRecord(record,id);
  }
  function syncCourseEvidence(items,target){
    const id=learnerId(target);if(!id||!Array.isArray(items))return false;
    const record=read(id)||emptyRecord(id),stamp=now(),incoming=[],seen=new Set();
    for(const item of items){
      const courseId=clean(item?.courseId,100);if(!courseId)continue;
      const sourceId=clean(item?.sourceId||courseId,140);
      const normalized=normalizeEvidence({
        ...item,
        id:item.id||("course:"+sourceId),
        sourceType:"course",
        sourceLabel:clean(item.sourceLabel||"Course continuation record",120),
        reviewState:"system",
        provenance:{authority:"course",sourceId,sourceUpdatedAt:clean(item.updatedAt,40),lastSeenAt:stamp,archived:false,archivedAt:""}
      });
      if(!normalized)continue;
      const existing=record.evidence.find(x=>x.id===normalized.id&&x?.provenance?.authority==="course")||null;
      if(existing&&evidenceSame(existing,normalized)){
        normalized.provenance.lastSeenAt=existing.provenance?.lastSeenAt||stamp;
        normalized.updatedAt=existing.updatedAt||normalized.updatedAt;
      }
      incoming.push(normalized);seen.add(normalized.id);
    }
    let changed=false;
    const preserved=record.evidence.filter(item=>{
      if(item?.provenance?.authority!=="course")return true;
      if(seen.has(item.id))return false;
      if(!item.provenance?.archived){
        item={...item,provenance:{...item.provenance,archived:true,archivedAt:stamp}};
        incoming.push(item);changed=true;
      }else incoming.push(item);
      return false;
    });
    for(const item of incoming){
      const existing=record.evidence.find(x=>x.id===item.id);
      if(!existing||!evidenceSame(existing,item))changed=true;
    }
    if(!changed)return true;
    record.evidence=[...incoming,...preserved].slice(0,MAX_EVIDENCE);
    return saveRecord(record,id);
  }
  function removeEvidence(idValue,target){
    const id=learnerId(target);if(!id)return false;
    const record=read(id)||emptyRecord(id),evidenceIdValue=evidenceId({id:idValue});
    const existing=record.evidence.find(item=>item.id===evidenceIdValue);
    if(existing?.provenance?.authority!=="learner")return false;
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
      format:"khaemenes-student-profile-export-v3",
      exportedAt:now(),
      learner:{learnerId:id,nickname:clean(learner?.nickname||learner?.displayName||"Learner",80),grade:clean(learner?.grade,20),stage:clean(learner?.stage,40)},
      profile:record,
      authority:{identity:"Khaemenes Academy Family Registry",preferences:"learner-owned local profile",academicRecords:"source course engines remain authoritative"},
      privacy:{localBrowser:true,advertiserAccess:false,containsCredentials:false}
    };
  }
  function importSource(payload){
    if(!payload||typeof payload!=="object")return null;
    const format=clean(payload.format,80);
    if(!["khaemenes-student-profile-export-v3","khaemenes-student-profile-bundle-v3","khaemenes-student-profile-export-v2"].includes(format))return null;
    const learner=payload.learner&&typeof payload.learner==="object"?payload.learner:{};
    const profile=payload.profile&&typeof payload.profile==="object"?payload.profile:null;
    if(!profile)return null;
    return {format,learner,profile,quickPins:Array.isArray(payload.quickPins)?payload.quickPins:[]};
  }
  function importedLearnerEvidence(profile){
    const list=Array.isArray(profile?.evidence)?profile.evidence:[];
    return list.filter(item=>item?.sourceType==="learner"||item?.provenance?.authority==="learner").map(item=>{
      const stamp=now();
      return normalizeEvidence({
        ...item,status:"developing",sourceType:"learner",sourceLabel:"Learner-added evidence",reviewState:"student",
        provenance:{authority:"learner",sourceId:evidenceId(item),sourceUpdatedAt:clean(item?.updatedAt,40),lastSeenAt:stamp,archived:false,archivedAt:""},
        updatedAt:clean(item?.updatedAt,40)||stamp
      });
    }).filter(Boolean).slice(0,MAX_EVIDENCE);
  }
  function previewImport(payload,target){
    const id=learnerId(target),source=importSource(payload),active=activeLearner();
    if(!id||!active?.learnerId||String(active.learnerId)!==String(id))return {ok:false,reason:"active-learner-required"};
    if(!source)return {ok:false,reason:"unsupported-profile-file"};
    const sourceId=clean(source.learner?.learnerId||source.profile?.learnerId,120);
    if(!sourceId||sourceId!==id)return {ok:false,reason:"learner-mismatch",expectedLearnerId:id,sourceLearnerId:sourceId||null};
    const imported=normalizeRecord(source.profile,id),learnerEvidence=importedLearnerEvidence(source.profile);
    return {
      ok:true,format:source.format,learnerId:id,
      learner:{nickname:clean(source.learner?.nickname||active.nickname||active.displayName||"Learner",80),grade:clean(source.learner?.grade,20),stage:clean(source.learner?.stage,40)},
      counts:{learnerEvidence:learnerEvidence.length,courseEvidenceIgnored:Math.max(0,(Array.isArray(source.profile?.evidence)?source.profile.evidence.length:0)-learnerEvidence.length),quickPins:source.quickPins.length},
      quickPins:source.quickPins.map(item=>clean(typeof item==="string"?item:item?.id,100)).filter(Boolean),
      profile:{compass:imported.compass,learningMap:imported.learningMap,workspace:imported.workspace}
    };
  }
  function mergeCompass(current,incoming){
    const out={...current};
    for(const key of Object.keys(out)){const value=incoming?.[key];if(String(value||"").trim())out[key]=value}
    return normalizeCompass(out);
  }
  function mergeLearningMap(current,incoming){
    const union=(a,b)=>cleanArray([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]);
    return normalizeLearningMap({
      strengths:union(current?.strengths,incoming?.strengths),
      learningPreferences:union(current?.learningPreferences,incoming?.learningPreferences),
      supports:union(current?.supports,incoming?.supports),
      focusReset:union(current?.focusReset,incoming?.focusReset),
      interests:union(current?.interests,incoming?.interests),
      growthSkills:union(current?.growthSkills,incoming?.growthSkills),
      collaboration:incoming?.collaboration&&incoming.collaboration!=="flexible"?incoming.collaboration:current?.collaboration
    });
  }
  function restoreProfile(payload,{mode="merge",target}={}){
    const id=learnerId(target),preview=previewImport(payload,id);
    if(!preview.ok)return preview;
    if(!["merge","replace"].includes(mode))return {ok:false,reason:"invalid-restore-mode"};
    const source=importSource(payload),imported=normalizeRecord(source.profile,id),current=read(id)||emptyRecord(id);
    const currentCourse=current.evidence.filter(item=>item?.provenance?.authority==="course");
    const currentLearner=current.evidence.filter(item=>item?.provenance?.authority!=="course");
    const incomingLearner=importedLearnerEvidence(source.profile);
    let learnerEvidence;
    if(mode==="replace")learnerEvidence=incomingLearner;
    else{
      const byId=new Map(currentLearner.map(item=>[item.id,item]));
      for(const item of incomingLearner)byId.set(item.id,item);
      learnerEvidence=[...byId.values()];
    }
    const next={
      ...current,
      compass:mode==="replace"?normalizeCompass(imported.compass):mergeCompass(current.compass,imported.compass),
      learningMap:mode==="replace"?normalizeLearningMap(imported.learningMap):mergeLearningMap(current.learningMap,imported.learningMap),
      workspace:normalizeWorkspace(imported.workspace),
      evidence:[...currentCourse,...learnerEvidence].slice(0,MAX_EVIDENCE),
      revision:current.revision
    };
    const ok=saveRecord(next,id);
    return {ok,reason:ok?null:"save-failed",mode,learnerId:id,importedEvidence:incomingLearner.length,ignoredCourseEvidence:preview.counts.courseEvidenceIgnored,quickPins:preview.quickPins};
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
    version:VERSION,schema:SCHEMA,storageKey:LEGACY_STORE_KEY,storagePrefix:STORE_PREFIX,legacyStorageKey:LEGACY_STORE_KEY,maxEvidence:MAX_EVIDENCE,
    activeLearner,read,updateCompass:(patch,target)=>updateSection("compass",patch,target),
    updateLearningMap:(patch,target)=>updateSection("learningMap",patch,target),
    updateWorkspace:(patch,target)=>updateSection("workspace",patch,target),
    addLearnerEvidence,syncCourseEvidence,upsertEvidence:addLearnerEvidence,removeEvidence,classifyContinuations,exportPayload,previewImport,restoreProfile,clearPreferences,privacy
  });
})(window);
