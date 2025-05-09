const EN = document.getElementById('EN');
const JA = document.getElementById('JA');
const ZH = document.getElementById('ZH');
const pplV_EN = document.getElementById('pplV_EN');
const pplV_JA = document.getElementById('pplV_JA');
const pplV_ZH = document.getElementById('pplV_ZH');
const pplO_EN = document.getElementById('pplO_EN');
const pplO_JA = document.getElementById('pplO_JA');
const pplO_ZH = document.getElementById('pplO_ZH');
const mpplV_EN = document.getElementById('mpplV_EN');
const mpplV_JA = document.getElementById('mpplV_JA');
const mpplV_ZH = document.getElementById('mpplV_ZH');
const mpplO_EN = document.getElementById('mpplO_EN');
const mpplO_JA = document.getElementById('mpplO_JA');
const mpplO_ZH = document.getElementById('mpplO_ZH');
const container  = document.getElementById('container');
const enElements = document.getElementsByClassName('English');
const jaElements = document.getElementsByClassName('Japanese');
const zhElements = document.getElementsByClassName('Chinese');
const params     = new URLSearchParams(window.location.search);
const main_news_EN         = document.getElementById('main_news_EN');
const main_research_EN     = document.getElementById('main_research_EN');
const main_pplV_EN         = document.getElementById('main_pplV_EN');
const main_pplO_EN         = document.getElementById('main_pplO_EN');
const main_publications_EN = document.getElementById('main_publications_EN');
const main_joinus_EN       = document.getElementById('main_joinus_EN');
const main_resources_EN    = document.getElementById('main_resources_EN');

//const bg_dict = {
//                  "main_research_EN": ["L_1r","L_2r", main_research_EN],
//                  "main_news_EN": ["M_1r","M_2r", main_news_EN],
//                  "main_pplV_EN": ["H_1r","H_2r", main_pplV_EN],
//                  "main_pplO_EN": ["D_1r","D_2r", main_pplO_EN],
//                  "main_publications_EN": ["N_1r","N_2r", main_publications_EN],
//                  "main_joinus_EN": ["J_1r","J_2r", main_joinus_EN],
//                  "main_resources_EN": ["F_1r","F_2r", main_resources_EN],
//                }

const bg_dict = {
                  "main_research_EN": ["H_1r","H_2r", main_research_EN],
                  "main_news_EN": ["M_1r","M_2r", main_news_EN],
                  "main_pplV_EN": ["D_1r","D_2r", main_pplV_EN],
                  "main_pplO_EN": ["J_1r","J_2r", main_pplO_EN],
                  "main_publications_EN": ["F_1r","F_2r", main_publications_EN],
                  "main_joinus_EN": ["L_1r","L_2r", main_joinus_EN],
                  "main_resources_EN": ["N_1r","N_2r", main_resources_EN],
                }


const sidebar_top_p_EN = document.querySelector("#sidebar > section:nth-child(1) > p")
sidebar_top_p_EN.innerHTML = "&nbsp;";

const sidebar_top_p_JA = document.querySelector("#sidebar > section:nth-child(2) > p")
sidebar_top_p_JA.innerHTML = "&nbsp;";

const sidebar_top_p_ZH = document.querySelector("#sidebar > section:nth-child(3) > p")
sidebar_top_p_ZH.innerHTML = "&nbsp;";

var ubcElements   = null;
var primeElements = null; 

EN.style.marginRight = "1px";
EN.style.borderRight = "0px solid #FFFFFF"; 
JA.style.marginRight = "1px";
JA.style.borderRight = "0px solid #FFFFFF"; 
var LANG   = "EN";
  
if (params.has('affil') === true) {
  if(params.get('affil') === "UBC"){
    var AFFILS = ["All", "UBC"];
  }else if (params.get('affil') === "Osaka"){
    var AFFILS = ["All", "Osaka"];
  } else {
    var AFFILS = ["All", "UBC", "Osaka"];
  }
}else{
  var AFFILS = ["All", "UBC", "Osaka"];
}

let lastScroll = 0;
let throttleTime = 2;

var scrollTimeout  = null;
var scrollTimeout2 = null;
var vw = window.innerWidth;
var vh = window.innerHeight;
var aside   = document.querySelector('aside');
var sidebar = document.getElementById('sidebar');
var header  = document.getElementById("normal_header");
var main    = document.querySelector('.posts');
var footer  = document.querySelector('footer'); 
var langElement  = document.getElementById("languages");
var frontElement = document.querySelector("#frontlogo img");
var backElement  = document.querySelector("#backlogo img");
frontElement.style.objectPosition = "top";

