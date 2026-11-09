"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const code = fs.readFileSync(path.join(__dirname, "../../../assets/khaemenes-family-registry.js"), "utf8");
class Storage {
  constructor(){this.map=new Map()}
  getItem(k){return this.map.has(k)?this.map.get(k):null}
  setItem(k,v){this.map.set(k,String(v))}
  removeItem(k){this.map.delete(k)}
}
let counter=0;
const window = {localStorage:new Storage(),location:{origin:"https://vervenveda.com"},crypto:{randomUUID:()=>`test-${++counter}`},addEventListener(){},dispatchEvent(){}};
vm.runInNewContext(code,{window,CustomEvent:class{constructor(name,args){this.type=name;this.detail=args?.detail}}});
const r=window.KhaemenesFamilyRegistry;
const a=r.createFamilyIntake({displayName:"Test Family A",adultName:"Adult A",nickname:"Learner A",grade:"09"});
const b=r.createFamilyIntake({displayName:"Test Family B",adultName:"Adult B",nickname:"Learner B",grade:"10"});
assert.equal(r.canAdult(a.adultId,a.learnerId,"learner.view"),true);
assert.equal(r.canAdult(b.adultId,a.learnerId,"learner.view"),false);
assert.throws(()=>r.grantAdultAccess({familyId:a.familyId,adultId:b.adultId,learnerId:a.learnerId}),/adult-family-mismatch/);
assert.throws(()=>r.grantAdultAccess({familyId:b.familyId,adultId:b.adultId,learnerId:a.learnerId}),/learner-family-mismatch/);
const registry=r.load();
registry.memberships[`${a.familyId}:${a.adultId}`].status="revoked";
r.save(registry);
assert.equal(r.canAdult(a.adultId,a.learnerId,"learner.view"),false);
registry.memberships[`${a.familyId}:${a.adultId}`].status="active";
registry.families[a.familyId].learnerIds=[];
r.save(registry);
assert.equal(r.canAdult(a.adultId,a.learnerId,"learner.view"),false);
console.log("Family relationship guards: PASS (synthetic, browser-local only)");
