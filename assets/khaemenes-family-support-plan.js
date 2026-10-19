/*
 * Khaemenes Academy Family Support Plan v1.0.0
 * Parent/guardian weekly support planning. Never changes formal course state.
 */
(function attachKhaemenesFamilySupportPlan(global){
"use strict";
const VERSION="1.0.0";
const STORAGE_KEY="khaemenes_parent_support_plan_v1";
const CARD_ID="khaemenesFamilySupportPlan";
const STYLE_ID="khaemenesFamilySupportPlanStyles";
const MENTOR_URL="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=(v,max=500)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
const readJSON=(key,fallback=null)=>{try{const raw=global.localStorage?.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
const writeJSON=(key,value)=>{try{global.localStorage?.setItem(key,JSON.stringify(value));return true}catch{return false}};
const registry=()=>global.KhaemenesFamilyRegistry||null;
const actionCenter=()=>global.KhaemenesParentActionCenter||null;
const SUPPORT_TYPES=Object.freeze([
 ["conversation","Positive learning conversation"],
 ["routine","Study routine & organization"],
 ["retrieval","Memory / Smart Review support"],
 ["corrections","Corrections or mastery encouragement"],
 ["assessment","Assessment preparation environment"],
 ["project","Project / lab / portfolio check-in"],
 ["wellbeing","Breaks, movement & learning readiness"]
]);
const ROUTINES=Object.freeze([
 ["once","One 10-minute family check-in this week"],
 ["twice","Two short check-ins this week"],
 ["daily","A brief daily check-in"],
 ["weekend","One weekend planning conversation"],
 ["learner-led","Learner chooses when to ask for support"]
]);
function iso(){return new Date().toISOString()}
function weekKey(date=new Date()){const d=new Date(date);d.setHours(12,0,0,0);const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return d.toISOString().slice(0,10)}
function context(){const R=registry(),family=R?.getFamily?.()||null,adult=R?.getAdult?.()||null;return{R,family,adult}}
function authorizedLearners(){const {R,family,adult}=context();if(!R||!family||!adult)return[];return(Array.isArray(family.learners)?family.learners:[]).filter(l=>l?.learnerId&&l.selfDirectedAdult!==true&&R.canAdult?.(adult.adultId,l.learnerId,"progress.view")).map(l=>Object.freeze({...l}))}
function scopeKey(){const {family,adult}=context();return family?.familyId&&adult?.adultId?family.familyId+"|"+adult.adultId:null}
function store(){const value=readJSON(STORAGE_KEY,null);return value&&value.version===1&&value.scopes&&typeof value.scopes==="object"?value:{version:1,scopes:{},updatedAt:null}}
function scope(){const key=scopeKey();if(!key)return null;const s=store();return s.scopes[key]&&typeof s.scopes[key]==="object"?s.scopes[key]:{learners:{},updatedAt:null}}
function learnerPlan(learnerId){const sc=scope(),record=sc?.learners?.[learnerId];return record&&typeof record==="object"?record:null}
function priorityFor(learner){try{const summary=actionCenter()?.learnerSummary?.(learner);if(!summary)return null;return{summary,firstAttention:summary.categorized?.attention?.[0]||null,firstTrack:summary.categorized?.track?.[0]||null,firstCelebrate:summary.categorized?.celebrate?.[0]||null}}catch{return null}}
function suggestedPlan(learner){
 const p=priorityFor(learner),summary=p?.summary;
 if(!summary)return Object.freeze({supportType:"conversation",goal:"Have one positive conversation about what the learner is working on and what kind of support they want.",routine:"once",conversation:"What are you working on right now, and what kind of help would feel useful from me?"});
 const attention=p.firstAttention;
 if(attention?.status==="corrections")return Object.freeze({supportType:"corrections",goal:"Protect time for the learner to complete corrections and explain what changed in their reasoning.",routine:"once",conversation:"What did the correction help you notice, and what will you try differently next time?"});
 if(attention?.status==="mastery"||(attention?.best!==null&&attention?.best<attention?.threshold))return Object.freeze({supportType:"corrections",goal:"Support one calm mastery retry without supplying answers or taking over the work.",routine:"twice",conversation:"Which skill feels least certain, and what strategy do you want to use before you retry?"});
 if(attention?.status==="assessment")return Object.freeze({supportType:"assessment",goal:"Help the learner prepare a quiet, organized assessment environment and choose one final review target.",routine:"once",conversation:"What do you already feel ready for, and what is the one thing you want to review once more?"});
 if(summary.dueReview>0)return Object.freeze({supportType:"retrieval",goal:"Encourage the learner to complete due Smart Review items using recall before reopening notes.",routine:"twice",conversation:"What can you remember before you look back at your notes?"});
 if(summary.refreshNeeded>0)return Object.freeze({supportType:"routine",goal:"Open the learner’s current course once so the Family Portal receives an up-to-date continuation summary.",routine:"once",conversation:"Can you show me where you left off so we can make sure your next-step summary is current?"});
 if(p.firstTrack)return Object.freeze({supportType:"conversation",goal:"Keep the learner’s momentum visible with one short, learner-led conversation about the next step.",routine:"once",conversation:"What is your next learning step, and what would make it easier to get started?"});
 return Object.freeze({supportType:"conversation",goal:"Celebrate progress and invite the learner to explain one thing they understand better this week.",routine:"learner-led",conversation:"What are you most proud of learning or figuring out this week?"});
}
function normalizePlan(input,learner){
 const type=SUPPORT_TYPES.some(x=>x[0]===input?.supportType)?input.supportType:"conversation";
 const routine=ROUTINES.some(x=>x[0]===input?.routine)?input.routine:"once";
 return{schema:"khaemenes-family-support-plan-record-v1",learnerId:learner.learnerId,nickname:clean(learner.nickname||"Learner",120),weekKey:weekKey(),supportType:type,goal:clean(input?.goal,700),routine,conversation:clean(input?.conversation,500),parentNote:clean(input?.parentNote,700),completed:Boolean(input?.completed),createdAt:input?.createdAt||iso(),updatedAt:iso()};
}
function savePlan(learnerId,input={}){
 const {family,adult}=context(),key=scopeKey(),learner=authorizedLearners().find(l=>l.learnerId===learnerId);
 if(!key||!family||!adult||!learner)return false;
 const s=store(),sc=s.scopes[key]&&typeof s.scopes[key]==="object"?s.scopes[key]:{learners:{},history:[]};
 sc.learners=sc.learners&&typeof sc.learners==="object"?sc.learners:{};
 sc.history=Array.isArray(sc.history)?sc.history:[];
 const prior=sc.learners[learnerId],record=normalizePlan({...prior,...input,createdAt:prior?.createdAt||iso()},learner);
 if(prior&&prior.weekKey&&prior.weekKey!==record.weekKey){
   sc.history.push({learnerId,weekKey:prior.weekKey,supportType:prior.supportType,goal:prior.goal,completed:Boolean(prior.completed),archivedAt:iso()});
   sc.history=sc.history.slice(-52);
 }
 sc.learners[learnerId]=record;sc.updatedAt=record.updatedAt;s.scopes[key]=sc;s.updatedAt=record.updatedAt;
 const ok=writeJSON(STORAGE_KEY,s);
 if(ok)global.dispatchEvent(new CustomEvent("khaemenes-family-support-plan-changed",{detail:{learnerId,weekKey:record.weekKey,updatedAt:record.updatedAt}}));
 return ok;
}
function applySuggestion(learnerId){const learner=authorizedLearners().find(l=>l.learnerId===learnerId);if(!learner)return false;return savePlan(learnerId,{...suggestedPlan(learner),completed:false,parentNote:""})}
function markComplete(learnerId,value=true){const current=learnerPlan(learnerId),learner=authorizedLearners().find(l=>l.learnerId===learnerId);if(!learner)return false;return savePlan(learnerId,{...(current||suggestedPlan(learner)),completed:Boolean(value)})}
function planSummary(){return Object.freeze(authorizedLearners().map(learner=>{const current=learnerPlan(learner.learnerId),suggested=suggestedPlan(learner),plan=current?.weekKey===weekKey()?current:null;return Object.freeze({learnerId:learner.learnerId,nickname:learner.nickname||"Learner",grade:learner.grade||null,stage:learner.stage||null,plan:plan?Object.freeze({...plan}):null,suggestion:suggested})}))}
function addStyles(){
 if(document.getElementById(STYLE_ID))return;
 const style=document.createElement("style");style.id=STYLE_ID;
 style.textContent=
 "#"+CARD_ID+"{margin-top:18px;padding:24px;border:1px solid rgba(72,86,116,.15);border-radius:21px;background:#fff;box-shadow:0 20px 50px rgba(22,36,55,.08)}"+
 "#"+CARD_ID+" .fsp-kicker{margin:0;color:#725f82;font:500 10px/1.3 Cinzel,Georgia,serif;letter-spacing:.12em;text-transform:uppercase}"+
 "#"+CARD_ID+" h3{margin:7px 0 0;color:#17233d;font:500 1.65rem/1.2 Cinzel,Georgia,serif}"+
 "#"+CARD_ID+" .fsp-intro{max-width:820px;margin:8px 0 0;color:#68727a;font-size:12px}"+
 "#"+CARD_ID+" .fsp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:16px}"+
 "#"+CARD_ID+" .fsp-learner{padding:16px;border:1px solid rgba(28,45,67,.12);border-radius:12px;background:#fffdf8}"+
 "#"+CARD_ID+" .fsp-learner h4{margin:0;color:#17392f;font:500 1.2rem Georgia,serif}"+
 "#"+CARD_ID+" .fsp-meta{margin:3px 0 10px;color:#68736d;font-size:10px}"+
 "#"+CARD_ID+" .fsp-suggestion{padding:10px;border-left:3px solid #b48b45;border-radius:7px;background:#fff8e8;color:#62502f;font-size:10.5px;line-height:1.5}"+
 "#"+CARD_ID+" .fsp-field{display:grid;gap:5px;margin-top:10px}"+
 "#"+CARD_ID+" .fsp-field label{font-size:9.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#56645e}"+
 "#"+CARD_ID+" .fsp-field input,#"+CARD_ID+" .fsp-field select,#"+CARD_ID+" .fsp-field textarea{width:100%;padding:9px 10px;border:1px solid rgba(28,45,67,.16);border-radius:7px;background:#fff;color:#26313a;font:inherit}"+
 "#"+CARD_ID+" .fsp-field textarea{min-height:72px;resize:vertical}"+
 "#"+CARD_ID+" .fsp-conversation{margin:10px 0 0;padding:10px;border:1px solid rgba(65,107,80,.15);border-radius:7px;background:#f3f8f4;color:#315f3c;font-size:10.5px;line-height:1.5}"+
 "#"+CARD_ID+" .fsp-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}"+
 "#"+CARD_ID+" .fsp-actions button,#"+CARD_ID+" .fsp-actions a{min-height:39px;display:inline-flex;align-items:center;justify-content:center;padding:7px 10px;border:1px solid rgba(28,45,67,.18);border-radius:7px;background:#fff;color:#17233d;text-decoration:none;font:600 10px/1.2 'Avenir Next','Segoe UI',Arial,sans-serif}"+
 "#"+CARD_ID+" .fsp-actions .primary{color:#fff;background:#17392f;border-color:#17392f}"+
 "#"+CARD_ID+" .fsp-complete{display:inline-flex;margin-top:8px;padding:4px 7px;border-radius:999px;background:#eef8f1;color:#315f3c;font-size:9px;font-weight:700}"+
 "#"+CARD_ID+" .fsp-boundary{margin-top:15px;padding:11px 13px;border:1px solid rgba(28,45,67,.12);border-radius:7px;background:#f7f8fa;color:#68727a;font-size:10px}"+
 "@media(max-width:600px){#"+CARD_ID+"{padding:18px 14px}#"+CARD_ID+" .fsp-grid{grid-template-columns:1fr}}"+
 "@media print{#"+CARD_ID+" .fsp-actions,#"+CARD_ID+" .fsp-field{display:none!important}}";
 (document.head||document.documentElement).appendChild(style);
}
function supportOptions(selected){return SUPPORT_TYPES.map(([value,label])=>'<option value="'+esc(value)+'"'+(value===selected?' selected':'')+'>'+esc(label)+'</option>').join("")}
function routineOptions(selected){return ROUTINES.map(([value,label])=>'<option value="'+esc(value)+'"'+(value===selected?' selected':'')+'>'+esc(label)+'</option>').join("")}
function learnerMarkup(row){
 const suggested=row.suggestion,plan=row.plan||null,current=plan||suggested,completed=Boolean(plan?.completed);
 return '<article class="fsp-learner" data-fsp-learner="'+esc(row.learnerId)+'">'+
 '<h4>'+esc(row.nickname)+'</h4><p class="fsp-meta">'+esc(row.grade?("Grade "+row.grade):row.stage||"Academy learner")+' · Week of '+esc(weekKey())+'</p>'+
 '<div class="fsp-suggestion"><strong>Suggested family support</strong><br>'+esc(suggested.goal)+'</div>'+
 '<div class="fsp-field"><label>Support focus</label><select data-fsp-type>'+supportOptions(current.supportType)+'</select></div>'+
 '<div class="fsp-field"><label>Family goal for this week</label><textarea data-fsp-goal maxlength="700">'+esc(current.goal)+'</textarea></div>'+
 '<div class="fsp-field"><label>Check-in rhythm</label><select data-fsp-routine>'+routineOptions(current.routine)+'</select></div>'+
 '<div class="fsp-field"><label>Optional parent note</label><textarea data-fsp-note maxlength="700" placeholder="A short note for your own family planning.">'+esc(plan?.parentNote||"")+'</textarea></div>'+
 '<div class="fsp-conversation"><strong>Conversation prompt</strong><br><span>'+esc(current.conversation)+'</span></div>'+
 (completed?'<span class="fsp-complete">Family support goal completed this week</span>':'')+
 '<div class="fsp-actions"><button type="button" class="primary" data-fsp-save>Save Weekly Plan</button><button type="button" data-fsp-suggest>Use Suggested Plan</button><button type="button" data-fsp-complete>'+(completed?'Mark Incomplete':'Mark Complete')+'</button><a href="../student/" data-fsp-profile>Open Learner Portal</a><a href="'+MENTOR_URL+'" data-fsp-mentor>Ask Archaemenes</a></div></article>';
}
function render(){
 addStyles();
 const root=document.getElementById("familyApp"),R=registry();let card=document.getElementById(CARD_ID);
 if(!root||!R){card?.remove();return null}
 const rows=planSummary();if(!rows.length){card?.remove();return rows}
 if(!card){card=document.createElement("section");card.id=CARD_ID;root.appendChild(card)}
 card.innerHTML='<p class="fsp-kicker">Family Support Plan</p><h3>Turn learning information into one practical family action.</h3><p class="fsp-intro">Choose one manageable support goal for each learner this week. The plan is intentionally small: support the learner’s environment, routine, reflection, or encouragement without becoming the grader or taking over the work.</p><div class="fsp-grid">'+rows.map(learnerMarkup).join("")+'</div><div class="fsp-boundary"><strong>Authority boundary:</strong> Family Support Plans are browser-local parent planning notes. They cannot change grades, mastery, placement, assessment records, curriculum gates, learner identity, or private learner reflections.</div>';
 card.querySelectorAll("[data-fsp-learner]").forEach(box=>{
   const learnerId=box.dataset.fspLearner;
   box.querySelector("[data-fsp-save]")?.addEventListener("click",()=>{
     const learner=authorizedLearners().find(l=>l.learnerId===learnerId);if(!learner)return;
     const current=learnerPlan(learnerId),suggested=suggestedPlan(learner);
     const input={supportType:box.querySelector("[data-fsp-type]")?.value||suggested.supportType,goal:box.querySelector("[data-fsp-goal]")?.value||suggested.goal,routine:box.querySelector("[data-fsp-routine]")?.value||suggested.routine,conversation:current?.conversation||suggested.conversation,parentNote:box.querySelector("[data-fsp-note]")?.value||"",completed:Boolean(current?.completed)};
     if(savePlan(learnerId,input))render();
   });
   box.querySelector("[data-fsp-suggest]")?.addEventListener("click",()=>{if(applySuggestion(learnerId))render()});
   box.querySelector("[data-fsp-complete]")?.addEventListener("click",()=>{const current=learnerPlan(learnerId);if(markComplete(learnerId,!current?.completed))render()});
   box.querySelector("[data-fsp-profile]")?.addEventListener("click",()=>{try{R.setActive({learnerId})}catch{}});
   box.querySelector("[data-fsp-mentor]")?.addEventListener("click",()=>{try{R.setActive({learnerId})}catch{}});
 });
 return rows;
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(render,90)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
for(const eventName of ["pageshow","khaemenes-family-ready","khaemenes-family-changed","khaemenes-learner-placement-changed","khaemenes-learning-continuation-changed","khaemenes-study-review-changed","khaemenes-parent-brief-reviewed"])global.addEventListener(eventName,schedule);
global.addEventListener("storage",event=>{if(String(event.key||"").startsWith("khaemenes"))schedule()});
global.KhaemenesFamilySupportPlan=Object.freeze({
 version:VERSION,storageKey:STORAGE_KEY,weekKey,authorizedLearners,suggestedPlan,learnerPlan,planSummary,savePlan,applySuggestion,markComplete,refresh:schedule,
 authority:Object.freeze({parentPlanningOnly:true,changesGrades:false,awardsMastery:false,changesPlacement:false,changesAssessmentRecords:false,unlocksCurriculum:false,changesLearnerIdentity:false}),
 privacy:Object.freeze({browserLocal:true,progressPermissionRequired:true,privateLearnerReflectionsRead:false,childConversationsRead:false,assessmentResponsesRead:false,answerKeysRead:false})
});
})(window);
