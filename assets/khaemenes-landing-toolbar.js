/* Academy campus landing tools · no learner-state reads, writes or grading changes.
   Mirrors Academy Front Desk: Search / Updates / Archaemenes / Contribute / Beta. */
(()=>{
"use strict";
const A="https://vervenveda.com/Khaemenes_Academy.github.io/";
const V="https://vervenveda.com/";
const URLS=Object.freeze({
 search:V+"PLERASearch.github.io/",mentor:A+"mentor/",
 contribute:V+"#support",student:A+"student/",family:A+"family/",
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
function addLink(dock,kind,label,href,mark){
 const control=make("a",{href,"data-landing-tool":kind,"aria-label":label});
 control.append(make("span",{className:"khae-dock-mark","aria-hidden":"true"},mark),make("span",{},label));
 dock.append(control);
 return control;
}
function init(){
 if(document.getElementById("khaemenesHomeUtilityDock")||document.getElementById(DOCK)||!document.body)return;
 document.body.dataset.khaeCampusLanding="true";
 const learner=document.getElementById(LEARNER_DOCK);
 const dock=learner||make("nav",{id:DOCK,"aria-label":"Academy campus quick utilities"});
 if(!learner)document.body.append(dock);
 const exists=selector=>!!dock.querySelector(selector);
 if(!exists("#khaemenesStudentSearchButton, [data-landing-tool='search']"))addLink(dock,"search","Search",URLS.search,"S");
 if(!exists("[data-landing-tool='updates']")){
  const up=make("button",{type:"button","data-landing-tool":"updates","aria-haspopup":"dialog","aria-controls":DIALOG,"aria-label":"Open Academy updates and help"});
  up.append(make("span",{className:"khae-dock-mark","aria-hidden":"true"},"U"),make("span",{},"Updates"));
  up.addEventListener("click",()=>{const dialog=updates();if(!dialog.open)dialog.showModal()});
  dock.append(up);
 }
 if(!exists("#khaemenesStudentMentorButton, [data-landing-tool='mentor']"))addLink(dock,"mentor","Archaemenes",URLS.mentor,"A");
 if(!exists("#khaemenesStudentContributeButton, [data-landing-tool='contribute']"))addLink(dock,"contribute","Contribute",URLS.contribute,"♡");
 const beta=document.getElementById("vnvBetaProgramLink");
 if(beta&&beta.parentElement!==dock)dock.append(beta);
 if(!beta&&!exists("[data-landing-tool='beta']"))addLink(dock,"beta","β Beta Program",URLS.beta,"β");
 // Existing learner Profile control stays accessible on High School campus landings.
 // Never duplicate the student toolbar on lesson/quiz routes: only root index loads this file.
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
