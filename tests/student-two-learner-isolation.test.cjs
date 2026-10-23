/* Khaemenes Academy: isolated two-learner storage contract regression.
   Run: node tests/student-two-learner-isolation.test.cjs
   No browser profile, production account, or real localStorage is touched. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
class StorageMock {
  constructor(){this.map=new Map()}
  getItem(k){return this.map.has(String(k))?this.map.get(String(k)):null}
  setItem(k,v){this.map.set(String(k),String(v))}
  removeItem(k){this.map.delete(String(k))}
  key(i){return [...this.map.keys()][i]??null}
  get length(){return this.map.size}
}
const storage=new StorageMock();
const events=[];
const document={
  getElementById:()=>({}),
  createElement:()=>({set defer(v){},set referrerPolicy(v){}}),
  head:{append:()=>{}}
};
const context={Storage:StorageMock,localStorage:storage,document,
  location:{origin:"https://vervenveda.com"},
  CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},
  dispatchEvent:e=>events.push(e.type),
  addEventListener:()=>{},
  crypto:require("node:crypto").webcrypto,
  console,Date,JSON,Math,Set,Map,URL,TextEncoder,
};
context.window=context;
vm.createContext(context);
function load(file){
 const source=fs.readFileSync(path.join(__dirname,"..","assets",file),"utf8");
 vm.runInContext(source,context,{filename:file,timeout:3000});
}
load("khaemenes-family-registry.js");
load("khaemenes-learning-continuation.js");
load("khaemenes-student-quick-pins-v1.js");
load("khaemenes-student-profile-v2.js");
const R=context.KhaemenesFamilyRegistry;
const C=context.KhaemenesLearningContinuation;
const Q=context.KhaemenesStudentQuickPinsV1;
const P=context.KhaemenesStudentProfileV2;
function check(condition,message){assert.ok(condition,message);console.log("PASS",message)}
check(Boolean(R&&C&&Q&&P),"four student data modules load");
const family=R.createFamily({displayName:"Isolated Test Family",adultName:"Test Parent"});
const A=R.registerLearner({familyId:family.familyId,nickname:"Learner A",stage:"high",grade:"09"});
const B=R.registerLearner({familyId:family.familyId,nickname:"Learner B",stage:"high",grade:"10"});
check(A.learnerId!==B.learnerId,"distinct learner identities");
R.setActive({familyId:family.familyId,learnerId:A.learnerId});
check(R.getLearner()?.learnerId===A.learnerId,"select learner A");
const resource=Object.keys(Q.resources)[0];
check(Q.setPinned(resource,true,A.learnerId),"A can pin a resource");
check(Q.isPinned(resource,A.learnerId),"A pin is stored");
R.setActive({familyId:family.familyId,learnerId:B.learnerId});
check(R.getLearner()?.learnerId===B.learnerId,"switch to learner B");
check(!Q.isPinned(resource,B.learnerId),"B does not inherit A pin");
check(!Q.setPinned(resource,false,A.learnerId),"B cannot modify A pin");
check(Q.isPinned(resource,A.learnerId),"A pin survives B selection");
check(Q.setPinned(resource,true,B.learnerId),"B can pin independently");
R.setActive({familyId:family.familyId,learnerId:A.learnerId});
check(Q.isPinned(resource,A.learnerId)&&Q.isPinned(resource,B.learnerId),"both pin sets survive switching");
check(R.gradeMeta["09"].stage==="high"&&R.gradeMeta["10"].stage==="high","zero-padded grade registry is consistent");
check(P.privacy().changesPlacement===false&&C.policy.unlocksLessons===false,"profile and continuation modules cannot change mastery or placement");
C.publish({learnerId:A.learnerId,courseId:"geometry",status:"practice",nextTitle:"A practice"});
C.publish({learnerId:B.learnerId,courseId:"geometry",status:"assessment",nextTitle:"B assessment"});
check(C.readCourse(A.learnerId,"geometry")?.status==="practice","A continuation remains separate");
check(C.readCourse(B.learnerId,"geometry")?.status==="assessment","B continuation remains separate");
R.setActive({familyId:family.familyId,learnerId:A.learnerId});
check(P.updateCompass({studyGoal:"Geometry A"},A.learnerId),"A preferences saved");
check(!P.updateCompass({studyGoal:"Wrong learner"},B.learnerId),"A cannot edit B preferences");
R.setActive({familyId:family.familyId,learnerId:B.learnerId});
check(P.updateCompass({studyGoal:"Geometry B"},B.learnerId),"B preferences saved");
check(!P.updateWorkspace({studyGoal:"Wrong learner"},A.learnerId),"B cannot edit A workspace");
check(P.read(A.learnerId)?.learnerId===A.learnerId,"A profile identified correctly");
check(P.read(B.learnerId)?.learnerId===B.learnerId,"B profile identified correctly");
console.log("PASS two-learner isolation smoke test completed in mock storage");
