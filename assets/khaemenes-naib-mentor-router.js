(function attachKhaemenesNAIB(global){
  "use strict";
  const VERSION="1.1.0-transition";
  const ARCHAEMENES=Object.freeze({
    id:"archaemenes",name:"Archaemenes",title:"Scholar and Educational Mentor of Khaemenes Academy",avatar:"🦉",
    specialistDomain:"learning-mentor",
    principles:Object.freeze(["clue-first","age-adaptive","encourage-effort","do-not-award-mastery","bounded-young-learner-interaction","teacher-advisory-without-grade-authority"])
  });
  const YOUNG_LEARNER_STAGES=new Set(["preschool","kindergarten","elementary"]);
  const PRESENTATIONS=Object.freeze({
    nestling:Object.freeze({mode:"nestling",colors:Object.freeze(["#48baf0","#ffd65a"]),intro:"I am Archaemenes the Owl. We can learn with stories, pictures, movement, and one little step at a time."}),
    storybook:Object.freeze({mode:"storybook",colors:Object.freeze(["#48baf0","#6bd8e7"]),intro:"I am Archaemenes the Owl. Let’s look closely, wonder together, and choose one good next step."}),
    earlyScholar:Object.freeze({mode:"early-scholar",colors:Object.freeze(["#5f7fd6","#6bd8e7"]),intro:"I am Archaemenes. I can help with clues, questions, stories, practice, and one clear step at a time."}),
    youngScholar:Object.freeze({mode:"young-scholar",colors:Object.freeze(["#496b88","#7ca58f"]),intro:"I am Archaemenes. We will think carefully, use clues, practice ideas, and build understanding step by step."}),
    faculty:Object.freeze({mode:"faculty-advisory",colors:Object.freeze(["#403b31","#d9d3c7"]),intro:"I am Archaemenes, Scholar and Educational Mentor of Khaemenes Academy. I can help review evidence, curriculum, mastery signals, and learner support while formal academic decisions remain with the responsible teacher, course, or Academy authority."})
  });
  function clean(value,max=120){return String(value??"").trim().slice(0,max)}
  function list(value,max=30){return Array.isArray(value)?value.slice(0,max).map(v=>clean(v,80)).filter(Boolean):[]}
  function normalizeStage(value){
    const stage=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");
    if(["pre-k","prek","creche","crèche"].includes(stage))return"preschool";
    if(["kinder","kinder-garden"].includes(stage))return"kindergarten";
    if(stage.startsWith("elementary"))return"elementary";
    return stage||"unknown";
  }
  function presentationFor({stage,ageBand,role,surface}={}){
    const r=clean(role,40).toLowerCase(),s=clean(surface,100).toLowerCase();
    if(r==="educator"||r==="teacher"||s.includes("teacher-admin"))return PRESENTATIONS.faculty;
    stage=normalizeStage(stage);const age=clean(ageBand,30).toLowerCase();
    if(stage==="preschool")return age==="2-3"?PRESENTATIONS.nestling:PRESENTATIONS.storybook;
    if(stage==="kindergarten")return PRESENTATIONS.earlyScholar;
    if(stage==="elementary")return PRESENTATIONS.youngScholar;
    return null;
  }
  function mentorEnvelope(context,presentation,mode){
    return Object.freeze({id:ARCHAEMENES.id,name:ARCHAEMENES.name,title:ARCHAEMENES.title,avatar:ARCHAEMENES.avatar,
      colors:[...presentation.colors],intro:presentation.intro,presentationMode:presentation.mode,
      specialistDomain:ARCHAEMENES.specialistDomain,principles:[...ARCHAEMENES.principles],assignedBy:"NAIB",assignmentMode:mode});
  }
  function buildArchaemenesAssignment(context){
    const presentation=presentationFor(context)||PRESENTATIONS.storybook;
    return Object.freeze({
      status:"assigned",contractVersion:VERSION,
      assignmentId:`naib:${clean(context.personId||context.learnerId||"local",80)}:${normalizeStage(context.stage)}`,
      assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",assignmentMode:"local-transition-policy",
      mentorId:ARCHAEMENES.id,specialist:ARCHAEMENES.name,stage:normalizeStage(context.stage),ageBand:clean(context.ageBand,30),
      surface:clean(context.surface||"unknown",100),intent:clean(context.intent||"mentor-guidance",80),interests:list(context.interests,30),
      mentor:mentorEnvelope(context,presentation,"local-transition-policy")
    });
  }
  function routeEducator(context={}){
    const presentation=PRESENTATIONS.faculty;
    return Object.freeze({
      status:"assigned",contractVersion:VERSION,
      assignmentId:`naib:educator:${clean(context.personId||"local",80)}:teacher-admin`,
      assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",assignmentMode:"teacher-advisory-routing",
      destination:"Khaemenes Academy Teacher Administration",
      destinationPath:"/Khaemenes_Academy.github.io/teacher-admin/",
      role:"educator",stage:normalizeStage(context.stage||"academy-wide"),surface:clean(context.surface||"teacher-admin",100),
      intent:clean(context.intent||"teacher-advisory",80),
      mentorId:ARCHAEMENES.id,specialist:ARCHAEMENES.name,
      mentor:mentorEnvelope(context,presentation,"teacher-advisory-routing"),
      authority:Object.freeze({awardsMastery:false,changesPlacement:false,silentlyChangesGrade:false,changesLearnerIdentity:false})
    });
  }
  function assignMentor(context={}){
    const role=clean(context.role,40).toLowerCase(),surface=clean(context.surface,100).toLowerCase();
    if(role==="educator"||role==="teacher"||surface.includes("teacher-admin"))return routeEducator(context);
    const stage=normalizeStage(context.stage);
    if(YOUNG_LEARNER_STAGES.has(stage))return buildArchaemenesAssignment({...context,stage});
    return Object.freeze({status:"unassigned",contractVersion:VERSION,assignedBy:"NAIB",assignmentAuthority:"naib-mentor-router",
      assignmentMode:"local-transition-policy",stage,reason:"No transitional learner mentor assignment policy is published for this stage yet.",mentor:null});
  }
  async function requestMentor(context={}){return assignMentor(context)}
  const API=Object.freeze({version:VERSION,role:"mentor-assignment-router",mode:"local-transition",assignMentor,requestMentor,presentationFor,routeEducator,
    currentPolicy:Object.freeze({preschool:"archaemenes",kindergarten:"archaemenes",elementary:"archaemenes",educator:"teacher-admin→archaemenes"})});
  Object.defineProperty(global,"KhaemenesNAIB",{value:API,enumerable:false,configurable:true,writable:false});
  global.dispatchEvent(new CustomEvent("khaemenes-naib-ready",{detail:{version:VERSION,role:API.role,mode:API.mode}}));
})(window);
