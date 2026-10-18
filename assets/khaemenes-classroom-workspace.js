/*
 * Khaemenes Academy Classroom Workspace v1.0.0
 * Shared-device educator classroom support for constrained connectivity.
 *
 * Uses the Academy Family Registry as the canonical learner identity store,
 * but classroom metadata is kept separately so family and classroom UI remain distinct.
 */
(function attachKhaemenesClassroomWorkspace(global){
"use strict";
const VERSION="1.0.0";
const STORE_KEY="khaemenes_classroom_workspaces_v1";
const ACTIVE_KEY="khaemenes_active_classroom_v1";
const FORMAT="khaemenes-classroom-export-v1";

const clean=(value,max=180)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
const read=(key,fallback=null)=>{try{const raw=global.localStorage?.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
const write=(key,value)=>{try{global.localStorage?.setItem(key,JSON.stringify(value));return true}catch{return false}};
const now=()=>new Date().toISOString();

function R(){return global.KhaemenesFamilyRegistry||null}
function C(){return global.KhaemenesLearningContinuation||null}
function store(){
  const value=read(STORE_KEY,{version:1,classrooms:{},updatedAt:null});
  return value&&value.version===1&&value.classrooms&&typeof value.classrooms==="object"
    ?value:{version:1,classrooms:{},updatedAt:null};
}
function saveStore(value){
  value.updatedAt=now();
  return write(STORE_KEY,value);
}
function activeClassroomId(){return read(ACTIVE_KEY,null)}
function classroomMeta(classroomId=activeClassroomId()){return classroomId?store().classrooms[classroomId]||null:null}
function list(){
  const s=store();
  return Object.values(s.classrooms).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
}
function createClassroom({name="Classroom",educatorName="Teacher / Educator"}={}){
  const registry=R();if(!registry)throw new Error("academy-registry-unavailable");
  const created=registry.createFamily({displayName:clean(name,80)||"Classroom",adultName:clean(educatorName,80)||"Teacher / Educator",adultRole:"educator"});
  const s=store();
  s.classrooms[created.familyId]={
    format:"khaemenes-classroom-workspace-v1",
    classroomId:created.familyId,
    familyId:created.familyId,
    educatorAdultId:created.adultId,
    name:clean(name,80)||"Classroom",
    createdAt:now(),
    updatedAt:now()
  };
  saveStore(s);write(ACTIVE_KEY,created.familyId);
  registry.setActive({familyId:created.familyId,adultId:created.adultId});
  global.dispatchEvent(new CustomEvent("khaemenes-classroom-changed",{detail:{classroomId:created.familyId}}));
  return get(created.familyId);
}
function get(classroomId=activeClassroomId()){
  const registry=R(),meta=classroomMeta(classroomId);if(!registry||!meta)return null;
  const family=registry.getFamily(meta.familyId);if(!family)return null;
  return Object.freeze({...meta,family,educator:family.adults.find(a=>a.adultId===meta.educatorAdultId)||null,learners:family.learners.filter(l=>!l.selfDirectedAdult)});
}
function setActiveClassroom(classroomId){
  const registry=R(),room=get(classroomId);if(!registry||!room)throw new Error("classroom-not-found");
  write(ACTIVE_KEY,classroomId);
  registry.setActive({familyId:room.familyId,adultId:room.educatorAdultId});
  global.dispatchEvent(new CustomEvent("khaemenes-classroom-changed",{detail:{classroomId}}));
  return room;
}
function addLearner({classroomId=activeClassroomId(),nickname,grade}={}){
  const registry=R(),room=get(classroomId);if(!registry||!room)throw new Error("classroom-not-found");
  const normalized=registry.normalizeGrade?.(grade);if(!normalized)throw new Error("invalid-grade");
  const stage=registry.stageForGrade?.(normalized);if(!stage)throw new Error("invalid-stage");
  const learner=registry.registerLearner({familyId:room.familyId,nickname:clean(nickname,40)||"Learner",stage,grade:normalized});
  registry.grantAdultAccess({familyId:room.familyId,adultId:room.educatorAdultId,learnerId:learner.learnerId,permissionPreset:"educator"});
  const s=store();if(s.classrooms[classroomId]){s.classrooms[classroomId].updatedAt=now();saveStore(s)}
  registry.setActive({familyId:room.familyId,adultId:room.educatorAdultId,learnerId:learner.learnerId});
  global.dispatchEvent(new CustomEvent("khaemenes-classroom-roster-changed",{detail:{classroomId,learnerId:learner.learnerId}}));
  return learner;
}
function selectLearner(learnerId,{classroomId=activeClassroomId()}={}){
  const registry=R(),room=get(classroomId);if(!registry||!room)throw new Error("classroom-not-found");
  const learner=room.learners.find(l=>l.learnerId===learnerId);if(!learner)throw new Error("learner-not-in-classroom");
  if(!registry.canAdult?.(room.educatorAdultId,learnerId,"learner.view"))throw new Error("educator-access-denied");
  registry.setActive({familyId:room.familyId,adultId:room.educatorAdultId,learnerId});
  return learner;
}
function learnerSummary(learnerId,{classroomId=activeClassroomId()}={}){
  const room=get(classroomId);if(!room)return null;
  const learner=room.learners.find(l=>l.learnerId===learnerId);if(!learner)return null;
  const registry=R();
  if(!registry.canAdult?.(room.educatorAdultId,learnerId,"progress.view"))return Object.freeze({learnerId,visible:false});
  const snapshots=C()?.readLearner?.(learnerId)||[],summary=C()?.summarize?.(learnerId)||null;
  return Object.freeze({
    learnerId,
    visible:true,
    nickname:learner.nickname||"Learner",
    stage:learner.stage,
    grade:learner.grade,
    destination:registry.learnerDestination?.(learner)||null,
    courses:snapshots.length,
    needsAttention:summary?.needsFamilyAction||0,
    corrections:summary?.corrections||0,
    masteryRequired:summary?.masteryRequired||0,
    assessments:summary?.assessments||0,
    complete:summary?.complete||0,
    updatedAt:summary?.updatedAt||null,
    snapshots:snapshots.slice(0,12).map(s=>({
      courseId:s.courseId,courseTitle:s.courseTitle||s.courseId,status:s.status,
      nextTitle:s.nextTitle||s.summary||"",nextHref:s.nextHref||"",
      progress:s.progress?.percent??null,best:s.mastery?.best??null,
      threshold:s.mastery?.threshold??80,mastered:s.mastery?.mastered===true,
      needsAction:s.family?.needsAction===true,actionSummary:s.family?.summary||s.family?.label||"",
      stale:s.stale===true,updatedAt:s.updatedAt||null
    }))
  });
}
function classSummary(classroomId=activeClassroomId()){
  const room=get(classroomId);if(!room)return null;
  const learners=room.learners.map(l=>learnerSummary(l.learnerId,{classroomId})).filter(Boolean);
  return Object.freeze({
    classroomId,
    name:room.name,
    learnerCount:learners.length,
    needsAttention:learners.reduce((n,l)=>n+(l.needsAttention||0)+(l.corrections||0)+(l.masteryRequired||0),0),
    assessments:learners.reduce((n,l)=>n+(l.assessments||0),0),
    completedCourses:learners.reduce((n,l)=>n+(l.complete||0),0),
    learners
  });
}
function exportClassroom(classroomId=activeClassroomId()){
  const room=get(classroomId);if(!room)throw new Error("classroom-not-found");
  const registry=R(),continuation=C();
  const familyExport=registry.exportFamily(room.familyId);
  return {
    format:FORMAT,
    version:1,
    exportedAt:now(),
    classroom:{classroomId:room.classroomId,name:room.name},
    educator:{displayName:room.educator?.displayName||"Teacher / Educator",role:"educator"},
    familyExport,
    continuation:room.learners.map(l=>({learnerId:l.learnerId,snapshots:continuation?.readLearner?.(l.learnerId)||[]})),
    note:"Portable classroom roster and continuation backup. It does not claim cloud synchronization and does not contain assessment answer keys."
  };
}
function importClassroom(bundle){
  if(!bundle||bundle.format!==FORMAT||!bundle.familyExport)throw new Error("invalid-classroom-backup");
  const classroom=createClassroom({name:clean(bundle.classroom?.name,80)||"Imported Classroom",educatorName:clean(bundle.educator?.displayName,80)||"Teacher / Educator"});
  const registry=R(),room=get(classroom.classroomId),oldLearners=Array.isArray(bundle.familyExport.learners)?bundle.familyExport.learners:[];
  for(const source of oldLearners){
    if(source?.selfDirectedAdult)continue;
    const learner=registry.registerLearner({
      familyId:room.familyId,
      nickname:clean(source?.nickname,40)||"Learner",
      stage:source?.stage,
      grade:source?.grade,
      ageBand:source?.ageBand||"",
      interests:Array.isArray(source?.interests)?source.interests:[],
      existingLearnerId:clean(source?.learnerId,120)||null
    });
    registry.grantAdultAccess({familyId:room.familyId,adultId:room.educatorAdultId,learnerId:learner.learnerId,permissionPreset:"educator"});
  }
  const continuation=C();
  if(continuation){
    for(const item of Array.isArray(bundle.continuation)?bundle.continuation:[]){
      for(const snapshot of Array.isArray(item?.snapshots)?item.snapshots:[]){
        try{continuation.publish({...snapshot,learnerId:item.learnerId})}catch{}
      }
    }
  }
  setActiveClassroom(room.classroomId);
  global.dispatchEvent(new CustomEvent("khaemenes-classroom-imported",{detail:{classroomId:room.classroomId}}));
  return get(room.classroomId);
}


function sameAcademyOrigin(url){
  const host=String(url?.hostname||"").toLowerCase();
  return host==="vervenveda.com"||host==="www.vervenveda.com";
}
function printableUnitFromSnapshot(snapshot){
  if(!snapshot||snapshot.stale===true)return null;
  if(snapshot.status==="assessment")return null;
  const raw=String(snapshot.nextHref||"").trim();
  if(!raw)return null;
  let url;
  try{url=new URL(raw,global.location?.href||"https://vervenveda.com/")}catch{return null}
  if(!sameAcademyOrigin(url))return null;
  const path=url.pathname;
  if(!/\/Khaemenes_(?:Preschool|KinderGarden|Elementary|Middle|High)\.github\.io\//i.test(path))return null;
  if(/\/(?:assessments?|quiz(?:zes)?|tests?|exam(?:s)?|answer[-_ ]?keys?|gradebook|records?|certificates?)\//i.test(path))return null;
  const unitMatch=path.match(/\/(unit|week)[-_]?(0?[1-9]|[12]\d|3[0-6])(?:\/|\.|-|_)/i);
  if(!unitMatch)return null;
  const unitNumber=String(Number(unitMatch[2])).padStart(2,"0");
  return Object.freeze({
    courseId:snapshot.courseId,
    courseTitle:snapshot.courseTitle||snapshot.courseId,
    unitType:unitMatch[1].toLowerCase(),
    unitNumber,
    label:(unitMatch[1].toLowerCase()==="week"?"Week ":"Unit ")+unitNumber,
    href:url.href,
    status:snapshot.status,
    masteryBest:snapshot.mastery?.best??null,
    masteryThreshold:snapshot.mastery?.threshold??80,
    unlocked:true,
    bulkDownload:false,
    includesAssessment:false
  });
}
function unitPrintables(learnerId,{classroomId=activeClassroomId()}={}){
  const room=get(classroomId);if(!room)return[];
  const learner=room.learners.find(l=>l.learnerId===learnerId);if(!learner)return[];
  const registry=R();
  if(!registry.canAdult?.(room.educatorAdultId,learnerId,"progress.view"))return[];
  return (C()?.readLearner?.(learnerId)||[])
    .map(printableUnitFromSnapshot)
    .filter(Boolean)
    .sort((a,b)=>String(a.courseTitle).localeCompare(String(b.courseTitle)));
}
function printablePolicy(){
  return Object.freeze({
    bulkCurriculumDownload:false,
    arbitraryUrlInput:false,
    currentUnlockedUnitOnly:true,
    assessmentDownloads:false,
    answerKeyDownloads:false,
    futureUnitDownloads:false,
    gradebookDownloads:false,
    classroomBackupContainsCurriculum:false,
    masteryThreshold:80,
    note:"The course engine controls nextHref. Printable access follows that already-unlocked continuation route and never advances the learner."
  });
}

global.KhaemenesClassroomWorkspace=Object.freeze({
  version:VERSION,
  format:FORMAT,
  storageKey:STORE_KEY,
  activeKey:ACTIVE_KEY,
  list,get,createClassroom,setActiveClassroom,addLearner,selectLearner,
  learnerSummary,classSummary,exportClassroom,importClassroom,
  printableUnitFromSnapshot,unitPrintables,printablePolicy,
  policy:Object.freeze({
    sharedDevice:true,
    multipleLearners:true,
    learnerRecordsSeparated:true,
    browserLocal:true,
    cloudSyncClaimed:false,
    storesAssessmentAnswers:false,
    awardsMastery:false,
    changesScores:false,
    changesPlacement:false,
    unlocksCurriculum:false,
    bulkCurriculumDownload:false,
    arbitraryCurriculumUrlDownload:false,
    currentUnlockedUnitPrintableOnly:true
  })
});
})(window);
