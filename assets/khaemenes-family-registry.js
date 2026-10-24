(function attachKhaemenesFamilyRegistry(global){
  "use strict";

  const VERSION="1.3.2";
  const ARCHAEMENES_ID="archaemenes";
  const KEYS=Object.freeze({
    registry:"khaemenes_family_registry_v1",
    activeFamily:"khaemenes_active_family_v1",
    activeAdult:"khaemenes_active_adult_v1",
    activeLearner:"khaemenes_active_learner_v1",
    audit:"khaemenes_family_audit_v1",
    legacyPreschool:"khaemenes_preschool_profile_v1",
    legacyContinuity:"khaemenes_learning_continuity_v1",
    legacyParentGuide:"khaemenes_parent_mentor_v1"
  });

  const STAGES=Object.freeze(["preschool","kindergarten","elementary","middle","high","higher"]);
  const GRADES=Object.freeze(["pre-k","k","01","02","03","04","05","06","07","08","09","10","11","12"]);
  const ADULT_ROLES=Object.freeze(["parent","guardian","caregiver","educator","other-authorized-adult"]);
  const LEGACY_MENTOR_STYLE=Object.freeze({pip:"playful",miri:"curious",nova:"imaginative",sage:"steady"});
  const VALID_MENTOR_STYLES=new Set(["playful","curious","imaginative","steady"]);

  const GRADE_META=Object.freeze({
    "pre-k":Object.freeze({grade:"pre-k",label:"Pre-K",stage:"preschool",school:"Khaemenes Preschool"}),
    "k":Object.freeze({grade:"k",label:"Kindergarten",stage:"kindergarten",school:"Khaemenes Kinder Garden"}),
    "01":Object.freeze({grade:"01",label:"Grade 01",stage:"elementary",school:"Khaemenes Elementary"}),
    "02":Object.freeze({grade:"02",label:"Grade 02",stage:"elementary",school:"Khaemenes Elementary"}),
    "03":Object.freeze({grade:"03",label:"Grade 03",stage:"elementary",school:"Khaemenes Elementary"}),
    "04":Object.freeze({grade:"04",label:"Grade 04",stage:"elementary",school:"Khaemenes Elementary"}),
    "05":Object.freeze({grade:"05",label:"Grade 05",stage:"elementary",school:"Khaemenes Elementary"}),
    "06":Object.freeze({grade:"06",label:"Grade 06",stage:"middle",school:"Khaemenes Middle School"}),
    "07":Object.freeze({grade:"07",label:"Grade 07",stage:"middle",school:"Khaemenes Middle School"}),
    "08":Object.freeze({grade:"08",label:"Grade 08",stage:"middle",school:"Khaemenes Middle School"}),
    "09":Object.freeze({grade:"09",label:"Grade 09",stage:"high",school:"Khaemenes High School"}),
    "10":Object.freeze({grade:"10",label:"Grade 10",stage:"high",school:"Khaemenes High School"}),
    "11":Object.freeze({grade:"11",label:"Grade 11",stage:"high",school:"Khaemenes High School"}),
    "12":Object.freeze({grade:"12",label:"Grade 12",stage:"high",school:"Khaemenes High School"})
  });

  const PERMISSION_PRESETS=Object.freeze({
    "co-guardian":Object.freeze({label:"Co-parent / guardian",permissions:Object.freeze(["learner.view","progress.view","records.export","mentor.view","mentor.manage","education.manage","profile.manage","adult.invite"])}),
    "progress-viewer":Object.freeze({label:"Progress viewer",permissions:Object.freeze(["learner.view","progress.view","mentor.view"])}),
    "educator":Object.freeze({label:"Educator",permissions:Object.freeze(["learner.view","progress.view","mentor.view","education.manage"])}),
    "self-scholar":Object.freeze({label:"Adult self-directed scholar",permissions:Object.freeze(["learner.view","progress.view","records.export","mentor.view","mentor.manage","education.manage","profile.manage"])})
  });

  function now(){return new Date().toISOString()}
  function id(prefix){return `${prefix}_${global.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(16).slice(2)}`}`}
  function clone(value){return JSON.parse(JSON.stringify(value))}
  function clean(value,max=120){return String(value??"").trim().slice(0,max)}
  function arr(value,max=100){return Array.isArray(value)?value.slice(0,max).map(v=>clean(v,120)).filter(Boolean):[]}
  function readJSON(key,fallback){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}

  function normalizeStage(value){
    const stage=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");
    if(["pre-k","prek","creche","crèche"].includes(stage))return "preschool";
    if(["k","kinder","kinder-garden"].includes(stage))return "kindergarten";
    if(stage.startsWith("elementary"))return "elementary";
    if(stage.startsWith("middle"))return "middle";
    if(stage.startsWith("high")&&!stage.startsWith("higher"))return "high";
    if(["higher","higher-learning","college","university","adult-learning","adult"].includes(stage))return "higher";
    return STAGES.includes(stage)?stage:null;
  }

  function normalizeGrade(value){
    const raw=clean(value,30).toLowerCase().replace(/grade|gr\.?/g,"").replace(/[_\s]+/g,"-").trim();
    if(!raw)return null;
    if(["pre-k","prek","pk","preschool"].includes(raw))return "pre-k";
    if(["k","kg","kindergarten","kinder","kinder-garden"].includes(raw))return "k";
    const n=Number(raw.replace(/[^0-9]/g,""));
    if(Number.isInteger(n)&&n>=1&&n<=12)return String(n).padStart(2,"0");
    return null;
  }

  function stageForGrade(grade){const g=normalizeGrade(grade);return g&&GRADE_META[g]?GRADE_META[g].stage:null}
  function gradeMeta(grade){const g=normalizeGrade(grade);return g&&GRADE_META[g]?clone(GRADE_META[g]):null}
  function gradeAllowedForStage(grade,stage){const g=normalizeGrade(grade),s=normalizeStage(stage);return Boolean(g&&s&&GRADE_META[g]?.stage===s)}

  function canonicalPlacement({stage=null,grade=null}={}){
    const g=normalizeGrade(grade);
    const derived=g?stageForGrade(g):null;
    const s=normalizeStage(stage)||derived||"preschool";
    if(g&&derived!==s)return Object.freeze({stage:derived,grade:g,corrected:true,reason:"grade-controls-stage"});
    return Object.freeze({stage:s,grade:g&&GRADE_META[g]?.stage===s?g:null,corrected:false,reason:"canonical"});
  }

  function destinationFor({stage=null,grade=null}={}){
    const placement=canonicalPlacement({stage,grade});
    const base="https://vervenveda.com";
    const routes={
      preschool:`${base}/Khaemenes_Preschool.github.io/`,
      kindergarten:`${base}/Khaemenes_KinderGarden.github.io/`,
      elementary:`${base}/Khaemenes_Elementary.github.io/`,
      middle:`${base}/Khaemenes_Middle.github.io/`,
      high:`${base}/Khaemenes_High.github.io/`,
      higher:`${base}/Khaemenes_Higher_Learning.github.io/start/`
    };
    let url=routes[placement.stage]||`${base}/Khaemenes_Academy.github.io/`;
    if(placement.grade&&/^\d{2}$/.test(placement.grade)){
      const q=`khaemenesGrade=grade-${placement.grade}`;
      url+=`${url.includes("?")?"&":"?"}${q}#grades`;
    }
    const label=placement.grade?GRADE_META[placement.grade].label:(placement.stage==="higher"?"Higher Learning":placement.stage);
    return Object.freeze({stage:placement.stage,grade:placement.grade,url,label});
  }

  function mentorExpression(stage){
    const s=normalizeStage(stage);
    if(s==="preschool"||s==="kindergarten")return "wise-owl";
    if(s==="higher")return "scholar";
    return "academy-mentor";
  }

  function normalizeMentorStyle(value){const style=clean(value,40).toLowerCase();return VALID_MENTOR_STYLES.has(style)?style:null}

  function canonicalMentorIdentity(raw={},stage=null){
    const prior=raw?.mentorIdentity&&typeof raw.mentorIdentity==="object"?raw.mentorIdentity:{};
    const priorMentorId=clean(raw?.mentorId,80);
    const baseStyle=normalizeMentorStyle(prior.communicationStyle)||normalizeMentorStyle(prior.baseStyle)||LEGACY_MENTOR_STYLE[priorMentorId.toLowerCase()]||null;
    const {
      id:_legacyId,
      mentorId:_legacyMentorField,
      name:legacyName,
      title:legacyTitle,
      avatar:legacyAvatar,
      colors:legacyColors,
      mode:legacyMode,
      expression:_legacyExpression,
      ...safePrior
    }=prior;
    const presentationPreference={
      ...(safePrior.presentationPreference&&typeof safePrior.presentationPreference==="object"?safePrior.presentationPreference:{}),
      ...(legacyName?{legacyCustomName:clean(legacyName,40)}:{}),
      ...(legacyTitle?{legacyTitle:clean(legacyTitle,80)}:{}),
      ...(legacyAvatar?{legacyAvatar:clean(legacyAvatar,12)}:{}),
      ...(Array.isArray(legacyColors)&&legacyColors.length===2?{legacyColors:[...legacyColors]}:{})
    };
    delete safePrior.presentationPreference;
    const identity={
      ...safePrior,
      mode:"archaemenes",
      mentorId:ARCHAEMENES_ID,
      expression:mentorExpression(stage),
      ...(baseStyle?{baseStyle,communicationStyle:baseStyle}:{}),
      ...(Object.keys(presentationPreference).length?{presentationPreference}:{})
    };
    if(priorMentorId&&priorMentorId.toLowerCase()!==ARCHAEMENES_ID)identity.legacyMentorId=priorMentorId;
    if(legacyMode&&legacyMode!=="archaemenes")identity.legacyMode=clean(legacyMode,40);
    return identity;
  }

  function emptyRegistry(){return {version:VERSION,families:{},adults:{},learners:{},memberships:{},learnerAdultAccess:{},createdAt:now(),updatedAt:now()}}

  function normalizeLearner(raw={}){
    const placement=canonicalPlacement({stage:raw.stage,grade:raw.grade});
    return {...raw,stage:placement.stage,grade:placement.grade||null,mentorId:ARCHAEMENES_ID,mentorIdentity:canonicalMentorIdentity(raw,placement.stage)};
  }

  function normalizeRegistry(raw){
    const r=raw&&typeof raw==="object"?raw:{};
    const learners={};
    for(const [key,value] of Object.entries(r.learners&&typeof r.learners==="object"?r.learners:{}))learners[key]=normalizeLearner(value);
    return {version:VERSION,families:r.families&&typeof r.families==="object"?r.families:{},adults:r.adults&&typeof r.adults==="object"?r.adults:{},learners,memberships:r.memberships&&typeof r.memberships==="object"?r.memberships:{},learnerAdultAccess:r.learnerAdultAccess&&typeof r.learnerAdultAccess==="object"?r.learnerAdultAccess:{},createdAt:r.createdAt||now(),updatedAt:r.updatedAt||now()};
  }

  function load(){return normalizeRegistry(readJSON(KEYS.registry,emptyRegistry()))}
  function save(registry){const r=normalizeRegistry(registry);r.updatedAt=now();writeJSON(KEYS.registry,r);return clone(r)}
  function audit(action,details={}){const entries=readJSON(KEYS.audit,[]);entries.push({at:now(),action:clean(action,80),details:clone(details)});writeJSON(KEYS.audit,entries.slice(-300))}

  function activeIds(){return {familyId:readJSON(KEYS.activeFamily,null),adultId:readJSON(KEYS.activeAdult,null),learnerId:readJSON(KEYS.activeLearner,null)}}
  function setActive({familyId=null,adultId=null,learnerId=null}={}){if(familyId)writeJSON(KEYS.activeFamily,familyId);if(adultId)writeJSON(KEYS.activeAdult,adultId);if(learnerId)writeJSON(KEYS.activeLearner,learnerId);global.dispatchEvent(new CustomEvent("khaemenes-family-changed",{detail:activeIds()}));return activeIds()}

  function createFamily({displayName="",adultName="",adultRole="parent"}={}){
    const registry=load(),familyId=id("fam"),adultId=id("adult");
    registry.families[familyId]={familyId,displayName:clean(displayName,80)||"My Khaemenes Family",adultIds:[adultId],learnerIds:[],createdAt:now(),updatedAt:now()};
    registry.adults[adultId]={adultId,displayName:clean(adultName,80)||"Parent / Guardian",role:ADULT_ROLES.includes(adultRole)?adultRole:"other-authorized-adult",familyIds:[familyId],familyGuidePreference:clean(readJSON(KEYS.legacyParentGuide,""),80)||"supportive",accountState:"local-profile",createdAt:now(),updatedAt:now()};
    registry.memberships[`${familyId}:${adultId}`]={familyId,adultId,status:"active",role:registry.adults[adultId].role,joinedAt:now()};
    save(registry);setActive({familyId,adultId});audit("family.created",{familyId,adultId});return {familyId,adultId};
  }

  function addAdultLocal({familyId,displayName,role="parent",permissionPreset="co-guardian",learnerIds=[]}={}){
    const registry=load();if(!registry.families[familyId])throw new Error("family-not-found");
    const adultId=id("adult");
    registry.adults[adultId]={adultId,displayName:clean(displayName,80)||"Authorized Adult",role:ADULT_ROLES.includes(role)?role:"other-authorized-adult",familyIds:[familyId],familyGuidePreference:"supportive",accountState:"local-profile",createdAt:now(),updatedAt:now()};
    registry.families[familyId].adultIds=[...new Set([...(registry.families[familyId].adultIds||[]),adultId])];
    registry.memberships[`${familyId}:${adultId}`]={familyId,adultId,status:"active",role:registry.adults[adultId].role,joinedAt:now()};
    for(const learnerId of learnerIds)grantAdultAccess({registry,familyId,adultId,learnerId,permissionPreset,saveAfter:false});
    save(registry);audit("adult.added-local",{familyId,adultId,learnerIds:[...learnerIds]});return clone(registry.adults[adultId]);
  }

  function registerLearner({familyId,nickname,stage="preschool",grade=null,ageBand="",interests=[],mentorId=null,mentorIdentity=null,guardianRelease=null,existingLearnerId=null,linkedAdultId=null,selfDirectedAdult=false}={}){
    const registry=load();if(!registry.families[familyId])throw new Error("family-not-found");
    const learnerId=existingLearnerId||id("learner"),accountId=id("learneracct"),prior=registry.learners[learnerId]||{},placement=canonicalPlacement({stage,grade});
    registry.learners[learnerId]={...prior,learnerId,accountId:prior.accountId||accountId,familyId,nickname:clean(nickname,40)||"Learner",stage:placement.stage,grade:placement.grade,ageBand:clean(ageBand,30),interests:arr(interests,30),mentorId:mentorId||prior.mentorId||ARCHAEMENES_ID,mentorIdentity:mentorIdentity?clone(mentorIdentity):(prior.mentorIdentity||null),guardianRelease:guardianRelease?clone(guardianRelease):(prior.guardianRelease||null),linkedAdultId:linkedAdultId||prior.linkedAdultId||null,selfDirectedAdult:Boolean(selfDirectedAdult||prior.selfDirectedAdult),accountState:prior.accountState||(selfDirectedAdult?"local-self-managed":"local-parent-managed"),createdAt:prior.createdAt||now(),updatedAt:now()};
    registry.families[familyId].learnerIds=[...new Set([...(registry.families[familyId].learnerIds||[]),learnerId])];
    save(registry);setActive({familyId,learnerId});audit("learner.registered",{familyId,learnerId,stage:placement.stage,grade:placement.grade,selfDirectedAdult:Boolean(selfDirectedAdult),mentorId:ARCHAEMENES_ID});return getLearner(learnerId);
  }

  function registerAdultLearner({adultId=activeIds().adultId,familyId=activeIds().familyId,nickname="",interests=[]}={}){
    const registry=load();
    const adult=registry.adults[adultId];if(!adult)throw new Error("adult-not-found");
    familyId=familyId||(adult.familyIds||[])[0]||null;if(!familyId||!registry.families[familyId])throw new Error("family-not-found");
    const existing=Object.values(registry.learners).find(l=>l?.linkedAdultId===adultId&&l?.selfDirectedAdult===true&&l?.stage==="higher");
    if(existing){setActive({familyId,adultId,learnerId:existing.learnerId});return getLearner(existing.learnerId)}
    const learner=registerLearner({familyId,nickname:clean(nickname,40)||adult.displayName||"Adult Scholar",stage:"higher",grade:null,ageBand:"adult",interests,linkedAdultId:adultId,selfDirectedAdult:true});
    grantAdultAccess({familyId,adultId,learnerId:learner.learnerId,permissionPreset:"self-scholar"});
    setActive({familyId,adultId,learnerId:learner.learnerId});audit("adult.self-learning-registered",{familyId,adultId,learnerId:learner.learnerId,stage:"higher"});return getLearner(learner.learnerId);
  }

  function getAdultLearner(adultId=activeIds().adultId){const registry=load();const learner=Object.values(registry.learners).find(l=>l?.linkedAdultId===adultId&&l?.selfDirectedAdult===true);return learner?clone(learner):null}

  function grantAdultAccess({registry=null,familyId,adultId,learnerId,permissionPreset="co-guardian",permissions=null,saveAfter=true}={}){
    const r=registry||load();if(!r.families[familyId])throw new Error("family-not-found");if(!r.adults[adultId])throw new Error("adult-not-found");if(!r.learners[learnerId])throw new Error("learner-not-found");
    const preset=PERMISSION_PRESETS[permissionPreset]||PERMISSION_PRESETS["progress-viewer"];
    r.learnerAdultAccess[`${learnerId}:${adultId}`]={familyId,adultId,learnerId,permissionPreset:PERMISSION_PRESETS[permissionPreset]?permissionPreset:"custom",permissions:Array.isArray(permissions)?arr(permissions,30):[...preset.permissions],status:"active",grantedAt:now(),updatedAt:now()};
    if(saveAfter)save(r);audit("access.granted",{familyId,adultId,learnerId,permissionPreset});return clone(r.learnerAdultAccess[`${learnerId}:${adultId}`]);
  }

  function revokeAdultAccess({adultId,learnerId}={}){const registry=load(),key=`${learnerId}:${adultId}`;if(!registry.learnerAdultAccess[key])return false;registry.learnerAdultAccess[key]={...registry.learnerAdultAccess[key],status:"revoked",revokedAt:now(),updatedAt:now()};save(registry);audit("access.revoked",{adultId,learnerId});return true}
  function canAdult(adultId,learnerId,permission){const access=load().learnerAdultAccess[`${learnerId}:${adultId}`];return Boolean(access&&access.status==="active"&&Array.isArray(access.permissions)&&access.permissions.includes(permission))}
  function getFamily(familyId=activeIds().familyId){const registry=load(),family=registry.families[familyId];if(!family)return null;return {...clone(family),adults:(family.adultIds||[]).map(id=>registry.adults[id]).filter(Boolean).map(clone),learners:(family.learnerIds||[]).map(id=>registry.learners[id]).filter(Boolean).map(clone)}}
  function getAdult(adultId=activeIds().adultId){const adult=load().adults[adultId];return adult?clone(adult):null}
  function getLearner(learnerId=activeIds().learnerId){const learner=load().learners[learnerId];return learner?clone(learner):null}
  function adultAccessForLearner(learnerId){const registry=load();return Object.values(registry.learnerAdultAccess).filter(a=>a.learnerId===learnerId&&a.status==="active").map(a=>({...clone(a),adult:registry.adults[a.adultId]?clone(registry.adults[a.adultId]):null}))}

  const KINDER_RELEASE_VERSION="kindergarten-guardian-release-v1.0";
  const KINDER_RELEASE_FIELDS=Object.freeze(["authority","educationalTools","supervision","mentorBoundaries","respectfulUse","voluntaryLimits","localPrivacy"]);
  function kindergartenConsentActor(registry,learnerId,adultId=activeIds().adultId){
    const learner=registry.learners[learnerId],adult=registry.adults[adultId];
    if(!learner||!adult)throw new Error("guardian-actor-or-learner-missing");
    if(learner.familyId===undefined||!adult.familyIds?.includes(learner.familyId))throw new Error("guardian-family-mismatch");
    if(!["parent","guardian","caregiver","educator"].includes(adult.role))throw new Error("guardian-role-not-authorized");
    if(!canAdult(adultId,learnerId,"education.manage"))throw new Error("guardian-education-permission-required");
    return {learner,adult};
  }
  function authorizeKindergartenLearner({learnerId,adultId=activeIds().adultId,acknowledgments={}}={}){
    const registry=load(),{learner,adult}=kindergartenConsentActor(registry,learnerId,adultId);
    if(learner.stage!=="kindergarten"||learner.grade!=="k")throw new Error("learner-not-kindergarten");
    if(!KINDER_RELEASE_FIELDS.every(field=>acknowledgments?.[field]===true))throw new Error("guardian-acknowledgments-incomplete");
    const release={
      accepted:true,learnerId,version:KINDER_RELEASE_VERSION,acceptedAt:now(),
      adultId:adult.adultId,adultRole:adult.role,scope:"kindergarten-formal-learning",
      acknowledgments:Object.fromEntries(KINDER_RELEASE_FIELDS.map(field=>[field,true]))
    };
    registry.learners[learnerId]={...learner,guardianRelease:release,updatedAt:now()};
    save(registry);
    audit("kindergarten.guardian-release.accepted",{learnerId,adultId:adult.adultId,version:KINDER_RELEASE_VERSION});
    global.dispatchEvent(new CustomEvent("khaemenes-guardian-release-changed",{detail:{learnerId,accepted:true}}));
    return getLearner(learnerId);
  }
  function revokeKindergartenAuthorization({learnerId,adultId=activeIds().adultId}={}){
    const registry=load(),{learner,adult}=kindergartenConsentActor(registry,learnerId,adultId);
    if(learner.stage!=="kindergarten"||learner.grade!=="k")throw new Error("learner-not-kindergarten");
    registry.learners[learnerId]={...learner,
      guardianRelease:{...(learner.guardianRelease||{}),accepted:false,revokedAt:now(),revokedByAdultId:adult.adultId},
      updatedAt:now()};
    save(registry);
    audit("kindergarten.guardian-release.revoked",{learnerId,adultId:adult.adultId});
    global.dispatchEvent(new CustomEvent("khaemenes-guardian-release-changed",{detail:{learnerId,accepted:false}}));
    return getLearner(learnerId);
  }

  function updateLearnerPlacement(learnerId,{stage=null,grade=null}={}){
    const registry=load(),learner=registry.learners[learnerId];if(!learner)throw new Error("learner-not-found");
    const placement=canonicalPlacement({stage:stage||learner.stage,grade:grade===undefined?learner.grade:grade});
    if(learner.stage!=="kindergarten"&&placement.stage==="kindergarten"&&learner.guardianRelease?.accepted){
      learner.previousStageGuardianRelease=clone(learner.guardianRelease);
      learner.guardianRelease=null;
    }
    learner.stage=placement.stage;learner.grade=placement.grade;learner.updatedAt=now();save(registry);audit("learner.placement-updated",{learnerId,stage:learner.stage,grade:learner.grade});global.dispatchEvent(new CustomEvent("khaemenes-learner-placement-changed",{detail:{learnerId,stage:learner.stage,grade:learner.grade}}));return getLearner(learnerId);
  }
  function updateLearnerStage(learnerId,stage){const s=normalizeStage(stage);if(!s)throw new Error("invalid-stage");const learner=getLearner(learnerId);if(!learner)throw new Error("learner-not-found");return updateLearnerPlacement(learnerId,{stage:s,grade:gradeAllowedForStage(learner.grade,s)?learner.grade:null})}
  function updateLearnerGrade(learnerId,grade){const g=normalizeGrade(grade);if(!g)throw new Error("invalid-grade");return updateLearnerPlacement(learnerId,{stage:stageForGrade(g),grade:g})}
  function learnerDestination(learnerOrId=activeIds().learnerId){const learner=typeof learnerOrId==="string"?getLearner(learnerOrId):learnerOrId;if(!learner)return null;return destinationFor(learner)}

  function migrateLegacyPreschool({familyId=null,adultId=null}={}){
    const legacy=readJSON(KEYS.legacyPreschool,null);if(!legacy?.learnerId)return {migrated:false,reason:"no-legacy-learner"};let ids=activeIds();if(!familyId)familyId=ids.familyId;if(!adultId)adultId=ids.adultId;
    if(!familyId){const created=createFamily({displayName:"Khaemenes Family",adultName:"Parent / Guardian",adultRole:"parent"});familyId=created.familyId;adultId=created.adultId}
    const registry=load();if(!registry.learners[legacy.learnerId])registerLearner({familyId,nickname:legacy.nickname||"Learner",stage:legacy.pathway==="kindergarten"?"kindergarten":"preschool",grade:legacy.pathway==="kindergarten"?"k":"pre-k",ageBand:legacy.ageBand||"",interests:legacy.interests||[],mentorId:legacy.mentorId||ARCHAEMENES_ID,mentorIdentity:legacy.mentorIdentity||null,guardianRelease:legacy.guardianRelease||null,existingLearnerId:legacy.learnerId});
    if(adultId&&!load().learnerAdultAccess[`${legacy.learnerId}:${adultId}`])grantAdultAccess({familyId,adultId,learnerId:legacy.learnerId,permissionPreset:"co-guardian"});
    audit("legacy.preschool-migrated",{familyId,adultId,learnerId:legacy.learnerId,mentorId:ARCHAEMENES_ID});return {migrated:true,familyId,adultId,learnerId:legacy.learnerId};
  }

  function exportFamily(familyId=activeIds().familyId){const registry=load(),family=registry.families[familyId];if(!family)throw new Error("family-not-found");const adultIds=family.adultIds||[],learnerIds=family.learnerIds||[];return {format:"khaemenes-family-export-v1.3",exportedAt:now(),family:clone(family),adults:adultIds.map(id=>registry.adults[id]).filter(Boolean).map(clone),learners:learnerIds.map(id=>registry.learners[id]).filter(Boolean).map(clone),access:Object.values(registry.learnerAdultAccess).filter(x=>adultIds.includes(x.adultId)&&learnerIds.includes(x.learnerId)).map(clone),note:"Local family/adult-learning backup. This file is not an authenticated cross-device account."}}

  function validateFamilyExport(payload){
    const errors=[];
    if(!payload||typeof payload!=="object")errors.push("backup-not-object");
    if(!/^khaemenes-family-export-v1\.[23]$/.test(String(payload?.format||"")))errors.push("unsupported-family-export-format");
    const family=payload?.family,adults=Array.isArray(payload?.adults)?payload.adults:[],learners=Array.isArray(payload?.learners)?payload.learners:[],access=Array.isArray(payload?.access)?payload.access:[];
    const familyId=clean(family?.familyId,180);
    if(!familyId)errors.push("family-id-missing");
    if(!family||typeof family!=="object")errors.push("family-record-missing");
    if(adults.length>30)errors.push("too-many-adults");
    if(learners.length>100)errors.push("too-many-learners");
    if(access.length>500)errors.push("too-many-access-records");
    const adultIds=new Set(),learnerIds=new Set();
    for(const adult of adults){
      const adultId=clean(adult?.adultId,180);
      if(!adultId)errors.push("adult-id-missing");
      else if(adultIds.has(adultId))errors.push("duplicate-adult-id");
      else adultIds.add(adultId);
      if(familyId&&Array.isArray(adult?.familyIds)&&adult.familyIds.length&&!adult.familyIds.includes(familyId))errors.push("adult-family-mismatch");
    }
    for(const learner of learners){
      const learnerId=clean(learner?.learnerId,180);
      if(!learnerId)errors.push("learner-id-missing");
      else if(learnerIds.has(learnerId))errors.push("duplicate-learner-id");
      else learnerIds.add(learnerId);
      if(familyId&&clean(learner?.familyId,180)!==familyId)errors.push("learner-family-mismatch");
      const placement=canonicalPlacement({stage:learner?.stage,grade:learner?.grade});
      if(placement.stage==="higher"&&learner?.selfDirectedAdult!==true)errors.push("higher-learner-must-be-self-directed-adult");
    }
    const familyAdultIds=arr(family?.adultIds,100);
    const familyLearnerIds=arr(family?.learnerIds,200);
    for(const id of familyAdultIds)if(!adultIds.has(id))errors.push("family-adult-reference-missing");
    for(const id of familyLearnerIds)if(!learnerIds.has(id))errors.push("family-learner-reference-missing");
    for(const record of access){
      if(clean(record?.familyId,180)!==familyId)errors.push("access-family-mismatch");
      if(!adultIds.has(clean(record?.adultId,180)))errors.push("access-adult-reference-missing");
      if(!learnerIds.has(clean(record?.learnerId,180)))errors.push("access-learner-reference-missing");
    }
    return Object.freeze({
      ok:errors.length===0,
      errors:Object.freeze([...new Set(errors)]),
      summary:Object.freeze({
        familyId,
        displayName:clean(family?.displayName,80)||"Khaemenes Family",
        adults:adultIds.size,
        learners:learnerIds.size,
        exportedAt:payload?.exportedAt||null
      })
    });
  }

  function restoreFamilyExport(payload){
    const check=validateFamilyExport(payload);
    if(!check.ok)throw new Error("invalid-family-backup:"+check.errors.join(","));
    const familyId=check.summary.familyId,registry=load(),incomingAdultIds=new Set(payload.adults.map(a=>clean(a.adultId,180))),incomingLearnerIds=new Set(payload.learners.map(l=>clean(l.learnerId,180)));
    for(const adultId of incomingAdultIds){
      const existing=registry.adults[adultId];
      if(existing&&Array.isArray(existing.familyIds)&&existing.familyIds.length&&!existing.familyIds.includes(familyId))throw new Error("adult-id-conflict");
    }
    for(const learnerId of incomingLearnerIds){
      const existing=registry.learners[learnerId];
      if(existing&&clean(existing.familyId,180)!==familyId)throw new Error("learner-id-conflict");
    }

    const priorFamily=registry.families[familyId]||null;
    const priorAdultIds=new Set(priorFamily?.adultIds||[]);
    const priorLearnerIds=new Set(priorFamily?.learnerIds||[]);
    for(const key of Object.keys(registry.memberships||{})){
      if(registry.memberships[key]?.familyId===familyId)delete registry.memberships[key];
    }
    for(const key of Object.keys(registry.learnerAdultAccess||{})){
      if(registry.learnerAdultAccess[key]?.familyId===familyId)delete registry.learnerAdultAccess[key];
    }
    for(const id of priorLearnerIds)if(!incomingLearnerIds.has(id))delete registry.learners[id];
    for(const id of priorAdultIds){
      if(incomingAdultIds.has(id))continue;
      const adult=registry.adults[id];
      if(!adult)continue;
      const remaining=(adult.familyIds||[]).filter(x=>x!==familyId);
      if(remaining.length)registry.adults[id]={...adult,familyIds:remaining,updatedAt:now()};
      else delete registry.adults[id];
    }

    const family={
      familyId,
      displayName:clean(payload.family.displayName,80)||"My Khaemenes Family",
      adultIds:[...incomingAdultIds],
      learnerIds:[...incomingLearnerIds],
      createdAt:payload.family.createdAt||now(),
      updatedAt:now()
    };
    registry.families[familyId]=family;
    for(const raw of payload.adults){
      const adultId=clean(raw.adultId,180),role=ADULT_ROLES.includes(raw.role)?raw.role:"other-authorized-adult";
      registry.adults[adultId]={
        ...clone(raw),
        adultId,
        displayName:clean(raw.displayName,80)||"Authorized Adult",
        role,
        familyIds:[...new Set([...(Array.isArray(raw.familyIds)?raw.familyIds:[]).filter(Boolean),familyId])],
        familyGuidePreference:clean(raw.familyGuidePreference,80)||"supportive",
        accountState:clean(raw.accountState,60)||"local-profile",
        createdAt:raw.createdAt||now(),
        updatedAt:now()
      };
      registry.memberships[`${familyId}:${adultId}`]={familyId,adultId,status:"active",role,joinedAt:raw.createdAt||now()};
    }
    for(const raw of payload.learners){
      const normalized=normalizeLearner({...clone(raw),familyId});
      registry.learners[normalized.learnerId]={...normalized,familyId,updatedAt:now()};
    }
    for(const raw of payload.access){
      const adultId=clean(raw.adultId,180),learnerId=clean(raw.learnerId,180);
      const preset=PERMISSION_PRESETS[raw.permissionPreset]||PERMISSION_PRESETS["progress-viewer"];
      const permissions=Array.isArray(raw.permissions)?arr(raw.permissions,30):[...preset.permissions];
      registry.learnerAdultAccess[`${learnerId}:${adultId}`]={
        familyId,adultId,learnerId,
        permissionPreset:PERMISSION_PRESETS[raw.permissionPreset]?raw.permissionPreset:"custom",
        permissions,
        status:raw.status==="revoked"?"revoked":"active",
        grantedAt:raw.grantedAt||now(),
        updatedAt:now(),
        ...(raw.revokedAt?{revokedAt:raw.revokedAt}:{})
      };
    }
    save(registry);
    const adultId=payload.adults[0]?.adultId||null,learnerId=payload.learners.find(l=>!l.selfDirectedAdult)?.learnerId||payload.learners[0]?.learnerId||null;
    setActive({familyId,adultId,learnerId});
    audit("family.restored-from-backup",{familyId,adults:payload.adults.length,learners:payload.learners.length,format:payload.format});
    return {restored:true,familyId,adultId,learnerId,summary:check.summary};
  }
  function auditLog(){return clone(readJSON(KEYS.audit,[]))}
  function status(){const registry=load(),ids=activeIds();return {version:VERSION,origin:global.location?.origin||"",recommendedSharedOrigin:/^https:\/\/vervenveda\.com$/i.test(global.location?.origin||""),families:Object.keys(registry.families).length,adults:Object.keys(registry.adults).length,learners:Object.keys(registry.learners).length,active:ids,activeLearner:getLearner(ids.learnerId),activeAdult:getAdult(ids.adultId),adultLearner:getAdultLearner(ids.adultId),mentorAuthority:"academy-archaemenes"}}

  global.KhaemenesFamilyRegistry=Object.freeze({version:VERSION,keys:KEYS,stages:STAGES,grades:GRADES,gradeMeta:GRADE_META,adultRoles:ADULT_ROLES,permissionPresets:PERMISSION_PRESETS,mentorId:ARCHAEMENES_ID,mentorAuthority:"academy-archaemenes",normalizeStage,normalizeGrade,stageForGrade,gradeAllowedForStage,canonicalPlacement,destinationFor,mentorExpression,load,save,status,activeIds,setActive,createFamily,addAdultLocal,registerLearner,registerAdultLearner,getAdultLearner,grantAdultAccess,revokeAdultAccess,canAdult,getFamily,getAdult,getLearner,adultAccessForLearner,migrateLegacyPreschool,updateLearnerStage,updateLearnerGrade,updateLearnerPlacement,authorizeKindergartenLearner,revokeKindergartenAuthorization,learnerDestination,exportFamily,validateFamilyExport,restoreFamilyExport,auditLog});

  try{
    const rawExisting=readJSON(KEYS.registry,null);
    if(!rawExisting&&readJSON(KEYS.legacyPreschool,null))migrateLegacyPreschool();
    else if(rawExisting){
      const learners=Object.values(rawExisting.learners&&typeof rawExisting.learners==="object"?rawExisting.learners:{});
      const needsMentorMigration=learners.some(learner=>learner?.mentorId!==ARCHAEMENES_ID||learner?.mentorIdentity?.mode!=="archaemenes"||learner?.mentorIdentity?.name||learner?.mentorIdentity?.avatar||learner?.mentorIdentity?.colors);
      if(rawExisting.version!==VERSION||needsMentorMigration)save(rawExisting);
    }
  }catch{}
  global.dispatchEvent(new CustomEvent("khaemenes-family-ready",{detail:status()}));
})(window);

/* Attach the public Beta Program doorway to every Academy surface that loads the canonical registry. */
(() => {
  "use strict";
  if(document.getElementById("vnvBetaProgramScript"))return;
  const script=document.createElement("script");
  script.id="vnvBetaProgramScript";
  script.src="https://vervenveda.com/assets/vnv-beta-link.js";
  script.defer=true;
  script.referrerPolicy="no-referrer";
  document.head.append(script);
})();