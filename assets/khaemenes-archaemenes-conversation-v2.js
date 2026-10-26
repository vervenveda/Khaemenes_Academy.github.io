/* Archaemenes · contextual local mentor v2.0
   Reuses Storybird-style novelty scoring and AffixSix-style bounded experience,
   but evaluates a learner's actual practice answer before adapting.
   No network, grades, test items, or automatic permission escalation. */
(function(global){
  'use strict';
  // Applies ArchaemenesCore v3.2.0: clue-first teaching, learner dignity,
  // demonstrated understanding, and no independent academic authority.
  const ROOT='khaemenes_archaemenes_coaching_v2';
  const sessions=new Map();
  const byId=id=>document.getElementById(id);
  const clean=s=>String(s==null?'':s).trim().slice(0,500);
  const norm=s=>clean(s).toLowerCase().replace(/[’]/g,"'");
  function key(family,learner){return ROOT+':'+encodeURIComponent(String(family))+':'+encodeURIComponent(String(learner));}
  function read(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch{return null;}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}}
  const B={
    add:[
      {example:'1/5 + 2/5 = 3/5. The denominator stays 5 because the parts are fifths.',q:'2/7 + 3/7',a:['5/7'],hint:'Seven equal parts remain sevenths. Add 2 and 3 on top.'},
      {example:'2/9 + 4/9 = 6/9, or 2/3 when simplified.',q:'1/8 + 3/8',a:['4/8','1/2'],hint:'Both are eighths. Add the top numbers, then simplify if you wish.'},
      {example:'1/6 + 3/6 = 4/6, or 2/3.',q:'2/5 + 1/5',a:['3/5'],hint:'The pieces are still fifths; count how many you have altogether.'}
    ],
    multiply:[
      {example:'1/2 × 2/3 = 2/6 = 1/3. Multiply the numerators and the denominators.',q:'2/3 × 1/4',a:['2/12','1/6'],hint:'Multiply 2 by 1 above and 3 by 4 below.'},
      {example:'2/5 × 3/4 = 6/20 = 3/10.',q:'1/3 × 3/5',a:['3/15','1/5'],hint:'Multiply the top numbers; then multiply the bottom numbers.'}
    ],
    equations:[
      {example:'2x + 3 = 11. Subtract 3 from both sides, then divide by 2: x = 4.',q:'3x + 2 = 14. What is x?',a:['4'],hint:'First subtract 2 from 14, then divide the result by 3.'},
      {example:'4x - 5 = 15. Add 5 to both sides, then divide by 4: x = 5.',q:'2x + 5 = 13. What is x?',a:['4'],hint:'Subtract 5 from both sides; now divide by 2.'}
    ]
  };

  /* Student-release curriculum coverage. These are NEW formative examples,
     not copied exam questions or educator keys. The course engine still grades. */
  Object.assign(B,{
    energy:[
      {example:'Heat can transfer by conduction when particles interact through direct contact. A metal spoon warming in hot soup is a common example.',q:'Which is conduction? A: Sunlight warming a wall. B: A metal spoon warming by contact with hot soup. C: Warm air circulating through a room.',a:['b'],hint:'Look for heat transfer through direct contact.'},
      {example:'Convection is heat transfer by movement of a fluid, such as air or water.',q:'Which best illustrates convection? A: Warm air rises while cooler air descends. B: Light travels from a star. C: Two touching blocks exchange heat.',a:['a'],hint:'Find the moving liquid or gas carrying thermal energy.'}
    ],
    psychology:[
      {example:'A psychological hypothesis is a testable proposal about cognition or behavior, not a diagnosis of a person.',q:'Which claim can be investigated with a defined study? A: Everybody thinks the same way. B: Memory performance varies with sleep duration. C: Feelings never change.',a:['b'],hint:'Look for a measurable relationship that could be tested.'},
      {example:'Correlation by itself does not prove that one variable caused another.',q:'Which reasoning is most careful? A: Two variables move together, so one definitely caused the other. B: Ignore alternative causes. C: Investigate possible confounding factors before claiming causation.',a:['c'],hint:'Think about what other factors might explain the observed pattern.'}
    ],
    english:[
      {example:'A supported interpretation includes a claim and a detail from the text.',q:'Which is evidence for a claim about a character? A: The character is interesting. B: In the story, the character shares food with a stranger. C: This story is the best.',a:['b'],hint:'Choose the statement that describes an observable event in the text.'},
      {example:'A thesis states a defensible idea; evidence helps readers evaluate it.',q:'Which is the strongest thesis? A: My essay will discuss rivers. B: Rivers are nice. C: River access shaped where early towns developed.',a:['c'],hint:'Choose the specific claim that could be supported with historical or geographic evidence.'}
    ],
    science:[
      {example:'Observation: a plant grew 3 centimeters in a week. Inference: the available light might have helped.',q:'Which is an observation? A: The water turned cloudy. B: The chemical wanted to react. C: The sample is definitely dangerous.',a:['a'],hint:'An observation states what was measured or directly noticed.'},
      {example:'To test a claim fairly, change one variable while holding others steady.',q:'Which setup best tests whether light affects seed growth? A: Change light and soil together. B: Give identical seeds the same water but different light. C: Use unrelated plants in different rooms.',a:['b'],hint:'The groups should differ mainly in the variable you are testing.'}
    ],
    social:[
      {example:'A primary source was produced during the period being investigated, though it still has a perspective.',q:'Which is most likely a primary source for a historic event? A: A contemporary witness diary. B: A modern summary article. C: A fictional film made decades later.',a:['a'],hint:'Look for material created close to the event by someone who observed or participated.'},
      {example:'Claims about causes need supporting evidence, not just chronological order.',q:'Which statement best distinguishes evidence from interpretation? A: Every account is equally accurate. B: A tax ledger records an amount; why taxes rose is an interpretation to investigate. C: The latest interpretation is always correct.',a:['b'],hint:'Pick the option that separates a recorded fact from a proposed explanation.'}
    ],
    languages:[
      {example:'Meaning depends on vocabulary and context, not replacing every word independently.',q:'In a language exercise, what should you check first? A: Only the length of the sentence. B: Context, speaker, and intended meaning. C: Whether it uses the most complicated words.',a:['b'],hint:'Consider how context changes what the speaker intends.'},
      {example:'Understanding grows by listening, speaking, reading, and writing in context.',q:'Which is a useful communication check? A: Choose a response that fits the situation. B: Memorize a long list without meaning. C: Ignore the listener.',a:['a'],hint:'Choose what tests an actual exchange between people.'}
    ],
    technology:[
      {example:'In programming, a loop repeats instructions while a condition or count determines when it stops.',q:'Which is a loop? A: Print one greeting once. B: Repeat a greeting five times. C: Rename a file.',a:['b'],hint:'Look for repeated action.'},
      {example:'A conditional chooses what happens based on a test.',q:'Which uses a conditional? A: Repeat ten times. B: Draw a line. C: If temperature is below freezing, show an ice warning.',a:['c'],hint:'Find the statement with an if–then decision.'}
    ],
    arts:[
      {example:'Artists choose line, shape, value, color, space, and texture to communicate an idea.',q:'Which change most directly increases value contrast? A: Put dark marks beside light marks. B: Repeat the same midtone everywhere. C: Remove the subject.',a:['a'],hint:'Value contrast is the difference between light and dark.'},
      {example:'A composition uses placement and visual relationships to guide attention.',q:'Which creates an intentional focal point? A: Make every detail equally prominent. B: Give the important subject a contrasting shape or value. C: Avoid all variation.',a:['b'],hint:'Think about how a viewer knows where to look first.'}
    ],
    health:[
      {example:'A sustainable movement plan balances activity, rest, safety, and individual ability.',q:'What is a sound choice during movement practice? A: Ignore sharp pain. B: Keep going regardless of dizziness. C: Stop and seek appropriate help when a warning sign appears.',a:['c'],hint:'Safe practice responds to the body’s warning signs.'},
      {example:'A healthy routine includes adequate recovery as well as activity.',q:'Which supports recovery? A: Consistent sleep and suitable rest. B: Never resting. C: Skipping hydration during exertion.',a:['a'],hint:'Choose the habit that supports rebuilding and regulation.'}
    ],
    research:[
      {example:'Reliable research checks authorship, evidence, publication context, and competing explanations.',q:'Which strengthens a research claim? A: Repeating it more loudly. B: Comparing credible, independently supported sources. C: Using only a headline.',a:['b'],hint:'Look for verifiable and independent support.'},
      {example:'A good citation helps readers find and evaluate the source.',q:'Which is more traceable? A: Someone said it. B: Everybody knows. C: Author, title, date, and source location.',a:['c'],hint:'Choose the information that lets a reader locate the original source.'}
    ],
    life:[
      {example:'A practical plan lists needed materials, ordered steps, and safety checks.',q:'Before beginning an unfamiliar home repair, what comes first? A: Review the instructions and hazards. B: Start cutting immediately. C: Skip protective measures.',a:['a'],hint:'Think about preparation and safety before action.'},
      {example:'A budget compares available income with planned spending.',q:'Which is a useful first budgeting step? A: Ignore recurring costs. B: List income and essential expenses. C: Assume every purchase is affordable.',a:['b'],hint:'Start with what comes in and what must go out.'}
    ]
  });

  /* Audited, student-released Mathematics micro-pilot, bound to authored
     lesson identities. Original formative items; NEVER formal assessment keys. */
  Object.assign(B,{
    math_elem_add:[
      {example:'Count on four from nine: 10, 11, 12, 13. So 9 + 4 = 13.',q:'What is 7 + 5?',a:['12'],hint:'Start with seven and count five more.'},
      {example:'Six counters with eight more make fourteen.',q:'What is 8 + 3?',a:['11'],hint:'Make ten, then count the one remaining.'}
    ],
    math_mid_signed:[
      {example:'On a number line, −4 + 7 = 3: start at −4 and move seven places right.',q:'Calculate −6 + 9.',a:['3'],hint:'Start at negative six; move nine places to the right.'},
      {example:'Subtracting a negative is adding its opposite: 3 − (−5) = 8.',q:'Calculate −2 − (−7).',a:['5'],hint:'Replace subtracting negative seven with adding seven.'}
    ],
    math_high_argument:[
      {example:'To justify a proposed equation solution, substitute it into the ORIGINAL equation.',q:'Which justifies x = 4 as a solution of 3x + 2 = 14? A: 3(4)+2=14. B: Move the 2 without an operation. C: Substitute into a different equation.',a:['a'],hint:'Check the proposed x by substitution into the original equation.'},
      {example:'One counterexample disproves an always-claim. Six is even but not a multiple of four.',q:'Which disproves the claim that every perfect square is even? A: 4 B: 9 C: 16',a:['b'],hint:'Find an odd perfect square.'}
    ],
    math_higher_vectors:[
      {example:'A displacement of 5 east and 2 north is the vector (5,2) when axes are (east,north).',q:'Using (east,north) coordinates, 7 east and 4 north is which vector? A: (4,7) B: (11,0) C: (7,4)',a:['c'],hint:'The east component comes first; north second.'},
      {example:'From point (1,2) to (4,6), subtract start from end to get displacement (3,4).',q:'From (2,1) to (5,7), what is the displacement? A: (3,6) B: (7,8) C: (−3,−6)',a:['a'],hint:'Subtract initial coordinates from final coordinates.'}
    ]
  });
  const RELEASED_MATH=Object.freeze([
    {stage:'elementary',grade:'02',courseId:'elementary-grade-02-mathematics',lessonId:'week-01',week:1,title:'Scholar Routines and Reading Stamina',objective:'number habits and strategy talk',bank:'math_elem_add'},
    {stage:'middle',grade:'07',courseId:'middle-grade-07-mathematics',lessonId:'week-05',week:5,title:'Operations with Rational Numbers',objective:'How do rational numbers extend what we can model and explain?',bank:'math_mid_signed'},
    {stage:'high',courseId:'math-algebra1-integrated1',lessonId:'u01-l01',title:'Algebraic Habits, Notation & Mathematical Argument',objective:'Distinguish a mathematical claim from its justification.',bank:'math_high_argument'},
    {stage:'higher',courseId:'higher-learning-linear-algebra',lessonId:'u01-l01',title:'Vectors and Coordinates in Rⁿ',objective:'interpreting vectors as directed quantities, coordinate lists, and data objects',bank:'math_higher_vectors'}
  ]);
  function exactReleasedMath(c){
    if(!c||!c.courseId||!c.lessonId)return null;
    return RELEASED_MATH.find(x=>x.stage===c.stage&&x.courseId===c.courseId&&x.lessonId===c.lessonId&&x.title===c.title&&
      (!x.grade||x.grade===c.grade)&&(!x.week||x.week===c.week))||null;
  }
  const SUBJECT_CUES=[
    {name:'psychology',pattern:/\b(?:psychology|cognitive science|behavioral science|human behavior|psychological research)\b/i},
    {name:'english',pattern:/\b(?:english|language arts|reading comprehension|essay|literature|grammar|writing|poetry|narrative|vocabulary)\b/i},
    {name:'science',pattern:/\b(?:science|biology|chemistry|physics|earth science|laboratory|experiment|ecosystem)\b/i},
    {name:'social',pattern:/\b(?:social studies|history|civics|government|geography|economics|citizenship)\b/i},
    {name:'languages',pattern:/\b(?:world languages|linguistics|spanish|french|german|arabic|mandarin|japanese|translation)\b/i},
    {name:'technology',pattern:/\b(?:technology|coding|programming|computer science|digital literacy|engineering|robotics)\b/i},
    {name:'arts',pattern:/\b(?:art|music|drawing|painting|design|visual arts|composition)\b/i},
    {name:'health',pattern:/\b(?:health|wellness|nutrition|physical education|fitness|exercise|\bpe\b)\b/i},
    {name:'research',pattern:/\b(?:research|sources|citation|evidence evaluation|scholarship|academic writing)\b/i},
    {name:'life',pattern:/\b(?:life skills|home management|budgeting|culinary|personal finance|gardening|entrepreneurship|business planning|food safety)\b/i}
  ];
  function subjectFrom(text){
    const q=String(text||'');
    return SUBJECT_CUES.find(s=>s.pattern.test(q))?.name||'';
  }
  const SUBJECT_TITLES=Object.freeze({
    english:'English and Language Arts',science:'Science',energy:'Science · Energy Transfer',psychology:'Psychology',social:'Social Studies',
    languages:'World Languages',technology:'Technology',arts:'Arts',
    health:'Health and Physical Education',research:'Research',life:'Life Skills',
    math_elem_add:'Mathematics · Elementary',math_mid_signed:'Mathematics · Middle',
    math_high_argument:'Mathematics · Algebra I',math_higher_vectors:'Mathematics · Linear Algebra'
  });

  function fresh(){
    return {subject:'',detail:'',phase:'',q:'',accepted:[],hint:'',
      tries:0,used:[],method:'worked',helped:{worked:0,visual:0},
      successes:0,examplesTried:0};
  }
  function safeState(raw){
    const s=fresh();
    if(!raw||typeof raw!=='object')return s;
    for(const k of ['subject','detail','phase','q','hint','method']) if(typeof raw[k]==='string')s[k]=raw[k].slice(0,180);
    for(const k of ['tries','successes','examplesTried'])if(Number.isInteger(raw[k]))s[k]=Math.max(0,Math.min(raw[k],500));
    if(Array.isArray(raw.accepted))s.accepted=raw.accepted.filter(x=>typeof x==='string').slice(0,4);
    if(Array.isArray(raw.used))s.used=raw.used.filter(x=>typeof x==='string').slice(-25);
    if(raw.helped&&typeof raw.helped==='object')for(const k of ['worked','visual'])s.helped[k]=Math.min(500,Math.max(0,Number(raw.helped[k])||0));
    return s;
  }
  function createSession(options){
    options=options||{};
    const storageKey=options.storageKey||null;
    let memoryEnabled=Boolean(storageKey&&read(storageKey+':consent')===true);
    let state=memoryEnabled?safeState(read(storageKey+':state')):fresh();
    let releaseContext=null;
    function save(){
      if(memoryEnabled&&storageKey)write(storageKey+':state',state);
    }
    function remember(enabled){
      memoryEnabled=Boolean(enabled&&storageKey);
      if(storageKey){if(memoryEnabled)write(storageKey+':consent',true);else{
        try{localStorage.removeItem(storageKey+':consent');localStorage.removeItem(storageKey+':state');}catch{}
      }}
      if(memoryEnabled)save();
      return memoryEnabled;
    }
    function reset(){
      state=fresh();
      if(storageKey)try{localStorage.removeItem(storageKey+':state');}catch{}
    }
    function setReleasedContext(raw){
      // Deliberately refuse raw course objects. Copy ONLY an allowlist of
      // already-published, learner-scoped, post-assessment summary fields.
      if(!raw||typeof raw!=='object'){releaseContext=null;return;}
      const str=(x,n=100)=>typeof x==='string'?x.trim().slice(0,n):'';
      const current=raw.currentFocus&&typeof raw.currentFocus==='object'?raw.currentFocus:{};
      const published=raw.currentLessonContext&&typeof raw.currentLessonContext==='object'?raw.currentLessonContext:{};
      const formative=raw.latestFormative&&typeof raw.latestFormative==='object'?raw.latestFormative:{};
      const assessments=Array.isArray(raw.recentAssessmentAttempts)?raw.recentAssessmentAttempts:
        Array.isArray(raw.recentAssessments)?raw.recentAssessments:[];
      const last=raw.latestAssessment||assessments[assessments.length-1]||{};
      const lesson=Array.isArray(raw.recentLessonEvidence)?raw.recentLessonEvidence.slice(-1)[0]||{}:{};
      const subject=str(published.subject||current.subject||formative.department||lesson.subject||formative.courseId||last.courseId||'',80);
      const suggested=Array.isArray(last.reviewSkills)?last.reviewSkills:[],
        formativeSkills=Array.isArray(formative.reviewSkills)?formative.reviewSkills:[],
        courseId=str(published.courseId||formative.courseId||last.courseId||'',80);
      releaseContext={
        stage:str(raw.stage,25),grade:str(raw.grade,12),
        subject,courseId,
        lessonId:str(published.lessonId,24),title:str(published.title,140),objective:str(published.objective,200),
        week:(published.week??current.week)==null?null:Math.max(0,Math.min(52,Number(published.week??current.week)||0)),
        focus:str(published.focus||lesson.focus||formative.focus||current.text||'',140),
        skills:[...new Set([...suggested,...formativeSkills].filter(x=>typeof x==='string')
          .map(x=>x.trim().slice(0,65)).filter(Boolean))].slice(0,4),
        score:Number.isFinite(Number(last.score))&&last.score!=null?Math.max(0,Math.min(100,Number(last.score))):null,
        verified:last.verified===true||Boolean(raw.latestAssessment?.formative===false)
      };
    }
    function contextReply(q){
      if(!releaseContext)return '';
      const c=releaseContext;
      const lessonScoped=/\b(?:(?:my|this|the|today'?s|current)\s+(?:lesson|topic|quiz|test|assessment)|help (?:me )?with (?:a |my |this |the )?lesson|review my skills|practice my lesson)\b/i.test(q);
      if(!lessonScoped)return '';
      if(/\b(?:quiz|test|assessment)\b/i.test(q)){
        const score=c.verified&&c.score!=null?' Your last verified score summary is '+c.score+'%.':'';
        return 'I cannot retrieve locked questions or official answers.'+score+
          (c.skills.length?' Your released review skills are '+c.skills.join(', ')+'.':'')+
          ' Let us practise the underlying concept with a NEW example. Which skill shall we try?';
      }
      const match=exactReleasedMath(c);
      if(match)return 'Your released '+match.title+' lesson focuses on '+match.objective+'. '+
        exercise(match.bank,'Here is new, ungraded formative practice for this exact lesson, not an Academy quiz.');
      if(c.lessonId)return 'I can see the released lesson '+(c.title||c.lessonId)+
        '. I do not yet have reviewed, lesson-specific practice for this objective. '+
        'Tell me which step is difficult; I will not substitute unrelated practice or reveal marking keys.';
      const combined=(c.skills.join(' ')+' '+c.focus+' '+c.subject+' '+c.courseId).toLowerCase();
      let aligned='';
      if(/(?:energy transfer|heat transfer|thermal energy|conduction|convection)/.test(combined))aligned='energy';
      else if(/(?:linear equations?|solving equations?|one-step equations?|two-step equations?|algebraic equations?)/.test(combined))aligned='equations';
      else if(/(?:fraction addition|adding fractions?|same denominators?)/.test(combined))aligned='add';
      else if(/(?:fraction multiplication|multiplying fractions?)/.test(combined))aligned='multiply';
      else if(/(?:textual evidence|supporting (?:a )?claim|claim and evidence|thesis statement)/.test(combined))aligned='english';
      else if(/(?:primary sources?|historical evidence|source credibility)/.test(combined))aligned='social';
      else if(/(?:observations? and inferences?|experimental variables?|controlled experiments?)/.test(combined))aligned='science';
      else if(/(?:programming loops?|loops? and conditionals?|coding basics)/.test(combined))aligned='technology';
      const position=c.subject||c.courseId||'your current learning pathway';
      const scope='Your released summary identifies '+position+
        (c.week?' (week '+c.week+')':'')+'.'+
        (c.focus?' The recent lesson focus is '+c.focus+'.':'')+
        (c.skills.length?' Review skills: '+c.skills.join(', ')+'.':'');
      if(aligned)return scope+' '+exercise(aligned,'Here is NEW practice aligned to that concept, separate from the Academy quiz.');
      return scope+' I do not yet have a verified concept-matched practice bank for this exact lesson. Tell me which step is difficult, and we can work from your explanation. I will not substitute unrelated examples or disclose assessment keys.';
    }
    function choose(kind){
      const items=B[kind]||[];
      const available=items.map((item,i)=>({item,i,k:kind+':'+i}));
      available.sort((a,b)=>{
        const ai=state.used.lastIndexOf(a.k),bi=state.used.lastIndexOf(b.k);
        return ai-bi || a.i-b.i;
      });
      const selected=available[0];
      if(!selected)return null;
      state.used.push(selected.k);state.used=state.used.slice(-25);
      return selected.item;
    }
    function exercise(kind,prefix){
      const task=choose(kind);
      if(!task)return 'Tell me which step you would like to examine.';
      state.detail=kind;
      state.subject=SUBJECT_TITLES[kind]||'mathematics';
      state.phase='practice';
      state.q=task.q;
      state.accepted=task.a;
      state.hint=task.hint;
      state.tries=0;
      state.method='worked';
      state.examplesTried++;
      save();
      return (prefix||'Let us try a fresh example.')+' '+task.example+' Now try this one: '+task.q+' You can show your thinking, not just the answer.';
    }
    function visual(){
      state.method='visual';save();
      if(state.detail==='add')return 'Picture a bar divided into equal pieces. The bottom number tells us how many equal pieces make the whole. If we have 2 sevenths and then 3 more sevenths, we count the pieces, not the partitions. Try '+state.q+' again.';
      if(state.detail==='multiply')return 'Picture taking part of a part: one fraction tells how much of another to keep. Multiply across, then simplify. Try '+state.q+' again.';
      if(state.detail==='equations')return 'Think of a balance scale. Whatever you remove from one side, remove from the other. Isolate the x term first, then divide. Try '+state.q+' again.';
      return 'Let us draw, group, or compare one small example before we continue.';
    }
    function practiceAnswer(q){
      if(state.phase!=='practice'||!state.accepted.length)return null;
      const compact=q.replace(/\s+/g,'').toLowerCase();
      const isAnswer=/^-?\d+(?:\/\d+)?$/.test(compact)||/^(?:x\s*(?:=|is)\s*)-?\d+(?:\/\d+)?$/i.test(q)||/^(?:option)?[abc]$/.test(compact);
      if(!isAnswer)return null;
      const value=compact.replace(/^x(?:=|is)/,'').replace(/^option/,'');
      if(state.accepted.includes(value)){
        state.successes++;
        state.helped[state.method]=(state.helped[state.method]||0)+1;
        state.phase='reflect';state.accepted=[];save();
        return 'Yes — '+value+' is correct for this practice example. You used the key relationship successfully. Would you like another example, a harder challenge, or to explain why the method works? This practice does not alter Academy mastery.';
      }
      state.tries++;
      save();
      if(state.tries>=2){
        const kind=state.detail;
        return exercise(kind,'We can take a simpler route; that answer did not fit this example. Here is another worked model.');
      }
      return 'Not quite for this example. '+state.hint+' Try again: '+state.q+'. You may explain your steps.';
    }
    function resumeTopic(history){
      // Reuse existing Academy history, not a second transcript.
      if(state.subject||!Array.isArray(history))return;
      const latest=history.filter(m=>m&&m.role==='user'&&typeof m.text==='string').slice(-12);
      for(let i=latest.length-1;i>=0;i--){
        const q=norm(latest[i].text);
        if(/\b(?:history|civics|government)\b/.test(q)){state.subject='history';break;}
        if(/\b(?:science|biology|chemistry|physics)\b/.test(q)){state.subject='science';break;}
        if(/\b(?:essay|writing|poem|reading|literature)\b/.test(q)){state.subject='writing';break;}
        if(/\b(?:geometry|triangle|angles?)\b/.test(q)){state.subject='geometry';break;}
        if(/\b(?:math|mathematics|fractions?|algebra|equations?)\b/.test(q)){
          state.subject='mathematics';
          if(/\bfractions?\b/.test(q))state.detail='fractions';
          else if(/\b(?:algebra|equations?)\b/.test(q))state.detail='equations';
          break;
        }
      }
    }
    function respond(message){
      const raw=clean(message),q=norm(raw);
      if(!raw)return 'What would you like to investigate?';
      if(/(?:show|give|reveal|leak|provide|unlock).{0,45}(?:locked|exam answers|answer key|test answers|password|private records)/i.test(raw)||/(?:password|login credential|secret token)/i.test(raw))
        return 'I can help you practise the underlying skill with new examples, but I cannot reveal locked assessment answers or private account information.';
      if(/\b(?:unsafe|emergency|immediate danger|hurt myself)\b/i.test(raw))
        return 'Your safety matters more than a lesson. If there is immediate danger, contact emergency services or a trusted adult now. We can return to the learning question afterward.';
      if(/^(?:hi|hello|hey|good morning|good afternoon|good evening|greetings)[!?.\s]*$/i.test(q))
        return state.subject?'Hello again. We were exploring '+state.subject+'. Would you like to continue, or switch to another subject?':'Hello! I’m Archaemenes. What would you like to explore or learn today?';
      if(/^(?:thanks|thank you|thank you very much)[!.\s]*$/.test(q))return 'You’re welcome. Your questions are welcome here, too. Shall we continue or explore something new?';
      const response=practiceAnswer(q);
      if(response)return response;
      if(/(?:that helped|i get it|makes sense|i understand now)/.test(q)){
        // Self-reported confidence is not demonstrated understanding.
        return 'I’m glad that approach was useful. Could you explain the key idea in your own words, or would you like another example to test it?';
      }
      if(/(?:i don'?t understand|still confused|another way|show me visually|picture it)/.test(q)&&state.phase==='practice')return visual();
      if(/^(?:hint|clue|give me a hint|give me a clue)[!?.\s]*$/.test(q)&&state.phase==='practice')return 'Here is a clue: '+state.hint+' Try '+state.q+' once more.';
      if(/^(?:another|again|another example|harder|more practice|one more)[!?.\s]*$/.test(q)&&state.detail&&B[state.detail])return exercise(state.detail,'Certainly.');
      // Specific requests are evaluated before the broad fractions topic.
      if((/\b(?:adding|addition|add)\b/.test(q)&&state.detail==='fractions')||/\b(?:adding fractions|fraction addition)\b/.test(q))return exercise('add','For fractions with the same denominator, the pieces are the same size.');
      if((/\b(?:multiplying|multiply|multiplication)\b/.test(q)&&state.detail==='fractions')||/\b(?:multiplying fractions|fraction multiplication)\b/.test(q))return exercise('multiply','Multiplication asks for a part of a part.');
      if(/\bfractions?\b/.test(q)){
        state.subject='mathematics';state.detail='fractions';state.phase='choose';save();
        return 'Fractions are parts of a whole. Are you adding fractions, multiplying them, or trying to understand what they represent?';
      }
      if(/(?:what (?:they|fractions) (?:mean|represent)|understand fractions|parts of a whole)/.test(q)&&state.detail==='fractions'){
        state.phase='concept';save();return 'Imagine a pizza divided into 4 equal slices. One slice is 1/4 and three slices are 3/4. What would two slices represent?';
      }
      if(state.phase==='concept'&&/^(?:2\/4|1\/2|two fourths|one half)[.! ]*$/.test(q)){
        state.successes++;save();return 'Exactly. Two of four equal pieces make 2/4, which is also 1/2. Would you like to explore adding or multiplying now?';
      }
      if(/\b(?:equations?|algebra)\b/.test(q))return exercise('equations','Let us solve one equation by doing the same operation to both sides.');
      // Curriculum-aware support uses authored practice and a released summary,
      // never the question bank or teacher marking guidance.
      const academic=contextReply(raw);
      if(academic)return academic;
      const explicit=subjectFrom(raw);
      if(explicit&&B[explicit])return exercise(explicit,'We can study '+SUBJECT_TITLES[explicit]+' together.');
      if(state.detail&&B[state.detail]&&/^(?:another example|another|again|one more|more practice|harder|practice|practise)[.!?\s]*$/i.test(q))
        return exercise(state.detail,'Here is another independent practice question.');
      if(state.detail&&B[state.detail]&&/^(?:hint|clue|give me a hint|give me a clue)[.!?\s]*$/i.test(q)&&state.phase==='practice')
        return 'Here is a clue: '+state.hint+' Try again: '+state.q;

      if(/\b(?:math|mathematics|numbers?)\b/.test(q)){
        state.subject='mathematics';state.phase='choose';save();
        return 'Let us work through it together. Which part is giving you trouble — fractions, equations, geometry, or something else? You can also type the problem.';
      }
      if(state.subject==='mathematics'&&/\b(?:adding|multiplying)\b/.test(q)&&!state.detail){
        state.detail='fractions';save();
        return 'Are you working with fractions, whole numbers, or decimals? We can start with an example.';
      }
      if(/\b(?:geometry|triangle|angles?)\b/.test(q)){
        state.subject='geometry';save();return 'Geometry is about shapes and their relationships. Are you finding an angle, measuring an area, or constructing a proof? Share the givens and we can start with a diagram.';
      }
      if(/\b(?:science|biology|chemistry|physics|experiment)\b/.test(q)){
        state.subject='science';save();return 'Let us separate what you observed from what you infer. What experiment, system, or scientific question are you studying?';
      }
      if(/\b(?:writing|essay|story|poem|literature|reading)\b/.test(q)){
        state.subject='writing';save();return 'We can work with your own words. Are you planning an idea, developing a paragraph, revising a draft, or interpreting a text?';
      }
      if(/(?:stuck|confus|trouble|difficult|hard)/.test(q)){
        return state.subject?'We are working on '+state.subject+'. Tell me the exact part that becomes confusing, and I will try a different example.':'Which subject is difficult right now? You can name one topic or type a problem.';
      }
      if(state.subject==='mathematics'&&state.detail==='fractions')
        return 'We were talking about fractions. Would you like to add, multiply, or first see what a fraction means?';
      if(state.subject)return 'We were exploring '+state.subject+'. Tell me one example, question, or attempt so that I can respond more precisely.';
      return 'I can help you investigate a question, examine evidence, or work through a small example. Which subject or idea shall we begin with?';
    }
    return Object.freeze({respond,reset,remember,resumeTopic,setReleasedContext,remembering:()=>memoryEnabled,snapshot:()=>safeState(state)});
  }
  function forLearner(familyId,learnerId){
    if(!familyId||!learnerId)return null;
    const id=key(familyId,learnerId);
    if(!sessions.has(id))sessions.set(id,createSession({storageKey:id}));
    return sessions.get(id);
  }
  function clearLearner(familyId,learnerId){
    const s=forLearner(familyId,learnerId);
    if(s){s.reset();s.remember(false);}
  }
  // Speech is explicitly user initiated. Device voices may not be available.
  function speak(text){
    if(!('speechSynthesis' in global)||!('SpeechSynthesisUtterance' in global))return false;
    global.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(clean(text).slice(0,1200));
    utterance.lang='en-GB';utterance.rate=0.93;
    global.speechSynthesis.speak(utterance);return true;
  }
  function stop(){if('speechSynthesis' in global)global.speechSynthesis.cancel();}
  function lastReply(box){
    const nodes=box?.querySelectorAll('.visitor-reply,.msg.mentor')||[];
    return nodes.length?nodes[nodes.length-1].textContent.replace(/^Archaemenes\s*/,'').trim():'';
  }
  function addSpeechControls(box){
    if(!box||box.parentElement.querySelector('[data-mentor-speech]'))return;
    const row=document.createElement('div');row.dataset.mentorSpeech='true';
    row.style.cssText='display:flex;gap:9px;flex-wrap:wrap;padding:9px 0;';
    const read=document.createElement('button');read.type='button';read.textContent='▶ Read last reply';
    const halt=document.createElement('button');halt.type='button';halt.textContent='■ Stop reading';
    read.addEventListener('click',()=>speak(lastReply(box)));
    halt.addEventListener('click',stop);
    row.append(read,halt);box.insertAdjacentElement('afterend',row);
  }
  global.KhaemenesArchaemenesConversation=Object.freeze({version:'2.0.0',createSession,forLearner,clearLearner,addSpeechControls,stop});
})(window);
