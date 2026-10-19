import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const family=fs.readFileSync(new URL("../family/index.html",import.meta.url),"utf8");
const action=fs.readFileSync(new URL("../assets/khaemenes-parent-action-center.js",import.meta.url),"utf8");
const support=fs.readFileSync(new URL("../assets/khaemenes-family-support-plan.js",import.meta.url),"utf8");

test("Family Portal loads parent engagement layers after family and continuation authorities",()=>{
  const registry=family.indexOf("../assets/khaemenes-family-registry.js");
  const continuation=family.indexOf("../assets/khaemenes-learning-continuation.js");
  const actionCenter=family.indexOf("../assets/khaemenes-parent-action-center.js");
  const supportPlan=family.indexOf("../assets/khaemenes-family-support-plan.js");
  assert.ok(registry>=0);
  assert.ok(continuation>registry);
  assert.ok(actionCenter>continuation);
  assert.ok(supportPlan>actionCenter);
});

test("Parent Action Center is permission-aware and summary-only",()=>{
  assert.match(action,/R\.canAdult\?\.\(adult\.adultId,l\.learnerId,"progress\.view"\)/);
  for(const boundary of ["changesGrades:false","awardsMastery:false","changesPlacement:false","changesLearnerIdentity:false"]) assert.ok(action.includes(boundary),boundary);
  for(const privacy of ["privateReflectionsExcluded:true","childConversationsExcluded:true","assessmentResponsesExcluded:true","answerKeysExcluded:true"]) assert.ok(action.includes(privacy),privacy);
  assert.doesNotMatch(action,/khaemenes\.course:/);
});

test("Weekly Family Brief supports review comparison, print, and JSON export without private learner work",()=>{
  assert.match(action,/khaemenes-parent-weekly-brief-v1/);
  assert.match(action,/Mark Brief Reviewed/);
  assert.match(action,/Print Brief/);
  assert.match(action,/Export Brief JSON/);
  assert.match(action,/Since last review/);
  assert.match(action,/private learner reflections, child conversations, assessment responses, and answer keys/);
});

test("Family Support Plan is scoped to the active family adult and authorized learners",()=>{
  assert.match(support,/STORAGE_KEY="khaemenes_parent_support_plan_v1"/);
  assert.match(support,/family\.familyId\+"\|"\+adult\.adultId/);
  assert.match(support,/R\.canAdult\?\.\(adult\.adultId,l\.learnerId,"progress\.view"\)/);
  assert.match(support,/learnerId:learner\.learnerId/);
});

test("Family Support Plan converts read-only learning summaries into practical support, not academic authority",()=>{
  assert.match(support,/actionCenter\(\)\?\.learnerSummary\?\.\(learner\)/);
  assert.match(support,/Positive learning conversation/);
  assert.match(support,/Study routine & organization/);
  assert.match(support,/Memory \/ Smart Review support/);
  assert.match(support,/Corrections or mastery encouragement/);
  assert.match(support,/Assessment preparation environment/);
  assert.match(support,/Project \/ lab \/ portfolio check-in/);
  assert.match(support,/Breaks, movement & learning readiness/);
  for(const boundary of [
    "parentPlanningOnly:true",
    "changesGrades:false",
    "awardsMastery:false",
    "changesPlacement:false",
    "changesAssessmentRecords:false",
    "unlocksCurriculum:false",
    "changesLearnerIdentity:false"
  ]) assert.ok(support.includes(boundary),boundary);
  assert.doesNotMatch(support,/khaemenes\.course:/);
  assert.doesNotMatch(support,/state\.weekly\s*\[/);
});

test("parent conversation prompts remain supportive rather than answer-giving",()=>{
  assert.match(support,/What did the correction help you notice/);
  assert.match(support,/Which skill feels least certain/);
  assert.match(support,/What do you already feel ready for/);
  assert.match(support,/What can you remember before you look back at your notes/);
  assert.match(support,/What are you most proud of learning or figuring out this week/);
  assert.match(support,/without supplying answers or taking over the work/);
});

test("Family Support Plan remains browser-local and excludes private learner data",()=>{
  for(const privacy of [
    "browserLocal:true",
    "progressPermissionRequired:true",
    "privateLearnerReflectionsRead:false",
    "childConversationsRead:false",
    "assessmentResponsesRead:false",
    "answerKeysRead:false"
  ]) assert.ok(support.includes(privacy),privacy);
});

test("parent features automatically refresh when family or learning summaries change",()=>{
  for(const eventName of [
    "khaemenes-family-ready",
    "khaemenes-family-changed",
    "khaemenes-learner-placement-changed",
    "khaemenes-learning-continuation-changed"
  ]){
    assert.ok(action.includes(eventName),"Action Center missing "+eventName);
    assert.ok(support.includes(eventName),"Support Plan missing "+eventName);
  }
  assert.match(support,/startsWith\("khaemenes"\)/);
});
