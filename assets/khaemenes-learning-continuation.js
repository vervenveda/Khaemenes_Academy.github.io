(function attachKhaemenesLearningContinuation(global){
  "use strict";

  const VERSION="1.0.1";
  const KEY="khaemenes.learning.continuation.v1";
  const ALLOWED_STATUS=new Set(["continue","practice","corrections","mastery","assessment","complete","paused"]);
  const MAX_COURSES_PER_LEARNER=80;

  const native=Object.freeze({
    getItem:Storage.prototype.getItem,
    setItem:Storage.prototype.setItem,
    removeItem:Storage.prototype.removeItem
  });

  function clean(value,max=180){
    return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max);
  }
  function number(value,min=0,max=100){
    const n=Number(value);
    return Number.isFinite(n)?Math.max(min,Math.min(max,n)):null;
  }
  function absoluteHref(value){
    const raw=clean(value,500);
    if(!raw)return "";
    try{
      const url=new URL(raw,global.location?.href||"https://vervenveda.com/");
      if(!/^https?:$/.test(url.protocol))return "";
      return url.href;
    }catch{return ""}
  }
  function read(){
    try{
      const raw=native.getItem.call(global.localStorage,KEY);
      const parsed=raw?JSON.parse(raw):null;
      return parsed&&parsed.version===1&&parsed.learners&&typeof parsed.learners==="object"
        ? parsed
        : {version:1,learners:{},updatedAt:null};
    }catch{return {version:1,learners:{},updatedAt:null}}
  }
  function write(store){
    try{
      store.updatedAt=new Date().toISOString();
      native.setItem.call(global.localStorage,KEY,JSON.stringify(store));
      global.dispatchEvent(new CustomEvent("khaemenes-learning-continuation-changed",{detail:{updatedAt:store.updatedAt}}));
      return true;
    }catch{return false}
  }
  function normalizeProgress(value){
    const v=value&&typeof value==="object"?value:{};
    const completed=number(v.completed,0,100000);
    const total=number(v.total,0,100000);
    let percent=number(v.percent,0,100);
    if(percent===null&&completed!==null&&total)percent=Math.round(completed/total*100);
    return {completed,total,percent};
  }
  function normalizeMastery(value){
    const v=value&&typeof value==="object"?value:{};
    return {
      best:number(v.best,0,100),
      threshold:number(v.threshold,0,100)??80,
      mastered:v.mastered===true
    };
  }
  function normalizeSnapshot(input){
    const learnerId=clean(input?.learnerId,120);
    const courseId=clean(input?.courseId,140);
    if(!learnerId||!courseId)throw new Error("learner-and-course-required");
    const status=ALLOWED_STATUS.has(input?.status)?input.status:"continue";
    const now=new Date().toISOString();
    return {
      format:"khaemenes-learning-continuation-v1",
      learnerId,
      courseId,
      school:clean(input.school,80),
      stage:clean(input.stage,40),
      grade:clean(input.grade,20),
      subject:clean(input.subject,80),
      courseTitle:clean(input.courseTitle||input.title||courseId,120),
      status,
      nextLabel:clean(input.nextLabel||status,60),
      nextTitle:clean(input.nextTitle||input.courseTitle||courseId,140),
      nextHref:absoluteHref(input.nextHref||""),
      summary:clean(input.summary||"",260),
      progress:normalizeProgress(input.progress),
      mastery:normalizeMastery(input.mastery),
      family:{
        needsAction:input.family?.needsAction===true,
        label:clean(input.family?.label||"",90),
        summary:clean(input.family?.summary||"",220),
        href:absoluteHref(input.family?.href||"")
      },
      source:clean(input.source||global.location?.pathname||"unknown",240),
      updatedAt:now
    };
  }
  function publish(input){
    const snapshot=normalizeSnapshot(input);
    const store=read();
    const learner=store.learners[snapshot.learnerId]&&typeof store.learners[snapshot.learnerId]==="object"
      ? store.learners[snapshot.learnerId]
      : {courses:{},updatedAt:null};
    learner.courses=learner.courses&&typeof learner.courses==="object"?learner.courses:{};
    learner.courses[snapshot.courseId]=snapshot;

    const ordered=Object.values(learner.courses).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
    if(ordered.length>MAX_COURSES_PER_LEARNER){
      learner.courses=Object.fromEntries(ordered.slice(0,MAX_COURSES_PER_LEARNER).map(x=>[x.courseId,x]));
    }
    learner.updatedAt=snapshot.updatedAt;
    store.learners[snapshot.learnerId]=learner;
    write(store);
    return Object.freeze({...snapshot});
  }
  function readLearner(learnerId){
    const id=clean(learnerId,120);
    if(!id)return [];
    const learner=read().learners[id];
    if(!learner?.courses)return [];
    return Object.values(learner.courses)
      .filter(x=>x&&x.learnerId===id)
      .sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .map(x=>Object.freeze({...x,progress:{...x.progress},mastery:{...x.mastery},family:{...x.family}}));
  }
  function readCourse(learnerId,courseId){
    const id=clean(learnerId,120),course=clean(courseId,140);
    if(!id||!course)return null;
    return readLearner(id).find(x=>x.courseId===course)||null;
  }
  function removeCourse(learnerId,courseId){
    const id=clean(learnerId,120),course=clean(courseId,140),store=read();
    if(!store.learners[id]?.courses?.[course])return false;
    delete store.learners[id].courses[course];
    store.learners[id].updatedAt=new Date().toISOString();
    return write(store);
  }
  function clearLearner(learnerId){
    const id=clean(learnerId,120),store=read();
    if(!store.learners[id])return false;
    delete store.learners[id];
    return write(store);
  }
  function summarize(learnerId){
    const courses=readLearner(learnerId);
    return Object.freeze({
      learnerId:clean(learnerId,120),
      courses:courses.length,
      needsFamilyAction:courses.filter(x=>x.family?.needsAction).length,
      corrections:courses.filter(x=>x.status==="corrections").length,
      masteryRequired:courses.filter(x=>x.status==="mastery").length,
      assessments:courses.filter(x=>x.status==="assessment").length,
      complete:courses.filter(x=>x.status==="complete").length,
      updatedAt:courses[0]?.updatedAt||null
    });
  }

  global.KhaemenesLearningContinuation=Object.freeze({
    version:VERSION,
    storageKey:KEY,
    statuses:Object.freeze([...ALLOWED_STATUS]),
    publish,
    readLearner,
    readCourse,
    removeCourse,
    clearLearner,
    summarize,
    policy:Object.freeze({
      summaryOnly:true,
      storesAssessmentAnswers:false,
      awardsMastery:false,
      changesPlacement:false,
      changesScores:false,
      unlocksLessons:false,
      parentReadRequiresProgressPermission:true
    })
  });
})(window);
