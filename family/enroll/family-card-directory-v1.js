/* Academy enrollment Step 1 family directory. Presentation + opt-in navigation only.
 * The Family Registry remains the sole owner of family records and permissions.
 * Clicking a name is NOT identity verification or authorization.
 */
(()=>{"use strict";
const R=window.KhaemenesFamilyRegistry;
if(!R)return;
const pane=document.getElementById("familyPane");
if(!pane)return;
const make=(tag,klass,txt)=>{const el=document.createElement(tag);if(klass)el.className=klass;if(txt!==undefined)el.textContent=String(txt);return el;};
const roleName=role=>({
 parent:"Parent",guardian:"Legal guardian",caregiver:"Caregiver",educator:"Authorized educator",
 "other-authorized-adult":"Authorized adult"
})[role]||"Authorized adult";
const showName=o=>String(o?.displayName||o?.nickname||"Unnamed family member").trim();
let dialog,trigger;
function current(){try{return R.getFamily()}catch{return null}}
function permitted(a,l,permission){
 if(!a||!l||a.familyId!==undefined&&a.familyId!==l.familyId)return false;
 try{return Boolean(R.canAdult(a.adultId,l.learnerId,permission))}catch{return false}
}
function activeAdult(family){
 const a=R.getAdult?.();return a&&family?.adults.some(x=>x.adultId===a.adultId)?a:null;
}
function addLink(host,label,href,primary=false){
 if(!href)return;const a=make("a",primary?"fcd-link primary":"fcd-link",label);
 a.href=href;host.append(a);
}
function close(){if(!dialog)return;dialog.close();trigger?.focus();trigger=null}
function show(kind,id,origin){
 const family=current();if(!family)return;
 const adult=activeAdult(family);
 const person=kind==="adult"?family.adults.find(x=>x.adultId===id):family.learners.find(x=>x.learnerId===id&&!x.selfDirectedAdult);
 if(!person)return;
 // This device may contain provisional records for multiple adults. Do not disclose
 // another person's details without the locally selected adult and access relationship.
 if(kind==="learner"&&!permitted(adult,person,"learner.view")){
  const title=dialog.querySelector("[data-fcd-title]"),body=dialog.querySelector("[data-fcd-body]");
  title.textContent="Learner details unavailable";
  body.replaceChildren(make("p","","Select an adult with learner-view permission in the Family Hub before opening learner details."));
  trigger=origin;dialog.showModal();return;
 }
 const title=dialog.querySelector("[data-fcd-title]"),body=dialog.querySelector("[data-fcd-body]");
 body.replaceChildren();trigger=origin;
 title.textContent=showName(person);
 body.append(make("p","fcd-disclaimer","Local family information on this device. This is not identity verification or confirmed Academy enrollment."));
 const dl=make("dl","fcd-facts");
 const row=(label,value)=>{dl.append(make("dt","",label),make("dd","",value||"Not specified"))};
 if(kind==="adult"){
  row("Role",roleName(person.role));
  row("Family",family.displayName);
  row("Profile status","Provisional local profile");
  row("Student connections",String(family.learners.filter(l=>!l.selfDirectedAdult&&permitted(person,l,"learner.view")).length)+" accessible learner(s)");
 }else{
  const meta=R.gradeMeta?.[person.grade];
  row("Grade",meta?.label||"Placement needs review");
  row("School",meta?.school||person.stage||"Not specified");
  row("Learning status","Provisional local learner");
  row("Family",family.displayName);
 }
 body.append(dl);
 const actions=make("div","fcd-dialog-actions");
 if(kind==="adult"){
  addLink(actions,"Open Family Hub","../",true);
  addLink(actions,"Enrollment & placement","./");
  if(person.adultId===adult?.adultId)addLink(actions,"Adult learning pathway","../../adult/");
 }else{
  addLink(actions,"Family Hub","../");
  if(permitted(adult,person,"learner.view")){
   const route=window.KhaemenesFrontDoorRouter?.routeForLearner?.(person);
   if(typeof route?.destination==="string"&&route.destination){
    const enter=make("button","fcd-link primary","Select & enter learning");
    enter.type="button";
    enter.addEventListener("click",()=>{
      try{R.setActive({familyId:family.familyId,adultId:adult.adultId,learnerId:person.learnerId});
        location.href=route.destination;
      }catch{alert("The learner could not be selected. No navigation occurred. Please review the Family Hub.")}
    });actions.append(enter);
   }
   addLink(actions,"Student Portal","../../student/");
  }
  if(permitted(adult,person,"education.manage"))addLink(actions,"Review grade placement","./#learnerPane");
 }
 body.append(actions);
 // Read-only locally reported grades and completion. Never infer missing marks.
 const api=window.KhaemenesFamilyProgressExport;
 const preview=kind==="adult"?api?.previewFamily?.(person.adultId):api?.previewOne?.(person.learnerId);
 const section=make("section","fcd-progress-section");
 section.append(make("h4","fcd-progress-title","Class grades & completion"));
 section.append(make("p","fcd-progress-note","Quiz/test average and course completion are different measurements. Only locally published reports are shown; this is not a verified transcript or confirmed class enrollment."));
 if(preview?.ok){
  const holder=make("div","fcd-progress-table-scroll");
  const table=make("table","fcd-progress-table");
  const caption=make("caption","","Available class reports");
  const thead=make("thead",""),header=make("tr","");
  for(const h of (kind==="adult"?["Learner","Class","Quiz/test grade","Completed","Record"]:["Class","Quiz/test grade","Completed","Record"]))header.append(make("th","",h));
  thead.append(header);table.append(caption,thead);
  const tbody=make("tbody","");
  for(const r of preview.rows){
   const tr=make("tr","");
   const cells=kind==="adult"?[r.learner,r.course,r.gradePercent===null?"Not reported":r.gradePercent+"%",r.completedPercent===null?"Not reported":r.completedPercent+"%",r.reporting]:[r.course,r.gradePercent===null?"Not reported":r.gradePercent+"%",r.completedPercent===null?"Not reported":r.completedPercent+"%",r.reporting];
   for(const cell of cells)tr.append(make("td","",cell));
   tbody.append(tr);
  }
  table.append(tbody);holder.append(table);section.append(holder);
  const exportButton=make("button","fcd-export-button",kind==="adult"?"Export authorized family report (CSV)":"Export student report (CSV)");
  exportButton.type="button";
  const result=make("p","fcd-export-result","");result.setAttribute("role","status");result.setAttribute("aria-live","polite");
  exportButton.addEventListener("click",()=>{
   const outcome=kind==="adult"?api?.exportFamily?.(person.adultId):api?.exportOne?.(person.learnerId);
   result.textContent=outcome?.message||"Export unavailable.";
  });
  section.append(exportButton,result);
 }else{
  section.append(make("p","fcd-progress-note",preview?.message||"The progress-report module is unavailable. Try reopening the page."));
 }
 body.append(section);dialog.showModal();
}
function initDialog(){
 if(dialog)return;
 dialog=make("dialog","fcd-dialog");
 dialog.setAttribute("aria-labelledby","fcdDialogTitle");
 const head=make("div","fcd-dialog-heading");
 const title=make("h3","","Family member overview");title.id="fcdDialogTitle";title.dataset.fcdTitle="";
 const x=make("button","fcd-close","Close");x.type="button";x.setAttribute("aria-label","Close family member overview");x.addEventListener("click",close);
 head.append(title,x);
 const body=make("div","fcd-dialog-body");body.dataset.fcdBody="";
 dialog.append(head,body);
 dialog.addEventListener("click",e=>{if(e.target===dialog)close()});
 dialog.addEventListener("close",()=>{trigger?.focus();trigger=null});
 document.body.append(dialog);
}
function renderDirectory(){
 const family=current(),slot=document.getElementById("familyCardMembers");
 if(!slot||!family)return;
 slot.replaceChildren();
 slot.append(make("h3","fcd-heading","Family members"));
 const intro=make("p","fcd-intro","Select a name for a profile overview and useful learning links.");
 slot.append(intro);
 const adults=make("div","fcd-group");
 adults.append(make("p","fcd-group-title","Parents & authorized adults"));
 const adultList=make("ul","fcd-list");
 for(const a of family.adults||[]){
  const li=make("li","");
  const button=make("button","fcd-person",showName(a));button.type="button";button.dataset.fcdKind="adult";button.dataset.fcdId=a.adultId;
  const meta=make("span","fcd-person-meta",roleName(a.role));
  li.append(button,meta);adultList.append(li);
 }
 if(!adultList.children.length)adults.append(make("p","fcd-intro","No adult profile listed."));
 else adults.append(adultList);
 slot.append(adults);
 const learners=(family.learners||[]).filter(l=>!l.selfDirectedAdult);
 const section=make("div","fcd-group");
 section.append(make("p","fcd-group-title","K–12 learners"));
 const ul=make("ul","fcd-list");
 for(const person of learners){
  const li=make("li",""),btn=make("button","fcd-person",showName(person));btn.type="button";btn.dataset.fcdKind="learner";btn.dataset.fcdId=person.learnerId;
  const meta=R.gradeMeta?.[person.grade];
  li.append(btn,make("span","fcd-person-meta",meta?.label||"Placement pending"));ul.append(li);
 }
 if(ul.children.length)section.append(ul);
 else section.append(make("p","fcd-intro","Register a learner in Step 2 to see their name here."));
 slot.append(section);
 slot.append(make("p","fcd-private-note","This directory is shown only from this browser's provisional family records. Do not use a shared device to store private family information."));
}
pane.addEventListener("click",e=>{
 const target=e.target.closest?.("[data-fcd-kind][data-fcd-id]");
 if(!target||!pane.contains(target))return;
 initDialog();show(target.dataset.fcdKind,target.dataset.fcdId,target);
});
function refresh(){
 if(document.getElementById("familyCardMembers"))renderDirectory();
}
window.addEventListener("khaemenes-family-changed",()=>queueMicrotask(refresh));
window.addEventListener("khaemenes-learner-placement-changed",()=>queueMicrotask(refresh));
document.addEventListener("DOMContentLoaded",refresh,{once:true});
refresh();
window.KhaemenesEnrollmentFamilyCard=Object.freeze({refresh});
})();
