/* Academy Family Enrollment — local, permission-checked course progress CSV export.
 * Read-only. A snapshot is not proof of enrollment; never invent missing grades.
 * Requires a selected registered adult with learner.view + progress.view + records.export.
 * No network, no profile switching and no registry writes.
 */
(()=>{"use strict";
const R=window.KhaemenesFamilyRegistry,C=window.KhaemenesLearningContinuation;
const SUBJECTS_09=[
 ["Mathematics",/^pre-algebra$|^algebra-1$/],
 ["Language Arts",/^english-9$|^ela09$/],
 ["Science",/^integrated-science-9$/],
 ["Social Studies",/^global-studies-9$/],
 ["PE / Health",/^physical-education-9$/],
 ["Psychology / Life Skills",/^psychology-101$/],
 ["Foreign Language",/^world-language-9-/],
 ["Elective",/^elective-9$/]
];
const valid=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100;
const clean=x=>String(x??"").replace(/[\u0000-\u001f\u007f]/g," ").trim();
const gradeAverage=snapshot=>{
 const ids=new Set();let earned=0,possible=0,count=0;
 for(const row of Array.isArray(snapshot?.assessments)?snapshot.assessments:[]){
  if(!row||!["quiz","test"].includes(row.kind)||typeof row.id!=="string"||ids.has(row.id))continue;
  if(!Number.isFinite(row.earned)||!Number.isFinite(row.possible)||row.possible<=0||row.earned<0||row.earned>row.possible)continue;
  ids.add(row.id);earned+=row.earned;possible+=row.possible;count++;
 }
 return {percent:possible>0?Math.round(earned/possible*1000)/10:null,count};
};
function session(){
 const family=R?.getFamily?.(),adult=R?.getAdult?.();
 if(!family||!adult||!family.adults?.some(a=>a.adultId===adult.adultId))return null;
 return {family,adult};
}
function allows(adult,learner){
 return Boolean(adult&&learner&&["learner.view","progress.view","records.export"].every(p=>{
  try{return R.canAdult?.(adult.adultId,learner.learnerId,p)===true}catch{return false}
 }));
}
const freshCourse=s=>s&&!s.stale&&s.learnerId&&s.courseId;
function reportsFor(learner){
 try{return (C?.readLearner?.(learner.learnerId)||[]).filter(s=>s?.learnerId===learner.learnerId&&s.courseId)}
 catch{return []}
}
function recent(reports){return reports.slice().sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")))[0]||null}
function rowFor(learner,label,snapshot,origin){
 const good=freshCourse(snapshot);
 const average=gradeAverage(good?snapshot:null);
 return {
  learner:clean(learner.nickname||"Learner"),
  grade:clean(R.gradeMeta?.[learner.grade]?.label||learner.grade||"Unplaced"),
  subject:clean(label),
  course:clean(snapshot?.courseTitle||label),
  gradePercent:average.percent,
  gradedAssessments:average.count,
  completedPercent:good&&valid(snapshot.progress?.percent)?snapshot.progress.percent:null,
  reporting:!snapshot?"Not reported":snapshot.stale?"Stale report — refresh course":"Locally reported",
  updatedAt:clean(snapshot?.updatedAt||""),
  source:origin
 };
}
function learnerRows(learner){
 const reports=reportsFor(learner),used=new Set(),rows=[];
 const grade=String(learner.grade||"").replace(/^0/,"");
 if(grade==="9"){
  for(const [label,pattern] of SUBJECTS_09){
   const matches=reports.filter(s=>pattern.test(s.courseId));
   if(matches.length){
    // Keep distinct published classes; a learner can take several math/elective courses.
    const perCourse=new Map();
    for(const record of matches){const existing=perCourse.get(record.courseId);if(!existing||String(record.updatedAt||"")>String(existing.updatedAt||""))perCourse.set(record.courseId,record)}
    for(const snap of perCourse.values()){
     used.add(snap.courseId);
     rows.push(rowFor(learner,label,snap,"Published Grade 9 class report (enrollment unverified)"));
    }
   }else{
    rows.push(rowFor(learner,label,null,"Grade 9 subject pathway (enrollment unverified)"));
   }
  }
 }
 for(const snap of reports){
  if(used.has(snap.courseId))continue;
  used.add(snap.courseId);
  rows.push(rowFor(learner,snap.subject||snap.courseTitle||snap.courseId,snap,"Published course report (enrollment unverified)"));
 }
 if(!rows.length)rows.push(rowFor(learner,"No course report available",null,"No enrollment roster connected"));
 return rows;
}
const csvField=value=>{
 let str=String(value??"");
 // Prevent spreadsheet formula execution when opening downloaded records.
 if(/^[\s\uFEFF]*[=+@\-\t\r]/.test(str))str="'"+str;
 return '"'+str.replace(/"/g,'""')+'"';
};
const dateStamp=()=>new Date().toISOString().slice(0,10);
function reportCSV(rows,subject){
 const heads=["Learner","Grade placement","Subject","Course","Quiz/test grade (%)","Graded quizzes/tests","Course completed (%)","Report state","Last report","Roster interpretation"];
 const lines=[
  ["Khaemenes Academy — Provisional Family Class Progress Export"],
  ["Scope",subject],
  ["Generated at",new Date().toISOString()],
  ["Notice","Browser-local, unofficial. Completion is not grade. Missing/stale data are NOT zero. A report does not establish enrollment or verified guardian identity."],
  heads,
  ...rows.map(r=>[r.learner,r.grade,r.subject,r.course,r.gradePercent===null?"Not reported":r.gradePercent,r.gradedAssessments,r.completedPercent===null?"Not reported":r.completedPercent,r.reporting,r.updatedAt,r.source])
 ];
 return "\uFEFF"+lines.map(row=>row.map(csvField).join(",")).join("\r\n")+"\r\n";
}
function downloadCSV(csv,name){
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);
 try{a.click()}finally{a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
}
function exportOne(learnerId){
 const ctx=session();
 if(!ctx||!C?.readLearner)return {ok:false,message:"Family progress reports are unavailable in this browser."};
 const learner=ctx.family.learners.find(l=>l.learnerId===learnerId&&!l.selfDirectedAdult);
 if(!learner||!allows(ctx.adult,learner))return {ok:false,message:"Export not permitted for this learner. Select an authorized adult in the Family Hub."};
 const rows=learnerRows(learner);
 downloadCSV(reportCSV(rows,"Individual learner progress"),"khaemenes-learner-progress-"+dateStamp()+".csv");
 return {ok:true,message:"Learner CSV exported from available local course reports."};
}
function exportFamily(adultId){
 const ctx=session();
 if(!ctx||!C?.readLearner)return {ok:false,message:"Family progress reports are unavailable in this browser."};
 // Only the selected local adult may initiate an export from their own overview.
 if(ctx.adult.adultId!==adultId)return {ok:false,message:"Select this adult in Family Hub to review export permissions."};
 const learners=ctx.family.learners.filter(l=>!l.selfDirectedAdult&&allows(ctx.adult,l));
 if(!learners.length)return {ok:false,message:"No learners with records-export permission for this adult."};
 const rows=learners.flatMap(learnerRows);
 downloadCSV(reportCSV(rows,"Authorized family learner progress"),"khaemenes-family-progress-"+dateStamp()+".csv");
 return {ok:true,message:"Family CSV exported for "+learners.length+" permitted learner(s)."};
}
function previewOne(learnerId){
 const ctx=session();
 if(!ctx||!C?.readLearner)return {ok:false,message:"Local class reports are unavailable."};
 const learner=ctx.family.learners.find(l=>l.learnerId===learnerId&&!l.selfDirectedAdult);
 if(!learner||!allows(ctx.adult,learner))return {ok:false,message:"You do not have local permission to view and export this learner's records."};
 return {ok:true,rows:learnerRows(learner),scope:"Individual learner"};
}
function previewFamily(adultId){
 const ctx=session();
 if(!ctx||!C?.readLearner)return {ok:false,message:"Local class reports are unavailable."};
 if(ctx.adult.adultId!==adultId)return {ok:false,message:"Only the currently selected adult can view this family report."};
 const learners=ctx.family.learners.filter(l=>!l.selfDirectedAdult&&allows(ctx.adult,l));
 if(!learners.length)return {ok:false,message:"No learners have both progress-view and export permission for this adult."};
 return {ok:true,rows:learners.flatMap(learnerRows),scope:"Authorized family learners"};
}
window.KhaemenesFamilyProgressExport=Object.freeze({
 version:"1.0.0",previewOne,previewFamily,canExport:learnerId=>{
  const c=session();return Boolean(c&&c.family.learners.some(l=>l.learnerId===learnerId&&allows(c.adult,l)));
 },exportOne,exportFamily
});
})();