/* Kindergarten Picture & Colors universal entry; idempotent.
 * Inserts immediately below title hero, above learner notices/workspace.
 * Native picture nodes are retained for dependent handlers; only visually
 * retired after a successful universal mount.
 */
(()=>{"use strict";
const w=window,d=document,ID="khaemenesKinderUniversalLookEntry";
if(w.KhaemenesKindergartenUniversalLookEntry)return;
const $=id=>d.getElementById(id);
function styles(){
 if($("khaemenesKinderUniversalLookStyles"))return;
 const el=d.createElement("style");el.id="khaemenesKinderUniversalLookStyles";
 el.textContent=`
#${ID}{width:100%;margin:0 auto 24px;padding:28px 24px;border:2px solid #315c49;border-radius:7px;background:linear-gradient(115deg,#fff8e9,#f5f1dd 55%,#e5f5d6);color:#202724;text-align:center;box-shadow:0 8px 24px rgba(31,52,39,.10)}
#${ID} h2{font:400 clamp(28px,4vw,33px)/1.3 Cinzel,Georgia,serif!important;letter-spacing:0!important;margin:0 0 9px;color:#202724}
#${ID} p,#${ID} label{font:400 18px/1.55 Nunito,"Trebuchet MS",Arial,sans-serif!important;color:#304b3a}
#${ID} p{max-width:810px;margin:7px auto 12px}
#${ID} .kku-consent{display:flex;align-items:center;justify-content:center;padding:14px 18px;margin:15px auto;width:fit-content;max-width:100%;border:1px solid #7e987c;background:#f5f9e9;border-radius:7px}
#${ID} .kku-consent label{display:flex;align-items:center;gap:12px;text-align:left;margin:0}
#${ID} .kku-consent input{width:22px;height:22px;flex:none;accent-color:#315c49}
#${ID} .kku-actions{display:flex;justify-content:center;align-items:stretch;flex-wrap:wrap;gap:12px;margin:16px auto 8px}
#${ID} .kku-action{display:inline-flex;align-items:center;justify-content:center;min-height:49px;padding:10px 20px;border:1px solid #202724;border-radius:7px;background:#202724;color:#fff8e9;font:400 18px/1.35 Nunito,"Trebuchet MS",Arial,sans-serif!important;cursor:pointer;text-decoration:none;box-shadow:none}
#${ID} .kku-action.secondary{background:#fff8e9;color:#202724}
#${ID} .kku-action:disabled{opacity:.65;cursor:not-allowed}
#${ID} .kku-status{min-height:24px}
#${ID} :focus-visible{outline:3px solid #b48b45;outline-offset:3px}
body.kku-mounted main .kindergarten-native-picture{display:none!important}
@media(max-width:600px){#${ID}{padding:21px 13px}#${ID} .kku-action{width:100%}}
`;
 d.head.append(el);
}
function mount(){
 if($(ID))return true;
 const core=w.KhaemenesUniversalProfileLookEditor,adapter=w.KhaemenesKindergartenUniversalLookAdapter;
 const main=$("main"),notice=$("accountNote"),consent=$("adultConfirm"),native=consent?.closest(".personalize");
 if(!core?.registered?.()||!adapter||!main||!notice||!consent||!native)return false;
 styles();
 const section=d.createElement("section");section.id=ID;section.setAttribute("aria-labelledby","kkuHeading");
 const heading=d.createElement("h2");heading.id="kkuHeading";heading.textContent="My Picture & Colors";
 const desc=d.createElement("p");desc.textContent="Choose 24 badges, 10 picture frames, 24 colors, and your favorite name font with a grown-up. Your Learning Garden, stickers, mastery and family backups are preserved.";
 const consentBox=d.createElement("div");consentBox.className="kku-consent";
 const label=consent.closest("label");if(!label)return false;consentBox.append(label);
 const actions=d.createElement("div");actions.className="kku-actions";
 const open=d.createElement("button");open.className="kku-action";open.type="button";open.textContent="Customize My Picture & Colors";
 const transfer=$("usePreschoolPhoto");
 if(transfer){transfer.classList.add("kku-action","secondary");transfer.textContent="Bring My Pre-K Picture";actions.append(transfer)}
 actions.prepend(open);
 const status=d.createElement("p");status.className="kku-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const info=d.createElement("p");info.textContent="My Garden Colors, saved picture backups, and the Grade 1 bridge remain available below.";
 section.append(heading,desc,consentBox,actions,status,info);
 main.insertBefore(section,notice);
 native.classList.add("kindergarten-native-picture");
 d.body.classList.add("kku-mounted");
 open.addEventListener("click",()=>{
  if(!adapter.getIdentity()){status.textContent="Choose your Kindergarten learner in the Family Center first.";return}
  if(!consent.checked){status.textContent="Please confirm grown-up assistance before customizing this learner's profile.";consent.focus();return}
  if(!core.open("picture"))status.textContent="The picture editor is unavailable; your saved profile is unchanged.";
 });
 consent.addEventListener("change",()=>{status.textContent=consent.checked?"Grown-up assistance confirmed for the selected learner.":""});
 refresh();return true;
}
function refresh(){
 const section=$(ID);if(!section)return;
 const identity=w.KhaemenesKindergartenUniversalLookAdapter?.getIdentity?.();
 const button=section.querySelector("button.kku-action");if(button)button.disabled=!identity;
 const card=d.querySelector(".hero .hero-grid"),face=$("photoPreview"),name=$("childTitle");if(!card||!face||!name)return;
 let rec={};if(identity)try{rec=JSON.parse(w.localStorage.getItem("khaemenes_kindergarten_visual_profile_v1:"+encodeURIComponent(identity.id))||"{}");if(rec.learnerId!==identity.id||rec.schema!=="khaemenes.kindergarten-visual.v1")rec={}}catch{rec={}}
 const v=rec.universalLook||{},frames=new Set(["rectangle","square","circle","oval","rhombus","heart","star","octagon","semicircle","kite"]);
 const paths={rhombus:"polygon(50% 0,100% 50%,50% 100%,0 50%)",heart:"polygon(50% 95%,43% 88%,31% 76%,20% 64%,10% 51%,4% 39%,4% 25%,10% 13%,21% 7%,32% 7%,42% 13%,50% 24%,58% 13%,68% 7%,79% 7%,90% 13%,96% 25%,96% 39%,90% 51%,80% 64%,69% 76%,57% 88%)",star:"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)",octagon:"polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 70%,0 30%)",semicircle:"polygon(0 100%,0 50%,4% 31%,15% 15%,31% 4%,50% 0,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)",kite:"polygon(50% 0,90% 38%,50% 100%,10% 38%)"};
 const frame=frames.has(v.frame)?v.frame:"";
 face.style.clipPath=paths[frame]||"none";
 face.style.borderRadius=frame?(["circle","oval"].includes(frame)?"50%":["rectangle","square"].includes(frame)?"7px":"0"):"";
 face.style.width=frame?(frame==="rectangle"?"245px":frame==="oval"?"205px":"210px"):"";
 face.style.height=frame?(frame==="rectangle"?"165px":frame==="oval"?"178px":"210px"):"";
 const tint=typeof v.cardColor==="string"&&/^#[0-9a-f]{6}$/i.test(v.cardColor)?v.cardColor:"";
 card.style.backgroundColor=tint||"";card.style.backgroundImage=tint?"none":"";
 let ink="";if(tint){const rgb=[1,3,5].map(i=>parseInt(tint.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);ink=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]>.18?"#202724":"#fff8e9"}
 card.style.color=ink;
 for(const el of card.querySelectorAll(".eyebrow,#childTitle,#childMeta")){el.style.color=ink;el.style.textShadow=tint?"none":""}
 const fonts={academy:'Cinzel,Georgia,serif',friendly:'Nunito,"Trebuchet MS",Arial,sans-serif',classic:'Georgia,"Times New Roman",serif',modern:'"Trebuchet MS",Arial,sans-serif',handwriting:'"Comic Sans MS","Trebuchet MS",cursive'};
 name.style.setProperty("font-family",fonts[v.nameFont]||fonts.academy,"important");name.style.setProperty("font-weight","400","important");
 if(rec.photo&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(rec.photo)&&rec.photo.length<180000){const img=d.createElement("img");img.src=rec.photo;img.alt="Learner's locally stored picture";face.replaceChildren(img)}
 else if(typeof v.badge==="string"&&v.badge)face.textContent=v.badge;
 else if(!face.querySelector("img"))face.textContent=rec.avatar||"🌻";
}
w.addEventListener("khaemenes-kindergarten-universal-look-updated",refresh);
w.KhaemenesKindergartenUniversalLookEntry=Object.freeze({mount,refresh});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
for(const event of ["khaemenes-family-changed","pageshow"])w.addEventListener(event,()=>{mount();refresh()});
})();
