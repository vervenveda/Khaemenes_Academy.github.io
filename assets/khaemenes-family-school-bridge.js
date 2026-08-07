(function attachKhaemenesFamilySchoolBridge(global){
  "use strict";

  const script=document.currentScript;
  const stage=(script?.dataset?.khaemenesStage || "").trim();
  const familyPortal="https://vervenveda.com/Khaemenes_Academy.github.io/family/";

  function waitForRegistry(attempt=0){
    const registry=global.KhaemenesFamilyRegistry;
    if(registry){
      render(registry);
      return;
    }
    if(attempt<80) setTimeout(()=>waitForRegistry(attempt+1),50);
  }

  function injectSharedRegistry(){
    if(global.KhaemenesFamilyRegistry){ waitForRegistry(); return; }
    const src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
    if(document.querySelector(`script[src="${src}"]`)){ waitForRegistry(); return; }
    const s=document.createElement("script");
    s.src=src;
    s.onload=()=>waitForRegistry();
    document.head.appendChild(s);
  }

  function render(registry){
    const existing=document.getElementById("khaemenesFamilyBridge");
    if(existing) existing.remove();

    const learner=registry.getLearner();
    const family=registry.getFamily();

    const box=document.createElement("aside");
    box.id="khaemenesFamilyBridge";
    box.setAttribute("aria-label","Khaemenes family profile");
    box.style.cssText=[
      "position:fixed","right:12px","bottom:12px","z-index:9998",
      "max-width:300px","padding:10px 12px","border:1px solid rgba(50,75,60,.18)",
      "border-radius:11px","background:rgba(255,255,255,.96)",
      "box-shadow:0 10px 30px rgba(35,60,45,.16)","font:13px/1.4 Arial,sans-serif",
      "color:#31483a","text-align:left"
    ].join(";");

    const stageLabel=stage ? ` · ${stage}` : "";
    box.innerHTML=learner
      ? `<strong>${escapeHTML(learner.nickname)}</strong><br><span>${escapeHTML(family?.displayName || "Khaemenes Family")}${escapeHTML(stageLabel)}</span><br><a href="${familyPortal}" style="display:inline-block;margin-top:6px;color:#2f7140;font-weight:700">Family Profile →</a>`
      : `<strong>Khaemenes Family</strong><br><span>One family profile across Pre-K–12${escapeHTML(stageLabel)}</span><br><a href="${familyPortal}" style="display:inline-block;margin-top:6px;color:#2f7140;font-weight:700">Register / Open Family Profile →</a>`;

    document.body.appendChild(box);
  }

  function escapeHTML(value){
    return String(value ?? "").replace(/[&<>"']/g,c=>({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[c]);
  }

  injectSharedRegistry();
})(window);
