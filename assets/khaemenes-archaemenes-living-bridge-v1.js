/* Archaemenes living greeting bridge · public-safe stage presentation only.
 * Core teaching authority stays in artist1970/CORE/ArchaemenesCore.
 * NAIB administers mentor routing; Noema is Chancellor.
 * Read-aloud never records, requests a microphone, or changes course mastery. */
(function(global){"use strict";
const stages={
 preschool:["Wise Owl","Hello, explorer! Look closely. What is one thing you notice today?"],
 kindergarten:["Wise Owl","Hello, curious learner! What shall we discover together?"],
 elementary:["Academy Mentor","Welcome! Tell me what you understand, and we will find one useful clue."],
 middle:["Academy Mentor","Let us examine the idea together. What evidence supports your thinking?"],
 high:["Academy Mentor","We can start from the principle, review the evidence, and test your reasoning."],
 higher:["Scholar","Let us distinguish evidence from inference and investigate the strongest explanation."]
};
let mode="preschool";
function stop(){try{global.speechSynthesis?.cancel()}catch{}}
function update(stage){mode=Object.prototype.hasOwnProperty.call(stages,stage)?stage:"preschool";const label=document.getElementById("archaemenesLivingStage");if(label)label.textContent=stages[mode][0];stop()}
function speak(){if(!("speechSynthesis" in global)||!global.SpeechSynthesisUtterance){const status=document.getElementById("archaemenesLivingStatus");if(status)status.textContent="Read-aloud is unavailable in this browser.";return}
stop();const u=new SpeechSynthesisUtterance(stages[mode][1]);u.lang="en-US";u.rate=mode==="preschool"?.86:mode==="kindergarten"?.9:1;u.pitch=1;global.speechSynthesis.speak(u);
const status=document.getElementById("archaemenesLivingStatus");if(status)status.textContent="Speaking "+stages[mode][0]+" welcome. Use Stop to end playback."}
function mount(){document.getElementById("archaemenesLivingSpeak")?.addEventListener("click",speak);document.getElementById("archaemenesLivingStop")?.addEventListener("click",stop);document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});global.addEventListener("pagehide",stop)}
global.KhaemenesArchaemenesLivingBridge=Object.freeze({update,stop});if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);
