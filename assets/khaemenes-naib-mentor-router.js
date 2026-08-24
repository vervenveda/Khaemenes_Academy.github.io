(function attachKhaemenesNAIB(global){
  "use strict";

  const VERSION="1.4.0-lifelong";
  const ARCHAEMENES=Object.freeze({
    id:"archaemenes",
    name:"Archaemenes",
    title:"Scholar and Educational Mentor of Khaemenes Academy",
    institutionalOffice:"Principal of Khaemenes Academy",
    avatar:"🦉",
    specialistDomain:"learning-mentor",
    principles:Object.freeze([
      "clue-first",
      "age-adaptive",
      "encourage-effort",
      "learner-dignity",
      "allow-reasoned-disagreement",
      "do-not-award-mastery",
      "do-not-bypass-prerequisites",
      "do-not-reveal-locked-assessments",
      "bounded-young-learner-interaction",
      "teacher-advisory-without-grade-authority",
      "master-directory-names-are-stable"
    ])
  });

  const LEARNER_STAGES=new Set(["preschool","kindergarten","elementary","middle","high","higher"]);

  const PRESENTATIONS=Object.freeze({
    nestling:Object.freeze({mode:"nestling",colors:Object.freeze(["#48baf0","#ffd65a"]),intro:"I am Archaemenes the Owl. We can learn with stories, pictures, movement, and one little step at a time."}),
    storybook:Object.freeze({mode:"storybook",colors:Object.freeze(["#48baf0","#6bd8e7"]),intro:"I am Archaemenes the Owl. Let’s look closely, wonder together, and choose one good next step."}),
    earlyScholar:Object.freeze({mode:"early-scholar",colors:Object.freeze(["#5f7fd6","#6bd8e7"]),intro:"I am Archaemenes. I can help with clues, questions, stories, practice, and one clear step at a time."}),
    youngScholar:Object.freeze({mode:"young-scholar",colors:Object.freeze(["#496b88","#7ca58f"]),intro:"I am Archaemenes. We will think carefully, use clues, practice ideas, and build understanding step by step."}),
    middleScholar:Object.freeze({mode:"middle-scholar",colors:Object.freeze(["#35596f","#9aa86f"]),intro:"I am Archaemenes. I can help you understand the idea, diagnose where the reasoning changed, and plan the next useful step without doing scored work for you."}),
    seniorScholar:Object.freeze({mode:"senior-scholar",colors:Object.freeze(["#243d33","#b48b45"]),intro:"I am Archaemenes, Scholar and Educational Mentor of Khaemenes Academy. I can help with concepts, evidence, research, planning, and rigorous reasoning while your course remains the authority for mastery and progression."}),
    higherScholar:Object.freeze({mode:"higher-scholar",colors:Object.freeze(["#1f2937","#b48b45"]),intro:"I am Archaemenes. I can support advanced study, proofs, research, synthesis, and independent scholarship while formal course requirements remain authoritative."}),
    faculty:Object.freeze({mode:"faculty-advisory",colors:Object.freeze(["#403b31","#d9d3c7"]),intro:"I am Archaemenes, Scholar and Educational Mentor of Khaemenes Academy. I can help review evidence, curriculum, mastery signals, and learner support while formal academic decisions remain with the responsible teacher, course, or Academy authority."})
  });

  function clean(value,max=120){return String(value??"").trim().slice(0,max)}
  function list(value,max=30){return Array.isArray(value)?value.slice(0,max).map(v=>clean(v,80)).filter(Boolean):[]}
  function normalizeStage(value){const stage=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");if(["pre-k","prek","creche","crèche"].includes(stage))return"preschool";if(["k","kinder","kinder-garden"].includes(stage))return"kindergarten";if(stage.startsWith("elementary"))return"elementary";if(stage.startsWith("middle"))return"middle";if(stage.startsWith("high")&&!stage.startsWith("higher"))return"high";if(["higher","higher-learning","college","university","adult-learning","adult","continuing-learning","lifelong-learning"].includes(stage))return"higher";if(stage==="academy-wide")return"academy-wide";return stage||"unknown"}
  function normalizeGrade(value){if(global.KhaemenesFamilyRegistry?.normalizeGrade)return global.KhaemenesFamilyRegistry.normalizeGrade(value);const raw=clean(value,30).toLowerCase();if(["pre-k","prek","pk","preschool"].includes(raw))return"pre-k";if(["k","kg","kindergarten"].includes(raw))return"k";const n=Number(raw.replace(/[^0-9]/g,""));return Number.isInteger(n)&&n>=1&&n<=12?String(n).padStart(2,"0"):null}
  function stageForGrade(grade){const g=normalizeGrade(grade);if(!g)return null;if(g==="pre-k")return"preschool";if(g==="k")return"kindergarten";const n=Number(g);if(n<=5)return"elementary";if(n<=8)return"middle";return"high"}
  function presentationFor({stage,ageBand,role,surface}={}){const r=clean(role,40).toLowerCase(),s=clean(surface,100).toLowerCase();if(r==="educator"||r==="teacher"||s.includes("teacher-admin"))return PRESENTATIONS.faculty;stage=normalizeStage(stage);const age=clean(ageBand,30).toLowerCase();if(stage==="preschool")return age==="2-3"?PRESENTATIONS.nestling:PRESENTATIONS.storybook;if(stage==="kindergarten")return PRESENTATIONS.earlyScholar;if(stage==="elementary")return PRESENTATIONS.youngScholar;if(stage==="middle")return PRESENTATIONS.middleScholar;if(stage==="high")return PRESENTATIONS.seniorScholar;if(stage==="higher")return PRESENTATIONS.higherScholar;return null}
  function mentorEnvelope(context,presentation,mode){return Object.freeze({id:ARCHAEMENES.id,name:ARCHAEMENES.name,title:ARCHAEMENES.title,institutionalOffice:ARCHAEMENES.institutionalOffice,avatar:ARCHAEMENES.avatar,colors:[...presentation.colors],intro:presentation.intro,presentationMode:presentation.mode,specialistDomain:ARCHAEMENES.specialistDomain,principles:[...ARCHAEMENES.principles],assignedBy:"NAIB",assignmentMode:mode,authority:Object.freeze({awardsMastery:false,changesPlacement:false,silentlyChangesGrade:false,changesLearnerIdentity:false,bypassesPrerequisites:false,revealsLockedAssessments:false})})}
  function buildArchaemenesAssignment(context){const stage=normalizeStage(context.stage);const presentation=presentationFor({...context,stage})||PRESENTATIONS.storybook;return Object.freeze({status:"assigned",contractVersion:VERSION,assignmentId:`naib:${clean(context.personId||context.learnerId||"local",80)}:${stage}`,assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",assignmentMode:"lifelong-local-policy",mentorId:ARCHAEMENES.id,specialist:ARCHAEMENES.name,institutionalOffice:ARCHAEMENES.institutionalOffice,stage,grade:normalizeGrade(context.grade),ageBand:clean(context.ageBand,30),surface:clean(context.surface||"unknown",100),subject:clean(context.subject||context.domain||"",80),courseId:clean(context.courseId||"",100),intent:clean(context.intent||"mentor-guidance",80),interests:list(context.interests,30),mentor:mentorEnvelope(context,presentation,"lifelong-local-policy")})}
  function routeEducator(context={}){const presentation=PRESENTATIONS.faculty;return Object.freeze({status:"assigned",contractVersion:VERSION,assignmentId:`naib:educator:${clean(context.personId||"local",80)}:teacher-admin`,assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",assignmentMode:"teacher-advisory-routing",destination:"Khaemenes Academy Teacher Administration",destinationPath:"/Khaemenes_Academy.github.io/teacher-admin/",role:"educator",stage:normalizeStage(context.stage||"academy-wide"),surface:clean(context.surface||"teacher-admin",100),intent:clean(context.intent||"teacher-advisory",80),mentorId:ARCHAEMENES.id,specialist:ARCHAEMENES.name,institutionalOffice:ARCHAEMENES.institutionalOffice,mentor:mentorEnvelope(context,presentation,"teacher-advisory-routing"),authority:Object.freeze({awardsMastery:false,changesPlacement:false,silentlyChangesGrade:false,changesLearnerIdentity:false,bypassesPrerequisites:false,revealsLockedAssessments:false})})}
  function routeLearnerEntry(context={}){const registry=global.KhaemenesFamilyRegistry;const grade=normalizeGrade(context.grade),derived=grade?stageForGrade(grade):null,stage=derived||normalizeStage(context.stage);const destination=registry?.destinationFor?registry.destinationFor({stage,grade}):null;const base="https://vervenveda.com";const fallback={preschool:`${base}/Khaemenes_Preschool.github.io/`,kindergarten:`${base}/Khaemenes_KinderGarden.github.io/`,elementary:`${base}/Khaemenes_Elementary.github.io/`,middle:`${base}/Khaemenes_Middle.github.io/`,high:`${base}/Khaemenes_High.github.io/`,higher:`${base}/Khaemenes_Higher_Learning.github.io/start/`};const url=destination?.url||fallback[stage]||`${base}/Khaemenes_Academy.github.io/student/`;return Object.freeze({status:"routed",contractVersion:VERSION,assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",assignmentMode:"learner-entry-routing",learnerId:clean(context.learnerId||context.personId||"",100),stage,grade,destination:url,destinationLabel:destination?.label||grade||stage,requiresManualStageChoice:!stage||stage==="unknown",authority:Object.freeze({changesPlacement:false,changesLearnerIdentity:false,awardsMastery:false})})}
  function assignMentor(context={}){const role=clean(context.role,40).toLowerCase(),surface=clean(context.surface,100).toLowerCase();if(role==="educator"||role==="teacher"||surface.includes("teacher-admin"))return routeEducator(context);const stage=normalizeStage(context.stage);if(LEARNER_STAGES.has(stage))return buildArchaemenesAssignment({...context,stage});return Object.freeze({status:"unassigned",contractVersion:VERSION,assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",assignmentMode:"lifelong-local-policy",stage,reason:"No learner mentor assignment policy is published for this stage.",mentor:null})}
  async function requestMentor(context={}){return assignMentor(context)}
  const API=Object.freeze({version:VERSION,role:"mentor-assignment-router",mode:"lifelong-local",mentorId:ARCHAEMENES.id,institutionalOffice:ARCHAEMENES.institutionalOffice,assignMentor,requestMentor,presentationFor,routeEducator,routeLearnerEntry,currentPolicy:Object.freeze({preschool:"archaemenes",kindergarten:"archaemenes",elementary:"archaemenes",middle:"archaemenes",high:"archaemenes",higher:"archaemenes",educator:"teacher-admin→archaemenes"}),authority:Object.freeze({masteryThresholdMinimum:80,awardsMastery:false,changesPlacement:false,bypassesPrerequisites:false,revealsLockedAssessments:false})});
  Object.defineProperty(global,"KhaemenesNAIB",{value:API,enumerable:false,configurable:true,writable:false});
  global.dispatchEvent(new CustomEvent("khaemenes-naib-ready",{detail:{version:VERSION,role:API.role,mode:API.mode,mentorId:API.mentorId}}));
})(window);
