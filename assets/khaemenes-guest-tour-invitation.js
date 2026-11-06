/* Khaemenes Academy · public guest invitation, version 1.0.0
 * Presentation-only. No registration, credential, learner, coursework,
 * permission, score or download state is read or written by this component.
 * Authenticated course and family controls retain their own access gates.
 */
(()=>{"use strict";
if(window.KhaemenesGuestTourInvitation)return;
const ROOT="https://vervenveda.com/Khaemenes_Academy.github.io/";
const TOUR=ROOT+"tour/",FAMILY=ROOT+"family/enroll/";
const AREA=document.body?.dataset?.grade?"grade":/\/family\//.test(location.pathname)?"family":/\/student\//.test(location.pathname)?"student":"academy";
const thisGrade=Number(document.body?.dataset?.grade||0);
const labels=new Set(["Edit Profile","Class Progress","Schedule","KlasaiPeer","Yearbook","Creative Tools","Student Portfolio","Customize Background"]);
const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
const style=make("style");style.id="khae-guest-tour-invitation-css";style.textContent=`
#khaeGuestTourDialog{box-sizing:border-box;width:min(550px,calc(100vw - 26px));max-width:550px;max-height:calc(100dvh - 26px);margin:auto;padding:0;overflow:auto;border:2px solid #b48b45;border-radius:7px;background:#fffaf2;color:#243038;box-shadow:0 20px 70px #0008;font:400 16px/1.6 "Brandon Grotesque",Nunito,Arial,sans-serif}
#khaeGuestTourDialog::backdrop{background:rgba(15,25,28,.76)}
#khaeGuestTourDialog .khae-guest-banner{padding:17px 22px;background:#243038;color:#fff8e9}
#khaeGuestTourDialog .khae-guest-eyebrow{font:400 16px/1.35 Cinzel,Georgia,serif;color:#e4c58a;margin:0 0 6px}
#khaeGuestTourDialog h2{font:400 clamp(25px,4vw,33px)/1.25 Cinzel,Georgia,serif;color:#fff8e9;margin:0}
#khaeGuestTourDialog .khae-guest-body{padding:22px}
#khaeGuestTourDialog p{margin:0 0 13px;font-size:16px;line-height:1.6;color:#364941}
#khaeGuestTourDialog .khae-guest-context{border-left:3px solid #b48b45;background:#f4ecdd;padding:11px 13px;border-radius:7px}
#khaeGuestTourDialog .khae-guest-actions{display:grid;gap:10px;margin-top:19px}
#khaeGuestTourDialog .khae-guest-actions :is(a,button){box-sizing:border-box;min-height:48px;width:100%;display:flex;justify-content:center;align-items:center;padding:11px 13px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;-webkit-text-fill-color:#fff8e9;font:400 16px/1.4 "Brandon Grotesque",Nunito,Arial,sans-serif;text-decoration:none;text-align:center;cursor:pointer}
#khaeGuestTourDialog .khae-guest-actions a.khae-guest-secondary{background:#fff8e9;color:#243038;-webkit-text-fill-color:#243038}
#khaeGuestTourDialog .khae-guest-actions button.khae-guest-dismiss{background:transparent;color:#243038;-webkit-text-fill-color:#243038}
#khaeGuestTourDialog :is(a,button):focus-visible{outline:3px solid #b48b45;outline-offset:3px}
`;
document.head.append(style);
const dialog=make("dialog");dialog.id="khaeGuestTourDialog";dialog.setAttribute("aria-labelledby","khaeGuestTourTitle");
const banner=make("header","khae-guest-banner");
banner.append(make("p","khae-guest-eyebrow","Explore before you enroll"));
const title=make("h2","","Discover Khaemenes Academy");title.id="khaeGuestTourTitle";banner.append(title);
const body=make("div","khae-guest-body");
body.append(make("p","","You're welcome to explore the Academy. For a child or teen to use personal learning tools, please begin enrollment with a parent, guardian, or other authorized adult supervisor."));
const context=make("p","khae-guest-context");context.setAttribute("role","status");body.append(context);
body.append(make("p","","Our public tour introduces the campuses, sample profile, lessons, and learning experience. It does not create student records, award grades, save coursework, or download restricted applications."));
const actions=make("div","khae-guest-actions");
const tour=make("a","","Begin the Academy Tour");tour.href=TOUR;
const enroll=make("a","khae-guest-secondary","Explore Family Enrollment");enroll.href=FAMILY;
const dismiss=make("button","khae-guest-dismiss","Continue Browsing");dismiss.type="button";dismiss.addEventListener("click",()=>dialog.close());
actions.append(tour,enroll,dismiss);body.append(actions);dialog.append(banner,body);
document.body.append(dialog);
let origin=null;
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>{if(origin?.isConnected)origin.focus()});
function open(feature,trigger){
 origin=trigger||document.activeElement;
 const name=String(feature||"this feature").slice(0,80);
 context.textContent=name+" is a personal learning feature. You can see how it works on the public Academy tour, without using another student's account.";
 if(!dialog.open&&typeof dialog.showModal==="function")dialog.showModal();
 else if(!dialog.open)dialog.setAttribute("open","");
 dismiss.focus();
}
function registeredGrade(){
 try{
  const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  const record=typeof id==="string"?registry?.learners?.[id]:null;
  const active=window.KhaemenesStudentProfileV2?.activeLearner?.();
  if(!record||record.learnerId!==id||record.stage!=="high")return null;
  if(active?.learnerId&&active.learnerId!==id)return null;
  const n=Number(record.grade);return [9,10,11,12].includes(n)?n:null;
 }catch{return null}
}
function hasStudent(){
 try{
  const reg=window.KhaemenesFamilyRegistry;
  if(reg?.getLearner?.()?.learnerId)return true;
  const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const r=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  return typeof id==="string"&&r?.learners?.[id]?.learnerId===id;
 }catch{return false}
}
function hasFamily(){try{return !!window.KhaemenesFamilyRegistry?.getFamily?.()}catch{return false}}
// Capturing phase prevents an account-only toolbar from looking nonresponsive.
// Any public destination without an explicit account boundary remains clickable.
document.addEventListener("click",event=>{
 const target=event.target.closest?.("a,button");
 if(!target||target.closest("#khaeGuestTourDialog")||event.defaultPrevented)return;
 if(target.closest("header[data-vnv-header],nav[data-vnv-header],.vnv-ecosystem-toolbar"))return;
 if(AREA==="grade"&&[9,10,11,12].includes(thisGrade)){
  const rail=target.closest("#khaeProfileToolRail");
  if(!rail)return;
  const label=target.textContent.trim().replace(/\s+/g," ");
  if(!labels.has(label)||registeredGrade()===thisGrade)return;
  event.preventDefault();event.stopImmediatePropagation();
  open(label,target);return;
 }
 if(AREA==="student"&&!hasStudent()){
  const a=target.closest("a");if(!a)return;
  const path=new URL(a.href,location.href).pathname;
  if(!/\/student\/profile(?:\.html|\/|$)/.test(path))return;
  event.preventDefault();event.stopImmediatePropagation();open("My Student Profile",target);return;
 }
 if(AREA==="family"&&!hasFamily()){
  if(!target.matches("[data-learner-profile],[data-open-next],[data-active],[data-open-family-feature]"))return;
  event.preventDefault();event.stopImmediatePropagation();
  open(target.textContent.trim()||"Family Learning Workspace",target);
 }
},true);
window.KhaemenesGuestTourInvitation=Object.freeze({version:"1.0.0",open,tourUrl:TOUR});
})();
