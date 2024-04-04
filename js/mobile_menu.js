const menu     = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const mEN = document.getElementById('mobileEN');
const mJA = document.getElementById('mobileJA');
const mZH = document.getElementById('mobileZH');
const mmc = document.getElementById("mobile-menu-content"); 
let mENisReplaced = false;
let mJAisReplaced = false;
let mZHisReplaced = false;
let opened = false
vw = window.innerWidth;
let height = mmc.clientHeight + 0.1*vw

function setmEN(){
  LANG = "EN";
  if (mENisReplaced===false) {
    mEN.style.fontWeight   = '700';
    mEN.style.color = '#CD853F';
    mJA.style.fontWeight   = '100';
    mJA.style.color = '#BBBBBB';
    mZH.style.fontWeight   = '100';
    mZH.style.color = '#BBBBBB';
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
    mENisReplaced = true;
    mJAisReplaced = false;
    mZHisReplaced = false;
    updateLinksForLanguage("EN");
    height = mmc.clientHeight + 0.1*vw;
    menu.style.height = height;
  } else {
    null;
  }
  ubcElements   = Array.from(document.getElementsByClassName('UBC English')).concat(Array.from(document.getElementsByClassName('UBC Common')));
  primeElements = Array.from(document.getElementsByClassName('Osaka English')).concat(Array.from(document.getElementsByClassName('Osaka Common')));
}

function setmJA(){ 
  LANG = "JA";
  if (mJAisReplaced===false) {
    mEN.style.fontWeight   = '300';
    mEN.style.color = '#BBBBBB';
    mJA.style.fontWeight   = '600';
    mJA.style.color = '#CD853F';
    mZH.style.fontWeight   = '100';
    mZH.style.color = '#BBBBBB';
    for (var i = 0; i < enElements.length; i++) {
      enElements[i].style.display = "none";
    } 
    for (var i = 0; i < zhElements.length; i++) {
      zhElements[i].style.display = "none";
    }
    for (var i = 0; i < jaElements.length; i++) {
      if(intersection(jaElements[i].className.split(' '), AFFILS).length > 0){
        jaElements[i].style.display = original_jaElements[i];
      }
    }
    mENisReplaced = false;
    mJAisReplaced = true;
    mZHisReplaced = false;
    updateLinksForLanguage("JA");
    height = mmc.clientHeight + 0.1*vw;
    menu.style.height = height; 
  } else {
    null; 
  }
  ubcElements   = Array.from(document.getElementsByClassName('UBC Japanese')).concat(Array.from(document.getElementsByClassName('UBC Common')));
  primeElements = Array.from(document.getElementsByClassName('Osaka Japanese')).concat(Array.from(document.getElementsByClassName('Osaka Common')));
}

function setmZH(){
  LANG = "ZH";
  if (mZHisReplaced===false) {
    mEN.style.fontWeight   = '300';
    mEN.style.color = '#BBBBBB';
    mJA.style.fontWeight   = '100';
    mJA.style.color = '#BBBBBB';
    mZH.style.fontWeight   = '600';
    mZH.style.color = '#CD853F';
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
    mENisReplaced = false;
    mJAisReplaced = false;
    mZHisReplaced = true;
    updateLinksForLanguage("ZH");
    height = mmc.clientHeight + 0.1*vw;
    menu.style.height = height; 
  } else {
    null; 
  }
  ubcElements   = Array.from(document.getElementsByClassName('UBC Chinese')).concat(Array.from(document.getElementsByClassName('UBC Common')));
  primeElements = Array.from(document.getElementsByClassName('Osaka Chinese')).concat(Array.from(document.getElementsByClassName('Osaka Common'))); 
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function operatemenu() {
  var pathname = window.location.pathname;
  var mobileHeader = document.getElementById('mobile_header');
  var imgInHeader = document.querySelector('#mobile_header img');
  console.log(imgInHeader);
  vw  = window.innerWidth; 
  var duration = 60;
  console.log(opened);
  if (opened){
    for (let i = 0; i < duration; i++) {
      await sleep(1);
      menu.style.height=String(height-i*height/(duration-1)) + "px";
    }
    menu.style.visibility = "hidden";
    mobileHeader.style.background = "#FFFFFFEF";
    if(pathname.includes("index.html") || pathname === '/'){
      imgInHeader.style.opacity = 0.0;
    }else{
      imgInHeader.style.display = "block";
    }
    opened = false; 
  } else {
    mobileHeader.style.background = "#FFFFFF00";
    imgInHeader.style.display = "none";
    menu.style.visibility = "visible";
    menu.style.display="flex";
    for (let i = 0; i < duration; i++) {
      await sleep(1);
      menu.style.height=String(i*height/(duration-1)) + "px";
    }
    opened = true
  }
}

if(vw <= 600){
  if (params.has('lang') === true) {
    const lang = params.get('lang');
    if(lang === "EN"){
      setmEN();
    } else if(lang === "JA"){
      setmJA();
    } else if(lang === "ZH"){
      setmZH();
    }
  } else {
    setmEN();
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
}

menuIcon.addEventListener('click', operatemenu);
mEN.addEventListener('click', setmEN);
mJA.addEventListener('click', setmJA);
mZH.addEventListener('click', setmZH);