var mainRect   = main.getBoundingClientRect();
var footerRect = footer.getBoundingClientRect();
var asideRect  = aside.getBoundingClientRect();

var originalWidth  = langElement.style.width;
var originalHeight = langElement.style.height;

let ENisReplaced = false;
let JAisReplaced = false;
let ZHisReplaced = false;
var original_enElements = [];

for (var i = 0; i < enElements.length; i++) {
  var ostyle = window.getComputedStyle(enElements[i]).display;
  if(ostyle === "none"){
    original_enElements.push("block");
  }else{
    original_enElements.push(ostyle);
  }
}

var original_jaElements = [];
for (var i = 0; i < jaElements.length; i++) {
  var ostyle = window.getComputedStyle(jaElements[i]).display;
  if(ostyle === "none"){
    original_jaElements.push("block");
  }else{
    original_jaElements.push(ostyle);
  }
}

var original_zhElements = [];
for (var i = 0; i < zhElements.length; i++) {
  var ostyle = window.getComputedStyle(zhElements[i]).display;
  if(ostyle === "none"){
    original_zhElements.push("block");
  }else{
    original_zhElements.push(ostyle);
  }
}

function preloadImages(...images) {
  images.forEach(image => {
    const img = new Image();
    img.src = image;
  });
}

function intersection(first, second){
  var s = new Set(second);
  return first.filter(item => s.has(item));
};

function updateLinksForLanguage(lang) {
  var newUrl = new URL(window.location.href);
  newUrl.searchParams.set("lang", lang);
  window.history.replaceState(null, '', newUrl);

  const links = document.querySelectorAll('a');
  links.forEach(link => {
    var href = link.getAttribute('href'); 
    if (link.getAttribute('href') === null){
      null;
    }else if (link.getAttribute('href').startsWith("http") === false){
      if (href.includes("?lang=")){
        href = href.replace(/\.html\?lang=[A-Z]{2}/,".html?lang=" + lang)
        link.setAttribute("href", href);
      }else{
        href = href.replace(/\.html/,".html?lang=" + lang)
        link.setAttribute("href", href);
      }
    }
  });
}

function setEN(){
  LANG = "EN";
  if (ENisReplaced===false) {
    EN.style.fontWeight   = '700';
    EN.style.backgroundColor = '#CD853F';
    JA.style.fontWeight   = '100';
    JA.style.backgroundColor = '#888888';
    ZH.style.fontWeight   = '100';
    ZH.style.backgroundColor = '#888888';
    for (var i = 0; i < jaElements.length; i++) {
      jaElements[i].style.display = "none";
    }
    for (var i = 0; i < zhElements.length; i++) {
      zhElements[i].style.display = "none";
    }
    for (var i = 0; i < enElements.length; i++) {
      if(intersection(enElements[i].className.split(' '), AFFILS).length > 0){
        enElements[i].style.display = original_enElements[i];
      } 
    }
    ENisReplaced = true;
    JAisReplaced = false;
    ZHisReplaced = false;
    updateLinksForLanguage("EN");
  } else {
    null;
  }
  if (vw > 700){
    aside.style.display = "flex";
}
  ubcElements   = Array.from(document.getElementsByClassName('UBC English')).concat(Array.from(document.getElementsByClassName('UBC Common')));
  primeElements = Array.from(document.getElementsByClassName('Osaka English')).concat(Array.from(document.getElementsByClassName('Osaka Common')));
}

function setJA(){ 
  LANG = "JA";
  if (JAisReplaced===false) {
    EN.style.fontWeight   = '300';
    EN.style.backgroundColor = '#888888';
    JA.style.fontWeight   = '600';
    JA.style.backgroundColor = '#CD853F';
    ZH.style.fontWeight   = '100';
    ZH.style.backgroundColor = '#888888';
    for (var i = 0; i < enElements.length; i++) {
      enElements[i].style.display = "none";
    }  
    for (var i = 0; i < zhElements.length; i++) {
      zhElements[i].style.display = "none";
    } 
    for (var i = 0; i < jaElements.length; i++) {
      //console.log(jaElements[i].className); 
      if(intersection(jaElements[i].className.split(' '), AFFILS).length > 0){
        jaElements[i].style.display = original_jaElements[i];
      }
    }
    ENisReplaced = false;
    JAisReplaced = true;
    ZHisReplaced = false;
    updateLinksForLanguage("JA");
  } else {
    null; 
  }
  if (vw > 700){
    aside.style.display = "flex";
  }
  ubcElements   = Array.from(document.getElementsByClassName('UBC Japanese')).concat(Array.from(document.getElementsByClassName('UBC Common')));
  primeElements = Array.from(document.getElementsByClassName('Osaka Japanese')).concat(Array.from(document.getElementsByClassName('Osaka Common')));
  //console.log(primeElements);
}

