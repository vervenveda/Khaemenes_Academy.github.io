import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source=fs.readFileSync(new URL("../assets/khaemenes-student-quick-pins-v1.js",import.meta.url),"utf8");
const portal=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");

function runtime(){
  const map=new Map();
  const localStorage={
    getItem:key=>map.has(String(key))?map.get(String(key)):null,
    setItem:(key,value)=>map.set(String(key),String(value)),
    removeItem:key=>map.delete(String(key))
  };
  let active={learnerId:"learner-a",nickname:"A"};
  class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail}}
  const window={
    localStorage,
    KhaemenesFamilyRegistry:{getLearner:()=>active},
    dispatchEvent:()=>{},
    CustomEvent
  };
  vm.runInContext(source,vm.createContext({window,CustomEvent,console,Date,JSON,String,Boolean,Array,Set,Object,encodeURIComponent}));
  return {api:window.KhaemenesStudentQuickPinsV1,map,setActive:value=>{active=value}};
}

test("Quick Pins remain learner-owned and presentation-only",()=>{
  const r=runtime();
  assert.equal(r.api.policy.learnerOwned,true);
  assert.equal(r.api.policy.presentationOnly,true);
  assert.equal(r.api.policy.changesEnrollment,false);
  assert.equal(r.api.policy.changesGrades,false);
  assert.equal(r.api.policy.changesMastery,false);
  assert.equal(r.api.policy.changesPlacement,false);
  assert.equal(r.api.setPinned("academy-arcade",true),true);
  assert.equal(r.api.isPinned("academy-arcade"),true);
  r.setActive({learnerId:"learner-b",nickname:"B"});
  assert.equal(r.api.isPinned("academy-arcade"),false);
  assert.equal(r.api.setPinned("academy-arcade",true,"learner-a"),false);
});

test("Grade 09 legacy Quick Pins migrate into the canonical learner store",()=>{
  const r=runtime();
  r.map.set("khaemenes-grade09-quick-pins-v1:learner:learner-a",JSON.stringify(["scientific-calculator","the-verifier"]));
  assert.deepEqual([...r.api.list()].map(x=>x.id),["scientific-calculator","the-verifier"]);
  const store=JSON.parse(r.map.get(r.api.storageKey));
  assert.deepEqual(store.learners["learner-a"],["scientific-calculator","the-verifier"]);
});

test("Student Portal surfaces canonical Quick Pins",()=>{
  assert.match(portal,/khaemenes-student-quick-pins-v1\.js/);
  assert.match(portal,/Games, tools &amp; resources/);
  assert.match(portal,/data-quick-remove/);
  assert.match(portal,/khaemenes-student-quick-pins-changed/);
});
