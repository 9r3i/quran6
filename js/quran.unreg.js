/* quran.unreg.js
 , ~ unreg script for the 6th generation of quran app
 , authored by 9r3i
 , https://github.com/9r3i
 , started at december 21st 2017 */
var W,D;

/* onDeviceReady */
function onDeviceReady(){
/* other global variables */
window.FONT_SIZE='normal';   /* for font-size (normal is default) */
window.SPLASH_TIMEOUT=null;  /* for splash message time-out resource */
window.INDEX=gebi('index');  /* main element of index id */
window.MENU=gebi('leftbar-menu'); /* for leftbar-menu */
window.BB=gebi('bodybar');   /* for bodybar element */
window.RBAR=gebi('rightbar-content'); /* for rightbar-content */
window.LICENSED=false;       /* licensed */
window.CALLBACK='https://sabunjelly.com/api/quran/callback.php'; /* callback URI */
window.USER_EMAIL=null;      /* for user email */
window.USER_TOKEN=null;      /* for user token */
window.WEBVIEW_VERSION=61; /* webview version */
window.OS_VERSION=deviceData().version; /* android os version */
window.TEMP_PHONE=null;      /* temporary phone number */
window.NOTIF=null;           /* for notification */


/* get email and token */
window.USER_EMAIL=getCookie('user-email');
window.USER_TOKEN=getCookie('user-token');

/* get phone number from cookie */
window.TEMP_PHONE=getCookie('temp-phone');

/* android status bar */
if(window.StatusBar){
  StatusBar.backgroundColorByHexString('#ccb');
  StatusBar.show();
}
/* android fullscreen */
if(window.AndroidFullScreen){
  AndroidFullScreen.showUnderStatusBar(function(){
    if(window.StatusBar){StatusBar.show();}
  },function(e){
    splash('Error: '+e);
  });
}

/* android webview version checking */
if(window.plugins&&plugins.webViewChecker){
  plugins.webViewChecker.getWebViewVersion().then(function(v){
    WEBVIEW_VERSION=v;
    if(parseInt(v,10)<parseInt('61.0.3163.98',10)){
      return webviewAlert();
    }
  }).catch(function(e){
    WEBVIEW_VERSION=false;
    alertX('Error: Some requirement is missing.',null,'Warning!');
  });
}

/* android notification */
if(window.hasOwnProperty('cordova')&&cordova.plugins&&cordova.plugins.notification){
  NOTIF=cordova.plugins.notification;
}

/* initializing */
return initUnreg();

}/* end of onDeviceReady */

