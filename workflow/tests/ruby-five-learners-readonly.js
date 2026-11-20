/* Ruby + five fictional learners: metadata-only discovery.
   Run in DevTools Console on the original https://vervenveda.com Academy browser profile.
   NO writes, network I/O, export, IDs, names, grades or other student values printed.
*/
(() => {
  "use strict";
  if (location.origin !== "https://vervenveda.com") {
    console.info("RUBY_FAMILY_AUDIT=HOLD; use the original vervenveda.com browser profile.");
    return;
  }
  const result = {audit:"RUBY_FIVE_LEARNERS_READONLY_V1", mode:"READ_ONLY",
    registry:"NOT_FOUND", rubyFamilyMatches:0, rubyAdultMatches:0,
    rubyLearnerMatches:0, candidateFamilies:0, candidateFamilyLearnerCounts:[],
    exactlyFiveLearners:false, ambiguous:false, action:"DO_NOT_CREATE_OR_RESET"};
  try {
    const raw=localStorage.getItem("khaemenes_family_registry_v1");
    if (!raw){console.info(JSON.stringify(result,null,2));return;}
    const registry=JSON.parse(raw);
    result.registry="PRESENT";
    const families=Object.values(registry.families||{}).filter(Boolean);
    const adults=Object.values(registry.adults||{}).filter(Boolean);
    const learners=Object.values(registry.learners||{}).filter(Boolean);
    const ruby=s=>/\bruby\b/i.test(String(s||""));
    const matchingFamilies=families.filter(f=>ruby(f.displayName));
    const matchingAdults=adults.filter(a=>ruby(a.displayName)||ruby(a.screenName)||ruby(a.nickname));
    const matchingLearners=learners.filter(l=>ruby(l.nickname));
    result.rubyFamilyMatches=matchingFamilies.length;
    result.rubyAdultMatches=matchingAdults.length;
    result.rubyLearnerMatches=matchingLearners.length;
    const candidates=families.filter(f=>
      matchingFamilies.includes(f) ||
      matchingAdults.some(a=>(f.adultIds||[]).includes(a.adultId) || (a.familyIds||[]).includes(f.familyId)) ||
      matchingLearners.some(l=>l.familyId===f.familyId));
    result.candidateFamilies=candidates.length;
    result.candidateFamilyLearnerCounts=candidates.map(f=>{
      const linked=(Array.isArray(f.learnerIds)?f.learnerIds:[])
        .filter(id=>learners.some(l=>l.learnerId===id&&l.familyId===f.familyId&&!l.selfDirectedAdult));
      return linked.length;
    });
    result.exactlyFiveLearners=candidates.length===1&&result.candidateFamilyLearnerCounts[0]===5;
    result.ambiguous=candidates.length>1;
    result.action=result.exactlyFiveLearners?"PRESERVE_ORIGINAL_PROFILE_AND_VERIFY_BACKUP":
      candidates.length===0?"CHECK_ORIGINAL_BROWSER_OR_DEVICE":"REVIEW_LOCALLY_NO_MERGE";
  }catch(e){result.registry="UNREADABLE_OR_INVALID";result.action="PRESERVE_BROWSER_DO_NOT_RESET";}
  console.info(JSON.stringify(result,null,2));
})();
