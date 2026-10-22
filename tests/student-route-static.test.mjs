import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

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
