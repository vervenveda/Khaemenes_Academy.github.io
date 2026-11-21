import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../adult/index.html',import.meta.url),'utf8');
const original='https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/';
const associates='https://vervenveda.com/Khaemenes_HL_Associates-Level.github.io/';
test('Adult Portal preserves existing Higher Learning entrance and adds separate Associate-Level route',()=>{
 assert.ok(html.includes('href="'+original+'"'));
 assert.ok(html.includes('href="'+associates+'"'));
 assert.equal(html.split('href="'+associates+'"').length-1,1);
 assert.match(html,/Associate-Level Certificate/);
});
test('new Associate-Level doorway does not register a second scholar or expose IDs',()=>{
 assert.match(html,/R\.getAdultLearner\?/);
 assert.match(html,/Your own learning path stays separate from any parent or guardian role/);
 const match=html.match(/<a class="btn secondary" href="https:\/\/vervenveda.com\/Khaemenes_HL_Associates-Level.github.io\/">Associate-Level Certificate<\/a>/);
 assert.ok(match);
 assert.doesNotMatch(match[0],/\?|learnerId|adultId|familyId|accountId/);
});
