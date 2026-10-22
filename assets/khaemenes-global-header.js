(()=>{"use strict";
const ID="khaeNetworkTicker";
if(!document.querySelector("[data-khae-header]"))return;
if(!document.getElementById(ID)){
  const ticker=document.createElement("div");
  ticker.className="khae-network-ticker";
  ticker.id=ID;
  ticker.dataset.paused="false";
  ticker.setAttribute("aria-label","333 Network application ticker");
  const links=[
    ["HOLLO","https://vervenveda.github.io/333.github.io/app/HOLLO_333_direct_connect_index.html","app"],
    ["KANSEE","https://vervenveda.github.io/333.github.io/app/KANSEE_333_meeting_rooms_index.html","app"],
    ["E=Ven Mail","https://vervenveda.github.io/333.github.io/app/EVen_mail_index.html","app"],
    ["Bazaar Art Live","https://vervenveda.github.io/333.github.io/app/Bazaar_Art_Live_index.html","app"],
    ["SIte Studio","https://vervenveda.github.io/333.github.io/app/SIte_builder_index.html","app"],
    ["Bunya","https://vervenveda.github.io/333.github.io/app/Bunya_digital_infrastructure_index.html","app"],
    ["Open 333 →","https://vervenveda.github.io/333.github.io/","call"]
  ];
  const set=(hidden)=>'<div class="khae-network-ticker-set"'+(hidden?' aria-hidden="true"':'')+'><span class="khae-network-ticker-label">333 Network</span>'+links.map(([label,href,type])=>'<a class="khae-network-ticker-'+type+'" href="'+href+'"'+(hidden?' tabindex="-1"':'')+'>'+label+'</a>').join("")+'</div>';
  ticker.innerHTML='<div class="khae-network-ticker-viewport"><div class="khae-network-ticker-track">'+set(false)+set(true)+set(true)+'</div></div><button class="khae-ticker-control" type="button" aria-pressed="false" aria-label="Pause 333 Network ticker">Ⅱ</button>';
  const header=document.querySelector("[data-khae-header]");
  header.parentNode.insertBefore(ticker,header);
  const button=ticker.querySelector(".khae-ticker-control");
  let paused=false;
  try{paused=localStorage.getItem("VNV_TICKER_PAUSED")==="true";}catch{}
  const apply=value=>{
    ticker.dataset.paused=String(value);
    button.setAttribute("aria-pressed",String(value));
    button.setAttribute("aria-label",value?"Resume 333 Network ticker":"Pause 333 Network ticker");
    button.textContent=value?"▶":"Ⅱ";
    try{localStorage.setItem("VNV_TICKER_PAUSED",String(value));}catch{}
  };
  apply(paused);
  button.addEventListener("click",()=>apply(ticker.dataset.paused!=="true"));
}
})();