import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const index=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const personalization=fs.readFileSync(new URL("../assets/khaemenes-home-personalization.js",import.meta.url),"utf8");
const router=fs.readFileSync(new URL("../assets/khaemenes-front-door-router.js",import.meta.url),"utf8");

test("public Academy home does not hard-code a personalized learner bar",()=>{
  assert.doesNotMatch(index,/id=["']khaemenesMyAcademyBar["']/);
  assert.match(personalization,/if\(!snapshot\.hasIdentity\)\{removeBar\(\);return\}/);
});

test("Academy home loads continuation before the account-aware controller",()=>{
  const continuation=index.indexOf("./assets/khaemenes-learning-continuation.js");
  const personalizationScript=index.indexOf("./assets/khaemenes-home-personalization.js");
  assert.ok(continuation>=0);
  assert.ok(personalizationScript>continuation);
});

test("identity can come from family, adult, learner, or adult-scholar state",()=>{
  assert.match(personalization,/Boolean\(family\?\.familyId\|\|adult\?\.adultId\|\|learner\?\.learnerId\|\|scholar\?\.learnerId\)/);
  assert.match(personalization,/const activeAdultScholar=learner\?\.selfDirectedAdult===true\?learner:null/);
  assert.match(personalization,/const scholar=activeAdultScholar\|\|\(!learner\?adultLearner:null\)\|\|null/);
});

test("an actively selected child learner wins over adult-scholar fallback",()=>{
  assert.match(personalization,/activeAdultScholar\|\|\(!learner&&adultLearner\)\?"adult":learner\?\.learnerId\?"learner":"family"/);
  assert.match(personalization,/learner:mode==="adult"\?scholar:learner/);
});

test("profile utility is absent before account creation",()=>{
  assert.match(personalization,/if\(!snapshot\.hasIdentity\)\{profile\?\.remove\(\);return\}/);
});

test("utility dock reuses the universal Beta button instead of creating another",()=>{
  assert.match(personalization,/BETA_ID="vnvBetaProgramLink"/);
  assert.match(personalization,/beta&&beta\.parentElement!==dock\)dock\.appendChild\(beta\)/);
  assert.doesNotMatch(personalization,/createElement\(["']button["']\).*Beta Program/);
});

test("utility dock includes Profile, Search, Updates, Archaemenes, Contribute, and the shared Beta doorway",()=>{
  assert.match(personalization,/MENTOR_ID="khaemenesHomeMentorButton"/);
  assert.match(personalization,/PROFILE_ID="khaemenesHomeProfileButton"/);
  assert.match(personalization,/SEARCH_ID="khaemenesHomeSearchButton"/);
  assert.match(personalization,/UPDATES_ID="khaemenesHomeUpdatesButton"/);
  assert.match(personalization,/CONTRIBUTE_ID="khaemenesHomeContributeButton"/);
  assert.match(personalization,/profileDestination\(snapshot\)/);
  assert.match(personalization,/mentorDestination\(\)/);
  assert.match(personalization,/renderUpdates\(accountSnapshot\(\)\)/);
  assert.match(personalization,/search:"https:\/\/vervenveda\.github\.io\/PLERASearch\.github\.io\//);
  assert.match(personalization,/contribute:"https:\/\/buy\.stripe\.com\/aFa8wQ5xf9Scf65caT4AU0s"/);
  assert.match(personalization,/contribute\.target="_blank"/);
  assert.match(personalization,/contribute\.rel="noopener noreferrer"/);
});

test("learner-specific home copy is protected from optional online translation",()=>{
  assert.match(personalization,/setAttribute\(["']data-private["']/);
  assert.match(personalization,/setAttribute\(["']data-i18n-no-online["']/);
});

test("home auto-updates for account, placement, and learning-continuation changes",()=>{
  for(const eventName of [
    "khaemenes-family-ready",
    "khaemenes-family-changed",
    "khaemenes-learner-placement-changed",
    "khaemenes-learning-continuation-changed"
  ]) assert.match(personalization,new RegExp(eventName));
  assert.match(personalization,/startsWith\(["']khaemenes["']\)/);
});

test("stale course snapshots cannot become Continue Learning deep links",()=>{
  assert.match(personalization,/item\.stale!==true/);
  assert.match(personalization,/item\.freshness!=="stale"/);
  const block=personalization.slice(personalization.indexOf("function bestContinuation"),personalization.indexOf("function mentorDestination"));
  assert.match(block,/status!=="complete"/);
  assert.match(block,/nextHref/);
});

test("multi-learner families get a direct active-learner switcher",()=>{
  assert.match(personalization,/function familyLearners\(snapshot\)/);
  assert.match(personalization,/function learnerSwitcher\(snapshot\)/);
  assert.match(personalization,/data-academy-learner-switch/);
  assert.match(personalization,/Choose learner/);
  assert.match(personalization,/router\(\)\?\.switchLearner\?\.\(learnerId,\{continueAfter:false\}\)/);
  assert.match(router,/function switchLearner\(learnerId,\{continueAfter=false\}=\{\}\)/);
});

test("student, family, and adult scholar profiles route to their own portals",()=>{
  assert.match(personalization,/if\(snapshot\.mode==="adult"\)return URLS\.adult/);
  assert.match(personalization,/if\(snapshot\.mode==="learner"\)return URLS\.student/);
  assert.match(personalization,/if\(snapshot\.mode==="family"\)return URLS\.family/);
});


test("My Academy surfaces honest account connection health without claiming unverified cloud sync",()=>{
  assert.match(personalization,/function connectionState\(\)/);
  assert.match(personalization,/KhaemenesAccountConnectionStatus\?\.read/);
  assert.match(personalization,/serverVerified:false/);
  assert.match(personalization,/Cloud sync not verified/);
  assert.match(personalization,/data-academy-account-health/);
  assert.match(personalization,/openDialog\("accountContinuityDialog"\)/);
  assert.match(index,/id="accountContinuityDialog"/);
  assert.match(index,/data-academy-account-status/);
});

test("fresh accounts receive a role-aware setup checklist that disappears when setup is complete",()=>{
  assert.match(personalization,/function setupPlan\(snapshot\)/);
  assert.match(personalization,/function setupMarkup\(snapshot\)/);
  assert.match(personalization,/if\(plan\.complete\|\|!plan\.total\)return ""/);
  assert.match(personalization,/Academy account ready/);
  assert.match(personalization,/Adult Scholar profile ready/);
  assert.match(personalization,/Learner profile selected/);
  assert.match(personalization,/Placement route ready/);
  assert.match(personalization,/Learner enrolled/);
  assert.match(personalization,/Active learner selected/);
  assert.match(personalization,/role="status" aria-label="Academy account setup progress"/);
});

test("Updates and Help is role aware and never pretends to be a remote notification feed",()=>{
  assert.match(personalization,/function ensureUpdatesDialog\(\)/);
  assert.match(personalization,/function renderUpdates\(snapshot=accountSnapshot\(\)\)/);
  assert.match(personalization,/snapshot\.mode==="learner"/);
  assert.match(personalization,/snapshot\.mode==="family"/);
  assert.match(personalization,/snapshot\.mode==="adult"/);
  assert.match(personalization,/Public Academy/);
  assert.match(personalization,/Account continuity/);
  assert.match(personalization,/Beta feedback/);
  assert.match(personalization,/data-i18n-no-online/);
});

test("account status changes cause the adaptive home to refresh",()=>{
  assert.match(personalization,/for\(const eventName of \["pageshow","khaemenes-family-ready","khaemenes-family-changed","khaemenes-learner-placement-changed","khaemenes-learning-continuation-changed","online","offline"\]/);
  assert.match(index,/\.\/assets\/khaemenes-account-connection-status\.js/);
});


test("Academy brand returns visitors to the Verve N Veda public gateway",()=>{
  assert.match(index,/class="brand" href="https:\/\/vervenveda\.com\/" aria-label="Return to Verve N Veda home"/);
});
