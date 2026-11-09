/* Browser-local enrollment guardrails. No real family or cloud records. */
"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const src=fs.readFileSync(path.join(root,"assets/khaemenes-family-registry.js"),"utf8");
function harness({failWrite=false,loseReadback=false}={}){
 const data=new Map(),events=[];
 const store={
   getItem(key){return loseReadback&&key==="khaemenes_family_registry_v1"?null:data.get(key)??null},
   setItem(key,value){if(failWrite)throw Error("storage-blocked");data.set(key,String(value))},
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
