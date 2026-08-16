(function attachKhaemenesFrontDoorRouter(global){
  "use strict";
  const VERSION="1.1.0";

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function naib(){return global.KhaemenesNAIB||null}
  function context(){return global.KhaemenesLearnerContext||null}
  function activeLearner(){return registry()?.getLearner?.()||null}

  function routeForLearner(learner=activeLearner()){
    if(!learner)return Object.freeze({status:"no-active-learner",version:VERSION,destination:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/",requiresEnrollment:true,requiresPlacement:true});
    const r=registry();
    const placement=context()?.placementFor?.(learner)||null;
    const local=r?.learnerDestination?.(learner)||r?.destinationFor?.(learner)||null;
    const n=naib()?.routeLearnerEntry?.({learnerId:learner.learnerId,stage:placement?.stage||learner.stage,grade:placement?.grade||learner.grade,surface:"academy-front-door",intent:"continue-learning"})||null;
    const grade=placement?.grade||learner.grade||null;
    const requiresPlacement=!grade;
    const destination=requiresPlacement
      ? "https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"
      : (n?.destination||local?.url||"https://vervenveda.com/Khaemenes_Academy.github.io/student/");
    return Object.freeze({
      status:requiresPlacement?"placement-required":"ready",
      version:VERSION,
      learnerId:learner.learnerId,
      nickname:learner.nickname,
      stage:placement?.stage||learner.stage,
      grade,
      gradeLabel:placement?.gradeLabel||(grade&&r?.gradeMeta?.[grade]?r.gradeMeta[grade].label:null),
      school:placement?.school||null,
      destination,
      requiresEnrollment:false,
      requiresPlacement,
      routedBy:n?.assignedBy||"Academy local fallback",
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

  global.KhaemenesFrontDoorRouter=Object.freeze({version:VERSION,activeLearner,routeForLearner,continueLearner,switchLearner,familySnapshot});
  global.dispatchEvent(new CustomEvent("khaemenes-front-door-router-ready",{detail:{version:VERSION}}));
})(window);
