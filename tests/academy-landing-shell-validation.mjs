/* Khaemenes Academy major landing-shell static contract.
   Protects the live Academy shell while VNV owns the canonical ecosystem toolbar.
   No student records, curriculum, account state or browser storage are touched. */
import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(p,"utf8");
const home=read("index.html");
const head=read("assets/khaemenes-landing-standard.css");
const toolbar=read("assets/khaemenes-landing-toolbar.js");
const dockCss=read("assets/khaemenes-landing-toolbar.css");
const hallType=read("assets/khaemenes-hall-typography.css");

assert.match(home,/academy-frontdesk-header-gateway-standard-20261027/);
assert.match(head,/academy-frontdesk-header-gateway-standard-20261027|Homepage only\. Match Verve N Veda/);
assert.match(head,/data-khae-header/);
assert.match(head,/grid-template-columns:minmax\(185px,auto\)/);
assert.match(head,/data-vnv-ecosystem-slot/);
assert.match(head,/font-weight:400/);

/* The Academy no longer owns ecosystem-toolbar geometry. */
assert.match(dockCss,/Compatibility stylesheet/);
assert.match(dockCss,/#vnvEcosystemUtilityDock/);
assert.match(dockCss,/#khaeLandingUtilityDock/);
assert.match(dockCss,/#khaemenesLearnerUtilityToolbar/);
assert.match(dockCss,/#vnvBetaProgramLink/);
assert.match(dockCss,/@media print/);
assert.doesNotMatch(
  dockCss,
  /grid-template-columns|min-width|max-width:calc|position:fixed/,
  "Academy compatibility CSS must not own VNV toolbar geometry"
);

assert.match(toolbar,/Compatibility loader/);
assert.match(toolbar,/data-vnv-ecosystem-toolbar/);
assert.match(
  toolbar,
  /https:\/\/vervenveda\.com\/assets\/vnv-ecosystem-toolbar\.js/
);
assert.doesNotMatch(
  toolbar,
  /khaemenesHomeUtilityDock|khaeLandingUpdatesDialog|URLS\.search|URLS\.mentor|URLS\.contribute/,
  "Academy loader must delegate toolbar behavior to VNV"
);
assert.doesNotMatch(
  toolbar,
  /localStorage\.setItem|sessionStorage\.setItem/,
  "Landing toolbar compatibility layer must never write learner data"
);

/* Public hall typography remains opt-in and must not seize page layout. */
assert.match(hallType,/data-khae-hall-landing="true"/);
assert.match(hallType,/#khaemenesLearnerUtilityToolbar/);
assert.match(hallType,/#vnvBetaProgramLink/);
assert.match(hallType,/khae-hall-display/);
assert.match(hallType,/khae-hall-body/);

for(const file of [
  "student/index.html",
  "family/index.html",
  "adult/index.html",
  "teacher-admin/index.html",
  "offline/index.html"
]){
  const html=read(file);
  assert.match(html,/data-khae-header/,"Main portal must preserve campus header: "+file);
  assert.match(html,/khaemenes-landing-standard\.css/,"Missing shared Home header in "+file);
  assert.match(html,/khaemenes-landing-toolbar\.css/,"Missing toolbar compatibility CSS in "+file);
  assert.match(html,/khaemenes-landing-toolbar\.js/,"Missing canonical toolbar compatibility loader in "+file);
  assert.match(html,/vnv-beta-link\.js/,"Existing Beta functionality must stay in "+file);
  assert.match(html,/khaemenes-global-header\.js/,"Ticker and Academy menu must stay in "+file);
}

assert.match(
  home,
  /vnv-ecosystem-toolbar\.js" defer data-vnv-ecosystem-toolbar="1"/,
  "Academy Home must load the canonical VNV ecosystem toolbar"
);

console.log(
  "PASS Academy header parity, centralized VNV toolbar delegation, and 5 major portal entrances."
);