/* initial unregistered moment */
function initUnreg(){
  if(!checkOS()){osAlert();}
  if(!USER_TOKEN.toString().match(/^[a-zA-Z0-9]{16}$/g)){
    document.addEventListener("backbutton",function(e){
      e.preventDefault();
      return quitApp();
    },false);
    return loadActivationPage_name();
  }
  loader('Authentication...');
  if(typeof quranStartExecute==='function'){
    return quranStartExecute();
  }
  var op=new fs();
  if(!op.on){
    W.post('js/quran.js',function(r){
      return loadScriptFromString(r);
    });return;
  }
  var file=op.iappfiles+'quran.js';
  op.read(file,0,null,function(r){
    return loadScriptFromString(r);
  },function(e){
    setCookie('user-token','');
    setTimeout(function(e){W.location.reload();},2000);
  });
}
/* activation page - [base] */
function loadActivationPage(){
  return loadActivationPage_name();
}
/* activation page - Name */
function loadActivationPage_name(){
  INDEX=gebi('index');
  INDEX.style.margin='50px 50px';
  INDEX.style.border='1px solid #bbb';
  INDEX.style.boxShadow='0px 0px 5px 3px #999';
  hideStatusBarFullScreen();
  BB=gebi('bodybar');
  BB.style.top='0px';
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Aktifasi</div>'
    +'<div id="headfix">Aktifasi</div>'
    +'<div class="each" style="background-color:#fff;"><div class="input-text" id="input-email-act">'
    +'<div class="label"><label for="token" class="ayat-text-'+FONT_SIZE+'">Nama</label></div>'
    +'<input class="input-clean" type="text" id="token" placeholder="Masukan nama" />'
    +'</div><div style="text-align:center;">'
    +'<input class="submit-load-ayat" type="submit" value="Aktifkan" id="activate-button" />'
    +'</div></div>';
  INDEX.innerHTML=html;
  inputText('input-email-act');
  var input=gebi('token');
  var ab=gebi('activate-button');
  if(input&&ab){
    ab.onclick=function(e){
      if(input.value.trim()==''||!input.value.toString().match(/\w+/ig)){
        return splash('Error: Nama tidak valid.');
      }
      return confirmX('Nama tidak akan dapat diubah lagi. Dan aktifasi ini bersifat permanen.'
        +'\r\n\r\nApakah sudah yakin?',function(yes){
        if(!yes){return;}
        return loadTerms(function(){
          return activateByName(input.value.trim());
        },function(){return loadActivationPage_name();});
      },'Perhatian!','Ya','Tidak');
    };
  }
}
/* activate using name */
function activateByName(name){
  var formdata=deviceData();
  formdata['email']=name;
  formdata['activate']='name';
  formdata['token']=activationCodeName();
  loader('Activating...');
  W.post(CALLBACK,function(r){
    loader(false);
    if(r.toString().match(/^error/ig)){
      if(r=='Error: Require payment.'){
        alertX('Anda belum melakukan pembayaran.\nSilahkan melakukan pembayaran terlebih dahulu.',null,'Perhatian!');
      }else if(r=='Error: You are suspended.'){
        alertX('Layanan dihentikan sementara waktu.\nSilahkan hubungi penyedia layanan aplikasi ini untuk mengaktifkan kembali.',null,'Peringatan!');
      }alertX(r,null,'Warning!');
      return loadActivationPage_name();
    }
    if(!r.token||!r.email){return splash('Unknown error.');}
    setCookie('user-token',r.token,365*7);
    setCookie('user-email',r.email,365*7);
    if(NOTIF){NOTIF.local.schedule({
      title:'Aktivasi berhasil.',
      text:'Selamat, semoga bermanfaat.',
      icon:'res://icon',
      smallIcon:'res://iconi'
    });}
    var op=new fs();
    if(op.on){
      loader('Installing...<br />[9r3i Private License]');
      var file=op.iappfiles+'quran.js';
      op.write(file,r.script,0,function(r){
        setTimeout(function(e){W.location.reload();},1100);
      },function(e){
        setTimeout(function(e){W.location.reload();},1100);
      });return;
    }
    loader('Starting...');
    setTimeout(function(e){W.location.reload();},2000);
  },formdata);
}
/* check os version */
function checkOS(){
  return parseInt(OS_VERSION,10)>=parseInt('6.0',10)?true:false;
}
/* load term of services */
function loadTerms(yes,no){
  INDEX=gebi('index');
  INDEX.style.margin='30px';
  INDEX.style.border='1px solid #bbb';
  INDEX.style.boxShadow='0px 0px 5px 3px #999';
  hideStatusBarFullScreen();
  BB=gebi('bodybar');
  BB.style.top='0px';
  var html='<div class="each-header">Term of Services</div>'
    +'<div class="each about">'
    +'<h2 style="text-align:center;margin-top:10px;">Ketentuan Utama</h2>'
    +'<p>Aplikasi ini adalah aplikasi pribadi, kami menggunakan <em>Private License</em>. Dan aplikasi ini hanya diperuntukan dalam fungsi pribadi atau lingkup <em>Private</em> saja. Pengguna hanya diijinkan menggunakan saja.</p>'
    +'<p>Aplikasi ini tidak boleh diperjual-belikan, tidak boleh didistribusikan dan tidak boleh pula dimodifikasi tanpa seijin 9r3i. Sesuai dengan ketentuan yang telah tertulis pada <em>License</em> aplikasi ini.</p>'
    +'<p>Jika terjadi kesalahan atau <em>error</em> pada aplikasi ini, pengguna tidak berhak memodifikasi sendiri. Pengguna hanya berhak melaporkan kesalahan tersebut kepada pihak kami, sehingga kami dapat memperbaikinya sesegera mungkin.</p>'
    +'<p>Bagi pengguna yang melanggar ketentuan ini, kami berhak menghentikan layanan aplikasi ini kapan saja. Dan pengguna rela diproses secara hukum yang berlaku.</p>'
    +'<p>Ketentuan ini dapat berubah kapan saja, tanpa pemberitahuan terlebih dahulu.</p>'
    +'<p>Tekan setuju untuk melanjutkan aktifasi.</p>'
    +'</div><div style="text-align:center;">'
    +'<input class="submit-load-ayat" type="submit" value="Setuju" id="agree-button" />'
    +'<input class="submit-load-ayat" type="submit" value="Tidak Setuju" id="not-agree-button" />'
    +'</div></div>';
  INDEX.innerHTML=html;
  var ab=gebi('agree-button');
  var nb=gebi('not-agree-button');
  if(!ab||!nb){return;}
  yes=typeof yes==='function'?yes:function(){};
  no=typeof no==='function'?no:function(){};
  ab.onclick=yes;
  nb.onclick=no;
}
/* hide status bar after fullscreen */
function hideStatusBarFullScreen(){
  if(window.AndroidFullScreen){
    AndroidFullScreen.showUnderStatusBar(function(){
      if(window.StatusBar){StatusBar.hide();}
    },function(e){});
  }return false;
}
/* show status bar after fullscreen */
function showStatusBarFullScreen(){
  if(window.AndroidFullScreen){
    AndroidFullScreen.showUnderStatusBar(function(){
      if(window.StatusBar){StatusBar.show();}
    },function(e){});
  }return false;
}
/* splash message */
function splash(str,t){
  if(typeof str!=='string'){return;}
  var id='splash';
  var div=gebi(id);
  if(div){div.parentElement.removeChild(div);}
  if(SPLASH_TIMEOUT){clearTimeout(SPLASH_TIMEOUT);}
  var div=ce('div');
  div.id=id;
  div.setAttribute('class','splash');
  if(str.match(/[\u0600-\u06ff]/ig)){
    div.style.fontFamily='Traditional Arabic';
    div.style.fontSize='200%';
  }else{
    div.style.width='auto';
  }
  div.innerText=str;
  div.style.left='-100%';
  D.body.appendChild(div);
  var dw=div.offsetWidth/2;
  div.style.left='calc(50% - '+dw+'px)';
  if(div){div.oncontextmenu=function(e){
    e.preventDefault();
    e.stopPropagation();
    e.cancelBubble=true;
    return false;
  };}
  var tt=t?(t*1000):3000;
  SPLASH_TIMEOUT=setTimeout(function(e){
    var div=gebi(id);
    div.style.top='-100%';
    setTimeout(function(e){
      if(div.parentElement){div.parentElement.removeChild(div);}
    },1500);
  },tt);
}
/* input text animation */
function inputText(id){
  var it=gebi(id);
  if(!it){return;}
  var il=it.children[0];
  var ic=it.children[1];
  if(!ic||!il){return;}
  var ph=ic.placeholder;
  ic.placeholder='';
  if(ic.value!==''||!ic.validity.valid){
    ic.setAttribute('class','input-dirty');
    il.style.top='0px';
    il.style.left='0px';
    il.style.position='relative';
    il.children[0].style.color='#7b3';
    il.children[0].style.textWeight='bold';
    ic.placeholder=ph;
  }
  ic.onfocus=function(e){
    il.style.top='0px';
    il.style.left='0px';
    il.style.position='relative';
    il.children[0].style.color='#7b3';
    il.children[0].style.textWeight='bold';
    ic.placeholder=ph;
  };
  ic.onblur=function(e){
    if(ic.value!==''||!ic.validity.valid){return;}
    il.style.top='20px';
    il.style.left='20px';
    il.style.position='absolute';
    il.children[0].style.color='#999';
    il.children[0].style.textWeight='normal';
    ic.placeholder='';
  };
  ic.onchange=function(e){
    ic.setAttribute('class','input-'+(!ic.validity.valid||ic.value!==''?'dirty':'clean'));
  };
}
/* load script from string */
function loadScriptFromString(s){
  if(typeof s!=='string'){return;}
  var j=document.createElement('script');
  j.type='text/javascript';
  j.async=true;j.innerText=s;
  document.head.appendChild(j);
}
/* quit from app */
function quitApp(){
  if(typeof menuHide==='function'){menuHide();}
  if(!navigator.app||typeof navigator.app.exitApp!=='function'){
    var err='Error: Some requirement is missing.';
    console.log(err);
    splash(err);
    return;
  }
  if(typeof confirmX!=='function'){
    var con=confirm('Keluar dari aplikasi?');
    if(con){navigator.app.exitApp();}
    return;
  }
  confirmX('Keluar dari aplikasi?',function(yes){
    if(yes){
      return navigator.app.exitApp();
    }else{BACK=false;}
  },'Konfirmasi','Ya','Tidak');
}
/* webview alert */
function webviewAlert(){
  var text='Please, upgrade Android System WebView to version 61 or higher.';
  var market='market://details?id=com.google.android.webview';
  return alertX(text,function(d,b,dh,db,df,but){
    db.innerHTML='Aplikasi ini membutuhkan:<br />'
      +'<span style="color:red;">Android System WebView</span>'
      +'<br />Versi 61 keatas.<br />Install sekarang?';
    var bc=ce('button');
    bc.id='install-button';
    bc.innerText='Install';
    bc.classList.add('alert-button');
    df.appendChild(bc);
    bc.onclick=function(e){
      if(d){d.parentElement.removeChild(d);}
      if(b){b.parentElement.removeChild(b);}
      W.open(market,'_blank');
    };
  },'Peringatan!','Cancel');
}
/* device data */
function deviceData(){
  var d=window.device?window.device:{},r={
    "platform":d.platform?d.platform:"unknown",
    "version":d.version?d.version:"6.0",
    "uuid":d.uuid?d.uuid:getDeviceID(),
    "model":d.model?d.model:"UNKNOWN",
    "manufacturer":d.manufacturer?d.manufacturer:"unknown",
    "serial":d.serial?d.serial:getSerialID()
  };return r;
}
/* get serial id */
function getSerialID(){
  var sid=(Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2)).toUpperCase().substr(-12);
  var did=getCookie('SERIAL_ID');
  if(window.device&&window.device.serial){sid=window.device.serial;}
  else if(did){sid=did;}
  setCookie('SERIAL_ID',sid,(365*17));
  return sid;
}
/* get divice id */
function getDeviceID(){
  var uid=(Math.random().toString(16).substr(2)+Math.random().toString(16).substr(2)).substr(-16);
  var did=getCookie('DEVICE_ID');
  if(window.device&&window.device.uuid){uid=window.device.uuid;}
  else if(did){uid=did;}
  setCookie('DEVICE_ID',uid,(365*17));
  return uid;
}
/* confirmX [require: alertX function] */
function confirmX(s,cb,h,ok,no){
  h=typeof h==='string'?h:'Confirm';
  no=typeof no==='string'?no:'Cancel';
  return alertX(s,function(a,bg,head,body,foot,but){
    var bc=ce('button');
    bc.id='cancel-button';
    bc.innerText=no;
    bc.classList.add('alert-button');
    foot.appendChild(bc);;
    var cancel=gebi('cancel-button');
    if(cancel){cancel.onclick=function(e){
      var d=gebi('alert');
      var b=gebi('alert-bg');
      if(d){d.parentElement.removeChild(d);}
      if(b){b.parentElement.removeChild(b);}
      return typeof cb==='function'?cb(false):false;
    };}
    if(but){but.onclick=function(e){
      var d=gebi('alert');
      var b=gebi('alert-bg');
      if(d){d.parentElement.removeChild(d);}
      if(b){b.parentElement.removeChild(b);}
      return typeof cb==='function'?cb(true):false;
    };}
  },h,ok);
}
/* ----- ALERT [require: header.js] ----- */
function alertX(s,cb,h,ok){
  var d=gebi('alert');
  var b=gebi('alert-bg');
  if(d){d.parentElement.removeChild(d);}
  if(b){b.parentElement.removeChild(b);}
  var d=ce('div');
  var b=ce('div');
  d.id='alert';
  b.id='alert-bg';
  s=typeof s==='string'?s:'';
  h=typeof h==='string'?h:'Alert';
  ok=typeof ok==='string'?ok:'OK';
  d.innerHTML='<div id="alert-header"></div><div id="alert-body"></div>'
    +'<div id="alert-footer"><button class="alert-button" id="alert-button"></button></div>';
  D.body.appendChild(b);
  D.body.appendChild(d);
  var d=gebi('alert');
  var b=gebi('alert-bg');
  var dh=gebi('alert-header');
  var db=gebi('alert-body');
  var df=gebi('alert-footer');
  var but=gebi('alert-button');
  if(dh){dh.innerText=h;}
  if(db){db.innerText=s;}
  if(but){but.innerText=ok;}
  if(d){d.oncontextmenu=function(e){
    e.preventDefault();
    e.stopPropagation();
    e.cancelBubble=true;
    return false;
  };}
  if(b){b.oncontextmenu=function(e){
    e.preventDefault();
    e.stopPropagation();
    e.cancelBubble=true;
    return false;
  };}
  if(but){but.onclick=function(e){
    var d=gebi('alert');
    var b=gebi('alert-bg');
    if(d){d.parentElement.removeChild(d);}
    if(b){b.parentElement.removeChild(b);}
  };}
  if(typeof cb==='function'){
    var d=gebi('alert');
    var b=gebi('alert-bg');
    return cb(d,b,dh,db,df,but);
  }
}
/* email validation */
function isEmail(e){
  var r=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return r.test(e);
}
/* new loading view - loader-171229 - require nothing */
function loader(text){
  var id='loader-171229';
  var lp=document.getElementById(id);
  if(lp){
    if(text&&lp.childNodes[2]){
      lp.childNodes[2].innerHTML=text;
      return;
    }else{lp.parentElement.removeChild(lp);}
  }if(!text){return;}
  var ld=document.createElement('div');
  ld.setAttribute('style','position:fixed;width:0px;height:0px;top:50%;left:50%;z-index:1000;');
  ld.id=id;
  var bg='<div style="background-color:#fff;opacity:0.8;position:fixed;width:100%;height:100%;'
    +'top:0px;left:0px;right:0px;bottom:0px;margin:0px;padding:0px;z-index:1001;"></div>';
  var image='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjY2NjIj4KICA8cGF0aCBvcGFjaXR5PSIuMjUiIGQ9Ik0xNiAwIEExNiAxNiAwIDAgMCAxNiAzMiBBMTYgMTYgMCAwIDAgMTYgMCBNMTYgNCBBMTIgMTIgMCAwIDEgMTYgMjggQTEyIDEyIDAgMCAxIDE2IDQiLz4KICA8cGF0aCBkPSJNMTYgMCBBMTYgMTYgMCAwIDEgMzIgMTYgTDI4IDE2IEExMiAxMiAwIDAgMCAxNiA0eiI+CiAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCAxNiAxNiIgdG89IjM2MCAxNiAxNiIgZHVyPSIwLjhzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L3BhdGg+Cjwvc3ZnPgoK';
  var img='<div style="margin:-70px 0px 0px 0px;padding:0px;left:0px;width:100%;height:32px;'
    +'line-height:32px;vertical-align:top;text-align:center;font-family:Tahoma,consolas,monospace;'
    +'color:#777;font-size:13px;z-index:1002;position:fixed;">'
    +'<img src="'+image+'" width="32px" height="32px" style="width:32px;height:32px;" /></div>';
  var ct='<div style="margin:-35px 0px 0px 0px;padding:0px;left:0px;width:100%;height:50px;cursor:default;'
    +'line-height:15px;vertical-align:top;text-align:center;font-family:inherit,Tahoma,consolas,monospace;'
    +'color:#777;font-size:13px;z-index:1002;position:fixed;">'+text+'</div>';
  ld.innerHTML=bg+img+ct;
  document.body.appendChild(ld);
  return ld.childNodes[2];
}
/* valid phone number - default: +62 */
function validPN(s){
  if(typeof s==='string'){
    s=s.match(/^08/g)?'+62'+s.substr(1):s;
    return s.match(/^\+\d{11,14}$/g)?s:false;
  }return false;
}
/* permission x -- require: cordova */
function perm(pr,cb,er){
  cb=typeof cb==='function'?cb:function(){};
  er=typeof er==='function'?er:function(){};
  if(!window.hasOwnProperty('cordova')||!cordova.plugins.permissions){
    return er('Error: Some requirement is missing.');
  }var prm=cordova.plugins.permissions;
  if(!prm.hasOwnProperty(pr)){return er('Error: Permission is not found.');}
  prm.requestPermission(prm[pr],function(r){
    if(r.hasPermission){return cb(true);}
    return er('Error: Failed to get permission.');
  },function(){
    return er('Error: Failed to request permission.');
  });
}
/* activation code */
function activationCode(){
  var s=(new Date()).getTime().toString();
  if(!s.match(/^[a-f0-9]+$/ig)){return '9r3WildToken';}
  var r=[],i=0,t='9',u=[],b=null;
  while(s.substr(i,2)){
    r.push(String.fromCharCode('0x'+s.substr(i,2)));i+=2;
  }b=btoa(r.join('')).replace(/[^a-z0-9]/ig,'');
  t+=b.length<11?'0'.repeat(11-b.length)+b:b.substr(-11);
  for(var i=0;i<3;i++){
    u.push(t.substr(-12).substr((i*4),4));
  }return 'SMS-'+u.join('-');
}
/* activation code name */
function activationCodeName(){
  var s=(new Date()).getTime().toString();
  if(!s.match(/^[a-f0-9]+$/ig)){return '9r3WildToken';}
  var r=[],i=0,t='9',u=[],b=null;
  while(s.substr(i,2)){
    r.push(String.fromCharCode('0x'+s.substr(i,2)));i+=2;
  }b=btoa(r.join('')).replace(/[^a-z0-9]/ig,'');
  t+=b.length<11?'0'.repeat(11-b.length)+b:b.substr(-11);
  for(var i=0;i<3;i++){
    u.push(t.substr(-12).substr((i*4),4));
  }return 'NAME-'+u.join('-');
}
/* os alert */
function osAlert(){
  var market='market://details?id=com.google.android.webview';
  return alertX('',function(d,b,dh,db,df,but){
    db.innerHTML='Aplikasi ini membutuhkan sistem operasi Android versi 6.0 keatas.<br />'
      +'Android anda versi <span style="color:red;">'+OS_VERSION+'</span>'
      +'<br />Tetap lanjutkan?';
    var bc=ce('button');
    bc.id='install-button';
    bc.innerText='Keluar';
    bc.classList.add('alert-button');
    df.appendChild(bc);
    bc.onclick=function(e){
      if(d){d.parentElement.removeChild(d);}
      if(b){b.parentElement.removeChild(b);}
      if(navigator.app&&typeof navigator.app.exitApp==='function'){
        return navigator.app.exitApp();
      }return splash('Error: Some requirement is missing.');
    };
  },'Peringatan!','Lanjutkan');
}


