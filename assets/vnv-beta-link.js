/* Khaemenes Academy compatibility loader · official ecosystem toolbar is single-source. */
(()=>{"use strict";
  try{
    document.getElementById("vnvBetaProgramLink")?.remove();
    document.getElementById("vnvBetaProgramFallback")?.remove();
    if(window.VNVEcosystemToolbar?.mount){window.VNVEcosystemToolbar.mount();return;}
    if(document.querySelector('script[src="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js"]'))return;
    const s=document.createElement("script");
    s.src="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js";
    s.defer=true;
    s.dataset.vnvEcosystemToolbar="1";
    (document.head||document.documentElement).append(s);
  }catch{}
})();
