import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const router=fs.readFileSync(new URL("../assets/khaemenes-front-door-router.js",import.meta.url),"utf8");
const portal=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");
const enroll=fs.readFileSync(new URL("../family/enroll/index.html",import.meta.url),"utf8");

test("identified Grade 09 learner routes to the real student dashboard",()=>{
  assert.match(router,/const base="https:\/\/vervenveda\.com\/Khaemenes_High\.github\.io"/);
  assert.match(router,/if\(grade==="09"\)return `\$\{base\}\/grades\/grade-09\/student-profile\/`/);
});

test("identified Grade 10 learner routes to the Grade 10 student profile home",()=>{
  assert.match(router,/if\(grade==="10"\)return `\$\{base\}\/grades\/grade-10\/student-profile\/`/);
});

test("identified Grade 11 learner routes to the Grade 11 student profile home",()=>{
  assert.match(router,/if\(grade==="11"\)return `\$\{base\}\/grades\/grade-11\/student-profile\/`/);
});

test("identified Grade 12 learner routes to the Grade 12 student profile home",()=>{
  assert.match(router,/if\(grade==="12"\)return `\$\{base\}\/grades\/grade-12\/student-profile\/`/);
});

test("high-school fallback no longer depends on the dead grades anchor",()=>{
  assert.doesNotMatch(router,/khaemenesGrade=grade-/);
  assert.doesNotMatch(router,/#grades/);
  assert.match(router,/Academy canonical high-school learner route/);
});

test("student portal continues through the front-door router",()=>{
  assert.match(portal,/khaemenes-front-door-router\.js/);
  assert.match(portal,/continueLearner/);
});


test("enrollment continues a registered learner through the canonical profile route",()=>{
  assert.match(enroll,/KhaemenesFrontDoorRouter\?\.routeForLearner/);
  assert.match(enroll,/Continue to the learner profile\?/);
});


test("High School daily entry opens the grade profile before course continuation",()=>{
  assert.match(portal,/learner\?\.stage==="high"&&route\?\.destination/);
  assert.match(portal,/Open My Daily Profile/);
  assert.match(portal,/Select Profile →/);
});

/* Canonical student/profile.html entry regression — fictional learners only.
   Exercises the actual inline page script rather than repeating the route logic. */
const canonicalProfilePage=fs.readFileSync(new URL("../student/profile.html",import.meta.url),"utf8");
const canonicalProfileInline=canonicalProfilePage.match(/<script>([\s\S]*?)<\/script>/)?.[1];

function mountFictionalProfile(initialLearnerId=null){
  assert.ok(canonicalProfileInline,"canonical student profile must expose its inline bootstrap");
  const learners={
    "fictional-A":{learnerId:"fictional-A",familyId:"fictional-family",nickname:"Scholar A",grade:"09",stage:"high"},
    "fictional-B":{learnerId:"fictional-B",familyId:"fictional-family",nickname:"Scholar B",grade:"10",stage:"high"}
  };
  const originalLearners=JSON.stringify(learners);
  let selectedId=initialLearnerId;
  const listeners={},selectors={};
  const nodes={
    identity:{
      innerHTML:"",
      querySelectorAll(selector){
        assert.equal(selector,"[data-learner]");
        return Object.values(learners).map(learner=>({
          dataset:{learner:learner.learnerId},
          addEventListener(type,fn){
            assert.equal(type,"click");
            selectors[learner.learnerId]=fn;
          }
        }));
      }
    },
    gradePathway:{hidden:true},
    gradeDashboardLink:{href:"./"}
  };
  const registry={
    gradeMeta:{"09":{label:"Grade 9"},"10":{label:"Grade 10"}},
    getLearner(id){return learners[id||selectedId]||null;},
    load(){return {learners};},
    setActive({learnerId}){
      assert.ok(learners[learnerId],"only an existing learner may be selected");
      selectedId=learnerId;
      if(listeners["khaemenes-family-changed"])listeners["khaemenes-family-changed"]();
    }
  };
  const context={
    window:{KhaemenesFamilyRegistry:registry,addEventListener(event,fn){listeners[event]=fn;}},
    document:{getElementById(id){assert.ok(nodes[id], "unexpected element "+id);return nodes[id];}}
  };
  const reload=()=>vm.runInNewContext(canonicalProfileInline,context,{filename:"student/profile.html:inline",timeout:2500});
  reload();
  return {registry,nodes,selectors,reload,getSelected:()=>selectedId,originalLearners,learners};
}

test("canonical profile page supports two existing fictional learners without creating new records",()=>{
  const state=mountFictionalProfile(null);
  assert.match(state.nodes.identity.innerHTML,/Select an existing student/);
  assert.match(state.nodes.identity.innerHTML,/Scholar A/);
  assert.match(state.nodes.identity.innerHTML,/Scholar B/);
  assert.equal(state.nodes.gradePathway.hidden,true);
  assert.equal(typeof state.selectors["fictional-B"],"function");
  state.selectors["fictional-B"]();
  assert.equal(state.getSelected(),"fictional-B");
  assert.match(state.nodes.identity.innerHTML,/Scholar B/);
  assert.match(state.nodes.identity.innerHTML,/Grade 10/);
  assert.equal(state.nodes.gradePathway.hidden,false);
  assert.match(state.nodes.gradeDashboardLink.href,/\/grades\/grade-10\/student-profile\/$/);
  assert.equal(JSON.stringify(state.learners),state.originalLearners,"existing learner records remain unchanged");
  state.reload();
  assert.match(state.nodes.identity.innerHTML,/Scholar B/);
  assert.match(state.nodes.gradeDashboardLink.href,/\/grades\/grade-10\/student-profile\/$/);
});

test("canonical profile page renders Grade 9 then switches to Grade 10 without an exception",()=>{
  const state=mountFictionalProfile("fictional-A");
  assert.match(state.nodes.identity.innerHTML,/Scholar A/);
  assert.match(state.nodes.identity.innerHTML,/Grade 9/);
  assert.match(state.nodes.gradeDashboardLink.href,/\/grades\/grade-09\/student-profile\/$/);
  state.registry.setActive({learnerId:"fictional-B"});
  assert.match(state.nodes.identity.innerHTML,/Scholar B/);
  assert.match(state.nodes.identity.innerHTML,/Grade 10/);
  assert.match(state.nodes.gradeDashboardLink.href,/\/grades\/grade-10\/student-profile\/$/);
  assert.equal(JSON.stringify(state.learners),state.originalLearners);
});

test("canonical student profile metadata uses keyed grade lookup, not a function call",()=>{
  assert.match(canonicalProfilePage,/R\.gradeMeta\?\.\[active\.grade\]/);
  assert.match(canonicalProfilePage,/R\.gradeMeta\?\.\[l\.grade\]/);
  assert.doesNotMatch(canonicalProfilePage,/R\.gradeMeta\?\.\(/);
});
