"use strict";
// Synthetic parent learning-pathway tests. No live student records or network.
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const module=require("../assets/khaemenes-parent-learning-pathways-v1.js");
const html=fs.readFileSync(path.resolve(__dirname,"../family/index.html"),"utf8");
const subjects=[
 {grade:"pre-k",stage:"preschool",name:"Preschool"},
 {grade:"k",stage:"kindergarten",name:"KinderGarden"},
 {grade:"01",stage:"elementary",name:"Elementary"},
 {grade:"05",stage:"elementary",name:"Elementary"},
 {grade:"06",stage:"middle",name:"grade-06"},
 {grade:"07",stage:"middle",name:"grade-07"},
 {grade:"08",stage:"middle",name:"grade-08"}
];
test("each supported grade supplies verified-profile or campus navigation",()=>{
 for(const l of subjects){
   const p=module.links(l);
   assert.ok(p.links.length>=2,l.name);
   assert.ok(p.links.every(x=>x.href.startsWith("https://vervenveda.com/Khaemenes_")),l.name);
   assert.ok(p.links.some(x=>x.href.includes(l.name)),l.name);
 }
});
test("mismatched grades and school stages do not route into the wrong campus",()=>{
 for(const learner of [{grade:"09",stage:"elementary"},{grade:"k",stage:"middle"},{grade:"04",stage:"preschool"}])
   assert.equal(module.links(learner).links.length,0);
});
test("Higher Learning adult accounts are kept distinct from linked K-12 children",()=>{
 const p=module.links({grade:null,stage:"higher",selfDirectedAdult:true});
 assert.equal(p.links.length,0);
 assert.ok(p.notice.includes("own account"));
});
test("parent pathway cards use same permission-gated course navigation as grade 9",()=>{
 assert.ok(html.includes('window.KhaemenesParentLearningPathways?.links?.(l)'));
 assert.ok(html.includes('data-parent-course="'));
 assert.ok(html.includes("chooseLocalLearner(f,learnerId,{requireProgress:true})"));
 assert.ok(html.includes("progress.view"));
});
test("pathway helper performs no learner storage mutation or background requests",()=>{
 const source=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-parent-learning-pathways-v1.js"),"utf8");
 assert.ok(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|\.setItem\(|\.removeItem\(/.test(source));
});
