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
 const button=section.querySelector("button.kku-action");
 if(button)button.disabled=!identity;
}
w.KhaemenesKindergartenUniversalLookEntry=Object.freeze({mount,refresh});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
for(const event of ["khaemenes-family-changed","pageshow"])w.addEventListener(event,()=>{mount();refresh()});
})();
