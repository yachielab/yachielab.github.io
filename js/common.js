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
const breakpoint = window.matchMedia("(max-width:700px)");

var ubcElements   = null;
var primeElements = null; 

EN.style.marginRight = "1px";
EN.style.borderRight = "0px solid #FFFFFF"; 
JA.style.marginRight = "1px";
JA.style.borderRight = "0px solid #FFFFFF"; 
var LANG   = "EN";

if (params.has('develop') === true && params.get('develop') === "TRUE") {
  var currentUrl = window.location.href;
  if(currentUrl.includes("yachie-lab.org")){
    window.location.href = 'https://yachielab.github.io';
  }
} else {
  var currentUrl = window.location.href;
  if(currentUrl.includes("https://yachielab.github.io")){
    currentUrl = currentUrl.replace("https://yachielab.github.io", 'https://yachie-lab.org') 
    window.location.href = currentUrl;
  }
}

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
  original_enElements.push(enElements[i].style.display);
}

var original_jaElements = [];
for (var i = 0; i < jaElements.length; i++) {
  original_jaElements.push(jaElements[i].style.display);
}

var original_zhElements = [];
for (var i = 0; i < zhElements.length; i++) {
  original_zhElements.push(zhElements[i].style.display);
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
  //console.log("hoge", scrollTimeout2);
  if (scrollTimeout2) {
      clearTimeout(scrollTimeout2);
    }

  var element = document.getElementById("languages");
  if (mainRect.top < header.clientHeight*(1-5/15)){
    element.style.position = 'fixed';
    element.style.top = "0";
    element.style.right  = "max(0px, calc((100% - 1920px) / 2))";
    element.style.zIndex = "3"
  }else{
    element.style.position = 'relative';
    element.style.top = "0";
    element.style.right = "0";
  }
  
  if (mainRect.top < 0) {
    EN.style.marginRight = "0";
    EN.style.borderRight = "1px solid #FFFFFF"; 
    JA.style.marginRight = "0";
    JA.style.borderRight = "1px solid #FFFFFF"; 
    element.style.background = "#FFFFFF00";
    //element.style.width  = "min(80vw, 1400px)";
    //element.style.height = "2.0em"; 
  } else {
    EN.style.marginRight = "1px";
    EN.style.borderRight = "0px solid #FFFFFF"; 
    JA.style.marginRight = "1px";
    JA.style.borderRight = "0px solid #FFFFFF"; 
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
        element.style.zIndex = "3";
      }
    }, 10);
}

function scrollImg() { 
  vw = window.innerWidth;
  vh = window.innerHeight;
  mainRect   = main.getBoundingClientRect();
  if(mainRect.top > 0){
    var scrlh = 2.0 * (header.clientHeight - mainRect.top);
    container.style.backgroundPosition = `top calc(calc(-1.211 * min(0.25 * 1920px, 25vw)) - ${scrlh}px) right 50%`;
  };

  if(-1*mainRect.top + vh > main.clientHeight){
    var scrlf = (-1*mainRect.top + vh - main.clientHeight) * (Math.min(1920, 1.0 * vw) - footer.clientHeight) / footer.clientHeight;  
    footer.style.backgroundPosition = `bottom calc(${scrlf}px - calc(min(1920px, 100vw) - ${footer.clientHeight}px)) right 50%`;
  }
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
    //console.log(mainRect.top, mainRect.bottom, asideRect.bottom);
    var flmg = Math.min(0.01*vw, 1920 * 0.01);
    var headMenuHeight = Math.min(0.15*vw, 1920 * 0.15) 
    var bmg = headMenuHeight * (1-5/15) - logoOriginalHeight - flmg;
    var sidebarHeight = sidebar.clientHeight;
    var mainHeight = main.clientHeight;
    //console.log(aside.style.top, logoOriginalHeight, flmg, vw);
    //if (rect.top < 0) {
    //  aside.style.position = 'fixed';
    //} else {
    //  aside.style.position = 'absolute';
    //}
   
    if (mainRect.top < header.clientHeight*(1-5/15)) {
      frontElement.style.position = 'fixed';
      frontElement.style.top = "0";
      backElement.style.position = 'fixed';
      backElement.style.top = "0";
      frontElement.style.left = "max(0px, calc((100% - 1920px) / 2))";
      backElement.style.left  = "max(0px, calc((100% - 1920px) / 2))";
      
      //console.log(frontElement.width, frontElement.height, logoOriginalWidth, logoOriginalHeight);
      //frontElement.style.height = logoOriginalHeight;
      //backElement.style.height  = logoOriginalHeight;
      //frontElement.style.width  = logoOriginalWidth;
      //backElement.style.width   = logoOriginalWidth;
      //console.log(frontElement.width, frontElement.height, logoOriginalWidth, logoOriginalHeight);
      //console.log(hogehoge);

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

EN.addEventListener('click', setEN);
JA.addEventListener('click', setJA);
ZH.addEventListener('click', setZH);

pplV_EN.addEventListener('click', add_param(pplV_EN, "UBC"));
pplV_JA.addEventListener('click', add_param(pplV_JA, "UBC"));
pplV_ZH.addEventListener('click', add_param(pplV_ZH, "UBC"));

pplO_EN.addEventListener('click', add_param(pplO_EN, "Osaka"));
pplO_JA.addEventListener('click', add_param(pplO_JA, "Osaka"));
pplO_ZH.addEventListener('click', add_param(pplO_ZH, "Osaka"));

mpplV_EN.addEventListener('click', add_param(mpplV_EN, "UBC"));
mpplV_JA.addEventListener('click', add_param(mpplV_JA, "UBC"));
mpplV_ZH.addEventListener('click', add_param(mpplV_ZH, "UBC"));

mpplO_EN.addEventListener('click', add_param(mpplO_EN, "Osaka"));
mpplO_JA.addEventListener('click', add_param(mpplO_JA, "Osaka"));
mpplO_ZH.addEventListener('click', add_param(mpplO_ZH, "Osaka"));

window.addEventListener('scroll', checkLangPosition);
window.addEventListener('resize', checkLangPosition);

if (isSafari()) {
  throttleTime = 4;
}else{
  throttleTime = 2; 
}

window.addEventListener('scroll', checkLogoPosition);
window.addEventListener('resize', checkLogoPosition);

if (vw > 700){
  window.addEventListener('scroll', scrollImg);
} 

window.addEventListener('orientationchange', function() {
    location.reload();
});

breakpoint.addEventListener("change", () => {
  window.location.reload();
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

