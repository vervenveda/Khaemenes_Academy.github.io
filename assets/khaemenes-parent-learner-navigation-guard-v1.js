/* Khaemenes Academy Parent Portal · learner navigation guard v1.
 * A browser-local consistency check, NOT authenticated access control.
 * Use only for explicit parent navigation; never grants student write authority.
 */
(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.KhaemenesParentLearnerNavigationGuard=api})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const allowed=(R,family,learnerId,adultId)=>{
 if(!R||!family||typeof learnerId!=="string"||!learnerId||typeof adultId!=="string"||!adultId)return false;
 const learner=R.getLearner?.(learnerId),adult=R.getAdult?.(adultId);
 return !!(learner&&adult&&learner.familyId===family.familyId&&
 Array.isArray(family.learnerIds)&&family.learnerIds.includes(learnerId)&&
 Array.isArray(family.adultIds)&&family.adultIds.includes(adultId)&&
 R.canAdult?.(adultId,learnerId,"progress.view")===true);
};
function select(R,family,learnerId){
 if(!R||!family||typeof learnerId!=="string"||!learnerId)return Object.freeze({ok:false,reason:"missing-learner-or-registry"});
 const before=R.activeIds?.()||{},adultId=before.adultId;
 if(before.familyId!==family.familyId||!allowed(R,family,learnerId,adultId))
  return Object.freeze({ok:false,reason:"permission-or-family-mismatch"});
 try{
  R.setActive({familyId:family.familyId,adultId,learnerId});
  const after=R.activeIds?.()||{};
  const liveFamily=R.getFamily?.(family.familyId)||null;
  if(after.familyId!==family.familyId||after.adultId!==adultId||after.learnerId!==learnerId||
     !allowed(R,liveFamily,learnerId,adultId))
    return Object.freeze({ok:false,reason:"selection-not-consistent"});
  return Object.freeze({ok:true,learnerId,reason:"browser-selection-confirmed"});
 }catch{return Object.freeze({ok:false,reason:"selection-write-failed"})}
}
return Object.freeze({version:"1.0",allowed,select});
});
