#!/usr/bin/env node
/* Uses fictional learner IDs and an isolated in-memory browser storage stub only. */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const html=fs.readFileSync(path.join(__dirname,"..","student","index.html"),"utf8");
function between(start,end){const i=html.indexOf(start),j=html.indexOf(end,i+start.length);assert(i>=0&&j>i,"source anchors");return html.slice(i,j)}
const meta=between("const HIGH_PIN_META=Object.freeze({","const esc=");
const learnerFns=between("function readPins(){","function gradeLabel(l){");
const unpinFn=between("function unpinCourse(","function renderQuickPins(");
const A="fictional-a",B="fictional-b",store=new Map(),events=[];
const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const read=key=>JSON.parse(localStorage.getItem(key)||"null");
const PIN_KEY="khaemenes_course_pins_v1",HIGH_PIN_KEY="khaemenes-high-pinned-courses-v2";
const family={getLearner:id=>id===A||id===B?{learnerId:id}:null};
const context={localStorage,window:{dispatchEvent:event=>events.push(event.detail)},CustomEvent:class{constructor(_,opts){this.detail=opts.detail}},R:family,encodeURIComponent};
const code="const PIN_KEY="+JSON.stringify(PIN_KEY)+";const HIGH_PIN_KEY="+JSON.stringify(HIGH_PIN_KEY)+";const R=globalThis.R;"+meta+learnerFns+unpinFn+"globalThis.testAPI={learnerPins,unpinCourse};";
vm.runInNewContext(code,context,{filename:"academy-student-pin-view",timeout:1500});
const api=context.testAPI;
save(PIN_KEY,{version:1,learners:{
 [A]:[{id:"world-language-9-spanish",courseId:"world-language-9-spanish",title:"Spanish I"},{id:"english-9",courseId:"english-9",title:"English 9"}],
 [B]:[{id:"world-language-9-spanish",courseId:"world-language-9-spanish",title:"Spanish I"}]
}});
save(HIGH_PIN_KEY+":learner:"+encodeURIComponent(A),["world-language-9-spanish"]);
save(HIGH_PIN_KEY+":learner:"+encodeURIComponent(B),["world-language-9-spanish"]);
save("khaemenes-high-language-choices-v1:learner:"+encodeURIComponent(A),{"9":"french"});
save("khaemenes-high-language-choices-v1:learner:"+encodeURIComponent(B),{"9":"spanish"});
save("fictional-mastery-record",{score:87});
const french=api.learnerPins(A);
assert.deepEqual([...french.filter(p=>p.id.startsWith("world-language-9-")).map(p=>p.id)],["world-language-9-french"]);
assert.match(french.find(p=>p.id==="world-language-9-french").href,/\/apps\/French_101_index\.html$/);
assert.equal(french.find(p=>p.id==="world-language-9-french").title,"French 101");
assert.equal(french.some(p=>p.id==="english-9"),true);
assert.deepEqual([...api.learnerPins(B).filter(p=>p.id.startsWith("world-language-9-")).map(p=>p.id)],["world-language-9-spanish"]);
assert.equal(read("fictional-mastery-record").score,87);
assert.equal(api.unpinCourse({learnerId:A},"world-language-9-french"),true);
assert.equal(read(PIN_KEY).learners[A].some(p=>p.id.startsWith("world-language-9-")),false);
assert.equal(read(HIGH_PIN_KEY+":learner:"+encodeURIComponent(A)).some(p=>p.startsWith("world-language-9-")),false);
assert.equal(api.learnerPins(B).some(p=>p.id==="world-language-9-spanish"),true);
assert.equal(read("fictional-mastery-record").score,87);
assert.equal(events.some(e=>e.learnerId===A),true);
console.log("ACADEMY_LANGUAGE_PIN_DISPLAY=PASS French 101 visible, stale Spanish hidden, unpin and two-learner isolation.");
