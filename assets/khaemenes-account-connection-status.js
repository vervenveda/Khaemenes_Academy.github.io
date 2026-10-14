/* Academy Account Cloud capability status v1: honest local-only indicator.
   No credentials, network authority assertions, or record synchronization. */
(()=>{"use strict";
  const read=()=>{const r=window.KhaemenesFamilyRegistry;let learner=null,family=null;try{learner=r?.getLearner?.()||null;family=r?.getFamily?.()||null}catch{}return Object.freeze({mode:"local",serverVerified:false,hasLearner:!!learner?.learnerId,hasFamily:!!family?.familyId,offline:!navigator.onLine,description:learner?.learnerId?"LOCAL PROFILE — learner selected on this device. Cloud synchronization not verified.":"LOCAL PROFILE — no learner selected. Cloud synchronization not verified."})};
  function refresh(){const state=read();document.querySelectorAll("[data-academy-account-status]").forEach(node=>{node.textContent=state.description+(state.offline?" Currently offline.":"");node.setAttribute("data-connection-mode","local")});return state}
  window.KhaemenesAccountConnectionStatus=Object.freeze({read,refresh});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",refresh,{once:true});else refresh();
  for(const event of ["khaemenes-family-ready","khaemenes-family-changed","khaemenes-learner-placement-changed","online","offline"])window.addEventListener(event,refresh);
})();