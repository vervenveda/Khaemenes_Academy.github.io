/* Khaemenes Academy Core · global standard v1.0.0
   Chrome: 333 ticker -> AutoPopulate ticker -> official header/menu -> lower-right 3x2 toolbar.
   Typography: 16px readable floor · 33px ordinary titles · one 66px primary title.
   Semantics: eyebrow = category/brand; title = heading; description = paragraph.
   Existing account, family, placement, records and learner-state logic is untouched.
*/
(()=>{"use strict";
if(window.__KHAEMENES_ACADEMY_CORE_GLOBAL_STANDARD_V1__)return;
window.__KHAEMENES_ACADEMY_CORE_GLOBAL_STANDARD_V1__=true;

const VNV="https://vervenveda.com/assets/";
const ROOT="https://vervenveda.com/Khaemenes_Academy.github.io/";
const STYLE_ID="khaemenesAcademyCoreTypographyStandardV1";
const PRIMARY_ATTR="data-khaemenes-primary-title";
const SCRIPTS={
  ticker333:VNV+"vnv-333-ticker.js",
  tickerAuto:VNV+"vnv-ticker-autopopulate.js",
  header:VNV+"vnv-header-autopopulate.js",
  toolbar:VNV+"vnv-ecosystem-toolbar.js"
};

function hasScript(pathname){
  return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname===pathname}catch{return false}});
}
function load(src,key){
  const url=new URL(src,location.href);
  if(hasScript(url.pathname))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");s.src=url.href;s.defer=true;s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function visible(el){
  if(!el||!el.isConnected||el.hidden||el.getAttribute("aria-hidden")==="true")return false;
  const cs=getComputedStyle(el);return cs.display!=="none"&&cs.visibility!=="hidden";
}
function markPrimary(){
  const current=document.querySelector('['+PRIMARY_ATTR+'="true"]');
  if(current&&visible(current))return current;
  document.querySelectorAll('['+PRIMARY_ATTR+']').forEach(el=>el.removeAttribute(PRIMARY_ATTR));
  const chosen=[...document.querySelectorAll(
    'main .hero h1,main h1,.hero h1,[data-hero] h1,[data-page-hero] h1,h1,.hero-title,.main-title,.page-title'
  )].find(visible)||null;
  if(chosen)chosen.setAttribute(PRIMARY_ATTR,"true");
  return chosen;
}
function hasReadableText(el){
  if(!el||el.nodeType!==1)return false;
  if(el.matches("script,style,noscript,template,svg,svg *,canvas,iframe,br,hr,source,track,meta,link"))return false;
  return [...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||"").trim())||
    el.matches("input,select,textarea,button,option");
}
function enforceFloor(root=document.body){
  if(!root)return;
  const nodes=[];if(root.nodeType===1)nodes.push(root);if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
  for(const el of nodes){
    if(!hasReadableText(el))continue;
    if(el.matches("h1,h2,h3,h4,h5,h6,[role=heading],["+PRIMARY_ATTR+"]"))continue;
    const size=parseFloat(getComputedStyle(el).fontSize||"0");
    if(size>0&&size<16){el.style.setProperty("font-size","16px","important");el.dataset.khaemenesMinText="16"}
  }
}
function installTypography(){
  if(!document.head||!document.body)return;
  if(!document.getElementById(STYLE_ID)){
    const style=document.createElement("style");style.id=STYLE_ID;
    style.textContent=`
html:root body{font-size:16px!important}
html:root body :is(
 p,li,dt,dd,blockquote,figcaption,caption,legend,label,a,button,input,select,textarea,option,output,
 td,th,summary,small,strong,em,b,i,u,s,mark,time,.eyebrow,.kicker,.subtitle,.subheading,.lead,.description,
 .breadcrumbs,.breadcrumb,.badge,.chip,.pill,.status,.meta,.caption,.note,.helper,.hint,.message,.toast,
 .brand-name,.brand-sub,.menu-group,.menu-link,.menu-link small,.menu-link strong
){font-size:max(16px,1em)!important}
html:root body :is(
 h1,h2,h3,h4,h5,h6,[role="heading"],.page-title,.hero-title,.main-title,.section-title,.card-title,
 .display-title,.site-title,.brand-title,.modal-title,.dialog-title
){font-size:33px!important;line-height:1.2!important;font-weight:400!important;overflow-wrap:anywhere;text-wrap:balance}
html:root body [${PRIMARY_ATTR}="true"]{font-size:66px!important;line-height:1.05!important;font-weight:400!important;overflow-wrap:anywhere;text-wrap:balance}
@media(max-width:560px){html:root body [${PRIMARY_ATTR}="true"]{font-size:66px!important}}
@media print{html:root body{font-size:16px!important}}
`;document.head.append(style);
  }
  markPrimary();enforceFloor();
  document.documentElement.dataset.khaemenesAcademyCoreTypography="16-33-66";
}

