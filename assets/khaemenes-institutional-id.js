(function attachKhaemenesInstitutionalId(global){
  "use strict";

  const VERSION="1.1.0";
  const FORMAT="khaemenes-institutional-id-v1.1";
  const STUDENT_PREFIX="KA";
  const SCHOLAR_PREFIX="KS";
  const TOKEN_BYTES=10; // 80 bits of CSPRNG output for new provisional IDs.

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function now(){return new Date().toISOString()}
  function clean(v,max=120){return String(v??"").trim().slice(0,max)}
  function yearFromLearner(learner){
    const source=clean(learner?.createdAt||learner?.institutionalIdIssuedAt||now(),40);
    const y=Number(source.slice(0,4));
    return Number.isInteger(y)&&y>=2000&&y<=9999?y:new Date().getFullYear();
  }
  function cryptoReady(){return Boolean(global.isSecureContext&&global.crypto&&typeof global.crypto.getRandomValues==="function")}
  function randomToken(){
    if(!cryptoReady())throw new Error("secure-random-unavailable");
    const bytes=new Uint8Array(TOKEN_BYTES);
    global.crypto.getRandomValues(bytes);
    return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
  }
  // Accept original 40-bit provisional IDs and new 80-bit IDs so existing records remain stable.
  function validId(value){return /^(KA|KS)-\d{4}-(?:[A-F0-9]{10}|[A-F0-9]{20})$/.test(clean(value,48).toUpperCase())}
  function kindFor(learner){return learner?.selfDirectedAdult===true||learner?.stage==="higher"?"scholar":"student"}
  function prefixFor(kind){return kind==="scholar"?SCHOLAR_PREFIX:STUDENT_PREFIX}
  function usedIds(state){return new Set(Object.values(state?.learners||{}).map(l=>clean(l?.institutionalId,48).toUpperCase()).filter(Boolean))}
  function issueUnique(state,learner){
    if(!cryptoReady())throw new Error("institutional-id-issuance-requires-secure-context");
    const kind=kindFor(learner),prefix=prefixFor(kind),year=yearFromLearner(learner),used=usedIds(state);
    for(let i=0;i<16;i++){
      const value=`${prefix}-${year}-${randomToken()}`;
      if(!used.has(value))return {value,kind,year};
    }
    throw new Error("institutional-id-collision");
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
    if(!R)return Object.freeze({version:VERSION,updated:0,total:0,deferred:0});
    const before=R.load();
    const ids=Object.keys(before.learners||{});
    let updated=0,deferred=0;
    for(const learnerId of ids){
      const prior=before.learners[learnerId];
      if(!validId(prior?.institutionalId)){
        try{ensureLearner(learnerId);updated++}catch(error){
          if(String(error?.message||error).includes("secure"))deferred++;
          else throw error;
        }
      }
    }
    return Object.freeze({version:VERSION,updated,total:ids.length,deferred});
  }

  function get(learnerOrId=null){
    const R=registry();
    if(!R)return null;
    const learner=typeof learnerOrId==="string"?R.getLearner(learnerOrId):(learnerOrId||R.getLearner());
    if(!learner)return null;
    if(!validId(learner.institutionalId)){
      try{return ensureLearner(learner.learnerId)}catch{return null}
    }
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
    if(!info)return "Institutional ID pending secure issuance";
    return `${info.identifierType==="scholar"?"Scholar ID":"Student ID"}: ${info.institutionalId}`;
  }

  function status(){return Object.freeze({version:VERSION,format:FORMAT,secureContext:Boolean(global.isSecureContext),secureRandom:cryptoReady(),tokenBits:TOKEN_BYTES*8})}

  global.KhaemenesInstitutionalId=Object.freeze({version:VERSION,format:FORMAT,ensureLearner,ensureAll,get,label,validId,status});

  try{ensureAll()}catch(error){console.warn("Khaemenes institutional ID backfill deferred:",error)}
  global.dispatchEvent(new CustomEvent("khaemenes-institutional-id-ready",{detail:status()}));
})(window);
