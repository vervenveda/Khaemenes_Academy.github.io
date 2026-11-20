/* Parent Profile: existing universal class-tools component configuration. */
(()=>{"use strict";
window.KhaemenesClassToolsConfigV1=Object.freeze({
 id:"ka-parent-profile",
 match:()=>/\/Khaemenes_Academy\.github\.io\/family\/profile\/(?:index\.html)?$/i.test(location.pathname),
 toggleLabel:"Tools",ariaLabel:"Parent Profile universal tools",
 tools:[
  {type:"link",label:"Search",sub:"Ecosystem search",href:"https://vervenveda.com/PLERASearch.github.io/"},
  {type:"ecosystem-list",label:"Learning",sub:"Education resources",filter:{category:"education",limit:12}},
  {type:"ecosystem-list",label:"Research",sub:"Research resources",filter:{category:"research",limit:12}},
  {type:"ecosystem-list",label:"Creative",sub:"Art and music",filter:{category:"creative",limit:12}},
  {type:"link",label:"Family",sub:"Parent Portal",href:"../"},
  {type:"action",label:"Language",sub:"Translator",action:"language"},
  {type:"link",label:"Records",sub:"Family Records",href:"../#family-records-controls"},
  {type:"help",label:"Instructions",sub:"Tool guidance"}
 ],
 actions:{language:()=>{
  const rail=document.getElementById("vnvClassToolsToolbar");if(!rail)return false;
  const target=rail.querySelector("#vnvClassToolsPanel");if(!target)return false;
  let panel=rail.querySelector("[data-vct-language-panel]");
  if(!panel){panel=document.createElement("div");panel.className="vct-pop";panel.dataset.vctLanguagePanel="1";panel.hidden=true;
   const title=document.createElement("h2");title.textContent="Language";panel.append(title);target.append(panel);}
  const select=document.getElementById("vnv-language-switch");
  if(select&&!panel.contains(select))panel.append(select);
  const open=panel.hidden;rail.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);
  panel.hidden=!open;if(open)panel.querySelector("select,button")?.focus();return true;
 }},
 help:{title:"Parent Profile Tools",paragraphs:["Open existing family services. Academic and family records retain their original permissions."]}
});
const move=()=>{
 const rail=document.getElementById("vnvClassToolsToolbar"),target=rail?.querySelector("#vnvClassToolsPanel");
 const select=document.getElementById("vnv-language-switch");if(!target||!select)return false;
 let panel=rail.querySelector("[data-vct-language-panel]");
 if(!panel){panel=document.createElement("div");panel.className="vct-pop";panel.dataset.vctLanguagePanel="1";panel.hidden=true;
  const h=document.createElement("h2");h.textContent="Language";panel.append(h);target.append(panel);}
 if(!panel.contains(select))panel.append(select);return true;
};
const observer=new MutationObserver(()=>{if(move())observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();