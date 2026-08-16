(function attachKhaemenesFamilySchoolBridge(global){
  "use strict";

  const VERSION="2.0.1";
  const script=document.currentScript;
  const surfaceStage=(script?.dataset?.khaemenesStage||"").trim();
  const surfaceGrades=(script?.dataset?.khaemenesGrades||"").split(",").map(x=>x.trim()).filter(Boolean);
  const familyPortal="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const studentPortal="https://vervenveda.com/Khaemenes_Academy.github.io/student/";

  function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
  function normalizeGrade(registry,value){return registry.normalizeGrade?registry.normalizeGrade(value):String(value||"").replace(/[^0-9]/g,"").padStart(2,"0")}

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
    global.dispatchEvent(new CustomEvent("khaemenes-school-bridge-ready",{detail:{version:VERSION,stage:surfaceStage,learnerId:learner?.learnerId||null,mismatch:placement.mismatch,previewAllowed:true,hardRedirect:false}}));
  }

  global.KhaemenesFamilySchoolBridge=Object.freeze({version:VERSION,placementState,policy:Object.freeze({previewAllowed:true,hardRedirect:false})});
  global.addEventListener("khaemenes-family-changed",()=>global.KhaemenesFamilyRegistry&&render(global.KhaemenesFamilyRegistry));
  global.addEventListener("khaemenes-learner-placement-changed",()=>global.KhaemenesFamilyRegistry&&render(global.KhaemenesFamilyRegistry));
  injectSharedRegistry();
})(window);