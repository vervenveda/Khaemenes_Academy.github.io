import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const router=fs.readFileSync(new URL("../assets/khaemenes-front-door-router.js",import.meta.url),"utf8");
const portal=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");

test("identified Grade 09 learner routes to the real student dashboard",()=>{
  assert.match(router,/const base="https:\/\/vervenveda\.com\/Khaemenes_High\.github\.io"/);
  assert.match(router,/if\(grade==="09"\)return `\$\{base\}\/grades\/grade-09\/student-profile\/`/);
});

test("identified Grade 10 learner routes to the real Grade 10 portal",()=>{
  assert.match(router,/if\(grade==="10"\)return `\$\{base\}\/grades\/grade-10\/`/);
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
