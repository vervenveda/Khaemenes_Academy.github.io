"use strict";
/* Read-only parent schedule mirror regressions. No learner records, browser storage, or network.
 * Run: node --test tests/parent-schedule-mirror.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const mirror=require("../assets/khaemenes-parent-schedule-mirror-v1.js");
const html=fs.readFileSync(path.join(__dirname,"../family/index.html"),"utf8");
const catalog={slots:(grade,opts)=>[
 {index:1,label:"Mathematics",subject:"math",id:opts.mathId||null,title:opts.mathId||"Choose mathematics pathway",href:opts.mathId?"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/":null},
 {index:2,label:"Science",subject:"science",id:"integrated-science-9",title:"Integrated Science 9",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/integrated-science-9/"},
 {index:3,label:"Language Arts",subject:"languageArts",id:"english-9",title:"English 9",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/"},
 {index:4,label:"Social Studies",subject:"socialStudies",id:"global-studies-9",title:"Global Studies",href:null},
 {index:5,label:"PE / Health",subject:"peHealth",id:"physical-education-9",title:"PE 9",href:null},
 {index:6,label:"Psychology / Life Skills",subject:"psychology",id:"psychology-101",title:"Psychology 101",href:null},
 {index:7,label:"Foreign Language",subject:"foreignLanguage",id:opts.language?"world-language-9-"+opts.language:null,title:opts.language||"Choose foreign language",href:null},
 {index:8,label:"Elective",subject:"elective",id:"elective-9",title:"Elective",href:null}
]};
test("every subject is visible even with no published learner progress",()=>{
 const rows=mirror.rows({grade:"09"},[],{catalog});
 assert.equal(rows.length,8);
 assert.ok(rows.every(x=>x.status==="Not reported"));
 assert.ok(rows.every(x=>x.percent===null));
 assert.ok(rows[1].href.startsWith("https://vervenveda.com/"));
});
test("uses the learner's reported maths and language rather than inventing selections",()=>{
 const rows=mirror.rows({grade:"9"},[
  {courseId:"pre-algebra",courseTitle:"Pre-Algebra",progress:{percent:25}},
  {courseId:"world-language-9-french",progress:{percent:10}},
  {courseId:"integrated-science-9",stale:true,progress:{percent:95}}
 ],{catalog});
 assert.equal(rows[0].courseId,"pre-algebra");
 assert.equal(rows[6].courseId,"world-language-9-french");
 assert.equal(rows[1].percent,null);
 assert.equal(rows[1].status,"Refresh required");
});
test("unreported or unverified scores are never represented as zero",()=>{
 const rows=mirror.rows({grade:9},[{courseId:"english-9",progress:{percent:"99"}}],{catalog});
 assert.equal(rows[2].percent,null);
 assert.equal(rows[2].status,"Progress not reported");
});
test("course links disallow malicious or unrelated destinations",()=>{
 for(const value of ["javascript:alert(1)","http://vervenveda.com/","https://evil.example/student","data:text/plain,x"])
   assert.equal(mirror.allowedHref(value),"");
 assert.equal(mirror.allowedHref("https://vervenveda.com/Khaemenes_High.github.io/"),"https://vervenveda.com/Khaemenes_High.github.io/");
});
test("family course/profile interactions retain explicit permission checks",()=>{
 assert.ok(html.includes("data-parent-course"));
 assert.ok(html.includes("chooseLocalLearner(f,learnerId,{requireProgress:true})"));
 assert.ok(html.includes("chooseLocalLearner(f,link.dataset.learnerProfile,{requireProgress:true})"));
 assert.ok(html.includes("R.canAdult?.(adult.adultId,id,\"progress.view\")"));
 assert.ok(html.includes('document.querySelectorAll("[data-parent-course]").forEach'));
});
test("parent mirror never writes grade, mastery, course progress, or storage",()=>{
 const js=fs.readFileSync(path.join(__dirname,"../assets/khaemenes-parent-schedule-mirror-v1.js"),"utf8");
 assert.ok(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|\.setItem\(/.test(js));
 assert.ok(html.includes("this does not authorize parent submissions or grading"));
});

test("High School catalog is available before Family Portal's first render",()=>{
 const pins=html.indexOf("high-school-course-pins.js");
 const catalog=html.indexOf("high-school-eight-class.js");
 const mirror=html.indexOf("khaemenes-parent-schedule-mirror-v1.js");
 const firstRender=html.indexOf("\nrender();\n})();");
 assert.ok(pins>0&&catalog>pins&&mirror>catalog&&firstRender>mirror);
 assert.equal(html.split("high-school-eight-class.js").length-1,1);
});
test("legacy next-step navigation rejects unrelated or insecure destinations",()=>{
 assert.ok(html.includes('allowedHref?.(b.dataset.openNext)'));
 assert.ok(html.includes('chooseLocalLearner(f,learnerId,{requireProgress:true})'));
});
test("parent cards use readable single-line labels and no fabricated course completion",()=>{
 assert.ok(html.includes(".parent-schedule-course .btn{"));
 assert.ok(html.includes("font-size:16px;min-height:44px"));
 assert.ok(html.includes("Course progress appears only when published"));
});

test("unsafe next steps are not rendered as interactive course buttons",()=>{
 assert.ok(html.includes('window.KhaemenesParentScheduleMirror?.allowedHref?.(s.nextHref)?'));
});
test("course snapshot and status text respect minimum readable size",()=>{
 assert.ok(html.includes('#family-progress :is(.snapshot-meta,.snapshot-course small,.snapshot-status,.snapshot-action){font-size:16px'));
 assert.ok(html.includes('.parent-schedule-course .btn:focus-visible'));
});
