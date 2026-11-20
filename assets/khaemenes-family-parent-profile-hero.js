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
// The parent hero's presentation is owned by khaemenes-parent-profile-page.css.
function styleOnce(){return}

const features=[
 ["Edit Display Name", "edit"],
 ["Schedules & Progress", "#family-progress"],
 ["Family Records", "../#family-records-controls"],
 ["Manage Learners", "../enroll/#existing"],
 ["Daily Family Reports", "#parent-daily-reports"],
 ["My Student Profiles", "#parent-learner-panel"],
 ["Customize Background", "background"],
 ["Customize Picture", "picture"]
];
function mount(){
 const node=byId(ID);if(node)return node;
 const before=byId("workspace"),after=byId("family-account-readiness");
 if(!before||!after||!before.parentElement||before.parentElement!==after.parentElement)return null;
 styleOnce();
 const section=d.createElement("section");section.id=ID;section.setAttribute("aria-label","Parent profile hero and tools");
 section.innerHTML='<div class="kph-shell"><div class="kph-intro"><p>My Family Profile</p><p class="kph-instructions">Choose a tool once to open its destination. Schedules and reports appear below.</p></div><div class="kph-identity" id="kphIdentity"><div class="kph-avatar" id="kphAvatar" aria-label="Parent profile picture"><span>P</span></div><div><h2 class="kph-name" id="kphName">Parent / Guardian</h2><p class="kph-detail" id="kphDetail">Local family profile · Account sign-in not connected</p></div></div><nav class="kph-rail" aria-label="Parent Profile Tools"><h3 class="kph-tools-title">My Profile Tools</h3><div class="kph-tools" id="kphToolGrid"></div><p class="kph-note">Personalization stays on this browser; your existing family and course records are not changed.</p></nav></div>';
 const grid=section.querySelector("#kphToolGrid");
 for(const [label,dest] of features){
  const control=d.createElement(dest.startsWith("#")||dest.startsWith("../")||dest.startsWith("enroll/")?"a":"button");
  control.className="kph-tool";control.textContent=label;
  if(control.tagName==="A"){control.href=dest;control.setAttribute("aria-label",label+" — open family workspace section");if(dest.startsWith("#"))control.addEventListener("click",()=>{const panel=d.querySelector(dest);if(panel?.tagName==="DETAILS")panel.open=true})}
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
function openEditor(which){
 const a=adult();if(!a)return;
 const studio=g.KhaemenesFamilyParentLookStudio;
 if(studio?.open){try{studio.open(which);return}catch(error){console.warn("Parent look studio unavailable; opening local editor.",error)}}
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
