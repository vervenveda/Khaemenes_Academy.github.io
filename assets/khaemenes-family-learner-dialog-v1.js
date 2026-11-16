/* Parent Profile · learner-specific family learning dialogs.
 * Read-only for ordinary courses. Only the existing Kindergarten plan API can write
 * six activity preferences after its original education.manage check.
 * No new localStorage keys, account authority or course-grade mutations.
 */
(function(g,d){"use strict";
 if(g.KhaemenesFamilyLearnerDialog)return;
 const R=()=>g.KhaemenesFamilyRegistry,C=()=>g.KhaemenesLearningContinuation,P=()=>g.KhaemenesKinderFamilyDailyPlan;
 const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const css=`#kaFamilyLearnerDialog{width:min(760px,calc(100vw - 28px));max-height:min(90vh,900px);overflow:auto;border:1px solid #D7D9D2;border-radius:7px;padding:0;background:#FFFDF8;color:#202724;box-shadow:0 20px 65px rgba(16,26,22,.32);font:400 18px/1.6 Nunito,Arial,sans-serif}
 #kaFamilyLearnerDialog::backdrop{background:rgba(17,28,25,.68)}
 #kaFamilyLearnerDialog .ka-modal-head{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;gap:16px;background:#202724;color:#FFF8E9;padding:17px 22px;z-index:1}
 #kaFamilyLearnerDialog .ka-modal-head h2{margin:0;color:#FFF8E9;font:400 clamp(24px,4vw,33px)/1.3 Cinzel,Georgia,serif}
 #kaFamilyLearnerDialog .ka-modal-close{min-width:49px;min-height:49px;background:#FFF8E9;color:#202724;border:1px solid #FFF8E9;border-radius:7px;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer}
 #kaFamilyLearnerDialog .ka-modal-body{padding:22px}
 #kaFamilyLearnerDialog p,#kaFamilyLearnerDialog label{font:400 18px/1.6 Nunito,Arial,sans-serif;color:#202724}
 #kaFamilyLearnerDialog .ka-modal-note{font-size:16px}
 #kaFamilyLearnerDialog .ka-modal-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
 #kaFamilyLearnerDialog .ka-modal-actions a,#kaFamilyLearnerDialog .ka-modal-actions button{display:inline-flex;align-items:center;justify-content:center;min-height:49px;padding:10px 15px;border-radius:7px;background:#202724;color:#FFF8E9;border:1px solid #202724;text-decoration:none;font:400 16px/1.35 Nunito,Arial,sans-serif;cursor:pointer}
 #kaFamilyLearnerDialog .ka-modal-actions button:disabled{opacity:.55;cursor:not-allowed}
 #kaFamilyLearnerDialog .ka-kinder-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:15px}
 #kaFamilyLearnerDialog .ka-kinder-choices label{display:flex;align-items:center;gap:9px;background:#FFF8E9;border:1px solid #D7D9D2;border-radius:7px;padding:12px;font-size:16px}
 #kaFamilyLearnerDialog .ka-kinder-choices input{width:20px;height:20px;flex:0 0 20px}
 #kaFamilyLearnerDialog .ka-course-item{padding:10px 0;border-bottom:1px solid #D7D9D2;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}
 #kaFamilyLearnerDialog :focus-visible{outline:3px solid #B48B45;outline-offset:3px}
 @media(max-width:580px){#kaFamilyLearnerDialog .ka-kinder-choices{grid-template-columns:1fr}#kaFamilyLearnerDialog .ka-modal-body{padding:16px}}`;
 let dialog=null,returnFocus=null,currentId=null;
 function ensure(){
  if(dialog)return dialog;
  const sheet=d.createElement("style");sheet.id="kaFamilyLearnerDialogStyles";sheet.textContent=css;d.head.append(sheet);
  dialog=d.createElement("dialog");dialog.id="kaFamilyLearnerDialog";
  dialog.setAttribute("aria-labelledby","kaFamilyLearnerDialogTitle");
  dialog.innerHTML='<div class="ka-modal-head"><h2 id="kaFamilyLearnerDialogTitle">Family Learning</h2><button type="button" class="ka-modal-close" aria-label="Close Family Learning">Close</button></div><div class="ka-modal-body" id="kaFamilyLearnerDialogBody"></div>';
  d.body.append(dialog);
  dialog.querySelector(".ka-modal-close").addEventListener("click",close);
  dialog.addEventListener("close",()=>{currentId=null;const target=returnFocus;returnFocus=null;target?.isConnected&&target.focus()});
  dialog.addEventListener("click",event=>{if(event.target===dialog)close()});
  return dialog;
 }
 function close(){if(!dialog)return;if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open")}
 function context(id){
  const registry=R(),family=registry?.getFamily?.(),active=registry?.activeIds?.()||{},adult=registry?.getAdult?.(active.adultId);
  const learner=family?.learners?.find(l=>l?.learnerId===id&&l.familyId===family.familyId&&!l.selfDirectedAdult);
  const member=!!(family&&adult&&family.adultIds?.includes(adult.adultId)&&learner);
  return {registry,family,active,adult,learner,member,view:member&&registry.canAdult?.(adult.adultId,id,"progress.view")===true,
   manage:member&&registry.canAdult?.(adult.adultId,id,"education.manage")===true};
 }
 const make=(tag,text,className)=>{const el=d.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el};
 const action=(parent,label,href)=>{const a=make("a",label);a.href=href;parent.append(a);return a};
 function studentUrl(l){
  const stage=String(l.stage||"").toLowerCase(),n=Number(String(l.grade||"").replace(/^grade[- ]?/i,""));
  if(stage==="high"&&n>=9&&n<=12)return "https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+String(n).padStart(2,"0")+"/student-profile/";
  if(stage==="kindergarten")return "https://vervenveda.com/Khaemenes_KinderGarden.github.io/student-profile/";
  if(stage==="preschool")return "https://vervenveda.com/Khaemenes_Preschool.github.io/student-profile/#learningStudio";
  if(stage==="elementary")return "https://vervenveda.com/Khaemenes_Elementary.github.io/student-profile/";
  if(stage==="middle"&&n>=6&&n<=8)return "https://vervenveda.com/Khaemenes_Middle.github.io/grades/grade-"+String(n).padStart(2,"0")+"/";
  return "../enroll/#existing";
 }
 function render(id){
  const x=context(id),body=dialog.querySelector("#kaFamilyLearnerDialogBody"),title=dialog.querySelector("#kaFamilyLearnerDialogTitle");
  body.replaceChildren();if(!x.member){
   title.textContent="Family Learning";body.append(make("p","A selected family adult with access to this learner is required. Return to the Parent Portal to review your family access."));return;
  }
  title.textContent=(x.learner.nickname||"Learner")+" · Family Learning";
  const meta=make("p",(x.learner.stage||"Learner")+" · "+(x.learner.grade?"Grade "+x.learner.grade:"Placement not recorded"));
  body.append(meta);
  const nav=make("div",undefined,"ka-modal-actions");
  const student=action(nav,"Open Student Profile",studentUrl(x.learner));
  student.addEventListener("click",event=>{
   const curr=context(id);if(!curr.member){event.preventDefault();return}
   // Existing local selection only; this is not proof of authentication.
   try{curr.registry.setActive({familyId:curr.family.familyId,adultId:curr.adult.adultId,learnerId:id})}
   catch{event.preventDefault()}
  });
  action(nav,"Family Records & Backup","../#family-records-controls");
  if(x.learner.stage==="kindergarten"){
   const intro=make("p","Kindergarten · Family Daily Plan. Choose up to six playful activities. This supports participation, not formal lesson mastery.");body.append(intro);
   const api=P();const current=x.active.learnerId===id;
   const canEdit=current&&x.manage&&api?.adultAllowed?.(id)===true;
   if(!current){const choose=make("button","Make this the active learner");choose.type="button";choose.className="ka-choose-learner";
    const line=make("div",undefined,"ka-modal-actions");line.append(choose);body.append(line);
    choose.disabled=!x.manage;choose.addEventListener("click",()=>{
     const now=context(id);if(!now.manage)return;
     try{now.registry.setActive({familyId:now.family.familyId,adultId:now.adult.adultId,learnerId:id});render(id)}catch{body.append(make("p","Could not change the selected learner."))}
    });
   }
   const snapshot=canEdit?api?.state?.(id):null;
   const plan=api?.ACTIVITIES||[];
   const choices=make("div",undefined,"ka-kinder-choices");
   for(const act of plan){
    const label=make("label"),input=d.createElement("input");input.type="checkbox";input.value=act.id;
    input.checked=!!snapshot?.activities.includes(act.id);input.disabled=!canEdit;
    label.append(input,make("span",act.icon+" "+act.label));choices.append(label);
   }
   body.append(choices);
   const actions=make("div",undefined,"ka-modal-actions");const save=make("button","Save My Family Plan");save.type="button";save.disabled=!canEdit;actions.append(save);body.append(actions);
   const status=make("p",canEdit?"Choose between one and six activities to save on this browser.":"Activity editing needs the existing education.manage permission and this learner to be active.","ka-modal-note");
   status.setAttribute("role","status");body.append(status);
   save.addEventListener("click",()=>{
    const now=context(id);if(!now.manage||now.active.learnerId!==id||P()?.adultAllowed?.(id)!==true){status.textContent="Family permissions or learner selection changed. Save was withheld.";return}
    const selected=[...choices.querySelectorAll('input:checked')].map(el=>el.value);
    if(selected.length<1||selected.length>6){status.textContent="Choose between one and six activities.";return}
    status.textContent=P()?.configure?.(id,selected)?"Family activity choices saved on this browser.":"Save could not be verified; the existing plan was not confirmed changed.";
   });
  }else{
   if(!x.view){body.append(make("p","The selected adult does not have permission to view this learner's course progress."));body.append(nav);return}
   const snapshots=C()?.readLearner?.(id)||[];
   body.append(make("h3","Course Progress"));
   body.append(make("p","Browser-local continuation snapshots are learning indicators, not certified grades or complete transcripts.","ka-modal-note"));
   if(!snapshots.length)body.append(make("p","No course continuation snapshots are available on this browser."));
   for(const item of snapshots.slice(0,15)){
    const row=make("div",undefined,"ka-course-item"),name=make("strong",item.courseTitle||item.courseId||"Course");
    const value=item?.progress?.percent,ok=!item.stale&&Number.isFinite(value)&&value>=0&&value<=100;
    const outcome=make("span",item.stale?"Refresh required":ok?Math.round(value)+"% reported completion":"Not reported");
    row.append(name,outcome);body.append(row);
   }
   body.append(make("h3","Daily Family Report"));
   let data=null;
   try{data=JSON.parse(g.localStorage.getItem("khaemenes-grade09-daily-parent-report-v1:"+encodeURIComponent(id))||"null")}catch{}
   const reportMap=data?.learnerId===id&&data.reports&&typeof data.reports==="object"&&!Array.isArray(data.reports)?data.reports:{};
   const dates=Object.keys(reportMap).filter(day=>/^\d{4}-\d{2}-\d{2}$/.test(day)).sort();
   const date=dates.length?dates[dates.length-1]:null,entry=date?reportMap[date]:null;
   if(!entry||entry.learnerId!==id)body.append(make("p","No dated daily family report is available for this learner in this browser."));
   else{
    const habits=Array.isArray(entry.habits)?entry.habits:[],classes=Array.isArray(entry.classes)?entry.classes:[];
    body.append(make("p",date+" · "+habits.filter(v=>v.checked===true).length+" / "+habits.length+" daily activities checked; "+classes.filter(v=>v.masteredToday===true).length+" / "+classes.length+" reported academic checkpoints."));
   }
  }
  body.append(nav);
  body.append(make("p","Family data and activity choices remain on this browser unless separately exported. No records are emailed or synchronized by this dialog.","ka-modal-note"));
 }
 function open(id,trigger){
  if(typeof id!=="string"||id.length>180)return;
  const modal=ensure();returnFocus=trigger||d.activeElement;currentId=id;render(id);
  if(!modal.open){if(typeof modal.showModal==="function")modal.showModal();else modal.setAttribute("open","")}
  modal.querySelector(".ka-modal-close").focus();
 }
 g.KhaemenesFamilyLearnerDialog=Object.freeze({open,close});
 g.addEventListener("khaemenes-family-changed",()=>{if(dialog?.open&&currentId)render(currentId)});
})(window,document);