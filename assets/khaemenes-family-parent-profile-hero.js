/* Family Parent Profile Hero · presentation module v1.
 * Adapted from High School Grade 09 profile-row, dashboard-layout.js rail and
 * student-profile-photo.js framing; no student records or privileged authority.
 * Browser-local parent appearance only. This file is a public-safe UI module.
 */
(()=>{"use strict";
const g=window,d=document,ID="khaeFamilyParentProfileHero";
if(g.KhaemenesFamilyParentHero)return;
const registry=()=>g.KhaemenesFamilyRegistry;
const lookKey=id=>"khaemenes.parent.profile.appearance.v1:"+encodeURIComponent(id);
const photoKey=id=>"khaemenes.parent.profile.photo.v1:"+encodeURIComponent(id);
const SHAPES=["circle","oval","square","rectangle","rhombus","kite","heart","star","octagon","semicircle"];
const COLORS={charcoal:"#202724",forest:"#315c49",navy:"#263858",burgundy:"#643044",gold:"#a47f2f"};
let activeId=null,photoUrl=null;
const byId=id=>d.getElementById(id);
const read=(key)=>{try{return g.localStorage.getItem(key)}catch{return null}};
const save=(key,value)=>{try{g.localStorage.setItem(key,value);return true}catch{return false}};
const erase=(key)=>{try{g.localStorage.removeItem(key);return true}catch{return false}};
const adult=()=>{try{const r=registry(),id=r?.activeIds?.()?.adultId;const a=r?.getAdult?.();return a&&id&&a.adultId===id?a:null}catch{return null}};
const defaults=()=>({displayName:"",background:"charcoal",frame:"circle",badge:"",cardColor:"",nameFont:"academy"});
function appearance(id){
 if(!id)return defaults();
 try{
  const saved=JSON.parse(read(lookKey(id))||"null");
  return {displayName:typeof saved?.displayName==="string"?saved.displayName.slice(0,70):"",background:Object.hasOwn(COLORS,saved?.background)?saved.background:"charcoal",frame:SHAPES.includes(saved?.frame)?saved.frame:"circle",badge:typeof saved?.badge==="string"&&saved.badge.length<12?saved.badge:"",cardColor:typeof saved?.cardColor==="string"&&/^#[0-9a-f]{6}$/i.test(saved.cardColor)?saved.cardColor:"",nameFont:["academy","friendly","classic","modern","handwriting"].includes(saved?.nameFont)?saved.nameFont:"academy"};
 }catch{return defaults()}
}
function nameFor(a,look){return look.displayName||a?.displayName||"Parent / Guardian"}
function initials(name){return name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()||"P"}
function validPhoto(id){const x=id?read(photoKey(id)):null;return typeof x==="string"&&/^data:image\/jpeg;base64,/.test(x)&&x.length<400000?x:null}
function styleOnce(){
 if(byId("khaeFamilyParentHeroStyle"))return;
 const s=d.createElement("style");s.id="khaeFamilyParentHeroStyle";
 s.textContent=`
#${ID}{--kph-ink:#202724;--kph-cream:#fff8e9;--kph-paper:#fffaf0;--kph-gold:#b48b45;box-sizing:border-box;padding:32px 16px 24px;background:#f4efe6;color:#202724;scroll-margin-top:105px}
#${ID} *,#${ID} *::before,#${ID} *::after{box-sizing:border-box}
#${ID} .kph-shell{width:min(100%,940px);margin:0 auto}
#${ID} .kph-intro{text-align:center;margin:0 auto 18px;max-width:800px}
#${ID} .kph-intro p{margin:0;font:400 18px/1.55 Nunito,Arial,sans-serif}
#${ID} .kph-identity{display:grid;grid-template-columns:126px minmax(0,1fr);align-items:center;gap:19px;min-height:160px;padding:19px 23px;border:1px solid #b48b45;border-radius:7px 7px 0 0;background:#315c49;color:#fff8e9}
#${ID} .kph-identity[data-background=charcoal]{background:#202724}
#${ID} .kph-identity[data-background=navy]{background:#263858}
#${ID} .kph-identity[data-background=burgundy]{background:#643044}
#${ID} .kph-identity[data-background=gold]{background:#a47f2f;color:#202724}
#${ID} .kph-identity[data-background=gold] .kph-detail{color:#202724}
#${ID} .kph-avatar{width:116px;height:116px;display:grid;place-items:center;overflow:hidden;background:#f5e0ad;color:#202724;border:2px solid #b48b45;border-radius:50%;font:400 40px/1 Cinzel,Georgia,serif}
#${ID} .kph-avatar img{width:100%;height:100%;object-fit:cover}
#${ID} .kph-avatar[data-shape=oval]{height:124px;width:102px;border-radius:50%}
#${ID} .kph-avatar[data-shape=square]{border-radius:7px}
#${ID} .kph-avatar[data-shape=rectangle]{border-radius:7px;width:170px;height:113px}
#${ID} .kph-avatar[data-shape=semicircle]{border-radius:0;clip-path:polygon(0 100%,0 50%,4% 31%,15% 15%,31% 4%,50% 0,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)}
#${ID} .kph-avatar[data-shape=rhombus]{border-radius:0;clip-path:polygon(50% 0%,100% 50%,50% 100%,0 50%)}
#${ID} .kph-avatar[data-shape=kite]{border-radius:0;clip-path:polygon(50% 0%,100% 32%,50% 100%,0 32%)}
#${ID} .kph-avatar[data-shape=heart]{border-radius:0;clip-path:polygon(50% 94%,10% 57%,4% 28%,20% 7%,50% 26%,80% 7%,96% 28%,90% 57%)}
#${ID} .kph-avatar[data-shape=star]{border-radius:0;clip-path:polygon(50% 0%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)}
#${ID} .kph-avatar[data-shape=octagon]{border-radius:0;clip-path:polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)}
#${ID} .kph-name{margin:0 0 6px;font:400 clamp(25px,3vw,33px)/1.25 Cinzel,Georgia,serif;overflow-wrap:anywhere}
#${ID} .kph-detail{font:400 18px/1.5 Nunito,Arial,sans-serif;color:#fff8e9;margin:0}
#${ID} .kph-rail{padding:17px;background:#f9f5eb;border:1px solid #b48b45;border-top:0;border-radius:0 0 7px 7px}
#${ID} .kph-tools-title{margin:0 0 12px;text-align:center;font:400 24px/1.35 Cinzel,Georgia,serif;color:#202724}
#${ID} .kph-tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
#${ID} .kph-tool{display:flex;align-items:center;justify-content:center;min-height:56px;min-width:0;padding:10px 9px;border:1px solid #b48b45;border-radius:7px;background:#202724;color:#fff8e9;-webkit-text-fill-color:#fff8e9;text-decoration:none;text-align:center;font:400 16px/1.35 Nunito,Arial,sans-serif;cursor:pointer}
#${ID} .kph-tool:hover{background:#35433c}
#${ID} .kph-tool:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
#${ID} .kph-note{text-align:center;margin:13px 0 0;font:400 16px/1.5 Nunito,Arial,sans-serif;color:#34473c}
#kphParentDialog{width:min(94vw,600px);max-height:85vh;overflow:auto;margin:auto;padding:25px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#202724}
#kphParentDialog::backdrop{background:#111c19b3}
#kphParentDialog h2{margin:0 0 14px;font:400 33px/1.3 Cinzel,Georgia,serif}
#kphParentDialog p,#kphParentDialog label,#kphParentDialog .kph-status{font:400 18px/1.5 Nunito,Arial,sans-serif}
#kphParentDialog .kph-field{display:grid;gap:7px;margin:13px 0}
#kphParentDialog input:not([type=file]),#kphParentDialog select{width:100%;min-height:48px;border:1px solid #8b918c;border-radius:7px;padding:9px;background:#fff;color:#202724;font:400 18px Nunito,Arial,sans-serif}
#kphParentDialog input[type=file]{width:100%;font:400 18px Nunito,Arial,sans-serif}
#kphParentDialog .kph-buttons{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
#kphParentDialog button{min-height:48px;padding:9px 16px;border:1px solid #202724;border-radius:7px;background:#202724;color:#fff8e9;font:400 16px/1.4 Nunito,Arial,sans-serif;cursor:pointer}
#kphParentDialog button.kph-secondary{background:#fffaf0;color:#202724}
#kphParentDialog button:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
@media(max-width:650px){#${ID} .kph-tools{grid-template-columns:repeat(2,minmax(0,1fr))}#${ID} .kph-identity{grid-template-columns:1fr;justify-items:center;text-align:center}#${ID} .kph-intro p{font-size:18px}}
`;
 d.head.append(s)
}
const features=[
 ["Edit Profile", "edit"],
 ["Class Progress", "#family-progress"],
 ["Schedule", "#family-progress"],
 ["Family Records", "#family-records-controls"],
 ["Manage Learners", "enroll/#existing"],
 ["Parent Resources", "#family-involvement"],
 ["Edit Background", "background"],
 ["Edit Profile Photo", "picture"],
 ["Yearbook", "yearbook"]
];
function mount(){
 const node=byId(ID);if(node)return node;
 const before=byId("workspace"),after=byId("family-account-readiness");
 if(!before||!after||!before.parentElement||before.previousElementSibling!==after)return null;
 styleOnce();
 const section=d.createElement("section");section.id=ID;section.setAttribute("aria-label","Parent profile hero and tools");
 section.innerHTML='<div class="kph-shell"><div class="kph-intro"><p>My Family Profile</p></div><div class="kph-identity" id="kphIdentity"><div class="kph-avatar" id="kphAvatar" aria-label="Parent profile picture"><span>P</span></div><div><h2 class="kph-name" id="kphName">Parent / Guardian</h2><p class="kph-detail" id="kphDetail">Local family profile · Account sign-in not connected</p></div></div><nav class="kph-rail" aria-label="Parent Profile Tools"><h3 class="kph-tools-title">My Profile Tools</h3><div class="kph-tools" id="kphToolGrid"></div><p class="kph-note">Personalization stays on this browser; your existing family and course records are not changed.</p></nav></div>';
 const grid=section.querySelector("#kphToolGrid");
 for(const [label,dest] of features){
  const control=d.createElement(dest.startsWith("#")||dest.startsWith("enroll/")?"a":"button");
  control.className="kph-tool";control.textContent=label;
  if(control.tagName==="A")control.href=dest;
  else{control.type="button";control.dataset.editor=dest;control.addEventListener("click",()=>openEditor(dest))}
  grid.append(control);
 }
 before.before(section);return section;
}
function update(){
 const section=mount();if(!section)return;
 const a=adult(),id=a?.adultId||null;
 activeId=id;
 const look=appearance(id);
 const label=nameFor(a,look);
 byId("kphName").textContent=label;
 const fontMap={academy:'Cinzel,Georgia,serif',friendly:'Nunito,"Trebuchet MS",Arial,sans-serif',classic:'Georgia,"Times New Roman",serif',modern:'"Trebuchet MS",Arial,sans-serif',handwriting:'"Comic Sans MS","Trebuchet MS",cursive'};
 byId("kphName").style.fontFamily=fontMap[look.nameFont]||fontMap.academy;
 byId("kphName").style.fontWeight="400";
 byId("kphDetail").textContent=a?"Family profile on this device · No verified cloud sign-in":"Choose an existing family and adult profile below to personalize this space.";
 const hero=byId("kphIdentity");hero.dataset.background=look.background;
 const selected=look.cardColor||COLORS[look.background]||COLORS.charcoal;
 hero.style.backgroundColor=selected;
 const lum=hex=>{const parts=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*parts[0]+.7152*parts[1]+.0722*parts[2]};
 const light=lum("#fff8e9"),dark=lum("#202724"),bg=lum(selected),ratio=(x,y)=>(Math.max(x,y)+.05)/(Math.min(x,y)+.05);
 const ink=ratio(bg,dark)>ratio(bg,light)?"#202724":"#fff8e9";
 hero.style.color=ink;byId("kphDetail").style.color=ink;
 const face=byId("kphAvatar");face.dataset.shape=look.frame;
 const photo=validPhoto(id);
 if(photo){const img=d.createElement("img");img.src=photo;img.alt="Parent profile photograph";face.replaceChildren(img)}
 else face.textContent=look.badge||initials(label);
 for(const x of section.querySelectorAll("[data-editor]")){x.disabled=!id;x.title=id?"": "Choose an adult family profile first."}
}
function dialog(){
 let box=byId("kphParentDialog");if(box)return box;
 box=d.createElement("dialog");box.id="kphParentDialog";box.setAttribute("aria-labelledby","kphDialogTitle");
 box.innerHTML='<h2 id="kphDialogTitle">Customize Parent Profile</h2><p>Save your appearance on this device only. This is separate from your Academy account password and your learners\' academic records.</p><form id="kphEditorForm" method="dialog"><div class="kph-field"><label for="kphDisplayName">Profile display name</label><input id="kphDisplayName" maxlength="70" autocomplete="off"></div><div class="kph-field"><label for="kphBackground">Profile background</label><select id="kphBackground"><option value="charcoal">Charcoal</option><option value="forest">Hunter Green</option><option value="navy">Deep Navy</option><option value="burgundy">Burgundy</option><option value="gold">Mustard Gold</option></select></div><div class="kph-field"><label for="kphFrame">Photo frame</label><select id="kphFrame">'+SHAPES.map(s=>'<option value="'+s+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</option>').join("")+'</select></div><div class="kph-field"><label for="kphPhotoFile">Choose a photo (JPG, PNG, WebP; up to 4 MB)</label><input id="kphPhotoFile" type="file" accept="image/jpeg,image/png,image/webp"></div><p class="kph-status" id="kphDialogStatus" role="status"></p><div class="kph-buttons"><button type="submit" value="save">Save My Look</button><button type="button" id="kphRemovePhoto" class="kph-secondary">Remove Photo</button><button type="button" id="kphClose" class="kph-secondary">Close</button></div></form>';
 d.body.append(box);
 byId("kphClose").addEventListener("click",()=>box.close());
 byId("kphRemovePhoto").addEventListener("click",()=>{if(!activeId)return;if(erase(photoKey(activeId))){update();byId("kphDialogStatus").textContent="Photo removed from this browser."}});
 byId("kphEditorForm").addEventListener("submit",async ev=>{
  ev.preventDefault();
  const a=adult(),id=a?.adultId;if(!id||id!==activeId){byId("kphDialogStatus").textContent="Select an adult family profile again.";return}
  const look={displayName:byId("kphDisplayName").value.trim().slice(0,70),background:byId("kphBackground").value,frame:byId("kphFrame").value};
  if(!Object.hasOwn(COLORS,look.background)||!SHAPES.includes(look.frame)){byId("kphDialogStatus").textContent="Choose a supported background and photo frame.";return}
  const file=byId("kphPhotoFile").files?.[0];
  let imageData=null;
  if(file){
   if(!["image/jpeg","image/png","image/webp"].includes(file.type)||!file.size||file.size>4*1024*1024){byId("kphDialogStatus").textContent="Choose a valid JPG, PNG or WebP photo under 4 MB.";return}
   const url=URL.createObjectURL(file);
   try{
    const image=new Image();await new Promise((ok,fail)=>{image.onload=ok;image.onerror=fail;image.src=url});
    if(!image.naturalWidth||!image.naturalHeight)throw Error("invalid photo");
    const canvas=d.createElement("canvas");canvas.width=canvas.height=240;
    const ctx=canvas.getContext("2d");if(!ctx)throw Error("image unavailable");
    const side=Math.min(image.naturalWidth,image.naturalHeight);
    ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,240,240);
    imageData=canvas.toDataURL("image/jpeg",.78);if(imageData.length>=400000)throw Error("compressed photo too large");
   }catch{byId("kphDialogStatus").textContent="Could not prepare this photo. Choose another.";return}
   finally{URL.revokeObjectURL(url)}
  }
  if(adult()?.adultId!==id){byId("kphDialogStatus").textContent="The selected adult changed. Reopen this editor.";return}
  if(!save(lookKey(id),JSON.stringify(look))){byId("kphDialogStatus").textContent="Unable to save your look in this browser.";return}
  if(imageData&&!save(photoKey(id),imageData)){byId("kphDialogStatus").textContent="Profile preferences saved, but the photo could not be stored.";update();return}
  byId("kphPhotoFile").value="";
  byId("kphDialogStatus").textContent="Profile look saved on this browser. Cloud sync is not connected.";
  update();
 });
 return box;
}
function openParentYearbook(){
 const a=adult();if(!a)return false;
 let dialog=byId("kphParentYearbookDialog");
 if(!dialog){
  dialog=d.createElement("dialog");dialog.id="kphParentYearbookDialog";
  dialog.setAttribute("aria-label","Family Yearbook");
  dialog.style.cssText="box-sizing:border-box;width:min(1120px,96vw);height:90dvh;max-height:90dvh;padding:0;overflow:hidden;border:2px solid #b48b45;border-radius:7px;background:#f4f0e7";
  const shell=d.createElement("div");shell.style.cssText="display:flex;flex-direction:column;height:100%";
  const bar=d.createElement("div");bar.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:11px 15px;background:#243038;color:#fff8e9";
  const heading=d.createElement("h2");heading.textContent="My Family Yearbook";heading.style.cssText="font:400 24px Cinzel,Georgia,serif;color:#fff8e9;margin:0";
  const close=d.createElement("button");close.type="button";close.textContent="Close Yearbook";close.style.cssText="min-height:44px;padding:9px 14px;background:#fff8e9;color:#243038;border-radius:7px;font-size:16px";
  close.addEventListener("click",()=>dialog.close());bar.append(heading,close);
  const notice=d.createElement("p");notice.textContent="This Yearbook is shared within this browser, not yet protected by a parent or student account. Viewing images does not automatically copy them into anyone's profile.";
  notice.style.cssText="margin:0;padding:9px 13px;background:#fff9ef;color:#243038;font:400 16px/1.5 Nunito,Arial,sans-serif";
  const frame=d.createElement("iframe");frame.src="https://vervenveda.com/Academy-Yearbook.github.io/";frame.title="Academy Family Yearbook";frame.style.cssText="width:100%;flex:1;min-height:0;border:0";
  shell.append(bar,notice,frame);dialog.append(shell);d.body.append(dialog);
 }
 if(!dialog.open)dialog.showModal();return true;
}
function openEditor(which){
 const a=adult();if(!a)return;
 if(which==="yearbook"){openParentYearbook();return}
 const studio=g.KhaemenesFamilyParentLookStudio;
 if(studio?.open){studio.open(which);return}
 const look=appearance(a.adultId),box=dialog();
 byId("kphDialogTitle").textContent=which==="picture"?"Customize My Picture":which==="background"?"Customize My Background":"Edit My Parent Profile";
 byId("kphDisplayName").value=look.displayName||a.displayName||"";
 byId("kphBackground").value=look.background;
 byId("kphFrame").value=look.frame;
 byId("kphPhotoFile").value="";
 byId("kphDialogStatus").textContent="No changes have been made.";
 if(!box.open&&typeof box.showModal==="function")box.showModal();
}
g.KhaemenesFamilyParentHero=Object.freeze({version:"1.1",refresh:update,scope:"browser-local-parent-appearance"});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",update,{once:true});else update();
for(const event of ["khaemenes-family-changed","pageshow","khaemenes-learner-placement-changed"])g.addEventListener(event,update);
})();
