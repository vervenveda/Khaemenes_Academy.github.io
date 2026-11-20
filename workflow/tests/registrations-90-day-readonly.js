/* Khaemenes Academy: 2026-08-20 through 2026-11-20 registration inventory.
   Read-only browser-local inspection; no write, network, download or raw identity output.
   Paste into Console on ORIGINAL Academy Chrome profile at https://vervenveda.com.
   This does NOT establish globally complete cloud registration statistics.
*/
(() => {
  "use strict";
  const from=new Date("2026-08-20T00:00:00-04:00");
  const through=new Date("2026-11-21T00:00:00-05:00");
  const result={audit:"ACADEMY_REGISTRATIONS_AUG20_NOV20_2026",
    scope:"CURRENT_BROWSER_ORIGIN_ONLY",range:"2026-08-20 to 2026-11-20 inclusive",
    originApproved:location.origin==="https://vervenveda.com",
    status:"NOT_RUN",familyRecords:0,adultRecords:0,studentRecords:0,
    registeredInPeriod:{families:0,adults:0,students:0},
    missingOrInvalidCreationDate:{families:0,adults:0,students:0},
    createdByMonth:{},ruby:{familyMatches:0,adultMatches:0,studentMatches:0,candidateFamilyCount:0,candidateFamilyStudentCounts:[]},
    ahja:{studentNameMatches:0},
    recentAuditEvents:{count:0,byAction:{},warning:"Local event list retains at most 300 entries; incomplete history possible."},
    caveats:["Only reads this browser profile's local registry and audit log.","Names/IDs/emails/grades/records are not printed.","No GitHub repository, Mac archive, remote account service or alternate browser is scanned."]};
  if(!result.originApproved){result.status="HOLD_WRONG_ORIGIN";console.info(result);return;}
  const parse=raw=>{try{return JSON.parse(raw)}catch{return null}};
  const r=parse(localStorage.getItem("khaemenes_family_registry_v1"));
  if(!r||typeof r!=="object"){result.status="NO_READABLE_REGISTRY";console.info(result);return;}
  const within=s=>{const d=new Date(s||"");return Number.isFinite(d.getTime())&&d>=from&&d<through};
  const month=s=>new Date(s).toISOString().slice(0,7);
  const groups=[["families",Object.values(r.families||{})],["adults",Object.values(r.adults||{})],["students",Object.values(r.learners||{}).filter(x=>x&&!x.selfDirectedAdult)]];
  for(const [type,items] of groups){
    result[type==="students"?"studentRecords":type==="adults"?"adultRecords":"familyRecords"]=items.length;
    for(const item of items){
      if(!item)continue;
      const date=new Date(item.createdAt||"");
      if(!Number.isFinite(date.getTime())){result.missingOrInvalidCreationDate[type]++;continue;}
      if(within(item.createdAt)){
        result.registeredInPeriod[type]++;
        const key=month(item.createdAt);
        result.createdByMonth[key] ||= {families:0,adults:0,students:0};
        result.createdByMonth[key][type]++;
      }
    }
  }
  const families=Object.values(r.families||{}).filter(Boolean);
  const adults=Object.values(r.adults||{}).filter(Boolean);
  const students=Object.values(r.learners||{}).filter(x=>x&&!x.selfDirectedAdult);
  const ruby=s=>/\bruby\b/i.test(String(s||""));
  const rubyFamilies=families.filter(f=>ruby(f.displayName));
  const rubyAdults=adults.filter(a=>ruby(a.displayName)||ruby(a.screenName));
  const rubyStudents=students.filter(s=>ruby(s.nickname));
  result.ruby.familyMatches=rubyFamilies.length;
  result.ruby.adultMatches=rubyAdults.length;
  result.ruby.studentMatches=rubyStudents.length;
  const candidates=families.filter(f=>rubyFamilies.includes(f)||rubyAdults.some(a=>(f.adultIds||[]).includes(a.adultId))||rubyStudents.some(s=>s.familyId===f.familyId));
  result.ruby.candidateFamilyCount=candidates.length;
  result.ruby.candidateFamilyStudentCounts=candidates.map(f=>students.filter(s=>s.familyId===f.familyId&&(f.learnerIds||[]).includes(s.learnerId)).length);
  result.ahja.studentNameMatches=students.filter(s=>/^ahja$/i.test(String(s.nickname||"").trim())).length;
  const audit=parse(localStorage.getItem("khaemenes_family_audit_v1"));
  if(Array.isArray(audit)){
    const events=audit.filter(e=>within(e?.at));
    result.recentAuditEvents.count=events.length;
    for(const event of events){
      const a=String(event?.action||"unknown").slice(0,80);
      result.recentAuditEvents.byAction[a]=(result.recentAuditEvents.byAction[a]||0)+1;
    }
  } else result.recentAuditEvents.warning="No readable local event history; timestamps on registry records still scanned.";
  result.status="LOCAL_REGISTRY_SCANNED";
  console.info(JSON.stringify(result,null,2));
})();
