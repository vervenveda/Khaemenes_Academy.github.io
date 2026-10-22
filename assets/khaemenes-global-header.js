(()=>{"use strict";
const ID="khaeNetworkTicker";
if(!document.querySelector("[data-khae-header]"))return;

const A="https://vervenveda.com/Khaemenes_Academy.github.io";
const P="https://vervenveda.com/Khaemenes_Preschool.github.io";
const K="https://vervenveda.com/Khaemenes_KinderGarden.github.io";
const E="https://vervenveda.com/Khaemenes_Elementary.github.io";
const M="https://vervenveda.com/Khaemenes_Middle.github.io";
const H="https://vervenveda.com/Khaemenes_High.github.io";
const HL="https://vervenveda.com/Khaemenes_Higher_Learning.github.io";
const L="https://vervenveda.com/Khaemenes_Linguistics.github.io";
const LS="https://vervenveda.com/Khaemenes_Academy_Life_Skills.github.io";

const app=(label,href)=>[label,href,"app"];
const call=(label,href)=>[label,href,"call"];
const path=location.pathname.toLowerCase();
const host=location.hostname.toLowerCase();

function context(){
  if(host.includes("khaemenes_preschool")||path.includes("/khaemenes_preschool.github.io/")){
    return {label:"Preschool Quick Links",links:[
      app("Preschool Home",P+"/"),
      app("Learning Adventures",P+"/#activities"),
      app("Today",P+"/#today"),
      app("Story Time",P+"/apps/ABC_Story_Time/"),
      app("Student Profile",A+"/student/"),
      call("Family & Grown-Ups →",A+"/family/")
    ]};
  }
  if(host.includes("khaemenes_kindergarden")||path.includes("/khaemenes_kindergarden.github.io/")){
    return {label:"Kindergarten Quick Links",links:[
      app("Kinder Garden Home",K+"/"),
      app("Curriculum",K+"/curriculum/"),
      app("Discovery Companion",K+"/inquiry-companion.html"),
      app("Portfolio",K+"/portfolio-builder/"),
      app("Social Studies",K+"/social-studies/"),
      app("Student Profile",A+"/student/"),
      call("Family →",K+"/family/")
    ]};
  }
  if(host.includes("khaemenes_elementary")||path.includes("/khaemenes_elementary.github.io/")){
    return {label:"Elementary Quick Links",links:[
      app("Elementary Home",E+"/"),
      app("Grade 1",E+"/grades/grade-01/"),
      app("Grade 2",E+"/grades/grade-02/"),
      app("Grade 3",E+"/grades/grade-03/"),
      app("Grade 4",E+"/grades/grade-04/"),
      app("Grade 5",E+"/grades/grade-05/"),
      app("Learning Games",E+"/games/"),
      call("Student Profile →",A+"/student/")
    ]};
  }
  if(host.includes("khaemenes_middle")||path.includes("/khaemenes_middle.github.io/")){
    return {label:"Middle School Quick Links",links:[
      app("Middle School Home",M+"/"),
      app("Grade 6",M+"/grades/grade-06/"),
      app("Grade 7",M+"/grades/grade-07/"),
      app("Grade 8",M+"/grades/grade-08/"),
      app("Electives",M+"/grades/electives/"),
      app("Student Profile",A+"/student/"),
      call("High School →",H+"/")
    ]};
  }
  if(host.includes("khaemenes_high")||path.includes("/khaemenes_high.github.io/")){
    const grade=(path.match(/grade-(09|10|11|12)/)||[])[1]||"";
    if(grade){
      const g=String(Number(grade));
      const base=H+"/grades/grade-"+grade+"/";
      return {label:"Grade "+g+" Quick Links",links:[
        app("Grade "+g+" Home",base),
        app("My Student Profile",base+"student-profile/"),
        app("Mathematics",H+"/courses/mathematics/"),
        app("Language Arts",H+"/courses/language-arts/"),
        app("Science",H+"/courses/science/"),
        app("Social Studies",H+"/courses/social-studies/"),
        app("Physical Education",H+"/courses/physical-education/"),
        call("Academy Student Portal →",A+"/student/")
      ]};
    }
    return {label:"High School Quick Links",links:[
      app("High School Home",H+"/"),
      app("Grades 9–12",H+"/#grades"),
      app("Mathematics",H+"/courses/mathematics/"),
      app("Language Arts",H+"/courses/language-arts/"),
      app("Science",H+"/courses/science/"),
      app("Social Studies",H+"/courses/social-studies/"),
      app("Physical Education",H+"/courses/physical-education/"),
      app("Offline Learning",H+"/offline/"),
      call("Student Profile →",A+"/student/")
    ]};
  }
  if(host.includes("khaemenes_higher_learning")||path.includes("/khaemenes_higher_learning.github.io/")){
    return {label:"Higher Learning Quick Links",links:[
      app("Collegiate Home",HL+"/"),
      app("Scholar Entry",HL+"/start/"),
      app("Course Directory",HL+"/directory/"),
      app("Mathematics",HL+"/courses/mathematics/"),
      app("Science",HL+"/Science/"),
      app("Career",HL+"/Career/"),
      app("GED & Foundations",HL+"/GED/"),
      app("Scholar Mentor",HL+"/mentor/"),
      call("Academy →",A+"/")
    ]};
  }
  if(host.includes("khaemenes_linguistics")||path.includes("/khaemenes_linguistics.github.io/")){
    return {label:"Language Campus Quick Links",links:[
      app("Linguistics Home",L+"/"),
      app("Language Halls",L+"/Halls/"),
      app("Language Worlds",L+"/apps/language-worlds/"),
      app("Arabic I",L+"/Halls/courses/arabic-1/"),
      app("Russian I",L+"/Halls/courses/russian-1/"),
      app("Student Profile",A+"/student/"),
      call("Academy →",A+"/")
    ]};
  }
  if(host.includes("khaemenes_academy_life_skills")||path.includes("/khaemenes_academy_life_skills.github.io/")){
    return {label:"Life Skills Quick Links",links:[
      app("Life Skills Home",LS+"/"),
      app("Course Directory",LS+"/courses/"),
      app("Preschool",LS+"/courses/preschool/"),
      app("Kindergarten",LS+"/courses/kindergarten/"),
      app("Culinary Arts",LS+"/courses/culinary-independence/"),
      app("Elementary Culinary",LS+"/courses/culinary-independence/elementary/"),
      app("Middle Culinary",LS+"/courses/culinary-independence/middle/"),
      app("High School Culinary",LS+"/courses/culinary-independence/high/"),
      app("Higher Learning Culinary",LS+"/courses/culinary-independence/higher/"),
      call("Academy →",A+"/")
    ]};
  }
  return {label:"Khaemenes Academy Quick Links",links:[
    app("Academy Home",A+"/"),
    app("Student Portal",A+"/student/"),
    app("Family Center",A+"/family/"),
    app("Adult Scholar",A+"/adult/"),
    app("Teacher Administration",A+"/teacher-admin/"),
    app("Offline Learning",A+"/offline/"),
    call("Find My School →",A+"/#schools")
  ]};
}

if(!document.getElementById(ID)){
  const cfg=context();
  const ticker=document.createElement("div");
  ticker.className="khae-network-ticker";
  ticker.id=ID;
  ticker.dataset.paused="false";
  ticker.setAttribute("aria-label",cfg.label);
  const set=(hidden)=>'<div class="khae-network-ticker-set"'+(hidden?' aria-hidden="true"':'')+'><span class="khae-network-ticker-label">'+cfg.label+'</span>'+cfg.links.map(([label,href,type])=>'<a class="khae-network-ticker-'+type+'" href="'+href+'"'+(hidden?' tabindex="-1"':'')+'>'+label+'</a>').join("")+'</div>';
  ticker.innerHTML='<div class="khae-network-ticker-viewport"><div class="khae-network-ticker-track">'+set(false)+set(true)+set(true)+'</div></div><button class="khae-ticker-control" type="button" aria-pressed="false" aria-label="Pause Academy quick-link ticker">Ⅱ</button>';
  const header=document.querySelector("[data-khae-header]");
  header.parentNode.insertBefore(ticker,header);
  const button=ticker.querySelector(".khae-ticker-control");
  let paused=false;
  try{paused=localStorage.getItem("VNV_TICKER_PAUSED")==="true";}catch{}
  const apply=value=>{
    ticker.dataset.paused=String(value);
    button.setAttribute("aria-pressed",String(value));
    button.setAttribute("aria-label",value?"Resume Academy quick-link ticker":"Pause Academy quick-link ticker");
    button.textContent=value?"▶":"Ⅱ";
    try{localStorage.setItem("VNV_TICKER_PAUSED",String(value));}catch{}
  };
  apply(paused);
  button.addEventListener("click",()=>apply(ticker.dataset.paused!=="true"));
}
})();