function setZH(){
  LANG = "ZH";
  if (ZHisReplaced===false) {
    EN.style.fontWeight   = '300';
    EN.style.backgroundColor = '#888888';
    JA.style.fontWeight   = '100';
    JA.style.backgroundColor = '#888888';
    ZH.style.fontWeight   = '600';
    ZH.style.backgroundColor = '#CD853F';
    for (var i = 0; i < enElements.length; i++) {
      enElements[i].style.display = "none";
    } 
    for (var i = 0; i < jaElements.length; i++) {
      jaElements[i].style.display = "none";
    }
    for (var i = 0; i < zhElements.length; i++) {
      if(intersection(zhElements[i].className.split(' '), AFFILS).length > 0){
        zhElements[i].style.display = original_zhElements[i];
      }
    } 
    ENisReplaced = false;
    JAisReplaced = false;
    ZHisReplaced = true;
    updateLinksForLanguage("ZH");
  } else {
    null; 
  }
  if (vw > 700){
    aside.style.display = "flex";
  }
  ubcElements   = Array.from(document.getElementsByClassName('UBC Chinese')).concat(Array.from(document.getElementsByClassName('UBC Common')));
  primeElements = Array.from(document.getElementsByClassName('Osaka Chinse')).concat(Array.from(document.getElementsByClassName('Osaka Common'))); 
}

function setUBC(){
  for (var i = 0; i < ubcElements.length; i++) {
    ubcElements[i].style.display = original_ubcElements[i];
  } 
  for (var i = 0; i < primeElements.length; i++) {
    primeElements[i].style.display = "none";
  }
}

function setOsaka(){
  for (var i = 0; i < ubcElements.length; i++) {
    //console.log(ubcElements[i]); 
    ubcElements[i].style.display = "none";
  } 
  for (var i = 0; i < primeElements.length; i++) {
    primeElements[i].style.display = original_primeElements[i];
  }
}

function checkAsidePosition() {
  var element = document.querySelector('aside');
  var main = document.querySelector('.posts');
  if (mainRect.top < 0) {
    element.style.position = 'fixed';
  }else{
    element.style.position = 'absolute';
  }
}

function checkLangPosition() {
  if (scrollTimeout2) {
      clearTimeout(scrollTimeout2);
    }

  var element = document.getElementById("languages");
  mainRect = main.getBoundingClientRect();
  if (mainRect.top < header.clientHeight*(1-5/15)){
    element.style.position = 'fixed';
    element.style.top = "0";
    element.style.right  = "max(0px, calc((100% - 1920px) / 2))";
    element.style.zIndex = "20"
  }else{
    element.style.position = 'relative';
    element.style.top = "0";
    element.style.right = "0";
  }
  
  if (mainRect.top < 0) {
    //EN.style.marginRight = "0";
    //EN.style.borderRight = "1px solid #FFFFFF"; 
    //JA.style.marginRight = "0";
    //JA.style.borderRight = "1px solid #FFFFFF"; 
    element.style.background = "#FFFFFF00";
  } else {
    //EN.style.marginRight = "1px";
    //EN.style.borderRight = "0px solid #FFFFFF"; 
    //JA.style.marginRight = "1px";
    //JA.style.borderRight = "0px solid #FFFFFF"; 
    element.style.background = "#FFFFFF00";
    element.style.width  = originalWidth;
    element.style.height = originalHeight;
  }
  
  scrollTimeout2 = setTimeout(function() {
      if (mainRect.top >= header.clientHeight*(1-5/15)){
        element.style.position = 'relative';
        element.style.top = "0";
        element.style.right = "0";
      } else {
        element.style.position = 'fixed';
        element.style.top = "0";
        element.style.right  = "max(0px, calc((100% - 1920px) / 2))";
        element.style.zIndex = "20";
      }
    }, 10);
}

function scrollImg() { 
  vw = window.innerWidth;
  vh = window.innerHeight;
  mainRect   = main.getBoundingClientRect();
  var scrlh = 0.75 * (header.clientHeight - mainRect.top);
  container.style.backgroundPosition = `top calc(calc(-1.211 * min(0.25 * 1920px, 25vw)) + ${scrlh}px) right 50%`;
}

