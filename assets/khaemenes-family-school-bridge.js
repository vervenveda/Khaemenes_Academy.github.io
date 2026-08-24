(function attachKhaemenesFamilySchoolBridge(global){
  "use strict";

  const VERSION="2.1.0";
  const script=document.currentScript;
  const surfaceStage=(script?.dataset?.khaemenesStage||"").trim();
  const surfaceGrades=(script?.dataset?.khaemenesGrades||"").split(",").map(x=>x.trim()).filter(Boolean);
  const familyPortal="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const studentPortal="https://vervenveda.com/Khaemenes_Academy.github.io/student/";
  const archaemenesPortal="https://artist1970.github.io/Archaemenes.github.io/";

  function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
  function normalizeGrade(registry,value){return registry.normalizeGrade?registry.normalizeGrade(value):String(value||"").replace(/[^0-9]/g,"").padStart(2,"0")}
  function normalizedSurfaceStage(registry=global.KhaemenesFamilyRegistry){return registry?.normalizeStage?registry.normalizeStage(surfaceStage):surfaceStage}
  function navigate(url){try{global.location.assign(url)}catch{global.location.href=url}}

  function activeFamilyState(registry=global.KhaemenesFamilyRegistry){
    if(!registry)return {family:null,adult:null,learner:null,signedIn:false};
    const family=registry.getFamily?.()||null;
    const adult=registry.getAdult?.()||null;
    const learner=registry.getLearner?.()||null;
    return {family,adult,learner,signedIn:Boolean(family&&(adult||learner))};
  }

  function mentorDestination(registry=global.KhaemenesFamilyRegistry){
    return activeFamilyState(registry).signedIn?archaemenesPortal:familyPortal;
  }

  /* Preschool Mentor doorway policy:
     - no active family session -> Family Portal
     - active family session -> Archaemenes
     - a named child Mentor button selects that learner first, then opens Archaemenes
     The listener runs in capture phase so legacy Preschool handlers cannot redirect
     a named child back into the older standalone mentor surface. */
  function bindPreschoolMentorRouting(){
    if(normalizedSurfaceStage()!=="preschool"||document.documentElement.dataset.khaemenesMentorRoutingBound==="1")return;
    document.documentElement.dataset.khaemenesMentorRoutingBound="1";

    document.addEventListener("click",event=>{
      const origin=event.target;
      if(!origin?.closest)return;
      const namedMentor=origin.closest("[data-enter-child-mentor]");
      const mentorDoor=namedMentor||origin.closest('a[href="#familyMentorEntry"]');
      if(!mentorDoor)return;

      const registry=global.KhaemenesFamilyRegistry;

      if(namedMentor){
        const family=registry?.getFamily?.()||null;
        const learnerId=String(namedMentor.dataset.enterChildMentor||"").trim();
        const learner=family?.learners?.find?.(item=>item?.learnerId===learnerId)||null;
        event.preventDefault();
        event.stopImmediatePropagation();
        if(registry&&family&&learner){
          registry.setActive?.({familyId:family.familyId,learnerId});
          navigate(archaemenesPortal);
        }else{
          navigate(familyPortal);
        }
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      navigate(mentorDestination(registry));
    },true);
  }

  function injectSharedRegistry(){
    if(global.KhaemenesFamilyRegistry){render(global.KhaemenesFamilyRegistry);return}
    const src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
    if(!document.querySelector(`script[src="${src}"]`)){
      const s=document.createElement("script");s.src=src;s.onload=()=>waitForRegistry();document.head.appendChild(s);
    }else waitForRegistry();
  }
  function waitForRegistry(attempt=0){const registry=global.KhaemenesFamilyRegistry;if(registry){render(registry);return}if(attempt<80)setTimeout(()=>waitForRegistry(attempt+1),50)}

  function placementState(registry,learner){
    if(!learner)return {stageMismatch:false,gradeMismatch:false,mismatch:false,previewAllowed:true,hardRedirect:false};
    const learnerStage=registry.normalizeStage?registry.normalizeStage(learner.stage):learner.stage;
    const pageStage=registry.normalizeStage?registry.normalizeStage(surfaceStage):surfaceStage;
    const stageMismatch=Boolean(pageStage&&learnerStage&&pageStage!==learnerStage);
    const learnerGrade=normalizeGrade(registry,learner.grade);
    const allowedGrades=surfaceGrades.map(g=>normalizeGrade(registry,g)).filter(Boolean);
    const gradeMismatch=Boolean(!stageMismatch&&learnerGrade&&allowedGrades.length&&!allowedGrades.includes(learnerGrade));
    return {stageMismatch,gradeMismatch,mismatch:stageMismatch||gradeMismatch,learnerStage,pageStage,learnerGrade,allowedGrades,previewAllowed:true,hardRedirect:false};
  }

  function render(registry){
    document.getElementById("khaemenesFamilyBridge")?.remove();
    const learner=registry.getLearner(),family=registry.getFamily(),placement=placementState(registry,learner),destination=learner?registry.learnerDestination?.(learner):null;
    const box=document.createElement("aside");box.id="khaemenesFamilyBridge";box.setAttribute("aria-label","Khaemenes learner continuity");
    box.style.cssText=["position:fixed","right:12px","bottom:12px","z-index:9998","max-width:330px","padding:11px 13px","border:1px solid rgba(50,75,60,.18)","border-radius:11px","background:rgba(255,255,255,.97)","box-shadow:0 10px 30px rgba(35,60,45,.16)","font:13px/1.45 Arial,sans-serif","color:#31483a","text-align:left"].join(";");

    if(!learner){
      box.innerHTML=`<strong>Khaemenes Academy</strong><br><span>No active learner is registered in this browser.</span><br><a href="${familyPortal}" style="display:inline-block;margin-top:7px;color:#2f7140;font-weight:700">Register / Open Family Profile →</a>`;
    }else{
      const gradeMeta=learner.grade&&registry.gradeMeta?.[learner.grade]?registry.gradeMeta[learner.grade]:null;
      const placementLabel=gradeMeta?.label||learner.stage||"Learner";
      const mismatch=placement.mismatch;
      const mismatchHTML=mismatch?`<div style="margin-top:8px;padding:8px;border-radius:7px;background:#fff4d8;color:#6d5325"><strong>Different campus context.</strong><br>${escapeHTML(learner.nickname)} is registered for ${escapeHTML(placementLabel)}. This page remains available for parent/teacher preview, but learner work should normally continue from the registered path.${destination?.url?`<br><a href="${escapeHTML(destination.url)}" style="display:inline-block;margin-top:5px;color:#6d5325;font-weight:700">Go to registered path →</a>`:""}</div>`:"";
      box.innerHTML=`<strong>${escapeHTML(learner.nickname)}</strong><br><span>${escapeHTML(family?.displayName||"Khaemenes Family")} · ${escapeHTML(placementLabel)}</span>${mismatchHTML}<div style="margin-top:7px"><a href="${studentPortal}" style="color:#2f7140;font-weight:700">Student Portal →</a> · <a href="${familyPortal}" style="color:#2f7140;font-weight:700">Family Profile →</a></div>`;
    }
    document.body.appendChild(box);
    global.dispatchEvent(new CustomEvent("khaemenes-school-bridge-ready",{detail:{version:VERSION,stage:surfaceStage,learnerId:learner?.learnerId||null,mismatch:placement.mismatch,previewAllowed:true,hardRedirect:false,mentorDestination:mentorDestination(registry)}}));
  }

  global.KhaemenesFamilySchoolBridge=Object.freeze({
    version:VERSION,
    placementState,
    activeFamilyState,
    mentorDestination,
    routes:Object.freeze({familyPortal,studentPortal,archaemenesPortal}),
    policy:Object.freeze({previewAllowed:true,hardRedirect:false,preschoolMentorRouting:"family-portal-unless-active-family-session-then-archaemenes"})
  });
  bindPreschoolMentorRouting();
  global.addEventListener("khaemenes-family-changed",()=>global.KhaemenesFamilyRegistry&&render(global.KhaemenesFamilyRegistry));
  global.addEventListener("khaemenes-learner-placement-changed",()=>global.KhaemenesFamilyRegistry&&render(global.KhaemenesFamilyRegistry));
  injectSharedRegistry();
})(window);