/* Idempotent Pre-K Picture & Colors entry. No registry writes.
 * Works with the existing adultConfirm checkbox and native appearance backup.
 */
(()=>{"use strict";const w=window,d=document,ID="khaePrekUniversalLookEntry";
if(w.KhaemenesPreschoolUniversalLookEntry)return;
const $=id=>d.getElementById(id);
function style(){
 if($("khaePrekUniversalLookStyle"))return;
 const x=d.createElement("style");x.id="khaePrekUniversalLookStyle";
 x.textContent=`
#${ID}{max-width:1150px;margin:18px auto 20px;padding:25px;border:2px solid #34566b;border-radius:7px;background:#fffaf0;color:#243d50;text-align:center}
#${ID} h2{font:400 clamp(28px,4vw,33px)/1.3 Cinzel,Georgia,serif;color:#243d50;margin:0 0 10px}
#${ID} p,#${ID} label{font:400 18px/1.55 Nunito,Arial,sans-serif;color:#243d50}
#${ID} p{margin:9px auto;max-width:780px}
#${ID} .kpu-consent{display:flex;justify-content:center;align-items:center;gap:11px;flex-wrap:wrap;margin:17px auto;padding:13px 16px;background:#f1f5e9;border:1px solid #7d978c;border-radius:7px;width:fit-content;max-width:100%}
#${ID} .kpu-consent label{display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left}
#${ID} .kpu-consent input{width:22px;height:22px;flex:none;accent-color:#315c49}
#${ID} .kpu-open{display:inline-flex;align-items:center;justify-content:center;padding:11px 24px;min-height:52px;border:1px solid #b48b45;border-radius:7px;background:#202724;color:#fff8e9;font:400 18px/1.4 Nunito,Arial,sans-serif;cursor:pointer}
#${ID} .kpu-open:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
#${ID} .kpu-open:disabled{opacity:.65;cursor:not-allowed}
#${ID} .kpu-status{min-height:1.5em}
#${ID} .kpu-classic{display:block;margin:9px auto 0;font:400 16px/1.5 Nunito,Arial,sans-serif;color:#315c49}
`;
 d.head.append(x);
}
function mount(){
 if($(ID))return true;
 const hero=d.querySelector(".profile-hero"),consent=$("adultConfirm");
 if(!hero||!consent||!w.KhaemenesUniversalProfileLookEditor?.registered?.()||!w.KhaemenesPreschoolUniversalLookAdapter)return false;
 style();
 const section=d.createElement("section");section.id=ID;section.setAttribute("aria-labelledby","kpuTitle");
 const title=d.createElement("h2");title.id="kpuTitle";title.textContent="My Picture & Colors";
 const help=d.createElement("p");help.textContent="Choose from 24 badges, 10 picture frames, and 24 colors with a grown-up. Your learning records, Garden, and saved backups stay where they belong.";
 const consentBox=d.createElement("div");consentBox.className="kpu-consent";
 const approvalLabel=consent.closest("label");
 if(approvalLabel)consentBox.append(approvalLabel); // MOVE the original node, don't duplicate its ID or handler.
 const button=d.createElement("button");button.type="button";button.className="kpu-open";button.textContent="Customize My Picture & Colors";
 const status=d.createElement("p");status.className="kpu-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const legacy=d.createElement("p");legacy.className="kpu-classic";legacy.textContent="Your original picture controls, learning-space colors, and backup tools remain available below while this new editor is being proofed.";
 section.append(title,help,consentBox,button,status,legacy);
 hero.insertAdjacentElement("afterend",section);
 button.addEventListener("click",()=>{
  const identity=w.KhaemenesPreschoolUniversalLookAdapter?.getIdentity?.();
  if(!identity){status.textContent="Choose your enrolled Pre-K learner in the Family Portal first.";return}
  if(!consent.checked){status.textContent="Please check the grown-up confirmation above before changing this learner's appearance.";consent.focus();return}
  if(!w.KhaemenesUniversalProfileLookEditor.open("picture"))status.textContent="Picture editor unavailable; use the original controls below.";
 });
 consent.addEventListener("change",()=>{status.textContent=consent.checked?"Grown-up assistance confirmed for the selected learner.":""});
 refresh();return true;
}
function refresh(){
 const section=$(ID);if(!section)return;
 const identity=w.KhaemenesPreschoolUniversalLookAdapter?.getIdentity?.();
 const button=section.querySelector("button.kpu-open");
 if(button)button.disabled=!identity;
}
w.KhaemenesPreschoolUniversalLookEntry=Object.freeze({mount,refresh});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
w.addEventListener("khaemenes-family-changed",()=>{mount();refresh()});
w.addEventListener("pageshow",()=>{mount();refresh()});
})();
