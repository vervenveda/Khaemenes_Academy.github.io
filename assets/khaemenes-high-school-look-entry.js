/* Universal look entry mount for High School Grade 09–12.
 * Renders one Grade 10-inspired launcher and preview inside the existing
 * dedicated profile page. Mount is idempotent; course sections are untouched.
 * It assumes the grade adapter has already registered with the editor core.
 */
(()=>{"use strict";
const w=window,d=document,hostId="khaemenesUniversalHighLookEntry";
if(w.KhaemenesUniversalHighLookEntry)return;
const find=id=>d.getElementById(id);
const style=()=>{
 if(find("khaemenesUniversalHighLookStyle"))return;
 const el=d.createElement("style");el.id="khaemenesUniversalHighLookStyle";
 el.textContent=`
#grade09LookPanel.khae-universal-look-host{max-width:1100px;padding:26px;background:#f6f0e4;border:2px solid #b48b45;border-radius:7px;color:#202724}
#grade09LookPanel .kuhle-layout{display:grid;grid-template-columns:200px minmax(0,1fr);align-items:center;gap:25px}
#grade09LookPanel .kuhle-avatar{display:grid;place-items:center;overflow:hidden;width:175px;height:175px;border:3px solid #b48b45;background:#f4f0e7;color:#202724;border-radius:50%;font:400 66px/1 Cinzel,Georgia,serif}
#grade09LookPanel .kuhle-avatar img{width:100%;height:100%;object-fit:cover}
#grade09LookPanel .kuhle-eyebrow{font:400 18px/1.5 Nunito,Arial,sans-serif;color:#6d5736;margin:0 0 5px}
#grade09LookPanel .kuhle-student-name{font-size:33px;line-height:1.3;font-weight:400;margin:0 0 8px;overflow-wrap:anywhere}
#grade09LookPanel .kuhle-title{font:400 clamp(30px,4vw,44px)/1.2 Cinzel,Georgia,serif;color:#202724;margin:0 0 12px}
#grade09LookPanel .kuhle-help{font:400 18px/1.55 Nunito,Arial,sans-serif;color:#354b3e;margin:0 0 14px}
#grade09LookPanel .kuhle-open{display:inline-flex;align-items:center;justify-content:center;min-height:49px;padding:10px 19px;border:1px solid #202724;border-radius:7px;background:#202724;color:#fff8e9;font:400 16px/1.4 Nunito,Arial,sans-serif;cursor:pointer}
#grade09LookPanel .kuhle-open:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
#grade09LookPanel .kuhle-status{font:400 16px/1.55 Nunito,Arial,sans-serif;margin:10px 0 0}
@media(max-width:630px){#grade09LookPanel .kuhle-layout{grid-template-columns:1fr;justify-items:center;text-align:center}#grade09LookPanel .kuhle-avatar{width:145px;height:145px}#grade09LookPanel .kuhle-title{font-size:33px}}
`;
 d.head.append(el);
};
function render(){
 const root=find(hostId);if(!root)return;
 const adapter=w.KhaemenesHighUniversalLookAdapter,identity=adapter?.getIdentity?.();
 const p=root.querySelector(".kuhle-avatar"),note=root.querySelector(".kuhle-status"),button=root.querySelector("button");
 p.replaceChildren();
 if(!identity){p.textContent="★";button.hidden=true;note.textContent="Choose your registered learner profile in the Family Center to customize your picture.";return}
 button.hidden=false;
 let look={},photo="";try{look=adapter.readLook(identity.id)||{};photo=adapter.readPhoto(identity.id)||""}catch{}
 const frame=look.frame||"circle";
 const polygons={rhombus:"polygon(50% 0,100% 50%,50% 100%,0 50%)",kite:"polygon(50% 0,90% 38%,50% 100%,10% 38%)",heart:"polygon(50% 95%,10% 51%,4% 25%,21% 7%,50% 24%,79% 7%,96% 25%,90% 51%)",star:"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)",octagon:"polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)",semicircle:"polygon(0 100%,0 50%,4% 31%,15% 15%,31% 4%,50% 0,69% 4%,85% 15%,96% 31%,100% 50%,100% 100%)"};
 p.style.clipPath=polygons[frame]||"none";
 p.style.borderRadius=frame==="circle"||frame==="oval"?"50%":frame==="square"||frame==="rectangle"?"7px":"0";
 p.style.width=frame==="rectangle"||frame==="oval"?"190px":"175px";
 p.style.height=frame==="rectangle"?"135px":frame==="oval"?"148px":"175px";
 if(/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(photo)&&photo.length<400000){const img=d.createElement("img");img.src=photo;img.alt="Saved student profile picture";p.append(img)}
 else p.textContent=look.badge||"★";
 p.style.backgroundColor="#f4f0e7";
 // The color swatch belongs to the entire profile card, not the avatar frame.
 const card=find("grade09LookPanel");if(card){card.style.backgroundColor=look.cardColor||"";card.style.backgroundImage=look.cardColor?"none":"";}
 const shade=look.cardColor||"#f6f0e4";const channels=[1,3,5].map(i=>parseInt(shade.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 const tone=.2126*channels[0]+.7152*channels[1]+.0722*channels[2]>.18?"#202724":"#fff8e9";
 const name=card?.querySelector(".kuhle-student-name");
 if(name){const choices={academy:'Cinzel,Georgia,serif',friendly:'Nunito,"Trebuchet MS",Arial,sans-serif',classic:'Georgia,"Times New Roman",serif',modern:'"Trebuchet MS",Arial,sans-serif',handwriting:'"Comic Sans MS","Trebuchet MS",cursive'};name.textContent=identity.displayName;name.style.fontFamily=choices[look.nameFont]||choices.academy;name.style.color=tone}
 if(card){for(const el of card.querySelectorAll(".kuhle-eyebrow,.kuhle-title,.kuhle-help,.kuhle-status"))el.style.color=tone;}
 note.textContent="Your existing learner photo, badge, frame and card color are preserved.";
}
function mount(){
 let panel=find("grade09LookPanel");
 if(!panel)return false;
 if(find(hostId)){render();return true}
 if(!w.KhaemenesHighUniversalLookAdapter||!w.KhaemenesUniversalProfileLookEditor?.registered?.())return false;
 style();panel.classList.add("khae-universal-look-host");
 const root=d.createElement("div");root.id=hostId;root.className="kuhle-layout";
 const image=d.createElement("div");image.className="kuhle-avatar";image.setAttribute("aria-label","Student picture preview");
 const content=d.createElement("div");const eyebrow=d.createElement("p");eyebrow.className="kuhle-eyebrow";eyebrow.textContent="My Student Profile";
 const person=d.createElement("p");person.className="kuhle-student-name";person.textContent="My Student Profile";
 const heading=d.createElement("h2");heading.className="kuhle-title";heading.id="grade09LookHeading";heading.textContent="My Picture & Colors";
 const help=d.createElement("p");help.className="kuhle-help";help.textContent="Personalize your profile using the universal 24 badges, 10 photo frames, and 24 colors.";
 const button=d.createElement("button");button.className="kuhle-open";button.type="button";button.textContent="Customize My Picture & Colors";button.addEventListener("click",()=>w.KhaemenesUniversalProfileLookEditor.open("picture"));
 const status=d.createElement("p");status.className="kuhle-status";status.setAttribute("role","status");
 content.append(eyebrow,person,heading,help,button,status);root.append(image,content);
 // The former chooser markup belongs to the retired editor. All course and
 // other student-profile sections are outside this panel and are preserved.
 panel.replaceChildren(root);
 render();return true;
}
w.KhaemenesUniversalHighLookEntry=Object.freeze({mount,refresh:render});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
for(const event of ["khaemenes-grade09-design-changed","khaemenes-high-profile-appearance-changed","pageshow"])w.addEventListener(event,render);
})();
