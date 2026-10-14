/* Academy navigation v1 · all public Academy pages, no learner-record mutations. */
(()=>{"use strict";
const script=document.currentScript;
if(!script)return;
const root=new URL("../",script.src),home=new URL("index.html",root).href;
const link=path=>new URL(path,root).href;
const css=document.createElement("style");css.textContent=`
#khae-global-nav{max-width:1100px;margin:11px auto;padding:11px 14px;background:#fffdf9;color:#203027;border:1px solid #d2c4a9;border-radius:7px;font:14px/1.5 system-ui,sans-serif;text-align:center}
#khae-global-nav *{box-sizing:border-box;word-break:normal;overflow-wrap:normal;hyphens:manual}
#khae-global-nav .khae-nav-inner{display:flex;justify-content:center;align-items:center;gap:11px;flex-wrap:wrap}
#khae-global-nav a{color:#193e34;text-decoration:underline;text-underline-offset:3px}
#khae-global-nav summary{cursor:pointer;list-style:none;padding:9px 14px;border:1px solid #baa681;border-radius:7px;background:#fffefa;color:#1d322a}
#khae-global-nav summary::-webkit-details-marker{display:none}
#khae-global-nav details{position:relative}
#khae-global-nav .khae-nav-options{display:grid;grid-template-columns:repeat(2,minmax(140px,1fr));gap:7px;padding:11px;background:#fffefa;border:1px solid #c5b494;border-radius:7px;min-width:min(330px,90vw);position:absolute;top:100%;left:50%;transform:translateX(-50%);z-index:200}
#khae-global-nav .khae-nav-options a{padding:8px;border:1px solid #eee4d6;border-radius:7px;text-align:center}
#khae-global-nav .khae-breadcrumbs{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:7px;font-size:13px;padding:8px 0 0}
#khae-global-nav :focus-visible{outline:3px solid #9b7842;outline-offset:2px}
@media(max-width:450px){#khae-global-nav .khae-nav-options{grid-template-columns:1fr;min-width:230px}}
`;document.head.append(css);
function init(){
if(document.getElementById("khae-global-nav"))return;
const path=decodeURIComponent(location.pathname).replace(/\\/g,"/"),relative=path.startsWith(root.pathname)?path.slice(root.pathname.length):"";
const name=relative?relative.replace(/index\.html$/,"").replace(/[_/-]+/g," ").trim()||"Academy Home":"Academy Home";
const wrap=document.createElement("nav");wrap.id="khae-global-nav";wrap.setAttribute("aria-label","Academy-wide navigation and breadcrumbs");
const main=document.createElement("div");main.className="khae-nav-inner";
const brand=document.createElement("a");brand.href="https://vervenveda.com/";brand.textContent="Verve N Veda Home";brand.setAttribute("aria-label","Return to Verve N Veda home");
const menu=document.createElement("details"),summary=document.createElement("summary");summary.textContent="Academy Menu ▾";menu.append(summary);
const options=document.createElement("div");options.className="khae-nav-options";
for(const [label,url] of [["Academy Home",home],["Student Profile",link("student/index.html")],["My Pinned Courses",link("student/index.html")],["Family Profile",link("family/index.html")],["High School", "https://vervenveda.com/Khaemenes_High.github.io/"],["Offline Learning",link("offline/index.html")],["Teacher Admin",link("teacher-admin/index.html")],["Mentor",link("mentor/index.html")]]){
const a=document.createElement("a");a.href=url;a.textContent=label;options.append(a)}
menu.append(options);main.append(brand,menu);wrap.append(main);
const crumbs=document.createElement("div");crumbs.className="khae-breadcrumbs";crumbs.setAttribute("aria-label","Breadcrumb");
const a=document.createElement("a");a.href=home;a.textContent="Academy";crumbs.append(a);
if(relative&&relative!=="index.html"){
for(const [text,url] of [["Student Profile",link("student/index.html")]]){const sep=document.createElement("span");sep.textContent="›";const b=document.createElement("a");b.href=url;b.textContent=text;crumbs.append(sep,b)}
const sep=document.createElement("span");sep.textContent="›";const current=document.createElement("span");current.textContent=name.replace(/\b\w/g,c=>c.toUpperCase());current.setAttribute("aria-current","page");crumbs.append(sep,current)}
wrap.append(crumbs);
const anchor=document.querySelector("main");if(anchor)anchor.before(wrap);else document.body.prepend(wrap);
for(const logo of document.querySelectorAll("header a.brand, .top a.brand")){logo.href="https://vervenveda.com/";logo.setAttribute("aria-label","Return to Verve N Veda home")}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();