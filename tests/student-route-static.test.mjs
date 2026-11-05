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

test("student portal opens the canonical profile and preserves direct classroom access",()=>{
  assert.match(portal,/khaemenes-front-door-router\.js/);
  assert.match(portal,/href="profile\.html">Open My Student Profile/);
  assert.match(portal,/data-select-existing/);
  assert.match(portal,/id="studentCourseDoors"/);
});


test("enrollment continues a registered learner through the canonical profile route",()=>{
  assert.match(enroll,/KhaemenesFrontDoorRouter\?\.routeForLearner/);
  assert.match(enroll,/Finish & Open Selected Learner/);
});


test("High School daily entry opens the grade profile before course continuation",()=>{
  assert.match(portal,/learner\?\.stage==="high"&&route\?\.destination/);
  assert.match(portal,/Open My Daily Profile/);
  assert.match(portal,/Select Profile →/);
});

/* The profile is now module-driven; guard its real entry points instead of
   executing a removed inline script. The separate student-profile-v2 suite
   exercises storage, evidence, import, and the two-learner isolation rules. */
const profilePage=fs.readFileSync(new URL("../student/profile.html",import.meta.url),"utf8");
const uiModule=fs.readFileSync(new URL("../assets/khaemenes-student-profile-ui-v2.js",import.meta.url),"utf8");

test("canonical profile loads the learner-owned modules and studio",()=>{
  assert.match(profilePage,/id="profileStudio"/);
  for(const script of [
    "khaemenes-family-registry.js",
    "khaemenes-front-door-router.js",
    "khaemenes-student-profile-v2.js",
    "khaemenes-student-profile-ui-v2.js"
  ])assert.ok(profilePage.includes(script),"profile missing "+script);
  assert.match(uiModule,/function render\(\)/);
  assert.match(uiModule,/global\.addEventListener\("khaemenes-student-profile-changed"/);
  assert.doesNotMatch(profilePage,/khaemenes-global-header\.js/);
});

function makeFictionalRouter(){
  const learners={
    "fictional-A":{learnerId:"fictional-A",familyId:"fictional-family",nickname:"Scholar A",grade:"09",stage:"high"},
    "fictional-B":{learnerId:"fictional-B",familyId:"fictional-family",nickname:"Scholar B",grade:"10",stage:"high"}
  };
  const originalLearners=JSON.stringify(learners);
  let selected="fictional-A";
  const navigations=[],events=[];
  const registry={
    gradeMeta:{"09":{label:"Grade 9"},"10":{label:"Grade 10"}},
    getLearner(id){return learners[id||selected]||null;},
    getFamily(){return {familyId:"fictional-family",learners:Object.values(learners)};},
    getAdult(){return null;},
    setActive({familyId,learnerId}){
      assert.equal(familyId,"fictional-family");
      assert.ok(learners[learnerId],"only an existing learner may be selected");
      selected=learnerId;
    },
    learnerDestination(){return null;},
    destinationFor(){return null;}
  };
  const window={
    KhaemenesFamilyRegistry:registry,
    location:{assign(url){navigations.push(url)}},
    addEventListener(){},
    dispatchEvent(event){events.push(event.type)}
  };
  const document={readyState:"loading",addEventListener(){}};
  class CustomEvent{constructor(type,{detail}={}){this.type=type;this.detail=detail}}
  vm.runInNewContext(router,{window,document,CustomEvent},{filename:"khaemenes-front-door-router.js",timeout:2500});
  return {api:window.KhaemenesFrontDoorRouter,learners,registry,navigations,events,originalLearners,getSelected:()=>selected};
}

test("fictional Grade 9 and Grade 10 route to their actual daily profile pages",()=>{
  const t=makeFictionalRouter();
  const a=t.api.routeForLearner(t.learners["fictional-A"]);
  const b=t.api.routeForLearner(t.learners["fictional-B"]);
  assert.equal(a.destination,"https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/");
  assert.equal(b.destination,"https://vervenveda.com/Khaemenes_High.github.io/grades/grade-10/student-profile/");
  assert.equal(a.authority.changesPlacement,false);
  assert.equal(a.authority.awardsMastery,false);
  assert.equal(t.navigations.length,0,"inspecting a route must not navigate");
  assert.equal(JSON.stringify(t.learners),t.originalLearners,"routing must not edit learner records");
});

test("switching fictional learners does not navigate without an explicit continue action",()=>{
  const t=makeFictionalRouter();
  const next=t.api.switchLearner("fictional-B");
  assert.equal(t.getSelected(),"fictional-B");
  assert.match(next.destination,/\/grades\/grade-10\/student-profile\/$/);
  assert.equal(t.navigations.length,0);
  t.api.continueLearner();
  assert.deepEqual(t.navigations,["https://vervenveda.com/Khaemenes_High.github.io/grades/grade-10/student-profile/"]);
  assert.equal(JSON.stringify(t.learners),t.originalLearners);
});

test("grade metadata uses keyed lookup rather than calling gradeMeta as a function",()=>{
  assert.match(portal,/R\?\.gradeMeta\?\.\[l\.grade\]/);
  assert.match(router,/r\?\.gradeMeta\?\.\[grade\]/);
  assert.doesNotMatch(portal,/R\?\.gradeMeta\?\.\(/);
});
