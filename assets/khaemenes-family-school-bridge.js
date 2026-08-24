(function attachKhaemenesFamilySchoolBridge(global){
  "use strict";

  const VERSION="2.4.0";
  const script=document.currentScript;
  const surfaceStage=(script?.dataset?.khaemenesStage||"").trim();
  const surfaceGrades=(script?.dataset?.khaemenesGrades||"").split(",").map(x=>x.trim()).filter(Boolean);
  const familyPortal="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const studentPortal="https://vervenveda.com/Khaemenes_Academy.github.io/student/";
  const archaemenesPortal="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";
  const HIGH_LEGACY_PROFILE_KEY="khaemenes-high-profile-v1";
  const HIGH_PINNED_KEY="khaemenes-high-pinned-courses-v2";

  function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
  function normalizeGrade(registry,value){return registry.normalizeGrade?registry.normalizeGrade(value):String(value||"").replace(/[^0-9]/g,"").padStart(2,"0")}
  function normalizedSurfaceStage(registry=global.KhaemenesFamilyRegistry){return registry?.normalizeStage?registry.normalizeStage(surfaceStage):surfaceStage}
  function navigate(url){try{global.location.assign(url)}catch{global.location.href=url}}
  function readJSON(key,fallback=null){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}

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

  /* One-Mentor doorway policy:
     - no active family session -> Family Portal
     - active family session -> Academy-hosted Archaemenes Mentor
     - a named learner Mentor button selects that learner first, then opens Archaemenes
     - explicit Archaemenes Mentor links may use data-khaemenes-mentor or the canonical Mentor URL
     - the historical Preschool #familyMentorEntry doorway remains a compatibility alias
     The Academy-hosted Mentor shares the same vervenveda.com origin as the Family Registry,
     so learner continuity is preserved without placing learner or family IDs in the URL. */
  function bindMentorRouting(){
    if(document.documentElement.dataset.khaemenesMentorRoutingBound==="1")return;
    document.documentElement.dataset.khaemenesMentorRoutingBound="1";

    document.addEventListener("click",event=>{
      const origin=event.target;
      if(!origin?.closest)return;

      const namedMentor=origin.closest("[data-enter-child-mentor]");
      const explicitMentor=origin.closest('[data-khaemenes-mentor],a[href="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/"],a[href="/Khaemenes_Academy.github.io/mentor/"]');
      const legacyPreschoolDoor=normalizedSurfaceStage()==="preschool"?origin.closest('a[href="#familyMentorEntry"]'):null;
      const mentorDoor=namedMentor||explicitMentor||legacyPreschoolDoor;
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

  function highPreferenceKey(learnerId){return learnerId?`khaemenes.high.preferences:${learnerId}`:null}
  function highLearner(registry=global.KhaemenesFamilyRegistry){
    const learner=registry?.getLearner?.()||null;
    const stage=registry?.normalizeStage?registry.normalizeStage(learner?.stage):learner?.stage;
    return stage==="high"?learner:null;
  }
  function highGradeValue(registry,learner){
    const grade=normalizeGrade(registry,learner?.grade);
    return /^0?(9|10|11|12)$/.test(grade||"")?String(Number(grade)):"";
  }
  function highPreferences(registry,learner){
    if(!learner?.learnerId)return null;
    const key=highPreferenceKey(learner.learnerId);
    let prefs=readJSON(key,null);
    if(!prefs){
      const legacy=readJSON(HIGH_LEGACY_PROFILE_KEY,null);
      const semester=["Fall","Spring","Full Year"].includes(legacy?.semester)?legacy.semester:"Fall";
      prefs={version:1,semester,source:legacy?"legacy-profile-preference-copy":"default",updatedAt:new Date().toISOString()};
      writeJSON(key,prefs);
    }
    return prefs;
  }
  function highPinnedCount(){const pins=readJSON(HIGH_PINNED_KEY,[]);return Array.isArray(pins)?pins.length:0}

  function renderHighProfileAuthority(registry=global.KhaemenesFamilyRegistry){
    if(normalizedSurfaceStage(registry)!=="high")return;
    const form=document.getElementById("profileForm"),name=document.getElementById("studentName"),grade=document.getElementById("studentGrade"),semester=document.getElementById("studentSemester"),summary=document.getElementById("profileSummary");
    if(!form||!name||!grade||!semester||!summary)return;
    const learner=highLearner(registry);
    const card=form.closest(".portal-card");
    const submit=form.querySelector('button[type="submit"]');
    const note=card?.querySelector(".portal-note");

    name.readOnly=true;
    grade.disabled=true;
    name.setAttribute("aria-readonly","true");
    grade.setAttribute("aria-disabled","true");

    if(!learner){
      name.value="";
      grade.value="9";
      semester.disabled=true;
      if(submit)submit.textContent="Open Academy Profile";
      summary.innerHTML=`<strong>Academy Family Registry required.</strong> No active High School learner is selected in this browser. Use the Family Profile to create or select the learner; this High School page no longer creates a second learner identity.`;
      if(note)note.textContent="Student identity and formal grade placement are owned by the Khaemenes Academy Family Registry. High School keeps only learner-scoped study preferences and course pins.";
    }else{
      const prefs=highPreferences(registry,learner)||{};
      name.value=learner.nickname||"Learner";
      const gv=highGradeValue(registry,learner);if(gv)grade.value=gv;
      semester.disabled=false;
      semester.value=["Fall","Spring","Full Year"].includes(prefs.semester)?prefs.semester:"Fall";
      if(submit)submit.textContent="Save Study Preferences";
      const gradeLabel=gv?`Grade ${gv}`:(learner.grade||"High School");
      summary.innerHTML=`<strong>${escapeHTML(learner.nickname||"Learner")}</strong> · ${escapeHTML(gradeLabel)} · ${escapeHTML(semester.value)}<div class="pinned-list"><span>${highPinnedCount()} course${highPinnedCount()===1?"":"s"} pinned on this device.</span></div>`;
      if(note)note.textContent="Learner identity and formal grade come from the Academy Family Registry. Semester preference and course pins remain local and learner-scoped; this page does not create a competing student identity.";
    }

    const clear=document.getElementById("clearProfileButton");
    if(clear)clear.textContent="Clear Preferences & Pins";

    const links=card?.querySelector(".portal-links");
    if(links&&!links.querySelector('[data-khaemenes-mentor="high"]')){
      const a=document.createElement("a");
      a.href=archaemenesPortal;
      a.dataset.khaemenesMentor="high";
      a.textContent="Archaemenes";
      links.appendChild(a);
    }
  }

  function bindHighProfileAuthority(){
    if(normalizedSurfaceStage()!=="high"||document.documentElement.dataset.khaemenesHighProfileBound==="1")return;
    document.documentElement.dataset.khaemenesHighProfileBound="1";

    document.addEventListener("submit",event=>{
      if(event.target?.id!=="profileForm")return;
      const registry=global.KhaemenesFamilyRegistry;
      const learner=highLearner(registry);
      event.preventDefault();
      event.stopImmediatePropagation();
      if(!learner){navigate(familyPortal);return}
      const semester=document.getElementById("studentSemester")?.value;
      writeJSON(highPreferenceKey(learner.learnerId),{version:1,semester:["Fall","Spring","Full Year"].includes(semester)?semester:"Fall",source:"high-school-preferences",updatedAt:new Date().toISOString()});
      renderHighProfileAuthority(registry);
      global.dispatchEvent(new CustomEvent("khaemenes-high-preferences-changed",{detail:{learnerId:learner.learnerId}}));
    },true);

    document.addEventListener("click",event=>{
      const target=event.target;
      if(!target?.closest)return;
      const registry=global.KhaemenesFamilyRegistry;
      if(target.closest("#clearProfileButton")){
        const learner=highLearner(registry);
        event.preventDefault();event.stopImmediatePropagation();
        if(learner?.learnerId)try{localStorage.removeItem(highPreferenceKey(learner.learnerId))}catch{}
        try{localStorage.removeItem(HIGH_PINNED_KEY)}catch{}
        global.location.reload();
        return;
      }
      if(target.closest("#exportProfileButton")){
        const learner=highLearner(registry);
        event.preventDefault();event.stopImmediatePropagation();
        if(!learner){navigate(familyPortal);return}
        const payload={format:"khaemenes-high-learner-preferences-v1",exportedAt:new Date().toISOString(),academy:"Khaemenes Academy High School",learner:{nickname:learner.nickname||"Learner",stage:"high",grade:learner.grade||null,mentorId:"archaemenes"},preferences:readJSON(highPreferenceKey(learner.learnerId),null),pinnedCourses:readJSON(HIGH_PINNED_KEY,[]),note:"Explicit local export. Family Registry remains the learner identity and placement authority."};
        const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
        const url=URL.createObjectURL(blob),a=document.createElement("a");
        a.href=url;a.download="khaemenes-high-learner-preferences.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        return;
      }
      if(target.closest("[data-pin],[data-remove-pin]"))setTimeout(()=>renderHighProfileAuthority(registry),0);
    },true);
  }

  function canonicalizeElementaryMentorCard(){
    if(normalizedSurfaceStage()!=="elementary")return;
    const heading=[...document.querySelectorAll("h3")].find(node=>(node.textContent||"").trim()==="Archaemenes");
    const card=heading?.closest(".card");
    const link=card?.querySelector("a.btn,a");
    if(!link)return;
    link.href=archaemenesPortal;
    link.dataset.khaemenesMentor="elementary";
    link.textContent="Talk with Archaemenes";
  }

  function canonicalizeStageSurface(registry=global.KhaemenesFamilyRegistry){
    canonicalizeElementaryMentorCard();
    renderHighProfileAuthority(registry);
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
      box.innerHTML=`<strong>${escapeHTML(learner.nickname)}</strong><br><span>${escapeHTML(family?.displayName||"Khaemenes Family")} · ${escapeHTML(placementLabel)}</span>${mismatchHTML}<div style="margin-top:7px"><a href="${archaemenesPortal}" data-khaemenes-mentor style="color:#2f7140;font-weight:700">Archaemenes →</a> · <a href="${studentPortal}" style="color:#2f7140;font-weight:700">Student Portal →</a> · <a href="${familyPortal}" style="color:#2f7140;font-weight:700">Family Profile →</a></div>`;
    }
    document.body.appendChild(box);
    canonicalizeStageSurface(registry);
    global.dispatchEvent(new CustomEvent("khaemenes-school-bridge-ready",{detail:{version:VERSION,stage:surfaceStage,learnerId:learner?.learnerId||null,mismatch:placement.mismatch,previewAllowed:true,hardRedirect:false,mentorDestination:mentorDestination(registry)}}));
  }

  global.KhaemenesFamilySchoolBridge=Object.freeze({
    version:VERSION,
    placementState,
    activeFamilyState,
    mentorDestination,
    highPreferenceKey,
    renderHighProfileAuthority,
    canonicalizeStageSurface,
    routes:Object.freeze({familyPortal,studentPortal,archaemenesPortal}),
    policy:Object.freeze({previewAllowed:true,hardRedirect:false,mentorAuthority:"academy-archaemenes",mentorRouting:"all-stages-explicit-doorways",localLearnerIdentityAuthority:"academy-family-registry",highSchoolLocalProfileRole:"learner-scoped-preferences-only",preschoolLegacyMentorRouting:"family-portal-unless-active-family-session-then-archaemenes"})
  });
  bindMentorRouting();
  bindHighProfileAuthority();
  global.addEventListener("khaemenes-family-changed",()=>global.KhaemenesFamilyRegistry&&render(global.KhaemenesFamilyRegistry));
  global.addEventListener("khaemenes-learner-placement-changed",()=>global.KhaemenesFamilyRegistry&&render(global.KhaemenesFamilyRegistry));
  injectSharedRegistry();
})(window);