/* Archaemenes · contextual local mentor v2.0
   Reuses Storybird-style novelty scoring and AffixSix-style bounded experience,
   but evaluates a learner's actual practice answer before adapting.
   No network, grades, test items, or automatic permission escalation. */
(function(global){
  'use strict';
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
      state.subject='mathematics';
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
      const isAnswer=/^-?\d+(?:\/\d+)?$/.test(compact)||/^(?:x\s*(?:=|is)\s*)-?\d+(?:\/\d+)?$/i.test(q);
      if(!isAnswer)return null;
      const value=compact.replace(/^x(?:=|is)/,'');
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
        state.helped[state.method]=(state.helped[state.method]||0)+1;save();
        return 'I’m glad that approach was useful. Could you explain the key idea in your own words, or would you like another example to test it?';
      }
      if(/(?:i don'?t understand|still confused|another way|show me visually|picture it)/.test(q)&&state.phase==='practice')return visual();
      if(/^(?:hint|clue|give me a hint|give me a clue)[!?.\s]*$/.test(q)&&state.phase==='practice')return 'Here is a clue: '+state.hint+' Try '+state.q+' once more.';
      if(/^(?:another|again|another example|harder|more practice|one more)[!?.\s]*$/.test(q)&&state.detail&&B[state.detail])return exercise(state.detail,'Certainly.');
      if(/\bfractions?\b/.test(q)){
        state.subject='mathematics';state.detail='fractions';state.phase='choose';save();
        return 'Fractions are parts of a whole. Are you adding fractions, multiplying them, or trying to understand what they represent?';
      }
      if((/\b(?:adding|addition|add)\b/.test(q)&&state.detail==='fractions')||/\b(?:adding fractions|fraction addition)\b/.test(q))return exercise('add','For fractions with the same denominator, the pieces are the same size.');
      if((/\b(?:multiplying|multiply|multiplication)\b/.test(q)&&state.detail==='fractions')||/\b(?:multiplying fractions|fraction multiplication)\b/.test(q))return exercise('multiply','Multiplication asks for a part of a part.');
      if(/(?:what (?:they|fractions) (?:mean|represent)|understand fractions|parts of a whole)/.test(q)&&state.detail==='fractions'){
        state.phase='concept';save();return 'Imagine a pizza divided into 4 equal slices. One slice is 1/4 and three slices are 3/4. What would two slices represent?';
      }
      if(state.phase==='concept'&&/^(?:2\/4|1\/2|two fourths|one half)[.! ]*$/.test(q)){
        state.successes++;save();return 'Exactly. Two of four equal pieces make 2/4, which is also 1/2. Would you like to explore adding or multiplying now?';
      }
      if(/\b(?:equations?|algebra)\b/.test(q))return exercise('equations','Let us solve one equation by doing the same operation to both sides.');
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
    return Object.freeze({respond,reset,remember,remembering:()=>memoryEnabled,snapshot:()=>safeState(state)});
  }
  function forLearner(familyId,learnerId){
    if(!familyId||!learnerId)return null;
    const id=key(familyId,learnerId);
    if(!sessions.has(id))sessions.set(id,createSession({storageKey:id}));
    return sessions.get(id);
  }
  function clearLearner(familyId,learnerId){
    const s=forLearner(familyId,learnerId);
    if(s)s.reset();
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
