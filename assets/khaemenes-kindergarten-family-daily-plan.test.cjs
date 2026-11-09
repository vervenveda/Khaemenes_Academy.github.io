"use strict";
// node assets/khaemenes-kindergarten-family-daily-plan.test.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"khaemenes-kindergarten-family-daily-plan.js"),"utf8");
const records=new Map();let learnerId="kid-a",adultId="adult-a",allow=true,events=0;
const learners={
 "kid-a":{learnerId:"kid-a",stage:"kindergarten",familyId:"family-a"},
 "kid-b":{learnerId:"kid-b",stage:"kindergarten",familyId:"family-a"},
 "older":{learnerId:"older",stage:"high",familyId:"family-a"}
};
const adults={"adult-a":{adultId:"adult-a",familyIds:["family-a"]},"outsider":{adultId:"outsider",familyIds:["family-z"]}};
const registry={
 getLearner(){return learners[learnerId]},
 getAdult(id){return adults[id]||null},
 activeIds(){return {adultId,learnerId}},
 canAdult(a,l,perm){return allow&&a==="adult-a"&&l!== "older"&&perm==="education.manage"}
};
const store={getItem(k){return records.get(k)??null},setItem(k,v){records.set(k,String(v))}};
const w={KhaemenesFamilyRegistry:registry,localStorage:store,dispatchEvent(){events++}};
vm.runInNewContext(source,{window:w,Date,CustomEvent:class{}});
const plan=w.KhaemenesKinderFamilyDailyPlan;
assert.ok(plan);
assert.equal(plan.state("kid-b"),null,"no access to unselected learner");
assert.equal(plan.configure("kid-a",["read","create","move"]),true);
assert.equal(plan.today("kid-a").activities.length,3);
assert.equal(plan.configure("kid-a",["read","read"]),false,"duplicates rejected");
assert.equal(plan.configure("kid-a",["invalid"]),false,"unapproved activities rejected");
assert.equal(plan.configure("kid-a",[]),false,"empty plan rejected");
assert.equal(plan.configure("kid-a",["read","create","move","music","quiet","kindness"]),false,"more than 5 rejected");
assert.equal(plan.checkIn("kid-a","read"),true);
assert.equal(plan.today("kid-a").activities.find(x=>x.id==="read").checked,true);
assert.equal(plan.checkIn("kid-a","read",false),true);
assert.equal(plan.today("kid-a").activities.find(x=>x.id==="read").checked,false);
assert.equal(plan.checkIn("kid-a","invalid"),false,"not on plan");
assert.equal(plan.checkIn("kid-a","read",true,"2020-01-01"),false,"no backdating");
adultId="outsider";
assert.equal(plan.configure("kid-a",["music"]),false,"foreign family adult denied");
adultId="adult-a";allow=false;
assert.equal(plan.configure("kid-a",["music"]),false,"adult without education manage denied");
allow=true;learnerId="kid-b";
assert.equal(plan.today("kid-b").activities.length,5,"independent default for sibling");
assert.equal(plan.today("kid-a"),null,"selection cannot inspect sibling");
assert.equal(plan.checkIn("kid-a","read"),false,"selection cannot write sibling");
learnerId="older";
assert.equal(plan.today("older"),null,"other grade excluded");
assert.equal(plan.configure("older",["read"]),false);
assert.ok([...records.keys()].every(k=>k.startsWith("khaemenes.kindergarten.family.daily.v1:")));
assert.ok(![...records.keys()].some(k=>/mastery|receipt|placement|grade/.test(k)));
assert.ok(events>=3);
console.log("PASS: Kindergarten family daily plan selection, permission, check-ins, sibling isolation and no mastery writes");
