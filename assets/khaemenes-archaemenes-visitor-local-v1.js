/* Public visitor conversation — local introductory responses only.
   No remote backend, persistence, learner data or assessment authority. */
(()=>{'use strict';
const box=document.getElementById('visitorMessages'),form=document.getElementById('visitorForm'),input=document.getElementById('visitorInput');
if(!box||!form||!input)return;
const coach=window.KhaemenesArchaemenesConversation?.createSession?.({})||null;
function answer(value){
 const q=value.toLowerCase();
 if(/(answer|quiz|exam|test|graded|assessment|password|login)/i.test(q))return 'I can help you understand and practise the underlying concept. I cannot provide protected assessment answers or private account information. Which idea would you like to study?';
 if(/(sad|scared|afraid|hurt|unsafe|emergency)/i.test(q))return 'If you are in danger or need urgent help please contact a trusted adult or local emergency services. Would you like to discuss a safe next step?';
 if(coach)return coach.respond(value);
 if(/(algebra|math|fraction|geometry|equation|number)/i.test(q))return 'Start with what is known. Write one small example and identify the rule you think applies. Which step is confusing?';
 if(/(write|story|poem|art|creative|drawing|music)/i.test(q))return 'Begin with one character or central idea. Choose a setting and a question worth exploring. What would you like your audience to feel?';
 if(/(academy|school|enroll|course|learn)/i.test(q))return 'Khaemenes Academy offers learning pathways from early childhood through higher study. Explore the Student Portal or Family Profile above. Which subject interests you?';
 if(/(hello|hi|good morning|greetings|hey)/i.test(q))return 'Welcome. I am Archaemenes. Tell me what you are exploring and we will find a thoughtful place to begin.';
 return 'That is an interesting question. This public preview offers introductory scripted guidance rather than open-ended AI reasoning. Tell me the subject and what you already know so I can suggest a first step.';
}
function append(role,text){const p=document.createElement('p');p.className=role==='user'?'visitor-user':'visitor-reply';if(role==='mentor'){const n=document.createElement('span');n.textContent='Archaemenes';p.appendChild(n)}p.appendChild(document.createTextNode(text));box.appendChild(p);box.scrollTop=box.scrollHeight}
form.addEventListener('submit',event=>{event.preventDefault();const q=input.value.trim().slice(0,400);if(!q)return;append('user',q);append('mentor',answer(q));input.value='';input.focus()});
document.querySelectorAll('[data-visitor-example]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.visitorExample;input.focus()}));
document.getElementById('visitorClear')?.addEventListener('click',()=>{coach?.reset();box.replaceChildren();append('mentor','Welcome again. What would you like to explore?')});
})();