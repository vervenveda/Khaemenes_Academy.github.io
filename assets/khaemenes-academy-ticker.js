/* Khaemenes Academy · canonical quick-link ticker · v1.0.0 */
(()=>{"use strict";
if(window.KhaemenesAcademyTicker)return;

const ID="khaeNetworkTicker";
const STYLE_ID="khaeAcademyTickerStyles";
const PAUSE_KEY="VNV_TICKER_PAUSED";
const A="https://vervenveda.com/Khaemenes_Academy.github.io/";
const links=Object.freeze([
  ["Academy Home",A],
  ["Student Portal",A+"student/"],
  ["Family Center",A+"family/"],
  ["Enroll / Add Learner",A+"family/enroll/"],
  ["Adult Scholar",A+"adult/"],
  ["Teacher Admin",A+"teacher-admin/"],
  ["Mentor",A+"mentor/"],
  ["Verify Records",A+"verify/"],
  ["Offline Learning",A+"offline/"],
  ["Preschool","https://vervenveda.com/Khaemenes_Preschool.github.io/"],
  ["Kindergarten","https://vervenveda.com/Khaemenes_KinderGarden.github.io/"],
  ["Elementary","https://vervenveda.com/Khaemenes_Elementary.github.io/"],
  ["Middle School","https://vervenveda.com/Khaemenes_Middle.github.io/"],
  ["High School","https://vervenveda.com/Khaemenes_High.github.io/"],
  ["Higher Learning","https://vervenveda.com/Khaemenes_Higher_Learning.github.io/"],
  ["Linguistics","https://vervenveda.com/Khaemenes_Linguistics.github.io/"],
  ["Life Skills","https://vervenveda.com/Khaemenes_Academy_Life_Skills.github.io/"],
  ["Arcade","https://vervenveda.com/arcade.github.io/"],
  ["ProReSources","https://vervenveda.com/proresource_hub.github.io/"],
  ["Search","https://vervenveda.com/PLERASearch.github.io/"],
  ["Beta","https://vervenveda.com/beta/"],
  ["Help",A+"#help"]
]);

function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement("style");
  style.id=STYLE_ID;
  style.textContent=`
:root{--khae-ticker-height:33px}
#${ID}{position:sticky;top:0;z-index:2147481000;height:var(--khae-ticker-height);display:grid;grid-template-columns:minmax(0,1fr) 44px;overflow:hidden;color:#f4ead1;background:linear-gradient(90deg,#07101d,#10243b 48%,#07101d);border-bottom:1px solid rgba(255,255,255,.13);font-family:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif}
#${ID} .khae-network-ticker-viewport{min-width:0;overflow:hidden}
#${ID} .khae-network-ticker-track{width:max-content;height:100%;display:flex;align-items:center;white-space:nowrap;animation:khaeAcademyTickerMove 33s linear infinite;will-change:transform}
#${ID}:hover .khae-network-ticker-track,#${ID}:focus-within .khae-network-ticker-track,#${ID}[data-paused="true"] .khae-network-ticker-track{animation-play-state:paused}
#${ID} .khae-network-ticker-set{height:100%;display:flex;align-items:center;gap:14px;padding-inline:11px}
#${ID} .khae-network-ticker-label{color:#ead9b8;font-family:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase}
#${ID} a{color:#eef3f6!important;text-decoration:none!important;font-size:10px!important;font-weight:400!important;letter-spacing:.075em!important;text-transform:uppercase!important}
#${ID} a::before{content:"·";margin-right:12px;color:rgba(255,255,255,.38)}
#${ID} a:hover,#${ID} a:focus-visible{color:#fff!important}
#${ID} .khae-ticker-control{width:44px;height:var(--khae-ticker-height);display:grid;place-items:center;padding:0;border:0;border-left:1px solid rgba(255,255,255,.13);border-radius:0;color:#f4ead1;background:rgba(0,0,0,.08);font:400 11px/1 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif;cursor:pointer}
#${ID} .khae-ticker-control:hover{background:rgba(255,255,255,.09)}
@keyframes khaeAcademyTickerMove{to{transform:translateX(-33.333333%)}}
@media(max-width:560px){:root{--khae-ticker-height:32px}#${ID}{grid-template-columns:minmax(0,1fr) 36px}#${ID} .khae-network-ticker-track{animation-duration:33s}#${ID} .khae-network-ticker-set{gap:12px;padding-inline:7px}#${ID} .khae-network-ticker-label,#${ID} a{font-size:9px!important}#${ID} .khae-ticker-control{width:36px}}
@media(prefers-reduced-motion:reduce){#${ID} .khae-network-ticker-track{animation:none!important;transform:none!important}}
@media print{#${ID}{display:none!important}}
`;
  (document.head||document.documentElement).append(style);
}

function setBlock(hidden){
  const set=document.createElement("div");
  set.className="khae-network-ticker-set";
  if(hidden)set.setAttribute("aria-hidden","true");
  const label=document.createElement("span");
  label.className="khae-network-ticker-label";
  label.textContent="Khaemenes Academy Quick Links";
  set.append(label);
  for(const [name,href] of links){
    const a=document.createElement("a");
    a.href=href;
    a.textContent=name;
    if(hidden)a.tabIndex=-1;
    set.append(a);
  }
  return set;
}

function mount(){
  if(!document.body)return null;
  const existing=document.getElementById(ID);
  if(existing)return existing;
  ensureStyle();

  const ticker=document.createElement("div");
  ticker.id=ID;
  ticker.className="khae-network-ticker";
  ticker.dataset.paused="false";
  ticker.setAttribute("aria-label","Khaemenes Academy Quick Links");

  const viewport=document.createElement("div");
  viewport.className="khae-network-ticker-viewport";
  const track=document.createElement("div");
  track.className="khae-network-ticker-track";
  track.append(setBlock(false),setBlock(true),setBlock(true));
  viewport.append(track);

  const button=document.createElement("button");
  button.className="khae-ticker-control";
  button.type="button";

  let paused=false;
  try{paused=localStorage.getItem(PAUSE_KEY)==="true"}catch{}
  const apply=value=>{
    ticker.dataset.paused=String(value);
    button.setAttribute("aria-pressed",String(value));
    button.setAttribute("aria-label",value?"Resume Academy quick-link ticker":"Pause Academy quick-link ticker");
    button.textContent=value?"▶":"Ⅱ";
    try{localStorage.setItem(PAUSE_KEY,String(value))}catch{}
  };
  apply(paused);
  button.addEventListener("click",()=>apply(ticker.dataset.paused!=="true"));

  ticker.append(viewport,button);
  const header=document.querySelector("[data-khae-header]");
  if(header?.parentNode)header.parentNode.insertBefore(ticker,header);
  else document.body.prepend(ticker);
  return ticker;
}

window.KhaemenesAcademyTicker=Object.freeze({version:"1.0.0",mount,links:()=>links.map(x=>x.slice())});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
else mount();
})();
