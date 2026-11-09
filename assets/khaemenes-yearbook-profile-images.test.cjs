"use strict";
// node assets/khaemenes-yearbook-profile-images.test.cjs
// No production learner, network, password, or real browser storage.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"khaemenes-yearbook-profile-images.js"),"utf8");
class Storage{
 constructor(){this.map=new Map()}
 getItem(k){return this.map.get(k)??null}
 setItem(k,v){this.map.set(k,String(v))}
}
function makeIDB(records){
 const db={close(){},transaction(){return{objectStore(){return{get(id){const req={};queueMicrotask(()=>{req.result=records.get(id)||null;req.onsuccess?.()});return req}}}}}};
 return {open(){const req={result:db};queueMicrotask(()=>req.onsuccess?.());return req}};
}
async function main(){
 const storage=new Storage(),photos=new Map([["p_test1",{id:"p_test1",data:"data:image/jpeg;base64,ZmFrZQ==",caption:"My photo"}]]);
 let selected="learner-a";
 const w={
  indexedDB:makeIDB(photos),
  KhaemenesFamilyRegistry:{getLearner(){return{learnerId:selected}}},
  localStorage:storage
 };
 const doc={};
 vm.runInNewContext(source,{window:w,document:doc,localStorage:storage,indexedDB:w.indexedDB,encodeURIComponent});
 const bridge=w.KhaemenesYearbookProfileImages;
 assert.ok(bridge);
 assert.equal(await bridge.publish("learner-b","p_test1"),false);
 assert.equal(await bridge.publish("learner-a","invalid"),false);
 assert.equal(await bridge.publish("learner-a","p_missing"),false);
 assert.equal(await bridge.publish("learner-a","p_test1"),true);
 assert.equal(await bridge.publish("learner-a","p_test1"),true);
 assert.equal((await bridge.available("learner-a")).length,1);
 assert.equal((await bridge.available("learner-b")).length,0);
 assert.equal(JSON.parse(storage.getItem("khaemenes.yearbook.profileChoices.v1:learner-a")).length,1);
 selected="learner-b";
 assert.equal((await bridge.available("learner-b")).length,0);
 assert.equal((await bridge.available("learner-a")).length,0);
 assert.equal(await bridge.publish("learner-a","p_test1"),false);
 photos.delete("p_test1");
 selected="learner-a";
 assert.equal((await bridge.available("learner-a")).length,0);
 assert.equal(bridge.choose("learner-b",()=>true),false);
 assert.equal(storage.map.has("khaemenes.grade09.profile.photo:learner-a"),false);
 console.log("PASS yearbook references: explicit opt-in, deduplication, learner isolation, deleted images and no profile writes");
}
main().catch(error=>{console.error(error);process.exitCode=1});
