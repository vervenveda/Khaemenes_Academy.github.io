/* One High School photo, frame and background editor for registered Grades 09–12.
   Runs in Academy student profile studio; no grade, courses or mastery writes.
   Adapts to the existing High School grade-specific appearance storage contract.
*/
(function(global){
"use strict";
if(global.KhaemenesHighVisualProfileBuilder)return;
const R=global.KhaemenesFamilyRegistry;
const host=document.getElementById("highSchoolVisualBuilder");
if(!host)return;
const base="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-";
const allowed=new Set(["09","10","11","12"]);
const hex=value=>/^#[0-9a-fA-F]{6}$/.test(String(value||""));
const get=k=>{try{return global.localStorage.getItem(k)}catch{return null}};
const json=k=>{try{return JSON.parse(get(k)||"null")}catch{return null}};
const put=(k,v)=>global.localStorage.setItem(k,v);
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
function context(){
 const learner=R?.getLearner?.()||null;
 const grade=String(learner?.grade||"").padStart(2,"0");
 if(!learner?.learnerId||learner.stage!=="high"||!allowed.has(grade))return null;
 return {id:learner.learnerId,grade,name:String(learner.nickname||"Student")};
}
function keys(c){
 const id=encodeURIComponent(c.id);
 return c.grade==="09"?{
  image:"khaemenes.grade09.profile.photo:"+id,
  color:"khaemenes.grade09.profile.background:"+id,
  design:"khaemenes-grade09-profile-design-v1:learner:"+id
 }:{appearance:"khaemenes.grade"+Number(c.grade)+".profile.appearance:"+id};
}
function existing(c){
 const k=keys(c);
 if(c.grade==="09"){
  const image=get(k.image);
  const design=json(k.design)||{};
  return {photo:image&&/^data:image\/jpeg;base64,/.test(image)&&image.length<400000?image:null,
   background:hex(get(k.color))?get(k.color):"#f6f0e5",
   shape:["circle","square","soft-square","rectangle","heart","star","octagon","hectagon"].includes(design.avatarShape)?design.avatarShape:"circle"};
 }
 const app=json(k.appearance)||{};
 return {photo:typeof app.photo==="string"&&/^data:image\/jpeg;base64,/.test(app.photo)&&app.photo.length<400000?app.photo:null,
  background:hex(app.background)?app.background:"#101c2e",shape:"circle"};
}
function render(){
 host.replaceChildren();
 const c=context();
 if(!c)return;
 const k=keys(c);
 let value=existing(c),newPhoto=value.photo;
 const area=node("section");area.className="card";area.style.cssText="border:1px solid #b48b45;border-radius:7px;padding:22px;background:#fffaf0;color:#243038;margin:20px 0";
 const heading=node("h2","High School Profile Builder");heading.style.cssText="font:400 29px/1.3 Cinzel,Georgia,serif;color:#243038";
 const intro=node("p",c.name+" · Grade "+Number(c.grade)+". Choose a portrait, frame, and background. Only your personal appearance is saved; your registered grade and classes stay unchanged.");
 const layout=node("div");layout.style.cssText="display:grid;grid-template-columns:160px minmax(0,1fr);gap:20px;align-items:start";
 const preview=node("div");preview.style.cssText="width:145px;height:145px;overflow:hidden;display:grid;place-items:center;border:3px solid #b48b45;background:#e8dcc5;color:#243038;font:400 39px Cinzel,Georgia,serif";
 const form=node("div");form.style.cssText="display:grid;gap:12px;max-width:650px";
 const photoLabel=node("label","Choose photo (JPG, PNG, or WebP; 4 MB max)");
 const file=node("input");file.type="file";file.accept="image/jpeg,image/png,image/webp";file.style.cssText="display:block;max-width:100%;font:400 16px Nunito,Arial,sans-serif";photoLabel.append(file);
 const bgLabel=node("label","Profile background color");
 const bg=node("input");bg.type="color";bg.value=value.background;bg.style.cssText="display:block;width:85px;height:44px";bgLabel.append(bg);
 const frameLabel=node("label","Portrait frame");
 const frame=node("select");
 for(const x of ["circle","square","soft-square","rectangle","heart","star","octagon","hectagon"]){
  const o=node("option",x.replace("-"," "));o.value=x;frame.append(o);
 }
 frame.value=value.shape;frame.disabled=c.grade!=="09";
 if(c.grade!=="09"){const detail=node("small","Additional frame styles remain in the Grade 9 editor and are not yet supported by the upper-grade display scripts.");frameLabel.append(detail)}
 frameLabel.append(frame);
 const row=node("div");row.style.cssText="display:flex;flex-wrap:wrap;gap:10px";
 const save=node("button","Save Profile Appearance"),remove=node("button","Remove Photo"),back=node("a","Return to Grade "+Number(c.grade)+" Profile");
 for(const n of [save,remove,back]){n.style.cssText="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 14px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px Nunito,Arial,sans-serif;text-decoration:none"}
 save.type=remove.type="button";back.href=base+c.grade+"/student-profile/";row.append(save,remove,back);
 const status=node("p","Nothing is saved until you select Save.");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 function paint(){
  preview.replaceChildren();
  const shape=frame.value;
  preview.style.borderRadius=shape==="circle"?"50%":shape==="soft-square"?"25%":shape==="heart"?"35% 35% 55% 55%":shape==="star"?"20%":"7px";
  preview.style.background=bg.value;
  if(newPhoto){const image=node("img");image.src=newPhoto;image.alt="Student portrait preview";image.style.cssText="width:100%;height:100%;object-fit:cover";preview.append(image)}
  else preview.append(node("span",c.name.slice(0,1).toUpperCase()));
 }
 bg.addEventListener("input",paint);frame.addEventListener("change",paint);
 file.addEventListener("change",async()=>{
  const f=file.files?.[0];file.value="";if(!f)return;
  if(!["image/jpeg","image/png","image/webp"].includes(f.type)||f.size>4*1024*1024){status.textContent="Choose a JPG, PNG, or WebP file under 4 MB.";return}
  const url=URL.createObjectURL(f);
  try{
   const image=new Image();await new Promise((ok,fail)=>{image.onload=ok;image.onerror=fail;image.src=url});
   const canvas=document.createElement("canvas");canvas.width=canvas.height=240;
   const context2=canvas.getContext("2d");if(!context2)throw Error("Photo processor unavailable");
   const side=Math.min(image.naturalWidth,image.naturalHeight);
   context2.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,240,240);
   const jpg=canvas.toDataURL("image/jpeg",0.76);
   if(jpg.length>=400000)throw Error("Photo too large");
   newPhoto=jpg;paint();status.textContent="Photo ready. Select Save to store it for this learner.";
  }catch{status.textContent="Could not prepare this photo. Try a smaller image."}
  finally{URL.revokeObjectURL(url)}
 });
 remove.addEventListener("click",()=>{newPhoto=null;paint();status.textContent="Photo removed from preview. Select Save to confirm."});
 save.addEventListener("click",()=>{
  const now=context();
  if(!now||now.id!==c.id||now.grade!==c.grade){status.textContent="The active learner or grade changed. Refresh before saving.";return}
  try{
   if(c.grade==="09"){
    if(newPhoto)put(k.image,newPhoto);else global.localStorage.removeItem(k.image);
    put(k.color,bg.value);
    const design=json(k.design)||{};
    put(k.design,JSON.stringify({...design,avatarShape:frame.value}));
   }else{
    const old=json(k.appearance)||{};
    put(k.appearance,JSON.stringify({...old,background:bg.value,photo:newPhoto}));
   }
   status.textContent="Appearance saved for "+c.name+" · Grade "+Number(c.grade)+". Refresh the grade dashboard to see the changes.";
   global.dispatchEvent(new CustomEvent("khaemenes-high-profile-appearance-changed",{detail:{learnerId:c.id,grade:c.grade}}));
  }catch{status.textContent="Unable to save appearance on this device. Existing records were not intentionally reset."}
 });
 form.append(photoLabel,bgLabel,frameLabel,row,status);
 layout.append(preview,form);area.append(heading,intro,layout);host.append(area);paint();
}
global.addEventListener("khaemenes-family-changed",render);
global.addEventListener("storage",e=>{if(["khaemenes_active_learner_v1","khaemenes_family_registry_v1"].includes(e.key))render()});
render();
global.KhaemenesHighVisualProfileBuilder=Object.freeze({version:"1.0.0",render});
})(window);