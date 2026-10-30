/* Khaemenes Academy · ticker compatibility loader.
   The canonical ticker now lives in assets/khaemenes-academy-ticker.js. */
(()=>{"use strict";
  try{
    if(window.KhaemenesAcademyTicker?.mount){window.KhaemenesAcademyTicker.mount();return;}
    if(document.querySelector('script[data-khaemenes-academy-ticker]'))return;
    const s=document.createElement("script");
    s.src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-academy-ticker.js";
    s.defer=true;
    s.dataset.khaemenesAcademyTicker="1";
    (document.head||document.documentElement).append(s);
  }catch{}
})();
