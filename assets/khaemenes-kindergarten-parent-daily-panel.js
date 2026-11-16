/* Family Hub Kindergarten daily activity controls (local family helper; no cloud auth). */
(function(g,d){"use strict";
 if(g.KhaemenesKinderParentDailyPanel)return;
 const r=()=>g.KhaemenesFamilyRegistry,p=()=>g.KhaemenesKinderFamilyDailyPlan;
 function mount(){
  // Presentation belongs only on the dedicated Parent Profile, never the Portal.
  if(!/\/family\/profile\/(?:index\.html)?$/.test(g.location.pathname))return false;
  const family=r()?.getFamily?.();
  const kinder=Array.isArray(family?.learners)?family.learners.filter(x=>x?.stage==="kindergarten"&&x.familyId===family.familyId&&x.learnerId):[];
  const existing=d.getElementById("khaeKinderFamilyDailyPanel");
  if(!kinder.length){existing?.remove();return false}
  if(existing)return true;
  const anchor=d.getElementById("khaeFamilyParentProfileHero");
  if(!anchor?.parentElement)return false;
  const section=d.createElement("section");section.id="khaeKinderFamilyDailyPanel";
  section.setAttribute("aria-labelledby","khaeKinderFamilyDailyTitle");
  section.style.cssText="width:min(94%,1100px);margin:22px auto;padding:22px;border:1px solid #d7d9d2;border-radius:7px;background:#fffdf8;color:#202724;font:400 18px/1.6 Nunito,Arial,sans-serif";
  const title=d.createElement("h2");title.id="khaeKinderFamilyDailyTitle";title.textContent="Kindergarten · Family Daily Plan";
  title.style.cssText="font:400 clamp(25px,3vw,34px)/1.25 Cinzel,Georgia,serif;margin:0 0 9px";
  const introduction=d.createElement("p");introduction.textContent="Choose up to six playful daily activities for your Kindergarten learner. Check-ins celebrate participation only; official lesson mastery stays in the curriculum.";
  const notice=d.createElement("p");notice.textContent="This is a local family-helper panel, not a verified parent sign-in or cloud record. Changes on one browser are not automatically available on another.";
  notice.style.cssText="font-size:16px;max-width:850px";
  const selected=d.createElement("label");selected.textContent="Kindergarten learner";
  const picker=d.createElement("select");picker.id="khaeKinderFamilyLearner";picker.style.cssText="display:block;width:min(100%,480px);min-height:48px;margin:7px 0 15px;border:1px solid #d7d9d2;border-radius:7px;font-size:18px;background:#fff";
  const activities=d.createElement("div");activities.id="khaeKinderFamilyActivityOptions";
  activities.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:9px;margin:10px 0 15px";
  const controls=d.createElement("div");controls.style.cssText="display:flex;flex-wrap:wrap;gap:10px";
  const save=d.createElement("button");save.type="button";save.textContent="Save My Family Plan";
  const choose=d.createElement("button");choose.type="button";choose.textContent="Select This Learner";
  const open=d.createElement("a");open.textContent="Open Kindergarten Profile";open.href="https://vervenveda.com/Khaemenes_KinderGarden.github.io/student-profile/";
  for(const element of [save,choose,open])element.style.cssText="display:inline-flex;align-items:center;justify-content:center;min-height:49px;padding:10px 15px;border-radius:7px;border:1px solid #202724;background:#202724;color:#fff8e9;font:400 16px Nunito,Arial,sans-serif;text-decoration:none";
  const status=d.createElement("p");status.id="khaeKinderFamilyPlanStatus";status.setAttribute("role","status");
  controls.append(choose,save,open);
  section.append(title,introduction,notice,selected,picker,activities,controls,status);
  anchor.insertAdjacentElement("afterend",section);
  function learnerChoices(){
   const family=r()?.getFamily?.(),active=r()?.activeIds?.()||{};
   const all=Array.isArray(family?.learners)?family.learners.filter(x=>x?.stage==="kindergarten"&&x.learnerId):[];
   const last=picker.value;
   picker.replaceChildren();
   const empty=d.createElement("option");empty.value="";empty.textContent="Choose a learner";picker.append(empty);
   for(const l of all){const option=d.createElement("option");option.value=l.learnerId;option.textContent=l.nickname||"Kindergarten learner";picker.append(option)}
   picker.value=all.some(x=>x.learnerId===last)?last:all.some(x=>x.learnerId===active.learnerId)?active.learnerId:all[0]?.learnerId||"";
   return all;
  }
  function render(){
   const all=learnerChoices(),id=picker.value,active=r()?.activeIds?.()||{};
   // The registry is a local selection pointer, not authentication.
   const matching=Boolean(id&&id===active.learnerId);
   const permitted=matching&&p()?.adultAllowed?.(id)===true;
   activities.replaceChildren();
   const current=matching?p()?.state?.(id):null;
   for(const activity of p()?.ACTIVITIES||[]){
    const label=d.createElement("label");label.style.cssText="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #ccbda5;border-radius:7px;background:#fff";
    const cb=d.createElement("input");cb.type="checkbox";cb.value=activity.id;cb.checked=!!current?.activities.includes(activity.id);cb.disabled=!permitted;
    cb.style.cssText="width:20px;height:20px;flex:0 0 20px";
    const text=d.createElement("span");text.textContent=activity.icon+" "+activity.label;
    label.append(cb,text);activities.append(label);
   }
   const family=r()?.getFamily?.(),adult=r()?.getAdult?.(active.adultId);
   const canSelect=!!(id&&adult&&family?.adultIds?.includes(adult.adultId)&&family?.learners?.some(l=>l.learnerId===id&&l.stage==="kindergarten"&&l.familyId===family.familyId));
   choose.hidden=matching||!canSelect;
   choose.style.display=matching||!canSelect?"none":"inline-flex";
   choose.disabled=!canSelect;
   save.disabled=!permitted;
   save.style.opacity=permitted?"1":".5";
   status.textContent=!all.length?"No Kindergarten learner in the active family. Enroll or select one first.":
    !matching?"Choose Select This Learner to switch the local learner context. This does not grant new permissions.":
    !permitted?"Local adult selection does not have education.manage permission for this learner.":
    "Choose 1–6 activities. The learner sees the updated plan on this browser.";
  }
  picker.onchange=render;
  choose.onclick=()=>{
   const family=r()?.getFamily?.(),ids=r()?.activeIds?.()||{},adult=r()?.getAdult?.(ids.adultId),learner=family?.learners?.find(l=>l.learnerId===picker.value&&l.stage==="kindergarten"&&l.familyId===family.familyId);
   if(!adult||!family?.adultIds?.includes(adult.adultId)||!learner){status.textContent="A valid existing family adult and Kindergarten learner are required.";return}
   try{r().setActive({familyId:family.familyId,adultId:adult.adultId,learnerId:learner.learnerId});render()}catch{status.textContent="Could not save the learner selection."}
  };
  save.onclick=()=>{
   const id=picker.value;
   if(id!==r()?.activeIds?.()?.learnerId||p()?.adultAllowed?.(id)!==true){render();return}
   const ids=[...activities.querySelectorAll('input:checked')].map(x=>x.value);
   if(ids.length<1||ids.length>6){status.textContent="Choose between one and six activities.";return}
   status.textContent=p()?.configure?.(id,ids)?"Family activity choices saved on this browser.":"Could not save: verify the selected local adult and learner.";
  };
  g.addEventListener("khaemenes-family-changed",render);
  g.addEventListener("khaemenes-kinder-daily-plan-changed",render);
  render();return true;
 }
 g.KhaemenesKinderParentDailyPanel=Object.freeze({mount});
 g.addEventListener("khaemenes-family-changed",()=>{if(!d.getElementById("khaeKinderFamilyDailyPanel"))mount();else{
  const family=r()?.getFamily?.(),eligible=family?.learners?.some(l=>l?.stage==="kindergarten"&&l.familyId===family.familyId);
  if(!eligible)d.getElementById("khaeKinderFamilyDailyPanel")?.remove();
 }});
 if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});
 else mount();
})(window,document);
