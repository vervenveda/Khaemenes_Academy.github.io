import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const studio=fs.readFileSync(new URL("../assets/khaemenes-learning-science.js",import.meta.url),"utf8");
const home=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const student=fs.readFileSync(new URL("../student/index.html",import.meta.url),"utf8");
const adult=fs.readFileSync(new URL("../adult/index.html",import.meta.url),"utf8");
const family=fs.readFileSync(new URL("../family/index.html",import.meta.url),"utf8");

test("Study Studio is loaded only as progressive account-aware support",()=>{
  assert.match(home,/khaemenes-learning-science\.js/);
  assert.match(student,/khaemenes-learning-science\.js/);
  assert.match(adult,/khaemenes-learning-science\.js/);
  assert.match(family,/khaemenes-learning-science\.js/);
  assert.match(studio,/if\(!ctx\.hasAccount\|\|!actions\)\{btn\?\.remove\(\);return\}/);
  assert.match(studio,/Choose an active learner or Adult Scholar profile/);
});

test("Smart Review implements spaced retrieval with an adaptive starter schedule",()=>{
  assert.match(studio,/INTERVALS=Object\.freeze\(\[1,3,7,14,30,60\]\)/);
  assert.match(studio,/function syncReviewQueueFor\(l\)/);
  assert.match(studio,/function interleave\(items\)/);
  assert.match(studio,/Without opening notes/);
  assert.match(studio,/Need review/);
  assert.match(studio,/Got it with effort/);
  assert.match(studio,/Retrieved easily/);
  assert.match(studio,/nextDueAt:item\.dueAt/);
});

test("review queue is seeded from learner continuation rather than inventing formal course state",()=>{
  assert.match(studio,/C\.readLearner\(l\.learnerId\)/);
  assert.match(studio,/courseId:clean\(s\.courseId/);
  assert.match(studio,/sourceStatus:clean\(s\.status/);
  assert.doesNotMatch(studio,/khaemenes\.course:/);
});

test("Plan Monitor Reflect records explicit self-regulated learning stages",()=>{
  assert.match(studio,/Plan → Monitor → Reflect/);
  assert.match(studio,/confidenceBefore/);
  assert.match(studio,/function monitorSession\(state,note=""/);
  assert.match(studio,/on-track/);
  assert.match(studio,/changed-strategy/);
  assert.match(studio,/function finishSession\(input\)/);
  assert.match(studio,/calibration=Math\.abs\(diff\)<=1\?"about-right"/);
  assert.match(studio,/reflection:clean\(input\?\.reflection/);
  assert.match(studio,/nextStep:clean\(input\?\.nextStep/);
});

test("learning-science support can never become formal academic authority",()=>{
  for(const boundary of ["awardsMastery:false","changesScores:false","unlocksCurriculum:false","changesPlacement:false","assessmentAuthority:false"]) assert.ok(studio.includes(boundary),boundary);
  assert.match(studio,/This is a study record only—not a grade/);
  assert.match(studio,/Formal scores changed/);
});

test("Family Portal receives read-only support summaries only with progress permission",()=>{
  assert.match(studio,/function mountFamilySupport\(\)/);
  assert.match(studio,/R\.canAdult\?\.\(adult\.adultId,l\.learnerId,"progress\.view"\)/);
  assert.match(studio,/parentSummaryReadOnly:true/);
  assert.match(studio,/Read-only support summary/);
  assert.match(studio,/Retrieval ratings, private notes, and study reflections remain in the learner workspace/);
});

test("Study Studio uses learner-scoped local-first keys",()=>{
  assert.match(studio,/REVIEW_KEY="khaemenes\.learning\.review\.v1"/);
  assert.match(studio,/SELFREG_KEY="khaemenes\.learning\.selfregulation\.v1"/);
  assert.match(studio,/store\.learners\[id\]/);
  assert.match(studio,/localFirst:true/);
});

test("Study Studio dialog is accessible and learner-specific content is protected from optional online translation",()=>{
  assert.match(studio,/aria-labelledby","khaemenesStudyStudioTitle"/);
  assert.match(studio,/role="tablist"/);
  assert.match(studio,/role="tabpanel"/);
  assert.match(studio,/data-private/);
  assert.match(studio,/data-i18n-no-online/);
});

test("family navigation is resolved from the Academy asset root",()=>{
  assert.match(studio,/ASSET_URL=document\.currentScript\?\.src\|\|location\.href/);
  assert.match(studio,/FAMILY_URL=new URL\("family\/",ACADEMY_ROOT\)\.href/);
});
