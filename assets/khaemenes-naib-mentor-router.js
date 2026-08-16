/*
 * Khaemenes Academy · NAIB Delegation Router v2.0.0-transition
 * ------------------------------------------------------------
 * Public/static delegation seam for the Academy ecosystem.
 *
 * NAIB is the front-desk administrator / AI Resources Director.
 * NAIB receives a bounded visitor context, identifies the appropriate
 * destination, and delegates the visitor to a platform, resource, or
 * specialist AI. Destination platforms retain authority for their own
 * content, mentoring, records, and services.
 *
 * Compatibility note:
 * This file keeps the historical filename and assignMentor/requestMentor
 * methods while downstream school repositories migrate to delegate().
 */
(function attachKhaemenesNAIB(global){
  "use strict";

  const VERSION="2.0.0-transition";
  const MAX_TEXT=160;
  const MAX_LIST=12;

  const URLS=Object.freeze({
    academy:"https://vervenveda.com/Khaemenes_Academy.github.io/",
    family:"https://vervenveda.com/Khaemenes_Academy.github.io/family/",
    preschool:"https://vervenveda.com/Khaemenes_Preschool.github.io/",
    kindergarten:"https://vervenveda.com/Khaemenes_KinderGarden.github.io/",
    elementary:"https://vervenveda.com/Khaemenes_Elementary.github.io/",
    middle:"https://vervenveda.com/Khaemenes_Middle.github.io/",
    high:"https://vervenveda.com/Khaemenes_High.github.io/",
    higherLearning:"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/",
    linguistics:"https://vervenveda.com/Khaemenes_Linguistics.github.io/",
    refrain:"https://vervenveda.com/the_refrain.github.io/",
    arcade:"https://vervenveda.com/arcade.github.io/",
    arshif:"https://vervenveda.com/Arshif.github.io/",
    verifier:"https://vervenveda.com/theverifier.github.io/",
    search:"https://vervenveda.com/PLERASearch.github.io/",
    solanar:"https://vervenveda.com/solanar.github.io/",
    civic:"https://vervenveda.com/onenationforall.github.io/",
    law:"https://vervenveda.com/firmament.github.io/",
    riverToRoad:"https://vervenveda.com/river_to_road.github.io/",
    communications:"https://vervenveda.com/333.github.io/",
    art:"https://vervenveda.com/bazaarart.github.io/",
    professional:"https://vervenveda.com/proresource_hub.github.io/",
    health:"https://vervenveda.com/medicament-hub.github.io/"
  });

  const SPECIALISTS=Object.freeze({
    archaemenes:Object.freeze({
      id:"archaemenes",
      name:"Archaemenes",
      title:"Scholar of Khaemenes Academy",
      avatar:"🦉",
      domain:"academy-education",
      platform:"khaemenes-academy",
      principles:Object.freeze([
        "clue-first",
        "age-adaptive",
        "encourage-effort",
        "do-not-award-mastery",
        "bounded-young-learner-interaction"
      ])
    }),
    moirai:Object.freeze({
      id:"moirai",
      name:"MoirAI",
      title:"Music Mentor",
      domain:"music",
      platform:"the-refrain"
    }),
    eiren:Object.freeze({
      id:"eiren",
      name:"Eiren",
      title:"Language Arts & Literary Mentor",
      domain:"language-arts-literature",
      platform:"literary-learning"
    })
  });

  const PRESENTATIONS=Object.freeze({
    nestling:Object.freeze({
      mode:"nestling",
      colors:Object.freeze(["#48baf0","#ffd65a"]),
      intro:"I am Archaemenes the Owl. We can learn with stories, pictures, movement, and one little step at a time."
    }),
    storybook:Object.freeze({
      mode:"storybook",
      colors:Object.freeze(["#48baf0","#6bd8e7"]),
      intro:"I am Archaemenes the Owl. Let’s look closely, wonder together, and choose one good next step."
    }),
    earlyScholar:Object.freeze({
      mode:"early-scholar",
      colors:Object.freeze(["#5f7fd6","#6bd8e7"]),
      intro:"I am Archaemenes. I can help with clues, questions, stories, practice, and one clear step at a time."
    }),
    youngScholar:Object.freeze({
      mode:"young-scholar",
      colors:Object.freeze(["#496b88","#7ca58f"]),
      intro:"I am Archaemenes. We will think carefully, use clues, practice ideas, and build understanding step by step."
    }),
    academyScholar:Object.freeze({
      mode:"academy-scholar",
      colors:Object.freeze(["#315b7b","#b89a61"]),
      intro:"I am Archaemenes. We can examine the evidence, organize the problem, and choose a thoughtful next step."
    })
  });

  const ACADEMY_STAGES=new Set(["preschool","kindergarten","elementary","middle","high"]);

  function clean(value,max=MAX_TEXT){
    return String(value??"")
      .replace(/[\u0000-\u001F\u007F]/g,"")
      .replace(/\s+/g," ")
      .trim()
      .slice(0,max);
  }

  function cleanList(value,max=MAX_LIST){
    return Array.isArray(value)
      ? value.slice(0,max).map(item=>clean(item,80)).filter(Boolean)
      : [];
  }

  function normalizeStage(value){
    const stage=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");
    if(["pre-k","prek","creche","crèche"].includes(stage)) return "preschool";
    if(["kinder","kinder-garden"].includes(stage)) return "kindergarten";
    if(stage.startsWith("elementary")) return "elementary";
    if(["middle-school","grades-6-8"].includes(stage)) return "middle";
    if(["high-school","grades-9-12"].includes(stage)) return "high";
    if(["higher","higher-learning","college","adult-learning"].includes(stage)) return "higher-learning";
    return stage || "unknown";
  }

  function normalizeAgeBand(value){
    return clean(value,30).toLowerCase();
  }

  function safeEmergencyNumber(value){
    const number=clean(value,32).replace(/[^0-9+*#]/g,"");
    return number.length>=2 && number.length<=24 ? number : "";
  }

  function delegationToken(category){
    try{
      if(global.crypto?.randomUUID) return `naib:${category}:${global.crypto.randomUUID()}`;
      if(global.crypto?.getRandomValues){
        const bytes=new Uint32Array(2);
        global.crypto.getRandomValues(bytes);
        return `naib:${category}:${bytes[0].toString(36)}${bytes[1].toString(36)}`;
      }
    }catch{}
    return `naib:${category}:local`;
  }

  function presentationFor({stage,ageBand}={}){
    const normalizedStage=normalizeStage(stage);
    const age=normalizeAgeBand(ageBand);
    if(normalizedStage==="preschool") return age==="2-3" ? PRESENTATIONS.nestling : PRESENTATIONS.storybook;
    if(normalizedStage==="kindergarten") return PRESENTATIONS.earlyScholar;
    if(normalizedStage==="elementary") return PRESENTATIONS.youngScholar;
    if(normalizedStage==="middle" || normalizedStage==="high") return PRESENTATIONS.academyScholar;
    return null;
  }

  function specialistPayload(id,context={}){
    const base=SPECIALISTS[id];
    if(!base) return null;
    if(id!=="archaemenes") return Object.freeze({...base});
    const presentation=presentationFor(context) || PRESENTATIONS.academyScholar;
    return Object.freeze({
      ...base,
      colors:[...presentation.colors],
      intro:presentation.intro,
      presentationMode:presentation.mode
    });
  }

  function destination({
    id,title,category,url=null,specialistId=null,reason="",priority="normal",
    requiresLocalResolution=false,stage="unknown",surface="unknown",intent=""
  }){
    return Object.freeze({
      status:"delegated",
      contractVersion:VERSION,
      delegationId:delegationToken(category),
      delegatedBy:"NAIB",
      delegationAuthority:"naib-resource-router",
      delegationMode:"public-static-transition",
      destination:Object.freeze({id,title,category,url}),
      specialist:specialistId ? specialistPayload(specialistId,{stage}) : null,
      reason:clean(reason,240),
      priority,
      requiresLocalResolution:Boolean(requiresLocalResolution),
      stage:normalizeStage(stage),
      surface:clean(surface||"unknown",100),
      intent:clean(intent,120)
    });
  }

  function textContext(context){
    return [
      context.intent,context.query,context.request,context.domain,context.topic,
      ...(Array.isArray(context.interests)?context.interests:[])
    ].map(v=>clean(v,120).toLowerCase()).filter(Boolean).join(" ");
  }

  function hasAny(text,terms){
    return terms.some(term=>text.includes(term));
  }

  function delegate(context={}){
    const safe={
      stage:normalizeStage(context.stage),
      ageBand:normalizeAgeBand(context.ageBand),
      surface:clean(context.surface,100),
      intent:clean(context.intent,120),
      interests:cleanList(context.interests),
      query:clean(context.query||context.request||context.topic,160),
      emergencyNumber:safeEmergencyNumber(context.emergencyNumber)
    };
    const text=textContext({...safe,domain:context.domain,topic:context.topic,request:context.request});

    // Immediate safety routing takes precedence over all educational/resource routing.
    if(hasAny(text,["emergency","ambulance","fire department","police emergency","immediate danger","call emergency","emergency number"])){
      const number=safe.emergencyNumber;
      return destination({
        id:"emergency-services",
        title:"Local Emergency Services",
        category:"emergency",
        url:number?`tel:${number}`:null,
        reason:number
          ?"Immediate-help intent detected. Delegate directly to the locally resolved emergency number."
          :"Immediate-help intent detected. The calling surface must resolve the visitor's local emergency number before presenting a call action.",
        priority:"immediate",
        requiresLocalResolution:!number,
        stage:safe.stage,surface:safe.surface,intent:safe.intent
      });
    }

    if(hasAny(text,["family account","family profile","parent account","guardian account","register family","sign up family"])){
      return destination({id:"family-account-hub",title:"Khaemenes Family Account Hub",category:"family-administration",url:URLS.family,reason:"Family-account or guardian administration intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["333","communication","communications","message","meeting","network hub"])){
      return destination({id:"333-network",title:"333 Communications Hub",category:"communications",url:URLS.communications,reason:"Communications or network-hub intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["game","games","arcade","puzzle","play","trivia","chess","sudoku"])){
      return destination({id:"arcade",title:"Khaemenes Arcade",category:"games-practice",url:URLS.arcade,reason:"Game, practice, puzzle, or play intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["music","song","composition","compose","instrument","rhythm","melody","refrain"])){
      return destination({id:"the-refrain",title:"The Refrain",category:"music",url:URLS.refrain,specialistId:"moirai",reason:"Music-learning or music-creation intent detected; delegate to The Refrain and MoirAI.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["literature","literary","language arts","essay","writing","poetry","reading analysis","novel","eiren"])){
      return destination({id:"literary-learning",title:"Literary & Language Arts Learning",category:"language-arts-literature",url:URLS.arshif,specialistId:"eiren",reason:"Literary, writing, or language-arts intent detected; delegate to the literary learning environment and Eiren.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["language","linguistics","translation","spanish","french","german","mandarin","japanese","polyglot"])){
      return destination({id:"linguistics",title:"Khaemenes Linguistics & Polyglot",category:"languages",url:URLS.linguistics,reason:"Language or linguistics intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["law","legal","rights","court","constitution law","firmament"])){
      return destination({id:"firmament-law",title:"Firmament Law",category:"civic-legal",url:URLS.law,reason:"Legal-information or rights-literacy intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["civic","civics","citizenship","government","public service","one nation"])){
      return destination({id:"civic-resources",title:"One Nation for All",category:"civic-resources",url:URLS.civic,reason:"Civic learning or public-resource intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["river","environment","cleanup","stewardship","pollution","community service"])){
      return destination({id:"river-to-road",title:"River to Road",category:"environmental-service",url:URLS.riverToRoad,reason:"Environmental stewardship or community-service intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["medical","medicine","health information","first aid","wellness resource","medicament"])){
      return destination({id:"medicament",title:"Medicament Hub",category:"health-resources",url:URLS.health,reason:"Health-information or wellbeing-resource intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["verify","verification","source check","fact check","current events","news evidence"])){
      return destination({id:"the-verifier",title:"The Verifier",category:"verification-research",url:URLS.verifier,reason:"Verification, source-comparison, or current-events research intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["search","find information","look up","research gateway","plera search"])){
      return destination({id:"plera-search",title:"PLERA Search",category:"search-discovery",url:URLS.search,reason:"General search or discovery intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["weather","climate","earth systems","moon","space weather","solanar"])){
      return destination({id:"solanar",title:"Solanar",category:"earth-space-science",url:URLS.solanar,reason:"Earth, climate, weather, or space-observation intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["archive","knowledge","history","philosophy","primary source","arshif","research hall"])){
      return destination({id:"arshif",title:"ARSHIF",category:"knowledge-research",url:URLS.arshif,reason:"Knowledge, archive, history, philosophy, or deep-research intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["art","drawing","painting","gallery","creative art","bazaar art"])){
      return destination({id:"bazaar-art",title:"Bazaar Art",category:"visual-arts",url:URLS.art,reason:"Visual-art or gallery intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(hasAny(text,["professional","editing","productivity","proresource","resume","work tool"])){
      return destination({id:"proresource",title:"ProResource Hub",category:"professional-tools",url:URLS.professional,reason:"Professional creation or productivity intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    if(safe.stage==="higher-learning" || hasAny(text,["higher learning","college","university","adult education","ged","career plan","degree plan"])){
      return destination({id:"higher-learning",title:"Khaemenes Higher Learning",category:"higher-learning",url:URLS.higherLearning,reason:"Adult, college, GED, career, or higher-learning intent detected.",stage:safe.stage,surface:safe.surface,intent:safe.intent});
    }

    // Academy stage routing is the default for Khaemenes school learners.
    if(ACADEMY_STAGES.has(safe.stage)){
      const stageUrls={
        preschool:URLS.preschool,
        kindergarten:URLS.kindergarten,
        elementary:URLS.elementary,
        middle:URLS.middle,
        high:URLS.high
      };
      return destination({
        id:`khaemenes-${safe.stage}`,
        title:`Khaemenes ${safe.stage==="kindergarten"?"Kinder Garden":safe.stage.charAt(0).toUpperCase()+safe.stage.slice(1)}`,
        category:"academy-education",
        url:stageUrls[safe.stage]||URLS.academy,
        specialistId:"archaemenes",
        reason:"Khaemenes school-stage context detected; delegate to the learner's Academy campus and Archaemenes.",
        stage:safe.stage,surface:safe.surface,intent:safe.intent
      });
    }

    return destination({
      id:"academy-front-desk",
      title:"Khaemenes Academy Front Desk",
      category:"general-guidance",
      url:URLS.academy,
      reason:"No narrower destination was confidently identified. Return the visitor to the Academy front desk for another bounded choice.",
      stage:safe.stage,surface:safe.surface,intent:safe.intent
    });
  }

  async function requestDelegation(context={}){
    return delegate(context);
  }

  // Backward-compatible Academy mentor seam used by current school repositories.
  function assignMentor(context={}){
    const stage=normalizeStage(context.stage);
    if(!ACADEMY_STAGES.has(stage)){
      return Object.freeze({
        status:"unassigned",
        contractVersion:VERSION,
        assignedBy:"NAIB",
        assignmentAuthority:"naib-resource-router",
        assignmentMode:"compatibility",
        stage,
        reason:"This context is not a Khaemenes Academy school stage.",
        mentor:null
      });
    }
    const delegated=delegate({...context,stage,intent:context.intent||"academy mentor"});
    const mentor=delegated.specialist?.id==="archaemenes"
      ? delegated.specialist
      : specialistPayload("archaemenes",{stage,ageBand:context.ageBand});
    return Object.freeze({
      status:"assigned",
      contractVersion:VERSION,
      assignmentId:delegated.delegationId,
      assignedBy:"NAIB",
      assignmentAuthority:"naib-resource-router",
      assignmentMode:"compatibility",
      mentorId:"archaemenes",
      specialist:"Archaemenes",
      stage,
      ageBand:normalizeAgeBand(context.ageBand),
      surface:clean(context.surface||"unknown",100),
      intent:clean(context.intent||"academy-mentor",80),
      mentor:Object.freeze({
        ...mentor,
        specialistDomain:"academy-education",
        assignedBy:"NAIB"
      })
    });
  }

  async function requestMentor(context={}){
    return assignMentor(context);
  }

  const API=Object.freeze({
    version:VERSION,
    role:"ai-resource-director",
    mode:"public-static-transition",
    delegate,
    route:delegate,
    requestDelegation,
    assignMentor,
    requestMentor,
    presentationFor,
    specialists:SPECIALISTS,
    destinations:URLS,
    currentPolicy:Object.freeze({
      family:"naib-intake-and-administration",
      academy:"archaemenes",
      music:"moirai",
      literature:"eiren",
      games:"arcade",
      knowledge:"arshif",
      communications:"333-network",
      civic:"civic-resource-routing",
      emergency:"local-emergency-resolution"
    })
  });

  Object.defineProperty(global,"KhaemenesNAIB",{
    value:API,
    enumerable:false,
    configurable:false,
    writable:false
  });

  try{
    global.dispatchEvent(new CustomEvent("khaemenes-naib-ready",{
      detail:{version:VERSION,role:API.role,mode:API.mode}
    }));
  }catch{}
})(window);
