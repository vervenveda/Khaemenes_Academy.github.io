import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const family=read('family/index.html'),parent=read('family/profile/index.html');
const panels=read('assets/khaemenes-family-parent-learning-panels-v1.js');
const registry=read('assets/khaemenes-family-registry.js');
const progress=read('family/progress/parent-progress.js');
const status=read('assets/khaemenes-account-connection-status.js');
const dormant=read('assets/khaemenes-family-account-center-v1.js');
const boundary=read('assets/khaemenes-account-client.js');
const start=family.indexOf('function verifiedLearningDestination(value){');
const end=family.indexOf('function bind(f){',start);
assert.ok(start>0&&end>start);
const check=new Function('location',family.slice(start,end)+'return verifiedLearningDestination;')
 ({href:'https://vervenveda.com/Khaemenes_Academy.github.io/family/'});

test('bubble 1: existing account selector protects family continuity, no duplicate family on discovery',()=>{
 assert.match(family,/Choose Your Existing Family/);
 assert.match(family,/Select the correct family to continue; no new registration or backup restoration is needed/);
 assert.match(family,/R\.setActive\(\{familyId:selected\.familyId/);
 assert.match(family,/Do not create a duplicate/);
 assert.match(registry,/accountId:prior\.accountId\|\|accountId/);
});
test('bubble 2: Grade09 student card resolves the canonical learner Profile without an ID in the URL',()=>{
 assert.match(family,/if\(stage==="high"&&\[9,10,11,12\]\.includes\(n\)\)/);
 assert.match(family,/Khaemenes_High\.github\.io\/grades\/grade-/);
 assert.match(family,/chooseLocalLearner\(f,link\.dataset\.learnerProfile\)/);
 assert.match(family,/function localLinkedLearner\(f,id\)/);
 assert.match(family,/learner\.familyId===f\?\.familyId/);
});
test('bubble 3: dynamic Parent Profile accordion destinations are present and have one owner',()=>{
 assert.match(parent,/id="parentProfileLearningPanels"/);
 for(const fragment of ['parent-daily-reports','parent-learner-panel','family-progress']){
  assert.ok(panels.includes('id="'+fragment+'"'),fragment);
  assert.ok(family.includes('profile/#'+fragment),fragment);
 }
 assert.doesNotMatch(family,/khaemenes-family-account-center-v1\.js/);
 assert.match(dormant,/Single, read-only Family Portal modal/);
});
test('bubble 4: parent grades and progress require matched local permission and deny cloud authority',()=>{
 assert.match(progress,/R\.canAdult\?\.\(adult\.adultId,l\.learnerId,"progress.view"\)/);
 assert.match(progress,/Browser-local permissions do not constitute authenticated cloud access/);
 assert.match(progress,/Not an official transcript or verified cloud record/);
 assert.match(status,/serverVerified:false/);
 assert.match(boundary,/enabled:false,baseUrl:null/);
});
test('bubble 5: next-step route accepts only known Academy HTTPS learning origins and denies unsafe URLs',()=>{
 for(const good of ['https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/algebra-1/',
   'https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/','/Khaemenes_Academy.github.io/student/'])
   assert.ok(check(good)?.startsWith('https://vervenveda.com/'),good);
 for(const bad of ['javascript:alert(1)','data:text/html,example','https://example.org/',
   'http://vervenveda.com/Khaemenes_High.github.io/',
   'https://vervenveda.com.evil.net/Khaemenes_High.github.io/',
   'https://vervenveda.com/other/','https://evil@vervenveda.com/Khaemenes_High.github.io/'])
   assert.equal(check(bad),null,bad);
 assert.match(family,/const approved=verifiedLearningDestination\(href\)/);
 assert.match(family,/chooseLocalLearner\(f,learnerId,\{requireProgress:true\}\)/);
});
