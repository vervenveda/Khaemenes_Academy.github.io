(function attachKhaemenesStudentProfileUIV2(global){
"use strict";
const VERSION="2.1.0";
const P=global.KhaemenesStudentProfileV2,R=global.KhaemenesFamilyRegistry,C=global.KhaemenesLearningContinuation,Q=global.KhaemenesStudentQuickPinsV1;
const host=document.getElementById("profileStudio");
if(!P||!host)return;
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeHref=value=>/^https?:\/\//i.test(String(value||""))?String(value):"";
const lines=value=>Array.isArray(value)?value.join("\n"):"";
const split=value=>String(value||"").split(/[\n,]+/).map(x=>x.trim()).filter(Boolean);
let pendingImport=null;
const STAGE_PRESENTATION=Object.freeze({
  preschool:Object.freeze({
    stage:"preschool",mode:"early",stageLabel:"Preschool",assistance:"Family-assisted",
    eyebrow:"Our Learning Profile",title:"Notice, celebrate, and support learning.",
    intro:"A trusted adult can help the learner choose small goals, notice what feels interesting, and save learning moments. Course records still remain separate and authoritative.",
    compassEyebrow:"Learning Together",compassTitle:"A small goal and what we noticed",
    goalLabel:"Something we want to try",whyLabel:"What interests the learner",strategyLabel:"How we can help",helpLabel:"What support feels good",reflectionLabel:"What the learner enjoyed or did well",nextChangeLabel:"Something we may try next",
    nextEyebrow:"Today · Next",nextTitle:"What can we open together?",laneToday:"Today",laneReview:"Try Again",laneNext:"Next",nextCopy:"These course steps come from the learner's school pathway. Adults may help open the next activity, but this profile never changes mastery or placement.",
    mapTitle:"What helps this learner thrive",strengthsLabel:"Things the learner enjoys doing",preferencesLabel:"The learner responds well to",supportsLabel:"Helpful supports",resetLabel:"What helps the learner feel ready again",interestsLabel:"Things the learner is curious about",growthLabel:"Skills we are gently building",collaborationLabel:"Learning together usually works best as",
    evidenceEyebrow:"Learning Moments",evidenceTitle:"Things we can remember and celebrate",evidenceCopy:"Course-published evidence remains separate. A family-assisted note records a learning moment only; it cannot award mastery.",evidenceAddTitle:"Add a family-assisted learning moment",evidenceCategory:"Learning Moment",
    workspaceTitle:"Comfort & accessibility",workspaceCopy:"Choose a comfortable reading, motion, language, and display setup for this learner.",
    privacyTitle:"Family privacy boundary"
  }),
  kindergarten:Object.freeze({
    stage:"kindergarten",mode:"early",stageLabel:"Kindergarten",assistance:"Family-assisted",
    eyebrow:"Our Learning Profile",title:"Grow confidence one learning moment at a time.",
    intro:"A trusted adult can help the learner set a simple goal, notice strengths, and save learning moments while official progress stays with each course.",
    compassEyebrow:"Learning Together",compassTitle:"Our goal and reflection",
    goalLabel:"Something I want to try",whyLabel:"Why this is interesting",strategyLabel:"How we will practice",helpLabel:"What help feels useful",reflectionLabel:"What went well",nextChangeLabel:"What we may try next",
    nextEyebrow:"Today · Next",nextTitle:"What comes next?",laneToday:"Today",laneReview:"Practice Again",laneNext:"Next",nextCopy:"These steps come from the learner's courses. The profile helps the family navigate without changing scores, mastery, or placement.",
    mapTitle:"How I learn best",strengthsLabel:"Things I am getting good at",preferencesLabel:"I learn well when",supportsLabel:"Helpful supports",resetLabel:"What helps me refocus",interestsLabel:"Things I want to explore",growthLabel:"Skills I am practicing",collaborationLabel:"I usually like learning",
    evidenceEyebrow:"Learning Moments",evidenceTitle:"Things I can show",evidenceCopy:"Course evidence stays clearly separate. Family-assisted notes are memories of learning, not grades or mastery.",evidenceAddTitle:"Add a learning moment",evidenceCategory:"Learning Moment",
    workspaceTitle:"My comfortable workspace",workspaceCopy:"Choose the reading, motion, language, and display settings that make learning comfortable.",
    privacyTitle:"Family privacy boundary"
  }),
  elementary:Object.freeze({
    stage:"elementary",mode:"elementary",stageLabel:"Elementary",assistance:"Learner + family",
    eyebrow:"My Learning Profile",title:"Know what helps you learn and keep what you are proud of.",
    intro:"Use a simple goal, notice your strengths, and save examples of your work. A family member can help, and your courses still control grades and mastery.",
    compassEyebrow:"My Weekly Compass",compassTitle:"My goal and what I noticed",
    goalLabel:"My goal this week",whyLabel:"Why I care about it",strategyLabel:"What I will try",helpLabel:"Help that would be useful",reflectionLabel:"What worked well",nextChangeLabel:"What I may change next",
    nextEyebrow:"Today · Next · Review",nextTitle:"What should I work on?",laneToday:"Today",laneReview:"Practice Again",laneNext:"Next",nextCopy:"These steps come from your courses. Use them to find where to continue, practice, or review.",
    mapTitle:"My strengths and learning supports",strengthsLabel:"My strengths",preferencesLabel:"I learn well when",supportsLabel:"Helpful supports",resetLabel:"What helps me refocus",interestsLabel:"Things I want to explore",growthLabel:"Skills I want to grow",collaborationLabel:"I usually prefer",
    evidenceEyebrow:"Evidence Passport",evidenceTitle:"Work I am proud to show",evidenceCopy:"Course evidence and learner-added evidence stay clearly labeled. Adding your own work does not change a grade or mastery result.",evidenceAddTitle:"Add my own work",evidenceCategory:"Learner Work",
    workspaceTitle:"My Workspace Controls",workspaceCopy:"Choose reading and accessibility settings that help you learn comfortably.",
    privacyTitle:"Privacy Boundary"
  }),
  middle:Object.freeze({
    stage:"middle",mode:"middle",stageLabel:"Middle School",assistance:"Learner-led with support",
    eyebrow:"My Learning Profile",title:"Build stronger learning habits and keep evidence of your growth.",
    intro:"Set goals, reflect on what works, organize supports, and keep clearly labeled evidence beside your official course records.",
    compassEyebrow:"Learning Compass",compassTitle:"My goal, strategy, and reflection",
    goalLabel:"My goal this week",whyLabel:"Why it matters to me",strategyLabel:"What I will try",helpLabel:"What support I need",reflectionLabel:"What worked",nextChangeLabel:"What I will adjust next",
    nextEyebrow:"Today · Next · Review",nextTitle:"What needs my attention?",laneToday:"Today",laneReview:"Review",laneNext:"Next",nextCopy:"These next steps are published by your courses. This profile helps you organize them without changing academic records.",
    mapTitle:"Strengths, preferences, and supports",strengthsLabel:"My strengths",preferencesLabel:"I learn well when",supportsLabel:"Helpful supports",resetLabel:"Things that help me regain focus",interestsLabel:"Ideas I want to explore",growthLabel:"Skills I want to strengthen",collaborationLabel:"I usually prefer",
    evidenceEyebrow:"Evidence Passport",evidenceTitle:"What I can show",evidenceCopy:"Course-published and learner-added evidence remain distinct. Learner evidence can document growth but cannot award mastery.",evidenceAddTitle:"Add learner evidence",evidenceCategory:"Learner Evidence",
    workspaceTitle:"My Workspace Controls",workspaceCopy:"Personalize reading, accessibility, language, and dashboard preferences without changing course rules.",
    privacyTitle:"Privacy Boundary"
  }),
  high:Object.freeze({
    stage:"high",mode:"high",stageLabel:"High School",assistance:"Learner-led",
    eyebrow:"My Learning Profile",title:"Learn with purpose. Keep your evidence.",
    intro:"This learner-owned studio sits beside your official course records. Plan, reflect, personalize your workspace, and collect clearly labeled evidence without changing grades or mastery.",
    compassEyebrow:"Learning Compass",compassTitle:"My goal and reflection",
    goalLabel:"My goal this week",whyLabel:"Why it matters to me",strategyLabel:"What I will try",helpLabel:"What help I need",reflectionLabel:"What worked",nextChangeLabel:"What I will change next",
    nextEyebrow:"Today · Next · Review",nextTitle:"What needs my attention?",laneToday:"Today",laneReview:"Review",laneNext:"Next",nextCopy:"These steps come from course continuation records. This profile does not invent scores or unlock work.",
    mapTitle:"Strengths, preferences, and supports",strengthsLabel:"My strengths",preferencesLabel:"I learn well when",supportsLabel:"Helpful supports",resetLabel:"Things that help me regain focus",interestsLabel:"Subjects or ideas I want to explore",growthLabel:"Skills I want to strengthen",collaborationLabel:"I usually prefer",
    evidenceEyebrow:"Evidence Passport",evidenceTitle:"What I can show",evidenceCopy:"Course-published evidence remains clearly distinguished from learner-added evidence. A student-added item can never award mastery.",evidenceAddTitle:"Add learner evidence",evidenceCategory:"Learner Evidence",
    workspaceTitle:"My Workspace Controls",workspaceCopy:"Accessible, controlled personalization for reading, language, focus, and dashboard preferences.",
    privacyTitle:"Privacy Boundary"
  }),
  higher:Object.freeze({
    stage:"higher",mode:"scholar",stageLabel:"Higher Learning",assistance:"Scholar-directed",
    eyebrow:"Scholar Profile",title:"Study with intention. Preserve a clear scholarly record.",
    intro:"Use this scholar-owned studio to organize goals, research interests, study conditions, and learner-authored evidence beside—not inside—official course and faculty records.",
    compassEyebrow:"Scholar Compass",compassTitle:"Current objective, method, and reflection",
    goalLabel:"Current study objective",whyLabel:"Why this inquiry matters",strategyLabel:"Method or study strategy",helpLabel:"Resources or support needed",reflectionLabel:"What the evidence suggests",nextChangeLabel:"Next refinement",
    nextEyebrow:"Current · Next · Review",nextTitle:"What requires scholarly attention?",laneToday:"Current",laneReview:"Review",laneNext:"Next",nextCopy:"These continuation records come from source courses. The profile organizes them without changing faculty, assessment, mastery, or certificate authority.",
    mapTitle:"Scholarly strengths, interests, and working preferences",strengthsLabel:"Scholarly strengths",preferencesLabel:"Productive study conditions",supportsLabel:"Useful supports or resources",resetLabel:"Ways I reset focus",interestsLabel:"Fields, questions, or ideas I want to investigate",growthLabel:"Methods or skills I want to strengthen",collaborationLabel:"My usual working mode",
    evidenceEyebrow:"Evidence Passport",evidenceTitle:"Scholar work and course-published evidence",evidenceCopy:"Learner-authored work and source-course evidence remain distinct. This Passport is an index, not a transcript or faculty record.",evidenceAddTitle:"Add scholar-authored evidence",evidenceCategory:"Scholar Evidence",
    workspaceTitle:"Scholar Workspace",workspaceCopy:"Set reading, accessibility, language, motion, and dashboard preferences for independent study.",
    privacyTitle:"Scholarly record boundary"
  })
});
function normalizedStage(value){
  const viaRegistry=R?.normalizeStage?.(value);
  if(viaRegistry&&STAGE_PRESENTATION[viaRegistry])return viaRegistry;
  const raw=String(value||"").toLowerCase().replace(/[_\s]+/g,"-");
  if(["pre-k","prek","creche","crèche","preschool"].includes(raw))return "preschool";
  if(["k","kg","kinder","kinder-garden","kindergarten"].includes(raw))return "kindergarten";
  if(raw.startsWith("elementary"))return "elementary";
  if(raw.startsWith("middle"))return "middle";
  if(raw.startsWith("high")&&!raw.startsWith("higher"))return "high";
  if(["higher","higher-learning","college","university","adult","adult-learning"].includes(raw))return "higher";
  return "high";
}
function stagePresentation(value){return STAGE_PRESENTATION[normalizedStage(value?.stage??value)]||STAGE_PRESENTATION.high}
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
  const rec=record(),lanes=P.classifyContinuations(continuations()),cfg=stagePresentation(l);
  applyWorkspace(rec.workspace);
  host.dataset.profileStage=cfg.stage;host.dataset.profileMode=cfg.mode;host.dataset.profileAssistance=cfg.assistance.toLowerCase().replace(/[^a-z]+/g,"-");
  host.innerHTML=`<div class="heading"><p class="eyebrow">${esc(cfg.eyebrow)}</p><h2>${esc(cfg.title)}</h2><p>${esc(cfg.intro)}</p><div class="profile-v2-stage-note"><span>${esc(cfg.stageLabel)}</span><span>${esc(cfg.assistance)}</span></div></div>
  <div class="profile-v2-grid">
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="compassTitle">
      <p class="profile-v2-eyebrow">${esc(cfg.compassEyebrow)}</p><h3 id="compassTitle">${esc(cfg.compassTitle)}</h3>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Week">Week of</label><input id="pv2Week" type="date" value="${esc(rec.compass.weekOf)}"></div><div class="profile-v2-field"><label for="pv2Goal">${esc(cfg.goalLabel)}</label><input id="pv2Goal" value="${esc(rec.compass.weeklyGoal)}" placeholder="What do I want to accomplish?"></div></div>
      <div class="profile-v2-field"><label for="pv2Why">${esc(cfg.whyLabel)}</label><textarea id="pv2Why">${esc(rec.compass.whyMatters)}</textarea></div>
      <div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2Strategy">${esc(cfg.strategyLabel)}</label><textarea id="pv2Strategy">${esc(rec.compass.strategy)}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Help">${esc(cfg.helpLabel)}</label><textarea id="pv2Help">${esc(rec.compass.helpNeeded)}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Reflection">${esc(cfg.reflectionLabel)}</label><textarea id="pv2Reflection">${esc(rec.compass.reflection)}</textarea></div>
      <div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2NextChange">${esc(cfg.nextChangeLabel)}</label><textarea id="pv2NextChange">${esc(rec.compass.nextChange)}</textarea></div>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2SaveCompass">Save Compass</button></div><div class="profile-v2-status" id="pv2CompassStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="nextTitle">
      <p class="profile-v2-eyebrow">${esc(cfg.nextEyebrow)}</p><h3 id="nextTitle">${esc(cfg.nextTitle)}</h3><p>${esc(cfg.nextCopy)}</p>
      ${renderLane(cfg.laneToday||"Today",lanes.today)}${renderLane(cfg.laneReview||"Review",lanes.review)}${renderLane(cfg.laneNext||"Next",lanes.next)}
    </section>
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="mapTitle">
      <p class="profile-v2-eyebrow">My Learning Map</p><h3 id="mapTitle">${esc(cfg.mapTitle)}</h3>
      <div class="profile-v2-field"><label for="pv2Strengths">${esc(cfg.strengthsLabel)}</label><textarea id="pv2Strengths" placeholder="One per line">${esc(lines(rec.learningMap.strengths))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Preferences">${esc(cfg.preferencesLabel)}</label><textarea id="pv2Preferences" placeholder="Examples, visuals, discussion, practice…">${esc(lines(rec.learningMap.learningPreferences))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Supports">${esc(cfg.supportsLabel)}</label><textarea id="pv2Supports">${esc(lines(rec.learningMap.supports))}</textarea></div>
      <div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2Reset">${esc(cfg.resetLabel)}</label><textarea id="pv2Reset">${esc(lines(rec.learningMap.focusReset))}</textarea></div>
      <div class="profile-v2-field"><label for="pv2Interests">${esc(cfg.interestsLabel)}</label><textarea id="pv2Interests">${esc(lines(rec.learningMap.interests))}</textarea></div>
      <div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2Growth">${esc(cfg.growthLabel)}</label><textarea id="pv2Growth">${esc(lines(rec.learningMap.growthSkills))}</textarea></div>
      <div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2Collaboration">${esc(cfg.collaborationLabel)}</label><select id="pv2Collaboration"><option value="flexible">Flexible</option><option value="independent">Independent work</option><option value="guided">Guided support</option><option value="collaborative">Collaborative work</option></select></div>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2SaveMap">Save Learning Map</button></div><div class="profile-v2-status" id="pv2MapStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col6" aria-labelledby="evidenceTitle">
      <p class="profile-v2-eyebrow">${esc(cfg.evidenceEyebrow)}</p><h3 id="evidenceTitle">${esc(cfg.evidenceTitle)}</h3><p>${esc(cfg.evidenceCopy)}</p>
      ${evidenceMarkup(rec)}
      <h4>${esc(cfg.evidenceAddTitle)}</h4>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2EvidenceTitle">Evidence title</label><input id="pv2EvidenceTitle" placeholder="Project, essay, investigation…"></div><div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2EvidenceCategory">Category</label><input id="pv2EvidenceCategory" placeholder="Mathematics, Science, Writing…"></div></div>
      <div class="profile-v2-field"><label for="pv2EvidenceSummary">What this shows</label><textarea id="pv2EvidenceSummary"></textarea></div>
      <div class="profile-v2-field" data-profile-detail="advanced"><label for="pv2EvidenceHref">Optional evidence link</label><input id="pv2EvidenceHref" type="url" placeholder="https://"></div>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2AddEvidence">Add to Passport</button></div><div class="profile-v2-status" id="pv2EvidenceStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col8" aria-labelledby="workspaceTitle">
      <p class="profile-v2-eyebrow">Workspace</p><h3 id="workspaceTitle">${esc(cfg.workspaceTitle)}</h3><p>${esc(cfg.workspaceCopy)}</p>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Theme">Theme</label><select id="pv2Theme"><option value="academy">Academy</option><option value="parchment">Parchment</option><option value="forest">Forest</option><option value="midnight">Midnight</option><option value="ocean">Ocean</option><option value="plum">Plum</option></select></div><div class="profile-v2-field"><label for="pv2Text">Text size</label><select id="pv2Text"><option value="small">Small</option><option value="standard">Standard</option><option value="large">Large</option><option value="extra-large">Extra large</option></select></div></div>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Line">Line spacing</label><select id="pv2Line"><option value="standard">Standard</option><option value="comfortable">Comfortable</option><option value="wide">Wide</option></select></div><div class="profile-v2-field"><label for="pv2Width">Reading width</label><select id="pv2Width"><option value="narrow">Narrow</option><option value="comfortable">Comfortable</option><option value="wide">Wide</option></select></div></div>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2Contrast">Contrast</label><select id="pv2Contrast"><option value="standard">Standard</option><option value="high">High contrast</option></select></div><div class="profile-v2-field"><label for="pv2Density">Dashboard density</label><select id="pv2Density"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></div></div>
      <div class="profile-v2-field"><label for="pv2Language">Preferred learning language</label><input id="pv2Language" value="${esc(rec.workspace.preferredLanguage)}" placeholder="English, Spanish, French…"></div>
      <label class="profile-v2-check"><input id="pv2Motion" type="checkbox" ${rec.workspace.reducedMotion?"checked":""}> Reduce nonessential motion</label>
      <label class="profile-v2-check"><input id="pv2TTS" type="checkbox" ${rec.workspace.tts?"checked":""}> Prefer text-to-speech controls when available</label>
      <label class="profile-v2-check"><input id="pv2Simple" type="checkbox" ${rec.workspace.simplifiedDashboard?"checked":""}> Prefer a simplified dashboard when supported</label>
      <div class="profile-v2-actions"><button class="profile-v2-btn" type="button" id="pv2SaveWorkspace">Save Workspace</button><button class="profile-v2-btn secondary" type="button" id="pv2Export">Export Profile Bundle</button><button class="profile-v2-btn secondary" type="button" id="pv2Reset">Reset Preferences</button></div>
      <div class="profile-v2-field"><label for="pv2ImportFile">Restore from a profile bundle</label><input id="pv2ImportFile" type="file" accept=".json,application/json"></div>
      <div class="profile-v2-two"><div class="profile-v2-field"><label for="pv2RestoreMode">Restore method</label><select id="pv2RestoreMode"><option value="merge">Merge with this learner</option><option value="replace">Replace learner preferences</option></select></div><div class="profile-v2-actions"><button class="profile-v2-btn secondary" type="button" id="pv2Restore" disabled>Restore Previewed Bundle</button></div></div>
      <div class="profile-v2-status" id="pv2ImportStatus" aria-live="polite"></div><div class="profile-v2-status" id="pv2WorkspaceStatus" aria-live="polite"></div>
    </section>
    <section class="profile-v2-card profile-v2-col4" aria-labelledby="privacyTitle" data-khae-optional="true">
      <p class="profile-v2-eyebrow">Privacy Boundary</p><h3 id="privacyTitle">${esc(cfg.privacyTitle)}</h3>
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
  const cfg=stagePresentation(l);
  document.getElementById("pv2SaveCompass")?.addEventListener("click",()=>{const ok=P.updateCompass({weekOf:value("pv2Week"),weeklyGoal:value("pv2Goal"),whyMatters:value("pv2Why"),strategy:value("pv2Strategy"),helpNeeded:value("pv2Help"),reflection:value("pv2Reflection"),nextChange:value("pv2NextChange")},l.learnerId);status("pv2CompassStatus",ok?"Learning Compass saved for this learner.":"Could not save on this device.")});
  document.getElementById("pv2SaveMap")?.addEventListener("click",()=>{const ok=P.updateLearningMap({strengths:split(value("pv2Strengths")),learningPreferences:split(value("pv2Preferences")),supports:split(value("pv2Supports")),focusReset:split(value("pv2Reset")),interests:split(value("pv2Interests")),growthSkills:split(value("pv2Growth")),collaboration:value("pv2Collaboration")},l.learnerId);status("pv2MapStatus",ok?"Learning Map saved for this learner.":"Could not save on this device.")});
  document.getElementById("pv2AddEvidence")?.addEventListener("click",()=>{const title=value("pv2EvidenceTitle").trim();if(!title){status("pv2EvidenceStatus","Add an evidence title first.");return}const ok=P.addLearnerEvidence({id:"learner-"+Date.now(),title,category:value("pv2EvidenceCategory")||cfg.evidenceCategory,evidenceHref:value("pv2EvidenceHref"),summary:value("pv2EvidenceSummary")},l.learnerId);if(ok)render();else status("pv2EvidenceStatus","Could not save evidence on this device.")});
  host.querySelectorAll("[data-remove-evidence]").forEach(button=>button.addEventListener("click",()=>{P.removeEvidence(button.dataset.removeEvidence,l.learnerId);render()}));
  document.getElementById("pv2SaveWorkspace")?.addEventListener("click",()=>{const prefs={theme:value("pv2Theme"),textSize:value("pv2Text"),lineSpacing:value("pv2Line"),readingWidth:value("pv2Width"),contrast:value("pv2Contrast"),density:value("pv2Density"),preferredLanguage:value("pv2Language"),reducedMotion:document.getElementById("pv2Motion")?.checked,tts:document.getElementById("pv2TTS")?.checked,simplifiedDashboard:document.getElementById("pv2Simple")?.checked};const ok=P.updateWorkspace(prefs,l.learnerId);if(ok){applyWorkspace(P.read(l.learnerId).workspace);status("pv2WorkspaceStatus","Workspace preferences saved.")}else status("pv2WorkspaceStatus","Could not save on this device.")});
  document.getElementById("pv2Export")?.addEventListener("click",()=>{
    const profile=P.exportPayload(l.learnerId);if(!profile)return;
    const payload={format:"khaemenes-student-profile-bundle-v3",exportedAt:new Date().toISOString(),learner:profile.learner,profile:profile.profile,quickPins:(Q?.list?.()||[]).map(item=>item.id),authority:profile.authority,privacy:profile.privacy};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="khaemenes-student-profile-bundle-v3.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
  });
  document.getElementById("pv2ImportFile")?.addEventListener("change",async event=>{
    pendingImport=null;const restore=document.getElementById("pv2Restore");if(restore)restore.disabled=true;
    const file=event.target.files?.[0];if(!file){status("pv2ImportStatus","Choose a JSON profile bundle to preview.");return}
    try{
      const payload=JSON.parse(await file.text()),preview=P.previewImport(payload,l.learnerId);
      if(!preview.ok){status("pv2ImportStatus",preview.reason==="learner-mismatch"?"This bundle belongs to a different learner. Nothing was changed.":"This file is not a supported Khaemenes learner-profile bundle. Nothing was changed.");return}
      pendingImport={payload,preview};
      status("pv2ImportStatus",`Preview: ${preview.learner.nickname||"Learner"} · ${preview.counts.learnerEvidence} learner evidence entr${preview.counts.learnerEvidence===1?"y":"ies"} · ${preview.counts.quickPins} Quick Pins · ${preview.counts.courseEvidenceIgnored} course-authority entr${preview.counts.courseEvidenceIgnored===1?"y":"ies"} will be ignored and rebuilt from live courses.`);
      if(restore)restore.disabled=false;
    }catch{status("pv2ImportStatus","The selected file could not be read as valid JSON. Nothing was changed.")}
  });
  document.getElementById("pv2Restore")?.addEventListener("click",()=>{
    if(!pendingImport){status("pv2ImportStatus","Preview a profile bundle before restoring.");return}
    const mode=value("pv2RestoreMode")==="replace"?"replace":"merge",result=P.restoreProfile(pendingImport.payload,{mode,target:l.learnerId});
    if(!result.ok){status("pv2ImportStatus","Restore was blocked. Nothing was changed.");return}
    const validQuick=(result.quickPins||[]).filter(id=>Q?.resources?.[id]);
    if(Q){
      if(mode==="replace")Q.clear();
      validQuick.forEach(id=>Q.setPinned(id,true));
    }
    pendingImport=null;render();
  });
  document.getElementById("pv2Reset")?.addEventListener("click",()=>{if(confirm("Reset this learner's Compass, Learning Map, and Workspace preferences? Evidence Passport entries will remain.")){P.clearPreferences(l.learnerId);render()}});
}
global.addEventListener("khaemenes-family-changed",render);
global.addEventListener("khaemenes-learning-continuation-changed",render);
global.addEventListener("khaemenes-student-profile-changed",event=>{if(event.detail?.learnerId===learner()?.learnerId)render()});
global.addEventListener("storage",event=>{const key=String(event.key||"");if(key===P.storageKey||key.startsWith(P.storagePrefix||"khaemenes.student-profile.v3:")||key===C?.storageKey)render()});
render();
global.KhaemenesStudentProfileUIV2=Object.freeze({version:VERSION,render,applyWorkspace,stagePresentation,normalizedStage});
})(window);
