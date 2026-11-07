/* Parent Picture & Colors Studio v1.0
 * Independent Grade 10-inspired UI, with parent-only appearance keys.
 * NO grade / learner storage, no network calls, no credentials.
 * Layout mirrors High School two-column badge + frame + swatch editor.
 */
(()=>{"use strict";
const w=window,d=document;
if(w.KhaemenesFamilyParentLookStudio)return;
const BADGES=Object.freeze(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
const FRAMES=Object.freeze([{"id":"rectangle","label":"Rectangle"},{"id":"square","label":"Square"},{"id":"circle","label":"Circle"},{"id":"oval","label":"Oval"},{"id":"rhombus","label":"Rhombus"},{"id":"heart","label":"Heart"},{"id":"star","label":"Star"},{"id":"octagon","label":"Octagon"},{"id":"semicircle","label":"Semicircle"},{"id":"kite","label":"Kite"}]);
const COLORS=Object.freeze(["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"]);
const CLIPS=Object.freeze({"heart":"polygon(50% 95%,43% 88%,31% 76%,20% 64%,10% 51%,4% 39%,4% 25%,10% 13%,21% 7%,32% 7%,42% 13%,50% 24%,58% 13%,68% 7%,79% 7%,90% 13%,96% 25%,96% 39%,90% 51%,80% 64%,69% 76%,57% 88%)","star":"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)","octagon":"polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)","rhombus":"polygon(50% 0%,100% 50%,50% 100%,0% 50%)","semicircle":"polygon(0% 100%,0% 50%,4% 31%,15% 15%,31% 4%,50% 0%,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)","kite":"polygon(50% 0%,90% 38%,50% 100%,10% 38%)"});
const HOME_COLORS=Object.freeze({charcoal:"#202724",forest:"#315c49",navy:"#263858",burgundy:"#643044",gold:"#a47f2f"});
const key=id=>"khaemenes.parent.profile.appearance.v1:"+encodeURIComponent(id);
const photoKey=id=>"khaemenes.parent.profile.photo.v1:"+encodeURIComponent(id);
const $=id=>d.getElementById(id);
const adult=()=>{try{const r=w.KhaemenesFamilyRegistry,ids=r?.activeIds?.(),a=r?.getAdult?.();return a&&ids?.adultId===a.adultId?a:null}catch{return null}};
const read=(k)=>{try{return w.localStorage.getItem(k)}catch{return null}};
const save=(k,v)=>{try{w.localStorage.setItem(k,v);return true}catch{return false}};
const remove=(k)=>{try{w.localStorage.removeItem(k);return true}catch{return false}};
const lum=hex=>{const ch=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*ch[0]+.7152*ch[1]+.0722*ch[2]};
const inkFor=hex=>{const bg=lum(hex),light=lum("#fff8e9"),dark=lum("#202724"),r=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return r(bg,dark)>=r(bg,light)?"#202724":"#fff8e9"};
let selected=null,photo="",stagedPhoto=null,owner=null,opener=null,dialog=null;
function existing(id){
 let v={};try{v=JSON.parse(read(key(id))||"{}")||{}}catch{}
 const frame=FRAMES.some(x=>x.id===v.frame)?v.frame:"circle";
 const badge=BADGES.includes(v.badge)?v.badge:"★";
 const background=Object.hasOwn(HOME_COLORS,v.background)?v.background:"forest";
 const cardColor=COLORS.includes(v.cardColor)?v.cardColor:"";
 return {displayName:typeof v.displayName==="string"?v.displayName.slice(0,70):"",frame,badge,background,cardColor};
}
function photoFor(id){const p=read(photoKey(id));return p&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(p)&&p.length<400000?p:""}
function mk(tag,cls,txt){const el=d.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el}
function setStatus(message){const el=$("kplsStatus");if(el)el.textContent=message}
function style(){
 if($("kplsStyle"))return;
 const el=mk("style");el.id="kplsStyle";
 el.textContent=`
#kplsDialog{box-sizing:border-box;width:min(96vw,920px);max-height:min(90vh,900px);margin:auto;padding:0;border:2px solid #b48b45;border-radius:7px;background:#fff9ef;color:#202724;box-shadow:0 20px 70px #0007}
#kplsDialog::backdrop{background:rgba(9,19,17,.76)}
#kplsDialog *,#kplsDialog *::before,#kplsDialog *::after{box-sizing:border-box}
#kplsDialog .kpls-inner{padding:clamp(17px,3vw,32px)}
#kplsDialog .kpls-top{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:15px}
#kplsDialog h2{font:400 clamp(27px,4vw,33px)/1.3 Cinzel,Georgia,serif;margin:0;color:#202724}
#kplsDialog h3{font:400 24px/1.35 Cinzel,Georgia,serif;margin:15px 0 10px;color:inherit}
#kplsDialog p,#kplsDialog label{font:400 18px/1.55 "Brandon Grotesque",Nunito,Arial,sans-serif}
#kplsDialog .kpls-layout{display:grid;grid-template-columns:minmax(220px,.8fr) minmax(0,1.3fr);gap:24px}
#kplsDialog .kpls-preview{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;justify-content:center;padding:24px 15px;background:#202724;color:#fff8e9;border:2px solid #b48b45;border-radius:7px;min-height:320px}
#kplsDialog .kpls-preview h3,#kplsDialog .kpls-preview p{color:inherit;margin:0}
#kplsDialog .kpls-picture{display:grid;place-items:center;overflow:hidden;width:188px;height:188px;max-width:100%;border:3px solid #e3c68a;background:#fff8e9;color:#202724;font:400 66px/1.1 Georgia,serif;border-radius:50%}
#kplsDialog .kpls-picture img{width:100%;height:100%;object-fit:cover}
#kplsDialog .kpls-controls{min-width:0}
#kplsDialog .kpls-options{display:grid;grid-template-columns:repeat(auto-fill,minmax(44px,1fr));gap:8px;margin-bottom:8px}
#kplsDialog .kpls-choice{display:flex;align-items:center;justify-content:center;min-height:45px;width:100%;padding:5px;border:1px solid #9f8150;border-radius:7px;background:#202724;color:#fff8e9;font:400 23px/1.2 "Apple Color Emoji",Georgia,serif;cursor:pointer}
#kplsDialog .kpls-choice[aria-pressed=true]{outline:3px solid #9f8150;outline-offset:2px}
#kplsDialog .kpls-frame-options{grid-template-columns:repeat(auto-fit,minmax(min(100%,100px),1fr))}
#kplsDialog .kpls-frame-options button{font:400 16px/1.3 Nunito,Arial,sans-serif;padding:9px 6px}
#kplsDialog .kpls-color-options .kpls-choice{height:43px;background:var(--swatch);color:transparent;border:2px solid #202724}
#kplsDialog .kpls-inputs{display:grid;gap:12px;margin:17px 0}
#kplsDialog .kpls-field{display:grid;gap:5px}
#kplsDialog .kpls-field input{width:100%;min-height:47px;padding:8px 10px;border:1px solid #67756d;border-radius:7px;background:#fff;color:#202724;font:400 18px/1.4 Nunito,Arial,sans-serif}
#kplsDialog .kpls-action-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:17px}
#kplsDialog .kpls-action{min-height:48px;padding:9px 14px;border:1px solid #202724;border-radius:7px;background:#202724;color:#fff8e9;font:400 16px/1.35 Nunito,Arial,sans-serif;cursor:pointer}
#kplsDialog .kpls-secondary{background:#fff9ef;color:#202724}
#kplsDialog .kpls-status{margin:12px 0 0;font:400 18px/1.5 Nunito,Arial,sans-serif}
#kplsDialog .kpls-choice:focus-visible,#kplsDialog .kpls-action:focus-visible,#kplsDialog input:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
@media(max-width:660px){#kplsDialog .kpls-layout{grid-template-columns:1fr}#kplsDialog .kpls-preview{min-height:230px}#kplsDialog .kpls-inner{padding:15px}#kplsDialog .kpls-picture{width:145px;height:145px;font-size:55px}#kplsDialog .kpls-frame-options{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
 d.head.append(el);
}
function build(){
 if(dialog)return dialog;
 style();dialog=d.createElement("dialog");dialog.id="kplsDialog";dialog.setAttribute("aria-labelledby","kplsTitle");
 dialog.innerHTML='<div class="kpls-inner"><div class="kpls-top"><h2 id="kplsTitle">My Picture &amp; Colors</h2><button type="button" class="kpls-action kpls-secondary" id="kplsClose">Close</button></div><p>Personalize your parent profile with a badge, photo, frame, and background color. Settings remain on this device; learner profiles are untouched.</p><div class="kpls-layout"><div class="kpls-preview"><div class="kpls-picture" id="kplsPicture" aria-label="Parent picture preview">★</div><h3>My Picture &amp; Colors</h3><p id="kplsPictureLabel">My profile badge</p><p>Choose a look that feels like you.</p></div><div class="kpls-controls"><h3>Choose My Badge</h3><div class="kpls-options" id="kplsBadges" role="group" aria-label="Parent badge choices"></div><h3>Choose My Photo Frame</h3><div class="kpls-options kpls-frame-options" id="kplsFrames" role="group" aria-label="Picture frame choices"></div><h3>Photo Card Background</h3><div class="kpls-options kpls-color-options" id="kplsColors" role="group" aria-label="Parent photo card background swatches"></div><p>Your choice affects the parent profile card, not the entire page.</p><div class="kpls-inputs"><div class="kpls-field"><label for="kplsDisplay">Parent display name</label><input id="kplsDisplay" maxlength="70" autocomplete="off"></div><div class="kpls-field"><label for="kplsFile">Choose My Picture (optional, JPG/PNG/WebP up to 4 MB)</label><input id="kplsFile" type="file" accept="image/jpeg,image/png,image/webp"></div></div><div class="kpls-action-row"><button type="button" class="kpls-action kpls-secondary" id="kplsRemove">Remove Picture</button><button type="button" class="kpls-action kpls-secondary" id="kplsResetColor">Original Background</button><button type="button" class="kpls-action" id="kplsSave">Save My Look</button></div><p class="kpls-status" id="kplsStatus" role="status" aria-live="polite"></p></div></div></div>';
 d.body.append(dialog);
 for(const badge of BADGES){const b=mk("button","kpls-choice",badge);b.type="button";b.dataset.badge=badge;b.setAttribute("aria-label","Choose "+badge+" badge");b.addEventListener("click",()=>{selected.badge=badge;render();setStatus("Badge selected. Save My Look to keep it.");});$("kplsBadges").append(b)}
 for(const frame of FRAMES){const b=mk("button","kpls-choice",frame.label);b.type="button";b.dataset.frame=frame.id;b.addEventListener("click",()=>{selected.frame=frame.id;render();setStatus("Frame selected. Save My Look to keep it.");});$("kplsFrames").append(b)}
 for(const color of COLORS){const b=mk("button","kpls-choice");b.type="button";b.dataset.color=color;b.style.setProperty("--swatch",color);b.setAttribute("aria-label","Choose background color "+color);b.addEventListener("click",()=>{selected.cardColor=color;render();setStatus("Background selected. Save My Look to keep it.");});$("kplsColors").append(b)}
 $("kplsClose").addEventListener("click",()=>dialog.close());
 $("kplsRemove").addEventListener("click",()=>{stagedPhoto="";render();setStatus("Picture will be removed when you save.");});
 $("kplsResetColor").addEventListener("click",()=>{selected.cardColor="";render();setStatus("Original background selected. Save to apply.");});
 $("kplsDisplay").addEventListener("input",()=>{if(selected){selected.displayName=$("kplsDisplay").value.slice(0,70);}});
 $("kplsFile").addEventListener("change",async()=>{
  const f=$("kplsFile").files?.[0];$("kplsFile").value="";if(!f)return;
  if(!["image/jpeg","image/png","image/webp"].includes(f.type)||f.size===0||f.size>4*1024*1024){setStatus("Select a JPG, PNG, or WebP under 4 MB.");return;}
  const target=owner,url=URL.createObjectURL(f);
  try{const img=new Image();await new Promise((ok,fail)=>{img.onload=ok;img.onerror=fail;img.src=url;});if(!img.naturalWidth||!img.naturalHeight)throw Error("Invalid image");
   const canvas=d.createElement("canvas");canvas.width=canvas.height=240;const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
   const side=Math.min(img.naturalWidth,img.naturalHeight);ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,240,240);
   const encoded=canvas.toDataURL("image/jpeg",.78);
   if(encoded.length>=400000)throw Error("Image too large");
   if(owner!==target||adult()?.adultId!==target){setStatus("Active parent changed; reopen the editor.");return}
   stagedPhoto=encoded;render();setStatus("Photo preview ready. Save My Look to keep it.");
  }catch{setStatus("Unable to process this picture. Existing photo remains unchanged.")}
  finally{URL.revokeObjectURL(url)}
 });
 $("kplsSave").addEventListener("click",()=>{
  const id=adult()?.adultId;
  if(!id||id!==owner){setStatus("Choose the correct adult profile again.");return}
  const look={...selected,displayName:$("kplsDisplay").value.trim().slice(0,70)};
  if(!FRAMES.some(x=>x.id===look.frame)||!BADGES.includes(look.badge)||!(look.cardColor===""||COLORS.includes(look.cardColor))){setStatus("Choose valid profile options.");return}
  // Existing appearance/photo keys remain unchanged; never touch student or registry storage.
  const oldLook=read(key(id));
  if(!save(key(id),JSON.stringify(look))){setStatus("Appearance could not be saved.");return}
  if(stagedPhoto!==null){const ok=stagedPhoto===""?remove(photoKey(id)):save(photoKey(id),stagedPhoto);if(!ok){if(oldLook===null)remove(key(id));else save(key(id),oldLook);setStatus("Picture could not be saved; previous profile preferences restored where possible.");return}}
  w.KhaemenesFamilyParentHero?.refresh?.();
  dialog.close();
 });
 dialog.addEventListener("close",()=>{selected=null;photo="";stagedPhoto=null;owner=null;opener?.focus?.();opener=null});
 return dialog;
}
function render(){
 if(!selected)return;
 const bg=selected.cardColor||HOME_COLORS[selected.background]||HOME_COLORS.forest;
 const preview=$("kplsDialog")?.querySelector(".kpls-preview");if(preview){preview.style.backgroundColor=bg;preview.style.color=inkFor(bg)}
 const frame=$("kplsPicture");if(!frame)return;
 frame.replaceChildren();
 const imgData=stagedPhoto!==null?stagedPhoto:photo;
 if(imgData){const img=mk("img");img.src=imgData;img.alt="Parent photo preview";frame.append(img)}else frame.textContent=selected.badge;
 const shape=selected.frame;
 frame.style.width=shape==="rectangle"||shape==="oval"?"220px":"188px";
 frame.style.height=shape==="rectangle"?"150px":shape==="oval"?"154px":"188px";
 frame.style.maxWidth="100%";
 frame.style.clipPath=CLIPS[shape]||"none";
 frame.style.borderRadius=shape==="circle"||shape==="oval"?"50%":shape==="rectangle"||shape==="square"?"7px":"0";
 for(const b of $("kplsBadges").children)b.setAttribute("aria-pressed",String(b.dataset.badge===selected.badge&&!imgData));
 for(const b of $("kplsFrames").children)b.setAttribute("aria-pressed",String(b.dataset.frame===shape));
 for(const b of $("kplsColors").children)b.setAttribute("aria-pressed",String(b.dataset.color===selected.cardColor));
}
function open(mode="edit"){
 const a=adult();if(!a)return false;
 build();owner=a.adultId;selected=existing(owner);photo=photoFor(owner);stagedPhoto=null;opener=d.activeElement;
 $("kplsTitle").textContent=mode==="picture"?"Customize My Picture":mode==="background"?"Customize My Background":"Edit My Parent Profile";
 $("kplsDisplay").value=selected.displayName||a.displayName||"";
 $("kplsFile").value="";setStatus("Choose your preferences, then select Save My Look.");
 render();if(typeof dialog.showModal==="function"&&!dialog.open){dialog.showModal();$("kplsClose").focus();return true}return false;
}
w.KhaemenesFamilyParentLookStudio=Object.freeze({version:"1.0",open});
})();
