(function attachKhaemenesLearnerContext(global){
  "use strict";

  const VERSION="1.0.0";

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function clean(value,max=120){return String(value??"").trim().slice(0,max)}
  function list(value,max=20){return Array.isArray(value)?value.slice(0,max).map(v=>clean(v,40)).filter(Boolean):[]}

  function active(){
    const r=registry();
    const learner=r?.getLearner?.()||null;
    const family=r?.getFamily?.()||null;
    return Object.freeze({learner,family});
  }

  function placementFor(learner=active().learner){
    const r=registry();
    if(!learner)return Object.freeze({status:"missing-learner",complete:false,stage:null,grade:null,gradeLabel:null,school:null,destination:null});
    const grade=r?.normalizeGrade?.(learner.grade)||null;
    const canonical=r?.canonicalPlacement?.({stage:learner.stage,grade})||{stage:learner.stage,grade};
    const meta=grade&&r?.gradeMeta?.[grade]?r.gradeMeta[grade]:null;
    const destination=r?.learnerDestination?.(learner)||r?.destinationFor?.({stage:canonical.stage,grade:canonical.grade})||null;
    return Object.freeze({
      status:grade?"complete":"grade-required",
      complete:Boolean(grade&&canonical.stage),
      stage:canonical.stage||learner.stage||null,
      grade:canonical.grade||grade||null,
      gradeLabel:meta?.label||null,
      school:meta?.school||null,
      destination:destination?.url||destination||null,
      corrected:Boolean(canonical.corrected),
      correctionReason:canonical.reason||null
    });
  }

  function surfaceState({stage="",grades=[]}={},learner=active().learner){
    const r=registry(),placement=placementFor(learner);
    const surfaceStage=r?.normalizeStage?.(stage)||clean(stage,40)||null;
    const allowedGrades=list(grades).map(g=>r?.normalizeGrade?.(g)||g).filter(Boolean);
    const stageMismatch=Boolean(learner&&surfaceStage&&placement.stage&&surfaceStage!==placement.stage);
    const gradeMismatch=Boolean(learner&&!stageMismatch&&placement.grade&&allowedGrades.length&&!allowedGrades.includes(placement.grade));
    return Object.freeze({
      version:VERSION,
      learnerId:learner?.learnerId||null,
      surfaceStage,
      allowedGrades:Object.freeze([...allowedGrades]),
      placement,
      stageMismatch,
      gradeMismatch,
      mismatch:stageMismatch||gradeMismatch,
      previewAllowed:true,
      hardRedirect:false
    });
  }

  function courseScope({courseId="",subject="",stage="",grade=""}={}){
    const learner=active().learner,placement=placementFor(learner);
    return Object.freeze({
      contract:"khaemenes.learner-course-context",
      version:1,
      learnerId:learner?.learnerId||null,
      accountId:learner?.accountId||null,
      familyId:learner?.familyId||null,
      stage:placement.stage||clean(stage,40)||null,
      grade:placement.grade||registry()?.normalizeGrade?.(grade)||null,
      courseId:clean(courseId,160)||null,
      subject:clean(subject,120)||null,
      authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false})
    });
  }

  function storageKey(base,{learnerId=null,courseId=""}={}){
    const learner=active().learner;
    const id=clean(learnerId||learner?.learnerId||"unassigned",120).replace(/[^a-zA-Z0-9_.:-]/g,"-");
    const course=clean(courseId,120).replace(/[^a-zA-Z0-9_.:-]/g,"-");
    const prefix=clean(base,100).replace(/[^a-zA-Z0-9_.:-]/g,"-")||"khaemenes.learning";
    return [prefix,id,course].filter(Boolean).join(":");
  }

  function snapshot(surface={}){
    const {learner,family}=active();
    return Object.freeze({
      version:VERSION,
      hasRegistry:Boolean(registry()),
      hasFamily:Boolean(family),
      hasLearner:Boolean(learner),
      learner,
      familyId:family?.familyId||learner?.familyId||null,
      placement:placementFor(learner),
      surface:surfaceState(surface,learner)
    });
  }

  function announce(surface={}){
    const detail=snapshot(surface);
    global.dispatchEvent(new CustomEvent("khaemenes-learner-context-ready",{detail}));
    return detail;
  }

  global.KhaemenesLearnerContext=Object.freeze({
    version:VERSION,
    active,
    placementFor,
    surfaceState,
    courseScope,
    storageKey,
    snapshot,
    announce
  });

  global.addEventListener("khaemenes-family-changed",()=>announce());
  global.addEventListener("khaemenes-learner-placement-changed",()=>announce());
  announce();
})(window);
