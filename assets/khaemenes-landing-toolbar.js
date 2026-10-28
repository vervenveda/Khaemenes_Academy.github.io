/* Academy campus landing tools · no learner-state reads, writes or grading changes.
   Canonical Academy utilities: Home / Academy / Search / Updates / Mentor / Give / Profile / Parents / Beta. */
(()=>{
"use strict";
const A="https://vervenveda.com/Khaemenes_Academy.github.io/";
const V="https://vervenveda.com/";
const URLS=Object.freeze({
 search:V+"PLERASearch.github.io/",mentor:A+"mentor/",
 contribute:"https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s",student:A+"student/",family:A+"family/",
 help:A+"#help",beta:V+"beta/"
});
const DOCK="khaeLandingUtilityDock",DIALOG="khaeLandingUpdatesDialog";
const LEARNER_DOCK="khaemenesLearnerUtilityToolbar";
function make(tag,attrs,text){
 const node=document.createElement(tag);
 for(const [key,value] of Object.entries(attrs||{})){
  if(key==="className")node.className=value;else node.setAttribute(key,value);
 }
 if(text!==undefined)node.textContent=text;
 return node;
}
function updates(){
 let dialog=document.getElementById(DIALOG);
 if(dialog)return dialog;
 dialog=make("dialog",{id:DIALOG,"aria-label":"Academy updates and assistance"});
 const head=make("div",{className:"khae-dialog-head"});
 head.append(make("h2",{},"Updates & Help"));
 const close=make("button",{type:"button","aria-label":"Close updates"},"Close ✕");
 close.addEventListener("click",()=>dialog.close());
 head.append(close);
 const intro=make("p",{},"Find current Academy information and support at the Front Desk. This panel does not claim that account synchronization or teacher review has been verified.");
 const links=make("nav",{"aria-label":"Academy support links"});
 [["Academy Front Desk",A],["Student Portal",URLS.student],["Family Center",URLS.family],
  ["Help & Support",URLS.help],["Beta Program",URLS.beta],["Search All Resources",URLS.search]]
 .forEach(([label,href])=>links.append(make("a",{href},label)));
 dialog.append(head,intro,links);
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 document.body.append(dialog);
 return dialog;
}
function addLink(dock,kind,label,href){
 const control=make("a",{href,"data-landing-tool":kind,"aria-label":label});
 control.append(make("span",{},label));
 dock.append(control);
 return control;
}
function init(){
 if(document.getElementById("khaemenesHomeUtilityDock")||document.getElementById(DOCK)||!document.body)return;
 document.body.dataset.khaeCampusLanding="true";
 const hall=document.body.dataset.khaeHallLanding==="true";
 const learner=hall?null:document.getElementById(LEARNER_DOCK);
 const dock=learner||make("nav",{id:DOCK,"aria-label":"Academy campus quick utilities"});
 if(!learner)document.body.append(dock);
 const exists=selector=>!!dock.querySelector(selector);
 const highFrontDesk=document.body.dataset.khaeCampusFrontDesk==="true";
 if(!exists("[data-landing-tool='home']"))addLink(dock,"home","Home",V);
 if(!exists("[data-landing-tool='academy']"))addLink(dock,"academy","Academy",A);
 if(!exists("#khaemenesStudentSearchButton, [data-landing-tool='search']")){
  const search=addLink(dock,"search","Search",URLS.search);
  // Match the existing High School student Search action; keep PLERA Search as fallback.
  if(highFrontDesk)search.addEventListener("click",event=>{
   const open=window.VNVBetaProgram?.openStudentSearch;
   if(typeof open==="function"){event.preventDefault();open()}
  });
 }
 if(!exists("[data-landing-tool='updates']")){
  const up=make("button",{type:"button","data-landing-tool":"updates","aria-haspopup":"dialog","aria-controls":DIALOG,"aria-label":"Open Academy updates and help"});
  up.append(make("span",{},"Updates"));
  up.addEventListener("click",()=>{const dialog=updates();if(!dialog.open)dialog.showModal()});
  dock.append(up);
 }
 if(!exists("#khaemenesStudentMentorButton, [data-landing-tool='mentor']")){
  const mentorUrl=highFrontDesk
   ?"https://vervenveda.com/Khaemenes_High.github.io/mentor/?stage=high&subject=general&source=student-utility-rail"
   :URLS.mentor;
  addLink(dock,"mentor","Mentor",mentorUrl);
 }
 if(!exists("#khaemenesStudentContributeButton, [data-landing-tool='contribute']"))addLink(dock,"contribute","Give",URLS.contribute);
 const profile=hall?null:dock.querySelector("#khaemenesStudentProfileButton,[data-landing-tool='profile'],a[href*='/student-profile/'],a[href*='/student/']");
 if(profile){
  profile.dataset.landingTool="profile";
  profile.setAttribute("aria-label","Student Profile");
  profile.replaceChildren(make("span",{},"Profile"));
 }
 // Learner rails may also contribute a guardian/family control. Keep its action,
 // but normalize the visible label so it fits the shared compact dock.
 const parents=hall?null:[...dock.querySelectorAll("a,button")].find(control=>{
  if(control===profile)return false;
  const label=(control.getAttribute("aria-label")||control.textContent||"").trim().toLowerCase();
  const href=(control.getAttribute("href")||"").toLowerCase();
  return label==="grown-ups"||label==="grown ups"||label==="family"||label==="parents"||href.includes("/family/");
 });
 if(parents){
  parents.dataset.landingTool="parents";
  parents.setAttribute("aria-label","Parents");
  parents.replaceChildren(make("span",{},"Parents"));
 }
 const beta=document.getElementById("vnvBetaProgramLink");
 if(hall){
  // Public halls use one five-control dock; the original beta widget remains
  // untouched and hidden, so its profile/lesson MutationObserver cannot steal
  // a button from the landing dock or create a duplicate.
  if(!exists("[data-landing-tool='beta']")){
   const openBeta=make("button",{type:"button","data-landing-tool":"beta","aria-label":"Open Beta Program"});
   openBeta.append(make("span",{},"Beta"));
   openBeta.addEventListener("click",()=>{
    const original=document.getElementById("vnvBetaProgramLink");
    if(original&&typeof original.click==="function"){original.click();return}
    const intended=window.VNVBetaProgram?.href?.()||URLS.beta;
    try{window.location.assign(intended)}catch{window.location.href=intended}
   });
   dock.append(openBeta);
  }
 }else{
  if(beta){
   beta.dataset.landingTool="beta";
   beta.setAttribute("aria-label","Beta Program");
   beta.replaceChildren(make("span",{},"Beta"));
   if(beta.parentElement!==dock)dock.append(beta);
  }
  if(!beta&&!exists("[data-landing-tool='beta']"))addLink(dock,"beta","Beta",URLS.beta);
 }
 // Existing learner Profile control stays accessible on High School campus landings.
 // Never duplicate the student toolbar on lesson/quiz routes: only root index loads this file.
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