function checkLogoPosition() {
  var logoOriginalHeight = backElement.height;
  var logoOriginalWidth  = backElement.width;

  const currentScroll = Date.now();
  if (currentScroll - lastScroll > throttleTime) {
    lastScroll = currentScroll;
  
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    vw = window.innerWidth;
    mainRect  = main.getBoundingClientRect();
    asideRect = aside.getBoundingClientRect();
    var flmg = Math.min(1.0*vw, 1920 * 0.01);
    var headMenuHeight = Math.min(15*vw, 1920 * 0.135) 
    var bmg = headMenuHeight * (1-5/15) - logoOriginalHeight - flmg;
    var sidebarHeight = sidebar.clientHeight;
    var mainHeight = main.clientHeight;
   
    if (mainRect.top < header.clientHeight*(1-5/15)) {
      frontElement.style.position = 'fixed';
      frontElement.style.top = "0";
      backElement.style.position = 'fixed';
      backElement.style.top = "0";
      frontElement.style.left = "max(0px, calc((100% - 1920px) / 2))";
      backElement.style.left = "max(0px, calc((100% - 1920px) / 2))";
      
      if (mainRect.top - flmg < logoOriginalHeight) {
        frontElement.style.height = mainRect.top - flmg;
        aside.style.top = mainRect.top < 0 ? logoOriginalHeight + flmg : logoOriginalHeight - (mainRect.top - flmg); 
        if (mainRect.top < 0) {
          if (mainHeight + mainRect.top < sidebarHeight + logoOriginalHeight + 10 * flmg){
            aside.style.position = 'absolute';
            aside.style.top  = mainHeight - sidebarHeight - 9 * flmg;
            aside.style.left = "0"; 
            frontElement.style.top = mainHeight + mainRect.top - (sidebarHeight + logoOriginalHeight + 10 * flmg);
            backElement.style.top  = mainHeight + mainRect.top - (sidebarHeight + logoOriginalHeight + 10 * flmg);
          }else {
            aside.style.position = 'fixed';
            aside.style.left = "max(0px, calc((100% - 1920px) / 2))"; 
          }
        } else {
          aside.style.position = 'absolute';
          aside.style.left = "0"; 
        }
      } else { 
        frontElement.style.height = "auto";
      }
   
    } else {
      frontElement.style.position = 'relative';
      backElement.style.position  = 'relative';
      frontElement.style.left     = "0";
      backElement.style.left      = "0";
      frontElement.style.height   = "auto";
    }
    
    scrollTimeout = setTimeout(function() {
      if (((mainRect.top < header.clientHeight*(1-5/15)) === false) || (((mainRect.top < header.clientHeight*(1-5/15)) === true) && (mainRect.top - flmg < logoOriginalHeight) === false)){
        frontElement.style.height = "auto";
        aside.style.position = 'absolute';
        aside.style.left = "0"; 
        if ((mainRect.top < header.clientHeight*(1-5/15)) === false){
          aside.style.top = 0;
        }
      } else {
        frontElement.style.height = mainRect.top - flmg < 0 ? 0: mainRect.top - flmg;
      }
    }, 10);
  }
}

function isSafari() {
  var userAgent = navigator.userAgent;
  return userAgent.includes('Safari') && !userAgent.includes('Chrome') && !userAgent.includes('Chromium');
}

function add_param(element, affil){
  var link = element.querySelector('a');
  var href = link.getAttribute('href'); 
  //console.log(href);
  if (href.includes("?lang=")){
    href = href.replace(/\.html\?lang=[A-Z]{2}/,".html?lang=" + LANG + `&affil=${affil}`)
    link.setAttribute("href", href);
  }else{
    href = href.replace(/\.html/,`.html?lang=${LANG}&affil=${affil}`)
    link.setAttribute("href", href);
  }
}

function replaceBg(bgid){
  var element = document.getElementById(bgid.replace("_EN","_img"));
  //var elements = document.getElementsByClassName('main_img');
  var url= element.src;
  console.log(url);
  if (url.includes(bg_dict[bgid][0] + ".png")){ 
    console.log(url); 
    url = url.replace(bg_dict[bgid][0] + ".png", bg_dict[bgid][1] + ".png")
    element.src = url;
    element.style.animationPlayState = 'paused';
    for (const key in bg_dict) {
      bg_dict[key][2].style.zIndex = 23;
    }
    element.style.zIndex = 21;
    footer.style.zIndex = 22;
  } else if (url.includes(bg_dict[bgid][1] + ".png")){
    url = url.replace(bg_dict[bgid][1] + ".png", bg_dict[bgid][0] + ".png")
    element.src = url;
    element.style.zIndex = 0;
    element.style.animationPlayState = 'running';
    for (const key in bg_dict) {
      bg_dict[key][2].style.zIndex = 19;
    }
    footer.style.zIndex = 18;
  }
}

