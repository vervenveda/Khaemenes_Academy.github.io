/* Family Hub Kindergarten daily activity controls (local family helper; no cloud auth). */
(function(g,d){"use strict";
 if(g.KhaemenesKinderParentDailyPanel)return;
 const r=()=>g.KhaemenesFamilyRegistry,p=()=>g.KhaemenesKinderFamilyDailyPlan;
 function mount(){
  if(d.getElementById("khaeKinderFamilyDailyPanel"))return true;
  const anchor=d.getElementById("khaeFamilyParentProfileHero")||d.getElementById("workspace");
  if(!anchor?.parentElement)return false;
  const section=d.createElement("section");section.id="khaeKinderFamilyDailyPanel";
  section.setAttribute("aria-labelledby","khaeKinderFamilyDailyTitle");
  section.style.cssText="width:min(94%,1100px);margin:22px auto;padding:22px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038;font:400 16px/1.5 Nunito,Arial,sans-serif";
  const title=d.createElement("h2");title.id="khaeKinderFamilyDailyTitle";title.textContent="Kindergarten · Family Daily Plan";
  title.style.cssText="font:400 clamp(25px,3vw,34px)/1.25 Cinzel,Georgia,serif;margin:0 0 9px";
  const introduction=d.createElement("p");introduction.textContent="Choose up to six playful daily activities for your Kindergarten learner. Check-ins celebrate participation only; official lesson mastery stays in the curriculum.";
  const notice=d.createElement("p");notice.textContent="This is a local family-helper panel, not a verified parent sign-in or cloud record. Changes on one browser are not automatically available on another.";
  notice.style.cssText="font-size:16px;max-width:850px";
  const selected=d.createElement("label");selected.textContent="Kindergarten learner";
  const picker=d.createElement("select");picker.id="khaeKinderFamilyLearner";picker.style.cssText="display:block;width:min(100%,480px);min-height:48px;margin:7px 0 15px;border:1px solid #b48b45;border-radius:7px;font-size:16px;background:#fff";
  const activities=d.createElement("div");activities.id="khaeKinderFamilyActivityOptions";
  activities.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:9px;margin:10px 0 15px";
  const controls=d.createElement("div");controls.style.cssText="display:flex;flex-wrap:wrap;gap:10px";
  const save=d.createElement("button");save.type="button";save.textContent="Save My Family Plan";
  const open=d.createElement("a");open.textContent="Open Kindergarten Profile";open.href="https://vervenveda.com/Khaemenes_KinderGarden.github.io/student-profile/";
  for(const element of [save,open])element.style.cssText="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 15px;border-radius:7px;border:1px solid #b48b45;background:#243038;color:#fff8e9;font:400 16px Nunito,Arial,sans-serif;text-decoration:none";
  const status=d.createElement("p");status.id="khaeKinderFamilyPlanStatus";status.setAttribute("role","status");
  controls.append(save,open);
  section.append(title,introduction,notice,selected,picker,activities,controls,status);
  anchor.insertAdjacentElement("afterend",section);
  function learnerChoices(){
   const family=r()?.getFamily?.(),active=r()?.activeIds?.()||{};
   const all=Array.isArray(family?.learners)?family.learners.filter(x=>x?.stage==="kindergarten"&&x.learnerId):[];
   const last=picker.value;
   picker.replaceChildren();
   const empty=d.createElement("option");empty.value="";empty.textContent="Choose a learner";picker.append(empty);
   for(const l of all){const option=d.createElement("option");option.value=l.learnerId;option.textContent=l.nickname||"Kindergarten learner";picker.append(option)}
   picker.value=all.some(x=>x.learnerId===last)?last:all.some(x=>x.learnerId===active.learnerId)?active.learnerId:"";
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
   save.disabled=!permitted;
   save.style.opacity=permitted?"1":".5";
   status.textContent=!all.length?"No Kindergarten learner in the active family. Enroll or select one first.":
    !matching?"Select this learner in your Family workspace first. Switching this menu does not switch learner identity.":
    !permitted?"Local adult selection does not have education.manage permission for this learner.":
    "Choose 1–6 activities. The learner sees the updated plan on this browser.";
  }
  picker.onchange=render;
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
 if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});
 else mount();
})(window,document);
