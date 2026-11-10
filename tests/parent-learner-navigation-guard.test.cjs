"use strict";
// No real family records. Run node --test tests/parent-learner-navigation-guard.test.cjs
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const guard=require("../assets/khaemenes-parent-learner-navigation-guard-v1.js");
const html=fs.readFileSync(path.join(__dirname,"../family/index.html"),"utf8");
function fixture(opts={}){
 const family={familyId:"family-A",learnerIds:["child-A","child-B"],adultIds:["adult-A"]};
 const children={"child-A":{familyId:"family-A",learnerId:"child-A"},"child-B":{familyId:"family-A",learnerId:"child-B"},"child-C":{familyId:"family-B",learnerId:"child-C"}};
 const adults={"adult-A":{adultId:"adult-A"}};
 let ids={familyId:"family-A",adultId:"adult-A",learnerId:"child-A"},writes=0;
 const R={
  activeIds:()=>({...ids}),
  getFamily:id=>id==="family-A"?family:null,
  getLearner:id=>children[id]||null,
  getAdult:id=>adults[id]||null,
  canAdult:(adult,learner,permission)=>permission==="progress.view"&&adult==="adult-A"&&learner!=="child-B"&&learner!=="child-C",
  setActive(next){writes++;ids={...ids,...next};if(opts.refuseWrite)ids.learnerId="child-A";if(opts.throwWrite)throw Error("Storage unavailable")}
 };
 return {R,family,writes:()=>writes,ids:()=>ids};
}
test("authorized linked child gets consistent active learner selection",()=>{
 const a=fixture();const r=guard.select(a.R,a.family,"child-A");
 assert.equal(r.ok,true);assert.equal(a.ids().learnerId,"child-A");
});
test("sibling with revoked progress permission never becomes active",()=>{
 const a=fixture();const result=guard.select(a.R,a.family,"child-B");
 assert.equal(result.ok,false);assert.equal(a.writes(),0);
 assert.equal(a.ids().learnerId,"child-A");
});
test("other-family learner cannot be selected even if a local ID exists",()=>{
 const a=fixture();assert.equal(guard.select(a.R,a.family,"child-C").ok,false);
 assert.equal(a.writes(),0);
});
test("browser switching to another learner after write fails closed",()=>{
 const a=fixture({refuseWrite:true});
 assert.equal(guard.select(a.R,a.family,"child-A").ok,true);
 const r=guard.select(a.R,a.family,"child-B");
 assert.equal(r.ok,false); // excluded before write
});
test("storage exceptions fail closed without navigation approval",()=>{
 const a=fixture({throwWrite:true});const r=guard.select(a.R,a.family,"child-A");
 assert.equal(r.ok,false);assert.equal(r.reason,"selection-write-failed");
});
test("unexpected saved selection is rejected at read-back",()=>{
 const a=fixture();a.R.canAdult=()=>true;
 a.R.setActive=next=>{a.R.activeIds=()=>({...next,learnerId:"child-A"})};
 const r=guard.select(a.R,a.family,"child-B");
 assert.equal(r.ok,false);assert.equal(r.reason,"selection-not-consistent");
});
test("parent portal profile, class and next step buttons share guarded choice",()=>{
 assert.ok(html.includes("KhaemenesParentLearnerNavigationGuard"));
 assert.ok(html.includes("guard?.select?.(R,f,id)"));
 assert.ok(html.includes("chooseLocalLearner(f,link.dataset.learnerProfile,{requireProgress:true})"));
 assert.ok(html.includes("chooseLocalLearner(f,learnerId,{requireProgress:true})"));
});
test("guard grants neither server identity nor student write authority",()=>{
 const src=fs.readFileSync(path.join(__dirname,"../assets/khaemenes-parent-learner-navigation-guard-v1.js"),"utf8");
 assert.ok(!/fetch\(|XMLHttpRequest|sessionStorage|localStorage|student.*submit/i.test(src));
 assert.equal(typeof guard.allowed,"function");
});

test("generic portal shortcut cannot bypass selecting the linked child",()=>{
 assert.ok(!html.includes('<a class="btn" href="../student/">Open Student Portal</a>'));
 assert.ok(html.includes("Open Selected Student Profile"));
 assert.ok(html.includes('R.canAdult?.(activeAdult.adultId,activeLearner.learnerId,"progress.view")'));
});

test("Parent Action Center also uses the same guard for learner and mentor shortcuts",()=>{
 const actions=fs.readFileSync(path.join(__dirname,"../assets/khaemenes-parent-action-center.js"),"utf8");
 assert.ok(actions.includes("guard?.select?.(R,family,id)"));
 assert.ok(actions.includes("if(!href||!selectAuthorizedLearner(link.dataset.parentOpenStep))event.preventDefault()"));
 assert.ok(actions.includes("if(!selectAuthorizedLearner(link.dataset.parentMentor))event.preventDefault()"));
 assert.ok(!actions.includes('href="../student/" data-parent-profile'));
});
