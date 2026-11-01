
(() => {
"use strict";
const R=window.KhaemenesFamilyRegistry,F=window.KhaemenesFrontDoorRouter,C=window.KhaemenesLearningContinuation,Q=window.KhaemenesStudentQuickPinsV1;
const app=document.getElementById("profileDashboard");
const PIN_KEY="khaemenes_course_pins_v1";
const HIGH_PIN_KEY="khaemenes-high-pinned-courses-v2";
const HIGH_PIN_META=Object.freeze({
  "pre-algebra":{title:"Pre-Algebra",subtitle:"Mathematics · Grade 09 pathway",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/"},
  "algebra-1":{title:"Algebra I",subtitle:"Mathematics · placement pathway",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-1/"},
  "english-9":{title:"English 9",subtitle:"Language Arts · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/english-9/"},
  "integrated-science-9":{title:"Integrated Science 9",subtitle:"Science · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/science/integrated-science-9/"},
  "global-studies-9":{title:"Global Studies Honors",subtitle:"Social Studies · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/social-studies/grade-09/"},
  "physical-education-9":{title:"Physical Education 9",subtitle:"Physical Education · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/courses/physical-education/"},
  "psychology-101":{title:"Psychology 101",subtitle:"Elective · Grade 09",href:"https://vervenveda.com/Khaemenes_High.github.io/electives/grades/grade-09/psych-101/"},
  "world-language-9-spanish":{title:"Spanish I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=spanish&course=hs1&source=khaemenes-high-grade09"},
  "world-language-9-french":{title:"French 101",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/apps/French_101_index.html"},
  "world-language-9-german":{title:"German I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=german&course=hs1&source=khaemenes-high-grade09"},
  "world-language-9-mandarin":{title:"Mandarin Chinese I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=mandarin&course=hs1&source=khaemenes-high-grade09"},
  "world-language-9-japanese":{title:"Japanese I",subtitle:"World Language · Grade 09",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=japanese&course=hs1&source=khaemenes-high-grade09"},
  "world-language-9-arabic":{title:"Arabic · Exploration",subtitle:"World Language · exploration pathway",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=arabic&mode=atlas&source=khaemenes-high-grade09"},
  "world-language-9-russian":{title:"Russian · Exploration",subtitle:"World Language · exploration pathway",href:"https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?language=russian&mode=atlas&source=khaemenes-high-grade09"}
});
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function readPins(){
  try{
    const v=JSON.parse(localStorage.getItem(PIN_KEY)||"null");
    return v&&typeof v==="object"&&v.learners&&typeof v.learners==="object"?v:{version:1,learners:{}};
  }catch{return {version:1,learners:{}}}
}
function learnerPins(id){
  const canonical=readPins().learners?.[id];
  const list=Array.isArray(canonical)?canonical.filter(x=>x&&typeof x==="object"):[];
  let high=[];
  try{
    const raw=JSON.parse(localStorage.getItem(`${HIGH_PIN_KEY}:learner:${encodeURIComponent(id)}`)||"[]");
    high=Array.isArray(raw)?raw.map(pin=>HIGH_PIN_META[pin]?{id:pin,courseId:pin,...HIGH_PIN_META[pin],source:"khaemenes-high"}:null).filter(Boolean):[];
  }catch{}
  const seen=new Set(),merged=[];
  for(const pin of [...list,...high]){
    const key=String(pin.id||pin.courseId||pin.href||pin.title||"");
    if(!key||seen.has(key))continue;
    seen.add(key);merged.push(pin);
  }
  // Source-of-truth for this learner's display is their explicit Grade 09
  // language preference, never a stale Spanish pin from a previous selection.
  const prefix="world-language-9-";
  const allowed=["spanish","french","german","mandarin","japanese","arabic","russian"];
  const codeOf=item=>{
    const key=String(item?.id||item?.courseId||"");
    const code=key.startsWith(prefix)?key.slice(prefix.length):"";
    return allowed.includes(code)?code:null;
  };
  const found=merged.filter(codeOf);
  if(found.length){
    let selected=null;
    try{
      const raw=JSON.parse(localStorage.getItem("khaemenes-high-language-choices-v1:learner:"+encodeURIComponent(id))||"null");
      if(allowed.includes(raw?.["9"]))selected=raw["9"];
    }catch{}
    if(!selected){
      const fromHigh=[...new Set(high.map(codeOf).filter(Boolean))];
      const fromAll=[...new Set(found.map(codeOf).filter(Boolean))];
      selected=fromHigh.length===1?fromHigh[0]:fromAll.length===1?fromAll[0]:null;
    }
    const meta=selected?HIGH_PIN_META[prefix+selected]:null;
    if(meta){
      const candidate={id:prefix+selected,courseId:prefix+selected,...meta,source:"khaemenes-high"};
      const first=merged.findIndex(item=>codeOf(item));
      const rest=merged.filter(item=>!codeOf(item));
      rest.splice(Math.min(first,rest.length),0,candidate);
      return rest.slice(0,24);
    }
  }
  return merged.slice(0,24);
}
function gradeLabel(l){
  const meta=l?.grade&&R?.gradeMeta?.[l.grade]?R.gradeMeta[l.grade]:null;
  return {label:meta?.label||(l?.stage==="higher"?"Higher Learning":"Placement in progress"),school:meta?.school||(l?.stage==="higher"?"Khaemenes Higher Learning":"Khaemenes Academy")};
}
function continuationStatus(value){return ({continue:"Continue",practice:"Practice",corrections:"Corrections",mastery:"Mastery Required",assessment:"Assessment Next",complete:"Complete",paused:"Paused"})[value]||"Continue"}
function learnerContinuation(learner){
  const snapshots=C?.readLearner?.(learner?.learnerId)||[];
  if(!snapshots.length)return '<div class="empty">No course has published a continuation snapshot yet. Your pinned courses and school placement still work normally.</div>';
  return `<div class="next-grid">${snapshots.slice(0,6).map(s=>`<div class="next-row"><span><strong>${esc(s.courseTitle||s.courseId)}</strong><small>${esc(s.nextTitle||s.summary||"Next learning step")}</small>${s.stale?`<small><strong>Progress changed.</strong> Open the course to refresh this summary.</small>`:""}<span class="next-status">${esc(continuationStatus(s.status))}</span></span>${s.nextHref?`<a class="btn secondary" href="${esc(s.nextHref)}">${s.stale?"Refresh":"Open"}</a>`:""}</div>`).join("")}</div>`;
}
function bestContinuation(learner){
  return (C?.readLearner?.(learner?.learnerId)||[]).find(s=>s.status!=="complete"&&s.nextHref)||null;
}
function renderPins(learner){
  const pins=learnerPins(learner.learnerId);
  if(!pins.length)return '<div class="empty">No courses are pinned yet. Open a course and choose “Pin to Profile” to place it here.</div>';
  return `<div class="pin-list">${pins.map(p=>`<div class="pin-row"><a href="${esc(p.href||"#")}" class="pin-course-link"><strong>${esc(p.title||"Course")}</strong><small>${esc(p.subtitle||"Return to course")}</small></a><button class="btn secondary" type="button" data-course-unpin="${esc(p.id||p.courseId||"")}" aria-label="Unpin ${esc(p.title||"course")}">Unpin</button></div>`).join("")}</div>`;
}
/* Removing a pin changes shortcuts only. Progress, enrollment, and assessments are never touched. */
function unpinCourse(learner,id){
  const learnerId=learner?.learnerId;
  if(!learnerId||!id||!/^[a-z0-9][a-z0-9-]{0,95}$/.test(id))return false;
  if(R?.getLearner?.(learnerId)?.learnerId!==learnerId)return false;
  const academy=readPins(),before=academy.learners[learnerId];
  const list=Array.isArray(before)?before:[];
  const itemId=x=>typeof x==="string"?x:String(x?.id||x?.courseId||"");
  const isGrade09Language=id.startsWith("world-language-9-");
  const updated=list.filter(x=>itemId(x)!==id&&!(isGrade09Language&&itemId(x).startsWith("world-language-9-")));
  const isHigh=Object.prototype.hasOwnProperty.call(HIGH_PIN_META,id);
  const highKey=`${HIGH_PIN_KEY}:learner:${encodeURIComponent(learnerId)}`;
  const priorAcademy=localStorage.getItem(PIN_KEY);
  const priorHigh=isHigh?localStorage.getItem(highKey):null;
  try{
    academy.learners[learnerId]=updated;
    localStorage.setItem(PIN_KEY,JSON.stringify(academy));
    if(isHigh){
      const raw=JSON.parse(priorHigh||"[]");
      const high=Array.isArray(raw)?raw:[];
      localStorage.setItem(highKey,JSON.stringify(high.filter(x=>x!==id&&!(isGrade09Language&&typeof x==="string"&&x.startsWith("world-language-9-")))));
    }
    window.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed",{detail:{learnerId}}));
    return true;
  }catch(error){
    try{
      if(priorAcademy===null)localStorage.removeItem(PIN_KEY);
      else localStorage.setItem(PIN_KEY,priorAcademy);
      if(isHigh){
        if(priorHigh===null)localStorage.removeItem(highKey);
        else localStorage.setItem(highKey,priorHigh);
      }
    }catch{}
    return false;
  }
}
function renderQuickPins(learner){
  const active=Q?.activeLearner?.();
  if(!Q||!active?.learnerId||active.learnerId!==learner?.learnerId)return '<div class="empty">No personal shortcuts are available for this learner yet.</div>';
  const list=Q.list?.()||[];
  if(!list.length)return '<div class="empty">No Quick Pins yet. Games, tools, resources, and electives can be pinned without changing enrollment or grades.</div>';
  return `<div class="pin-list">${list.map(item=>`<div class="pin-row"><a href="${esc(item.href||"#")}"><span><strong>${esc(item.title||"Quick Pin")}</strong><small>${esc(item.subtitle||item.category||"Personal shortcut")}</small></span></a><button class="btn secondary" type="button" data-quick-remove="${esc(item.id)}">Remove</button></div>`).join("")}</div>`;
}
function primaryLearningAction(learner){
  const route=F?.routeForLearner?.(learner)||null;
  if(learner?.stage==="high"&&route?.destination)return `<a class="btn gold" href="${esc(route.destination)}">Open My Daily Profile</a>`;
  const next=bestContinuation(learner);
  if(next?.nextHref)return `<a class="btn gold" href="${esc(next.nextHref)}">${esc(next.nextLabel||"Continue Learning")}</a>`;
  return learner?.stage==="higher"?'<a class="btn gold" href="https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/">Open Higher Learning</a>':'<button class="btn" id="continueLearning" type="button">Continue Learning</button>';
}
function pinnedGuidance(learner){
  return learner?.stage==="higher"
    ? "Higher Learning course pins and scholar preferences remain tied to this Academy learner on the shared Verve N Veda origin."
    : "Open Pre-Algebra above to begin or resume. Its readiness and mastery checks guide your next lesson.";
}
function renderLearners(family,active){
  const list=Array.isArray(family?.learners)?family.learners.filter(l=>l&&!l.selfDirectedAdult):[];
  if(!list.length)return '<div class="empty">No K–12 learners are registered in this family profile yet.</div>';
  return `<div class="learner-list">${list.map(l=>{const m=gradeLabel(l),on=l.learnerId===active?.learnerId;return `<div class="learner-row"><span><strong>${esc(l.nickname||"Learner")}${on?" · Active":""}</strong><small>${esc(m.label)} · ${esc(m.school)}</small></span>${on?'<span class="chip">Current</span>':`<button class="btn secondary" type="button" data-switch="${esc(l.learnerId)}">Switch</button>`}</div>`}).join("")}</div>`;
}
function render(){
  if(!R||!F){
    app.innerHTML='<div class="notice">The learner registry or course router could not load. Your existing coursework has not been changed. You can still use the Academy subject directory after refreshing this page.</div>';
    return;
  }
  const learner=R.getLearner?.()||null,family=R.getFamily?.()||null;
  // My Profile must remain reachable even before a learner is selected.
  if(learner?.selfDirectedAdult===true){location.replace("../adult/");return}
  // Classroom doors never depend on family-record availability.
  const classroomBase="https://vervenveda.com/Khaemenes_High.github.io/";
  const classroomItems=[
    ["Mathematics","Algebra, geometry & numeracy",classroomBase+"courses/mathematics/"],
    ["Language Arts","Reading, writing & literature",classroomBase+"courses/language-arts/"],
    ["Science","Investigations & experiments",classroomBase+"courses/science/"],
    ["Social Studies","History, civics & geography",classroomBase+"courses/social-studies/"],
    ["Foreign Language","World languages & communication","https://vervenveda.github.io/Khaemenes_Linguistics.github.io/Halls/index.html"],
    ["Psychology","Psychology 101",classroomBase+"electives/grades/grade-09/psych-101/index.html"],
    ["Electives","Arts, wellness & exploration","https://vervenveda.com/medicament-hub.github.io/academy/high-school-health/courses/electives/"],
    ["Life Skills","Practical living, safety & independence","https://vervenveda.com/Khaemenes_Academy_Life_Skills.github.io/"],
    ["Academy Home","Explore every Academy level","../"]
  ];
  const classrooms='<section class="card academy-classrooms" id="studentCourseDoors" aria-labelledby="classroomHeading"><p class="eyebrow">Academy Classrooms</p><h3 id="classroomHeading">Go directly to your courses</h3><p>Choose a subject to enter its learning hall. Course access remains available even if a learner profile is not selected; individual lessons still enforce their own progress and mastery requirements.</p><nav class="classroom-grid" aria-label="Academy subject entrances">'+classroomItems.map(([name,description,url])=>'<a class="classroom-link'+(name==="Academy Home"?' academy-home':'')+'" href="'+esc(url)+'"><strong>'+esc(name)+' →</strong><span>'+esc(description)+'</span></a>').join("")+'</nav></section>';
  if(!learner){app.innerHTML="";return;}
  const m=gradeLabel(learner),route=F.routeForLearner?.(learner)||null;
  app.innerHTML=`<div class="student-command" aria-label="Student command center">
      <div class="student-command-head">
        <div><p class="eyebrow">Khaemenes Academy · My Learning Day</p><h3>Welcome back, ${esc(learner.nickname||"Learner")}.</h3><p>Your own courses, goals, portfolio and tools in one place. Progress remains attached to your selected learner.</p></div>
        <a class="command-profile" href="profile.html">Personalize my profile →</a>
      </div>
      <nav class="command-tabs" aria-label="Student dashboard shortcuts">
        <a href="#studentCourses">My Courses</a><a href="#studentNext">Continue Learning</a><a href="#studentSchedule">My Schedule</a><a href="#studentTools">Games &amp; Tools</a><a href="profile.html">Goals &amp; Evidence</a>
      </nav>
      <section id="studentSchedule" class="student-schedule" aria-labelledby="studentScheduleTitle"><div><p class="eyebrow">My schedule</p><h4 id="studentScheduleTitle">Build your learning day</h4><p>Pin the courses and activities you want to revisit. Your saved course continuation appears below; a timetable is not inferred from grades.</p></div><div class="schedule-actions"><a href="#studentCourses">Pinned courses →</a><a href="#studentTools">Pinned activities →</a></div></section>
    </div><div class="grid">
    <section class="card col7" id="studentCourses">
      <p class="eyebrow">Ready to learn</p>
      <div class="profile-name">${esc(learner.nickname||"Learner")}</div>
      <div class="placement">${esc(m.label)} · ${esc(m.school)}</div>
      <div class="chips"><span class="chip">${esc(m.label)}</span><span class="chip">${esc(learner.stage||"Academy")}</span></div>
      <div class="actions">
        ${primaryLearningAction(learner)}
        <a class="btn secondary" href="profile.html">My Profile &amp; Placement</a>
        <a class="btn secondary" href="../family/">Family Hub</a>
      </div>
      ${route?.requiresPlacement?'<p class="notice" style="margin-top:18px">Choose an exact K–12 grade before continuing to a school pathway.</p>':'<p class="notice good" style="margin-top:18px">Your learning path is ready.</p>'}
    </section>
    <section class="card col5" id="studentNext">
      <p class="eyebrow">Up next</p><h3>Your learning continuation.</h3><p>The latest course snapshots show where to resume, practice, correct work, or complete a mastery gate.</p>${learnerContinuation(learner)}
    </section>
    <section class="card col6">
      <p class="eyebrow">Pinned courses</p>
      <h3>Return quickly.</h3>
      <p>${esc(pinnedGuidance(learner))}</p>
      ${renderPins(learner)}
    </section>
    <section class="card col6" id="studentTools">
      <p class="eyebrow">Quick Pins</p>
      <h3>Games, tools &amp; resources.</h3>
      <p>Personal shortcuts stay separate from enrollment, grades, mastery, and placement.</p>
      ${renderQuickPins(learner)}
    </section>
    <section class="card col6"><p class="eyebrow">Family connection</p><h3>Learning stays connected.</h3><p>Authorized adults with progress access can see the same next-step summaries in the Family Portal without changing your scores or unlocking lessons.</p><div class="actions"><a class="btn secondary" href="../family/">Open Family Portal</a></div></section>
    <section class="card col12">
      <p class="eyebrow">Family learners</p>
      <h3>Switch learner.</h3>
      <p>Each learner keeps a separate academic path inside the family profile.</p>
      ${renderLearners(family,learner)}
    </section>
  </div>`;
  
  document.getElementById("continueLearning")?.addEventListener("click",()=>F.continueLearner?.(learner));
  app.querySelectorAll("[data-switch]").forEach(b=>b.addEventListener("click",()=>{
    const next=R.getLearner?.(b.dataset.switch);
    if(!next)return;
    R.setActive?.({familyId:next.familyId,learnerId:next.learnerId});
    render();
  }));
  app.querySelectorAll("[data-course-unpin]").forEach(b=>b.addEventListener("click",()=>{
    const id=b.dataset.courseUnpin;
    if(unpinCourse(learner,id))render();
    else alert("Could not unpin this course. Please check your selected learner and browser storage.");
  }));
  app.querySelectorAll("[data-quick-remove]").forEach(b=>b.addEventListener("click",()=>{
    if(Q?.setPinned?.(b.dataset.quickRemove,false))render();
  }));
}
window.addEventListener("khaemenes-family-changed",render);
window.addEventListener("storage",e=>{if(e.key===PIN_KEY||e.key===C?.storageKey||e.key===Q?.storageKey||String(e.key||"").startsWith(HIGH_PIN_KEY))render()});
window.addEventListener("khaemenes-learning-continuation-changed",render);
window.addEventListener("khaemenes-student-quick-pins-changed",render);
render();
})();
