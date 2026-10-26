/* Archaemenes · British educator voice bridge v1.1
   Device British voice only, selected by user. No remote audio, microphone or learner records.
   NAIB administers routing; Noema is Chancellor; Archaemenes mentors. */
(function(global){"use strict";
const stages={
 preschool:["Wise Owl","Hello explorer! Look closely. What is one thing you notice today?"],
 kindergarten:["Wise Owl","Hello curious learner! What shall we discover together?"],
 elementary:["Academy Mentor","Welcome! Tell me what you understand. We will find one useful clue."],
 middle:["Academy Mentor","Let us examine the idea together. What evidence supports your thinking?"],
 high:["Academy Mentor","We can start with the principle. Then review the evidence and test your reasoning."],
 higher:["Scholar","Let us distinguish evidence from inference. Then investigate the strongest explanation."]
};
const KEY="khaemenes_archaemenes_british_voice_v1";
let mode="preschool",voiceList=[],selected="";
const el=id=>document.getElementById(id);
function status(message){if(el("archaemenesLivingStatus"))el("archaemenesLivingStatus").textContent=message}
function stop(){try{global.speechSynthesis?.cancel()}catch{}}
function update(stage){mode=Object.prototype.hasOwnProperty.call(stages,stage)?stage:"preschool";if(el("archaemenesLivingStage"))el("archaemenesLivingStage").textContent=stages[mode][0];stop()}
function key(v){return [v.voiceURI,v.name,v.lang].join("|")}
function preferred(v){if(/google uk english male/i.test(v.name))return 0;return /^(Daniel|Oliver|Arthur|George|Thomas|James|Edward|William|Brian|Graham)\b/i.test(v.name)?1:2}
function refresh(){
 const select=el("archaemenesVoiceChoice");if(!select)return;
 try{voiceList=("speechSynthesis" in global?global.speechSynthesis.getVoices():[]).filter(v=>/^en[-_]GB$/i.test(v.lang)&&!/whisper/i.test(v.name)).sort((a,b)=>preferred(a)-preferred(b)||a.name.localeCompare(b.name))}catch{voiceList=[]}
 if(!selected){try{selected=global.localStorage.getItem(KEY)||""}catch{}}
 select.textContent="";
 if(!voiceList.length){const option=document.createElement("option");option.value="";option.textContent="British voice unavailable on this device";select.appendChild(option);select.disabled=true;el("archaemenesLivingSpeak").disabled=true;status("A British English voice is not installed or exposed by this browser. Add an English (UK) system voice, then refresh.");return}
 select.disabled=false;el("archaemenesLivingSpeak").disabled=false;
 voiceList.forEach(v=>{const option=document.createElement("option");option.value=key(v);option.textContent=v.name+" · "+v.lang;select.appendChild(option)});
 if(!voiceList.some(v=>key(v)===selected))selected=key(voiceList[0]);
 select.value=selected;
 status("Choose a British voice and press Hear welcome to audition. The choice is saved on this device.");
}
function speak(){
 const v=voiceList.find(v=>key(v)===selected);if(!v){status("No British English voice available; no substitute voice will be used.");return}
 if(!global.SpeechSynthesisUtterance){status("Speech playback is not supported in this browser.");return}
 stop();const u=new global.SpeechSynthesisUtterance(stages[mode][1]);u.voice=v;u.lang=v.lang;u.rate=.96;u.pitch=1;u.volume=1;
 u.onerror=()=>status("This device could not play the selected British voice. Choose another voice or check speech settings.");
 global.speechSynthesis.speak(u);status("Playing "+v.name+" · "+v.lang+". Press Stop at any time.");
}
function mount(){
 el("archaemenesLivingSpeak")?.addEventListener("click",speak);
 el("archaemenesLivingStop")?.addEventListener("click",()=>{stop();status("Voice stopped.")});
 el("archaemenesVoiceChoice")?.addEventListener("change",e=>{selected=e.target.value;stop();try{global.localStorage.setItem(KEY,selected)}catch{}status("Selected "+(voiceList.find(v=>key(v)===selected)?.name||"British voice")+". Press Hear welcome to listen.")});
 el("archaemenesVoiceRefresh")?.addEventListener("click",refresh);
 if("speechSynthesis" in global){global.speechSynthesis.addEventListener?.("voiceschanged",refresh)}
 document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});global.addEventListener("pagehide",stop);refresh();
}
global.KhaemenesArchaemenesLivingBridge=Object.freeze({update,stop});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);
