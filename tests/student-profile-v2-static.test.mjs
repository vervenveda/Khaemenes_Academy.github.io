import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const contract=fs.readFileSync(new URL("../assets/khaemenes-student-profile-v2.js",import.meta.url),"utf8");
const ui=fs.readFileSync(new URL("../assets/khaemenes-student-profile-ui-v2.js",import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../assets/khaemenes-student-profile-v2.css",import.meta.url),"utf8");
const portal=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");

test("profile v2 assets are wired into the canonical Student Portal",()=>{
  assert.match(portal,/khaemenes-student-profile-v2\.css/);
  assert.match(portal,/khaemenes-student-profile-v2\.js/);
  assert.match(portal,/khaemenes-student-profile-ui-v2\.js/);
  assert.match(portal,/id="profileStudio"/);
});

test("profile studio exposes all five learner-profile upgrades",()=>{
  for(const token of ["Learning Compass","Today · Next · Review","My Learning Map","Evidence Passport","My Workspace Controls","Privacy Boundary"]){
    assert.ok(ui.includes(token),`missing Profile Studio feature: ${token}`);
  }
  assert.match(ui,/student-added item can never award mastery/i);
  assert.match(css,/data-student-profile-theme="midnight"/);
  assert.match(css,/data-student-profile-contrast="high"/);
  assert.match(css,/data-student-profile-reduced-motion="true"/);
});

test("profile contract preserves academic authority boundaries",()=>{
  assert.match(contract,/changesPlacement:false/);
  assert.match(contract,/awardsMastery:false/);
  assert.match(contract,/bypassesPrerequisites:false/);
  assert.match(contract,/Course and assessment engines/);
});

function runtime(){
  const map=new Map();
  const localStorage={
    getItem:key=>map.has(String(key))?map.get(String(key)):null,
    setItem:(key,value)=>map.set(String(key),String(value)),
    removeItem:key=>map.delete(String(key))
  };
  let active={learnerId:"learner-a",nickname:"A",grade:"09",stage:"high"};
  class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail}}
  const listeners=[];
  const window={
    localStorage,
    KhaemenesFamilyRegistry:{
      getLearner:id=>id?(id===active.learnerId?active:null):active
    },
    dispatchEvent:event=>listeners.push(event),
    addEventListener:()=>{},
    CustomEvent
  };
  const context=vm.createContext({window,CustomEvent,console,Date,JSON,String,Boolean,Number,Array,Set,Object,RegExp});
  vm.runInContext(contract,context,{filename:"khaemenes-student-profile-v2.js"});
  return {api:window.KhaemenesStudentProfileV2,map,setActive:value=>{active=value},listeners};
}

test("learner-authored profile data stays isolated by learnerId",()=>{
  const r=runtime();
  assert.equal(r.api.updateCompass({weeklyGoal:"Finish Unit 1"}),true);
  assert.equal(r.api.read().compass.weeklyGoal,"Finish Unit 1");
  r.setActive({learnerId:"learner-b",nickname:"B",grade:"07",stage:"middle"});
  assert.equal(r.api.read().compass.weeklyGoal,"");
  assert.equal(r.api.updateLearningMap({strengths:["visual reasoning"]}),true);
  assert.deepEqual([...r.api.read().learningMap.strengths],["visual reasoning"]);
  r.setActive({learnerId:"learner-a",nickname:"A",grade:"09",stage:"high"});
  assert.equal(r.api.read().compass.weeklyGoal,"Finish Unit 1");
  assert.deepEqual([...r.api.read().learningMap.strengths],[]);
});

test("system evidence sync is idempotent and learner evidence remains labeled",()=>{
  const r=runtime();
  const item={id:"continuation:math-9",title:"Mathematics 9",courseId:"math-9",status:"demonstrated",sourceType:"system",sourceLabel:"Course continuation record",reviewState:"system",summary:"Unit 1 evidence"};
  assert.equal(r.api.upsertEvidence(item),true);
  const before=r.map.get(r.api.storageKey);
  assert.equal(r.api.upsertEvidence(item),true);
  assert.equal(r.map.get(r.api.storageKey),before);
  assert.equal(r.api.read().evidence[0].sourceType,"system");
  assert.equal(r.api.read().evidence[0].reviewState,"system");
});

test("continuation classifier separates Today Review and Next",()=>{
  const r=runtime();
  const lanes=r.api.classifyContinuations([
    {courseId:"a",status:"continue"},
    {courseId:"b",status:"corrections"},
    {courseId:"c",status:"assessment"},
    {courseId:"d",status:"practice"},
    {courseId:"e",status:"mastery"},
    {courseId:"f",status:"complete"}
  ]);
  assert.deepEqual([...lanes.today].map(x=>x.courseId),["a","d"]);
  assert.deepEqual([...lanes.review].map(x=>x.courseId),["b","e"]);
  assert.deepEqual([...lanes.next].map(x=>x.courseId),["c","f"]);
});

test("export clearly states local profile and source-course authority",()=>{
  const r=runtime();
  const payload=r.api.exportPayload();
  assert.equal(payload.format,"khaemenes-student-profile-export-v2");
  assert.equal(payload.privacy.localBrowser,true);
  assert.equal(payload.authority.identity,"Khaemenes Academy Family Registry");
  assert.match(payload.authority.academicRecords,/source course engines/i);
});
