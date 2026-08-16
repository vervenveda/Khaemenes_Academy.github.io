(function attachKhaemenesInstitutionalId(global){
  "use strict";

  const VERSION="1.0.0";
  const FORMAT="khaemenes-institutional-id-v1";
  const STUDENT_PREFIX="KA";
  const SCHOLAR_PREFIX="KS";

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function now(){return new Date().toISOString()}
  function clean(v,max=120){return String(v??"").trim().slice(0,max)}
  function yearFromLearner(learner){
    const source=clean(learner?.createdAt||learner?.institutionalIdIssuedAt||now(),40);
    const y=Number(source.slice(0,4));
    return Number.isInteger(y)&&y>=2000&&y<=9999?y:new Date().getFullYear();
  }
  function randomToken(){
    try{
      const bytes=new Uint8Array(5);
      global.crypto.getRandomValues(bytes);
      return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
    }catch{
      return `${Date.now().toString(16)}${Math.random().toString(16).slice(2,7)}`.slice(-10).toUpperCase();
    }
  }
  function validId(value){return /^(KA|KS)-\d{4}-[A-F0-9]{10}$/.test(clean(value,40).toUpperCase())}
  function kindFor(learner){return learner?.selfDirectedAdult===true||learner?.stage==="higher"?"scholar":"student"}
  function prefixFor(kind){return kind==="scholar"?SCHOLAR_PREFIX:STUDENT_PREFIX}
  function usedIds(state){return new Set(Object.values(state?.learners||{}).map(l=>clean(l?.institutionalId,40).toUpperCase()).filter(Boolean))}
  function issueUnique(state,learner){
    const kind=kindFor(learner),prefix=prefixFor(kind),year=yearFromLearner(learner),used=usedIds(state);
    let value="";
    for(let i=0;i<12;i++){
      value=`${prefix}-${year}-${randomToken()}`;
      if(!used.has(value))break;
    }
    if(used.has(value))throw new Error("institutional-id-collision");
    return {value,kind,year};
  }

  function ensureLearner(learnerId){
    const R=registry();
    if(!R)throw new Error("family-registry-unavailable");
    const state=R.load();
    const learner=state.learners?.[learnerId];
    if(!learner)throw new Error("learner-not-found");

    if(validId(learner.institutionalId)){
      return Object.freeze({
        learnerId,
        institutionalId:learner.institutionalId,
        identifierType:learner.identifierType||kindFor(learner),
        issuedAt:learner.institutionalIdIssuedAt||null,
        provisional:learner.institutionalIdProvisional!==false
      });
    }

    const issued=issueUnique(state,learner);
    learner.institutionalId=issued.value;
    learner.identifierType=issued.kind;
    learner.institutionalIdIssuedAt=now();
    learner.institutionalIdFormat=FORMAT;
    learner.institutionalIdProvisional=true;
    learner.updatedAt=now();
    R.save(state);

    global.dispatchEvent(new CustomEvent("khaemenes-institutional-id-issued",{detail:{
      learnerId,
      institutionalId:issued.value,
      identifierType:issued.kind,
      provisional:true
    }}));

    return Object.freeze({learnerId,institutionalId:issued.value,identifierType:issued.kind,issuedAt:learner.institutionalIdIssuedAt,provisional:true});
  }

  function ensureAll(){
    const R=registry();
    if(!R)return Object.freeze({version:VERSION,updated:0,total:0});
    const before=R.load();
    const ids=Object.keys(before.learners||{});
    let updated=0;
    for(const learnerId of ids){
      const prior=before.learners[learnerId];
      if(!validId(prior?.institutionalId)){
        ensureLearner(learnerId);
        updated++;
      }
    }
    return Object.freeze({version:VERSION,updated,total:ids.length});
  }

  function get(learnerOrId=null){
    const R=registry();
    if(!R)return null;
    const learner=typeof learnerOrId==="string"?R.getLearner(learnerOrId):(learnerOrId||R.getLearner());
    if(!learner)return null;
    if(!validId(learner.institutionalId))return ensureLearner(learner.learnerId);
    return Object.freeze({
      learnerId:learner.learnerId,
      institutionalId:learner.institutionalId,
      identifierType:learner.identifierType||kindFor(learner),
      issuedAt:learner.institutionalIdIssuedAt||null,
      provisional:learner.institutionalIdProvisional!==false
    });
  }

  function label(learnerOrId=null){
    const info=get(learnerOrId);
    if(!info)return "Institutional ID unavailable";
    return `${info.identifierType==="scholar"?"Scholar ID":"Student ID"}: ${info.institutionalId}`;
  }

  global.KhaemenesInstitutionalId=Object.freeze({version:VERSION,format:FORMAT,ensureLearner,ensureAll,get,label,validId});

  try{ensureAll()}catch(error){console.warn("Khaemenes institutional ID backfill deferred:",error)}
  global.dispatchEvent(new CustomEvent("khaemenes-institutional-id-ready",{detail:{version:VERSION,format:FORMAT}}));
})(window);
