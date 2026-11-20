/* Academy Family Account Center v1
 * Single, read-only Family Portal modal. Reuses the canonical Family Registry.
 * No credential collection, authorization claims, mutations, network calls or cloud writes.
 * Local browser identity selectors are NOT proof of guardianship or secure sign-in.
 */
(function academyFamilyAccountCenter(global){
  "use strict";
  const doc=global.document;
  const modal=doc.getElementById("academyFamilyAccountDialog");
  if(!modal||modal.dataset.initialized==="true")return;
  modal.dataset.initialized="true";
  const R=global.KhaemenesFamilyRegistry;
  const body=modal.querySelector("[data-family-account-overview]");
  const title=modal.querySelector("#academyFamilyAccountDialogTitle");
  if(!body||!title)return;
  const text=(tag,content,className)=>{
    const e=doc.createElement(tag);
    e.textContent=String(content??"");
    if(className)e.className=className;
    return e;
  };
  const link=(label,href,description)=>{
    const a=doc.createElement("a");
    a.href=href;a.className="academy-account-action";
    a.append(text("strong",label));
    if(description)a.append(text("span",description));
    return a;
  };
  const masked=id=>{
    const value=String(id||"");
    return value?("•••• "+value.slice(-4)):"Not available";
  };
  const line=(label,value)=>{
    const p=text("p","");
    const strong=text("strong",label+": ");
    p.append(strong,doc.createTextNode(value));
    return p;
  };
  function section(name){
    const e=doc.createElement("section");
    e.className="academy-account-panel";
    e.append(text("h3",name));
    body.append(e);
    return e;
  }
  function actions(e,...items){
    const wrapper=doc.createElement("div");
    wrapper.className="academy-account-links";
    for(const item of items)wrapper.append(item);
    e.append(wrapper);
  }
  function render(){
    body.replaceChildren();
    const scope=section("Enrollment & Family Identity");
    if(!R||typeof R.load!=="function"){
      scope.append(text("p","Family Registry is unavailable. No records were changed. Open the existing enrollment or recovery page."));
      actions(scope,link("Family Enrollment","enroll/","Find existing family or begin provisional intake"));
      return;
    }
    let registry,active,family;
    try{
      registry=R.load();active=R.activeIds?.()||{};
      family=active.familyId?registry.families?.[active.familyId]:null;
    }catch{
      scope.append(text("p","This browser could not read its family record. Preserve your original browser data and use the Family Records recovery controls."));
      actions(scope,link("Family Backups","#family-records-controls","Inspect existing recovery tools"));
      return;
    }
    const info=text("p","LOCAL PROFILE ONLY · These IDs and links are browser-local references, not verified credentials, global student IDs, or proof of guardianship.","academy-account-warning");
    scope.append(info);
    if(family){
      scope.append(line("Selected family",family.displayName||"Local family"));
      scope.append(line("Family reference (masked)",masked(family.familyId)));
      const adults=(Array.isArray(family.adultIds)?family.adultIds:[]).filter(id=>registry.adults?.[id]&&registry.adults[id].familyIds?.includes(family.familyId));
      const students=(Array.isArray(family.learnerIds)?family.learnerIds:[])
        .map(id=>registry.learners?.[id])
        .filter(l=>l&&l.familyId===family.familyId&&!l.selfDirectedAdult);
      scope.append(line("Linked adults",String(adults.length)));
      scope.append(line("Linked K–12 students",String(students.length)));
      const student=section("Linked Student Records");
      if(!students.length)student.append(text("p","No linked K–12 learner records were found for the selected local family."));
      else{
        const list=doc.createElement("ol");
        list.className="academy-account-learner-list";
        students.forEach((l,i)=>{
          const li=doc.createElement("li");
          li.append(text("span","Student "+(i+1)+" · Local learner reference: "+masked(l.learnerId)));
          li.append(text("small","Account reference: "+masked(l.accountId)+" · Detailed records open through the existing Parent Profile and class progress tools."));
          list.append(li);
        });
        student.append(list);
      }
      actions(student,
        link("My Learners","profile/#parent-learner-panel","Review the linked student profiles"),
        link("Progress & Grades","progress/","Use the existing parent records pathway"),
        link("Family Backups","#family-records-controls","Verified local export and restore tools"));
    }else{
      scope.append(text("p","No selected family was found in this browser. An existing family may be saved on another browser profile or device. Do not register a duplicate just to find it."));
      const s=section("Linked Student Records");
      s.append(text("p","Choose or restore the existing family to see its linked learner count. No personal student records are displayed without a selected family."));
      actions(s,link("Find My Family","enroll/","Use the existing enrollment and local recovery pathway"),link("Family Backup Tools","#family-records-controls","Recover an existing family backup"));
    }
    actions(scope,
      link("Open Enrollment Application","enroll/?application=open","Existing registration popup, including its disclosures"),
      link("Update Grade / Placement","enroll/#existing","Update existing local learner placement"));
    const security=section("Passcodes & Account Protection");
    security.append(text("p","Parent / Guardian: 10-digit passcode for sensitive account actions after verified adult sign-in."));
    security.append(text("p","Student: student-chosen 5-digit passcode for personal profile privacy and cross-device sign-in once the protected credential service is commissioned."));
    security.append(text("p","Account recovery: the previously discussed 4-digit reference is provisional and never works alone to reset an account."));
    const control=doc.createElement("div");
    control.className="academy-account-security-controls";
    for(const label of ["Change Parent Passcode","Change Student Passcode","Change Administrator Passcode"]){
      const button=text("button",label);
      button.type="button";button.disabled=true;
      button.title="Awaiting protected credential verification and security email notifications";
      control.append(button);
    }
    security.append(control);
    security.append(text("p","Passcode changes and notification emails are NOT active. Do not enter a PIN, password or recovery code into the local Family Portal. Once commissioned, the change flow must verify the current credential and registered email through the protected service, then send a security notice.","academy-account-warning"));
    actions(security,link("Account Connection Status","profile/#parentProfileConnectivity","Check whether verified sign-in is available"));
  }
  const open=()=>{
    render();
    if(!modal.open)modal.showModal();
  };
  doc.addEventListener("click",event=>{
    const target=event.target.closest?.("[data-open-family-account]");
    if(target){event.preventDefault();open();return;}
    if(event.target===modal)modal.close();
  });
  modal.querySelector("[data-close-family-account]")?.addEventListener("click",()=>modal.close());
  // Reopen/refresh reads canonical registry; do not create a competing local state cache.
  for(const name of ["khaemenes-family-changed","khaemenes-learner-placement-changed"]){
    global.addEventListener(name,()=>{if(modal.open)render();});
  }
  global.addEventListener("storage",event=>{
    if(modal.open&&(!event.key||event.key==="khaemenes_family_registry_v1"))render();
  });
  global.KhaemenesFamilyAccountCenter=Object.freeze({version:"1.0.0",open});
})(window);
