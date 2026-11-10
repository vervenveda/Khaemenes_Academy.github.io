/* Khaemenes Academy — parent schedule mirror v1.
 * Read-only rendering helper. Navigation is permission-gated by Family Portal.
 * Never claims academic authority, fabricates grades, or changes learner context.
 */
(function(root,factory){
 "use strict";const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.KhaemenesParentScheduleMirror=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const gradeNumber=value=>{const n=Number(String(value||"").replace(/^grade[- ]?/i,""));return Number.isInteger(n)&&n>=9&&n<=12?n:null};
 const allowedHref=(value,base="https://vervenveda.com/")=>{
  if(typeof value!=="string"||!value.trim())return "";
  try{
   const url=new URL(value,base),host=url.hostname.toLowerCase();
   return url.protocol==="https:"&&(host==="vervenveda.com"||host==="www.vervenveda.com"||host==="vervenveda.github.io")?url.href:"";
  }catch{return ""}
 };
 function rows(learner,snapshots,options={}){
  const grade=gradeNumber(learner?.grade);
  const source=Array.isArray(snapshots)?snapshots.filter(x=>x&&typeof x.courseId==="string"):[];
  const cat=options.catalog;
  if(!grade||!cat||typeof cat.slots!=="function")return [];
  const ids=source.map(x=>x.courseId);
  const math=ids.find(x=>x==="pre-algebra"||x==="algebra-1"||x==="geometry"||x==="algebra-2")||null;
  const language=ids.find(x=>/^world-language-9-(spanish|french|german|mandarin|japanese|arabic|russian)$/.test(x));
  const slots=cat.slots(grade,{mathId:math,language:language?language.slice("world-language-9-".length):""});
  return slots.map(s=>{
   const record=s.id?source.find(x=>x.courseId===s.id):null;
   const pct=record?.stale?null:record?.progress?.percent;
   const percent=typeof pct==="number"&&Number.isFinite(pct)&&pct>=0&&pct<=100?Math.round(pct):null;
   const href=allowedHref(s.href||"",options.base);
   const next=record&&!record.stale?allowedHref(record.nextHref||"",options.base):"";
   return Object.freeze({index:s.index,subject:s.subject,label:s.label,
    title:s.title||s.label,courseId:s.id||null,href:href||next||"",
    reported:!!record,stale:!!record?.stale,percent,
    nextHref:next,needsChoice:!s.id,
    status:!record?"Not reported":record.stale?"Refresh required":percent===null?"Progress not reported":percent+"% complete"});
  });
 }
 return Object.freeze({version:"1.0",rows,allowedHref,gradeNumber});
});
