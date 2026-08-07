(function attachKhaemenesFamilyRegistry(global){
  "use strict";

  const VERSION="1.0.0";
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

  const STAGES=Object.freeze([
    "preschool","kindergarten","elementary","middle","high"
  ]);

  const ADULT_ROLES=Object.freeze([
    "parent","guardian","caregiver","educator","other-authorized-adult"
  ]);

  const PERMISSION_PRESETS=Object.freeze({
    "co-guardian":{
      label:"Co-parent / guardian",
      permissions:[
        "learner.view",
        "progress.view",
        "records.export",
        "mentor.view",
        "mentor.manage",
        "education.manage",
        "profile.manage",
        "adult.invite"
      ]
    },
    "progress-viewer":{
      label:"Progress viewer",
      permissions:[
        "learner.view",
        "progress.view",
        "mentor.view"
      ]
    },
    "educator":{
      label:"Educator",
      permissions:[
        "learner.view",
        "progress.view",
        "mentor.view",
        "education.manage"
      ]
    }
  });

  function now(){ return new Date().toISOString(); }
  function id(prefix){
    return `${prefix}_${global.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(16).slice(2)}`}`;
  }
  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function clean(value,max=120){ return String(value ?? "").trim().slice(0,max); }
  function arr(value,max=100){
    return Array.isArray(value) ? value.slice(0,max).map(v=>clean(v,120)).filter(Boolean) : [];
  }
  function readJSON(key,fallback){
    try{
      const raw=global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch{ return fallback; }
  }
  function writeJSON(key,value){
    try{
      global.localStorage.setItem(key,JSON.stringify(value));
      return true;
    }catch{ return false; }
  }

  function emptyRegistry(){
    return {
      version:VERSION,
      families:{},
      adults:{},
      learners:{},
      memberships:{},
      learnerAdultAccess:{},
      createdAt:now(),
      updatedAt:now()
    };
  }

  function normalizeRegistry(raw){
    const r=raw && typeof raw==="object" ? raw : {};
    return {
      version:VERSION,
      families:r.families && typeof r.families==="object" ? r.families : {},
      adults:r.adults && typeof r.adults==="object" ? r.adults : {},
      learners:r.learners && typeof r.learners==="object" ? r.learners : {},
      memberships:r.memberships && typeof r.memberships==="object" ? r.memberships : {},
      learnerAdultAccess:r.learnerAdultAccess && typeof r.learnerAdultAccess==="object" ? r.learnerAdultAccess : {},
      createdAt:r.createdAt || now(),
      updatedAt:r.updatedAt || now()
    };
  }

  function load(){
    return normalizeRegistry(readJSON(KEYS.registry,emptyRegistry()));
  }

  function save(registry){
    const r=normalizeRegistry(registry);
    r.updatedAt=now();
    writeJSON(KEYS.registry,r);
    return clone(r);
  }

  function audit(action,details={}){
    const entries=readJSON(KEYS.audit,[]);
    entries.push({
      at:now(),
      action:clean(action,80),
      details:clone(details)
    });
    writeJSON(KEYS.audit,entries.slice(-300));
  }

  function activeIds(){
    return {
      familyId:readJSON(KEYS.activeFamily,null),
      adultId:readJSON(KEYS.activeAdult,null),
      learnerId:readJSON(KEYS.activeLearner,null)
    };
  }

  function setActive({familyId=null,adultId=null,learnerId=null}={}){
    if(familyId) writeJSON(KEYS.activeFamily,familyId);
    if(adultId) writeJSON(KEYS.activeAdult,adultId);
    if(learnerId) writeJSON(KEYS.activeLearner,learnerId);
    global.dispatchEvent(new CustomEvent("khaemenes-family-changed",{detail:activeIds()}));
    return activeIds();
  }

  function createFamily({displayName="",adultName="",adultRole="parent"}={}){
    const registry=load();
    const familyId=id("fam");
    const adultId=id("adult");

    registry.families[familyId]={
      familyId,
      displayName:clean(displayName,80) || "My Khaemenes Family",
      adultIds:[adultId],
      learnerIds:[],
      createdAt:now(),
      updatedAt:now()
    };

    registry.adults[adultId]={
      adultId,
      displayName:clean(adultName,80) || "Parent / Guardian",
      role:ADULT_ROLES.includes(adultRole) ? adultRole : "other-authorized-adult",
      familyIds:[familyId],
      familyGuidePreference:clean(readJSON(KEYS.legacyParentGuide,""),80) || "supportive",
      accountState:"local-profile",
      createdAt:now(),
      updatedAt:now()
    };

    registry.memberships[`${familyId}:${adultId}`]={
      familyId,adultId,
      status:"active",
      role:registry.adults[adultId].role,
      joinedAt:now()
    };

    save(registry);
    setActive({familyId,adultId});
    audit("family.created",{familyId,adultId});
    return {familyId,adultId};
  }

  function addAdultLocal({
    familyId,
    displayName,
    role="parent",
    permissionPreset="co-guardian",
    learnerIds=[]
  }={}){
    const registry=load();
    if(!registry.families[familyId]) throw new Error("family-not-found");

    const adultId=id("adult");
    registry.adults[adultId]={
      adultId,
      displayName:clean(displayName,80) || "Authorized Adult",
      role:ADULT_ROLES.includes(role) ? role : "other-authorized-adult",
      familyIds:[familyId],
      familyGuidePreference:"supportive",
      accountState:"local-profile",
      createdAt:now(),
      updatedAt:now()
    };

    registry.families[familyId].adultIds=[
      ...new Set([...(registry.families[familyId].adultIds||[]),adultId])
    ];

    registry.memberships[`${familyId}:${adultId}`]={
      familyId,adultId,status:"active",role:registry.adults[adultId].role,joinedAt:now()
    };

    for(const learnerId of learnerIds){
      grantAdultAccess({
        registry,familyId,adultId,learnerId,permissionPreset,saveAfter:false
      });
    }

    save(registry);
    audit("adult.added-local",{familyId,adultId,learnerIds:[...learnerIds]});
    return clone(registry.adults[adultId]);
  }

  function registerLearner({
    familyId,
    nickname,
    stage="preschool",
    ageBand="",
    interests=[],
    mentorId=null,
    mentorIdentity=null,
    guardianRelease=null,
    existingLearnerId=null
  }={}){
    const registry=load();
    if(!registry.families[familyId]) throw new Error("family-not-found");

    const learnerId=existingLearnerId || id("learner");
    const accountId=id("learneracct");
    const prior=registry.learners[learnerId] || {};

    registry.learners[learnerId]={
      ...prior,
      learnerId,
      accountId:prior.accountId || accountId,
      familyId,
      nickname:clean(nickname,40) || "Learner",
      stage:STAGES.includes(stage) ? stage : "preschool",
      ageBand:clean(ageBand,30),
      interests:arr(interests,30),
      mentorId:mentorId || prior.mentorId || null,
      mentorIdentity:mentorIdentity ? clone(mentorIdentity) : (prior.mentorIdentity || null),
      guardianRelease:guardianRelease ? clone(guardianRelease) : (prior.guardianRelease || null),
      accountState:prior.accountState || "local-parent-managed",
      createdAt:prior.createdAt || now(),
      updatedAt:now()
    };

    registry.families[familyId].learnerIds=[
      ...new Set([...(registry.families[familyId].learnerIds||[]),learnerId])
    ];

    save(registry);
    setActive({familyId,learnerId});
    audit("learner.registered",{familyId,learnerId,stage:registry.learners[learnerId].stage});
    return clone(registry.learners[learnerId]);
  }

  function grantAdultAccess({
    registry=null,
    familyId,
    adultId,
    learnerId,
    permissionPreset="co-guardian",
    permissions=null,
    saveAfter=true
  }={}){
    const r=registry || load();
    if(!r.families[familyId]) throw new Error("family-not-found");
    if(!r.adults[adultId]) throw new Error("adult-not-found");
    if(!r.learners[learnerId]) throw new Error("learner-not-found");

    const preset=PERMISSION_PRESETS[permissionPreset] || PERMISSION_PRESETS["progress-viewer"];
    r.learnerAdultAccess[`${learnerId}:${adultId}`]={
      familyId,adultId,learnerId,
      permissionPreset:PERMISSION_PRESETS[permissionPreset] ? permissionPreset : "custom",
      permissions:Array.isArray(permissions) ? arr(permissions,30) : [...preset.permissions],
      status:"active",
      grantedAt:now(),
      updatedAt:now()
    };

    if(saveAfter) save(r);
    audit("access.granted",{familyId,adultId,learnerId,permissionPreset});
    return clone(r.learnerAdultAccess[`${learnerId}:${adultId}`]);
  }

  function revokeAdultAccess({adultId,learnerId}={}){
    const registry=load();
    const key=`${learnerId}:${adultId}`;
    if(!registry.learnerAdultAccess[key]) return false;
    registry.learnerAdultAccess[key]={
      ...registry.learnerAdultAccess[key],
      status:"revoked",
      revokedAt:now(),
      updatedAt:now()
    };
    save(registry);
    audit("access.revoked",{adultId,learnerId});
    return true;
  }

  function canAdult(adultId,learnerId,permission){
    const access=load().learnerAdultAccess[`${learnerId}:${adultId}`];
    return Boolean(
      access &&
      access.status==="active" &&
      Array.isArray(access.permissions) &&
      access.permissions.includes(permission)
    );
  }

  function getFamily(familyId=activeIds().familyId){
    const registry=load();
    const family=registry.families[familyId];
    if(!family) return null;
    return {
      ...clone(family),
      adults:(family.adultIds||[]).map(id=>registry.adults[id]).filter(Boolean).map(clone),
      learners:(family.learnerIds||[]).map(id=>registry.learners[id]).filter(Boolean).map(clone)
    };
  }

  function getAdult(adultId=activeIds().adultId){
    const adult=load().adults[adultId];
    return adult ? clone(adult) : null;
  }

  function getLearner(learnerId=activeIds().learnerId){
    const learner=load().learners[learnerId];
    return learner ? clone(learner) : null;
  }

  function adultAccessForLearner(learnerId){
    const registry=load();
    return Object.values(registry.learnerAdultAccess)
      .filter(a=>a.learnerId===learnerId && a.status==="active")
      .map(a=>({
        ...clone(a),
        adult:registry.adults[a.adultId] ? clone(registry.adults[a.adultId]) : null
      }));
  }

  function migrateLegacyPreschool({familyId=null,adultId=null}={}){
    const legacy=readJSON(KEYS.legacyPreschool,null);
    if(!legacy?.learnerId) return {migrated:false,reason:"no-legacy-learner"};

    let ids=activeIds();
    if(!familyId) familyId=ids.familyId;
    if(!adultId) adultId=ids.adultId;

    if(!familyId){
      const created=createFamily({
        displayName:"Khaemenes Family",
        adultName:"Parent / Guardian",
        adultRole:"parent"
      });
      familyId=created.familyId;
      adultId=created.adultId;
    }

    const registry=load();
    if(!registry.learners[legacy.learnerId]){
      registerLearner({
        familyId,
        nickname:legacy.nickname || "Learner",
        stage:legacy.pathway==="kindergarten" ? "kindergarten" : "preschool",
        ageBand:legacy.ageBand || "",
        interests:legacy.interests || [],
        mentorId:legacy.mentorId || null,
        mentorIdentity:legacy.mentorIdentity || null,
        guardianRelease:legacy.guardianRelease || null,
        existingLearnerId:legacy.learnerId
      });
    }

    if(adultId && !registry.learnerAdultAccess[`${legacy.learnerId}:${adultId}`]){
      grantAdultAccess({
        familyId,adultId,learnerId:legacy.learnerId,permissionPreset:"co-guardian"
      });
    }

    audit("legacy.preschool-migrated",{familyId,adultId,learnerId:legacy.learnerId});
    return {migrated:true,familyId,adultId,learnerId:legacy.learnerId};
  }

  function updateLearnerStage(learnerId,stage){
    if(!STAGES.includes(stage)) throw new Error("invalid-stage");
    const registry=load();
    const learner=registry.learners[learnerId];
    if(!learner) throw new Error("learner-not-found");
    learner.stage=stage;
    learner.updatedAt=now();
    save(registry);
    audit("learner.stage-updated",{learnerId,stage});
    return clone(learner);
  }

  function exportFamily(familyId=activeIds().familyId){
    const registry=load();
    const family=registry.families[familyId];
    if(!family) throw new Error("family-not-found");

    const adultIds=family.adultIds||[];
    const learnerIds=family.learnerIds||[];

    return {
      format:"khaemenes-family-export-v1",
      exportedAt:now(),
      family:clone(family),
      adults:adultIds.map(id=>registry.adults[id]).filter(Boolean).map(clone),
      learners:learnerIds.map(id=>registry.learners[id]).filter(Boolean).map(clone),
      access:Object.values(registry.learnerAdultAccess)
        .filter(x=>adultIds.includes(x.adultId) && learnerIds.includes(x.learnerId))
        .map(clone),
      note:"Local family backup. This file is not an authenticated cross-device invitation."
    };
  }

  function auditLog(){
    return clone(readJSON(KEYS.audit,[]));
  }

  function status(){
    const registry=load();
    const ids=activeIds();
    return {
      version:VERSION,
      origin:global.location?.origin || "",
      recommendedSharedOrigin:/^https:\/\/vervenveda\.com$/i.test(global.location?.origin || ""),
      families:Object.keys(registry.families).length,
      adults:Object.keys(registry.adults).length,
      learners:Object.keys(registry.learners).length,
      active:ids
    };
  }

  global.KhaemenesFamilyRegistry=Object.freeze({
    version:VERSION,
    keys:KEYS,
    stages:STAGES,
    adultRoles:ADULT_ROLES,
    permissionPresets:PERMISSION_PRESETS,
    load,
    save,
    status,
    activeIds,
    setActive,
    createFamily,
    addAdultLocal,
    registerLearner,
    grantAdultAccess,
    revokeAdultAccess,
    canAdult,
    getFamily,
    getAdult,
    getLearner,
    adultAccessForLearner,
    migrateLegacyPreschool,
    updateLearnerStage,
    exportFamily,
    auditLog
  });

  // Non-destructive convenience migration.
  try{
    const existing=load();
    if(!Object.keys(existing.families).length && readJSON(KEYS.legacyPreschool,null)){
      migrateLegacyPreschool();
    }
  }catch{}

  global.dispatchEvent(new CustomEvent("khaemenes-family-ready",{detail:status()}));
})(window);
