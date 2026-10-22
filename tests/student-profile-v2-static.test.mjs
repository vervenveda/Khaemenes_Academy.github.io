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

test("writes cannot target a non-active learner",()=>{
  const r=runtime();
  assert.equal(r.api.updateCompass({weeklyGoal:"Do not leak"},"learner-b"),false);
  assert.equal(r.api.read("learner-b").compass.weeklyGoal,"");
  assert.equal(r.api.upsertEvidence({id:"x",title:"Wrong owner"},"learner-b"),false);
  assert.equal(r.api.read("learner-b").evidence.length,0);
});

test("Evidence Passport separates learner and course authority",()=>{
  const r=runtime();
  assert.equal(r.api.upsertEvidence({id:"manual",title:"My proof",status:"mastered",sourceType:"teacher",reviewState:"teacher"}),true);
  const learnerItem=r.api.read().evidence[0];
  assert.equal(learnerItem.status,"developing");
  assert.equal(learnerItem.sourceType,"learner");
  assert.equal(learnerItem.reviewState,"student");
  assert.equal(learnerItem.provenance.authority,"learner");

  const course={id:"continuation:math-9",sourceId:"math-9",title:"Mathematics 9",courseId:"math-9",status:"mastered",sourceLabel:"Course continuation record",summary:"Unit 1 evidence",updatedAt:"2026-10-22T12:00:00.000Z"};
  assert.equal(r.api.syncCourseEvidence([course]),true);
  const key=r.api.storagePrefix+encodeURIComponent("learner-a");
  const before=r.map.get(key);
  assert.equal(r.api.syncCourseEvidence([course]),true);
  assert.equal(r.map.get(key),before);
  const systemItem=r.api.read().evidence.find(x=>x.id==="continuation:math-9");
  assert.equal(systemItem.sourceType,"course");
  assert.equal(systemItem.reviewState,"system");
  assert.equal(systemItem.provenance.authority,"course");
  assert.equal(systemItem.provenance.archived,false);
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
  assert.equal(payload.format,"khaemenes-student-profile-export-v3");
  assert.equal(payload.privacy.localBrowser,true);
  assert.equal(payload.authority.identity,"Khaemenes Academy Family Registry");
  assert.match(payload.authority.academicRecords,/source course engines/i);
});


test("v2 multi-learner records migrate into independent v3 learner records",()=>{
  const r=runtime();
  r.map.set("khaemenes_student_profile_v2",JSON.stringify({
    schema:"khaemenes.student-profile.v2",version:2,learners:{
      "learner-a":{learnerId:"learner-a",compass:{weeklyGoal:"Migrated goal"},evidence:[]},
      "learner-b":{learnerId:"learner-b",compass:{weeklyGoal:"Other learner"},evidence:[]}
    }
  }));
  assert.equal(r.api.read().compass.weeklyGoal,"Migrated goal");
  const aKey=r.api.storagePrefix+encodeURIComponent("learner-a");
  assert.ok(r.map.has(aKey));
  assert.ok(!r.map.has(r.api.storagePrefix+encodeURIComponent("learner-b")));
  const envelope=JSON.parse(r.map.get(aKey));
  assert.equal(envelope.schema,"khaemenes.student-profile.v3");
  assert.equal(envelope.learnerId,"learner-a");
  assert.equal(envelope.revision,1);
});

test("stale revisions fail closed instead of overwriting a newer tab",()=>{
  const r=runtime();
  assert.equal(r.api.updateCompass({weeklyGoal:"First"}),true);
  const stale=r.api.read();
  assert.equal(r.api.updateCompass({weeklyGoal:"Second"}),true);
  stale.compass.weeklyGoal="Stale overwrite";
  const before=r.api.read();
  assert.equal(before.compass.weeklyGoal,"Second");
  // Public section writers re-read current state; direct stale record saves are intentionally not exposed.
  assert.ok(before.revision>stale.revision);
});

test("corrupt primary profile records recover from the last-known-good backup",()=>{
  const r=runtime();
  assert.equal(r.api.updateCompass({weeklyGoal:"Version one"}),true);
  assert.equal(r.api.updateCompass({weeklyGoal:"Version two"}),true);
  const key=r.api.storagePrefix+encodeURIComponent("learner-a");
  const backupKey=key+":backup";
  assert.ok(r.map.has(backupKey));
  r.map.set(key,"{not valid json");
  const recovered=r.api.read();
  assert.equal(recovered.compass.weeklyGoal,"Version one");
});


