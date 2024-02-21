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
      enElements[i].style.display = original_enElements[i];
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
}

function setmJA(){ 
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
      jaElements[i].style.display = original_jaElements[i];
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
}

function setmZH(){
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
      zhElements[i].style.display = original_zhElements[i];;
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
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function operatemenu() {
  vw  = window.innerWidth;
  console.log(opened);
  if (opened){
    for (let i = 0; i < 41; i++) {
      await sleep(1);
      menu.style.height=String(height-i*height/(41-1)) + "px";
    }
    menu.style.visibility = "hidden";
    opened = false; 
  } else {
    menu.style.visibility = "visible";
    menu.style.display="flex";
    for (let i = 0; i < 76; i++) {
      await sleep(1);
      menu.style.height=String(i*height/75) + "px";
    }
    opened = true
  }
}

//if (params.has('lang') === true) {
//  const lang = params.get('lang');
//  if(lang === "EN"){
//    setmEN();
//  } else if(lang === "JA"){
//    setmJA();
//  } else if(lang === "ZH"){
//    setmZH();
//  }
//} else {
//  setmEN();
//}

menuIcon.addEventListener('click', operatemenu);
mEN.addEventListener('click', setmEN);
mJA.addEventListener('click', setmJA);
mZH.addEventListener('click', setmZH);

