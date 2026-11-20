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
assert.match(parent,/No course report received/);
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

api.publish({learnerId:"fixture-one",courseId:"middle-grade-08",stage:"middle",grade:"Eighth Grade",
 progress:{completed:22,total:36,percent:61},
 assessments:[{id:"week-01",kind:"quiz",earned:17,possible:20,gradedAt:"2026-11-20T18:00:00Z"},
 {id:"midterm",kind:"test",earned:32,possible:40}],
 evidence:{portfolioRecorded:true,transitionRecorded:false}});
const middle=api.readCourse("fixture-one","middle-grade-08");
assert.equal(middle.evidence.portfolioRecorded,true);
assert.equal(middle.evidence.transitionRecorded,false);
assert.equal(middle.assessments.length,2);
assert.equal(api.readCourse("fixture-two","middle-grade-08"),null);
api.publish({learnerId:"fixture-two",courseId:"middle-grade-07",evidence:{portfolioRecorded:"true",transitionRecorded:1}});
const unknown=api.readCourse("fixture-two","middle-grade-07");
assert.equal(unknown.evidence.portfolioRecorded,null,"String approvals may not become verified booleans");
assert.equal(unknown.evidence.transitionRecorded,null,"Numeric approvals must be rejected");

console.log("PASS parent progress permission source guards + explicit grade-item normalization with isolated synthetic records");


assert.match(parentHtml,/@media print\s*\{/);
assert.doesNotMatch(parentHtml,/#parentProgressWorkspace\s*\{\s*display:block!important/);
assert.match(parent,/Print Selected Learner Report/);
assert.match(parent,/if\(selected!==learner\.learnerId\)return/);
assert.match(parent,/window\.print\(\)/);

// Synthetic UI acceptance: only locally permitted learners can appear or print.
class FakeNode{
 constructor(tag){this.tagName=tag;this.children=[];this.events={};this.textContent="";this.attributes={};this.hidden=false;this.className=""}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(type,fn){this.events[type]=fn}
 click(){this.events.click?.()}
}
const nodes=Object.fromEntries(["parentProgressStatus","parentProgressWorkspace","parentProgressLearners","parentProgressDetail"].map(id=>[id,new FakeNode("section")]));
const document={getElementById:id=>nodes[id],createElement:tag=>new FakeNode(tag)};
let adultId="adult-1",allowed=new Set(["child-a","child-b"]),printed=0,readIds=[];
const family={adults:[{adultId:"adult-1"}],learners:[
 {learnerId:"child-a",nickname:"Student A",grade:"07"},
 {learnerId:"child-b",nickname:"Student B",grade:"08"},
 {learnerId:"child-c",nickname:"Student C",grade:"06"}]};
const uiWindow={
 KhaemenesFamilyRegistry:{getFamily:()=>family,getAdult:()=>adultId?{adultId}:null,
  canAdult:(a,l,p)=>a===adultId&&p==="progress.view"&&allowed.has(l)},
 KhaemenesLearningContinuation:{readLearner:id=>{readIds.push(id);return [{
  learnerId:id,courseId:id==="child-b"?"middle-grade-08":"middle-grade-07",
  courseTitle:"Middle School",progress:{completed:12,total:36,percent:33},
  assessments:id==="child-b"?[{id:"week-01",kind:"quiz",earned:18,possible:20,gradedAt:"2026-11-20T18:00:00Z"},{id:"midterm",kind:"test",earned:32,possible:40}]:[],
  evidence:id==="child-b"?{portfolioRecorded:true,transitionRecorded:false}:{portfolioRecorded:false,transitionRecorded:null}
 }]}},
 addEventListener:()=>{},print:()=>printed++};
vm.runInNewContext(parent,{window:uiWindow,document,Date,console});
const controls=nodes.parentProgressLearners,detail=nodes.parentProgressDetail;
assert.deepEqual(controls.children.map(x=>x.textContent),["Student A","Student B"]);
assert.equal(nodes.parentProgressWorkspace.hidden,false);
assert.equal(readIds.at(-1),"child-a");
let btn=detail.children.find(x=>x.className==="actions print-controls").children[0];
btn.click();assert.equal(printed,1);

controls.children[1].click();
assert.equal(readIds.at(-1),"child-b");
const walk=node=>[node,...(node.children||[]).flatMap(walk)];
const texts=walk(detail).map(node=>node.textContent).filter(Boolean);
assert(texts.includes("Week 01"),"Homeschool ledger must have 36 weekly lines");
assert(texts.includes("Week 36"),"Homeschool ledger must include the final week");
assert(texts.includes("Midterm")&&texts.includes("Final"),"Ledger must include both cumulative exams");
assert(texts.includes("18 / 20")&&texts.includes("32 / 40"),"Ledger must print exact recorded points");
assert(texts.includes("Grade 8 high-school transition review: Not yet recorded complete"),"Pending Grade 8 transition must be explicit");
assert(texts.includes("Portfolio review: Recorded complete"),"Adult review flag must be shown as local status");
assert(texts.includes("Not reported"),"Missing results must never become zeros");

btn=detail.children.find(x=>x.className==="actions print-controls").children[0];
btn.click();assert.equal(printed,2);
allowed=new Set(["child-a"]);btn.click();assert.equal(printed,2,"Revoked access must not open print");
assert.deepEqual(controls.children.map(x=>x.textContent),["Student A"]);
adultId=null;
const restricted=detail.children.find(x=>x.className==="actions print-controls").children[0];
restricted.click();assert.equal(printed,2);
assert.equal(nodes.parentProgressWorkspace.hidden,true);
assert.equal(detail.children.length,0,"Denied adults must not retain rendered learner details");
console.log("PASS parent progress synthetic UI: two learners, selection, print, access revocation and denied-adult isolation");
