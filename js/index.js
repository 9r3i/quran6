/* check the cordova */
if(typeof cordova==='undefined'){onDeviceReady();}else{
  /* event-listener on deviceready */
  document.addEventListener('deviceready',onDeviceReady,false);
}
/* load quran.unreg.js - on-device-ready */
function onDeviceReady(){load_script('js/quran.unreg.js');}
