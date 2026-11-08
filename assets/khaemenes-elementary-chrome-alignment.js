/* Elementary · canonical chrome alignment 1.0
 * Page-scoped, idempotent and presentation-only. Compensates for a 333 ticker
 * that mounts after the shared header counts ticker heights. Does not mount
 * or remove any ticker/header, touch learner data, or change shared engines.
 */
(()=>{"use strict";
const w=window,d=document;
if(w.KhaemenesElementaryChromeAlignment||d.body?.dataset.profileStage!=="elementary")return;
const IDS=["vnv333NetworkTicker","vnvTickerAutoPopulate"];
let queued=false;
const observed=new Map();
const resizeObserver=typeof ResizeObserver==="function"?new ResizeObserver(()=>request()):null;
function reconcile(){
 const header=d.getElementById("vnvHeaderAutoPopulate");
 if(!header)return;
 let top=0,found=0;
 for(const id of IDS){
  const el=d.getElementById(id);
  if(!el||getComputedStyle(el).display==="none")continue;
  top+=Math.ceil(el.getBoundingClientRect().height||0);
  found++;
  if(resizeObserver&&observed.get(id)!==el){
   if(observed.has(id))resizeObserver.unobserve(observed.get(id));
   resizeObserver.observe(el);observed.set(id,el);
  }
 }
 // Wait until the authorized pair exists; don't override the shared header
 // while only one ticker has mounted.
 if(found!==2)return;
 const value=top+"px";
 if(d.documentElement.style.getPropertyValue("--vnv-header-top")!==value)
  d.documentElement.style.setProperty("--vnv-header-top",value);
}
function request(){
 if(queued)return;
 queued=true;
 w.requestAnimationFrame(()=>{queued=false;reconcile()});
}
const important=new Set([...IDS,"vnvHeaderAutoPopulate"]);
const observer=new MutationObserver(records=>{
 for(const record of records){
  for(const n of [...record.addedNodes,...record.removedNodes]){
   if(n.nodeType!==1)continue;
   if(important.has(n.id)||[...important].some(id=>n.querySelector?.('[id="'+id+'"]'))){
    request();return;
   }
  }
 }
});
if(d.body)observer.observe(d.body,{childList:true,subtree:false});
w.addEventListener("resize",request,{passive:true});
w.addEventListener("pageshow",request,{passive:true});
w.addEventListener("load",request,{once:true});
request();
w.KhaemenesElementaryChromeAlignment=Object.freeze({version:"1.0.0",recheck:reconcile});
})();
