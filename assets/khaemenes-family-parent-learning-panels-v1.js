/* Academy Parent Profile: three read-only/learner-selectable expandable panels.
 * Existing course authority and family permissions remain in their original modules.
 * No new storage schema, account identity or grade writes. */
(()=>{"use strict";
const R=window.KhaemenesFamilyRegistry,C=window.KhaemenesLearningContinuation;
const root=document.getElementById("parentProfileLearningPanels");
if(!root||!R)return;
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const stages={preschool:"Preschool",kindergarten:"Kindergarten",elementary:"Elementary",middle:"Middle School",high:"High School",higher:"Higher Learning"};
const profile=l=>{
 const stage=String(l.stage||"").toLowerCase(),n=Number(String(l.grade||"").replace(/^grade[- ]?/i,""));
 if(stage==="high"&&n>=9&&n<=12)return "https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+String(n).padStart(2,"0")+"/student-profile/";
 if(stage==="elementary"&&n>=1&&n<=5)return "https://vervenveda.com/Khaemenes_Elementary.github.io/student-profile/";
 if(stage==="middle"&&n>=6&&n<=8)return "https://vervenveda.com/Khaemenes_Middle.github.io/grades/grade-"+String(n).padStart(2,"0")+"/";
 if(stage==="kindergarten")return "https://vervenveda.com/Khaemenes_KinderGarden.github.io/student-profile/";
 if(stage==="preschool")return "https://vervenveda.com/Khaemenes_Preschool.github.io/student-profile/#learningStudio";
 return "../";
};
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
function permission(f,learner){
 const id=R.activeIds?.().adultId,adult=id?R.getAdult?.(id):null;
 return !!(adult&&f.adultIds?.includes(adult.adultId)&&R.canAdult?.(adult.adultId,learner.learnerId,"progress.view"));
}
let refreshPending=false;
function refreshLater(){if(refreshPending)return;refreshPending=true;setTimeout(()=>{refreshPending=false;render()},0)}
function render(){
 const f=R.getFamily?.(),ids=R.activeIds?.()||{},learners=f?.learners?.filter(l=>l&&!l.selfDirectedAdult&&l.familyId===f.familyId)||[];
 const openPanels=[...root.querySelectorAll("details[open]")].map(x=>x.id);
 if(!f){root.innerHTML='<p class="notice">No selected family is available on this browser. Return to the Parent Portal to choose an existing family; no student data has been changed.</p>';return}
 const learnerCards=learners.map(l=>{
  const active=l.learnerId===ids.learnerId,ready=!!l.grade;
  const allowed=f.adultIds?.includes(ids.adultId)&&R.canAdult?.(ids.adultId,l.learnerId,"learner.view")===true;
  const stage=stages[String(l.stage||"").toLowerCase()]||"Learner";
  return '<article class="parent-learning-card"><p class="parent-eyebrow">'+esc(stage)+(active?" · Active":"")+'</p><h3>'+esc(l.nickname||"Learner")+'</h3><p>'+esc(l.grade?"Grade "+String(l.grade):"Placement needs review")+'</p><div class="parent-learning-actions">'+
   (allowed?(active?'<span class="active-chip">Active learner</span>':'<button type="button" data-select="'+esc(l.learnerId)+'">Make Active</button>'):'<span>Student access not granted</span>')+
   (allowed?(ready?'<a href="'+esc(profile(l))+'" data-open-learner="'+esc(l.learnerId)+'">Open Student Profile</a>':'<a href="../enroll/#existing">Complete Placement</a>'):'')+
   '<button type="button" data-family-dialog="'+esc(l.learnerId)+'">Family Learning</button><a href="../enroll/#existing">Change Placement</a></div></article>';
 }).join("");
 const progressCards=learners.map(l=>{
  if(!permission(f,l))return '<article class="parent-learning-card"><h3>'+esc(l.nickname||"Learner")+'</h3><p>Progress access is not enabled for the selected adult.</p><div class="parent-learning-actions"><button type="button" data-family-dialog="'+esc(l.learnerId)+'">Family Learning</button></div></article>';
  const snaps=C?.readLearner?.(l.learnerId)||[],summary=C?.summarize?.(l.learnerId)||null;
  const courses=snaps.slice(0,8).map(s=>{
   const percent=s?.progress?.percent,valid=!s.stale&&typeof percent==="number"&&Number.isFinite(percent)&&percent>=0&&percent<=100;
   return '<div class="parent-course-row"><strong>'+esc(s.courseTitle||s.courseId||"Course")+'</strong><span>'+esc(s.stale?"Refresh required":valid?Math.round(percent)+"% completion":"Not reported")+'</span></div>';
  }).join("");
  return '<article class="parent-learning-card"><h3>'+esc(l.nickname||"Learner")+'</h3><p>'+(summary?.courses||snaps.length)+' reported course snapshot(s), not official grades.</p>'+(courses||'<p>No course continuation snapshots on this browser.</p>')+'<div class="parent-learning-actions"><button type="button" data-family-dialog="'+esc(l.learnerId)+'">Family Learning</button><a href="'+esc(profile(l))+'" data-open-learner="'+esc(l.learnerId)+'">Open Student Profile</a></div></article>';
 }).join("");
 const daily=learners.filter(l=>permission(f,l)).map(l=>{
  const key="khaemenes-grade09-daily-parent-report-v1:"+encodeURIComponent(l.learnerId),data=read(key);
  const reports=data?.learnerId===l.learnerId&&data.reports&&typeof data.reports==="object"?data.reports:{};
  const last=Object.keys(reports).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)).sort().at(-1),entry=last?reports[last]:null;
  if(!entry||entry.learnerId!==l.learnerId)return '<article class="parent-learning-card"><h3>'+esc(l.nickname||"Learner")+'</h3><p>No dated daily report available on this browser.</p></article>';
  const habits=Array.isArray(entry.habits)?entry.habits:[],classes=Array.isArray(entry.classes)?entry.classes:[];
  return '<article class="parent-learning-card"><h3>'+esc(l.nickname||"Learner")+'</h3><p>'+esc(last)+' · '+habits.filter(x=>x.checked===true).length+' / '+habits.length+' daily activities checked; '+classes.filter(x=>x.masteredToday===true).length+' / '+classes.length+' reported academic checkpoints.</p><details class="parent-report-details"><summary>View daily evidence</summary><ul>'+habits.map(x=>'<li>'+esc(x.label||"Activity")+': '+(x.checked===true?"Checked":"Not checked")+'</li>').join("")+'</ul><ul>'+classes.map(x=>'<li>'+esc(x.subject||"Subject")+': '+(x.masteredToday===true?"Mastery reported":"No dated mastery reported")+'</li>').join("")+'</ul></details></article>';
 }).join("");
 root.innerHTML=
 '<details class="parent-learning-panel" id="parent-daily-reports"><summary><span class="parent-panel-eyebrow">Daily Family Learning</span>To Do Today · Daily Family Reports <span class="parent-panel-caption">Open to review saved activities and checkpoints</span></summary><div class="panel-inner"><p>Only authorized adults can view these browser-local reports. Nothing is emailed or synchronized automatically.</p><div class="parent-learning-grid">'+(daily||'<p>No authorized daily reports to display.</p>')+'</div></div></details>'+
 '<details class="parent-learning-panel" id="parent-learner-panel"><summary><span class="parent-panel-eyebrow">Family Profiles</span>My Learners <span class="parent-panel-caption">'+learners.length+' learner(s) · Select or open a student profile</span></summary><div class="panel-inner"><p>Select an existing learner or open their own profile. Changing the active learner does not change grades.</p><div class="parent-learning-grid">'+(learnerCards||'<p>No learners are registered in this browser.</p>')+'</div><a class="panel-footer-link" href="../enroll/">Enroll / Add Learner</a></div></details>'+
 '<details class="parent-learning-panel" id="family-progress"><summary><span class="parent-panel-eyebrow">Academic Overview</span>Schedules &amp; Progress <span class="parent-panel-caption">Read-only reported course progress; individual schedules remain in Student Profiles</span></summary><div class="panel-inner"><p>Reported continuation snapshots are learning indicators, not certified grades or invented class schedules.</p><div class="parent-learning-grid">'+(progressCards||'<p>No learner progress to display.</p>')+'</div></div></details>';
 for(const id of openPanels){const element=document.getElementById(id);if(element)element.open=true}
 if(location.hash==="#family-progress"||location.hash==="#parent-daily-reports"||location.hash==="#parent-learner-panel"){const p=document.querySelector(location.hash);if(p)p.open=true}
 root.querySelectorAll("[data-family-dialog]").forEach(button=>button.addEventListener("click",()=>{
  const learner=f.learners.find(l=>l.learnerId===button.dataset.familyDialog&&l.familyId===f.familyId);
  if(!learner)return;
  window.KhaemenesFamilyLearnerDialog?.open?.(learner.learnerId,button);
 }));
 root.querySelectorAll("[data-select]").forEach(button=>button.addEventListener("click",()=>{
  const id=button.dataset.select,learner=f.learners.find(l=>l.learnerId===id&&l.familyId===f.familyId);
  if(!learner||!f.adultIds?.includes(ids.adultId)||R.canAdult?.(ids.adultId,id,"learner.view")!==true)return;
  try{R.setActive({familyId:f.familyId,adultId:ids.adultId||null,learnerId:id})}catch{button.textContent="Selection could not be saved"}
 }));
 root.querySelectorAll("[data-open-learner]").forEach(a=>a.addEventListener("click",event=>{
  const id=a.dataset.openLearner,learner=f.learners.find(l=>l.learnerId===id&&l.familyId===f.familyId);
  if(!learner||!f.adultIds?.includes(ids.adultId)||R.canAdult?.(ids.adultId,id,"learner.view")!==true){event.preventDefault();return}
  try{R.setActive({familyId:f.familyId,adultId:ids.adultId||null,learnerId:id})}catch{event.preventDefault();a.textContent="Choose an existing learner in Parent Portal first."}
 }));
}
window.addEventListener("khaemenes-family-changed",refreshLater);
window.addEventListener("khaemenes-learner-placement-changed",refreshLater);
window.addEventListener("khaemenes-learning-continuation-changed",refreshLater);
window.addEventListener("pageshow",refreshLater);
window.addEventListener("hashchange",()=>{const id=location.hash.slice(1),el=document.getElementById(id);if(el?.tagName==="DETAILS")el.open=true});
render();
})();