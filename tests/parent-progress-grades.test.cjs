"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const parent=fs.readFileSync(path.join(root,"family/progress/parent-progress.js"),"utf8");
const parentHtml=fs.readFileSync(path.join(root,"family/progress/index.html"),"utf8");
const contract=fs.readFileSync(path.join(root,"assets/khaemenes-learning-continuation.js"),"utf8");
new vm.Script(parent);
new vm.Script(contract);
assert.match(parent,/R\.canAdult\?\.\(adult\.adultId,l\.learnerId,"progress\.view"\)/);
assert.match(parent,/family\.adults\?\.some/);
assert.match(parent,/readLearner\?\.\(learner\.learnerId\)/);
assert.match(parent,/No current course report received/);
assert.match(parent,/No quiz or test scores|Not reported/);
assert.match(parent,/earned\/possible/);
assert.doesNotMatch(parent,/localStorage\.setItem|localStorage\.removeItem|\.publish\(/);
assert.match(parentHtml,/href="\.\.\/"[^>]*>Parent Portal/);
assert.match(parentHtml,/parent-progress\.js/);
assert.match(contract,/normalizeAssessments\(input\.assessments\)/);
class FakeStorage{
 constructor(){this.map=new Map()}
 getItem(k){return this.map.has(k)?this.map.get(k):null}
 setItem(k,v){this.map.set(k,String(v))}
 removeItem(k){this.map.delete(k)}
 get length(){return this.map.size}
 key(i){return [...this.map.keys()][i]||null}
}
const storage=new FakeStorage(),window={localStorage:storage,location:{href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/progress/"},dispatchEvent:()=>{}};
const ctx={window,Storage:FakeStorage,CustomEvent:class{constructor(name){this.type=name}},URL,Date,console};
vm.runInNewContext(contract,ctx);
const api=window.KhaemenesLearningContinuation;
api.publish({learnerId:"fixture-one",courseId:"english-9",status:"continue",
 assessments:[
  {id:"q1",kind:"quiz",earned:18,possible:20,title:"Quiz One"},
  {id:"t1",kind:"test",earned:45,possible:50,title:"Test One"},
  {id:"bad",kind:"quiz",earned:null,possible:10},
  {id:"fake",kind:"test",earned:200,possible:100},
  {id:"q1",kind:"quiz",earned:20,possible:20}
 ]});
let rows=api.readLearner("fixture-one");
assert.equal(rows.length,1);
assert.equal(rows[0].assessments.length,2);
assert.equal(rows[0].assessments.reduce((n,x)=>n+x.earned,0),63);
assert.equal(rows[0].assessments.reduce((n,x)=>n+x.possible,0),70);
assert.equal(api.readLearner("fixture-two").length,0);
api.publish({learnerId:"fixture-one",courseId:"science-9"});
rows=api.readLearner("fixture-one");
assert.equal(rows.find(x=>x.courseId==="science-9").assessments.length,0);
console.log("PASS parent progress permission source guards + explicit grade-item normalization with isolated synthetic records");