EN.addEventListener('click', setEN);
JA.addEventListener('click', setJA);
ZH.addEventListener('click', setZH);

pplV_EN.addEventListener('click', () => add_param(pplV_EN, "UBC"));
pplV_JA.addEventListener('click', () => add_param(pplV_JA, "UBC"));
pplV_ZH.addEventListener('click', () => add_param(pplV_ZH, "UBC"));

pplO_EN.addEventListener('click', () => add_param(pplO_EN, "Osaka"));
pplO_JA.addEventListener('click', () => add_param(pplO_JA, "Osaka"));
pplO_ZH.addEventListener('click', () => add_param(pplO_ZH, "Osaka"));

mpplV_EN.addEventListener('click', () => add_param(mpplV_EN, "UBC"));
mpplV_JA.addEventListener('click', () => add_param(mpplV_JA, "UBC"));
mpplV_ZH.addEventListener('click', () => add_param(mpplV_ZH, "UBC"));

mpplO_EN.addEventListener('click', () => add_param(mpplO_EN, "Osaka"));
mpplO_JA.addEventListener('click', () => add_param(mpplO_JA, "Osaka"));
mpplO_ZH.addEventListener('click', () => add_param(mpplO_ZH, "Osaka"));

main_pplV_EN.addEventListener('click', () => add_param(main_pplV_EN, "UBC"));
main_pplO_EN.addEventListener('click', () => add_param(main_pplO_EN, "Osaka"));

main_research_EN.addEventListener('mouseenter', () => replaceBg("main_research_EN"));
main_research_EN.addEventListener('mouseleave', () => replaceBg("main_research_EN"));

main_news_EN.addEventListener('mouseenter', () => replaceBg("main_news_EN"));
main_news_EN.addEventListener('mouseleave', () => replaceBg("main_news_EN"));

main_pplV_EN.addEventListener('mouseenter', () => replaceBg("main_pplV_EN"));
main_pplV_EN.addEventListener('mouseleave', () => replaceBg("main_pplV_EN"));

main_pplO_EN.addEventListener('mouseenter', () => replaceBg("main_pplO_EN"));
main_pplO_EN.addEventListener('mouseleave', () => replaceBg("main_pplO_EN"));

main_publications_EN.addEventListener('mouseenter', () => replaceBg("main_publications_EN"));
main_publications_EN.addEventListener('mouseleave', () => replaceBg("main_publications_EN"));

main_resources_EN.addEventListener('mouseenter', () => replaceBg("main_resources_EN"));
main_resources_EN.addEventListener('mouseleave', () => replaceBg("main_resources_EN"));

main_joinus_EN.addEventListener('mouseenter', () => replaceBg("main_joinus_EN"));
main_joinus_EN.addEventListener('mouseleave', () => replaceBg("main_joinus_EN"));

window.addEventListener('scroll', checkLangPosition);
window.addEventListener('resize', checkLangPosition);

if (isSafari()) {
  throttleTime = 4;
}else{
  throttleTime = 2; 
}

// if (vw > 700){
//  window.addEventListener('scroll', scrollImg);
//} 

window.addEventListener('orientationchange', function() {
    location.reload();
});

if (params.has('lang') === true) {
  const lang = params.get('lang');
  if(lang === "EN"){
    setEN();
  } else if(lang === "JA"){
    setJA();
  } else if(lang === "ZH"){
    setZH();
  }
} else {
  setEN();
}

var original_ubcElements = [];
for (var i = 0; i < ubcElements.length; i++) {
  original_ubcElements.push(ubcElements[i].style.display);
}
var original_primeElements = [];
for (var i = 0; i < primeElements.length; i++) {
  original_primeElements.push(primeElements[i].style.display);
}

if (params.has('affil') === true) {
  const affil = params.get('affil');
  if(affil === "UBC"){
    setUBC();
  }else if(affil === "Osaka"){
    setOsaka();
  }
}

if (vw > 700){
 aside.style.display = "flex";
}

preloadImages('./img/LL_2r.png', './img/MM_2r.png', './img/HH_2r.png', './img/DD_2r.png', './img/NN_2r.png', './img/JJ_2r.png', './img/FF_2r.png', './img/FF_2_cropped.png', './img/FF_1_cropped.png');
