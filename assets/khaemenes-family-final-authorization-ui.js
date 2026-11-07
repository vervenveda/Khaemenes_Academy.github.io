/* Khaemenes Academy Family Center: final authorization preflight.
 * Public presentation only. No email challenge, account authentication, deletion,
 * registry mutation, grade mutation, or private service endpoint is implemented here.
 * Remain fail-closed until an approved secure family account service is commissioned.
 */
(function familyFinalAuthorizationPreflight(global){
  "use strict";
  if(global.KhaemenesFamilyFinalAuthorizationUI) return;
  const doc=global.document;
  const DIALOG_ID="khaemenesFinalAuthorizationDialog";
  let lastFocus=null;
  function mount(){
    if(doc.getElementById(DIALOG_ID))return doc.getElementById(DIALOG_ID);
    const dialog=doc.createElement("dialog");
    dialog.id=DIALOG_ID;
    dialog.className="khae-final-auth-dialog";
    dialog.setAttribute("aria-labelledby","khae-final-auth-title");
    dialog.setAttribute("aria-describedby","khae-final-auth-description");
    dialog.innerHTML='<div class="khae-final-auth-panel"><p class="khae-final-auth-eyebrow">Khaemenes Academy · Parent Safeguards</p><h2 id="khae-final-auth-title">Review Learner Removal</h2><p id="khae-final-auth-description">Removing an Academy learner profile and permanently erasing academic records are different actions. The permanent-removal process is not currently available.</p><p class="khae-final-auth-learner">Selected learner: <strong data-final-auth-learner></strong></p><div class="khae-final-auth-warning" role="note"><h3>Protect the learner’s progress</h3><p>Before any permanent removal, save and verify a complete, restorable backup of the records you intend to preserve. The family backup may not contain course grades, portfolios, or academic evidence maintained by separate course systems.</p><p><strong>Backup status:</strong> Not independently verified by this preview.</p></div><h3>Final Authorization Code</h3><p>A four-digit, single-use code sent to the authenticated parent’s verified email will confirm one specific irreversible action. It is <strong>not</strong> the parent’s account password.</p><p><strong>Service status:</strong> Not connected. No email can be sent and no records can be removed.</p><div class="khae-final-auth-code-preview" aria-label="Final authorization code entry, unavailable"><label for="khae-final-auth-code">Four-digit confirmation code</label><input id="khae-final-auth-code" type="text" inputmode="numeric" autocomplete="off" maxlength="4" pattern="[0-9]{4}" placeholder="••••" disabled aria-describedby="khae-final-auth-code-note"><p id="khae-final-auth-code-note">Code entry and verification are disabled until the secure Family Account service is commissioned.</p><button type="button" disabled aria-disabled="true">Send Code — Unavailable</button><button type="button" disabled aria-disabled="true">Authorize Permanent Action — Unavailable</button></div><div class="khae-final-auth-actions"><a href="enroll/#existing" class="khae-final-auth-link">Change Grade Instead</a><a href="#family-records-controls" class="khae-final-auth-link" data-final-auth-backup>Review Family Backup Tools</a><button type="button" class="khae-final-auth-close" data-final-auth-close>Close</button></div><p class="khae-final-auth-status" role="status">No profile or academic records have been changed or deleted.</p></div>';
    dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
    dialog.addEventListener("close",()=>{lastFocus?.focus?.();lastFocus=null});
    dialog.querySelector("[data-final-auth-close]").addEventListener("click",()=>dialog.close());
    dialog.querySelector("[data-final-auth-backup]").addEventListener("click",()=>dialog.close());
    doc.body.appendChild(dialog);
    return dialog;
  }
  doc.addEventListener("click",event=>{
    const control=event.target.closest?.("[data-review-learner-removal]");
    if(!control)return;
    event.preventDefault();
    const registry=global.KhaemenesFamilyRegistry;
    const learnerId=control.getAttribute("data-review-learner-removal");
    const familyId=registry?.activeIds?.().familyId;
    const family=registry?.getFamily?.(familyId);
    const learner=family?.learners?.find?.(entry=>entry.learnerId===learnerId&&!entry.selfDirectedAdult);
    if(!learner)return;
    lastFocus=control;
    const dialog=mount();
    dialog.querySelector("[data-final-auth-learner]").textContent=learner.nickname||"Learner";
    if(typeof dialog.showModal==="function"&&!dialog.open)dialog.showModal();
  });
  global.KhaemenesFamilyFinalAuthorizationUI=Object.freeze({status:"PRE_COMMISSIONING_DISABLED",canDelete:false,canRequestCode:false});
})(window);
