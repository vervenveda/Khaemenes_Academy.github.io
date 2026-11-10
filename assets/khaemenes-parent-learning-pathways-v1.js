/* Family Portal learning-pathway links, stage-aware and read-only.
 * Verified paths point to existing Academy student profiles/campuses only.
 * Pure helper: never impersonates learner, changes placement, or edits records.
 */
(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.KhaemenesParentLearningPathways=api})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const ROOT="https://vervenveda.com/";
const safe=(value)=>{try{const u=new URL(value,ROOT);return u.protocol==="https:"&&u.hostname==="vervenveda.com"&&u.pathname.startsWith("/")?u.href:""}catch{return""}};
function gradeOf(value){const raw=String(value??"").replace(/^grade[- ]?/i,"").trim().toLowerCase();if(raw==="pre-k"||raw==="prek")return "pre-k";if(raw==="k"||raw==="kindergarten")return "k";if(/^(?:0?[1-9]|1[0-2])$/.test(raw))return String(Number(raw)).padStart(2,"0");return null}
function links(learner){
 const grade=gradeOf(learner?.grade),stage=String(learner?.stage||"").toLowerCase().trim();
 if(learner?.selfDirectedAdult===true||stage==="higher")return Object.freeze({stage:"higher",title:"Higher Learning · Adult Pathway",links:Object.freeze([]),notice:"Adult coursework belongs to its own account and cannot be opened as a child learner."});
 let group=null,items=[];
 if(stage==="preschool"&&grade==="pre-k"){group="preschool";items=[["Student Profile","Khaemenes_Preschool.github.io/student-profile/"],["Preschool Learning","Khaemenes_Preschool.github.io/"]]}
 else if(stage==="kindergarten"&&grade==="k"){group="kindergarten";items=[["Student Profile","Khaemenes_KinderGarden.github.io/student-profile/"],["Kindergarten Learning","Khaemenes_KinderGarden.github.io/"]]}
 else if(stage==="elementary"&&["01","02","03","04","05"].includes(grade)){group="elementary";items=[["Student Profile","Khaemenes_Elementary.github.io/student-profile/"],["Elementary Learning","Khaemenes_Elementary.github.io/"]]}
 else if(stage==="middle"&&["06","07","08"].includes(grade)){group="middle";const g="grade-"+grade+"/";items=[["Grade "+Number(grade)+" Learning","Khaemenes_Middle.github.io/grades/"+g],["Middle School Campus","Khaemenes_Middle.github.io/"]]}
 if(!group)return Object.freeze({stage:"unresolved",title:"Learning Pathway",links:Object.freeze([]),notice:"Verify the learner's stage and placement before opening a grade pathway."});
 return Object.freeze({stage:group,title:"Learning Pathway · Parent View",
  links:Object.freeze(items.map(([label,path])=>Object.freeze({label,href:safe(ROOT+path)}))),
  notice:"Opens existing school pages. Published course progress may be incomplete; this is not an authenticated read-only course session."});
}
return Object.freeze({version:"1.0",gradeOf,links});
});
