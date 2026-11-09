/* Universal three-tool learner profile rail, presentation-only.
 * Reuses the enrolled learner's existing picture/hero adapter and Yearbook.
 * Does not create learner records, grant permissions or sync cloud data.
 */
(function(w,d){"use strict";
if(w.KhaemenesProfileCreativeRail)return;
const ROOT="https://vervenveda.com/Academy-Yearbook.github.io/";
const ids={preschool:"khaePrekUniversalLookEntry",elementary:"elementaryPageTitleHero",kindergarten:"kinderToolbarPictureEditor",middle:"middleEnrolledTools",higher:"higherProfilePhotoEntry"};
const supported=new Set(Object.keys(ids));
const activeLearner=()=>{try{
 const l=w.KhaemenesFamilyRegistry?.getLearner?.()||w.KhaemenesStudentProfileV2?.activeLearner?.();
 return l?.learnerId||null;
}catch{return null}};
function button(title){const b=d.createElement("button");b.type="button";b.textContent=title;b.className="khae-creative-rail-btn";return b}
function mount(stage,hostId=ids[stage]){
 if(!supported.has(stage)||!hostId)return false;
 const host=d.getElementById(hostId);if(!host)return false;
 const parent=hostId==="kinderToolbarPictureEditor"?host.parentElement:host;
 if(!parent)return false;
 const key="khaeCreativeRail-"+stage;if(d.getElementById(key))return true;
 const rail=d.createElement("nav");rail.id=key;rail.setAttribute("aria-label","My profile creative tools");
 rail.style.cssText="box-sizing:border-box;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;width:100%;margin:14px 0;padding:12px;border:1px solid #b48b45;border-radius:7px;background:#f4f0e7;color:#243038";
 const status=d.createElement("p");status.setAttribute("role","status");status.style.cssText="grid-column:1/-1;margin:0;font:400 16px/1.45 Nunito,Arial,sans-serif;color:#243038";status.hidden=true;
 const photo=button("Edit Profile Photo"),background=button("Edit Background"),yearbook=button("Yearbook");
 for(const b of [photo,background,yearbook])b.style.cssText="box-sizing:border-box;width:100%;min-height:48px;padding:10px 8px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9;-webkit-text-fill-color:#fff8e9;font:400 16px/1.4 Nunito,Arial,sans-serif;cursor:pointer;text-align:center";
 const explain=t=>{status.textContent=t;status.hidden=false};
 photo.addEventListener("click",()=>{
  const ok=w.KhaemenesUniversalProfileLookEditor?.open?.("picture");
  if(!ok)explain("Choose an enrolled learner and, where requested, confirm family help to edit their photo.");
 });
 background.addEventListener("click",()=>{
  const ok=w.KhaemenesUniversalProfileLookEditor?.open?.("background");
  if(!ok)explain("Select an eligible learner to edit their profile and hero colors or image.");
 });
 yearbook.addEventListener("click",()=>{
  const id=activeLearner(),bridge=w.KhaemenesYearbookProfileImages;
  if(id&&bridge?.openYearbook?.(id))return;
  explain("Choose an existing learner to open their Yearbook. The original images remain in the Yearbook gallery.");
 });
 rail.append(photo,background,yearbook,status);
 if(stage==="kindergarten")parent.insertAdjacentElement("afterend",rail);
 else if(stage==="elementary")parent.insertAdjacentElement("afterend",rail);
 else if(stage==="preschool")parent.insertAdjacentElement("afterend",rail);
 else parent.insertAdjacentElement("afterend",rail);
 // Prevent the historical navigation rail from creating a second copy.
 return true;
}
w.KhaemenesProfileCreativeRail=Object.freeze({version:"1.0",mount});
})(window,document);
