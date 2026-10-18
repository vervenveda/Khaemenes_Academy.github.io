/*
 * Khaemenes Academy Home Personalization v1.0.0
 * Public home remains unchanged before an Academy identity exists.
 */
(function attachKhaemenesHomePersonalization(global){
"use strict";
const VERSION="1.0.0";
const BAR_ID="khaemenesMyAcademyBar",DOCK_ID="khaemenesHomeUtilityDock",PROFILE_ID="khaemenesHomeProfileButton",MENTOR_ID="khaemenesHomeMentorButton",STYLE_ID="khaemenesHomePersonalizationStyles",BETA_ID="vnvBetaProgramLink";
const URLS=Object.freeze({student:"./student/",family:"./family/",enroll:"./family/enroll/",adult:"./adult/",mentor:"./mentor/"});
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function registry(){return global.KhaemenesFamilyRegistry||null}
function router(){return global.KhaemenesFrontDoorRouter||null}
function continuation(){return global.KhaemenesLearningContinuation||null}
function accountSnapshot(){
  const r=registry();
  if(!r)return Object.freeze({mode:"public",hasIdentity:false,family:null,adult:null,learner:null,adultLearner:null});
  let family=null,adult=null,learner=null,adultLearner=null;
  try{family=r.getFamily?.()||null;adult=r.getAdult?.()||null;learner=r.getLearner?.()||null;adultLearner=r.getAdultLearner?.(adult?.adultId)||null}catch{}
  const hasIdentity=Boolean(family?.familyId||adult?.adultId||learner?.learnerId);
  const mode=!hasIdentity?"public":learner?.selfDirectedAdult===true?"adult":learner?.learnerId?"learner":"family";
  return Object.freeze({mode,hasIdentity,family,adult,learner,adultLearner});
}
function gradeMeta(learner){
  const r=registry(),meta=learner?.grade&&r?.gradeMeta?.[learner.grade]?r.gradeMeta[learner.grade]:null;
  return {label:meta?.label||(learner?.stage==="higher"?"Higher Learning":"Placement in progress"),school:meta?.school||(learner?.stage==="higher"?"Khaemenes Higher Learning":"Khaemenes Academy")};
}
function bestContinuation(learner){
  if(!learner?.learnerId)return null;
  try{return (continuation()?.readLearner?.(learner.learnerId)||[]).find(item=>item&&item.status!=="complete"&&item.nextHref)||null}catch{return null}
}
function mentorDestination(){try{return router()?.mentorDestination?.()||URLS.mentor}catch{return URLS.mentor}}
function profileDestination(snapshot){if(snapshot.mode==="adult")return URLS.adult;if(snapshot.mode==="learner")return URLS.student;if(snapshot.mode==="family")return URLS.family;return null}
function continueDestination(snapshot){
  if(snapshot.mode==="adult"){const next=bestContinuation(snapshot.learner||snapshot.adultLearner);return next?.nextHref||URLS.adult}
  if(snapshot.mode==="learner"){const next=bestContinuation(snapshot.learner);if(next?.nextHref)return next.nextHref;try{return router()?.routeForLearner?.(snapshot.learner)?.destination||URLS.student}catch{return URLS.student}}
  return URLS.family;
}
function addStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement("style");style.id=STYLE_ID;style.textContent="\n#khaemenesMyAcademyBar{position:relative;z-index:5;border-top:1px solid rgba(180,139,69,.22);border-bottom:1px solid rgba(20,31,26,.14);background:linear-gradient(90deg,rgba(255,253,248,.96),rgba(242,237,226,.98),rgba(255,253,248,.96));box-shadow:0 12px 28px rgba(20,31,26,.055)}\n#khaemenesMyAcademyBar .my-academy-inner{width:min(calc(100% - 42px),1320px);margin:auto;min-height:92px;padding:14px 0;display:grid;grid-template-columns:minmax(220px,1.35fr) minmax(180px,.9fr) auto;gap:18px;align-items:center;text-align:left}\n#khaemenesMyAcademyBar .my-academy-identity{min-width:0}\n#khaemenesMyAcademyBar .my-academy-kicker{margin:0 0 3px;color:#725f82;font:400 10px/1.35 Cinzel,Georgia,serif;letter-spacing:.16em;text-transform:uppercase}\n#khaemenesMyAcademyBar .my-academy-name{margin:0;color:#17352d;font:400 clamp(1.15rem,2vw,1.5rem)/1.2 \"Iowan Old Style\",Georgia,serif}\n#khaemenesMyAcademyBar .my-academy-meta,#khaemenesMyAcademyBar .my-academy-next{margin:4px 0 0;color:#66736d;font-size:12px;line-height:1.45}\n#khaemenesMyAcademyBar .my-academy-next strong{color:#314b42;font-weight:500}\n#khaemenesMyAcademyBar .my-academy-actions{display:flex;align-items:center;justify-content:flex-end;gap:7px;flex-wrap:wrap}\n#khaemenesMyAcademyBar .my-academy-action{min-height:38px;display:inline-flex;align-items:center;justify-content:center;padding:7px 11px;border:1px solid rgba(23,57,47,.2);border-radius:7px;color:#17392f;background:#fffdf8;text-decoration:none;font:500 10px/1.15 \"Avenir Next\",\"Segoe UI\",Arial,sans-serif;letter-spacing:.025em}\n#khaemenesMyAcademyBar .my-academy-action.primary{color:#fff;background:#17392f;border-color:#17392f}\n#khaemenesMyAcademyBar .my-academy-action.gold{color:#493719;background:#fff4d8;border-color:#b48b45}\n#khaemenesMyAcademyBar .my-academy-action:hover{transform:translateY(-1px)}\n#khaemenesMyAcademyBar .my-academy-action:focus-visible{outline:3px solid #b48b45;outline-offset:2px}\n#khaemenesHomeUtilityDock{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482500;display:flex;align-items:stretch;justify-content:flex-end;gap:5px;padding:5px;border:1px solid rgba(180,139,69,.48);border-radius:7px;background:rgba(255,253,248,.97);box-shadow:0 10px 30px rgba(15,25,37,.17);backdrop-filter:blur(10px)}\n#khaemenesHomeUtilityDock>a,#khaemenesHomeUtilityDock>button{position:static!important;right:auto!important;bottom:auto!important;z-index:auto!important;width:104px!important;height:40px!important;min-height:40px!important;max-height:40px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;margin:0!important;padding:7px 8px!important;border-radius:7px!important;box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;box-shadow:none!important;text-decoration:none!important;cursor:pointer!important;font:600 10px/1.1 \"Avenir Next\",\"Segoe UI\",Arial,sans-serif!important;letter-spacing:.025em!important}\n#khaemenesHomeUtilityDock>#khaemenesHomeProfileButton{order:10;color:#17392f!important;background:#fffdf8!important;border:1px solid rgba(180,139,69,.72)!important}\n#khaemenesHomeUtilityDock>#khaemenesHomeMentorButton{order:20;color:#493719!important;background:#fff4d8!important;border:1px solid #b48b45!important}\n#khaemenesHomeUtilityDock>#vnvBetaProgramLink{order:30;color:#f7efe0!important;background:#0f1925!important;border:1px solid rgba(183,147,77,.72)!important}\n#khaemenesHomeUtilityDock>a:hover,#khaemenesHomeUtilityDock>button:hover{transform:translateY(-1px)}\n#khaemenesHomeUtilityDock>a:focus-visible,#khaemenesHomeUtilityDock>button:focus-visible{outline:3px solid #b48b45!important;outline-offset:2px!important}\n#khaemenesHomeUtilityDock .home-dock-mark{width:18px;height:18px;display:grid;place-items:center;border-radius:50%;border:1px solid currentColor;font:600 9px/1 Georgia,serif;flex:0 0 auto}\n@media(max-width:760px){#khaemenesMyAcademyBar .my-academy-inner{grid-template-columns:1fr;gap:9px;text-align:center;padding:14px 0}#khaemenesMyAcademyBar .my-academy-actions{justify-content:center}}\n@media(max-width:520px){#khaemenesMyAcademyBar .my-academy-inner{width:min(calc(100% - 24px),1320px)}#khaemenesHomeUtilityDock{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));gap:4px;padding:4px}#khaemenesHomeUtilityDock>a,#khaemenesHomeUtilityDock>button{width:88px!important;height:38px!important;min-height:38px!important;max-height:38px!important;padding:6px!important;font-size:9px!important}}\n@media(max-width:330px){#khaemenesHomeUtilityDock>a,#khaemenesHomeUtilityDock>button{width:82px!important}}\n@media print{#khaemenesMyAcademyBar,#khaemenesHomeUtilityDock{display:none!important}}\n@media(prefers-reduced-motion:reduce){#khaemenesMyAcademyBar .my-academy-action,#khaemenesHomeUtilityDock>a,#khaemenesHomeUtilityDock>button{transition:none!important;transform:none!important}}\n";(document.head||document.documentElement).appendChild(style);
}
function ensureDock(){
  addStyles();
  let dock=document.getElementById(DOCK_ID);
  if(!dock){dock=document.createElement("nav");dock.id=DOCK_ID;dock.setAttribute("aria-label","Academy quick utilities");document.body.appendChild(dock)}
  let mentor=document.getElementById(MENTOR_ID);
  if(!mentor){mentor=document.createElement("a");mentor.id=MENTOR_ID;mentor.innerHTML='<span class="home-dock-mark" aria-hidden="true">A</span><span>Archaemenes</span>';mentor.setAttribute("aria-label","Open Archaemenes, Khaemenes Academy Mentor");dock.appendChild(mentor)}
  mentor.href=mentorDestination();
  const beta=document.getElementById(BETA_ID);if(beta&&beta.parentElement!==dock)dock.appendChild(beta);
  return dock;
}
function syncDock(snapshot=accountSnapshot()){
  const dock=ensureDock();let profile=document.getElementById(PROFILE_ID);
  if(!snapshot.hasIdentity){profile?.remove();return}
  if(!profile){profile=document.createElement("a");profile.id=PROFILE_ID;profile.innerHTML='<span class="home-dock-mark" aria-hidden="true">P</span><span>Profile</span>';profile.setAttribute("aria-label","Open the active Khaemenes Academy profile");dock.appendChild(profile)}
  profile.href=profileDestination(snapshot)||URLS.family;
  profile.title=snapshot.mode==="adult"?"Open Adult Scholar Profile":snapshot.mode==="learner"?"Open Student Profile":"Open Family Profile";
}
function removeBar(){document.getElementById(BAR_ID)?.remove()}
function makeAction(label,href,kind=""){return '<a class="my-academy-action '+kind+'" href="'+esc(href)+'">'+esc(label)+'</a>'}
function renderBar(snapshot=accountSnapshot()){
  if(!snapshot.hasIdentity){removeBar();return}
  addStyles();
  let bar=document.getElementById(BAR_ID);
  if(!bar){
    bar=document.createElement("section");bar.id=BAR_ID;bar.setAttribute("aria-label","My Academy");bar.setAttribute("data-private","");bar.setAttribute("data-i18n-no-online","");
    const hero=document.querySelector("main .hero")||document.querySelector(".hero");if(hero)hero.insertAdjacentElement("afterend",bar);else document.querySelector("main")?.prepend(bar)
  }
  const mentor=mentorDestination();let kicker="My Academy",name="Academy Account",meta="",nextText="",actions="";
  if(snapshot.mode==="adult"){
    const learner=snapshot.learner||snapshot.adultLearner,next=bestContinuation(learner);
    name="Welcome back, "+(learner?.nickname||snapshot.adult?.displayName||"Adult Scholar");meta="Adult Scholar · Higher Learning";
    nextText=next?'<strong>Up next:</strong> '+esc(next.courseTitle||next.courseId||"Learning")+(next.nextTitle?' · '+esc(next.nextTitle):""):"Your scholar profile and independent-study pathways are ready.";
    actions=[makeAction(next?.nextLabel||"Continue Learning",continueDestination(snapshot),"primary"),makeAction("Scholar Profile",URLS.adult),makeAction("Archaemenes",mentor,"gold")].join("");
  }else if(snapshot.mode==="learner"){
    const learner=snapshot.learner,gm=gradeMeta(learner),next=bestContinuation(learner);
    name="Welcome back, "+(learner.nickname||"Learner");meta=gm.label+" · "+gm.school;
    nextText=next?'<strong>Up next:</strong> '+esc(next.courseTitle||next.courseId||"Course")+(next.nextTitle?' · '+esc(next.nextTitle):""):"Your learner profile, placement, and Academy route are ready.";
    actions=[makeAction(next?.nextLabel||"Continue Learning",continueDestination(snapshot),"primary"),makeAction("Profile",URLS.student),makeAction("Family Hub",URLS.family),makeAction("Archaemenes",mentor,"gold")].join("");
  }else{
    const learnerCount=Array.isArray(snapshot.family?.learners)?snapshot.family.learners.filter(x=>!x?.selfDirectedAdult).length:0;
    kicker="My Academy · Family";name="Welcome, "+(snapshot.adult?.displayName||snapshot.family?.displayName||"Family");
    meta=learnerCount?learnerCount+" learner"+(learnerCount===1?"":"s")+" connected":"Family profile ready · no K–12 learner selected yet";
    nextText=learnerCount?"Select or manage a learner from the Family Hub; this bar updates automatically when the active learner changes.":"Enroll a learner when you are ready. Public Academy exploration remains open.";
    actions=[makeAction("Family Profile",URLS.family,"primary"),makeAction(learnerCount?"Manage Learners":"Enroll Learner",learnerCount?URLS.family:URLS.enroll),makeAction("Archaemenes",mentor,"gold")].join("");
  }
  bar.innerHTML='<div class="my-academy-inner"><div class="my-academy-identity"><p class="my-academy-kicker">'+esc(kicker)+'</p><h2 class="my-academy-name">'+esc(name)+'</h2><p class="my-academy-meta">'+esc(meta)+'</p></div><div class="my-academy-next">'+nextText+'</div><div class="my-academy-actions">'+actions+'</div></div>';
}
function refresh(){const snapshot=accountSnapshot();renderBar(snapshot);syncDock(snapshot);return snapshot}
let queued=0;function schedule(){clearTimeout(queued);queued=setTimeout(refresh,50)}
function observeBeta(){
  if(typeof MutationObserver!=="function"||!document.body)return;
  const observer=new MutationObserver(()=>{const beta=document.getElementById(BETA_ID);if(beta&&beta.parentElement?.id!==DOCK_ID)syncDock(accountSnapshot())});
  observer.observe(document.body,{childList:true,subtree:true});
}
function start(){refresh();observeBeta()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
for(const eventName of ["pageshow","khaemenes-family-ready","khaemenes-family-changed","khaemenes-learner-placement-changed","khaemenes-learning-continuation-changed","online","offline"])global.addEventListener(eventName,schedule);
global.addEventListener("storage",event=>{if(String(event.key||"").startsWith("khaemenes"))schedule()});
global.KhaemenesHomePersonalization=Object.freeze({version:VERSION,accountSnapshot,profileDestination,continueDestination,refresh});
})(window);