const LABELS=".eyebrow,.kicker,[data-eyebrow],[data-kicker]";
const clean=s=>String(s||"").replace(/\s+/g," ").trim();
const words=s=>clean(s).split(/\s+/).filter(Boolean);
const brandLike=s=>/^(?:verve\s*n\s*veda|khaemenes academy)(?:\b|\s*[·|—-])/i.test(clean(s));
const titleLike=s=>{const t=clean(s),w=words(t);return !!t&&t.length<=100&&w.length>=1&&w.length<=10&&!/[.!?…]$/.test(t)};
const sentenceLike=s=>{const t=clean(s),w=words(t);return /[.!?…]$/.test(t)||w.length>=9||(w.length>=6&&/[,;:]/.test(t))};
function normalizeLabel(label){
  if(!label||label.dataset.khaemenesHierarchyChecked==="true")return;
  label.dataset.khaemenesHierarchyChecked="true";
  if(label.closest("nav,footer,[data-khaemenes-no-semantic-normalize]"))return;
  const heading=label.nextElementSibling;
  if(!heading||!/^H[1-6]$/.test(heading.tagName)||label.children.length||heading.children.length)return;
  const eyebrowText=clean(label.textContent),headingText=clean(heading.textContent);
  if(!sentenceLike(headingText)||!titleLike(eyebrowText))return;
  if(brandLike(eyebrowText)){heading.dataset.khaemenesHierarchyReview="brand-eyebrow-sentence-heading";return}
  const desc=document.createElement("p");desc.className="khaemenes-section-description";desc.textContent=headingText;
  desc.dataset.khaemenesDemotedFromHeading="true";
  heading.dataset.khaemenesOriginalHeading=headingText;heading.dataset.khaemenesPromotedFromEyebrow=eyebrowText;heading.textContent=eyebrowText;
  label.dataset.khaemenesOriginalEyebrow=eyebrowText;label.textContent="Khaemenes Academy";
  heading.insertAdjacentElement("afterend",desc);
  heading.closest("section,article,header,main,div")?.setAttribute("data-khaemenes-hierarchy-normalized","true");
}
function normalizeHierarchy(root=document){
  root.querySelectorAll?.(LABELS).forEach(normalizeLabel);
  document.documentElement.dataset.khaemenesHierarchy="title-description-v1";
}
function mount333(){try{window.VNV333Ticker?.mount?.()}catch{}}
function mountAuto(){try{if(!document.getElementById("vnvTickerAutoPopulate"))window.VNV_TICKER?.autoPopulate?.({mode:"auto"})}catch{}mount333()}
function mountHeader(){
  try{window.VNV_HEADER?.mount?.({
    title:"Khaemenes Academy",
    subtitle:"Front Desk · Enrollment · Directory · Support",
    icon:"KA",
    home:"https://vervenveda.com/",
    actions:[
      {label:"Front Desk",href:ROOT+"#frontdesk"},
      {label:"Schools",href:ROOT+"#schools"},
      {label:"Services",href:ROOT+"#services"},
      {label:"Ecosystem",href:"https://vervenveda.com/#directory"},
      {label:"Family",href:ROOT+"family/"}
    ]
  })}catch{}
}
function mountToolbar(){
  try{window.VNVEcosystemToolbar?.mount?.()}catch{}
  const dock=document.getElementById("vnvEcosystemUtilityDock");
  if(dock){dock.style.setProperty("left","auto","important");dock.style.setProperty("right","max(12px, env(safe-area-inset-right))","important");dock.dataset.khaemenesAcademyCoreCanonicalToolbar="true"}
}
let pending=false;
function schedule(){
  if(pending)return;pending=true;
  requestAnimationFrame(()=>{pending=false;installTypography();normalizeHierarchy(document);mount333();mountAuto();mountHeader();mountToolbar()});
}
async function start(){
  if(!document.body)return;
  installTypography();normalizeHierarchy(document);
  await load(SCRIPTS.ticker333,"khaemenesAcademyCore333");mount333();
  await load(SCRIPTS.tickerAuto,"khaemenesAcademyCoreAuto");mountAuto();
  await load(SCRIPTS.header,"khaemenesAcademyCoreHeader");mountHeader();
  await load(SCRIPTS.toolbar,"khaemenesAcademyCoreToolbar");mountToolbar();
  document.documentElement.dataset.khaemenesAcademyCoreChrome="333-auto-header-menu-toolbar";
  if(typeof MutationObserver==="function")new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("resize",schedule,{passive:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();