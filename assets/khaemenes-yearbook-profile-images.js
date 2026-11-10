/* Yearbook profile photo references: explicit learner opt-in, no gallery duplication. */
(function(w,d){"use strict";
if(w.KhaemenesYearbookProfileImages)return;
const KEY="khaemenes.yearbook.profileChoices.v1:",PAT=/^p_[a-z0-9_]+$/i,DATA=/^data:image\/(jpeg|png|webp|gif);base64,[a-z0-9+/=]+$/i;
function owner(){try{
 const a=w.KhaemenesFamilyRegistry?.getLearner?.()?.learnerId,b=w.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 if(a&&b&&a!==b)return null;
 const v=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null"),id=typeof v==="string"?v:v?.learnerId;
 const r=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
 const activeFamily=JSON.parse(localStorage.getItem("khaemenes_active_family_v1")||"null");
 const learner=id&&r?.learners?.[id];
 const family=learner&&r?.families?.[learner.familyId];
 if(!id||learner?.learnerId!==id||!activeFamily||learner.familyId!==activeFamily||
    family?.familyId!==activeFamily||!Array.isArray(family.learnerIds)||!family.learnerIds.includes(id))return null;
 if((a&&a!==id)||(b&&b!==id))return null;
 return id;
}catch{return null}}
const key=id=>KEY+encodeURIComponent(id);
const refs=id=>{try{const a=JSON.parse(localStorage.getItem(key(id))||"[]");return Array.isArray(a)?[...new Set(a.filter(x=>typeof x==="string"&&PAT.test(x)))].slice(0,50):[]}catch{return []}};
function getPhoto(id){return new Promise((resolve,reject)=>{
 if(!PAT.test(id)||!w.indexedDB)return resolve(null);
 const request=indexedDB.open("KhaemenesYearbook",1);
 request.onerror=()=>reject(Error("Yearbook unavailable"));
 request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains("photos"))request.result.createObjectStore("photos",{keyPath:"id"})};
 request.onsuccess=()=>{const db=request.result,req=db.transaction("photos","readonly").objectStore("photos").get(id);
 req.onsuccess=()=>{db.close();resolve(req.result||null)};req.onerror=()=>{db.close();reject(Error("Photo unavailable"))};
 };
})}
async function publish(learnerId,id){
 if(!learnerId||owner()!==learnerId||!PAT.test(id))return false;
 const p=await getPhoto(id);if(!p||!DATA.test(p.data||"")||p.data.length>20*1024*1024||owner()!==learnerId)return false;
 const a=refs(learnerId);if(a.includes(id))return true;
 try{localStorage.setItem(key(learnerId),JSON.stringify([...a,id].slice(-50)));return refs(learnerId).includes(id)}catch{return false}
}
async function available(id){
 if(owner()!==id)return [];
 const a=[];for(const ref of refs(id)){const p=await getPhoto(ref);if(owner()!==id)return [];
  if(p&&DATA.test(p.data||"")&&p.data.length<=20*1024*1024)a.push({id:ref,data:p.data,caption:String(p.caption||"Yearbook picture").slice(0,90)})}
 return a;
}
function jpeg(src){return new Promise((resolve,reject)=>{
 if(!DATA.test(src)||src.length>20*1024*1024)return reject(Error("Invalid image"));
 const img=new Image();img.onerror=()=>reject(Error("Invalid image"));img.onload=()=>{
  try{const c=d.createElement("canvas");c.width=c.height=240;const ctx=c.getContext("2d"),n=Math.min(img.naturalWidth,img.naturalHeight);
   if(!ctx||!n)throw Error("Image unavailable");
   ctx.drawImage(img,(img.naturalWidth-n)/2,(img.naturalHeight-n)/2,n,n,0,0,240,240);
   for(const q of [.78,.62,.48,.34]){const result=c.toDataURL("image/jpeg",q);if(result.length<170000)return resolve(result)}
   reject(Error("Picture too large"));
  }catch(e){reject(e)}
 };img.src=src;
})}
function choose(id,commit){
 if(!id||owner()!==id||typeof commit!=="function")return false;
 const opener=d.activeElement,dlg=d.createElement("dialog");dlg.setAttribute("aria-label","Choose a picture from my Yearbook");
 dlg.style.cssText="width:min(720px,95vw);max-height:90dvh;overflow:auto;padding:20px;border:2px solid #b48b45;border-radius:7px;background:#fff9ef;color:#243038";
 const title=d.createElement("h2");title.textContent="Choose from My Yearbook";title.style.cssText="font:400 24px Cinzel,Georgia,serif";
 const text=d.createElement("p");text.textContent="Only pictures you explicitly linked to this learner appear. Choosing a picture does not change the original Yearbook image.";text.style.fontSize="16px";
 const status=d.createElement("p");status.setAttribute("role","status");status.style.fontSize="16px";
 const grid=d.createElement("div");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px";
 const close=d.createElement("button");close.type="button";close.textContent="Close";close.style.cssText="min-height:44px;padding:9px 16px;background:#243038;color:#fff8e9;border-radius:7px;font-size:16px";close.onclick=()=>dlg.close();
 const closeOnLearnerChange=()=>{if(dlg.open&&owner()!==id)dlg.close()};
 w.addEventListener("khaemenes-family-changed",closeOnLearnerChange);
 w.addEventListener("pageshow",closeOnLearnerChange);
 const onStorage=event=>{if(!event.key||["khaemenes_active_learner_v1","khaemenes_active_family_v1","khaemenes_family_registry_v1"].includes(event.key))closeOnLearnerChange()};
 w.addEventListener("storage",onStorage);
 dlg.addEventListener("close",()=>{
  w.removeEventListener("khaemenes-family-changed",closeOnLearnerChange);
  w.removeEventListener("pageshow",closeOnLearnerChange);
  w.removeEventListener("storage",onStorage);
  dlg.remove();if(opener?.isConnected)opener.focus({preventScroll:true});
 },{once:true});
 dlg.append(title,text,status,grid,close);d.body.append(dlg);dlg.showModal();close.focus();
 available(id).then(list=>{
  if(owner()!==id||!dlg.open){status.textContent="Learner changed. Reopen the picker.";return}
  status.textContent=list.length?"Choose a Yearbook photo below.":"No linked Yearbook pictures yet. Open Yearbook, select one and choose Make Available to My Profile.";
  for(const item of list){const b=d.createElement("button");b.type="button";b.style.cssText="min-height:170px;padding:9px;background:#243038;color:#fff8e9;border:1px solid #b48b45;border-radius:7px;font-size:16px";
   const img=d.createElement("img");img.src=item.data;img.alt="";img.style.cssText="width:100%;height:125px;object-fit:cover";
   const cap=d.createElement("span");cap.textContent=item.caption;b.append(img,cap);
   b.onclick=async()=>{if(owner()!==id)return; b.disabled=true;status.textContent="Preparing photo…";
    try{const data=await jpeg(item.data);if(owner()!==id||!dlg.open||await commit(data,id)!==true)throw Error("Save declined");dlg.close()}
    catch{status.textContent="Could not save the picture. Previous photo is unchanged.";b.disabled=false}};
   grid.append(b)}
 }).catch(()=>{status.textContent="Yearbook unavailable on this browser. Current photo is unchanged."});
 return true;
}
function openYearbook(id){
 if(!id||owner()!==id)return false;
 const opener=d.activeElement,dialog=d.createElement("dialog");dialog.setAttribute("aria-label","My Academy Yearbook Studio");
 dialog.style.cssText="box-sizing:border-box;width:min(1140px,calc(100vw - 18px));height:92dvh;max-height:92dvh;margin:auto;padding:0;overflow:hidden;background:#243038;color:#fff8e9;border:2px solid #b48b45;border-radius:7px";
 const container=d.createElement("div");container.style.cssText="display:flex;flex-direction:column;height:100%";
 const header=d.createElement("div");header.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px 14px;background:#243038;color:#fff8e9";
 const title=d.createElement("h2");title.textContent="My Yearbook";title.style.cssText="font:400 23px/1.3 Cinzel,Georgia,serif;margin:0";
 const close=d.createElement("button");close.type="button";close.textContent="Close Yearbook";close.style.cssText="min-height:44px;padding:8px 14px;border:1px solid #b48b45;border-radius:7px;background:#fff8e9;color:#243038;font:400 16px Nunito,Arial,sans-serif";
 close.onclick=()=>dialog.close();header.append(title,close);
 const note=d.createElement("p");note.textContent="Select a photo in Yearbook and choose Make Available to My Profile. Then return to your profile editor and choose it from My Yearbook.";note.style.cssText="margin:0;padding:9px 12px;background:#f5e8ce;color:#243038;font:400 16px/1.45 Nunito,Arial,sans-serif";
 const frame=d.createElement("iframe");frame.src="https://vervenveda.com/Academy-Yearbook.github.io/";frame.title="Academy Yearbook photo generator";frame.loading="lazy";frame.referrerPolicy="strict-origin-when-cross-origin";frame.style.cssText="display:block;width:100%;flex:1;min-height:0;border:0";
 const closeOnLearnerChange=()=>{if(dialog.open&&owner()!==id)dialog.close()};
 w.addEventListener("khaemenes-family-changed",closeOnLearnerChange);
 w.addEventListener("pageshow",closeOnLearnerChange);
 const onStorage=event=>{if(!event.key||["khaemenes_active_learner_v1","khaemenes_active_family_v1","khaemenes_family_registry_v1"].includes(event.key))closeOnLearnerChange()};
 w.addEventListener("storage",onStorage);
 dialog.addEventListener("close",()=>{
  w.removeEventListener("khaemenes-family-changed",closeOnLearnerChange);
  w.removeEventListener("pageshow",closeOnLearnerChange);
  w.removeEventListener("storage",onStorage);
  frame.src="about:blank";dialog.remove();
  if(opener?.isConnected)opener.focus({preventScroll:true});
 },{once:true});
 container.append(header,note,frame);dialog.append(container);d.body.append(dialog);dialog.showModal();close.focus();return true;
}
w.KhaemenesYearbookProfileImages=Object.freeze({version:"1.1",owner,publish,available,choose,openYearbook});
})(window,document);