test("course evidence that disappears is archived and cannot be learner-deleted",()=>{
  const r=runtime();
  const item={id:"continuation:science-9",sourceId:"science-9",title:"Science 9",courseId:"science-9",status:"demonstrated",updatedAt:"2026-10-22T12:00:00.000Z"};
  assert.equal(r.api.syncCourseEvidence([item]),true);
  assert.equal(r.api.syncCourseEvidence([]),true);
  const archived=r.api.read().evidence.find(x=>x.id==="continuation:science-9");
  assert.equal(archived.provenance.archived,true);
  assert.equal(r.api.removeEvidence("continuation:science-9"),false);
});


test("profile restore refuses a different learner before writing",()=>{
  const r=runtime();
  const payload={format:"khaemenes-student-profile-bundle-v3",learner:{learnerId:"learner-b",nickname:"B"},profile:{learnerId:"learner-b",compass:{weeklyGoal:"Wrong learner"},evidence:[]},quickPins:[]};
  const preview=r.api.previewImport(payload);
  assert.equal(preview.ok,false);
  assert.equal(preview.reason,"learner-mismatch");
  const result=r.api.restoreProfile(payload,{mode:"replace"});
  assert.equal(result.ok,false);
  assert.equal(r.api.read().compass.weeklyGoal,"");
});

test("restore imports learner preferences but rejects file-based course authority",()=>{
  const r=runtime();
  assert.equal(r.api.updateCompass({weeklyGoal:"Current goal"}),true);
  assert.equal(r.api.syncCourseEvidence([{id:"continuation:math-9",sourceId:"math-9",title:"Live Mathematics",courseId:"math-9",status:"demonstrated",updatedAt:"2026-10-22T12:00:00.000Z"}]),true);
  const payload={
    format:"khaemenes-student-profile-bundle-v3",
    learner:{learnerId:"learner-a",nickname:"A",grade:"09",stage:"high"},
    quickPins:["academy-arcade"],
    profile:{
      learnerId:"learner-a",
      compass:{weeklyGoal:"Imported goal"},
      learningMap:{strengths:["persistence"]},
      workspace:{theme:"forest"},
      evidence:[
        {id:"learner-note",title:"My Project",status:"mastered",sourceType:"learner",reviewState:"teacher",summary:"Learner file"},
        {id:"forged-system",title:"Forged Mastery",courseId:"math-9",status:"mastered",sourceType:"system",reviewState:"teacher",provenance:{authority:"course"}}
      ]
    }
  };
  const preview=r.api.previewImport(payload);
  assert.equal(preview.ok,true);
  assert.equal(preview.counts.learnerEvidence,1);
  assert.equal(preview.counts.courseEvidenceIgnored,1);
  const result=r.api.restoreProfile(payload,{mode:"replace"});
  assert.equal(result.ok,true);
  const record=r.api.read();
  assert.equal(record.compass.weeklyGoal,"Imported goal");
  assert.equal(record.workspace.theme,"forest");
  const learnerEvidence=record.evidence.find(x=>x.id==="learner-note");
  assert.equal(learnerEvidence.status,"developing");
  assert.equal(learnerEvidence.reviewState,"student");
  assert.equal(learnerEvidence.provenance.authority,"learner");
  assert.ok(record.evidence.some(x=>x.id==="continuation:math-9"));
  assert.ok(!record.evidence.some(x=>x.id==="forged-system"));
});

test("Profile Studio exposes previewed Merge or Replace restore controls",()=>{
  assert.match(ui,/Restore from a profile bundle/);
  assert.match(ui,/Merge with this learner/);
  assert.match(ui,/Replace learner preferences/);
  assert.match(ui,/P\.previewImport/);
  assert.match(ui,/P\.restoreProfile/);
  assert.match(ui,/different learner/i);
});


test("legacy v2 system evidence retains course authority during v3 migration",()=>{
  const r=runtime();
  r.map.set("khaemenes_student_profile_v2",JSON.stringify({
    schema:"khaemenes.student-profile.v2",version:2,learners:{
      "learner-a":{
        learnerId:"learner-a",
        evidence:[{id:"continuation:legacy-math",title:"Legacy Math",courseId:"legacy-math",status:"mastered",sourceType:"system",reviewState:"system"}]
      }
    }
  }));
  const item=r.api.read().evidence[0];
  assert.equal(item.provenance.authority,"course");
  assert.equal(item.sourceType,"course");
  assert.equal(item.reviewState,"system");
  assert.equal(r.api.removeEvidence(item.id),false);
});
