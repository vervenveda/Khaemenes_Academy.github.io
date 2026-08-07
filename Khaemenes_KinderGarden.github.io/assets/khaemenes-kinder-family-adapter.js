(function attachKinderFamilyAdapter(global){
  "use strict";

  function wait(attempt=0){
    const family=global.KhaemenesFamilyRegistry;
    if(!family){
      if(attempt<80) setTimeout(()=>wait(attempt+1),50);
      return;
    }

    try{
      family.migrateLegacyPreschool();
    }catch{}

    const learner=family.getLearner();
    if(!learner) return;

    // Preserve compatibility with the existing Preschool/Kinder mentor layer.
    let legacy=null;
    try{
      legacy=JSON.parse(localStorage.getItem("khaemenes_preschool_profile_v1")||"null");
    }catch{}

    if(legacy){
      const merged={
        ...legacy,
        learnerId:learner.learnerId,
        nickname:learner.nickname || legacy.nickname,
        pathway:"kindergarten",
        ageBand:learner.ageBand || legacy.ageBand,
        interests:Array.isArray(learner.interests)&&learner.interests.length
          ? learner.interests
          : (legacy.interests||[]),
        mentorId:learner.mentorId || legacy.mentorId,
        mentorIdentity:learner.mentorIdentity || legacy.mentorIdentity,
        guardianRelease:learner.guardianRelease || legacy.guardianRelease,
        updatedAt:new Date().toISOString()
      };
      localStorage.setItem("khaemenes_preschool_profile_v1",JSON.stringify(merged));
    }

    global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{
      detail:{learnerId:learner.learnerId,familyId:learner.familyId}
    }));
  }

  wait();
})(window);
