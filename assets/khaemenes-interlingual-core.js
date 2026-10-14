/* Khaemenes Sovereign Interlingual — shared offline translation bridge v1
 * No fetch, network APIs, external dependencies, secret access, or student record sync.
 * Imported user-confirmed v2 phrases are origin-local; campus seed is a public draft.
 * "Translation" is an exact phrase lookup, not general machine translation.
 */
(function(root){"use strict";
const LIBRARY_KEY="khaemenes_interlingual_library_v2";
const SEED=root.KhaemenesSovereignSeeds||{phrases:{}};
const legacyCode=code=>String(code||"").trim().toLowerCase()==="zh"?"zh-CN":String(code||"").trim();
const normalize=text=>String(text??"").trim().normalize("NFC");
const bucketKeys=(from,to)=>{
 const f=legacyCode(from),t=legacyCode(to);
 const result=[f+"→"+t];
 if(t==="zh-CN")result.push(f+"→zh");
 if(t==="zh")result.push(f+"→zh-CN");
 return result;
};
function loadUserLibrary(){
 try{
  const value=JSON.parse(root.localStorage.getItem(LIBRARY_KEY)||"null");
  if(value?.schema==="khaemenes-interlingual-library"&&Number(value.version)===2&&value.pairs&&typeof value.pairs==="object"&&!Array.isArray(value.pairs))return value;
 }catch{}
 return null;
}
function lookupLocal({from="en",to="es",text=""}={}){
 const phrase=normalize(text),target=legacyCode(to);
 if(!phrase||phrase.length>12000)return null;
 if(legacyCode(from)===target)return {translation:phrase,verified:true,source:"same-language",status:"identity"};
 const library=loadUserLibrary();
 for(const pk of bucketKeys(from,to)){
  const record=library?.pairs?.[pk]?.[phrase];
  if(record?.verified===true&&typeof record.translation==="string"&&record.translation.trim()){
   return {translation:record.translation,verified:true,source:"sovereign-local-reviewed",status:"user-reviewed"};
  }
 }
 if(legacyCode(from)!=="en")return null;
 const short=target==="zh-CN"?"zh":target;
 const record=SEED.phrases?.[short]?.[phrase];
 if(record&&typeof record.text==="string"&&record.text.trim()){
  return {translation:record.text,verified:false,source:"sovereign-campus-draft",status:record.status||"draft"};
 }
 return null;
}
function stats(){
 const count={};let total=0;
 for(const [code,phrases] of Object.entries(SEED.phrases||{})){
  count[code]=Object.keys(phrases).length;total+=count[code];
 }
 let reviewed=0;const lib=loadUserLibrary();
 for(const bucket of Object.values(lib?.pairs||{}))for(const record of Object.values(bucket||{}))if(record?.verified===true)reviewed++;
 return {campusDraftPairs:total,campusLanguages:Object.keys(count).length,reviewedBrowserPairs:reviewed,byLanguage:count,network:"never"};
}
function portablePack(){
 const pairs=Object.create(null);
 for(const [language,phrases] of Object.entries(SEED.phrases||{})){
  const key="en→"+(language==="zh"?"zh-CN":language);
  const bucket=Object.create(null);
  for(const [source,record] of Object.entries(phrases)){
   if(!record?.text)continue;
   bucket[source]={translation:record.text,verified:false,source:"khaemenes-campus-curated-draft",purpose:"interface"};
  }
  pairs[key]=bucket;
 }
 return {schema:"khaemenes-interlingual-library",version:2,updatedAt:new Date().toISOString(),pairs};
}
root.KhaemenesSovereignTranslate=Object.freeze({
 version:"1.0",
 lookupLocal,
 stats,
 portablePack,
 languages:()=>Object.keys(SEED.phrases||{}),
 storageKey:LIBRARY_KEY
});
})(window);
