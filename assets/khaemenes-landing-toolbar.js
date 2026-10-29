/* Compatibility loader: VNV gateway owns the only ecosystem toolbar. */
(()=>{"use strict";
 if(document.querySelector('script[data-vnv-ecosystem-toolbar]'))return;
 const s=document.createElement("script");
 s.src="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js";
 s.defer=true;s.dataset.vnvEcosystemToolbar="1";
 (document.head||document.documentElement).append(s);
})();
