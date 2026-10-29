/*
 * Khaemenes Academy · Terminal 03 Readiness Adapter v1.0.0
 * ------------------------------------------------------------
 * PRIMARY / EXCLUSIVE ACADEMY TERMINAL DESIGNATION.
 * HOLD until Terminal 03 is separately commissioned and authenticated.
 * This browser-side adapter performs no network I/O and writes no STOS data.
 * It only builds bounded Academy-owned continuity envelopes on explicit call.
 * Terminal 04 has no Khaemenes Academy authority.
 */
(function attachKhaemenesTerminal03Readiness(global){
"use strict";

const VERSION="1.0.0";
const TERMINAL_ID="03";
const LIVE=false;
const TRANSPORT="unconfigured";
const SCHEMA="khaemenes-academy-terminal03-readiness-v1";

const registry=()=>global.KhaemenesFamilyRegistry||null;
const continuation=()=>global.KhaemenesLearningContinuation||null;

function clean(value,max=180){return String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim().slice(0,max)}
function placement(learner){
  const R=registry(),meta=learner?.grade&&R?.gradeMeta?.[learner.grade]?R.gradeMeta[learner.grade]:null;
  return Object.freeze({
    stage:clean(learner?.stage||"",40)||null,
    grade:clean(learner?.grade||"",20)||null,
    gradeLabel:clean(meta?.label||"",80)||null,
    school:clean(meta?.school||"",120)||null
  });
}
function courseSummary(learnerId){
  const C=continuation();
  if(!learnerId||!C?.readLearner)return[];
  try{
    return (C.readLearner(learnerId)||[]).slice(0,40).map(item=>Object.freeze({
      courseId:clean(item?.courseId||"",140),
      courseTitle:clean(item?.courseTitle||item?.courseId||"Course",160),
      subject:clean(item?.subject||item?.school||"General",100),
      status:clean(item?.status||"continue",40),
      nextTitle:clean(item?.nextTitle||item?.summary||"",220),
      mastery:item?.mastery?.best===null||item?.mastery?.best===undefined?null:Object.freeze({
        best:Math.max(0,Math.min(100,Number(item.mastery.best)||0)),
        threshold:Math.max(1,Math.min(100,Number(item.mastery.threshold)||80))
      }),
      familyNeedsAction:Boolean(item?.family?.needsAction),
      stale:Boolean(item?.stale||item?.freshness==="stale"),
      updatedAt:item?.updatedAt||null
    }));
  }catch{return[]}
}
function learnerEnvelope(learner){
  if(!learner?.learnerId)return null;
  return Object.freeze({
    learnerId:clean(learner.learnerId,160),
    familyId:clean(learner.familyId||"",160)||null,
    nickname:clean(learner.nickname||"Learner",120),
    placement:placement(learner),
    courses:Object.freeze(courseSummary(learner.learnerId)),
    authority:Object.freeze({
      identity:"academy-family-registry",
      placement:"academy-family-registry",
      courseMastery:"course-owned",
      mentor:"archaemenes-advisory-only"
    })
  });
}
function buildEnvelope(){
  const R=registry(),family=R?.getFamily?.()||null,activeAdult=R?.getAdult?.()||null,activeLearner=R?.getLearner?.()||null;
  const learners=(Array.isArray(family?.learners)?family.learners:[])
    .filter(l=>l?.learnerId)
    .map(learnerEnvelope)
    .filter(Boolean);
  return Object.freeze({
    schema:SCHEMA,
    adapterVersion:VERSION,
    terminalId:TERMINAL_ID,
    academyTerminalPrimary:true,
    academyTerminalExclusive:true,
    terminal04AcademyAuthority:false,
    generatedAt:new Date().toISOString(),
    state:"primary-academy-terminal-readiness-hold",
    live:LIVE,
    transport:TRANSPORT,
    accountStorage:Object.freeze({
      owner:"Khaemenes Academy",
      namespace:"academy",
      stosStorageSeparate:true,
      writesStosStorage:false
    }),
    active:Object.freeze({
      familyId:clean(family?.familyId||"",160)||null,
      adultId:clean(activeAdult?.adultId||"",160)||null,
      learnerId:clean(activeLearner?.learnerId||"",160)||null
    }),
    family:Object.freeze({
      familyId:clean(family?.familyId||"",160)||null,
      learnerCount:learners.length,
      adultCount:Array.isArray(family?.adults)?family.adults.length:0
    }),
    learners:Object.freeze(learners),
    privacy:Object.freeze({
      passwordsExcluded:true,
      emailsExcluded:true,
      privateLearnerReflectionsExcluded:true,
      childConversationsExcluded:true,
      assessmentResponsesExcluded:true,
      answerKeysExcluded:true,
      rawBrowserStorageExcluded:true
    }),
    authority:Object.freeze({
      changesGrades:false,
      awardsMastery:false,
      changesPlacement:false,
      changesLearnerIdentity:false,
      changesFamilyPermissions:false,
      activatesTerminal:false,
      commissionsTerminal:false
    })
  });
}
function capabilityStatus(){
  return Object.freeze({
    schema:SCHEMA,
    adapterVersion:VERSION,
    terminalId:TERMINAL_ID,
    academyTerminalPrimary:true,
    academyTerminalExclusive:true,
    terminal04AcademyAuthority:false,
    live:LIVE,
    commissioned:false,
    transport:TRANSPORT,
    canBuildEnvelope:true,
    canTransmit:false,
    canActivate:false,
    networkIO:false,
    stosStorageWrites:false,
    academyStorageSeparate:true
  });
}
function requestHandoff(){
  return Object.freeze({
    ok:false,
    reason:"terminal03-not-commissioned",
    status:capabilityStatus(),
    envelope:buildEnvelope()
  });
}

global.KhaemenesTerminal03Readiness=Object.freeze({
  version:VERSION,
  terminalId:TERMINAL_ID,
  live:LIVE,
  transport:TRANSPORT,
  status:capabilityStatus,
  buildEnvelope,
  learnerEnvelope,
  requestHandoff
});

global.dispatchEvent(new CustomEvent("khaemenes-terminal03-readiness",{
  detail:Object.freeze({
    terminalId:TERMINAL_ID,
    academyTerminalPrimary:true,
    academyTerminalExclusive:true,
    live:false,
    transport:"unconfigured",
    canTransmit:false
  })
}));
})(window);
