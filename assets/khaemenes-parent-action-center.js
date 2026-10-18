/*
 * Khaemenes Academy Parent Action Center v1.0.0
 * ------------------------------------------------------------
 * Read-only family guidance built from Academy continuation summaries
 * and safe Study Support counts. Never changes grades, mastery, placement,
 * learner identity, or private learner reflections.
 */
(function attachKhaemenesParentActionCenter(global){
"use strict";

const VERSION="1.0.0";
const CARD_ID="khaemenesParentActionCenter";
const DIALOG_ID="khaemenesParentWeeklyBriefDialog";
const STYLE_ID="khaemenesParentActionCenterStyles";
const MENTOR_URL="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";

const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const registry=()=>global.KhaemenesFamilyRegistry||null;
const continuation=()=>global.KhaemenesLearningContinuation||null;
const learningScience=()=>global.KhaemenesLearningScience||null;

function authorizedLearners(){
  const R=registry(),family=R?.getFamily?.()||null,adult=R?.getAdult?.()||null;
  if(!R||!family||!adult)return[];
  return (Array.isArray(family.learners)?family.learners:[])
    .filter(l=>l?.learnerId&&l.selfDirectedAdult!==true&&R.canAdult?.(adult.adultId,l.learnerId,"progress.view"))
    .map(l=>Object.freeze({...l}));
}
function safeStudyCounts(learner){
  const api=learningScience();
  if(!api||!learner?.learnerId)return Object.freeze({dueReview:0,reviewCourses:0});
  try{
    const items=api.syncReviewQueueFor?.(learner)||[];
    const due=items.filter(item=>Date.parse(item?.dueAt||"")<=Date.now()).length;
    return Object.freeze({dueReview:due,reviewCourses:items.length});
  }catch{return Object.freeze({dueReview:0,reviewCourses:0})}
}
function normalizeSnapshot(s){
  if(!s)return null;
  const best=s.mastery?.best===null||s.mastery?.best===undefined?null:Number(s.mastery.best);
  const threshold=Number(s.mastery?.threshold||80);
  return Object.freeze({
    courseId:String(s.courseId||"").slice(0,140),
    courseTitle:String(s.courseTitle||s.courseId||"Course").slice(0,160),
    subject:String(s.subject||s.school||"General").slice(0,100),
    stage:String(s.stage||"").slice(0,40),
    grade:String(s.grade||"").slice(0,20),
    status:String(s.status||"continue").slice(0,40),
    nextTitle:String(s.nextTitle||s.summary||"Next learning step").slice(0,240),
    nextHref:String(s.nextHref||"").slice(0,500),
    stale:Boolean(s.stale||s.freshness==="stale"),
    best:Number.isFinite(best)?Math.max(0,Math.min(100,best)):null,
    threshold:Number.isFinite(threshold)?Math.max(1,Math.min(100,threshold)):80,
    familyNeedsAction:Boolean(s.family?.needsAction),
    familySummary:String(s.family?.summary||s.family?.label||"").slice(0,260),
    updatedAt:s.updatedAt||null
  });
}
function coursePriority(course){
  if(course.stale)return Object.freeze({level:"attention",reason:"Course progress summary is stale and should be refreshed in the course."});
  if(course.familyNeedsAction)return Object.freeze({level:"attention",reason:course.familySummary||"Family review is requested for this learning step."});
  if(course.status==="corrections")return Object.freeze({level:"attention",reason:"Corrections are the next formal step."});
  if(course.status==="mastery")return Object.freeze({level:"attention",reason:"The learner is at a mastery gate before moving forward."});
  if(course.best!==null&&course.best<course.threshold)return Object.freeze({level:"attention",reason:"Current best mastery is below the course threshold."});
  if(course.status==="assessment")return Object.freeze({level:"attention",reason:"A formal assessment is the next step."});
  if(course.status==="complete"||(course.best!==null&&course.best>=course.threshold))return Object.freeze({level:"celebrate",reason:course.status==="complete"?"This course snapshot is complete.":"The recorded mastery threshold has been reached."});
  return Object.freeze({level:"track",reason:"A clear next learning step is available."});
}
function learnerSummary(learner){
  const C=continuation();
  const raw=C?.readLearner?.(learner.learnerId)||[];
  const courses=raw.map(normalizeSnapshot).filter(Boolean);
  const categorized={attention:[],track:[],celebrate:[]};
  courses.forEach(course=>{const p=coursePriority(course);categorized[p.level].push(Object.freeze({...course,reason:p.reason}))});
  const study=safeStudyCounts(learner);
  if(study.dueReview>0){
    categorized.attention.push(Object.freeze({
      courseId:"study-support",
      courseTitle:"Study Support",
      subject:"Spaced review",
      status:"practice",
      nextTitle:study.dueReview+" spaced review item"+(study.dueReview===1?" is":"s are")+" due",
      nextHref:"",
      stale:false,best:null,threshold:80,familyNeedsAction:false,familySummary:"",
      updatedAt:null,reason:"Spaced retrieval practice is due; this is study support, not a grade."
    }));
  }
  return Object.freeze({
    learnerId:learner.learnerId,
    nickname:String(learner.nickname||"Learner").slice(0,120),
    stage:String(learner.stage||"").slice(0,40),
    grade:String(learner.grade||"").slice(0,20),
    courseCount:courses.length,
    needsAttention:categorized.attention.length,
    onTrack:categorized.track.length,
    celebrate:categorized.celebrate.length,
    dueReview:study.dueReview,
    categorized:Object.freeze({
      attention:Object.freeze(categorized.attention.slice(0,8)),
      track:Object.freeze(categorized.track.slice(0,8)),
      celebrate:Object.freeze(categorized.celebrate.slice(0,8))
    })
  });
}
function summary(){
  const learners=authorizedLearners().map(learnerSummary);
  return Object.freeze({
    version:VERSION,
    generatedAt:new Date().toISOString(),
    learners:Object.freeze(learners),
    totals:Object.freeze({
      learners:learners.length,
      needsAttention:learners.reduce((n,l)=>n+l.needsAttention,0),
      onTrack:learners.reduce((n,l)=>n+l.onTrack,0),
      celebrate:learners.reduce((n,l)=>n+l.celebrate,0),
      dueReview:learners.reduce((n,l)=>n+l.dueReview,0)
    }),
    authority:Object.freeze({
      changesGrades:false,
      awardsMastery:false,
      changesPlacement:false,
      changesLearnerIdentity:false,
      readsPrivateReflections:false,
      readsChildConversations:false,
      readsAssessmentAnswers:false
    })
  });
}
function safeBrief(){
  const s=summary();
  return Object.freeze({
    schema:"khaemenes-parent-weekly-brief-v1",
    version:1,
    generatedAt:s.generatedAt,
    totals:s.totals,
    learners:s.learners.map(l=>Object.freeze({
      learnerId:l.learnerId,
      nickname:l.nickname,
      stage:l.stage,
      grade:l.grade,
      courseCount:l.courseCount,
      needsAttention:l.needsAttention,
      onTrack:l.onTrack,
      celebrate:l.celebrate,
      dueReview:l.dueReview,
      attention:l.categorized.attention.map(c=>({
        courseId:c.courseId,courseTitle:c.courseTitle,subject:c.subject,status:c.status,
        nextTitle:c.nextTitle,best:c.best,threshold:c.threshold,reason:c.reason
      })),
      nextSteps:l.categorized.track.slice(0,4).map(c=>({
        courseId:c.courseId,courseTitle:c.courseTitle,subject:c.subject,status:c.status,nextTitle:c.nextTitle
      })),
      celebrations:l.categorized.celebrate.slice(0,4).map(c=>({
        courseId:c.courseId,courseTitle:c.courseTitle,subject:c.subject,status:c.status,best:c.best,threshold:c.threshold,reason:c.reason
      }))
    })),
    privacy:Object.freeze({
      summaryOnly:true,
      privateReflectionsExcluded:true,
      childConversationsExcluded:true,
      assessmentResponsesExcluded:true,
      answerKeysExcluded:true
    })
  });
}
function addStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement("style");style.id=STYLE_ID;
  style.textContent=`
#${CARD_ID}{margin-top:34px;padding:24px;border:1px solid rgba(23,57,47,.15);border-radius:21px;background:#fff;box-shadow:0 20px 50px rgba(22,36,55,.08)}
#${CARD_ID} .parent-action-kicker{margin:0;color:#8c6c38;font:500 10px/1.3 Cinzel,Georgia,serif;letter-spacing:.12em;text-transform:uppercase}
#${CARD_ID} h3{margin:7px 0 0;color:#17233d;font:500 1.65rem/1.2 Cinzel,Georgia,serif}
#${CARD_ID} .parent-action-intro{max-width:820px;margin:8px 0 0;color:#68727a;font-size:12px}
#${CARD_ID} .parent-action-totals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:16px 0}
#${CARD_ID} .parent-action-total{padding:11px;border:1px solid rgba(28,45,67,.12);border-radius:7px;background:#faf9f5;text-align:center}
#${CARD_ID} .parent-action-total strong{display:block;color:#17233d;font:500 1.25rem Georgia,serif}
#${CARD_ID} .parent-action-total span{color:#68727a;font-size:9px;text-transform:uppercase;letter-spacing:.06em}
#${CARD_ID} .parent-action-learners{display:grid;gap:12px}
#${CARD_ID} .parent-action-learner{padding:15px;border:1px solid rgba(28,45,67,.12);border-radius:12px;background:#fffdf8}
#${CARD_ID} .parent-action-learner h4{margin:0;color:#17392f;font:500 1.2rem Georgia,serif}
#${CARD_ID} .parent-action-meta{margin:3px 0 10px;color:#68736d;font-size:10px}
#${CARD_ID} .parent-action-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#${CARD_ID} .parent-action-column{padding:10px;border:1px solid rgba(23,57,47,.1);border-radius:7px;background:#faf8f2}
#${CARD_ID} .parent-action-column h5{margin:0 0 7px;font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase}
#${CARD_ID} .parent-action-column.attention h5{color:#8a5962}
#${CARD_ID} .parent-action-column.track h5{color:#466e8b}
#${CARD_ID} .parent-action-column.celebrate h5{color:#416b50}
#${CARD_ID} .parent-action-item{padding:8px 0;border-top:1px solid rgba(23,57,47,.08)}
#${CARD_ID} .parent-action-item:first-of-type{border-top:0}
#${CARD_ID} .parent-action-item strong{display:block;color:#243b32;font-size:10px}
#${CARD_ID} .parent-action-item span{display:block;margin-top:2px;color:#6b7771;font-size:9.5px;line-height:1.45}
#${CARD_ID} .parent-action-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}
#${CARD_ID} .parent-action-actions button,#${CARD_ID} .parent-action-actions a{min-height:39px;display:inline-flex;align-items:center;justify-content:center;padding:7px 10px;border:1px solid rgba(23,57,47,.2);border-radius:7px;color:#17392f;background:#fff;text-decoration:none;font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif}
#${CARD_ID} .parent-action-actions .primary{color:#fff;background:#17392f;border-color:#17392f}
#${DIALOG_ID}{width:min(760px,calc(100vw - 24px));max-height:min(86vh,860px);padding:0;border:1px solid rgba(23,57,47,.2);border-radius:7px;color:#17251f;background:#fffdf8;box-shadow:0 28px 90px rgba(8,25,20,.28);overflow:auto}
#${DIALOG_ID}::backdrop{background:rgba(7,21,27,.58)}
#${DIALOG_ID} .parent-brief-shell{padding:24px}
#${DIALOG_ID} .parent-brief-top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
#${DIALOG_ID} h2{margin:4px 0 0;color:#17392f;font:500 1.7rem Georgia,serif}
#${DIALOG_ID} .parent-brief-kicker{margin:0;color:#725f82;font:500 9px Cinzel,Georgia,serif;letter-spacing:.14em;text-transform:uppercase}
#${DIALOG_ID} .parent-brief-close{width:36px;height:36px;border:1px solid rgba(23,57,47,.18);border-radius:7px;background:#fff;color:#17392f;font-size:20px}
#${DIALOG_ID} .parent-brief-learner{margin-top:16px;padding:14px;border:1px solid rgba(23,57,47,.12);border-radius:7px;background:#fff}
#${DIALOG_ID} .parent-brief-learner h3{margin:0;color:#17392f;font:500 1.15rem Georgia,serif}
#${DIALOG_ID} .parent-brief-list{margin:7px 0 0;padding-left:18px;color:#52625b;font-size:11px}
#${DIALOG_ID} .parent-brief-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:18px}
#${DIALOG_ID} .parent-brief-actions button{min-height:39px;padding:7px 11px;border:1px solid rgba(23,57,47,.2);border-radius:7px;background:#fff;color:#17392f;font-weight:600}
@media(max-width:760px){#${CARD_ID} .parent-action-columns{grid-template-columns:1fr}#${CARD_ID} .parent-action-totals{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){#${CARD_ID} .parent-action-totals{grid-template-columns:1fr}}
@media print{#${CARD_ID} .parent-action-actions,#${DIALOG_ID} .parent-brief-actions,#${DIALOG_ID} .parent-brief-close{display:none!important}}
`;
  (document.head||document.documentElement).appendChild(style);
}
function itemMarkup(item){
  if(!item)return "";
  return '<div class="parent-action-item"><strong>'+esc(item.courseTitle||"Learning step")+'</strong><span>'+esc(item.reason||item.nextTitle||"Review the current learning step.")+'</span>'+(item.best!==null&&item.best!==undefined?'<span>Recorded mastery: '+esc(item.best)+'% · target '+esc(item.threshold||80)+'%</span>':"")+'</div>';
}
function learnerMarkup(l){
  const none='<div class="parent-action-item"><span>Nothing to show in this category right now.</span></div>';
  return '<article class="parent-action-learner"><h4>'+esc(l.nickname)+'</h4><p class="parent-action-meta">'+esc(l.grade?("Grade "+l.grade):l.stage||"Academy learner")+' · '+esc(l.courseCount)+' course snapshot'+(l.courseCount===1?"":"s")+'</p><div class="parent-action-columns"><section class="parent-action-column attention"><h5>Needs attention · '+l.needsAttention+'</h5>'+(l.categorized.attention.map(itemMarkup).join("")||none)+'</section><section class="parent-action-column track"><h5>On track · '+l.onTrack+'</h5>'+(l.categorized.track.map(itemMarkup).join("")||none)+'</section><section class="parent-action-column celebrate"><h5>Celebrate · '+l.celebrate+'</h5>'+(l.categorized.celebrate.map(itemMarkup).join("")||none)+'</section></div><div class="parent-action-actions"><button type="button" data-parent-select="'+esc(l.learnerId)+'" class="primary">Make Active Learner</button><a href="'+MENTOR_URL+'" data-parent-mentor="'+esc(l.learnerId)+'">Ask Archaemenes</a></div></article>';
}
function ensureDialog(){
  let d=document.getElementById(DIALOG_ID);
  if(d)return d;
  d=document.createElement("dialog");d.id=DIALOG_ID;d.setAttribute("aria-labelledby","khaemenesParentBriefTitle");d.setAttribute("data-private","");d.setAttribute("data-i18n-no-online","");
  d.innerHTML='<div class="parent-brief-shell"><div class="parent-brief-top"><div><p class="parent-brief-kicker">Family learning summary</p><h2 id="khaemenesParentBriefTitle">Weekly Family Brief</h2></div><button type="button" class="parent-brief-close" aria-label="Close weekly family brief">×</button></div><div data-parent-brief-body></div><div class="parent-brief-actions"><button type="button" data-parent-brief-print>Print Brief</button><button type="button" data-parent-brief-export>Export Brief JSON</button></div></div>';
  document.body.appendChild(d);
  d.querySelector(".parent-brief-close")?.addEventListener("click",()=>d.close?.());
  d.querySelector("[data-parent-brief-print]")?.addEventListener("click",()=>global.print());
  d.querySelector("[data-parent-brief-export]")?.addEventListener("click",exportBrief);
  d.addEventListener("click",e=>{if(e.target===d)d.close?.()});
  return d;
}
function renderBrief(){
  const brief=safeBrief(),d=ensureDialog(),body=d.querySelector("[data-parent-brief-body]");
  const learnerHtml=brief.learners.map(l=>{
    const attention=l.attention.length?l.attention.map(x=>'<li>'+esc(x.courseTitle)+': '+esc(x.reason)+'</li>').join(""):"<li>No family attention items.</li>";
    const next=l.nextSteps.length?l.nextSteps.map(x=>'<li>'+esc(x.courseTitle)+': '+esc(x.nextTitle)+'</li>').join(""):"<li>No next-step summary published yet.</li>";
    const celebrate=l.celebrations.length?l.celebrations.map(x=>'<li>'+esc(x.courseTitle)+': '+esc(x.reason)+'</li>').join(""):"<li>No new mastery/completion celebration in the current summaries.</li>";
    return '<section class="parent-brief-learner"><h3>'+esc(l.nickname)+'</h3><p>'+esc(l.grade?("Grade "+l.grade):l.stage||"Academy learner")+' · '+l.courseCount+' course snapshot'+(l.courseCount===1?"":"s")+' · '+l.dueReview+' spaced review'+(l.dueReview===1?"":"s")+' due</p><strong>Needs attention</strong><ul class="parent-brief-list">'+attention+'</ul><strong>Next useful steps</strong><ul class="parent-brief-list">'+next+'</ul><strong>Celebrate</strong><ul class="parent-brief-list">'+celebrate+'</ul></section>';
  }).join("");
  body.innerHTML='<p style="color:#68736d;font-size:11px">Generated '+esc(new Date(brief.generatedAt).toLocaleString())+'. This summary intentionally excludes private learner reflections, child conversations, assessment responses, and answer keys.</p>'+learnerHtml;
  return d;
}
function openBrief(){const d=renderBrief();if(typeof d.showModal==="function"){if(!d.open)d.showModal()}else d.setAttribute("open","")}
function exportBrief(){
  const brief=safeBrief(),blob=new Blob([JSON.stringify(brief,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="khaemenes-weekly-family-brief.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function render(){
  addStyles();
  const root=document.getElementById("familyApp"),R=registry();
  let card=document.getElementById(CARD_ID);
  if(!root||!R){card?.remove();return null}
  const s=summary();
  if(!s.learners.length){card?.remove();return s}
  if(!card){card=document.createElement("section");card.id=CARD_ID;root.appendChild(card)}
  card.innerHTML='<p class="parent-action-kicker">Parent Action Center</p><h3>Know what needs attention without taking over the learner’s work.</h3><p class="parent-action-intro">This read-only family layer organizes existing Academy learning signals into attention, on-track, and celebration views. It never changes grades, mastery, placement, or learner identity.</p><div class="parent-action-totals"><div class="parent-action-total"><strong>'+s.totals.needsAttention+'</strong><span>Needs attention</span></div><div class="parent-action-total"><strong>'+s.totals.onTrack+'</strong><span>On track</span></div><div class="parent-action-total"><strong>'+s.totals.celebrate+'</strong><span>Celebrate</span></div><div class="parent-action-total"><strong>'+s.totals.dueReview+'</strong><span>Spaced review due</span></div></div><div class="parent-action-learners">'+s.learners.map(learnerMarkup).join("")+'</div><div class="parent-action-actions"><button type="button" class="primary" data-parent-open-brief>Open Weekly Family Brief</button><button type="button" data-parent-export-brief>Export Brief JSON</button><a href="../teacher-admin/">Teacher / Faculty Support</a></div>';
  card.querySelector("[data-parent-open-brief]")?.addEventListener("click",openBrief);
  card.querySelector("[data-parent-export-brief]")?.addEventListener("click",exportBrief);
  card.querySelectorAll("[data-parent-select]").forEach(btn=>btn.addEventListener("click",()=>{try{R.setActive({learnerId:btn.dataset.parentSelect});render()}catch{}}));
  card.querySelectorAll("[data-parent-mentor]").forEach(link=>link.addEventListener("click",()=>{try{R.setActive({learnerId:link.dataset.parentMentor})}catch{}}));
  return s;
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(render,80)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
for(const eventName of ["pageshow","khaemenes-family-ready","khaemenes-family-changed","khaemenes-learner-placement-changed","khaemenes-learning-continuation-changed","khaemenes-study-review-changed","khaemenes-study-selfreg-changed"])global.addEventListener(eventName,schedule);
global.addEventListener("storage",event=>{if(String(event.key||"").startsWith("khaemenes"))schedule()});

global.KhaemenesParentActionCenter=Object.freeze({
  version:VERSION,
  authorizedLearners,
  learnerSummary,
  summary,
  safeBrief,
  openBrief,
  refresh:schedule,
  authority:Object.freeze({readOnly:true,changesGrades:false,awardsMastery:false,changesPlacement:false,changesLearnerIdentity:false}),
  privacy:Object.freeze({summaryOnly:true,privateReflectionsExcluded:true,childConversationsExcluded:true,assessmentResponsesExcluded:true,answerKeysExcluded:true})
});
})(window);
