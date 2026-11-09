"use strict";
// Run: node assets/khaemenes-stage-photo-entry.test.cjs
// Browser-local fake learner identities only. No student information or server calls.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"khaemenes-stage-photo-entry.js"),"utf8");
class Storage {
 constructor(){this.entries=new Map()}
 getItem(k){return this.entries.get(k)??null}
 setItem(k,v){this.entries.set(k,String(v))}
 removeItem(k){this.entries.delete(k)}
}
function makeNode(){
 return {
  dataset:{},style:{},children:[],hidden:false,textContent:"",
  setAttribute(k,v){this[k]=String(v)},
  handlers:{},
  addEventListener(event,fn){this.handlers[event]=fn},
  click(){this.handlers.click?.()},
  append(...items){this.children.push(...items)},
  replaceChildren(){this.children=[]}
 };
}
function caseRun(stage,learner){
 const store=new Storage(),host=makeNode(),events={};
 const doc={getElementById(id){return id==="target"?host:null},createElement(){return makeNode()}};
 let current=learner,registered=null;
 const yearbookCalls=[];
 const editor={register(next){if(registered)return false;registered=next;return true},open(){return Boolean(registered?.getIdentity())}};
 const win={
  KhaemenesFamilyRegistry:{getLearner(){return current}},
  KhaemenesUniversalProfileLookEditor:editor,
  KhaemenesYearbookProfileImages:{openYearbook(id){yearbookCalls.push(id);return true}},
  addEventListener(name,fn){events[name]=fn}
 };
 vm.runInNewContext(source,{window:win,document:doc,localStorage:store,Date,encodeURIComponent});
 assert.equal(win.KhaemenesStagePhotoEntry.create(stage,"target"),true);
 assert.equal(win.KhaemenesStagePhotoEntry.create(stage,"target"),false);
 return {adapter:registered,store,host,yearbookCalls,yearbookButton:host.children[0].children[1].children[3],setLearner(v){current=v;events["khaemenes-family-changed"]?.()}};
}
const middle=caseRun("middle",{stage:"middle",grade:"07",learnerId:"fictional-middle-a",nickname:"Learner A"});
assert.equal(middle.adapter.getIdentity().id,"fictional-middle-a");
middle.yearbookButton.click();
assert.equal(middle.yearbookCalls[0],"fictional-middle-a");
const look={frame:"circle",badge:"★",background:"forest",cardColor:"",nameFont:"academy"};
assert.equal(middle.adapter.commit({id:"fictional-middle-a",look,photo:""}),true);
assert.equal(middle.adapter.readLook("fictional-middle-a").frame,"circle");
assert.equal(middle.adapter.commit({id:"unrelated",look,photo:""}),false);
assert.equal(middle.adapter.commit({id:"fictional-middle-a",look:{...look,frame:"unsupported"},photo:""}),false);
assert.equal(middle.adapter.commit({id:"fictional-middle-a",look,photo:"https://example.test/image.jpg"}),false);
middle.setLearner({stage:"middle",grade:"08",learnerId:"fictional-middle-b",nickname:"Learner B"});
middle.yearbookButton.click();
assert.equal(middle.yearbookCalls[1],"fictional-middle-b");
assert.equal(middle.adapter.readPhoto("fictional-middle-b"),"");
assert.equal(middle.adapter.commit({id:"fictional-middle-a",look,photo:""}),false);
middle.setLearner({stage:"high",grade:"09",learnerId:"fictional-middle-a"});
assert.equal(middle.adapter.getIdentity(),null);
assert.equal(middle.host.children[0].hidden,true);
middle.yearbookButton.click();
assert.equal(middle.yearbookCalls.length,2);
const higher=caseRun("higher",{stage:"higher",selfDirectedAdult:true,learnerId:"fictional-scholar-a",nickname:"Scholar A"});
assert.equal(higher.adapter.getIdentity().id,"fictional-scholar-a");
higher.yearbookButton.click();
assert.equal(higher.yearbookCalls[0],"fictional-scholar-a");
assert.equal(higher.adapter.commit({id:"fictional-scholar-a",look,photo:""}),true);
higher.setLearner({stage:"higher",selfDirectedAdult:false,learnerId:"fictional-scholar-b"});
assert.equal(higher.adapter.getIdentity(),null);
assert.equal(higher.host.children[0].hidden,true);
higher.yearbookButton.click();
assert.equal(higher.yearbookCalls.length,1);
assert.ok([...middle.store.entries.keys()].every(k=>k.startsWith("khaemenes.stage.profile.look.v1:")));
console.log("PASS stage-photo entry isolation and local appearance checks (synthetic only)");
