/* Synthetic-only local Family Registry security regression. Run: node academy/testing/families/family-security-regression.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"../../../assets/khaemenes-family-registry.js"),"utf8");
class FakeStorage {
 constructor(){this.items=new Map()}
 getItem(key){return this.items.has(key)?this.items.get(key):null}
 setItem(key,value){this.items.set(key,String(value))}
 removeItem(key){this.items.delete(key)}
}
class FakeEvent {constructor(type,opts={}){this.type=type;this.detail=opts.detail}}
function registry(){
 let next=0;
 const context={window:{
  localStorage:new FakeStorage(),
  location:{origin:"https://vervenveda.com"},
  crypto:{randomUUID:()=>`synthetic-${++next}`},
  dispatchEvent(){},addEventListener(){}
 },CustomEvent:FakeEvent};
 vm.runInNewContext(source,context,{filename:"khaemenes-family-registry.js"});
 return context.window.KhaemenesFamilyRegistry;
}
const r=registry();
const a=r.createFamilyIntake({displayName:"Test House A",adultName:"Adult A",nickname:"Learner A",grade:"09"});
const b=r.createFamilyIntake({displayName:"Test House B",adultName:"Adult B",nickname:"Learner B",grade:"10"});
assert.throws(()=>r.grantAdultAccess({familyId:a.familyId,adultId:b.adultId,learnerId:a.learnerId}),/adult-family-mismatch/);
assert.equal(r.canAdult(b.adultId,a.learnerId,"learner.view"),false);
assert.throws(()=>r.registerLearner({familyId:b.familyId,existingLearnerId:a.learnerId,nickname:"Takeover",grade:"09"}),/learner-id-already-assigned/);
assert.throws(()=>r.registerLearner({familyId:a.familyId,existingLearnerId:a.learnerId,nickname:"Overwrite",grade:"09"}),/learner-id-already-assigned/);
assert.equal(r.getLearner(a.learnerId).familyId,a.familyId);
assert.throws(()=>r.addAdultLocal({familyId:a.familyId,displayName:"Invalid Link",learnerIds:[b.learnerId]}),/learner-family-mismatch/);
assert.throws(()=>r.registerAdultLearner({familyId:a.familyId,adultId:b.adultId,nickname:"Invalid Scholar"}),/adult-family-mismatch/);
const second=r.addAdultLocal({familyId:a.familyId,displayName:"Adult A2",learnerIds:[a.learnerId]});
assert.equal(r.canAdult(second.adultId,a.learnerId,"learner.view"),true);
r.revokeAdultAccess({adultId:second.adultId,learnerId:a.learnerId});
assert.equal(r.canAdult(second.adultId,a.learnerId,"learner.view"),false);
const added=r.registerLearner({familyId:a.familyId,nickname:"Additional Learner",grade:"09",stage:"high"});
assert.equal(added.familyId,a.familyId);
const original=r.exportFamily(a.familyId);
assert.equal(r.validateFamilyExport(original).ok,true);
const altered=fn=>{const value=JSON.parse(JSON.stringify(original));fn(value);return value};
for(const tamper of [
 x=>x.family.learnerIds.push("missing"),
 x=>x.access.push({...x.access[0]}),
 x=>x.access[0].permissions.push("admin.private.read"),
 x=>x.access[0].status="elevated",
 x=>x.family.adultIds.splice(0),
 x=>x.family.learnerIds.push(x.family.learnerIds[0])
]){
 assert.equal(r.validateFamilyExport(altered(tamper)).ok,false);
}
console.log("PASS synthetic family isolation, identity, authorized membership and backup validation regressions");
