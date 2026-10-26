#!/usr/bin/env node
// Archaemenes · cross-subject curriculum and boundary regression
// All learner IDs and published summaries are fictional.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const engineSource=fs.readFileSync("assets/khaemenes-archaemenes-conversation-v2.js","utf8");
const mentorSource=fs.readFileSync("mentor/index.html","utf8");
const visitorSource=fs.readFileSync("assets/khaemenes-archaemenes-visitor-local-v1.js","utf8");
const stored=new Map();
const localStorage={
  getItem:k=>stored.get(k)??null,
  setItem:(k,v)=>stored.set(k,String(v)),
  removeItem:k=>stored.delete(k)
};
const browser={};
vm.runInNewContext(engineSource,{window:browser,document:{},localStorage},{filename:"conversation-v2.js"});
const api=browser.KhaemenesArchaemenesConversation;
assert.ok(api,"existing conversation engine must export a single API");

// One existing controller and styling layer per surface.
assert.equal((mentorSource.match(/function responseFor\(/g)||[]).length,1);
assert.equal((mentorSource.match(/src="\.\.\/assets\/khaemenes-archaemenes-conversation-v2\.js"/g)||[]).length,1);
assert.equal((mentorSource.match(/addEventListener\('submit'/g)||[]).length,1);
assert.equal((visitorSource.match(/addEventListener\('submit'/g)||[]).length,1);
assert.match(mentorSource,/teacher answer\|marking guide/);
assert.match(mentorSource,/activeLearnerContext\(\)/);

// Fresh formative examples only. No actual test bank and no awarding mastery.
const subjects=[
  ["English","b","English and Language Arts"],
  ["science","a","Science"],
  ["social studies","a","Social Studies"],
  ["french","b","World Languages"],
  ["coding","b","Technology"],
  ["art","a","Arts"],
  ["physical education","c","Health and Physical Education"],
  ["psychology","b","Psychology"],
  ["research","b","Research"],
  ["budgeting","a","Life Skills"]
];
for(const [topic,answer,expected] of subjects){
  const session=api.createSession({});
  assert.match(session.respond("help me study "+topic),/Now try this one:/);
  assert.equal(session.snapshot().subject,expected);
  assert.match(session.respond(answer),/correct/i);
  assert.equal(session.snapshot().successes,1);
  assert.equal(session.snapshot().phase,"reflect");
}

// Preserve original math/fraction follow-up experience.
const math=api.createSession({});
math.respond("Hello");
assert.match(math.respond("I am having trouble with math"),/fractions/i);
assert.match(math.respond("fractions"),/adding fractions/i);
assert.match(math.respond("adding fractions"),/Now try this one:/);
assert.match(math.respond("5/7"),/correct/i);
assert.equal(math.snapshot().successes,1);

// Two incorrect submissions and self-reported confidence never count as success.
const incorrect=api.createSession({});
incorrect.respond("science");
incorrect.respond("c");
assert.equal(incorrect.snapshot().successes,0);
incorrect.respond("I get it");
assert.equal(incorrect.snapshot().successes,0);

// Fictional lesson → published verified score → mentor → fresh practice.
// The summary intentionally includes protected fields which must not be used.
const learner=api.forLearner("fictional-family-A","fictional-learner-A");
learner.setReleasedContext({
  stage:"middle",learnerId:"fictional-learner-A",grade:"07",
  currentFocus:{subject:"science",week:5,text:"Energy transfer"},
  recentAssessmentAttempts:[{
    verified:true,score:60,reviewSkills:["energy transfer"],
    questionText:"UNRELEASED_EXAM_QUESTION",
    answerKey:"SECRET_MARKING_GUIDE",
    responses:[{choice:"SECRET_SELECTION"}]
  }]
});
const mentorReply=learner.respond("Help me with my lesson");
assert.match(mentorReply,/Science|observation/i);
assert.doesNotMatch(mentorReply,/SECRET|UNRELEASED/i);
assert.match(mentorReply,/Now try this one:/);
assert.match(learner.respond("a"),/correct/i);
assert.equal(learner.snapshot().successes,1);

// Cross-learner boundaries and clearing coaching state.
const other=api.forLearner("fictional-family-A","fictional-learner-B");
assert.equal(other.snapshot().subject,"");
learner.remember(true);
assert.equal(learner.remembering(),true);
api.clearLearner("fictional-family-A","fictional-learner-A");
assert.equal(learner.snapshot().subject,"");
assert.equal(learner.remembering(),false);
const restored=api.createSession({});
restored.resumeTopic([{role:"user",text:"I am having trouble with math"},{role:"user",text:"Fractions"}]);
assert.equal(restored.snapshot().detail,"fractions");

console.log(JSON.stringify({
  status:"PASS",
  scope:"fictional offline conversation contract",
  subjects:subjects.length+1,
  academicScoreChanges:0,
  liveBrowserCertified:false,
  backendTeacherAuthorizationCertified:false
}));
