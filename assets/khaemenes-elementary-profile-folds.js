/* Elementary Student Profile · collapsible workspace v1.0
 * Presentation-only, opt-in by inclusion on Elementary profile.
 * Native <details> nodes preserve original cards, controls, handlers and IDs.
 * Does not read/write learner storage, grade data, or account credentials.
 */
(()=>{"use strict";
const d=document,w=window,KEY="KhaemenesElementaryProfileFolds";
if(w[KEY])return;
const FOLD_CLASS="kep-fold",CONTENT_CLASS="kep-fold-content";
const definitions=[
 {selector:"#khaemenesElementaryProfileTools",id:"kepFoldTools",title:"Show or hide my profile tools",open:true,tools:true},
 {selector:"main .grid > section.card:has(#nextSteps)",id:"kepFoldToday",title:"Today · Next · Review",open:true},
 {selector:"main .grid > section.card:has(#pinned)",id:"kepFoldSubjects",title:"My Pinned Subject Halls",open:false},
 {selector:"#gradePreview",id:"kepFoldMilestone",title:"My Next Milestone",open:false},
 {selector:"#academyStudio",id:"kepFoldPassport",title:"My Learning Compass & Evidence Passport",open:false}
];
function revealElement(target){
 if(!target)return false;
 let found=false;
 for(const detail of d.querySelectorAll("main details."+FOLD_CLASS)){
  const section=detail.closest("section");
  if(section&&(section===target||detail.contains(target)||section.contains(target)&&target.id===section.id)){
   detail.open=true;found=true;
  }
 }
 return found;
}
function revealHash(){
 let hash;try{hash=decodeURIComponent(w.location.hash.slice(1))}catch{return}
 if(!hash)return;
 const target=d.getElementById(hash);
 if(target&&revealElement(target)){
  w.requestAnimationFrame(()=>target.scrollIntoView({block:"start"}));
 }
}
function makeFold(def){
 const section=d.querySelector(def.selector);
 if(!section||d.getElementById(def.id)||section.dataset.kepFoldApplied==="true")return false;
 const details=d.createElement("details"),summary=d.createElement("summary"),content=d.createElement("div");
 details.id=def.id;details.className=FOLD_CLASS;details.open=def.open;
 summary.className="kep-fold-summary";
 content.className=CONTENT_CLASS;
 if(def.tools){
  const heading=section.querySelector(":scope > .kep-heading");
  const old=[...section.childNodes].filter(node=>node!==heading);
  const label=d.createElement("span");label.textContent=def.title;
  summary.append(label);
  for(const node of old)content.append(node);
  details.append(summary,content);section.append(details);
 }else{
  const heading=section.querySelector(":scope > h2");
  if(heading){summary.append(heading)}
  else{const label=d.createElement("span");label.textContent=def.title;summary.append(label)}
  for(const node of [...section.childNodes])if(node!==heading)content.append(node);
  details.append(summary,content);section.append(details);
 }
 section.dataset.kepFoldApplied="true";
 return true;
}
let mounted=false;
function mount(){
 if(mounted||d.body?.dataset.profileStage!=="elementary")return false;
 const root=d.getElementById("khaemenesElementaryProfileTools");
 if(!root)return false;
 for(const def of definitions)makeFold(def);
 if(!d.getElementById("kepFoldQuickControls")){
  const controls=d.createElement("nav");controls.id="kepFoldQuickControls";controls.setAttribute("aria-label","Profile section display");
  const label=d.createElement("span");label.textContent="My learning sections";
  const makeButton=(title,open)=>{
   const btn=d.createElement("button");btn.type="button";btn.textContent=title;
   btn.addEventListener("click",()=>{for(const def of definitions){const detail=d.getElementById(def.id);if(detail)detail.open=open}});
   return btn;
  };
  controls.append(label,makeButton("Expand All",true),makeButton("Collapse All",false));
  root.insertAdjacentElement("beforebegin",controls);
 }
 d.addEventListener("click",e=>{
  const link=e.target?.closest?.('a[href^="#"]');
  if(!link)return;
  const id=link.getAttribute("href").slice(1);
  if(!id)return;
  const dest=d.getElementById(id);
  if(dest)revealElement(dest);
 },true);
 w.addEventListener("hashchange",revealHash);
 w.addEventListener("pageshow",revealHash);
 mounted=true;revealHash();
 return true;
}
w[KEY]=Object.freeze({version:"1.0.0",mount,reveal:id=>revealElement(d.getElementById(id))});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
