/* check for the cordova */
if(typeof cordova==='undefined'){
  onDeviceReady();
}else{
  /* event-listener on deviceready */
  document.addEventListener('deviceready',onDeviceReady,false);
}
