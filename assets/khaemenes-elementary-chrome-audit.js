/* Elementary Student Profile · forensic VNV chrome/layout probe v1.0.
 * Opt-in: ?chrome_audit=1 ; intentionally no cookies, account/registry access,
 * localStorage/sessionStorage, fetch, transmissions or mutations to school UI.
 * Audits chrome presence, duplicates, visibility, placement, and change events.
 */
(()=>{"use strict";
if(new URLSearchParams(location.search).get("chrome_audit")!=="1"||window.KhaemenesElementaryChromeAudit)return;
const d=document,w=window,targets=[
 ["333 ticker","vnv333NetworkTicker"],
 ["Auto ticker","vnvTickerAutoPopulate"],
 ["VNV header","vnvHeaderAutoPopulate"],
 ["Branched menu","vnvEnrichedMenuOverlay"],
 ["Ecosystem utility rail","vnvEcosystemUtilityDock"],
 ["Profile chooser","vnvProfileGradeChooser"],
 ["Elementary local header","elementary:local-header"],
 ["Student hero","elementary:hero"],
 ["Hero action row","kepHeroActionsBelow"],
 ["Profile tool section","khaemenesElementaryProfileTools"],
 ["Four tool families","elementary:tool-groups"],
 ["Original editor panel","kepOriginalPictureTools"]
];
const traces=[];let panel=null,pre=null,queued=false,closed=false;
const elapsed=()=>Math.round(performance.now())+"ms";
const query=id=>id==="elementary:local-header"?[...d.querySelectorAll("header.top")]:id==="elementary:hero"?[...d.querySelectorAll("main .card.hero")]:id==="elementary:tool-groups"?[...d.querySelectorAll("#khaemenesElementaryProfileTools .kep-group")]:[...d.querySelectorAll('[id="'+id+'"]')];
const rectInfo=el=>{
 try{
  const c=getComputedStyle(el),r=el.getBoundingClientRect(),visible=el.isConnected&&c.display!=="none"&&c.visibility!=="hidden"&&Number(c.opacity)>0&&r.width>0&&r.height>0;
  return (visible?"PRESENT":"HIDDEN")+" · "+Math.round(r.width)+"×"+Math.round(r.height)+" @ "+Math.round(r.x)+","+Math.round(r.y)+" · "+c.position+" · z="+c.zIndex+" · bg="+c.backgroundColor+" · parent="+(el.parentElement?.tagName?.toLowerCase()||"?");
 }catch{return "computed style unavailable"}
};
const row=([name,id])=>{
 const arr=query(id);
 return name+": "+(!arr.length?"MISSING":(id==="elementary:tool-groups"?"groups="+arr.length:"count="+arr.length)+(arr.length>1&&id!=="elementary:tool-groups"?" [DUPLICATE]":"")+" · "+rectInfo(arr[0]));
};
const scriptInventory=()=>{
 const files=[...d.scripts].map(e=>e.getAttribute("src")||"").filter(Boolean);
 const p=/(vnv-333-ticker|vnv-ticker-autopopulate|vnv-ecosystem-toolbar|khaemenes-student-profile-v2|khaemenes-student-profile-ui-v2|khaemenes-universal-profile-look-editor|khaemenes-elementary-look-adapter|khaemenes-elementary-profile-enhancement)/;
 return files.filter(x=>p.test(x)).map(x=>x.split("/").pop().split("?")[0]).map(n=>n+" ×"+files.filter(x=>x.split("/").pop().split("?")[0]===n).length).filter((x,i,a)=>a.indexOf(x)===i);
};
const cssInventory=()=>{
 const c=[...d.querySelectorAll('link[rel="stylesheet"]')].map(e=>e.getAttribute("href")||"");
 return c.map(x=>x.split("/").pop().split("?")[0]).filter(x=>/profile|elementary|vnv/i.test(x));
};
const heroStyleEvidence=()=>{
 const hero=query("elementary:hero")[0];if(!hero)return ["Hero: MISSING"];
 const c=getComputedStyle(hero),state=hero.dataset.kepCustomColor,computed=c.backgroundColor;
 const expected="rgb(255, 248, 233)";
 const inline=hero.style.backgroundColor||"";
 const normalized=(value)=>{const temp=d.createElement("span");temp.style.color=value;return temp.style.color.trim().replace(/\s+/g,"");};
 const selectedMismatch=state==="true"&&inline&&normalized(inline)!==normalized(computed);
 return [
  "Enhancement mounted: "+hero.classList.contains("kep-card-enhanced"),
  "Appearance mode: "+(state==="true"?"STUDENT-SELECTED CARD COLOR":state==="false"?"DEFAULT CREAM":"UNMARKED"),
  "Inline background: "+(hero.style.backgroundColor||"(unset)"),
  "Computed background: "+computed,
  "Computed background image: "+c.backgroundImage.slice(0,120),
  "Unexpected default background: "+(state==="false"&&computed!==expected?"YES — CSS CASCADE SUSPECT":"not demonstrated"),
  "Selected color overridden: "+(selectedMismatch?"YES — computed color differs from inline selection":"no"),
  "No appearance records or storage were inspected"
 ];
};
const conflictNotes=()=>{
 const notes=[];
 if(query("vnvHeaderAutoPopulate").length&&query("elementary:local-header").length)notes.push("DUAL HEADER CANDIDATE: shared VNV header + local Elementary header");
 if(query("vnv333NetworkTicker").length>1||query("vnvTickerAutoPopulate").length>1)notes.push("DUPLICATE TICKER NODE");
 if(query("vnvEcosystemUtilityDock").length>1)notes.push("DUPLICATE UTILITY RAIL");
 const auto=query("vnvTickerAutoPopulate")[0],header=query("vnvHeaderAutoPopulate")[0];
 if(auto&&header&&auto.getBoundingClientRect().height>0&&header.getBoundingClientRect().height>0){
  const ar=auto.getBoundingClientRect(),hr=header.getBoundingClientRect();
  if(hr.top < ar.bottom-1 && hr.bottom > ar.top+1)notes.push("STICKY HEADER OVERLAPS AUTO TICKER by "+Math.round(ar.bottom-hr.top)+"px");
 }
 if(query("elementary:tool-groups").length!==4)notes.push("TOOL GROUPS: expected four; actual "+query("elementary:tool-groups").length);
 const hero=query("elementary:hero")[0],actions=query("kepHeroActionsBelow")[0];
 if(hero&&actions&&hero.contains(actions))notes.push("HERO ACTIONS STILL INSIDE CARD");
 if(actions&&actions.children.length!==4)notes.push("HERO ACTION COUNT "+actions.children.length+" (expected 4)");
 const ids=["adultConfirm","avatars","photoFile","themes","exportVisual","importVisual"];
 for(const id of ids){const n=query(id).length;if(n!==1)notes.push(id+" count="+n+" (expected 1)")}
 if(!notes.length)notes.push("No obvious duplicate chrome/profile nodes in current snapshot; runtime styles may still compete");
 return notes;
};
const display=()=>{
 if(closed||!d.body)return;
 if(!panel){
  panel=d.createElement("aside");panel.id="elementaryChromeAuditPanel";panel.setAttribute("role","region");panel.setAttribute("aria-label","Elementary profile chrome audit");
  panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:8px;bottom:8px;width:min(760px,calc(100vw - 16px));max-height:54vh;overflow:auto;padding:13px 15px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 16px/1.45 ui-monospace,monospace!important;box-shadow:0 12px 40px #0009";
  const h=d.createElement("h2");h.textContent="Elementary · Chrome & Profile Forensic Audit";h.style.cssText="font:400 20px/1.35 Georgia,serif!important;color:#fff8e9!important;margin:0 0 10px";
  const close=d.createElement("button");close.type="button";close.textContent="Close diagnostics";close.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:9px 12px;margin-bottom:10px;font-size:16px!important";
  close.addEventListener("click",()=>{closed=true;observer.disconnect();panel.remove();panel=null;pre=null});
  const copy=d.createElement("button");copy.type="button";copy.textContent="Copy findings";copy.style.cssText="background:#fff8e9!important;color:#243038!important;border:0;border-radius:7px;padding:9px 12px;margin:0 0 10px 10px;font-size:16px!important";
  copy.addEventListener("click",()=>{if(pre){const t=d.createElement("textarea");t.value=pre.textContent;t.style.cssText="position:fixed;left:-9999px";d.body.append(t);t.select();try{d.execCommand("copy")}catch{}t.remove()}});
  pre=d.createElement("pre");pre.style.cssText="font:inherit!important;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:#fff8e9!important;background:transparent!important";
  panel.append(h,close,copy,pre);d.body.append(panel);
 }
 const report="Current DOM (no student data):\n"+targets.map(row).join("\n")+
 "\n\nPotential conflicts:\n"+conflictNotes().join("\n")+"\n\nHero appearance evidence (no student data):\n"+heroStyleEvidence().join("\n")+
 "\n\nLoaded relevant scripts:\n"+scriptInventory().join("\n")+
 "\n\nProfile stylesheets:\n"+cssInventory().join("\n")+
 "\n\nEvent timeline:\n"+traces.slice(-18).join("\n");
 pre.textContent=report;
};
const record=note=>{if(closed)return;traces.push(elapsed()+" "+note);if(traces.length>60)traces.shift();if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;display()})}};
const monitored=new Set(["vnv333NetworkTicker","vnvTickerAutoPopulate","vnvHeaderAutoPopulate","vnvEnrichedMenuOverlay","vnvEcosystemUtilityDock","vnvProfileGradeChooser","kepHeroActionsBelow","khaemenesElementaryProfileTools","kepOriginalPictureTools"]);
function matched(node){
 if(node.nodeType!==1)return [];
 const el=node;const names=[];
 if(monitored.has(el.id))names.push("#"+el.id);
 if(el.matches?.("header.top,main .card.hero,.kep-group"))names.push(el.matches("header.top")?"local header":el.matches("main .card.hero")?"student hero":"tool family");
 for(const id of monitored)if(el.querySelector?.('[id="'+id+'"]'))names.push("#"+id+" descendant");
 if(el.querySelector?.("header.top,main .card.hero,.kep-group"))names.push("profile/chrome descendant");
 return names;
}
const observer=new MutationObserver(records=>{
 const notes=[];
 for(const r of records){
  if(panel&&(r.target===panel||panel.contains(r.target)))continue;
  if(r.type==="attributes"){
   const hit=matched(r.target);if(hit.length)notes.push("ATTRIBUTE "+r.attributeName+" "+hit.slice(0,2).join(","));
   continue;
  }
  for(const node of r.addedNodes){const hit=matched(node);if(hit.length)notes.push("ADDED "+hit.slice(0,3).join(","))}
  for(const node of r.removedNodes){const hit=matched(node);if(hit.length)notes.push("REMOVED "+hit.slice(0,3).join(","))}
 }
 if(notes.length)record([...new Set(notes)].slice(0,8).join("; "));
});
function begin(){
 observer.observe(d.body,{childList:true,subtree:true,attributes:true,attributeFilter:["style","hidden","class","aria-hidden"]});
 record("Probe started"); 
}
if(d.body)begin();else d.addEventListener("DOMContentLoaded",begin,{once:true});
d.addEventListener("DOMContentLoaded",()=>record("DOMContentLoaded"),{once:true});
w.addEventListener("load",()=>record("window load"),{once:true});
w.addEventListener("pageshow",()=>record("pageshow"));
w.addEventListener("error",e=>{
 if(e.target&&e.target!==w&&e.target.tagName==="SCRIPT")record("SCRIPT LOAD ERROR: "+(e.target.src||"").split("/").pop().split("?")[0]);
 else if(e.message)record("JS ERROR: "+String(e.message).slice(0,140));
},true);
w.addEventListener("unhandledrejection",e=>record("PROMISE REJECTION: "+String(e.reason?.message||"unknown").slice(0,140)));
w.KhaemenesElementaryChromeAudit=Object.freeze({version:"1.0.0",snapshot:()=>targets.map(row),events:()=>traces.slice(),conflicts:conflictNotes,heroStyle:heroStyleEvidence});
})();
