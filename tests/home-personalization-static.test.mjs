import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const index=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const personalization=fs.readFileSync(new URL("../assets/khaemenes-home-personalization.js",import.meta.url),"utf8");

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

test("identity can come from family, adult, or learner state",()=>{
  assert.match(personalization,/Boolean\(family\?\.familyId\|\|adult\?\.adultId\|\|learner\?\.learnerId\)/);
  assert.match(personalization,/learner\?\.selfDirectedAdult===true\?"adult":learner\?\.learnerId\?"learner":"family"/);
});

test("profile utility is absent before account creation",()=>{
  assert.match(personalization,/if\(!snapshot\.hasIdentity\)\{profile\?\.remove\(\);return\}/);
});

test("utility dock reuses the universal Beta button instead of creating another",()=>{
  assert.match(personalization,/BETA_ID="vnvBetaProgramLink"/);
  assert.match(personalization,/beta&&beta\.parentElement!==dock\)dock\.appendChild\(beta\)/);
  assert.doesNotMatch(personalization,/createElement\(["']button["']\).*Beta Program/);
});

test("utility dock includes Archaemenes and account-aware Profile",()=>{
  assert.match(personalization,/MENTOR_ID="khaemenesHomeMentorButton"/);
  assert.match(personalization,/PROFILE_ID="khaemenesHomeProfileButton"/);
  assert.match(personalization,/profileDestination\(snapshot\)/);
  assert.match(personalization,/mentorDestination\(\)/);
});

test("utility dock includes PLERA Search for public and signed-in visitors",()=>{
  assert.match(personalization,/SEARCH_ID="khaemenesHomeSearchButton"/);
  assert.match(personalization,/search:"https:\/\/vervenveda\.github\.io\/PLERASearch\.github\.io\//);
  assert.match(personalization,/search\.href=URLS\.search/);
  assert.match(personalization,/Open PLERA Search/);
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

test("student, family, and adult scholar profiles route to their own portals",()=>{
  assert.match(personalization,/if\(snapshot\.mode==="adult"\)return URLS\.adult/);
  assert.match(personalization,/if\(snapshot\.mode==="learner"\)return URLS\.student/);
  assert.match(personalization,/if\(snapshot\.mode==="family"\)return URLS\.family/);
});
