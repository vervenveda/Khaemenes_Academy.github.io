(function attachKhaemenesFrontDoorRouter(global){
  "use strict";
  const VERSION="1.2.0";

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function naib(){return global.KhaemenesNAIB||null}
  function context(){return global.KhaemenesLearnerContext||null}
  function activeLearner(){return registry()?.getLearner?.()||null}

  function identifiedStudentDestination({stage=null,grade=null}={}){
    if(stage!=="high")return null;
    const base="https://vervenveda.com/Khaemenes_High.github.io";
    if(grade==="09")return `${base}/grades/grade-09/student-profile/`;
    if(grade==="10")return `${base}/grades/grade-10/`;
    return `${base}/`;
  }

  function routeForLearner(learner=activeLearner()){
    if(!learner)return Object.freeze({status:"no-active-learner",version:VERSION,destination:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/",requiresEnrollment:true,requiresPlacement:true});
    const r=registry();
    const placement=context()?.placementFor?.(learner)||null;
    const local=r?.learnerDestination?.(learner)||r?.destinationFor?.(learner)||null;
    const stage=placement?.stage||learner.stage||null;
    const grade=placement?.grade||learner.grade||null;
    const n=naib()?.routeLearnerEntry?.({learnerId:learner.learnerId,stage,grade,surface:"academy-front-door",intent:"continue-learning"})||null;
    const requiresPlacement=!grade;
    const studentDestination=identifiedStudentDestination({stage,grade});
    const destination=requiresPlacement
      ? "https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"
      : (studentDestination||n?.destination||local?.url||"https://vervenveda.com/Khaemenes_Academy.github.io/student/");
    return Object.freeze({
      status:requiresPlacement?"placement-required":"ready",
      version:VERSION,
      learnerId:learner.learnerId,
      nickname:learner.nickname,
      stage,
      grade,
      gradeLabel:placement?.gradeLabel||(grade&&r?.gradeMeta?.[grade]?r.gradeMeta[grade].label:null),
      school:placement?.school||null,
      destination,
      requiresEnrollment:false,
      requiresPlacement,
      routedBy:studentDestination?"Academy canonical high-school learner route":(n?.assignedBy||"Academy local fallback"),
      naibEnvelope:n,
      placement,
      authority:Object.freeze({changesPlacement:false,changesLearnerIdentity:false,awardsMastery:false})
    });
  }

  function continueLearner(learner=activeLearner()){
    const route=routeForLearner(learner);
    global.dispatchEvent(new CustomEvent("khaemenes:front-door-route",{detail:route}));
    if(route.destination)global.location.assign(route.destination);
    return route;
  }

  function switchLearner(learnerId,{continueAfter=false}={}){
    const r=registry();if(!r)throw new Error("family-registry-unavailable");
    const learner=r.getLearner(learnerId);if(!learner)throw new Error("learner-not-found");
    r.setActive({familyId:learner.familyId,learnerId:learner.learnerId});
    const route=routeForLearner(learner);
    if(continueAfter&&route.destination)global.location.assign(route.destination);
    return route;
  }

  function familySnapshot(){
    const r=registry(),family=r?.getFamily?.()||null,learner=r?.getLearner?.()||null;
    return Object.freeze({version:VERSION,hasRegistry:Boolean(r),family,learner,learnerContext:context()?.snapshot?.()||null,route:routeForLearner(learner)});
  }

  function attachVerificationDoorway(){
    const cards=[...document.querySelectorAll(".service")];
    const records=cards.find(card=>card.querySelector("h3")?.textContent.trim()==="Records & Reports");
    if(!records||records.querySelector('[data-academy-verify]'))return;
    const link=document.createElement("a");
    link.href="./verify/";
    link.dataset.academyVerify="true";
    link.textContent="Verify Signed Record →";
    records.appendChild(link);
  }

  global.KhaemenesFrontDoorRouter=Object.freeze({version:VERSION,activeLearner,identifiedStudentDestination,routeForLearner,continueLearner,switchLearner,familySnapshot});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachVerificationDoorway,{once:true});
  else attachVerificationDoorway();
  global.dispatchEvent(new CustomEvent("khaemenes-front-door-router-ready",{detail:{version:VERSION}}));
})(window);
