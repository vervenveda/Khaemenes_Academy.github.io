/* Browser-local enrollment guardrails. No real family or cloud records. */
"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const src=fs.readFileSync(path.join(root,"assets/khaemenes-family-registry.js"),"utf8");
function harness({failWrite=false,loseReadback=false,failActive=false}={}){
 const data=new Map(),events=[];
 const store={
   getItem(key){return loseReadback&&key==="khaemenes_family_registry_v1"?null:data.get(key)??null},
   setItem(key,value){if(failWrite||(failActive&&key==="khaemenes_active_family_v1"))throw Error("storage-blocked");data.set(key,String(value))},
   removeItem(key){data.delete(key)}
 };
 const global={localStorage:store,crypto:{randomUUID:()=>"test-"+String(data.size)+"-"+String(events.length)},location:{origin:"https://example.invalid"},dispatchEvent:e=>events.push(e.type),CustomEvent:class {constructor(type,options){this.type=type;this.detail=options?.detail}},addEventListener:()=>{}};
 global.window=global;
 vm.runInNewContext(src,global,{filename:"khaemenes-family-registry.js",timeout:3000});
 return {registry:global.KhaemenesFamilyRegistry,data,events};
}
test("blocked local storage never returns successful family creation",()=>{
 const {registry}=harness({failWrite:true});
 assert.throws(()=>registry.createFamily({displayName:"Example",adultName:"Guardian"}),/local-registry-write-failed/);
});
test("missing local readback never returns successful family creation",()=>{
 const {registry}=harness({loseReadback:true});
 assert.throws(()=>registry.createFamily({displayName:"Example",adultName:"Guardian"}),/local-registry-readback-failed/);
});
test("provisional family and learner remain local and identified as such",()=>{
 const {registry}=harness();
 const family=registry.createFamily({displayName:"Example Family",adultName:"Adult"});
 assert.ok(family.familyId);
 const learner=registry.registerLearner({familyId:family.familyId,nickname:"Example Learner",stage:"high",grade:"09"});
 assert.equal(learner.grade,"09");
 assert.match(learner.accountState,/^local-/);
 assert.equal(registry.getFamily(family.familyId).learners.length,1);
});
test("portal uses one intake, and enrollment identifies provisional status",()=>{
 const portal=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 const form=fs.readFileSync(path.join(root,"family/enroll/index.html"),"utf8");
 assert.match(portal,/function createFamily\(\)\{[\s\S]*?location\.href="enroll\/"/);
 assert.doesNotMatch(portal,/prompt\("Family display name:/);
 assert.match(form,/provisional local profile/);
 assert.match(form,/No official enrollment occurred/);
 assert.match(form,/duplicate=family\.learners\.find/);
 assert.match(form,/not verified or cloud-synced/);
});

test("four-step guardian intake is local-only and does not collect credentials or documents",()=>{
 const form=fs.readFileSync(path.join(root,"family/enroll/index.html"),"utf8");
 for(const step of [1,2,3,4])assert.match(form,new RegExp('data-intake-step="'+step+'"'));
 assert.match(form,/intakeAcknowledgment/);
 assert.match(form,/Create Provisional Family Profile/);
 assert.match(form,/createFamilyIntake/);
 assert.match(form,/This is not verified Academy enrollment/);
 assert.match(form,/A matching family and adult already exist/);
 assert.doesNotMatch(form,/<input[^>]*type="password"/i);
 assert.doesNotMatch(form,/<input[^>]*type="file"/i);
});
test("enrollment inline script parses as valid JavaScript",()=>{
 const form=fs.readFileSync(path.join(root,"family/enroll/index.html"),"utf8");
 const blocks=[...form.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 assert.ok(blocks.length);
 blocks.forEach((code,i)=>new vm.Script(code,{filename:"inline-"+i+".js"}));
});

test("single-write intake creates linked family, adult, learner and provisional access",()=>{
 const {registry,data}=harness();
 const created=registry.createFamilyIntake({displayName:"Sample Family",adultName:"Caregiver",adultRole:"caregiver",nickname:"Scholar",grade:"09"});
 const stored=JSON.parse(data.get(registry.keys.registry));
 assert.equal(Object.keys(stored.families).length,1);
 assert.equal(Object.keys(stored.learners).length,1);
 assert.deepEqual(stored.families[created.familyId].learnerIds,[created.learnerId]);
 assert.equal(stored.learners[created.learnerId].grade,"09");
 assert.equal(stored.learnerAdultAccess[created.learnerId+":"+created.adultId].status,"active");
 assert.match(stored.learners[created.learnerId].accountState,/^local-/);
 assert.equal(registry.activeIds().familyId,created.familyId);
 assert.throws(()=>registry.createFamilyIntake({displayName:"Sample Family",adultName:"Caregiver"}),/intake-local-duplicate/);
 assert.equal(Object.keys(registry.load().families).length,1);
});
test("failed registry write creates no partial family or learner",()=>{
 const {registry}=harness({failWrite:true});
 assert.throws(()=>registry.createFamilyIntake({displayName:"Sample",adultName:"Adult",nickname:"Scholar",grade:"09"}),/local-registry-write-failed/);
 assert.equal(Object.keys(registry.load().families).length,0);
 assert.equal(Object.keys(registry.load().learners).length,0);
});
test("failed active selection keeps complete saved intake recoverable",()=>{
 const {registry}=harness({failActive:true});
 const created=registry.createFamilyIntake({displayName:"Sample",adultName:"Adult",nickname:"Scholar",grade:"09"});
 const stored=registry.load();
 assert.ok(stored.families[created.familyId]);
 assert.ok(stored.learners[created.learnerId]);
 assert.ok(stored.learnerAdultAccess[created.learnerId+":"+created.adultId]);
 assert.notEqual(registry.activeIds().familyId,created.familyId);
 assert.throws(()=>registry.createFamilyIntake({displayName:"Sample",adultName:"Adult"}),/intake-local-duplicate/);
});
test("intake grade is validated before any registry save",()=>{
 const {registry}=harness();
 assert.throws(()=>registry.createFamilyIntake({displayName:"Sample",adultName:"Adult",nickname:"Scholar",grade:"invalid"}),/intake-grade-invalid/);
 assert.equal(Object.keys(registry.load().families).length,0);
});

test("Family Center scopes learner changes to current family and disables unverified adult grants",()=>{
 const html=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 assert.match(html,/function localLinkedLearner\(f,id\)/);
 assert.match(html,/function chooseLocalLearner\(f,id/);
 assert.match(html,/requireProgress:true/);
 assert.match(html,/localAdultForFamily\(f\)/);
 assert.doesNotMatch(html,/R\.addAdultLocal\(\{familyId:f\.familyId/);
 assert.match(html,/Additional adult access requires verified invitations/);
 assert.match(html,/addEventListener\("storage"/);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 for(const [index,script] of scripts.entries())new vm.Script(script,{filename:"family-inline-"+index+".js"});
});

test("high school parent overview is learner scoped and shows no invented scores",()=>{
 const html=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 assert.match(html,/function highSchoolPublishedOverview\(learner,snapshots\)/);
 assert.match(html,/Grade .*Published Learning Overview/);
 assert.match(html,/These are not official grades, a transcript, or a complete school schedule/);
 assert.match(html,/Mathematics pathway/);
 assert.match(html,/World language/);
 assert.match(html,/snapshot\(s\) from another grade|snapshot\(s\) from another grade/);
 assert.match(html,/key===C\?\.storageKey/);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 for(const [index,script] of scripts.entries())new vm.Script(script,{filename:"family-inline-"+index+".js"});
});

test("Middle School reports are matched to learner and registered grade",()=>{
 const html=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 assert.match(html,/function middleGradeMatches\(snapshot,learner\)/);
 assert.match(html,/function middlePublishedOverview\(learner,records\)/);
 assert.match(html,/snapshot\.courseId!==expected/);
 assert.match(html,/snapshot\?\.learnerId!==learner\.learnerId/);
 assert.match(html,/Sixth Grade/);
 assert.match(html,/Seventh Grade/);
 assert.match(html,/Eighth Grade/);
 assert.match(html,/middlePublishedOverview\(l,snapshots\)/);
 assert.match(html,/No matching Middle School course summary/);
 assert.match(html,/Not an official transcript or complete record/);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 scripts.forEach((script,i)=>new vm.Script(script,{filename:"family-inline-"+i+".js"}));
});

test("Elementary Grade 1–5 reporting requires matching learner, course and grade",()=>{
 const html=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 assert.match(html,/function elementaryGradeMatches\(snapshot,learner\)/);
 assert.match(html,/snapshot\?\.learnerId!==learner\.learnerId/);
 assert.match(html,/snapshot\.courseId!==id/);
 for(const label of ["First Grade","Second Grade","Third Grade","Fourth Grade","Fifth Grade"])assert.ok(html.includes(label));
 assert.match(html,/Grade 01 academic reporting is pending/);
 assert.match(html,/No matching Elementary course summary/);
 assert.match(html,/This is not an official transcript or the entire student record/);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
 scripts.forEach((code,i)=>new vm.Script(code,{filename:"family-inline-"+i+".js"}));
});

test("Pre-K and Kindergarten family summaries are learner scoped and not invented grades",()=>{
 const html=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 assert.match(html,/function earlyLearningMatches\(snapshot,learner\)/);
 assert.match(html,/snapshot\?\.learnerId!==learner\?\.learnerId/);
 assert.match(html,/preschool-adventure-garden/);
 assert.match(html,/khaemenes-kindergarten-formal-path/);
 assert.match(html,/Guest play is not assigned to a student/);
 assert.match(html,/Exploration is optional, playful, and never scored as mastery/);
 assert.match(html,/const bars=l\.stage==="preschool"\?"":/);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 scripts.forEach((s,i)=>new vm.Script(s,{filename:"family-inline-"+i+".js"}));
});

test("Pre-K daily activity observations reach the parent view only through learner-scoped records",()=>{
 const html=fs.readFileSync(path.join(root,"family/index.html"),"utf8");
 assert.match(html,/function preKFamilyDayReadOnly\(learner\)/);
 assert.match(html,/record\.learnerId!==learner\.learnerId/);
 assert.match(html,/khaemenes\.prek\.family-day\.v1:/);
 assert.match(html,/Adult-assisted browser-local reflections/);
 assert.match(html,/const familyDay=preKFamilyDayReadOnly\(learner\)/);
 const inline=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
 inline.forEach((code,i)=>new vm.Script(code,{filename:"family-inline-"+i+".js"}));
});
