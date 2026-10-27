/* Khaemenes Academy major landing-shell static contract.
   No student or learner records, curriculum or browser storage touched. */
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const home=read("index.html");
const head=read("assets/khaemenes-landing-standard.css");
const toolbar=read("assets/khaemenes-landing-toolbar.js");
const dockCss=read("assets/khaemenes-landing-toolbar.css");

assert.match(home,/academy-frontdesk-header-gateway-standard-20261027/);
assert.match(head,/academy-frontdesk-header-gateway-standard-20261027|Homepage only\. Match Verve N Veda/);
assert.match(head,/data-khae-header/);
assert.match(head,/grid-template-columns:minmax\(185px,auto\)/);
assert.match(head,/data-vnv-ecosystem-slot/);
assert.match(head,/font-weight:400/);
assert.match(dockCss,/max-width:calc\(100vw - 20px\)/);
assert.match(dockCss,/@media\(max-width:650px\)/);
assert.match(dockCss,/@media\(max-width:340px\)/);
assert.match(dockCss,/khaemenesLearnerUtilityToolbar/);
assert.match(toolbar,/khaemenesHomeUtilityDock/);
assert.match(toolbar,/khaeLandingUtilityDock/);
assert.match(toolbar,/khaeLandingUpdatesDialog/);
assert.match(toolbar,/vnvBetaProgramLink/);
assert.match(toolbar,/URLS\.search/);
assert.match(toolbar,/URLS\.mentor/);
assert.match(toolbar,/URLS\.contribute/);
assert.match(toolbar,/URLS\.beta/);
assert.doesNotMatch(toolbar,/localStorage\.setItem|sessionStorage\.setItem/,"Landing utilities must never write learner data");

for(const file of ["student/index.html","family/index.html","adult/index.html","teacher-admin/index.html","offline/index.html"]){
 const html=read(file);
 assert.match(html,/data-khae-header/,"Main portal must preserve campus header: "+file);
 assert.match(html,/khaemenes-landing-standard\.css/,"Missing shared Home header in "+file);
 assert.match(html,/khaemenes-landing-toolbar\.css/,"Missing shared toolbar CSS in "+file);
 assert.match(html,/khaemenes-landing-toolbar\.js/,"Missing landing toolbar script in "+file);
 assert.match(html,/vnv-beta-link\.js/,"Existing beta functionality must stay in "+file);
 assert.match(html,/khaemenes-global-header\.js/,"Ticker and Academy menu must stay in "+file);
}
console.log("PASS Academy Home header parity, 5-control dock, mobile sizing, and 5 major portal entrances.");
