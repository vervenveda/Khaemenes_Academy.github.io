/* Universal Picture & Colors Studio candidate v1.0
 * Independent Grade 10-inspired UI with injectable per-profile adapter.
 * This core owns presentation only. No built-in storage, grade, network or credentials.
 * Layout mirrors High School two-column badge + frame + swatch editor.
 */
(()=>{"use strict";
const w=window,d=document;
if(w.KhaemenesUniversalProfileLookEditor)return;
const BADGES=Object.freeze(["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
const FRAMES=Object.freeze([{"id":"rectangle","label":"Rectangle"},{"id":"square","label":"Square"},{"id":"circle","label":"Circle"},{"id":"oval","label":"Oval"},{"id":"rhombus","label":"Rhombus"},{"id":"heart","label":"Heart"},{"id":"star","label":"Star"},{"id":"octagon","label":"Octagon"},{"id":"semicircle","label":"Semicircle"},{"id":"kite","label":"Kite"}]);
const COLORS=Object.freeze(["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"]);
const CLIPS=Object.freeze({"heart":"polygon(50% 95%,43% 88%,31% 76%,20% 64%,10% 51%,4% 39%,4% 25%,10% 13%,21% 7%,32% 7%,42% 13%,50% 24%,58% 13%,68% 7%,79% 7%,90% 13%,96% 25%,96% 39%,90% 51%,80% 64%,69% 76%,57% 88%)","star":"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)","octagon":"polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)","rhombus":"polygon(50% 0%,100% 50%,50% 100%,0% 50%)","semicircle":"polygon(0% 100%,0% 50%,4% 31%,15% 15%,31% 4%,50% 0%,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)","kite":"polygon(50% 0%,90% 38%,50% 100%,10% 38%)"});
const NAME_FONTS=Object.freeze({academy:'Cinzel,Georgia,serif',friendly:'Nunito,"Trebuchet MS",Arial,sans-serif',classic:'Georgia,"Times New Roman",serif',modern:'"Trebuchet MS",Arial,sans-serif',handwriting:'"Comic Sans MS","Trebuchet MS",cursive'});
const HOME_COLORS=Object.freeze({charcoal:"#202724",forest:"#315c49",navy:"#263858",burgundy:"#643044",gold:"#a47f2f",parchment:"#f4f0e7"});
let adapter=null;
const $=id=>d.getElementById(id);
const adult=()=>{try{const identity=adapter?.getIdentity?.();return identity&&typeof identity.id==="string"&&identity.id?{id:identity.id,displayName:identity.displayName||""}:null}catch{return null}};

const lum=hex=>{const ch=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*ch[0]+.7152*ch[1]+.0722*ch[2]};
const inkFor=hex=>{const bg=lum(hex),light=lum("#fff8e9"),dark=lum("#202724"),r=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return r(bg,dark)>=r(bg,light)?"#202724":"#fff8e9"};
let selected=null,photo="",stagedPhoto=null,owner=null,opener=null,dialog=null,badgeTouched=false;
let editorEpoch=0; // Prevent an older in-flight image from changing a reopened editor.
function existing(id){
 let v={};try{v=adapter?.readLook?.(id)||{}}catch{}
 const frame=FRAMES.some(x=>x.id===v.frame)?v.frame:"circle";
 const badge=BADGES.includes(v.badge)?v.badge:"★";
 const background=Object.hasOwn(HOME_COLORS,v.background)?v.background:"forest";
 const cardColor=COLORS.includes(v.cardColor)?v.cardColor:"";
 return {displayName:typeof v.displayName==="string"?v.displayName.slice(0,70):"",frame,badge,background,cardColor,nameFont:Object.hasOwn(NAME_FONTS,v.nameFont)?v.nameFont:"academy"};
}
function photoFor(id){const p=adapter?.readPhoto?.(id);return p&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(p)&&p.length<400000?p:""}
function mk(tag,cls,txt){const el=d.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el}
function setStatus(message){const el=$("kplsStatus");if(el)el.textContent=message}
function style(){
 if($("kplsStyle"))return;
 const el=mk("style");el.id="kplsStyle";
 el.textContent=`
#kplsDialog{box-sizing:border-box;width:min(calc(100vw - 28px),1120px);max-height:calc(100dvh - 24px);overflow:auto;margin:auto;padding:0;border:2px solid #b48b45;border-radius:7px;background:#fff9ef;color:#202724;box-shadow:0 20px 70px #0007}
#kplsDialog::backdrop{background:rgba(9,19,17,.76)}
#kplsDialog *,#kplsDialog *::before,#kplsDialog *::after{box-sizing:border-box}
#kplsDialog .kpls-inner{padding:clamp(16px,2vw,24px)}
#kplsDialog .kpls-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:9px}
#kplsDialog h2{font:400 clamp(27px,4vw,33px)/1.3 Cinzel,Georgia,serif;margin:0;color:#202724}
#kplsDialog h3{font:400 22px/1.3 Cinzel,Georgia,serif;margin:11px 0 7px;color:inherit}
#kplsDialog p,#kplsDialog label{font:400 18px/1.55 "Brandon Grotesque",Nunito,Arial,sans-serif}
#kplsDialog .kpls-layout{display:grid;grid-template-columns:minmax(230px,.73fr) minmax(0,1.67fr);gap:20px}
#kplsDialog .kpls-preview{display:flex;flex-direction:column;align-items:center;text-align:center;gap:9px;justify-content:center;padding:20px 14px;background:#202724;color:#fff8e9;border:2px solid #b48b45;border-radius:7px;min-height:320px}
#kplsDialog .kpls-preview h3,#kplsDialog .kpls-preview p{color:inherit;margin:0}
#kplsDialog #kplsNamePreview{font-weight:400;font-size:24px;line-height:1.3;overflow-wrap:anywhere}
#kplsDialog .kpls-picture{display:grid;place-items:center;overflow:hidden;width:188px;height:188px;max-width:100%;border:3px solid #e3c68a;background:#fff8e9;color:#202724;font:400 66px/1.1 Georgia,serif;border-radius:50%}
#kplsDialog .kpls-picture img{width:100%;height:100%;object-fit:cover}
#kplsDialog .kpls-controls{min-width:0}
#kplsDialog .kpls-options{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px;margin-bottom:7px}
#kplsDialog .kpls-choice{display:flex;align-items:center;justify-content:center;height:44px;min-height:44px;width:100%;padding:4px;border:1px solid #9f8150;border-radius:7px;background:#202724;color:#fff8e9;font:400 23px/1.2 "Apple Color Emoji",Georgia,serif;cursor:pointer}
#kplsDialog .kpls-choice[aria-pressed=true]{outline:3px solid #9f8150;outline-offset:2px}
#kplsDialog .kpls-frame-options{grid-template-columns:repeat(5,minmax(0,1fr))}
#kplsDialog .kpls-frame-options button{font:400 16px/1.3 Nunito,Arial,sans-serif;padding:7px 5px}
#kplsDialog .kpls-color-options .kpls-choice{height:44px;min-height:44px;background:var(--swatch);color:transparent;border:2px solid #202724}
#kplsDialog .kpls-inputs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}
#kplsDialog .kpls-field{display:grid;gap:5px}
#kplsDialog .kpls-field[hidden]{display:none}
#kplsDialog .kpls-field select{width:100%;min-height:47px;padding:8px 10px;border:1px solid #67756d;border-radius:7px;background:#fff;color:#202724;font:400 18px/1.4 Nunito,Arial,sans-serif}
#kplsDialog .kpls-field input{width:100%;min-height:47px;padding:8px 10px;border:1px solid #67756d;border-radius:7px;background:#fff;color:#202724;font:400 18px/1.4 Nunito,Arial,sans-serif}
#kplsDialog .kpls-action-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:12px}
#kplsDialog .kpls-action{min-height:48px;padding:9px 14px;border:1px solid #202724;border-radius:7px;background:#202724;color:#fff8e9;font:400 16px/1.35 Nunito,Arial,sans-serif;cursor:pointer}
#kplsDialog .kpls-secondary{background:#fff9ef;color:#202724}
#kplsDialog .kpls-status{margin:8px 0 0;font:400 18px/1.5 Nunito,Arial,sans-serif}
#kplsDialog .kpls-choice:focus-visible,#kplsDialog .kpls-action:focus-visible,#kplsDialog input:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
/* Preserve whole-number rows; only intentionally reduce columns at narrow widths. */
@media(max-width:900px){
 #kplsDialog .kpls-layout{grid-template-columns:minmax(180px,.7fr) minmax(0,1.3fr);gap:14px}
 #kplsDialog .kpls-options{grid-template-columns:repeat(6,minmax(0,1fr))}
 #kplsDialog .kpls-frame-options{grid-template-columns:repeat(5,minmax(0,1fr))}
 #kplsDialog .kpls-color-options{grid-template-columns:repeat(6,minmax(0,1fr))}
 #kplsDialog .kpls-inputs{grid-template-columns:1fr}
}
@media(max-width:660px){
 #kplsDialog{max-height:calc(100dvh - 16px)}
 #kplsDialog .kpls-layout{grid-template-columns:1fr}
 #kplsDialog .kpls-preview{min-height:210px}
 #kplsDialog .kpls-inner{padding:15px}
 #kplsDialog .kpls-picture{width:145px;height:145px;font-size:55px}
 #kplsDialog .kpls-options{grid-template-columns:repeat(6,minmax(0,1fr))}
 #kplsDialog .kpls-frame-options{grid-template-columns:repeat(2,minmax(0,1fr))}
 #kplsDialog .kpls-color-options{grid-template-columns:repeat(6,minmax(0,1fr))}
 #kplsDialog .kpls-action-row{grid-template-columns:1fr}
}
@media(max-height:650px) and (min-width:901px){
 #kplsDialog .kpls-inner{padding:12px 20px}
 #kplsDialog .kpls-top{margin-bottom:4px}
 #kplsDialog h3{margin:7px 0 4px}
 #kplsDialog .kpls-preview{min-height:260px}
 #kplsDialog .kpls-choice{height:44px;min-height:44px}
 #kplsDialog .kpls-color-options .kpls-choice{height:44px;min-height:44px}
 #kplsDialog .kpls-inputs{margin:7px 0}
 #kplsDialog .kpls-action-row{margin-top:7px}
}
`;
 d.head.append(el);
}
function build(){
 if(dialog)return dialog;
 style();dialog=d.createElement("dialog");dialog.id="kplsDialog";dialog.setAttribute("aria-labelledby","kplsTitle");
 dialog.innerHTML='<div class="kpls-inner"><div class="kpls-top"><h2 id="kplsTitle">My Picture &amp; Colors</h2><button type="button" class="kpls-action kpls-secondary" id="kplsClose">Close</button></div><p>Personalize your profile with a badge, photo, frame, and background color. Settings remain on this device; academic records are untouched.</p><div class="kpls-layout"><div class="kpls-preview"><div class="kpls-picture" id="kplsPicture" aria-label="Profile picture preview">★</div><h3>My Picture &amp; Colors</h3><p id="kplsNamePreview" aria-label="Name font preview"></p><p id="kplsPictureLabel">My profile badge</p><p>Choose a picture, badge, frame and colors that feel like you.</p></div><div class="kpls-controls"><h3>Choose My Badge</h3><div class="kpls-options" id="kplsBadges" role="group" aria-label="Profile badge choices"></div><h3>Choose My Photo Frame</h3><div class="kpls-options kpls-frame-options" id="kplsFrames" role="group" aria-label="Picture frame choices"></div><h3>Photo Card Background</h3><div class="kpls-options kpls-color-options" id="kplsColors" role="group" aria-label="Profile card background swatches"></div><p>Your choice affects the profile card, not the entire page.</p><div class="kpls-inputs"><div class="kpls-field"><label for="kplsDisplay">Profile display name</label><input id="kplsDisplay" maxlength="70" autocomplete="off"></div><div class="kpls-field"><label for="kplsNameFont">Choose My Name Font</label><select id="kplsNameFont"><option value="academy">Academy · Cinzel</option><option value="friendly">Friendly · Nunito</option><option value="classic">Classic · Georgia</option><option value="modern">Modern · Trebuchet</option><option value="handwriting">Playful · Handwriting</option></select></div><div class="kpls-field"><label for="kplsFile">Choose My Picture (optional, JPG/PNG/WebP up to 4 MB)</label><input id="kplsFile" type="file" accept="image/jpeg,image/png,image/webp"></div></div><div class="kpls-action-row"><button type="button" class="kpls-action kpls-secondary" id="kplsRemove">Remove Picture</button><button type="button" class="kpls-action kpls-secondary" id="kplsResetColor">Original Background</button><button type="button" class="kpls-action" id="kplsSave">Save My Look</button></div><p class="kpls-status" id="kplsStatus" role="status" aria-live="polite"></p></div></div></div>';
 d.body.append(dialog);
 for(const badge of BADGES){const b=mk("button","kpls-choice",badge);b.type="button";b.dataset.badge=badge;b.setAttribute("aria-label","Choose "+badge+" badge");b.addEventListener("click",()=>{selected.badge=badge;badgeTouched=true;render();setStatus("Badge selected. Save My Look to keep it.");});$("kplsBadges").append(b)}
 for(const frame of FRAMES){const b=mk("button","kpls-choice",frame.label);b.type="button";b.dataset.frame=frame.id;b.addEventListener("click",()=>{selected.frame=frame.id;render();setStatus("Frame selected. Save My Look to keep it.");});$("kplsFrames").append(b)}
 for(const color of COLORS){const b=mk("button","kpls-choice");b.type="button";b.dataset.color=color;b.style.setProperty("--swatch",color);b.setAttribute("aria-label","Choose background color "+color);b.addEventListener("click",()=>{selected.cardColor=color;render();setStatus("Background selected. Save My Look to keep it.");});$("kplsColors").append(b)}
 $("kplsClose").addEventListener("click",()=>dialog.close());
 $("kplsRemove").addEventListener("click",()=>{editorEpoch++;stagedPhoto="";render();setStatus("Picture will be removed when you save.");});
 $("kplsResetColor").addEventListener("click",()=>{selected.cardColor="";render();setStatus("Original background selected. Save to apply.");});
 $("kplsDisplay").addEventListener("input",()=>{if(selected){selected.displayName=$("kplsDisplay").value.slice(0,70);render();}});
 $("kplsNameFont").addEventListener("change",()=>{if(selected){selected.nameFont=$("kplsNameFont").value;render();setStatus("Name font selected. Save My Look to keep it.");}});
 $("kplsFile").addEventListener("change",async()=>{
  const f=$("kplsFile").files?.[0];$("kplsFile").value="";if(!f)return;
  if(!["image/jpeg","image/png","image/webp"].includes(f.type)||f.size===0||f.size>4*1024*1024){setStatus("Select a JPG, PNG, or WebP under 4 MB.");return;}
  const target=owner,requestEpoch=++editorEpoch,url=URL.createObjectURL(f);
  try{const img=new Image();await new Promise((ok,fail)=>{img.onload=ok;img.onerror=fail;img.src=url;});if(!img.naturalWidth||!img.naturalHeight)throw Error("Invalid image");
   const canvas=d.createElement("canvas");canvas.width=canvas.height=240;const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
   const side=Math.min(img.naturalWidth,img.naturalHeight);ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,240,240);
   let encoded="";const ceiling=Number.isFinite(adapter?.maxPhotoChars)?Math.max(20000,Math.min(400000,adapter.maxPhotoChars)):400000;
   for(const quality of [.78,.64,.50,.38]){encoded=canvas.toDataURL("image/jpeg",quality);if(encoded.length<ceiling)break}
   if(encoded.length>=ceiling)throw Error("Image too large");
   if(!dialog.open||editorEpoch!==requestEpoch||owner!==target||adult()?.id!==target){return}
   stagedPhoto=encoded;render();setStatus("Photo preview ready. Save My Look to keep it.");
  }catch{setStatus("Unable to process this picture. Existing photo remains unchanged.")}
  finally{URL.revokeObjectURL(url)}
 });
 $("kplsSave").addEventListener("click",()=>{
  const id=adult()?.id;
  if(!id||id!==owner){setStatus("Choose the correct profile again.");return}
  const look={...selected,displayName:$("kplsDisplay").value.trim().slice(0,70)};
  if(!FRAMES.some(x=>x.id===look.frame)||!BADGES.includes(look.badge)||!(look.cardColor===""||COLORS.includes(look.cardColor))||!Object.hasOwn(NAME_FONTS,look.nameFont)){setStatus("Choose valid profile options.");return}
  // Existing appearance/photo keys remain unchanged; never touch student or registry storage.
  try{
   const result=adapter?.commit?.({id,look,photo:stagedPhoto,badgeTouched});
   if(result!==true){setStatus("Profile changes could not be committed. Your previous appearance is preserved.");return}
  }catch{setStatus("Unable to save changes. Your previous appearance is preserved.");return}
  adapter?.refresh?.();
  dialog.close();
 });
 dialog.addEventListener("close",()=>{editorEpoch++;selected=null;photo="";stagedPhoto=null;owner=null;badgeTouched=false;if(opener?.isConnected)opener.focus({preventScroll:true});opener=null});
 return dialog;
}
function render(){
 if(!selected)return;
 const bg=selected.cardColor||HOME_COLORS[selected.background]||HOME_COLORS.forest;
 const preview=$("kplsDialog")?.querySelector(".kpls-preview");if(preview){preview.style.backgroundColor=bg;preview.style.color=inkFor(bg)}
 const nameNode=$("kplsNamePreview");if(nameNode){nameNode.textContent=selected.displayName||adult()?.displayName||"My Name";nameNode.style.fontFamily=NAME_FONTS[selected.nameFont]||NAME_FONTS.academy;nameNode.style.fontWeight="400"}
 const frame=$("kplsPicture");if(!frame)return;
 frame.replaceChildren();
 const imgData=stagedPhoto!==null?stagedPhoto:photo;
 if(imgData){const img=mk("img");img.src=imgData;img.alt="Profile photo preview";frame.append(img)}else frame.textContent=selected.badge;
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
 build();editorEpoch++;owner=a.id;selected=existing(owner);photo=photoFor(owner);stagedPhoto=null;badgeTouched=false;opener=d.activeElement;
 $("kplsTitle").textContent=mode==="picture"?"Customize My Picture":mode==="background"?"Customize My Background":"Edit My Profile";
 $("kplsDisplay").value=selected.displayName||a.displayName||"";
 $("kplsNameFont").value=selected.nameFont;
 $("kplsDisplay").closest(".kpls-field").hidden=adapter?.showDisplayName===false;
 $("kplsFile").value="";setStatus("Choose your preferences, then select Save My Look.");
 render();if(typeof dialog.showModal==="function"&&!dialog.open){dialog.showModal();$("kplsClose").focus();return true}return false;
}
w.KhaemenesUniversalProfileLookEditor=Object.freeze({version:"1.0",register(next){
 if(!next||typeof next.getIdentity!=="function"||typeof next.readLook!=="function"||typeof next.readPhoto!=="function"||typeof next.commit!=="function"||typeof next.refresh!=="function")return false;
 if(adapter&&adapter!==next)return false;
 adapter=next;return true;
},open(mode){return adapter?open(mode):false},registered(){return !!adapter}});
})();
