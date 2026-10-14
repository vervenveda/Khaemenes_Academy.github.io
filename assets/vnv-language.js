/* Verve N Veda / Khaemenes Academy — sovereign multilingual interface layer.
   Public UI only; no external translators, tracking, learner record access, or STOS operations.
   Navigation labels are translated without changing URLs, routes, or element IDs. */
(()=>{"use strict";
const CODES=["en","es","fr","ar","zh","de","ru"];
const ROWS=[["Explore","Explorar","Explorer","استكشف","探索","Entdecken","Исследовать"],["Halls","Salas","Salles","القاعات","展馆","Hallen","Залы"],["Matrix","Matriz","Matrice","المصفوفة","矩阵","Matrix","Матрица"],["Civic","Cívica","Civique","المدنية","公民","Bürgerwesen","Гражданское"],["Promise","Compromiso","Engagement","الوعد","承诺","Versprechen","Обещание"],["Donate","Donar","Faire un don","تبرع","捐助","Spenden","Пожертвовать"],["News","Noticias","Actualités","الأخبار","新闻","Nachrichten","Новости"],["Weather","Clima","Météo","الطقس","天气","Wetter","Погода"],["Creative","Creatividad","Créativité","الإبداع","创意","Kreatives","Творчество"],["Professional","Profesional","Professionnel","المهني","专业","Berufliches","Профессиональное"],["Education","Educación","Éducation","التعليم","教育","Bildung","Образование"],["Games","Juegos","Jeux","الألعاب","游戏","Spiele","Игры"],["Earth","Tierra","Terre","الأرض","地球","Erde","Земля"],["Health","Salud","Santé","الصحة","健康","Gesundheit","Здоровье"],["Connect","Conectar","Connexion","تواصل","连接","Verbinden","Связь"],["Finance","Finanzas","Finance","المالية","金融","Finanzen","Финансы"],["Research","Investigación","Recherche","البحث","研究","Forschung","Исследования"],["Knowledge","Conocimiento","Connaissances","المعرفة","知识","Wissen","Знания"],["Public Service","Servicio público","Service public","الخدمة العامة","公共服务","Öffentlicher Dienst","Общественная служба"],["Creative & Professional","Creativo y profesional","Créativité et métiers","الإبداع والمهن","创意与专业","Kreatives und Berufliches","Творчество и профессии"],["Gateways","Portales","Portails","البوابات","门户","Portale","Порталы"],["Pages","Páginas","Pages","الصفحات","页面","Seiten","Страницы"],["Apps","Aplicaciones","Applications","التطبيقات","应用","Apps","Приложения"],["Tools","Herramientas","Outils","الأدوات","工具","Werkzeuge","Инструменты"],["Courses","Cursos","Cours","الدورات","课程","Kurse","Курсы"],["Resources","Recursos","Ressources","الموارد","资源","Ressourcen","Ресурсы"],["Portals","Portales","Portails","البوابات","门户","Portale","Порталы"],["Workshops","Talleres","Ateliers","ورش العمل","工作坊","Workshops","Мастер-классы"],["Studios","Estudios","Studios","الاستوديوهات","工作室","Studios","Студии"],["Assessments","Evaluaciones","Évaluations","التقييمات","测评","Bewertungen","Оценивания"],["Mentors & Guides","Mentores y guías","Mentors et guides","الموجهون والمرشدون","导师与指南","Mentoren und Begleiter","Наставники и гиды"],["Explore the Ecosystem","Explorar el ecosistema","Explorer l'écosystème","استكشف المنظومة","探索生态系统","Ökosystem entdecken","Исследовать экосистему"],["Discover the Halls","Descubrir las salas","Découvrir les salles","اكتشف القاعات","发现各展馆","Hallen entdecken","Открыть залы"],["Open 333 Network","Abrir la red 333","Ouvrir le réseau 333","افتح شبكة 333","打开 333 网络","333-Netzwerk öffnen","Открыть сеть 333"],["Scroll to Explore","Desplázate para explorar","Défiler pour explorer","مرّر للاستكشاف","滚动探索","Zum Entdecken scrollen","Листайте для знакомства"],["Featured Sites","Sitios destacados","Sites à découvrir","المواقع المميزة","精选网站","Ausgewählte Seiten","Избранные сайты"],["Choose a doorway or browse its complete resources.","Elige una entrada o explora todos sus recursos.","Choisissez un portail ou parcourez toutes ses ressources.","اختر بوابة أو تصفح مواردها الكاملة.","选择入口或浏览全部资源。","Wählen Sie einen Zugang oder erkunden Sie alle Ressourcen.","Выберите раздел или изучите все его ресурсы."],["The Four Great Halls","Las cuatro grandes salas","Les quatre grandes salles","القاعات الأربع الكبرى","四大展馆","Die vier großen Hallen","Четыре главных зала"],["Many public resources. One organized home.","Muchos recursos públicos. Un espacio organizado.","De nombreuses ressources publiques. Un espace organisé.","موارد عامة كثيرة في مكان واحد منظم.","众多公共资源，汇于一处。","Viele öffentliche Ressourcen. Ein geordnetes Zuhause.","Множество открытых ресурсов. Единая система."],["Featured Public Destinations","Destinos públicos destacados","Destinations publiques à découvrir","وجهات عامة مميزة","精选公共站点","Ausgewählte öffentliche Angebote","Избранные общественные ресурсы"],["Featured across Verve N Veda","Destacado en Verve N Veda","À découvrir dans Verve N Veda","مميز عبر فيرف إن فيدا","Verve N Veda 精选","Vorgestellt bei Verve N Veda","Рекомендуем в Verve N Veda"],["Discover the ecosystem","Descubre el ecosistema","Découvrez l'écosystème","اكتشف المنظومة","发现生态系统","Entdecken Sie das Ökosystem","Откройте экосистему"],["Open in ecosystem viewer","Abrir en el visor","Ouvrir dans la visionneuse","افتح في عارض المنظومة","在站点查看器中打开","Im Ökosystem-Betrachter öffnen","Открыть в просмотрщике"],["Pause","Pausar","Pause","إيقاف مؤقت","暂停","Pause","Пауза"],["Resume","Reanudar","Reprendre","استئناف","继续","Fortsetzen","Продолжить"],["Print","Imprimir","Imprimer","طباعة","打印","Drucken","Печать"],["Verve N Veda Directory","Directorio Verve N Veda","Annuaire Verve N Veda","دليل فيرف إن فيدا","Verve N Veda 目录","Verve N Veda Verzeichnis","Каталог Verve N Veda"],["Search the complete directory","Buscar en el directorio completo","Rechercher dans tout l'annuaire","ابحث في الدليل الكامل","搜索完整目录","Gesamtes Verzeichnis durchsuchen","Поиск по всему каталогу"],["Search education, law, weather, art, veterans…","Buscar educación, derecho, clima, arte, veteranos…","Rechercher éducation, droit, météo, art, anciens combattants…","ابحث عن التعليم والقانون والطقس والفن والمحاربين القدامى…","搜索教育、法律、天气、艺术、退伍军人…","Bildung, Recht, Wetter, Kunst, Veteranen suchen…","Поиск: образование, право, погода, искусство, ветераны…"],["The Verve N Veda Promise","El compromiso de Verve N Veda","L'engagement de Verve N Veda","وعد فيرف إن فيدا","Verve N Veda 的承诺","Das Verve N Veda Versprechen","Обещание Verve N Veda"],["Welcome Home","Bienvenidos","Bienvenue","أهلاً بكم","欢迎","Willkommen","Добро пожаловать"],["Support Independent Creation","Apoya la creación independiente","Soutenir la création indépendante","ادعم الإبداع المستقل","支持独立创作","Unabhängige Kreativität unterstützen","Поддержать независимое творчество"],["Accounts","Cuentas","Comptes","الحسابات","账户","Konten","Аккаунты"],["Find My School","Encontrar mi escuela","Trouver mon école","ابحث عن مدرستي","寻找学校","Meine Schule finden","Найти школу"],["Academy Services","Servicios de la Academia","Services de l'Académie","خدمات الأكاديمية","学院服务","Akademie-Dienste","Услуги Академии"],["Beta Program","Programa beta","Programme bêta","البرنامج التجريبي","测试计划","Beta-Programm","Бета-программа"],["Help Desk","Centro de ayuda","Centre d'aide","مركز المساعدة","帮助中心","Hilfezentrum","Служба помощи"],["Front Desk","Recepción","Accueil","الاستقبال","服务台","Empfang","Приёмная"],["Schools","Escuelas","Écoles","المدارس","学校","Schulen","Школы"],["Services","Servicios","Services","الخدمات","服务","Dienste","Услуги"],["Beta","Beta","Bêta","تجريبي","测试版","Beta","Бета"],["Help","Ayuda","Aide","مساعدة","帮助","Hilfe","Помощь"],["Student Entry","Acceso de estudiantes","Accès élève","دخول الطالب","学生入口","Schülerzugang","Вход ученика"],["Create / Manage Account","Crear o gestionar cuenta","Créer ou gérer un compte","إنشاء أو إدارة حساب","创建或管理账户","Konto erstellen oder verwalten","Создать или управлять аккаунтом"],["What do you need today?","¿Qué necesitas hoy?","De quoi avez-vous besoin aujourd'hui ?","ما الذي تحتاجه اليوم؟","今天需要什么帮助？","Was brauchen Sie heute?","Что вам нужно сегодня?"],["One calm path through the front desk.","Un camino claro desde la recepción.","Un parcours serein depuis l'accueil.","مسار واضح عبر مكتب الاستقبال.","从服务台开始的清晰路径。","Ein klarer Weg durch den Empfang.","Понятный путь через приёмную."],["Go directly to the learning stage you need.","Ve directamente a la etapa educativa que necesitas.","Accédez directement au niveau d'études souhaité.","انتقل مباشرة إلى المرحلة التعليمية التي تحتاجها.","直达所需学习阶段。","Direkt zur passenden Lernstufe.","Перейдите сразу к нужной ступени обучения."],["Common questions, direct answers.","Preguntas frecuentes, respuestas claras.","Questions fréquentes, réponses directes.","أسئلة شائعة وإجابات مباشرة.","常见问题，直接解答。","Häufige Fragen, klare Antworten.","Частые вопросы, прямые ответы."],["Preschool","Preescolar","Maternelle","مرحلة ما قبل المدرسة","学前班","Vorschule","Дошкольное обучение"],["Kinder Garden","Jardín de infancia","Jardin d'enfants","رياض الأطفال","幼儿园","Kindergarten","Детский сад"],["Elementary","Primaria","École primaire","الابتدائية","小学","Grundschule","Начальная школа"],["Middle School","Escuela intermedia","Collège","المرحلة المتوسطة","初中","Mittelstufe","Средняя школа"],["High School","Secundaria superior","Lycée","المرحلة الثانوية","高中","Oberstufe","Старшая школа"],["Higher Learning","Educación superior","Enseignement supérieur","التعليم العالي","高等教育","Höhere Bildung","Высшее образование"],["Linguistics","Lingüística","Linguistique","اللغويات","语言学","Linguistik","Лингвистика"],["Student","Estudiante","Élève","طالب","学生","Lernende","Ученик"],["Family","Familia","Famille","الأسرة","家庭","Familie","Семья"],["Family / Parent","Familia / Padres","Famille / Parents","الأسرة / الوالدين","家庭／家长","Familie / Eltern","Семья / Родители"],["Teacher / Faculty","Docentes","Enseignants","المعلمون","教师","Lehrkräfte","Преподаватели"],["Adult Scholar","Estudiante adulto","Apprenant adulte","متعلم بالغ","成人学员","Erwachsene Lernende","Взрослый учащийся"],["Account","Cuenta","Compte","الحساب","账户","Konto","Аккаунт"],["School","Escuela","École","المدرسة","学校","Schule","Школа"],["Learning","Aprendizaje","Apprentissage","التعلم","学习","Lernen","Обучение"],["Records","Expedientes","Dossiers","السجلات","记录","Unterlagen","Документы"],["Academy Compass","Guía de la Academia","Boussole de l'Académie","بوصلة الأكاديمية","学院导航","Akademie-Kompass","Навигатор Академии"],["Open Student Portal","Abrir portal del estudiante","Ouvrir l'espace élève","افتح بوابة الطالب","打开学生门户","Schülerportal öffnen","Открыть портал ученика"],["Open Family Portal","Abrir portal familiar","Ouvrir l'espace famille","افتح بوابة الأسرة","打开家庭门户","Familienportal öffnen","Открыть семейный портал"],["Teacher Administration","Administración docente","Administration pédagogique","إدارة المعلمين","教师管理","Lehrerverwaltung","Управление преподавателями"],["Adult Learning","Aprendizaje para adultos","Formation des adultes","تعليم الكبار","成人学习","Erwachsenenbildung","Образование взрослых"],["Open Preschool","Abrir preescolar","Ouvrir la maternelle","افتح ما قبل المدرسة","打开学前班","Vorschule öffnen","Открыть дошкольное обучение"],["Open Kindergarten","Abrir jardín de infancia","Ouvrir le jardin d'enfants","افتح الروضة","打开幼儿园","Kindergarten öffnen","Открыть детский сад"],["Open Elementary","Abrir primaria","Ouvrir l'école primaire","افتح الابتدائية","打开小学","Grundschule öffnen","Открыть начальную школу"],["Open Middle School","Abrir escuela intermedia","Ouvrir le collège","افتح المرحلة المتوسطة","打开初中","Mittelstufe öffnen","Открыть среднюю школу"],["Open High School","Abrir secundaria","Ouvrir le lycée","افتح الثانوية","打开高中","Oberstufe öffnen","Открыть старшую школу"],["Open Higher Learning","Abrir educación superior","Ouvrir l'enseignement supérieur","افتح التعليم العالي","打开高等教育","Höhere Bildung öffnen","Открыть высшее образование"],["Open Linguistics","Abrir lingüística","Ouvrir linguistique","افتح اللغويات","打开语言学","Linguistik öffnen","Открыть лингвистику"],["Open Help Desk →","Abrir centro de ayuda →","Ouvrir l'aide →","افتح مركز المساعدة ←","打开帮助中心 →","Hilfe öffnen →","Открыть помощь →"],["Join Beta Testing →","Participar en pruebas beta →","Rejoindre le programme bêta →","انضم للاختبار التجريبي ←","加入测试 →","Am Betatest teilnehmen →","Участвовать в бета-тесте →"],["Placement & Pathways","Asignación y trayectorias","Placement et parcours","التسكين والمسارات","分班与学习路径","Einstufung und Lernwege","Распределение и траектории"],["Records & Reports","Expedientes e informes","Dossiers et rapports","السجلات والتقارير","记录与报告","Unterlagen und Berichte","Документы и отчёты"],["Help & Orientation","Ayuda y orientación","Aide et orientation","المساعدة والإرشاد","帮助与指引","Hilfe und Orientierung","Помощь и ориентация"],["Beta & Improvement","Pruebas y mejoras","Tests et améliorations","الاختبار والتحسين","测试与改进","Beta und Verbesserung","Тестирование и улучшения"]];
const MAP=new Map(ROWS.map(row=>[row[0],row]));
const META={en:["English","Language"],es:["Español","Idioma"],fr:["Français","Langue"],ar:["العربية","اللغة"],zh:["中文","语言"],de:["Deutsch","Sprache"],ru:["Русский","Язык"]};
const KEY="vnv_language_v1",PARAM="lang";
const original=new WeakMap(),attributeBase=new WeakMap();
const normalize=s=>String(s).replace(/\s+/g," ").trim();
function readPref(){try{return localStorage.getItem(KEY)}catch{return null}}
function storePref(v){try{localStorage.setItem(KEY,v)}catch{}}
const params=new URLSearchParams(location.search);
const urlLang=params.get(PARAM);
let lang=CODES.includes(urlLang)?urlLang:(CODES.includes(readPref())?readPref():"en");
if(urlLang&&CODES.includes(urlLang))storePref(lang);
function translate(s){
 const row=MAP.get(normalize(s));
 return row?(row[CODES.indexOf(lang)]||row[0]):null;
}
function ignored(el){
 return !!(el&&el.closest("script,style,noscript,svg,math,code,pre,textarea,select,option,[contenteditable],#adminGate,[data-i18n-ignore]"));
}
function textTranslate(n){
 const parent=n.parentElement;
 if(!parent||ignored(parent))return;
 let base=original.get(n);
 if(base===undefined){base=n.nodeValue;original.set(n,base)}
 const phrase=normalize(base);if(!phrase)return;
 const replacement=translate(phrase);
 const value=replacement?base.replace(phrase,replacement):base;
 if(n.nodeValue!==value)n.nodeValue=value;
}
function attrsTranslate(el){
 if(ignored(el))return;
 let base=attributeBase.get(el);
 if(!base){
  base={};
  for(const a of ["placeholder","aria-label","title"]){if(el.hasAttribute(a))base[a]=el.getAttribute(a)}
  attributeBase.set(el,base);
 }
 for(const [key,value] of Object.entries(base)){
  const translated=translate(value);
  const next=translated||value;
  if(el.getAttribute(key)!==next)el.setAttribute(key,next);
 }
}
function translateTree(root){
 if(root.nodeType===Node.TEXT_NODE){textTranslate(root);return}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 if(root.nodeType===Node.ELEMENT_NODE){if(ignored(root))return;attrsTranslate(root)}
 const tree=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 let node;
 while((node=tree.nextNode())){
  if(node.nodeType===Node.TEXT_NODE)textTranslate(node);
  else if(!ignored(node))attrsTranslate(node);
 }
}
const styles=document.createElement("style");
styles.textContent=`
#vnv-language-actions{display:flex;justify-self:end;align-items:center;justify-content:flex-end;gap:8px;min-width:0}
.vnv-language-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;justify-self:end;min-width:0}
.vnv-language-actions .menu-button{flex:0 0 40px}
#vnv-language-switch-drawer{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;margin:10px auto 16px;max-width:100%;padding:8px;border:1px solid rgba(87,74,48,.3);border-radius:7px;background:#fffdf8;color:#162b24;font:400 12px/1.4 Arial,sans-serif}
#vnv-language-switch-drawer select{max-width:175px;min-width:112px;padding:7px 9px;border:1px solid #a89a79;border-radius:7px;background:#fff;color:#17211d;font:inherit}
#vnv-language-switch-drawer label{white-space:nowrap}
body > #vnv-language-switch{display:flex;width:max-content;max-width:calc(100% - 24px);margin:10px auto;min-height:45px}
#vnv-language-switch{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;padding:7px 10px;margin:7px;border:1px solid rgba(87,74,48,.3);border-radius:7px;background:#fffdf8;color:#162b24;font:400 12px/1.4 "Brandon Grotesque","Avenir Next",Arial,sans-serif;text-align:center;max-width:100%;position:relative;z-index:1550}
#vnv-language-switch label{font-weight:400;white-space:nowrap}
#vnv-language-select{appearance:auto;max-width:175px;min-width:112px;padding:7px 9px;border:1px solid #a89a79;border-radius:7px;background:#fff;color:#17211d;font:inherit}
#vnv-language-select:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
html[dir="rtl"] #vnv-language-switch,html[dir="rtl"] #vnv-language-switch-drawer{direction:rtl}
html[dir="rtl"] .ecosystem-category-grid,html[dir="rtl"] .quick-grid,html[dir="rtl"] .school-grid{direction:ltr}
html[dir="rtl"] .ecosystem-category-grid > *,html[dir="rtl"] .quick-grid > *,html[dir="rtl"] .school-grid > *{direction:rtl}
@media(max-width:480px){#vnv-language-switch{margin:6px auto}#vnv-language-select{min-width:106px}}
`;
document.head.append(styles);
function makeSelector(){
 if(document.getElementById("vnv-language-switch"))return;
 const wrap=document.createElement("div");wrap.id="vnv-language-switch";
 const label=document.createElement("label");label.htmlFor="vnv-language-select";
 const select=document.createElement("select");select.id="vnv-language-select";
 select.setAttribute("aria-label","Choose interface language");
 for(const c of CODES){const opt=document.createElement("option");opt.value=c;opt.textContent=META[c][0];select.append(opt)}
 select.value=lang;wrap.append(label,select);
 let target;
 if(document.querySelector(".site-header .header-inner")){
  const main=document.querySelector("main");
  if(main)main.before(wrap);else document.body.append(wrap);
  const drawer=document.getElementById("menuDrawer");
  if(drawer){
   const mirror=wrap.cloneNode(true);
   mirror.id="vnv-language-switch-drawer";
   mirror.querySelector("label").htmlFor="vnv-language-select-drawer";
   const mirrorSelect=mirror.querySelector("select");
   mirrorSelect.id="vnv-language-select-drawer";
   const heading=drawer.querySelector(".drawer-top");
   if(heading)heading.after(mirror);else drawer.prepend(mirror);
   mirrorSelect.addEventListener("change",()=>setLanguage(mirrorSelect.value));
  }
 }else if(document.querySelector(".ribbon")){
  target=document.querySelector(".ribbon");target.append(wrap);
 }else{
  target=document.querySelector("header")||document.body;target.append(wrap);
 }
 select.addEventListener("change",()=>setLanguage(select.value));
 updateLabel();
}
function updateLabel(){
 document.querySelectorAll('#vnv-language-switch label,#vnv-language-switch-drawer label').forEach(lab=>lab.textContent=META[lang][1]+":");
 for(const name of ["vnv-language-select","vnv-language-select-drawer"]){const sel=document.getElementById(name);if(sel)sel.value=lang;}
}
function setLanguage(next){
 if(!CODES.includes(next))return;
 lang=next;storePref(lang);
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 updateLabel();translateTree(document.body);
 document.dispatchEvent(new CustomEvent("vnv:language-change",{detail:{language:lang}}));
}
function internalRoute(url){
 return (url.hostname==="vervenveda.com"||url.hostname==="www.vervenveda.com"||url.hostname==="vervenveda.github.io")&&
 (/\/Khaemenes_Academy\.github\.io(?:\/|$)/.test(url.pathname)||url.pathname==="/"||url.pathname==="/vervenveda.github.io/");
}
document.addEventListener("click",event=>{
 const link=event.target.closest&&event.target.closest("a[href]");
 if(!link||lang==="en"||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const href=link.getAttribute("href");if(!href||href.startsWith("#"))return;
 let url;try{url=new URL(href,location.href)}catch{return}
 if(!internalRoute(url))return;
 url.searchParams.set(PARAM,lang);
 link.href=url.href;
},true);
function init(){
 makeSelector();
 setLanguage(lang);
 const observer=new MutationObserver(records=>{
  for(const record of records){
   for(const node of record.addedNodes)translateTree(node);
  }
 });
 observer.observe(document.body,{subtree:true,childList:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
window.VNVLanguage=Object.freeze({getLanguage:()=>lang,setLanguage,availableLanguages:()=>CODES.slice()});
})();