/* Read-only parent view; Academy family registry owns permission decisions.
   Browser-local permissions do not constitute authenticated cloud access. */
(()=>{
"use strict";
const R=window.KhaemenesFamilyRegistry,C=window.KhaemenesLearningContinuation;
const status=document.getElementById("parentProgressStatus");
const workspace=document.getElementById("parentProgressWorkspace");
const controls=document.getElementById("parentProgressLearners");
const detail=document.getElementById("parentProgressDetail");
const make=(tag,content)=>{const node=document.createElement(tag);if(content!==undefined)node.textContent=content;return node};
const SUBJECTS=[
 ["Mathematics",/^pre-algebra$|^algebra-1$/],
 ["Language Arts",/^english-9$/],
 ["Science",/^integrated-science-9$/],
 ["Social Studies",/^global-studies-9$/],
 ["PE / Health",/^physical-education-9$/],
 ["Psychology / Life Skills",/^psychology-101$/],
 ["Foreign Language",/^world-language-9-/],
 ["Elective",/^elective-9$/]
];
function authorized(){
 const family=R?.getFamily?.(),adult=R?.getAdult?.();
 if(!family||!adult||!Array.isArray(family.learners)||!family.adults?.some(a=>a.adultId===adult.adultId))return [];
 return family.learners.filter(l=>l?.learnerId&&!l.selfDirectedAdult&&R.canAdult?.(adult.adultId,l.learnerId,"progress.view"));
}
function readGrades(report){
 const used=new Set(),items=[];
 for(const item of Array.isArray(report?.assessments)?report.assessments:[]){
  if(!item||!["quiz","test"].includes(item.kind)||typeof item.id!=="string"||used.has(item.id))continue;
  if(!Number.isFinite(item.earned)||!Number.isFinite(item.possible)||item.earned<0||item.possible<=0||item.earned>item.possible)continue;
  used.add(item.id);items.push(item);
 }
 const summary=kind=>{
  const list=items.filter(x=>!kind||x.kind===kind);
  const earned=list.reduce((n,x)=>n+x.earned,0),possible=list.reduce((n,x)=>n+x.possible,0);
  return {count:list.length,percent:possible>0?Math.round(1000*earned/possible)/10:null};
 };
 return {overall:summary(null),quizzes:summary("quiz"),tests:summary("test")};
}
const gradeText=x=>x.percent===null?"Not reported":x.percent+"% ("+x.count+" graded)";
let selected=null;
// Middle School homeschool evidence ledger; reported attempts are not certified transcript grades.
function middleEvidence(record){
 const section=make("section");section.className="middle-homeschool-ledger";
 const heading=make("h4","Homeschool Academic Evidence · Middle School");section.append(heading);
 const intro=make("p","36-week evidence ledger · Latest locally reported assessment attempt, not a certified transcript. A missing result does not mean a score of zero.");
 intro.className="small";section.append(intro);
 const assessments=record?.stale?[]:Array.isArray(record?.assessments)?record.assessments:[];
 const valid=new Map();
 for(const a of assessments){
   if(!a||!["quiz","test"].includes(a.kind)||typeof a.id!=="string"||valid.has(a.id)||
      !Number.isFinite(a.earned)||!Number.isFinite(a.possible)||a.earned<0||a.possible<=0||a.earned>a.possible)continue;
   valid.set(a.id,a);
 }
 const table=make("table");table.className="middle-evidence-table";
 const head=make("thead"),hr=make("tr");
 for(const t of ["Assessment","Recorded attempt","Score","Date"]){const th=make("th",t);hr.append(th)}
 head.append(hr);table.append(head);
 const body=make("tbody");
 const makeRow=(label,id,kind)=>{
   const a=valid.get(id),verified=!!a&&a.kind===kind;
   const score=verified?Math.round(1000*a.earned/a.possible)/10+"%":"Not reported";
   const earned=verified?a.earned+" / "+a.possible:"—";
   const date=verified&&a.gradedAt?String(a.gradedAt).slice(0,10):"—";
   const tr=make("tr");tr.append(make("td",label),make("td",earned),make("td",score),make("td",date));body.append(tr);
 };
 for(let w=1;w<=36;w++){const pad=String(w).padStart(2,"0");makeRow("Week "+pad,"week-"+pad,"quiz")}
 makeRow("Midterm","midterm","test");makeRow("Final","final","test");
 table.append(body);section.append(table);
 const review=record?.stale?{}:record?.evidence||{};
 const format=value=>typeof value==="boolean"?(value?"Recorded complete":"Not yet recorded complete"):"Not reported";
 section.append(make("p","Portfolio review: "+format(review.portfolioRecorded)));
 if(record?.courseId==="middle-grade-08")section.append(make("p","Grade 8 high-school transition review: "+format(review.transitionRecorded)));
 const complete=record?.progress?.completed,total=record?.progress?.total;
 const weeks=Number.isInteger(complete)&&total===36?complete+" / 36":"Not reported";
 section.append(make("p","Weeks meeting the recorded mastery threshold: "+weeks+". This count is separate from the displayed latest assessment attempts."));
 if(record?.stale)section.append(make("p","Source record is stale; assessment and approval indicators are withheld until refreshed from the matching learner course."));
 return section;
}

function reportCard(label,report){
 const card=make("article");card.className="subject";
 card.append(make("h3",label));
 const title=report?.courseTitle||"No course report received";
 card.append(make("p",title));
 const p=report?.progress?.percent;
 card.append(make("p","Course completion: "+(Number.isFinite(p)&&p>=0&&p<=100?Math.round(p)+"%":"Not reported")));
 const grades=readGrades(report?.stale?null:report);
 card.append(make("p","Quiz/test grade average: "+gradeText(grades.overall)));
 card.append(make("p","Quizzes: "+gradeText(grades.quizzes)+" · Tests: "+gradeText(grades.tests)));
 if(report&&/^middle-grade-0[678]$/.test(report.courseId||""))card.append(middleEvidence(report));
 if(report?.stale)card.append(make("p","The latest course summary is stale. Return to the course to refresh its report."));
 if(report?.nextTitle)card.append(make("p","Next step: "+report.nextTitle));
 if(report?.updatedAt){const date=new Date(report.updatedAt);if(Number.isFinite(date.getTime()))card.append(make("p","Last report: "+date.toLocaleString()));}
 return card;
}
function show(learner){
 if(!authorized().some(x=>x.learnerId===learner.learnerId)){render();return}
 detail.replaceChildren();
 const reports=(C?.readLearner?.(learner.learnerId)||[]).filter(x=>x.learnerId===learner.learnerId);
 const title=make("h2",(learner.nickname||"Learner")+" · Class Progress");detail.append(title);
 const printControls=make("div");printControls.className="actions print-controls";
 const printButton=make("button","Print Selected Learner Report");printButton.type="button";
 printButton.addEventListener("click",()=>{
   // Recheck permissions immediately before invoking the browser's print dialog.
   if(!authorized().some(x=>x.learnerId===learner.learnerId)) {render();return}
   if(selected!==learner.learnerId)return;
   window.print();
 });
 printControls.append(printButton);detail.append(printControls);
 const printNote=make("p","Locally reported academic summary · Not an official transcript or verified cloud record.");
 printNote.className="small";detail.append(printNote);
 const note=make("p","Averages use total earned points divided by total possible points. Missing or stale quiz/test scores remain unreported.");
 note.className="small";detail.append(note);
 const grid=make("div");grid.className="grid";
 const grade=String(learner.grade||"").replace(/^0/,"");
 if(grade==="9"){
  for(const [label,pattern] of SUBJECTS){
   const report=reports.filter(x=>pattern.test(x.courseId)).sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")))[0]||null;
   grid.append(reportCard(label,report));
  }
 }else{
  if(!reports.length)grid.append(make("p","No course reports have reached this browser for this learner."));
  for(const report of reports)grid.append(reportCard(report.subject||report.courseTitle||"Class",report));
 }
 detail.append(grid);
}
function render(){
 const learners=authorized();
 controls.replaceChildren();detail.replaceChildren();
 if(!R||!C||!learners.length){
  status.textContent="No permitted parent progress records are available. Open the Family Portal and select an adult with permission to view the learner's progress. This page never unlocks records using a URL parameter.";
  workspace.hidden=true;selected=null;return;
 }
 workspace.hidden=false;
 status.textContent="Parent view is available for "+learners.length+" locally permitted learner(s). Browser-local permissions are not a verified cloud sign-in.";
 if(!learners.some(l=>l.learnerId===selected))selected=learners[0].learnerId;
 for(const learner of learners){
  const btn=make("button",learner.nickname||"Learner");btn.type="button";
  btn.setAttribute("aria-pressed",String(selected===learner.learnerId));
  btn.addEventListener("click",()=>{selected=learner.learnerId;render()});
  controls.append(btn);
 }
 const chosen=learners.find(l=>l.learnerId===selected);
 if(chosen)show(chosen);
}
window.addEventListener("khaemenes-family-changed",render);
window.addEventListener("khaemenes-learning-continuation-changed",render);
window.addEventListener("storage",e=>{if(!e.key||/khaemenes_(family|active)|continuation/.test(e.key))render()});
window.addEventListener("pageshow",render);
render();
})();