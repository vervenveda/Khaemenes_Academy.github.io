(function attachKhaemenesStudentProfileUIV2(global){
"use strict";
const VERSION="2.0.0";
const P=global.KhaemenesStudentProfileV2,R=global.KhaemenesFamilyRegistry,C=global.KhaemenesLearningContinuation;
const host=document.getElementById("profileStudio");
if(!P||!host)return;
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeHref=value=>/^https?:\/\//i.test(String(value||""))?String(value):"";
const lines=value=>Array.isArray(value)?value.join("\n"):"";
const split=value=>String(value||"").split(/[\n,]+/).map(x=>x.trim()).filter(Boolean);
function learner(){return R?.getLearner?.()||P.activeLearner?.()||null}
function record(){const l=learner();return l?.learnerId?P.read(l.learnerId):null}
function continuations(){const l=learner();return l?.learnerId&&C?.readLearner?C.readLearner(l.learnerId)||[]:[]}
function evidenceStatusFromContinuation(item){
  const threshold=Number(item?.mastery?.threshold||80),best=Number(item?.mastery?.best);
  if(item?.status==="complete"&&item?.mastery?.mastered===true)return "mastered";
  if(Number.isFinite(best)&&best>=threshold)return "demonstrated";
  if(Number(item?.progress?.completed||0)>0||Number(item?.progress?.percent||0)>0)return "demonstrated";
  return "developing";
}
function syncContinuationEvidence(){
  const l=learner();if(!l?.learnerId||!C?.readLearner||!P.syncCourseEvidence)return;
  const items=continuations().map(item=>{
    const courseId=String(item?.courseId||"").trim();if(!courseId)return null;
    return {
      id:"continuation:"+courseId,
      sourceId:courseId,
      title:item.courseTitle||item.courseId||"Course progress",
      category:item.subject||"Course Progress",
      courseId,
      school:item.school||"",
      stage:item.stage||l.stage||"",
      status:evidenceStatusFromContinuation(item),
      sourceLabel:"Course continuation record",
      evidenceHref:safeHref(item.nextHref),
      summary:item.summary||item.nextTitle||"Course progress evidence published by the source course.",
      updatedAt:item.updatedAt||""
    };
  }).filter(Boolean);
  P.syncCourseEvidence(items,l.learnerId);
}
function statusLabel(value){return ({continue:"Today",practice:"Practice",corrections:"Review",mastery:"Mastery Review",assessment:"Assessment Next",complete:"Complete",paused:"Paused"})[value]||"Next"}
function renderLane(title,items){
  if(!items.length)return `<div><h4>${esc(title)}</h4><div class="profile-v2-empty">Nothing is waiting here right now.</div></div>`;
  return `<div><h4>${esc(title)}</h4><div class="profile-v2-lane">${items.map(item=>`<div class="profile-v2-step"><span><strong>${esc(item.courseTitle||item.courseId||"Course")}</strong><small>${esc(item.nextTitle||item.summary||"Next learning step")}</small><span class="profile-v2-tag">${esc(statusLabel(item.status))}</span></span>${safeHref(item.nextHref)?`<a class="profile-v2-btn secondary" href="${esc(item.nextHref)}">Open</a>`:""}</div>`).join("")}</div></div>`;
}
function evidenceMarkup(rec){
  if(!rec.evidence.length)return '<div class="profile-v2-empty">No Evidence Passport entries yet. Course publishers can add verified evidence, and you can add a learner note below.</div>';
  return `<div class="profile-v2-evidence">${rec.evidence.map(item=>`<div class="profile-v2-evidence-row"><span><strong>${esc(item.title)}</strong><small>${esc(item.summary||item.sourceLabel)}</small><div class="profile-v2-badges"><span class="profile-v2-badge">${esc(item.status)}</span><span class="profile-v2-badge">${esc(item.reviewState)}</span><span class="profile-v2-badge">${esc(item.category)}</span>${item.provenance?.archived?'<span class="profile-v2-badge">archived source</span>':""}</div></span><span>${safeHref(item.evidenceHref)?`<a class="profile-v2-btn secondary" href="${esc(item.evidenceHref)}">Evidence</a>`:""}${item.sourceType==="learner"?`<button class="profile-v2-btn secondary" type="button" data-remove-evidence="${esc(item.id)}">Remove</button>`:""}</span></div>`).join("")}</div>`;
}
function applyWorkspace(workspace){
  const b=document.body;if(!b)return;
  b.dataset.studentProfileTheme=workspace.theme;
  b.dataset.studentProfileTextSize=workspace.textSize;
  b.dataset.studentProfileLineSpacing=workspace.lineSpacing;
  b.dataset.studentProfileReadingWidth=workspace.readingWidth;
  b.dataset.studentProfileContrast=workspace.contrast;
  b.dataset.studentProfileDensity=workspace.density;
  b.dataset.studentProfileReducedMotion=String(workspace.reducedMotion);
}
function render(){
  const l=learner();
  if(!l?.learnerId){host.innerHTML="";return}
  syncContinuationEvidence();
  const rec=record(),lanes=P.classifyContinuations(continuations());
  applyWorkspace(rec.workspace);
  host.innerHTML=`<div class="heading"><p class="eyebrow">My Learning Profile</p><h2>Learn with purpose. Keep your evidence.</h2><p>This learner-owned studio sits beside your official course records. It helps you plan, reflect, personalize your workspace, and collect clearly labeled evidence without changing grades or mastery.</p></div>
  <div class="profile-v2-grid">
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="compassTitle">
      <p class="profile-v2-eyebrow">Learning Compass</p><h3 id="compassTitle">My goal and reflection</h3>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Week">Week of</label><input id="pv2Week" type="date" value="${esc(rec.compass.weekOf)}"></div><div class="profile-v2-field"><label for="pv2Goal">My goal this week</label><input id="pv2Goal" value="${esc(rec.compass.weeklyGoal)}" placeholder="What do I want to accomplish?"></div></div>
      <div class="profile-v2-field"><label for="pv2Why">Why it matters to me</label><textarea id="pv2Why">${esc(rec.compass.whyMatters)}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Strategy">What I will try</label><textarea id="pv2Strategy">${esc(rec.compass.strategy)}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Help">What help I need</label><textarea id="pv2Help">${esc(rec.compass.helpNeeded)}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Reflection">What worked</label><textarea id="pv2Reflection">${esc(rec.compass.reflection)}</textarea></div>
      <div class="profile-v2-field"><label for="pv2NextChange">What I will change next</label><textarea id="pv2NextChange">${esc(rec.compass.nextChange)}</textarea></div>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2SaveCompass">Save Compass</button></div><div class="profile-v2-status" id="pv2CompassStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="nextTitle">
      <p class="profile-v2-eyebrow">Today · Next · Review</p><h3 id="nextTitle">What needs my attention?</h3><p>These steps come from course continuation records. This profile does not invent scores or unlock work.</p>
      ${renderLane("Today",lanes.today)}${renderLane("Review",lanes.review)}${renderLane("Next",lanes.next)}
    </section>
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="mapTitle">
      <p class="profile-v2-eyebrow">My Learning Map</p><h3 id="mapTitle">Strengths, preferences, and supports</h3>
      <div class="profile-v2-field"><label for="pv2Strengths">My strengths</label><textarea id="pv2Strengths" placeholder="One per line">${esc(lines(rec.learningMap.strengths))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Preferences">I learn well when…</label><textarea id="pv2Preferences" placeholder="Examples, visuals, discussion, practice…">${esc(lines(rec.learningMap.learningPreferences))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Supports">Helpful supports</label><textarea id="pv2Supports">${esc(lines(rec.learningMap.supports))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Reset">Things that help me regain focus</label><textarea id="pv2Reset">${esc(lines(rec.learningMap.focusReset))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Interests">Subjects or ideas I want to explore</label><textarea id="pv2Interests">${esc(lines(rec.learningMap.interests))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Growth">Skills I want to strengthen</label><textarea id="pv2Growth">${esc(lines(rec.learningMap.growthSkills))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Collaboration">I usually prefer</label><select id="pv2Collaboration"><option value="flexible">Flexible</option><option value="independent">Independent work</option><option value="guided">Guided support</option><option value="collaborative">Collaborative work</option></select></div>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2SaveMap">Save Learning Map</button></div><div class="profile-v2-status" id="pv2MapStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="evidenceTitle">
      <p class="profile-v2-eyebrow">Evidence Passport</p><h3 id="evidenceTitle">What I can show</h3><p>Course-published evidence remains clearly distinguished from learner-added evidence. A student-added item can never award mastery.</p>
      ${evidenceMarkup(rec)}
      <h4>Add learner evidence</h4>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2EvidenceTitle">Evidence title</label><input id="pv2EvidenceTitle" placeholder="Project, essay, investigation…"></div><div class="profile-v2-field"><label for="pv2EvidenceCategory">Category</label><input id="pv2EvidenceCategory" placeholder="Mathematics, Science, Writing…"></div></div>
      <div class="profile-v2-field"><label for="pv2EvidenceSummary">What this shows</label><textarea id="pv2EvidenceSummary"></textarea></div>
      <div class="profile-v2-field"><label for="pv2EvidenceHref">Optional evidence link</label><input id="pv2EvidenceHref" type="url" placeholder="https://"></div>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2AddEvidence">Add to Passport</button></div><div class="profile-v2-status" id="pv2EvidenceStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col8" aria-labelledby="workspaceTitle">
      <p class="profile-v2-eyebrow">My Workspace Controls</p><h3 id="workspaceTitle">Accessible, controlled personalization</h3>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Theme">Theme</label><select id="pv2Theme"><option value="academy">Academy</option><option value="parchment">Parchment</option><option value="forest">Forest</option><option value="midnight">Midnight</option><option value="ocean">Ocean</option><option value="plum">Plum</option></select></div><div class="profile-v2-field"><label for="pv2Text">Text size</label><select id="pv2Text"><option value="small">Small</option><option value="standard">Standard</option><option value="large">Large</option><option value="extra-large">Extra large</option></select></div></div>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Line">Line spacing</label><select id="pv2Line"><option value="standard">Standard</option><option value="comfortable">Comfortable</option><option value="wide">Wide</option></select></div><div class="profile-v2-field"><label for="pv2Width">Reading width</label><select id="pv2Width"><option value="narrow">Narrow</option><option value="comfortable">Comfortable</option><option value="wide">Wide</option></select></div></div>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Contrast">Contrast</label><select id="pv2Contrast"><option value="standard">Standard</option><option value="high">High contrast</option></select></div><div class="profile-v2-field"><label for="pv2Density">Dashboard density</label><select id="pv2Density"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></div></div>
      <div class="profile-v2-field"><label for="pv2Language">Preferred learning language</label><input id="pv2Language" value="${esc(rec.workspace.preferredLanguage)}" placeholder="English, Spanish, French…"></div>
      <label class="profile-v2-check"><input id="pv2Motion" type="checkbox" ${rec.workspace.reducedMotion?"checked":""}> Reduce nonessential motion</label>
      <label class="profile-v2-check"><input id="pv2TTS" type="checkbox" ${rec.workspace.tts?"checked":""}> Prefer text-to-speech controls when available</label>
      <label class="profile-v2-check"><input id="pv2Simple" type="checkbox" ${rec.workspace.simplifiedDashboard?"checked":""}> Prefer a simplified dashboard when supported</label>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2SaveWorkspace">Save Workspace</button><button class="profile-v2-btn secondary" type="button" id="pv2Export">Export My Profile</button><button class="profile-v2-btn secondary" type="button" id="pv2Reset">Reset Preferences</button></div><div class="profile-v2-status" id="pv2WorkspaceStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col4" aria-labelledby="privacyTitle" data-khae-optional="true">
      <p class="profile-v2-eyebrow">Privacy Boundary</p><h3 id="privacyTitle">What this profile can and cannot do</h3>
      <div class="profile-v2-privacy"><div>Saved locally in this browser unless a future protected account service is explicitly connected.</div><div>Does not store passwords or credentials.</div><div>Cannot change placement, grades, mastery, certificates, or prerequisite gates.</div><div>Official academic records remain owned by their source courses and assessment engines.</div></div>
    </section>
  </div>`;
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.value=value};
  set("pv2Collaboration",rec.learningMap.collaboration);set("pv2Theme",rec.workspace.theme);set("pv2Text",rec.workspace.textSize);set("pv2Line",rec.workspace.lineSpacing);set("pv2Width",rec.workspace.readingWidth);set("pv2Contrast",rec.workspace.contrast);set("pv2Density",rec.workspace.density);
  bind();
}
function value(id){return document.getElementById(id)?.value||""}
function status(id,text){const el=document.getElementById(id);if(el)el.textContent=text}
function bind(){
  const l=learner();if(!l?.learnerId)return;
  document.getElementById("pv2SaveCompass")?.addEventListener("click",()=>{const ok=P.updateCompass({weekOf:value("pv2Week"),weeklyGoal:value("pv2Goal"),whyMatters:value("pv2Why"),strategy:value("pv2Strategy"),helpNeeded:value("pv2Help"),reflection:value("pv2Reflection"),nextChange:value("pv2NextChange")},l.learnerId);status("pv2CompassStatus",ok?"Learning Compass saved for this learner.":"Could not save on this device.")});
  document.getElementById("pv2SaveMap")?.addEventListener("click",()=>{const ok=P.updateLearningMap({strengths:split(value("pv2Strengths")),learningPreferences:split(value("pv2Preferences")),supports:split(value("pv2Supports")),focusReset:split(value("pv2Reset")),interests:split(value("pv2Interests")),growthSkills:split(value("pv2Growth")),collaboration:value("pv2Collaboration")},l.learnerId);status("pv2MapStatus",ok?"Learning Map saved for this learner.":"Could not save on this device.")});
  document.getElementById("pv2AddEvidence")?.addEventListener("click",()=>{const title=value("pv2EvidenceTitle").trim();if(!title){status("pv2EvidenceStatus","Add an evidence title first.");return}const ok=P.addLearnerEvidence({id:"learner-"+Date.now(),title,category:value("pv2EvidenceCategory")||"Learner Evidence",evidenceHref:value("pv2EvidenceHref"),summary:value("pv2EvidenceSummary")},l.learnerId);if(ok)render();else status("pv2EvidenceStatus","Could not save evidence on this device.")});
  host.querySelectorAll("[data-remove-evidence]").forEach(button=>button.addEventListener("click",()=>{P.removeEvidence(button.dataset.removeEvidence,l.learnerId);render()}));
  document.getElementById("pv2SaveWorkspace")?.addEventListener("click",()=>{const prefs={theme:value("pv2Theme"),textSize:value("pv2Text"),lineSpacing:value("pv2Line"),readingWidth:value("pv2Width"),contrast:value("pv2Contrast"),density:value("pv2Density"),preferredLanguage:value("pv2Language"),reducedMotion:document.getElementById("pv2Motion")?.checked,tts:document.getElementById("pv2TTS")?.checked,simplifiedDashboard:document.getElementById("pv2Simple")?.checked};const ok=P.updateWorkspace(prefs,l.learnerId);if(ok){applyWorkspace(P.read(l.learnerId).workspace);status("pv2WorkspaceStatus","Workspace preferences saved.")}else status("pv2WorkspaceStatus","Could not save on this device.")});
  document.getElementById("pv2Export")?.addEventListener("click",()=>{const payload=P.exportPayload(l.learnerId);if(!payload)return;const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="khaemenes-student-profile-v2.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800)});
  document.getElementById("pv2Reset")?.addEventListener("click",()=>{if(confirm("Reset this learner's Compass, Learning Map, and Workspace preferences? Evidence Passport entries will remain.")){P.clearPreferences(l.learnerId);render()}});
}
global.addEventListener("khaemenes-family-changed",render);
global.addEventListener("khaemenes-learning-continuation-changed",render);
global.addEventListener("khaemenes-student-profile-changed",event=>{if(event.detail?.learnerId===learner()?.learnerId)render()});
global.addEventListener("storage",event=>{const key=String(event.key||"");if(key===P.storageKey||key.startsWith(P.storagePrefix||"khaemenes.student-profile.v3:")||key===C?.storageKey)render()});
render();
global.KhaemenesStudentProfileUIV2=Object.freeze({version:VERSION,render,applyWorkspace});
})(window);
