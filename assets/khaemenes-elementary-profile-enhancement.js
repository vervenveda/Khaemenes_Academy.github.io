/* Elementary 1–5 profile enhancement — additive, idempotent, browser-local.
 * Preserves every existing section, grade engine, native photo editor, guardian
 * checkbox, subject pins, Kindergarten handoff, backup, and evidence studio.
 */
(()=>{"use strict";
const w=window,d=document,KEY="khaemenesElementaryProfileEnhancement",ID="khaemenesElementaryProfileTools";
if(w[KEY])return;
const V="https://vervenveda.com/",A=V+"Khaemenes_Academy.github.io/",BASE=V+"Khaemenes_Elementary.github.io/";
const $=id=>d.getElementById(id);
const adapter=()=>w.KhaemenesElementaryLookAdapter;
const identity=()=>adapter()?.getIdentity?.()||null;
const gradeURL=()=>{const l=identity();return l?BASE+"grades/grade-"+l.grade+"/":BASE};
const toolKey=(type,id)=>"khaemenes.elementary.profile.tools.v1:"+type+":"+encodeURIComponent(id);
const value=k=>{try{return w.localStorage.getItem(k)||""}catch{return ""}};
const save=(k,v)=>{try{w.localStorage.setItem(k,v);return true}catch{return false}};
const FONTS={academy:'Cinzel,Georgia,serif',friendly:'Nunito,"Trebuchet MS",Arial,sans-serif',classic:'Georgia,"Times New Roman",serif',modern:'"Trebuchet MS",Arial,sans-serif',handwriting:'"Comic Sans MS","Trebuchet MS",cursive'};
const SHAPES={rhombus:"polygon(50% 0,100% 50%,50% 100%,0 50%)",heart:"polygon(50% 95%,43% 88%,31% 76%,20% 64%,10% 51%,4% 39%,4% 25%,10% 13%,50% 24%,90% 13%,96% 25%,96% 39%,80% 64%,69% 76%,57% 88%)",star:"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)",octagon:"polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)",semicircle:"polygon(0 100%,0 50%,4% 31%,15% 15%,31% 4%,50% 0,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)",kite:"polygon(50% 0,90% 38%,50% 100%,10% 38%)"};
function mk(tag,cls,text){const e=d.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function mountStyle(){
 if($("khaemenesElementaryProfileEnhancementStyle"))return;
 const e=mk("style");e.id="khaemenesElementaryProfileEnhancementStyle";
 e.textContent=`
 #${ID}{margin:20px auto 25px;padding:25px;background:#f5f0e6;color:#202724;border:2px solid #315c49;border-radius:7px;box-shadow:0 5px 18px #20272416}
 #${ID} .kep-heading{text-align:center;margin:0 auto 20px;max-width:860px}
 #${ID} .kep-heading .eyebrow{color:#315c49;font:400 16px/1.5 Nunito,Arial,sans-serif;letter-spacing:.03em}
 #${ID} h2{font:400 clamp(28px,3.2vw,33px)/1.3 Cinzel,Georgia,serif!important;color:#202724;margin:5px auto 10px}
 #${ID} p,#${ID} label{font:400 18px/1.55 Nunito,Arial,sans-serif!important;color:#344a40}
 #${ID} .kep-guardian{display:flex;justify-content:center;align-items:center;margin:12px auto 18px;max-width:760px}
 #${ID} .kep-guardian label{display:flex;align-items:center;gap:10px;background:#e9f3e9;border:1px solid #92aa93;border-radius:7px;padding:12px 16px}
 #${ID} .kep-guardian input{flex:none;width:23px;height:23px;accent-color:#315c49}
 #${ID} .kep-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}
 #${ID} .kep-tool{display:flex;align-items:center;justify-content:center;text-align:center;min-height:57px;padding:10px 7px;background:#202724!important;color:#fff8e9!important;border:1px solid #a8874f;border-radius:7px;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif!important;cursor:pointer;box-shadow:none}
 #${ID} .kep-tool:hover{background:#315c49!important;color:#fff8e9!important}
 #${ID} .kep-tool:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
 #${ID} .kep-foot{text-align:center;margin-top:15px!important;font-size:16px!important}
 main .hero.kep-card-enhanced{transition:background-color .15s ease;border:2px solid #315c49}
 main .hero.kep-card-enhanced .portrait{background:linear-gradient(145deg,#fde6b4,#d8e8ed)!important;color:#202724}
 main .hero.kep-card-enhanced h2{font-weight:400!important}
 #kepDialog{width:min(94vw,820px);max-height:calc(100dvh - 24px);margin:auto;overflow:auto;padding:0;border:2px solid #b48b45;border-radius:7px;background:#fff8e9;color:#202724;box-shadow:0 20px 70px #0006}
 #kepDialog::backdrop{background:rgba(12,26,23,.75)}
 #kepDialog *{box-sizing:border-box}
 #kepDialog .kep-modal-inner{padding:clamp(18px,3vw,26px)}
 #kepDialog .kep-modal-head{display:flex;justify-content:space-between;align-items:center;gap:14px}
 #kepDialog h2{font:400 clamp(26px,3.5vw,33px)/1.3 Cinzel,Georgia,serif!important;color:#202724;margin:0}
 #kepDialog p,#kepDialog label{font:400 18px/1.55 Nunito,Arial,sans-serif;color:#344a40}
 #kepDialog textarea{display:block;width:100%;min-height:175px;padding:13px;border:1px solid #8a9a8c;border-radius:7px;background:#fff;color:#202724;font:400 18px/1.55 Nunito,Arial,sans-serif}
 #kepDialog button{min-height:48px;padding:9px 16px;background:#202724;color:#fff8e9;border:1px solid #b48b45;border-radius:7px;font:400 16px/1.4 Nunito,Arial,sans-serif;cursor:pointer}
 #kepDialog button.secondary{background:#fff8e9;color:#202724}
 #kepDialog button:focus-visible,#kepDialog a:focus-visible,#kepDialog textarea:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
 #kepDialog .kep-modal-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}
 #kepDialog .kep-status{min-height:27px}
 #kepDialog .kep-canvas{display:block;width:100%;height:300px;touch-action:none;border:2px solid #315c49;border-radius:7px;background:#fff}
 #kepDialog .kep-math{display:flex;gap:9px;flex-wrap:wrap}
 #kepDialog .kep-math button{min-width:70px}
 @media(max-width:650px){#${ID}{padding:18px 12px}#${ID} .kep-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}#kepDialog .kep-canvas{height:230px}}
 @media print{#${ID},#kepDialog{display:none!important}}
 `;d.head.append(e);
}
let modal=null,currentOpener=null;
function modalUI(title,details){
 if(!modal){modal=d.createElement("dialog");modal.id="kepDialog";d.body.append(modal);
  modal.addEventListener("close",()=>{modal.replaceChildren();currentOpener?.focus?.();currentOpener=null})}
 if(modal.open)modal.close();
 const inner=mk("div","kep-modal-inner"),head=mk("div","kep-modal-head");
 const h=mk("h2","",title),close=mk("button","secondary","Close");close.type="button";close.addEventListener("click",()=>modal.close());
 head.append(h,close);inner.append(head);
 if(details)inner.append(mk("p","",details));
 const area=mk("div","kep-modal-body");inner.append(area);
 modal.append(inner);modal.showModal();close.focus();
 return area;
}
function status(area,message){let node=area.querySelector(".kep-status");if(!node){node=mk("p","kep-status");node.setAttribute("role","status");area.append(node)}node.textContent=message}
function openStorageTool(type,title,description){
 const l=identity();if(!l)return openGuest();
 const area=modalUI(title,description);const key=toolKey(type,l.id);
 const label=mk("label","",title+" for "+l.displayName),textarea=mk("textarea");textarea.value=value(key);textarea.maxLength=12000;
 label.append(textarea);area.append(label);
 const controls=mk("div","kep-modal-actions"),saveBtn=mk("button","","Save My Work");saveBtn.type="button";
 saveBtn.addEventListener("click",()=>{if(identity()?.id!==l.id){status(area,"The selected learner changed. Reopen this tool.");return}
  status(area,save(key,textarea.value)?"Saved to this learner's browser-local workspace.":"Storage is unavailable. Copy your work before closing.")});
 const copy=mk("button","secondary","Copy Text");copy.type="button";copy.addEventListener("click",()=>{textarea.select();try{d.execCommand("copy");status(area,"Text selected and copy requested.")}catch{status(area,"Select the text and copy it manually.")}});
 controls.append(saveBtn,copy);area.append(controls);
}
function openGuest(){const area=modalUI("Choose My Learner","This is a safe preview. Choose an enrolled learner in the Family Portal to use personal tools.");const a=mk("a");a.href=A+"family/";a.textContent="Open Family Portal";a.className="kep-tool";area.append(a)}
// Read the existing Elementary pins only. No inferred school-day timetable.
function readPinnedSubjects(l){
 if(identity()?.id!==l.id)return {items:[],valid:false};
 try{
  const pinKey="khaemenes_elementary_profile_pins_v1:"+encodeURIComponent(l.id);
  const raw=w.localStorage.getItem(pinKey);
  const ids=raw===null?[]:JSON.parse(raw);
  if(!Array.isArray(ids))return {items:[],valid:false};
  const options=[...($("subjectSelect")?.options||[])].filter(o=>o.value);
  const available=new Map(options.map(o=>[o.value,o.textContent||o.value]));
  const items=[...new Set(ids.filter(v=>typeof v==="string"))].filter(v=>available.has(v)).map(v=>({id:v,title:available.get(v)}));
  return {items,valid:true};
 }catch{return {items:[],valid:false}}
}
function openSchedule(){
 const l=identity();if(!l)return openGuest();
 const area=modalUI("My Learning Schedule","Your currently pinned Elementary subjects are shown below. These are favorites, not a fixed school-day timetable. Your grade's course engine controls the actual lesson sequence.");
 const pins=readPinnedSubjects(l);
 const heading=mk("h3","","My Pinned Subjects");heading.style.fontSize="22px";area.append(heading);
 if(!pins.valid)status(area,"Saved pins cannot be read. No changes were made.");
 else if(!pins.items.length)area.append(mk("p","","No favorite subjects pinned yet. Open Manage Classes to choose some."));
 else{
  const list=mk("ol");list.style.cssText="padding-left:25px;display:grid;gap:10px";
  for(const item of pins.items){const li=mk("li","",item.title);li.style.fontSize="18px";list.append(li)}
  area.append(list);
 }
 const controls=mk("div","kep-modal-actions");
 const edit=mk("button","secondary","Manage My Classes");edit.type="button";edit.addEventListener("click",()=>{modal.close();navigate("#pinned")});
 const grade=mk("a","kep-tool","Open Grade "+Number(l.grade));grade.href=gradeURL();
 controls.append(edit,grade);area.append(controls);
}
function elementaryContinuation(l){
 // Read-only summary API, scoped to the selected learner's registered grade.
 if(identity()?.id!==l.id)return [];
 let rows=[];try{rows=w.KhaemenesLearningContinuation?.readLearner?.(l.id)||[]}catch{return []}
 if(!Array.isArray(rows))return [];
 return rows.filter(x=>{
  if(!x||x.learnerId!==l.id||String(x.stage).toLowerCase()!=="elementary")return false;
  const grade=String(x.grade||"").toLowerCase().replace(/^grade[- ]?/,"");
  return grade===l.grade||grade===String(Number(l.grade));
 }).slice(0,30);
}
function safeElementaryContinuationLink(href,l){
 try{
  const url=new URL(href,V);
  const prefix="/Khaemenes_Elementary.github.io/grades/grade-"+l.grade+"/";
  return url.protocol==="https:"&&url.origin==="https://vervenveda.com"&&url.pathname.startsWith(prefix)?url.href:null;
 }catch{return null}
}
function openClassProgress(){
 const l=identity();if(!l)return openGuest();
 const area=modalUI("My Class Progress","This view reads Academy continuation summaries for your selected Elementary grade. It never changes assessments, scores, grades, or lesson locks.");
 const data=elementaryContinuation(l);
 const heading=mk("h3","","Grade "+Number(l.grade)+" · Learning Progress");heading.style.fontSize="22px";area.append(heading);
 if(!w.KhaemenesLearningContinuation?.readLearner){
  status(area,"The continuation summary service is unavailable. Your academic records have not changed.");
 }else if(!data.length){
  area.append(mk("p","","No course progress has been reported to the Academy continuation summary for this learner and grade yet. This does not mean no lessons were completed."));
 }else{
  const summary=mk("p","",data.length+" course summary "+(data.length===1?"is":"are")+" currently available. Results below are reported snapshots, not verified transcripts.");area.append(summary);
  const list=mk("div");list.style.cssText="display:grid;gap:12px";
  for(const item of data){
   const card=mk("section");card.style.cssText="border:1px solid #b7a989;border-radius:7px;padding:14px;background:#fffaf1";
   const title=mk("h3","",String(item.courseTitle||item.subject||"Course").slice(0,120));
   title.style.cssText="font:400 21px/1.4 Cinzel,Georgia,serif;color:#202724;margin:0 0 8px";
   card.append(title);
   const reported=typeof item.progress?.percent==="number"?item.progress.percent:null;
   const count=typeof item.progress?.completed==="number"&&typeof item.progress?.total==="number"?item.progress.completed+" of "+item.progress.total+" activities reported":"Activity count not reported";
   const details=mk("p","", "Status: "+String(item.status||"not reported")+" · "+count+(reported===null?"":" · "+reported+"% reported"));
   details.style.margin="0 0 8px";card.append(details);
   const mastery=item.mastery?.mastered===true?"Mastery flag reported":typeof item.mastery?.best==="number"?"Best reported checkpoint: "+item.mastery.best+"%":"No mastery result reported";
   card.append(mk("p","",mastery));
   const link=safeElementaryContinuationLink(item.nextHref,l);
   if(link){const a=mk("a","kep-tool","Continue This Course");a.href=link;card.append(a)}
   list.append(card);
  }
  area.append(list);
 }
 const actions=mk("div","kep-modal-actions");
 const portfolio=mk("button","secondary","Open My Learning Passport");portfolio.type="button";portfolio.addEventListener("click",()=>{modal.close();navigate("#academyStudio")});
 const grade=mk("a","kep-tool","Open Registered Grade");grade.href=gradeURL();
 actions.append(portfolio,grade);area.append(actions);
}
function openFlashcards(){
 const l=identity();if(!l)return openGuest();
 const n=Number(l.grade),cards=n<=2?[["What is 5 + 4?","9"],["What is the opposite of hot?","Cold"],["What color do you get from red and blue?","Purple"]]:[["What is 7 × 8?","56"],["What is a synonym for joyful?","Happy"],["What is one way to conserve water?","Turn off the tap when not in use"]];
 const area=modalUI("My Flashcards","Practice a few quick cards. These are optional games, not official assessments.");
 let at=0,flipped=false;const face=mk("p","","");
 face.style.cssText="text-align:center;font-size:26px!important;min-height:90px;padding:20px;border:1px solid #b48b45;border-radius:7px;background:#f1ecdf";
 const actions=mk("div","kep-modal-actions"),flip=mk("button","","Show Answer"),next=mk("button","secondary","Next Card");
 const paint=()=>{face.textContent=cards[at][flipped?1:0];flip.textContent=flipped?"Show Question":"Show Answer"};
 flip.addEventListener("click",()=>{flipped=!flipped;paint()});next.addEventListener("click",()=>{at=(at+1)%cards.length;flipped=false;paint()});
 actions.append(flip,next);area.append(face,actions);paint();
}
function openMathGame(){
 const l=identity();if(!l)return openGuest();
 const area=modalUI("Number Quest","A tiny optional number game for your learning break. It does not affect grades.");
 const n=Number(l.grade),x=3+n,y=2+n,correct=x+y,choices=[correct,correct+2,correct-1];
 const q=mk("p","",x+" + "+y+" = ?");q.style.fontSize="27px";q.style.textAlign="center";area.append(q);
 const row=mk("div","kep-math");for(const v of choices){const b=mk("button","",String(v));b.type="button";b.addEventListener("click",()=>status(area,v===correct?"Correct! Great thinking.":"Try again—you can do it!"));row.append(b)}area.append(row);
}
function openWhiteboard(){
 const l=identity();if(!l)return openGuest();
 const area=modalUI("My Whiteboard","Draw a picture, diagram, or math idea. Use Save Picture to save it onto this device.");
 const canvas=mk("canvas","kep-canvas");canvas.width=900;canvas.height=400;area.append(canvas);const ctx=canvas.getContext("2d");if(!ctx)return status(area,"Drawing is not supported in this browser.");
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,900,400);ctx.strokeStyle="#202724";ctx.lineWidth=5;ctx.lineCap="round";
 let drawing=false;
 const pt=e=>{const rect=canvas.getBoundingClientRect();return {x:(e.clientX-rect.left)*canvas.width/rect.width,y:(e.clientY-rect.top)*canvas.height/rect.height}};
 canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=pt(e);ctx.beginPath();ctx.moveTo(p.x,p.y)});
 canvas.addEventListener("pointermove",e=>{if(!drawing)return;const p=pt(e);ctx.lineTo(p.x,p.y);ctx.stroke()});
 for(const event of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(event,()=>{drawing=false});
 const controls=mk("div","kep-modal-actions"),clear=mk("button","secondary","Clear"),saveImg=mk("button","","Save Picture");
 clear.type=saveImg.type="button";clear.addEventListener("click",()=>{ctx.fillStyle="#fff";ctx.fillRect(0,0,900,400)});
 saveImg.addEventListener("click",()=>{const a=d.createElement("a");a.download="my-elementary-whiteboard.png";a.href=canvas.toDataURL("image/png");a.click()});
 controls.append(clear,saveImg);area.append(controls);
}
function openGallery(){
 const area=modalUI("My Creative Corner","Draw, write, or collect ideas. This space is for creativity, not grades.");
 const actions=mk("div","kep-modal-actions");
 const draw=mk("button","","Open Whiteboard"),journal=mk("button","secondary","Open Creative Journal");
 draw.addEventListener("click",openWhiteboard);journal.addEventListener("click",()=>openStorageTool("creative","My Creative Journal","Write about an artwork, a story idea, or a new invention."));
 actions.append(draw,journal);area.append(actions);
}
const actions=[
 ["Edit Profile","look"],["Class Progress","progress"],["Schedule","schedule"],["KlasaiPeer","peer"],
 ["Yearbook","yearbook"],["Creative Tools","creative"],["Student Portfolio","studio"],["Customize Background","look"],
 ["Daily Lessons","today"],["Grades","grade"],["Games","games"],["Manage Classes","classes"],
 ["Journal","journal"],["Flashcards","flashcards"],["Study Notes","notes"],["Whiteboard","whiteboard"]
];
function act(action){
 if(action==="look"){const l=identity();if(!l)return openGuest();
  if(!$("adultConfirm")?.checked){const area=modalUI("Grown-Up Confirmation","Please check the grown-up confirmation in My Profile Tools before changing a child's picture or colors.");const ok=mk("button","","Close");ok.addEventListener("click",()=>modal.close());area.append(ok);return}
  return w.KhaemenesUniversalProfileLookEditor?.open("edit")}
 if(action==="progress")return openClassProgress();
 if(action==="studio")return navigate("#academyStudio");
 if(action==="today")return navigate("#nextSteps");
 if(action==="classes")return navigate("#pinned");
 if(action==="grade"){if(!identity())return openGuest();return w.location.assign(gradeURL())}
 if(action==="schedule")return openSchedule();
 if(action==="journal")return openStorageTool("journal","My Journal","Write about your day, your favorite discoveries, or something you learned.");
 if(action==="notes")return openStorageTool("notes","My Study Notes","Keep helpful ideas and study reminders for this grade.");
 if(action==="yearbook")return openStorageTool("yearbook","My Yearbook Memories","Capture a favorite school moment, drawing idea, or personal milestone.");
 if(action==="peer"){const area=modalUI("KlasaiPeer","Your future learning companion is being prepared. You can use Flashcards and Study Notes now.");const b=mk("button","","Open Flashcards");b.addEventListener("click",openFlashcards);area.append(b);return}
 if(action==="creative")return openGallery();
 if(action==="games")return openMathGame();
 if(action==="flashcards")return openFlashcards();
 if(action==="whiteboard")return openWhiteboard();
}
function navigate(hash){const target=d.querySelector(hash);if(target){target.scrollIntoView({behavior:"smooth",block:"start"});target.setAttribute("tabindex","-1");target.focus({preventScroll:true})}}
function contrast(color){
 const v=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4),lum=.2126*v[0]+.7152*v[1]+.0722*v[2];
 return lum>.18?"#202724":"#fff8e9"
}
function refresh(){
 const root=$(ID),l=identity(),card=d.querySelector("main .card.hero"),face=$("portrait"),name=$("childName");if(!root||!card||!face||!name)return;
 let v={};if(l)try{const extra=JSON.parse(value("khaemenes.elementary.profile.decor.v1:"+encodeURIComponent(l.id))||"null");if(extra?.learnerId===l.id&&extra.schema==="khaemenes.elementary-decoration.v1")v=extra}catch{}
 const frame=v.frame||"",customColor=typeof v.cardColor==="string"&&/^#[0-9a-f]{6}$/i.test(v.cardColor)?v.cardColor:"";
 const ink=customColor?contrast(customColor):"#162d51";
 card.classList.add("kep-card-enhanced");
 card.dataset.kepCustomColor=customColor?"true":"false";
 card.style.backgroundColor=customColor||"";
 card.style.backgroundImage=customColor?"none":"";
 card.style.color=ink;
 for(const el of card.querySelectorAll(".eyebrow,#childStage"))el.style.color=ink;
 name.style.color=ink;
 name.style.setProperty("font-family",FONTS[v.nameFont]||FONTS.academy,"important");
 name.style.setProperty("font-weight","400","important");
 face.style.clipPath=SHAPES[frame]||"none";
 face.style.borderRadius=frame?(frame==="circle"||frame==="oval"?"50%":frame==="square"||frame==="rectangle"?"7px":"0"):"";
 face.style.width=frame?(frame==="rectangle"?"190px":frame==="oval"?"160px":"145px"):"";
 face.style.height=frame?(frame==="rectangle"?"130px":frame==="oval"?"170px":"145px"):"";
 if(!face.querySelector("img")&&v.badge){
  let nativeAvatar="";
  if(l)try{const native=JSON.parse(value("khaemenes_elementary_visual_profile_v1:"+encodeURIComponent(l.id))||"{}");nativeAvatar=native?.avatar||"🌟"}catch{}
  if(!v.sourceAvatar||v.sourceAvatar===nativeAvatar)face.textContent=v.badge;
 }
 const note=root.querySelector(".kep-foot");if(note)note.textContent=l?"Grade "+Number(l.grade)+" · Your tools and decorations stay with this learner on this device.":"Explore the tools. Choose a registered learner in the Family Portal to save personal work.";
 root.querySelectorAll(".kep-tool").forEach(b=>{b.disabled=false});
}
function decorateBackup(root){
 const group=mk("div","kep-backup");
 const statusLine=mk("p","kep-backup-status");statusLine.setAttribute("role","status");
 const exportButton=mk("button","","Export My Decorations");exportButton.type="button";
 const input=mk("input");input.type="file";input.accept=".json,application/json";input.setAttribute("aria-label","Restore my decorations backup");
 const label=mk("label","","Restore My Decorations");label.append(input);
 exportButton.addEventListener("click",()=>{
  const l=identity();if(!l){statusLine.textContent="Choose your learner first.";return}
  const data=value("khaemenes.elementary.profile.decor.v1:"+encodeURIComponent(l.id));if(!data){statusLine.textContent="No saved decorations yet.";return}
  try{
   const decoded=JSON.parse(data);
   if(decoded.learnerId!==l.id)return;
   const blob=new Blob([JSON.stringify({...decoded,grade:l.grade},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=mk("a");
   a.href=url;a.download="elementary-profile-decorations.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
   statusLine.textContent="Your decorations backup has been prepared.";
  }catch{statusLine.textContent="Decorations could not be exported."}
 });
 input.addEventListener("change",async e=>{
  const file=e.target.files?.[0];e.target.value="";
  const l=identity();if(!file||!l||!$("adultConfirm")?.checked){statusLine.textContent="Choose a learner and confirm grown-up assistance first.";return}
  if(file.size>20000){statusLine.textContent="This backup is too large.";return}
  try{
   const x=JSON.parse(await file.text());
   const frames=new Set(["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"]);
   const fonts=new Set(["academy","friendly","classic","modern","handwriting"]);
   const badges=new Set(["","★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"]);
   if(x?.schema!=="khaemenes.elementary-decoration.v1"||x.learnerId!==l.id||x.grade!==l.grade||!frames.has(x.frame)||!fonts.has(x.nameFont)||!badges.has(x.badge)||x.cardColor&&!/^#[0-9a-f]{6}$/i.test(x.cardColor)||identity()?.id!==l.id||!$("adultConfirm")?.checked)throw Error("Mismatch");
   const key="khaemenes.elementary.profile.decor.v1:"+encodeURIComponent(l.id);
   const next={schema:"khaemenes.elementary-decoration.v1",learnerId:l.id,updatedAt:new Date().toISOString(),badge:x.badge,sourceAvatar:typeof x.sourceAvatar==="string"?x.sourceAvatar.slice(0,8):"",frame:x.frame,cardColor:x.cardColor||"",nameFont:x.nameFont};
   if(!save(key,JSON.stringify(next)))throw Error("Storage");
   refresh();statusLine.textContent="Decorations restored for this learner.";
  }catch{statusLine.textContent="Could not restore: this backup must match the selected learner and grade."}
 });
 group.append(exportButton,label);root.append(group,statusLine);
}
function mount(){
 if($(ID)){refresh();return true}
 const hero=d.querySelector("main .card.hero"),guardian=$("adultConfirm");
 if(!hero||!guardian||!w.KhaemenesUniversalProfileLookEditor?.registered?.()||!adapter())return false;
 mountStyle();
 const root=mk("section");root.id=ID;root.setAttribute("aria-labelledby","kepHeading");
 const intro=mk("div","kep-heading");
 intro.append(mk("p","eyebrow","MY ELEMENTARY PROFILE"),mk("h2","","My Profile Tools"),mk("p","","Make your page your own, keep ideas, explore subjects and build wonderful learning habits."));
 root.append(intro);
 const consentBox=mk("div","kep-guardian"),guardianLabel=guardian.closest("label");
 if(guardianLabel)consentBox.append(guardianLabel);
 root.append(consentBox);
 const groups=[
  ["My School Day","school",["Daily Lessons","Schedule","Manage Classes","Grades"]],
  ["My Learning","learning",["Class Progress","Student Portfolio","Study Notes","Flashcards"]],
  ["My Creative World","create",["Creative Tools","Whiteboard","Games","Yearbook"]],
  ["My Profile & Friends","personal",["Edit Profile","Customize Background","Journal","KlasaiPeer"]]
 ];
 const toolActions=new Map(actions);
 const grouped=mk("div","kep-groups");
 for(const [groupName,tone,items] of groups){
  const group=mk("section","kep-group kep-group-"+tone);
  const h=mk("h3","kep-group-title",groupName);group.append(h);
  const tiles=mk("div","kep-tiles");
  for(const label of items){
   const action=toolActions.get(label);
   const b=mk("button","kep-tool",label);b.type="button";b.dataset.profileTool=action;
   b.addEventListener("click",()=>{currentOpener=b;act(action)});
   tiles.append(b);
  }
  group.append(tiles);grouped.append(group);
 }
 root.append(grouped);decorateBackup(root);root.append(mk("p","kep-foot","Your decorations are saved to this device. Family and academic records stay in their existing systems."));
 hero.insertAdjacentElement("afterend",root);
 // Add navigational overview without duplicating or altering official learning state.
 const adventure=mk("section","kep-adventure");
 adventure.id="kepAdventureToday";adventure.setAttribute("aria-labelledby","kepAdventureHeading");
 adventure.append(mk("p","kep-adventure-eyebrow","TODAY'S DISCOVERIES"),mk("h2","","My Adventure Today"),
  mk("p","","Follow your own learning trail. Your lessons, pinned subjects and achievements still belong to their original Academy systems."));
 const nav=mk("div","kep-adventure-links");
 const shortcuts=[["Start My Lesson","#nextSteps"],["My Favorite Subjects","#pinned"],["My Learning Passport","#academyStudio"],["Visit My Grade",null]];
 for(const [label,hash] of shortcuts){
  const btn=mk("button","kep-adventure-button",label);btn.type="button";
  btn.addEventListener("click",()=>{if(hash)navigate(hash);else if(identity())w.location.assign(gradeURL());else openGuest()});
  nav.append(btn);
 }
 adventure.append(nav);
 root.insertAdjacentElement("afterend",adventure);
 // Preserve the legacy editor's DOM and handlers as an optional advanced panel.
 // The guardian checkbox remains at the top beside the new universal editor.
 const oldPicture=$("avatars")?.closest("section.card");
 const oldBackground=$("themes")?.closest("section.card");
 if(oldPicture&&oldBackground&&!$("kepOriginalPictureTools")){
  const advanced=mk("details","kep-advanced");advanced.id="kepOriginalPictureTools";
  advanced.append(mk("summary","","Original Picture, Garden Colors & Backup Tools"));
  const explanation=mk("p","","Your original photo controls, Kindergarten picture transfer, themes, import/export and printing are all preserved here.");
  const panels=mk("div","kep-advanced-panels");panels.append(oldPicture,oldBackground);
  advanced.append(explanation,panels);
  adventure.insertAdjacentElement("afterend",advanced);
 }
 // Add explicit quick actions beside the existing hero actions.
 const heroActions=hero.querySelector(".actions");
 if(heroActions&&!$("kepHeroEdit")){
  const edit=mk("button","kep-hero-edit","Edit My Profile");edit.id="kepHeroEdit";edit.type="button";edit.addEventListener("click",()=>act("look"));
  heroActions.prepend(edit);
  const start=mk("button","kep-hero-start","Start Today's Learning");start.type="button";start.addEventListener("click",()=>act("today"));
  heroActions.insertBefore(start,edit.nextSibling);
 }
 // Reparent the *existing* two Academy links and their handlers, rather than
 // cloning, hiding, or changing any course/portfolio destinations.
 if(heroActions&&!$("kepHeroActionsBelow")){
  heroActions.id="kepHeroActionsBelow";
  heroActions.classList.add("kep-hero-actions-below");
  hero.insertAdjacentElement("afterend",heroActions);
  const first=heroActions.querySelector("#firstStepLink");
  if(first){first.classList.add("kep-first-step");first.textContent="Today's First Step";}
  const portfolio=[...heroActions.querySelectorAll("a")].find(a=>a.getAttribute("href")==="#academyStudio");
  if(portfolio){portfolio.classList.add("kep-full-profile");portfolio.textContent="My Full Learning Profile";}
  const editor=heroActions.querySelector("#kepHeroEdit");
  const begin=heroActions.querySelector(".kep-hero-start");
  if(editor)editor.textContent="Edit My Profile";
  if(begin)begin.textContent="Start Today's Learning";
 }
 refresh();return true;
}
w[KEY]=Object.freeze({version:"1.0",mount,refresh});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
for(const event of ["khaemenes-family-changed","khaemenes-learner-placement-changed","khaemenes-elementary-universal-look-updated","pageshow"])w.addEventListener(event,()=>{mount();refresh()});
})();
