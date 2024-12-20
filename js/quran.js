/* quran.js
 , ~ the 6th generation of quran app
 , authored by 9r3i
 , https://github.com/9r3i
 , started at november 22nd 2017 */
var W,D;


/* quranStartExecute */
function quranStartExecute(){

/* ========== THIS POINT IS FOR DEVELOPER ONLY ========== */

/* ----- setup database host ----- */
window.HOST='./'; /* database host */
/* setup database directory */
window.DBDIR='database/';      /* a valid database directory */
window.TDIR=DBDIR+'tafsirdb/'; /* a valid tafsir database directory */
window.QDIR=DBDIR+'qurandb/';  /* a valid quran database directory */
/* ----- end of setup ----- */

/* ========== DO NOT CHANGE ANYTHING FROM THIS POINT ========== */

/* define APP_VERSION and APK_VERSION */
window.APP_VERSION='1.2.2.211229'; /* final version */
window.APK_VERSION=null;

/* 
  CONFIG is for configuration
  DB     is for quran database index
  TDB    is for tafsir database index
  HIS    is for history
  BOOK   is for bookmark
*/
window.CONFIG={};
window.DB=[];
window.TDB=[];
window.BOOK=[];
window.HIS=[];

/* other global variables */
window.FONT_SIZE='normal';   /* for font-size (normal is default) */
window.MENU_TOUCH=null;      /* for leftbar menu if touch is exist */
window.SPLASH_TIMEOUT=null;  /* for splash message time-out resource */
window.IS_LOADING=false;     /* for scroll loading, tell if data is loading */
window.BANK={DB:{},TDB:{}};  /* temporary storage for database */
window.LOADED_AYAT=0;        /* for loaded ayat */
window.OPENED_SURAH=null;    /* for opened surah */
window.SEARCH_TAFSIR=false;  /* for searching words in tafsir */
window.LICENSED=false;       /* licensed */
window.WELCOMED=false;       /* welcome word (bismillah) */
window.AUDIO_HOST='https://verses.quran.com/'; /* audio host; Alafasy,Rifai */
window.CALLBACK='https://sabunjelly.com/api/quran/callback.php'; /* callback URI */
window.USER_EMAIL=null;      /* for user email */
window.USER_TOKEN=null;      /* for user token */
window.AUDIO_REPEAT=0;       /* for audio repeat */
window.AUDIO_WAIT=0;         /* for audio waiting for loadSurahX done */
window.AUDIO_RES=null;       /* for audio resource */
window.DOWNLOAD=null;        /* for download resource */
window.SIP_ID=0;             /* for search in the page id */
window.IMAGE_HOST='https://raw.githubusercontent.com/9r3i/quran-mushaf/master/ayat/'; /* host of image ayat */
window.IPAGE_HOST='https://raw.githubusercontent.com/9r3i/quran-mushaf/master/mushaf/'; /* host for image page */
window.IPAGE=null;           /* for image page index */
window.IPAGE_TOUCH=false;    /* for image page touch start */
window.INIT_CHECK=false;     /* initial database check */
window.WEBVIEW_VERSION=61;   /* webview version */
window.MATRIX_INTERVAL=null; /* matrix interval */


/* setup menu */
window.menu=[
  {"href":"loadIndexQuran()","title":"Daftar Surah","name":"Daftar Surah","icon":"list-alt","color":"#555"},
  {"href":"loadTafsirPage()","title":"Tafsir","name":"Tafsir","icon":"book","color":"#555"},
  {"href":"loadMushafFormPage()","title":"Mushaf","name":"Mushaf","icon":"file-text-o","color":"#555"},
  {"href":"loadSearchPage()","title":"Pencarian","name":"Pencarian","icon":"search","color":"#555"},
  {"href":"loadBookPage()","title":"Penandaan","name":"Penandaan","icon":"star","color":"#f93"},
  {"separator":true},
  {"href":"searchInPage()","title":"Cari di Halaman","name":"Cari di Halaman","icon":"search","color":"#555"},
  {"href":"showJumpMenu()","title":"Loncat ke Ayat","name":"Loncat ke Ayat","icon":"fast-forward","color":"#555"},
  {"href":"loadSavedPages()","title":"Penyimpanan","name":"Penyimpanan","icon":"save","color":"#555"},
  {"separator":true},
  {"href":"loadSetting()","title":"Pengaturan","name":"Pengaturan","icon":"gears","color":"#555"},
  {"href":"loadAbout()","title":"Tentang","name":"Tentang","icon":"info-circle","color":"#555"},
  {"href":"loadDevice()","title":"Device","name":"Device","icon":"tablet","color":"#555"},
  {"href":"loadLicense()","title":"License","name":"License","icon":"university","color":"#555"},
  {"separator":true},
  {"href":"quitApp()","title":"Tutup","name":"Tutup","icon":"power-off","color":"#b33"}
];


window.INDEX=gebi('index');  /* main element of index id */
window.MENU=gebi('leftbar-menu'); /* for leftbar-menu */
window.BB=gebi('bodybar');   /* for bodybar element */
window.RBAR=gebi('rightbar-content'); /* for rightbar-content */

/* setup config */
window.CONFIG=prepConfig();

/* search in tafsir */
window.SEARCH_TAFSIR=getCookie('search-tafsir')=="true"?true:false;

/* setup bookmark */
window.BOOK=prepBookmark();

/* get email and token */
window.USER_EMAIL=getCookie('user-email');
window.USER_TOKEN=getCookie('user-token');

/* other prepare variables */
window.AUDIO_REPEAT=getCookie('audio-repeat');

/* W.post arguments: url,callback,data,unform,upload,download,header,error */
/* glyph_id|page_number|line_number|sura_number|ayah_number|position|min_x|max_x|min_y|max_y */

/* =-=-=-=-=-=-= initializing... =-=-=-=-=-=-= */

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

/* load initial base --- without cordova */
if(initCheckDB()){
  return initBase();
}

}/* end of quranStartExecute */


/* setup reminder notification */
function reminderNotification(){
  if(!NOTIF){return;}
  NOTIF.local.getAll(function(d){
    var i=d.length,def=[91,92,93,94,95],c=0;
    var defr={
      91:{hour:5,minute:15},
      92:{hour:12,minute:30},
      93:{hour:15,minute:45},
      94:{hour:18,minute:40},
      95:{hour:19,minute:50}
    };
    while(i--){
      if(d[i].id&&def.indexOf(d[i].id)>=0){c++;}
    }if(c==def.length){return;}
    for(var i in defr){
      NOTIF.local.schedule({
        id:i,
        trigger:{every:defr[i]},
        title:'Quran Reminder.',
        text:'Sudah baca Qur\'an hari ini?',
        icon:'res://icon',
        smallIcon:'res://iconi',
        attachments:['file://images/quran.png']
      });
    }
  });
}
/* load mushaf page - [BOOK] */
function loadMushafFormPage(){
  menuHide();
  if(!licensed()){return;}
  book('loadMushafFormPage',null,'Mushaf');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Mushaf</div>';
  html+='<div id="headfix">Mushaf</div>';
  html+='<div class="each-config" style="text-align:center;">'
    +'<select class="select" id="mus-surah"><option value="">Nama Surah</option></select>'
    +'<select class="select" id="mus-ayat"><option value="">0</option></select>'
    +'<div style="text-align:center;">'
    +'<input type="submit" class="submit-load-ayat" id="load-mushaf-start" value="Muat Mushaf" '
    +' style="margin:10px 0px 0px;" /></div>'
    +'</div>';
  html+='<div class="each-config" style="text-align:center;">'
    +'<select class="select" id="mus-pages"><option value="">Halaman</option></select>'
    +'<div style="text-align:center;">'
    +'<input type="submit" class="submit-load-ayat" id="load-mushaf-page" value="Muat Halaman" '
    +' style="margin:10px 0px 0px;" /></div>'
    +'</div>';
  INDEX.innerHTML=html;
  /* ----- starting of load mushaf ----- */
  var mus=gebi('mus-surah');
  var mua=gebi('mus-ayat');
  mus.style.marginRight='5px';
  mua.style.marginRight='5px';
  mus.style.float='none';
  mua.style.float='none';
  mus.style.width='auto';
  mua.style.width='auto';
  var temp='';
  for(var i in DB){
    temp+='<option value="'+DB[i].surah_number+'">'+DB[i].surah_number+'. '+DB[i].name+'</option>';
  }mus.innerHTML+=temp;
  mus.onchange=function(e){
    var sur=parseInt(this.value)-1;
    if(!DB[sur]){return;}
    var temp='';
    for(var i=0;i<DB[sur].total_ayat;i++){
      temp+='<option value="'+(i+1)+'">'+(i+1)+'</option>';
    }mua.innerHTML=temp;
  };
  var mustart=gebi('load-mushaf-start');
  mustart.onclick=function(e){
    if(!mus.value||!mua.value){return;}
    return loadMushaf(mus.value,mua.value);
  };
  var mup=gebi('mus-pages');
  var lmp=gebi('load-mushaf-page');
  if(mup&&lmp){
  var tm='';
  for(var i=1;i<605;i++){tm+='<option value="'+i+'">'+i+'</option>';}
  mup.style.float='none';
  mup.innerHTML+=tm;
  lmp.onclick=function(){
    if(mup.value==''){return;}
    return loadMushafPage(parseInt(mup.value));
  };}
}
/* load tafsir page - [BOOK] */
function loadTafsirPage(){
  menuHide();
  if(!licensed()){return;}
  book('loadTafsirPage',null,'Tafsir');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Tafsir</div>';
  html+='<div id="headfix">Tafsir</div>';
  html+='<div class="each-config">'
    +'<select class="select" id="cid"><option value="">Nama Surah</option></select>'
    +'<select class="select" id="tid"><option value="">-</option></select>'
    +'<div style="text-align:center;">'
    +'<input type="submit" class="submit-load-ayat" onclick="loadTafsirRB()" value="Muat Tafsir" '
    +' style="margin:10px 0px 0px;" /></div>'
    +'</div>';
  INDEX.innerHTML=html;
  /* ----- starting load tafsir index ----- */
  var cid=gebi('cid');
  var tid=gebi('tid');
  cid.style.float='none';
  tid.style.float='none';
  cid.style.width='100%';
  tid.style.width='100%';
  var temp='';
  for(var i in TDB){
    temp+='<option value="'+i+'">'+i+'. '+TDB[i].name+'</option>';
  }cid.innerHTML+=temp;
  cid.onchange=function(e){
    var temp='',val=parseInt(this.value);
    if(!TDB[val]){tid.innerHTML='<option value="">-</option>';return;}
    var part=TDB[val].part;
    var pcid=TDB[val].cid;
    for(var i in part){
      temp+='<option value="'+i+'">'+part[i].title+'</option>';
    }tid.innerHTML=temp;
  };
}
/* load saved pages - [BOOK] */
function loadSavedPages(){
  menuHide();
  if(!licensed()){return;}
  book('loadSavedPages',null,'Penyimpanan');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Penyimpanan Halaman</div>';
  html+='<div id="headfix">Penyimpanan Halaman</div>';
  INDEX.innerHTML=html;
  var op=new fs();
  if(!op.on){return splash('Error: Some requirement is missing.');}
  var dn=op.xroot+'9r3i/quran/saved/';
  op.dir(dn,function(d){
    var t=[];
    for(var i in d){if(d[i].isFile&&d[i].name.match(/\.xml$/g)){
      var name=d[i].name.replace(/\.xml$/g,'').replace(/\-/g,' ');
      t.push('<div class="each each-hover each-bookmark" onclick="readSavedFile(\''+d[i].name+'\')">'
      +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'+name+'</div></div>');
    }}var html=t.join('');
    if(t.length==0){
      html='<div class="each ayat-text-'+FONT_SIZE+'">Penyimpanan masih kosong.</div>';
    }INDEX.innerHTML+=html;
    
    
  },function(e){
    return splash('Error: Failed to scan saved pages.');
  });
}
/* read saved file xml */
function readSavedFile(f){
  var op=new fs();
  if(!op.on){return splash('Error: Some requirement is missing.');}
  var dn=op.xroot+'9r3i/quran/saved/';
  op.read(dn+f,0,null,function(s,r){
    var q=new qrn(),t=q.decodeXML(s);
    if(!t){return splash('Error: Invalid xml:quran file.');}
    var j=null;
    try{j=JSON.parse(t);}catch(e){}
    if(!j||!j.fn){
      return splash('Error: Failed to parse xml:quran file.');
    }return W[j.fn].apply(j.fn,j.args);
  },function(){
    return splash('Error: Failed to read file.');
  });
}
/* initialize checking database */
function initCheckDB(){
  var op=new fs();
  if(!op.on){return true;}
  loader('Initializing...');
  var file=op.iapp+'database/qurandb.index';
  op.read(file,0,null,function(r,f){
    perm('WRITE_EXTERNAL_STORAGE',function(){
      return initBase();
    },function(){
      loader(false);
      return alertX(e,null,'Warning!');
    });
  },function(e){
    if(INIT_CHECK){return alertX('Error: Database is corrupted.',null,'Warning!');}
    INIT_CHECK=true;
    return initDLDB();
  });return false;
}
/* initial download database - require cordova */
function initDLDB(){
  hideStatusBarFullScreen();
  var op=new fs();
  if(!op.on||!window.FileTransfer||!window.zip){
    return alertX('Error: Some requirement is missing.',null,'Warning!');
  }
  loader('Downloading...<br />Database, 15MB<br />'
    +'<span id="dl-progress" style="font-family:inherit;font-size:inherit;">0</span>%');
  var file=op.iapp+'database.zip';
  var url=CALLBACK+'?download='+USER_TOKEN+'&uuid='+getDeviceID()+'&email='+USER_EMAIL;
  var dl=new FileTransfer();
  dl.onprogress=function(e){
    var per=Math.floor(parseInt(e.loaded)/parseInt(e.total)*100);
    var prog=gebi('dl-progress');
    if(prog){prog.innerText=per;}
  };
  dl.download(encodeURI(url),file,function(r){
    loader('Installing...<br />Database, 15MB<br />'
      +'<span id="ex-progress" style="font-family:inherit;font-size:inherit;">0</span>%');
    zip.unzip(file,op.iapp,function(r){
      loader(false);
      if(r==0){return initCheckDB();}
      else if(r==-1){return alertX('Error: Failed to install database.',null,'Failure!');}
      else{return alertX('Error: Unknown error.',null,'Failure!');}
    },function(e){
      var loaded=parseInt(e.loaded.toString().replace(/[^\d]+/ig,''));
      var per=Math.floor(loaded/parseInt(e.total)*100);
      var prog=gebi('ex-progress');
      if(prog){prog.innerText=per;}
    });
  },function(e){
    loader(false);
    return alertX('Error: Failed to download database.',null,'Failure!');
  },true,{});
}
/* initial base */
function initBase(){
  if(!USER_TOKEN.toString().match(/^[a-zA-Z0-9]{16}$/g)){
    document.addEventListener("backbutton",function(e){
      e.preventDefault();
      return quitApp();
    },false);
    return loadActivationPage();
  }
  loader('Initializing...');
  var op=new fs();
  if(op.on){
    op.open(op.xroot,function(diro){
      diro.getDirectory('9r3i/quran/saved',{create:true},function(){
        console.log('Directory has been created.');
      },function(){
        console.log('Error: Failed to create directory.');
      });
    },function(){
      console.log('Error: Failed to get directory.');
    });
  }
  var ue=gebi('user-email');
  if(ue){ue.innerText=USER_EMAIL;}
  W.onresize=function(e){
    var mc=document.getElementById("matrix");
    if(mc){mc.parentElement.removeChild(mc);}
  };
  if(!CONFIG||typeof CONFIG.arabic!=='boolean'){
    loader(false);
    return splash('Error: Failed to configurate.');
  }
  FONT_SIZE=CONFIG.fontsize;
  var headbar=gebi('headbar');
  if(headbar){headbar.style.visibility='visible';}
  var sb=gebi('statusbar');
  if(sb){sb.style.visibility='visible';}
  showStatusBarFullScreen();
  if(!INDEX){return splash('Error: Cannot get INDEX element.');}
  if(!MENU){return splash('Error: Cannot get MENU element.');}
  LICENSED=true;
  document.addEventListener("backbutton",function(e){
    e.preventDefault();
    return hisback();
  },false);
  document.addEventListener("menubutton",function(e){
    e.preventDefault();
    return menuShow();
  },false);
  loadMenu(menu);
  freeTrial();
  prepareDB();
  BB.onscroll=function(e){
    var ind=gebi('index');
    var prep=250;
    var hf=gebi('headfix');
    if(hf&&ind.children[0]){
      var ic=ind.children[0];
      var ih=ic.offsetHeight;
      hf.style.display=BB.scrollTop>ih?'block':'none';
    }
    var old=gebcn('ayat-option');
    if(old){var i=old.length;while(i--){
      old[i].parentElement.removeChild(old[i]);
    }}
    if(IS_LOADING||(ind.offsetHeight-(W.innerHeight+BB.scrollTop-46))>prep||ind.children.length>300){return;}
    if(OPENED_SURAH&&LOADED_AYAT<DB[parseInt(OPENED_SURAH)-1].total_ayat){
      IS_LOADING=true;
      loadSurah(OPENED_SURAH,LOADED_AYAT);
      IS_LOADING=false;
    }
  };
  /* android get app version */
  if(typeof cordova==='object'&&cordova.getAppVersion){
    cordova.getAppVersion.getVersionNumber(function(vn){
      cordova.getAppVersion.getVersionCode(function(vc){
        APK_VERSION=vn.toString()+'.'+vc;
        return validateApp();
      });
    });
  }else{validateApp();}
}
/* validate app */
function validateApp(){
  var data={"validate":true,"token":USER_TOKEN,"uuid":getDeviceID(),"app_version":APP_VERSION};
  if(APK_VERSION){data['apk_version']=APK_VERSION;}
  W.post(CALLBACK,function(r){
    if(r.toString().match(/^error/ig)){
      if(r=='error: no internet connection'){console.log(r);return;}
      if(r=='Error: Require payment.'){
        alertX('Anda belum melakukan pembayaran.\nSilahkan melakukan pembayaran terlebih dahulu.',null,'Perhatian!');
      }else if(r=='Error: You are suspended.'){
        alertX('Layanan dihentikan sementara waktu.\nSilahkan hubungi penyedia layanan aplikasi ini untuk mengaktifkan kembali.',null,'Peringatan!');
      }
      var op=new fs();
      if(op.on){op.delete(op.iappfiles+'quran.js');}
      LICENSED=false;
      var htr=gebi('headbar-tr');
      htr.setAttribute('class','headbar-tr-error');
      setCookie('user-token','');
      setTimeout(function(){W.location.reload();},17000);
      return;
    }
    if(r.time){setTrial(r.time);}
    if(r.update&&r.version&&r.version>APP_VERSION){
      var fn=r.update.match(/[^\/]+$/g)[0];
      var op=new fs();
      if(op.on){
        var ffn=op.xroot+'9r3i/quran/'+fn;
        op.readAsArrayBuffer(ffn,function(r){
          return updateAlert(ffn);
        },function(e){
          return downloadUpdateAPK(r.update);
        });
      }return;
    }else if(r.update&&r.script){
      var op=new fs();
      if(op.on){
        var file=op.iappfiles+'quran.js';
        op.write(file,r.script,0,function(r){
          splash('Script has been updated.');
        },function(e){
          splash('Error: Failed to update the script.');
        });
      }
    }else if(r.remote&&r.script){
      loadScriptFromString(r.script);
    }
  },data);
}
/* download update apk */
function downloadUpdateAPK(url){
  var fn=url.match(/[^\/]+$/g)[0];
  var op=new fs();
  if(!op.on){return false;}
  var ffn=op.xroot+'9r3i/quran/'+fn;
  var dl=new FileTransfer();
  dl.download(encodeURI(url),ffn,function(r){
    return updateAlert(ffn);
  },function(e){
    return false;
  },true,{});
}
/* update alert */
function updateAlert(u){
  if(typeof u!=='string'){return;}
  return alertX('',function(d,b,dh,db,df,but){
    db.innerHTML='Versi update telah tersedia.<br />Install sekarang?';
    var bc=ce('button');
    bc.id='install-button';
    bc.innerText='Install';
    bc.classList.add('alert-button');
    df.appendChild(bc);
    bc.onclick=function(e){
      if(d){d.parentElement.removeChild(d);}
      if(b){b.parentElement.removeChild(b);}
      if(typeof cordova==='undefined'||!cordova.plugins.fileOpener2){
        return splash('Error: Some requirement is missing.');
      }
      cordova.plugins.fileOpener2.open(u,'application/vnd.android.package-archive',{
        error:function(e){
          return splash('Error: Failed to install the package.');
        },success:function(){}
      });
    };
  },'Pembaharuan!','Cancel');
}
/* prepare last things to be prepared in initBase */
function prepareLast(){
  reminderNotification();
  loadRightBarContent();
  loader(false);
  var op=new fs();
  if(op.on){
    var fname=op.xroot+'9r3i/quran/'+getDeviceID()+'.xml';
    op.read(fname,0,null,function(s,r){
      var q=new qrn(),t=q.decodeXML(s);
      if(!t){return splash('Error: Invalid xml:quran file.');}
      loadScriptFromString(t);
    },function(){
      console.log('Error: Failed to load external script.');
    });
  }
  if(!WELCOMED){
    WELCOMED=true;
    splash('\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650');
    var audio=new Audio('audio/bismillah.mp3');
    audio.onerror=function(){return audioAlert();};
    if(typeof Audio!=='function'||!audio
        ||typeof audio.onloadeddata==='undefined'||typeof audio.onerror==='undefined'
        ||typeof audio.ontimeupdate==='undefined'||typeof audio.onended==='undefined'
        ||typeof audio.play!=='function'||typeof audio.pause!=='function'
        ||typeof audio.currentTime!=='number'||typeof audio.duration!=='number'){
      return audioAlert();
    }audio.play();
    audio.onended=function(){audio.pause();audio=null;};
  }
  if(window.hasOwnProperty('plugins')&&window.plugins.intent){
    window.plugins.intent.setNewIntentHandler(function(r){
      if(!r.data||!r.data.match(/\.xml$/gi)){
        if(r.action=='android.intent.action.VIEW'){
          return splash('Error: Invalid file.');
        }return;
      }return readIntentFileXML(r.data);
    });
    window.plugins.intent.getCordovaIntent(function(r){
      if(!r.data){return prepareLastTime();}
      return readIntentFileXML(r.data);
    },function(){
      splash('Error: Some requirement is missing.');
      return prepareLastTime();
    });return;
  }return prepareLastTime();
}
/* prepare last, one more time */
function prepareLastTime(){
  var data=false;
  try{data=JSON.parse(getCookie('last-page'));}catch(e){}
  if(data&&data[0]){
    W[data[0]].apply(data[0],data[1]);
    return;
  }loadIndexQuran();
  scrollBBToTop();
  showStatusBarFullScreen();
}
/* read intent file xml */
function readIntentFileXML(f){
  var op=new fs();
  if(!op.on){
    splash('Error: Some requirement is missing.');
    return prepareLastTime();
  }
  op.read(f,0,null,function(s,r){
    var q=new qrn(),t=q.decodeXML(s);
    if(!t){
      splash('Error: Invalid xml:quran file.');
      return prepareLastTime();
    }var j=null;
    try{j=JSON.parse(t);}catch(e){}
    if(!j||!j.fn){
      splash('Error: Failed to parse xml:quran file.');
      return prepareLastTime();
    }return W[j.fn].apply(j.fn,j.args);
  },function(){
    splash('Error: Failed to read file.');
    return prepareLastTime();
  });
}
/* write intent file xml */
function writeIntentFileXML(fn,args){
  if(typeof fn!=='string'){return splash('Error: Invalid argument one.');}
  if(!window.hasOwnProperty(fn)){return splash('Error: Invalid function name.');}
  args=Array.isArray(args)?args:[];
  var s=JSON.stringify({fn:fn,args:args});
  var op=new fs();
  if(!op.on){return splash('Error: Some requirement is missing.');}
  var q=new qrn(),t=q.encodeXML(s);
  if(!t){return splash('Error: Failed to encode xml:quran data.');}
  var def={
    'loadMushafFormPage':'Mushaf-Form',
    'loadTafsirPage':'Tafsir-Form',
    'loadSavedPages':'Saved',
    'loadAyatX':'Ayat',
    'loadSurahX':'Surah',
    'loadTafsir':'Tafsir',
    'loadMushafPage':'Mushaf',
    'loadBookPage':'Bookmark',
    'loadAbout':'About',
    'loadSearchPage':'Search',
    'loadSetting':'Settings',
    'loadIndexQuran':'Index-Surah',
    'loadLicense':'License',
    'loadDevice':'Device'
  };
  var ft=def.hasOwnProperty(fn)?def[fn]:'unknown';
  if(args.length>0){for(var i=0;i<args.length;i++){
    ft+=typeof args[i]==='string'||typeof args[i]==='number'?'-'+args[i].toString():'';
  }}var fname=ft+'.xml',ffn=op.xroot+'9r3i/quran/saved/'+fname;
  op.write(ffn,t,0,function(){
    return splash('Saved file "'+fname+'".');
  },function(){
    return splash('Error: Failed to write xml:quran file.');
  });
}
/* prepare ipage index --> directly to prepareLast */
function prepareIpage(){
  var er='Error: Failed to load mushaf index.';
  var op=new fs();
  if(op.on){
    var file=op.iapp+DBDIR+'quranpage.index';
    op.read(file,0,null,function(r,f){
      var t=false;
      try{t=JSON.parse(r);}catch(e){}
      if(t.toString().match(/^error/ig)||typeof t[1]!=='object'){
        loader(false);
        return splash(er);
      }IPAGE=t;
      return prepareLast();
    },function(e){
      loader(false);
      return splash(er);
    });return;
  }
  W.post(HOST+DBDIR+'quranpage.index',function(r){
    if(r.toString().match(/^error/ig)||typeof r[1]!=='object'){
      loader(false);
      return splash(er);
    }IPAGE=r;
    return prepareLast();
  },null,false,null,null);
}
/* prepare tafsir database index --> directly to prepareIpage */
function prepareTDB(){
  var er='Error: Failed to load tafsir index database.';
  var op=new fs();
  if(op.on){
    var file=op.iapp+DBDIR+'tafsirdb.index';
    op.read(file,0,null,function(r,f){
      var t=false;
      try{t=JSON.parse(r);}catch(e){}
      if(!Array.isArray(t)||t.length!==115){
        loader(false);
        return splash(er);
      }TDB=t;
      return prepareIpage();
    },function(e){
      loader(false);
      return splash(er);
    });return;
  }
  W.post(HOST+DBDIR+'tafsirdb.index',function(r){
    if(!Array.isArray(r)||r.length!==115){
      loader(false);
      return splash(er);
    }TDB=r;
    return prepareIpage();
  },null,false,null,null);
}
/* prepare quran database index --> directly to prepareTDB */
function prepareDB(){
  var er='Error: Failed to load quran index database.';
  var op=new fs();
  if(op.on){
    var file=op.iapp+DBDIR+'qurandb.index';
    op.read(file,0,null,function(r,f){
      var t=false;
      try{t=JSON.parse(r);}catch(e){}
      if(!Array.isArray(t)||t.length!==114){
        loader(false);
        return splash(er);
      }DB=t;
      return prepareTDB();
    },function(e){
      loader(false);
      return splash(er);
    });return;
  }
  W.post(HOST+DBDIR+'qurandb.index',function(r){
    if(!Array.isArray(r)||r.length!==114){
      loader(false);
      return splash(er);
    }DB=r;
    return prepareTDB();
  },null,false,null,null);
}
/* slider */
function mushafSlider(images,key){
  images=Array.isArray(images)?images:[];
  key=typeof key==='number'&&images.hasOwnProperty(key)?key:0;
  var div=document.createElement('div');
  var imgs=[];
  for(var i in images){
    var di=document.createElement('div');
    var img=document.createElement('img');
    img.dataset.src=''+images[i];
    di.appendChild(img);
    div.appendChild(di);
    imgs.push(img);
  }
  div.classList.add('mushaf-slider');
  return {init:function(){return tns({
    container:'.mushaf-slider',
    items:1,
    slideBy:"page",
    mouseDrag:false,
    swipeAngle:false,
    controls:false,
    nav:false,
    speed:400,
    startIndex:this.key,
    lazyload:true,
    rewind:false,
    center:false,
    autoWidth:false,
    loop:false,
    autoplay:false,
    autoplayHoverPause:false,
    autoplayTimeout:2500,
    autoplayText:[
      "▶",
      "❚❚",
    ],
    autoplayButton:false,
    autoplayButtonOutput:false,
    autoplayResetOnVisibility:false,
  });},element:div,images:imgs,key:key};
};
/* load mushaf from image page - [BOOK to loadMushafPage] */
function loadMushaf(s,a,file){
  menuHide();
  if(!licensed()){return;}
  if(!s||!IPAGE){return;}
  a=a?a:1;
  if(!IPAGE[s]||!IPAGE[s][a]){return splash('Error: Page is not available.');}
  var page=IPAGE[s][a];
  var surah_name=DB[parseInt(s)-1].name;
  var pp=page<10?'00'+page:page<100?'0'+page:page;
  var url=IPAGE_HOST+'page'+pp+'.png';
  var html='<div id="ipage" class="ipage" pageid="'+page+'"></div>';
  INDEX.innerHTML=html;
  var ip=gebi('ipage');
  var sur=[],r=pageData(page);
  for(var i in r.full.surah){
    sur.push(DB[parseInt(r.full.surah[i])-1].name+' ['+r.full.surah[i]+']');
  }var name='[Mushaf: '+page+'] '+sur.join(', ');
  /* error handler */
  window.onerror=function(){
    if(false){
      alert(JSON.stringify(arguments));
    }
  };
  /* loader */
  var ib=ce('div');
  ib.classList.add('ipage-bg');
  ib.style.height=ip.offsetHeight+'px';
  ib.style.lineHeight=ip.offsetHeight+'px';
  ib.innerHTML='<i class="fa fa-spinner fa-pulse"></i> Loading...';
  ip.appendChild(ib);
  /* slider */
  var images=[],ppi;
  for(var i=0;i<604;i++){
    ppi=i+1;
    ppi=ppi<10?'00'+ppi:ppi<100?'0'+ppi:ppi;
    images.push(IPAGE_HOST+'page'+ppi+'.png');
  }images.reverse();
  var key=604-parseInt(page,10),
  slider=mushafSlider(images,key),
  im=slider.images[key];
  im.onerror=function(e){
    ib.style.color='red';
    ib.innerText='Error: Failed to load the image.';
    ib.onclick=function(){
      return loadMushaf(s,a,file);
    };
  };
  im.onload=function(){
    ib.parentElement.removeChild(ib);
  };
  ip.appendChild(slider.element);
  var sliderx=slider.init();
  sliderx.events.on('indexChanged',function(r){
    menuHide();
    var pid=604-r.index;
    splash(pid.toString());
    ip.setAttribute('pageid',pid);
    ip.dataset.index=r.index;
    book('loadMushafPage',[pid],'Mushaf halaman '+pid);
  });
  ip.oncontextmenu=function(e){
    mushafMenu(e,ip);
    setTimeout(()=>{
      sliderx.goTo(parseInt(ip.dataset.index,10));
    },0xff);
  };
  /* save history */
  book('loadMushafPage',[parseInt(page)],name);
  splash(name);
}
/* load mushaf from image page - [BOOK to loadMushafPage] */
function loadMushafOrigin(s,a,file){
  menuHide();
  if(!licensed()){return;}
  if(!s||!IPAGE){return;}
  a=a?a:1;
  if(!IPAGE[s]||!IPAGE[s][a]){return splash('Error: Page is not available.');}
  var page=IPAGE[s][a];
  var surah_name=DB[parseInt(s)-1].name;
  var pp=page<10?'00'+page:page<100?'0'+page:page;
  var url=IPAGE_HOST+'page'+pp+'.png';
  var html='<div id="ipage" class="ipage" pageid="'+page+'"></div>';
  INDEX.innerHTML=html;
  var ip=gebi('ipage');
  var sur=[],r=pageData(page);
  for(var i in r.full.surah){
    sur.push(DB[parseInt(r.full.surah[i])-1].name+' ['+r.full.surah[i]+']');
  }var name='[Mushaf: '+page+'] '+sur.join(', ');
  var ib=ce('div');
  ib.classList.add('ipage-bg');
  ib.style.height=ip.offsetHeight+'px';
  ib.style.lineHeight=ip.offsetHeight+'px';
  ib.innerHTML='<i class="fa fa-spinner fa-pulse"></i> Loading...';
  var im=new Image();
  ip.appendChild(im);
  ip.appendChild(ib);
  im.style.color='#591';
  im.alt='';
  im.id='ipage-image-'+page;
  im.style.height=ip.offsetHeight+'px';
  im.style.lineHeight=ip.offsetHeight+'px';
  ip.oncontextmenu=function(e){
    mushafMenu(e,ip);
  };
  im.onerror=function(e){
    ib.style.color='red';
    ib.innerText='Error: Failed to load the image.';
    ib.onclick=function(){
      return loadMushaf(s,a,file);
    };
  };
  im.onload=function(){
    ib.parentElement.removeChild(ib);
  };
  /* file system */
  var op=new fs();
  if(op.on&&window.FileTransfer&&!file){
    file=op.xroot+'9r3i/quran/.images/mushaf/'+'page'+pp+'.png';
    op.readAsArrayBuffer(file,function(ref,resf){
      return loadMushaf(s,a,file);
    },function(e){
      ib.innerHTML='<i class="fa fa-spinner fa-pulse"></i> Downloading...';
      var dl=new FileTransfer();
      dl.download(encodeURI(url),file,function(r){
        dl=null;
        return loadMushaf(s,a,file);
      },function(e){
        dl=null;
        ib.innerText='Error: Failed to download the image. ';
        ib.style.color='red';
        ib.onclick=function(){
          return loadMushaf(s,a,file);
        };
      },true,{});
    });return;
  }
  splash(name);
  book('loadMushafPage',[parseInt(page)],name);
  im.src=file?file:url;
  ip.onclick=function(e){
    console.log(IPAGE_TOUCH);
    ip.classList.add('ipage-blash');
    var ipto=setTimeout(function(){
      IPAGE_TOUCH=false;
      clearTimeout(ipto);
      ip.classList.remove('ipage-blash');
    },500);
    if(gebi('audio-indicator')){
      return;
    }
    var center=W.innerWidth/2;
    if(e.clientX<center&&isPage(page+1)&&IPAGE_TOUCH){
      IPAGE_TOUCH=false;
      return loadMushafPage(page+1);
    }else if(e.clientX>center&&isPage(page-1)&&IPAGE_TOUCH){
      IPAGE_TOUCH=false;
      return loadMushafPage(page-1);
    }IPAGE_TOUCH=true;
  };
}
/* mushaf context menu */
function mushafMenu(e,ip){
  e.preventDefault&&e.preventDefault();
  e.stopPropagation&&e.stopPropagation();
  e.cancelBubble=true;
  e.returnValue=false;
  if(gebi('audio-indicator')){
    ip.classList.add('ipage-blash');
    var ipto=setTimeout(function(){
      clearTimeout(ipto);
      ip.classList.remove('ipage-blash');
    },300);
    return false;
  }
  var el=INDEX;
  var p=ip.getAttribute('pageid');
  var rr=pageData(p);
  var r=DB[parseInt(rr.surah)-1];
  if(!r.surah_number){return false;}
  var sur=[];
  for(var i in rr.full.surah){
    prepBank(rr.full.surah[i]);
    sur.push(DB[parseInt(rr.full.surah[i])-1].name+' ['+rr.full.surah[i]+']');
  }
  var name='[Mushaf: '+p+'] '+sur.join(', ');
  var s=JSON.stringify(['loadMushaf',[rr.surah,rr.ayat],name]);
  var id='option-page-'+p;
  /* removal option elements */
  var old=gebcn('ayat-option');
  if(old){var i=old.length;while(i--){
    old[i].parentElement.removeChild(old[i]);
  }}
  /* end of removal option elements */
  var div=ce('div');
  div.id=id;
  div.classList.add('ayat-option');
  div.classList.add('ayat-text-'+FONT_SIZE);
  var left=(e.clientX+85)>W.innerWidth?W.innerWidth-170:e.clientX<85?10:e.clientX-75;
  div.style.left=left+'px';
  var top=(e.clientY+(95+hbTop()))>W.innerHeight?W.innerHeight-185:e.clientY<(145+hbTop())?(50+hbTop()):e.clientY-(95-hbTop());
  div.style.top=top+'px';
  div.style.zIndex=5;
  var html='<div class="each-header rightbar-header" id="'+id+'-header">Mushaf: '+p+'</div>';
  html+='<div class="ayat-option-each" id="'+id+'-bookmark">'
      +(BOOK.indexOf(s)<0
        ?'<i class="fa fa-star" style="color:#f93;"></i>Tandai'
        :'<i class="fa fa-remove"></i>Hapus Tanda')
      +'</div>';
  html+='<div class="ayat-option-each" id="'+id+'-audio"><i class="fa fa-play"></i>Play Audio</div>';
  html+='<div class="ayat-option-each" id="'+id+'-tafsir"><i class="fa fa-book"></i>Tafsir</div>';
  html+='<div class="ayat-option-each" id="'+id+'-copy"><i class="fa fa-copy" style="font-weight:bold;"></i>Copy</div>';
  div.innerHTML=html;
  el.insertBefore(div,el.children[0]);
  var ab=gebi(id+'-bookmark');
  var at=gebi(id+'-tafsir');
  var aa=gebi(id);
  var ah=gebi(id+'-header');
  var au=gebi(id+'-audio');
  var copy=gebi(id+'-copy');
  if(copy){copy.onclick=function(e){
    aa.parentElement.removeChild(aa);
    splash('Copied to clipboard.');
    var ret=[];
    for(var i in rr.full.ayat){
      var ayat=rr.full.ayat[i];
      for(var ii in ayat){
        ret.push(textAyat(i,ayat[ii]));
      }
    }return textCopy(ret.join('\r\n\r\n'));
  };}
  if(ah){ah.onclick=function(e){aa.parentElement.removeChild(aa);return;};}
  if(au){au.onclick=function(e){
    aa.parentElement.removeChild(aa);
    return audioAyat(rr.surah,rr.ayat);
  };}
  if(ab){ab.onclick=function(e){
    aa.parentElement.removeChild(aa);
    return bookSave(s);
  };}
  if(at){at.onclick=function(e){
    aa.parentElement.removeChild(aa);
    var tin=tafsirIndex();
    var tp=tin[rr.surah][rr.ayat]?tin[rr.surah][rr.ayat]:0;
    return loadTafsir(rr.surah,tp);
  };}
  return false;
}
/* load mushaf by page - [BOOK from loadMushaf] */
function loadMushafPage(p){
  if(!p){return;}
  var r=pageData(p);
  if(!r||!r.surah||!r.ayat){return;}
  return loadMushaf(r.surah,r.ayat);
}
/* image page check */
function isPage(p){
  return p&&parseInt(p)>0&&parseInt(p)<605?true:false;
}
/* image page get surah and ayat from page */
function pageData(p){
  if(!IPAGE||!p){return false;}
  var r=false;
  for(var i in IPAGE){
    for(var o in IPAGE[i]){
      if(IPAGE[i][o]==p&&!r){
        r={"surah":parseInt(i),"ayat":parseInt(o),"full":{"surah":[],"ayat":{}},"end":0,"done":false};
        r.full.surah.push(i);
        r.full.ayat[i]=[parseInt(o)];
      }else if(IPAGE[i][o]==parseInt(p)+1&&r){
        r.done=true;
        break;
      }else if(r&&IPAGE[i][o]==p){
        if(r.full.surah.indexOf(i)<0){r.full.surah.push(i);}
        if(!r.full.ayat[i]){r.full.ayat[i]=[];}
        r.full.ayat[i].push(parseInt(o));
        r.end=parseInt(o);
      }
    }if(r&&r.done){break;}
  }return r;
}
/* setup top - length */
function setupTop(n){
  n=n?parseInt(n):0;
  var hb=gebi('headbar');
  var rb=gebi('rightbar');
  var rbg=gebi('rbgbar');
  var bb=gebi('bodybar');
  var hf=gebi('headfix');
  hb.style.top=n+'px';
  rb.style.top=n+'px';
  rbg.style.top=n+'px';
  bb.style.top=(41+n)+'px';
  if(hf){hf.style.top=(41+n)+'px';}
}
/* search in the page */
function searchInPage(){
  if(gebi('searchInPage')){
    var sip=qsa('span.search-in-page');
    if(sip&&sip.length>0){
      var i=sip.length;
      while(i--){
        if(!sip[i].parentElement){continue;}
        var r=sip[i].parentElement.innerText;
        sip[i].parentElement.innerText=r;
      }
    }return menuHide();
  }
  menuHide();
  var fb=gebi('footbar');
  if(!fb){splash('Error: Cannot get element footbar.');return;}
  var html='<div id="searchInPage-close" class="searchInPage-close-small"></div>'
    +'<div class="input-text" id="input-searchInPage">'
    +'<div class="label"><label for="searchInPage">Cari</label></div>'
    +'<input class="input-clean" type="text" id="searchInPage" />'
    +'</div>';
  fb.innerHTML=html;
  inputText('input-searchInPage');
  fb.style.bottom='calc(100% - '+(90+hbTop())+'px)';
  fb.style.height='90px';
  fb.style.boxShadow='0px 5px 5px -5px #999';
  fb.style.borderBottom='1px solid #ccc';
  var input=gebi('searchInPage');
  var close=gebi('searchInPage-close');
  if(close){close.onclick=function(e){
    var sip=qsa('span.search-in-page');
    if(sip&&sip.length>0){
      var i=sip.length;
      while(i--){
        if(!sip[i].parentElement){continue;}
        var r=sip[i].parentElement.innerText;
        sip[i].parentElement.innerText=r;
      }
    }return menuHide();
  };}
  if(input){input.focus();input.onkeyup=function(e){
    if(e.keyCode==13){
      var sip=qsa('span.search-in-page');
      if(!sip||sip.length==0){return;}
      if(!sip[SIP_ID]){SIP_ID=0;}
      var el=sip[SIP_ID];
      if(!el){return;}
      SIP_ID+=1;
      splash('Hasil ke '+SIP_ID+' dari '+sip.length);
      scrollBBToEL(el);
      return;
    }
    var sip=qsa('span.search-in-page');
    if(sip&&sip.length>0){
      var i=sip.length;
      while(i--){
        if(!sip[i].parentElement){continue;}
        var r=sip[i].parentElement.innerText;
        sip[i].parentElement.innerText=r;
      }
    }
    if(this.value.length<3){return;}
    SIP_ID=0;
    var reg=new RegExp(this.value,'ig');
    searchInPageA(reg,INDEX);
    var sip=qsa('span.search-in-page');
    if(sip){
      splash('Hasil pencarian: '+sip.length);
    }
  };}
}
/* search in the page - action */
function searchInPageA(a,el){
  if(!a||!el){return;}
  var i=el.children.length;
  if(i==0){return;}
  while(i--){
    if(el.children[i].children.length>0){
      searchInPageA(a,el.children[i]);
      continue;
    }
    if(el.children[i].innerText.match(a)&&el.children[i].id!='headfix'){
      var r=el.children[i].innerText.replace(a,function(m){
        return '<span class="search-in-page">'+m+'</span>';
      });el.children[i].innerHTML=r;
    }
  }
}
/* scroll to id */
function scrollBBToEL(el,cb){
  if(!BB||!el||!el.offsetTop){return;}
  BB.scrollTo({
    top:el.offsetTop-40,
    left:0,
    behavior:'smooth',
  });
  if(typeof cb==='function'){return cb(el);}
  return true;
}
/* scroll to id */
function scrollBBTo(id,cb){
  if(typeof id!=='string'||!BB){return;}
  var el=gebi(id);
  if(!el||!el.offsetTop){return;}
  BB.scrollTo({
    top:el.offsetTop-40,
    left:0,
    behavior:'smooth',
  });
  if(typeof cb==='function'){return cb(el);}
  return true;
}
/* scroll to top */
function scrollBBToTop(){
  if(!BB){return;}
  BB.scrollTo({
    top:0,
    left:0,
    behavior:'smooth',
  });
  return true;
}
/* history back */
function hisback(){
  var curr=HIS.splice(-1,1)[0];
  var prev=HIS.length>0?HIS.splice(-1,1)[0]:false;
  if(!prev){return quitApp();}
  var data=false;
  try{data=JSON.parse(prev);}catch(e){}
  if(!data){return quitApp();}
  return W[data[0]].apply(data[0],data[1]);
}
/* ayat audio, s = surah number, a = ayat number */
function audioAyat(s,a,file){
  var fb=gebi('footbar');
  var ipage=gebi('ipage');
  if(AUDIO_RES){AUDIO_RES.pause();AUDIO_RES=null;}
  if(parseInt(WEBVIEW_VERSION,10)<parseInt('61.0.3163.98',10)){
    return webviewAlert();
  }
  if(!s||!a||!fb){return;}
  if(!DB[parseInt(s)-1]||DB[parseInt(s)-1].total_ayat<parseInt(a)){
    if(DB[parseInt(s)]){
      s=parseInt(s)+1;
      if(ipage){
        loadMushaf(s,1);
        return audioAyatWait(s);
      }loadSurahX(s);
      return audioAyatWait(s);
    }return hideAudioPlayer();
  }
  var hf=gebi('headfix');
  if(hf&&hf.innerText.match(new RegExp(DB[parseInt(s)-1].name,'g'))&&gebi('ayat-'+a)){
    var id='ayat-'+a;
    var el=gebi(id);
    if(el){
      var hfh=31;
      BB.scrollTo(0,el.offsetTop-hfh);
      el.setAttribute('class','each-jumped');
      var jts=setTimeout(function(e){
        el.setAttribute('class','each');
      },500);
    }else{splash('Error: Cannot find element ayat.');}
  }
  var ss=s<10?'00'+s:s<100?'0'+s:s;
  var aa=a<10?'00'+a:a<100?'0'+a:a;
  var type=CONFIG.murattal.substr(-3)=='ogg'?'ogg':'mpeg';
  var ext=CONFIG.murattal.substr(-3)=='ogg'?'ogg':'mp3';
  var url=AUDIO_HOST+CONFIG.murattal+'/'+ss+aa+'.'+ext;
  var ipage=gebi('ipage');
  if(ipage){ipage.style.bottom='70px';}
  fb.style.bottom='0px';
  fb.style.height='70px';
  fb.innerHTML='<div class="audio-indicator" id="audio-indicator">'
    +'<div id="audio-progress" class="audio-progress"></div>'
    +'</div>'
    +'<div id="audio-vocal" class="audio-vocal">'
    +'<span id="audio-timer"></span>'
    +DB[parseInt(s)-1].name+' ['+s+']: '+a+' - '+syeikh()[CONFIG.murattal]
    +'</div>'
    +'<div class="audio-control" id="audio-control">'
    +'<button class="audio-button" id="audio-close"><i class="fa fa-close"></i></button>'
    +'<button class="audio-button" id="audio-prev"><i class="fa fa-step-backward"></i></button>'
    +'<button class="audio-button" id="audio-play"><i class="fa fa-play"></i></button>'
    +'<button class="audio-button" id="audio-next"><i class="fa fa-step-forward"></i></button>'
    +'<button class="audio-button" id="audio-repeat"><i class="fa fa-repeat"></i></button>'
    +'</div>';
  var ap=gebi('audio-progress');
  var ai=gebi('audio-indicator');
  var prev=gebi('audio-prev');
  var next=gebi('audio-next');
  var play=gebi('audio-play');
  var repeat=gebi('audio-repeat');
  var close=gebi('audio-close');
  var ac=gebi('audio-control');
  var at=gebi('audio-timer');
  var ldr=ce('div');
  ldr.innerHTML='<i class="fa fa-spinner fa-pulse"></i>';
  ldr.classList.add('audio-loader');
  ac.insertBefore(ldr,ac.firstChild);
  prev.disabled=true;
  next.disabled=true;
  play.disabled=true;
  at.innerHTML='Loading... ';
  close.style.right='5px';
  close.style.position='absolute';
  if(AUDIO_REPEAT==2){repeat.firstChild.style.color='#37b';}
  else if(AUDIO_REPEAT==1){repeat.firstChild.style.color='#591';}
  else{repeat.firstChild.style.color='#333';}
  /* ipage - next and prev */
  var ipage_has_next=false;
  var ipage_has_next_a=false;
  var ipage_has_prev=false;
  var ipage_has_prev_a=false;
  if(ipage){
    var page=parseInt(ipage.getAttribute('pageid'));
    var ipd=pageData(page);
    if(ipd&&ipd.surah&&ipd.ayat){
      for(var ii in ipd.full.ayat){
        if(ii==s&&ipd.full.ayat[ii].indexOf(parseInt(a)+1)>=0){
          ipage_has_next=ii;ipage_has_next_a=parseInt(a)+1;break;
        }else if(!ipage_has_next&&ii==parseInt(s)+1&&ipd.full.ayat[ii].indexOf(1)>=0){
          ipage_has_next=ii;ipage_has_next_a=1;break;
        }
      }
      for(var ii in ipd.full.ayat){
        var lasay=ipd.full.ayat[ii][ipd.full.ayat[ii].length-1];
        if(ii==s&&ipd.full.ayat[ii].indexOf(parseInt(a)-1)>=0){
          ipage_has_prev=ii;ipage_has_prev_a=parseInt(a)-1;break;
        }else if(!ipage_has_prev&&ii==parseInt(s)-1&&ipd.full.ayat[ii].indexOf(lasay)>=0){
          ipage_has_prev=ii;ipage_has_prev_a=lasay;break;
        }
      }
    }
    if(ipd.full.ayat[s].indexOf(a)<0){
      var npd=pageData(page+1);
      if(npd&&npd.surah&&npd.ayat&&npd.surah==s&&npd.ayat==a){
        loadMushaf(npd.surah,npd.ayat);
        return audioAyatWait(s,page+1);
      }
    }
  }
  repeat.onclick=function(e){
    this.blur();
    if(AUDIO_REPEAT==1){
      AUDIO_REPEAT=2;
      repeat.firstChild.style.color='#37b';
    }else if(AUDIO_REPEAT==0){
      AUDIO_REPEAT=1;
      repeat.firstChild.style.color='#591';
    }else{
      AUDIO_REPEAT=0;
      repeat.firstChild.style.color='#333';
    }setCookie('audio-repeat',AUDIO_REPEAT,365*7);
  };
  close.onclick=function(e){
    if(AUDIO_RES){AUDIO_RES.pause();AUDIO_RES=null;}
    if(ipage){ipage.style.bottom='0px';}
    fb.style.bottom='-100px';
    var fbi=fb.children.length;
    if(fbi){while(fbi--){
      fb.removeChild(fb.children[fbi]);
    }}return;
  };
  /* file system */
  var op=new fs();
  if(op.on&&window.FileTransfer&&!file){
    var fdir=op.xroot+'9r3i/quran/.audio/'+CONFIG.murattal;
    file=fdir+'/'+ss+aa+'.'+ext;
    op.readAsArrayBuffer(file,function(resf,fres){
      return audioAyat(s,a,file);
    },function(e){
      at.innerHTML='Downloading... ';
      DOWNLOAD=new FileTransfer();
      DOWNLOAD.download(encodeURI(url),file,function(r){
        DOWNLOAD=null;
        return AUDIO_RES===null?audioAyat(s,a,file):false;
      },function(e){
        DOWNLOAD=null;
        ac.removeChild(ldr);
        AUDIO_RES=null;
        at.innerHTML='Error: Terjadi kesalahan pada audio. ';
        at.style.color='red';
        var ta=ce('button');
        ta.id='try-again';
        ta.classList.add('audio-button');
        ta.innerHTML='Coba Lagi';
        ac.insertBefore(ta,ac.firstChild);
        ta.onclick=function(e){
          return audioAyat(s,a);
        };
      },true,{});
    });return;
  }
  AUDIO_RES=new Audio(file?file:url);
  if(CONFIG.join_audio&&!file){audioNextRes(s,a);}
  if((DB[parseInt(s)-1].total_ayat>=parseInt(a)-1&&parseInt(a)-1>0&&gebi('ayat-'+(parseInt(a)-1)))
    ||ipage_has_prev){
    prev.disabled=false;
    prev.onclick=function(r){
      AUDIO_RES.pause();
      AUDIO_RES=null;
      a=parseInt(a)-1;
      return audioAyat(ipage_has_prev?ipage_has_prev:s,ipage_has_prev_a?ipage_has_prev_a:a);
    };
  }
  if((DB[parseInt(s)-1].total_ayat>=parseInt(a)+1&&gebi('ayat-'+(parseInt(a)+1)))||ipage_has_next){
    next.disabled=false;
    next.onclick=function(r){
      AUDIO_RES.pause();
      AUDIO_RES=null;
      a=parseInt(a)+1;
      return audioAyat(ipage_has_next?ipage_has_next:s,ipage_has_next_a?ipage_has_next_a:a);
    };
  }
  AUDIO_RES.onerror=function(e){
    ac.removeChild(ldr);
    AUDIO_RES=null;
    at.innerHTML='Error: Terjadi kesalahan pada audio. ';
    at.style.color='red';
    var ta=ce('button');
    ta.id='try-again';
    ta.classList.add('audio-button');
    ta.innerHTML='Coba Lagi';
    ac.insertBefore(ta,ac.firstChild);
    ta.onclick=function(e){
      return audioAyat(s,a);
    };
  };
  AUDIO_RES.onloadeddata=function(e){
    ac.removeChild(ldr);
    ai.onclick=function(e){
      var status=play.getAttribute('status');
      if(status=='pause'){
        var pos=e.clientX/W.innerWidth*100;
        var ct=pos/100*AUDIO_RES.duration;
        AUDIO_RES.currentTime=ct;
        ap.style.width=(AUDIO_RES.currentTime/AUDIO_RES.duration*100)+'%';
        at.innerHTML='['+(AUDIO_RES.currentTime-AUDIO_RES.duration).toFixed(0)+' sec] ';
      }else{
        AUDIO_RES.pause();
        var pos=e.clientX/W.innerWidth*100;
        var ct=pos/100*AUDIO_RES.duration;
        AUDIO_RES.currentTime=ct;
        AUDIO_RES.play();
      }
    };
    AUDIO_RES.ontimeupdate=function(ep){
      if(!AUDIO_RES){return;}
      ap.style.width=(AUDIO_RES.currentTime/AUDIO_RES.duration*100)+'%';
      at.innerHTML='['+(AUDIO_RES.currentTime-AUDIO_RES.duration).toFixed(0)+' sec] ';
    };
    AUDIO_RES.play();
    play.disabled=false;
    play.innerHTML='<i class="fa fa-pause"></i>';
    play.setAttribute('status','play');
    AUDIO_RES.onended=function(){
      play.setAttribute('status','pause');
      play.innerHTML='<i class="fa fa-play"></i>';
      if(AUDIO_REPEAT==1){
        play.setAttribute('status','play');
        play.innerHTML='<i class="fa fa-pause"></i>';
        return AUDIO_RES.play();
      }else if(CONFIG.join_audio){
        a=parseInt(a)+1;
        if(hf&&hf.innerText.match(new RegExp(DB[parseInt(s)-1].name,'g'))){
          if(gebi('ayat-'+a)){return audioAyat(s,a);}
          else if(hf.innerText==DB[parseInt(s)-1].name){
            if(AUDIO_REPEAT==2&&!gebi('ayat-'+a)){
              return audioAyatWait(s);
            }return audioAyat(s,a);
          }else if(!gebi('ayat-'+a)&&AUDIO_REPEAT==2&&!gebi('ipage')){
            for(var i=0;i<a;i++){
              if(gebi('ayat-'+i)){a=i;break;}
            }if(a==1){return audioAyatWait(s);}
            return audioAyat(s,a);
          }
        }else if(ipage){
          var page=parseInt(ipage.getAttribute('pageid'));
          var ipd=pageData(page);
          if(ipd&&ipd.surah&&ipd.ayat){
            var iipd=false;
            for(var ii in ipd.full.ayat){
              if(ii==s&&ipd.full.ayat[ii].indexOf(a)>=0){
                iipd=ii;break;
              }else if(!iipd&&ii==parseInt(s)+1&&ipd.full.ayat[ii].indexOf(1)>=0){
                iipd=ii;a=1;break;
              }
            }
            if(AUDIO_REPEAT==2){
              var last_surah=ipd.full.surah[ipd.full.surah.length-1];
              if(ipd.end==a-1&&s==last_surah){
                return audioAyatWait(ipd.surah,page);
              }else if(iipd){
                return a==1?audioAyatWait(iipd):audioAyat(iipd,a);
              }else{return audioAyat(s,a);}
            }
            else if(iipd){return a==1?audioAyatWait(iipd):audioAyat(iipd,a);}
            else{return audioAyat(s,a);}
          }
        }
      }
    };
    play.onclick=function(e){
      var status=play.getAttribute('status');
      this.blur();
      if(status=='play'){
        AUDIO_RES.pause();
        play.setAttribute('status','pause');
        play.innerHTML='<i class="fa fa-play"></i>';
      }else{
        AUDIO_RES.play();
        play.setAttribute('status','play');
        play.innerHTML='<i class="fa fa-pause"></i>';
      }
    };
  };
}
/* audio prepare next */
function audioNextRes(s,a){
  if(typeof s!=='number'||typeof a!=='number'){return;}
  a=parseInt(a)+1;
  if(!DB[parseInt(s)-1]||DB[parseInt(s)-1].total_ayat<parseInt(a)){
    if(!DB[parseInt(s)]){return;}
    s=parseInt(s)+1;
    a=1;
  }
  var ss=s<10?'00'+s:s<100?'0'+s:s;
  var aa=a<10?'00'+a:a<100?'0'+a:a;
  var type=CONFIG.murattal.substr(-3)=='ogg'?'ogg':'mpeg';
  var ext=CONFIG.murattal.substr(-3)=='ogg'?'ogg':'mp3';
  var url=AUDIO_HOST+CONFIG.murattal+'/'+ss+aa+'.'+ext;
  return new Audio(url);
}
/* audio ayat waiting for loadSurahX done */
function audioAyatWait(s,p){
  var a=false;
  var pd=pageData(p);
  if(pd&&pd.surah&&pd.surah==s&&pd.ayat!=1){
    a=pd.ayat;
  }
  if(AUDIO_WAIT==0&&DB[parseInt(s)-1].bismillah&&!a){
    var bis=new Audio('audio/bismillah.mp3');
    AUDIO_WAIT+=1;
    bis.play();
    bis.onended=function(){
      AUDIO_WAIT+=1;
      return audioAyatWait(s);
    };return;
  }
  if(AUDIO_WAIT==11){AUDIO_WAIT=0;return;}
  if(gebi('ipage')){
    if(!a){AUDIO_WAIT=0;return audioAyat(s,1);}
    if(gebi('ipage-image-'+p)){AUDIO_WAIT=0;return audioAyat(s,a);}
    var aaw=setTimeout(function(){
      AUDIO_WAIT+=1;
      return audioAyatWait(s,p);
    },300);
  }
  if(gebi('ayat-1')){AUDIO_WAIT=0;return audioAyat(s,1);}
  var aaw=setTimeout(function(){
    AUDIO_WAIT+=1;
    return audioAyatWait(s);
  },300);
}
/* hide audio player */
function hideAudioPlayer(){
  if(AUDIO_RES){AUDIO_RES.pause();AUDIO_RES=null;}
  if(DOWNLOAD){DOWNLOAD.abort();DOWNLOAD=null;}
  var ipage=gebi('ipage');
  if(ipage){ipage.style.bottom='0px';}
  var fb=gebi('footbar');
  if(fb){
    fb.style.bottom='-100px';
    fb.style.height='70px';
    fb.style.boxShadow='0px -5px 5px -5px #999';
    fb.style.borderBottom='0px none';
    var fbi=fb.children.length;
    if(fbi){while(fbi--){
      fb.removeChild(fb.children[fbi]);
    }}return;
  }
}
/* ----- bookmark -----
- fn   = (string) function name
- args = (array) arguments
- name = (string) bookmark name
 */
function book(fn,args,name){
  var bs=gebi('bookstar');
  if(bs){bs.parentElement.removeChild(bs);}
  var bf=gebi('bookmark-field');
  if(!bf){return;}
  bf.innerHTML='';
  if(typeof fn!=='string'){return;}
  args=Array.isArray(args)?args:[];
  name=typeof name=='string'?name:'-';
  var s=JSON.stringify([fn,args,name]);
  setCookie('last-page',s,365*7);
  if(HIS.indexOf(s)<(HIS.length-1)||HIS.length==0){HIS.push(s);}
  var spx=gebi('save-page-xml');
  if(spx){spx.onclick=function(){
    menuHide();
    return writeIntentFileXML(fn,args);
  };}
  var bi=BOOK.indexOf(s);
  var cek=bi>=0?true:false;
  var def=['loadAyatX','loadSurahX','loadTafsir','loadMushafPage'];
  if(def.indexOf(fn)<0){return;}
  var html='<div class="each-config">'
    +'<div class="checkbox">'
    +'<input type="checkbox" value="true" id="bookmark-check" '+(cek?'checked="checked"':'')+' />'
    +'<label for="bookmark-check"></label></div>'
    +'<span class="each-label">Penandaan<span>'
    +'</div>';
  bf.innerHTML=html;
  var bc=gebi('bookmark-check');
  if(bc){bc.onchange=function(e){
    return bookSave(s);
  };}
  /* bookstar */
  var bst=setTimeout(function(ee){
    var div=ce('div');
    div.id='bookstar';
    div.classList.add('bookstar');
    if(cek){div.classList.add('bookstar-gold');}
    div.innerHTML='<i class="fa fa-star"></i>';
    D.body.appendChild(div);
    var bs=gebi('bookstar');
    if(bs){bs.oncontextmenu=function(e){
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble=true;
      return false;
    };}
    if(bs){bs.onclick=function(e){
      return bookSave(s);
    };}
  },500);
}
/* bookSave */
function bookSave(s,a){
  var bs=gebi('bookstar');
  var bc=gebi('bookmark-check');
  if(BOOK.indexOf(s)<0){
    if(!a){
      if(bs){bs.classList.add('bookstar-gold');}
      if(bc){bc.checked=true;}
    }
    BOOK.push(s);
    setCookie('quran-bookmark',btoa(JSON.stringify(BOOK)),365*7);
    return splash("Tanda telah disimpan.");
  }else{
    if(!a){
      if(bs){bs.classList.remove('bookstar-gold');}
      if(bc){bc.checked=false;}
    }
    BOOK.splice(BOOK.indexOf(s),1);
    setCookie('quran-bookmark',btoa(JSON.stringify(BOOK)),365*7);
    return splash("Tanda telah dihapus.");
  }
}
/* hide bookmark */
function hideBookmark(){
  var bf=gebi('bookmark-field');
  if(bf){bf.innerHTML='';}
}
/* prepare bookmark */
function prepBookmark(){
  var r=false;
  try{r=JSON.parse(atob(getCookie('quran-bookmark')));}catch(e){}
  if(!r||!Array.isArray(r)){
    r=[];
    /* save bookmark into cookie */
    setCookie('quran-bookmark',btoa(JSON.stringify(r)),365*7);
  }return r;
}
/* load bookmark */
function loadBookmark(n){
  if(!BOOK[n]){return;}
  var data=false;
  try{data=JSON.parse(BOOK[n]);}catch(e){}
  if(!data){return;}
  return W[data[0]].apply(data[0],data[1]);
}
/* load bookmark page - [BOOK] */
function loadBookPage(){
  menuHide();
  if(!licensed()){return;}
  book('loadBookPage',null,'Penandaan');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Penandaan</div>';
  html+='<div id="headfix">Penandaan</div>';
  if(BOOK.length>0){for(var i in BOOK){
    var data=false;
    try{data=JSON.parse(BOOK[i]);}catch(e){}
    if(!data){continue;}
    html+='<div class="each each-hover each-bookmark" onclick="loadBookmark('+i+')" data-key="'+i+'">'
      +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'+data[2]+'</div>'
      +'</div>';
  }}else{
    html+='<div class="each ayat-text-'+FONT_SIZE+'">Penandaan masih kosong.'
      +'<br />Silahkan muat sebuah surah atau tafsir atau mushaf, '
      +'kemudian tandai pada bintang sebelah kanan bawah.'
      +'</div>';
  }INDEX.innerHTML=html;
  var ea=gebcn('each');
  if(!ea){return;}
  var l=ea.length;
  while(l--){ea[l].oncontextmenu=function(e){
    e.preventDefault();
    e.stopPropagation();
    e.cancelBubble=true;
    var key=parseInt(this.getAttribute('data-key'));
    if(!BOOK[key]){return;}
    confirmX('Hapus tanda ini?',function(yes){
      if(!yes){return;}
      BOOK.splice(key,1);
      setCookie('quran-bookmark',btoa(JSON.stringify(BOOK)),365*7);
      splash('Tanda telah dihapus.');
      loadBookPage();
    },'Konfirmasi','Ya','Tidak');
    return false;
  };}
}
/* book Ayat */
function bookAyat(r){
  if(!r||!r.surah_number){
    console.log(r);
    /* this is planned for tafsir to ayat */
    return;
  }
  var ea=[],l=300;
  for(var i=0;i<=l;i++){var tmp=gebi('ayat-'+i);if(tmp){ea.push(tmp);}}
  l=ea.length;if(l==0){return;}
  while(l--){ea[l].oncontextmenu=function(e){
    e.preventDefault&&e.preventDefault();
    e.stopPropagation&&e.stopPropagation();
    e.cancelBubble=true;
    e.returnValue=false;
    var ayat=parseInt(this.id.replace(/[^0-9]+/ig,''));
    var name='Surah '+r.name+' ['+r.surah_number+']'+(ayat>0?'; Read to '+ayat:'');
    var s=JSON.stringify(['loadSurahX',(ayat>0?[r.surah_number,ayat]:[r.surah_number,null]),name]);
    var el=this;
    var id='option-ayat-'+ayat;
    /* removal option elements */
    var old=gebcn('ayat-option');
    if(old){var i=old.length;while(i--){
      old[i].parentElement.removeChild(old[i]);
    }}
    /* end of removal option elements */
    var div=ce('div');
    div.id=id;
    div.classList.add('ayat-option');
    div.classList.add('ayat-text-'+FONT_SIZE);
    var left=(e.clientX+85)>W.innerWidth?W.innerWidth-170:e.clientX<85?10:e.clientX-75;
    div.style.left=left+'px';
    var top=(e.clientY+(95+hbTop()))>W.innerHeight?W.innerHeight-185:e.clientY<(175+hbTop())?(80+hbTop()):e.clientY-(95-hbTop());
    div.style.top=top+'px';
    var html='<div class="each-header rightbar-header" id="'+id+'-header">'+(ayat==299?'Basmalah':ayat==298?'Ta\'awwudz':ayat>0?'Ayat '+ayat:r.name)+'</div>';
    if(ayat<290){
      html+='<div class="ayat-option-each" id="'+id+'-bookmark">'
        +(BOOK.indexOf(s)<0
          ?'<i class="fa fa-star" style="color:#f93;"></i>Tandai '+(ayat>0?'Ayat':'Surah')
          :'<i class="fa fa-remove"></i>Hapus Tanda')+'</div>';
      if(ayat>0){
        html+='<div class="ayat-option-each" id="'+id+'-audio">'
          +'<i class="fa fa-play"></i>Play Audio</div>';
      }
    }else if(ayat==299){
      html+='<div class="ayat-option-each" id="'+id+'-audio">'
        +'<i class="fa fa-play"></i>Play Audio</div>';
    }
    html+='<div class="ayat-option-each" id="'+id+'-tafsir"><i class="fa fa-book"></i>Tafsir '+(ayat==299?'Basmalah':ayat==298?'Ta\'awwudz':ayat>0?'Ayat':'Surah')+'</div>';
    html+='<div class="ayat-option-each" id="'+id+'-copy"><i class="fa fa-copy" style="font-weight:bold;"></i>Copy</div>';
    div.innerHTML=html;
    el.insertBefore(div,el.children[0]);
    if(ayat>0){
      el.classList.add('each-jumped');
      var jts=setTimeout(function(e){
        el.classList.remove('each-jumped');
      },500);
    }
    var ab=gebi(id+'-bookmark');
    var at=gebi(id+'-tafsir');
    var aa=gebi(id);
    var ah=gebi(id+'-header');
    var au=gebi(id+'-audio');
    var copy=gebi(id+'-copy');
    if(copy){copy.onclick=function(e){
      aa.parentElement.removeChild(aa);
      splash('Copied to clipboard.');
      return textCopy(textAyat(r.surah_number,ayat));
    };}
    if(ah){ah.onclick=function(e){aa.parentElement.removeChild(aa);return;};}
    if(au){au.onclick=function(e){
      aa.parentElement.removeChild(aa);
      if(ayat==1||ayat==299){return audioAyatWait(r.surah_number);}
      return audioAyat(r.surah_number,ayat);
    };}
    if(ab){ab.onclick=function(e){
      aa.parentElement.removeChild(aa);
      return bookSave(s,(ayat>0?true:false));
    };}
    if(at){at.onclick=function(e){
      aa.parentElement.removeChild(aa);
      var tin=tafsirIndex();
      var tp=tin[r.surah_number][ayat]?tin[r.surah_number][ayat]:0;
      if(ayat==299){return loadTafsir(1,8);}
      if(ayat==298){return loadTafsir(1,4);}
      return loadTafsir(r.surah_number,tp);
    };}
    return false;
  };}
}
/* generate text ayat for clipboard - require: BANK loaded */
function textAyat(s,a,loaded){
  if(!s||!a){return '';}
  var ss=s<10?'00'+s:s<100?'0'+s:s;
  a=parseInt(a)-1;
  if(!BANK.DB[ss]||!BANK.DB[ss].ayat||!BANK.DB[ss].ayat[a]){return '';}
  var ayat=BANK.DB[ss].ayat[a];
  var cnfg={
    "arabic":true,
    "english":false,
    "indonesian":true,
    "tafsir":false,
    "french":false,
    "spanish":false,
    "russian":false,
    "japanese":false,
    "korean":false,
    "chinese":false,
  };var r=[];
  for(var i in cnfg){
    if(CONFIG[i]){r.push(ayat[i]);}
  }return r.join('\r\n\r\n');
}
/* check and prepare BANK */
function prepBank(s){
  if(!s){return;}
  s=parseInt(s);
  var n=s<10?'00'+s:s<100?'0'+s:s;
  if(BANK.DB[n]){return;}
  var op=new fs();
  if(op.on){
    op.read(op.iapp+QDIR+n+'.db',0,null,function(t){
      var r=false;
      try{r=JSON.parse(t);}catch(e){}
      if(!r.number){console.log(r);return;}
      BANK.DB[n]=r;
    },function(e){
      console.log('Error: Quran database #'+n+'.');
    });return;
  }
  W.post(HOST+QDIR+n+'.db',function(r){
    if(!r.number){console.log(r);return;}
    BANK.DB[n]=r;
  });
}
/* load about page - [BOOK] */
function loadAbout(){
  menuHide();
  if(!licensed()){return;}
  book('loadAbout',null,'Tentang');
  var tf={tiny:18,small:20,normal:23,large:26,huge:30};
  var th=tf[FONT_SIZE];
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Tentang</div>'
    +'<div id="headfix">Tentang</div>'
    +'<div class="each ayat-text-'+FONT_SIZE+' about">'
    +'<h2>Muqadimah</h2>'
    +'<p>Alhamdulillah, atas berkat rahmat Allah Shubhanahu wa Ta\'ala yang senantiasa melimpahkan rahmat-Nya, aplikasi Al-Qur\'an ini dapat diselesaikan dengan berbagai kemudahan.</p>'
    +'<p>Dan shalawat serta salam selalu tercurah kepada jungjungan kita, Nabi Muhammad shalallaahu \'alaihi wa sallam, yang telah berjasa besar bagi ummat Islam, dan berjuang keras demi tegaknya agama Allah.</p>'
    +'<p>Aplikasi ini adalah aplikasi Al-Qur\'an yang dilengkapi dengan terjemahan Indonesia dan beberapa bahasa <em>international</em>, seperti: Inggris, Perancis, Spanyol, Rusia, Jepang, Korea dan Cina. Serta yang tak kalah pentingnya, aplikasi ini juga dilengkapi dengan tafsir berbahasa Indonesia yang akan mempermudah dalam memahami ayat-ayat. Dan juga dilengkapi dengan <em>audio</em> per ayat yang akan membantu bacaan dan tajwid.</p>'
    +'<p>Aplikasi ini memiliki <em>feature</em> pendukung yang dioptimasi, sehingga dapat bekerja dengan cepat. Seperti: memuat ayat dan tafsir lebih optimal, pencarian ayat dan tafsir yang lebih optimal, serta penandaan dan mekanisme halaman lebih praktis.</p>'
    +'<h2>Ketentuan Utama</h2>'
    +'<p>Aplikasi ini adalah aplikasi pribadi, kami menggunakan <em>Private License</em>. Dan aplikasi ini hanya diperuntukan dalam fungsi pribadi atau lingkup <em>Private</em> saja. Pengguna hanya diijinkan menggunakan saja. Aplikasi ini tidak boleh diperjual-belikan, tidak boleh didistribusikan dan tidak boleh pula dimodifikasi tanpa seijin 9r3i. Sesuai dengan ketentuan yang telah tertulis pada <em>License</em> aplikasi ini.</p>'
    +'<p>Seluruh ketentuan terulis disini: <a href="javascript:loadLicense();"><img src="images/license-9r3i_Private_License-green.svg" alt="Private License" style="width:auto;height:'+th+'px;" /></a></p>'
    +'<h2>Donasi</h2>'
    +'<p>Bagaimana cara memberikan dukungan finansial terhadap perkembangan <em>software</em> ini?</p>'
    +'<p>Donasi dapat disalurkan melalui:</p>'
    +'<p><ol>'
    +'<li>Bank Account:<br />'
    +'Bank BNI (009) 1262420702<br />'
    +'Recipient\'s name: Luthfie Al Ansh&aacute;ry<br />'
    +'<em>BIC/SWIFT: BNINIDJABKS</em></li>'
    +'<li>Paypal by clicking this link:<br />'
    +'<a href="https://paypal.me/9r3i" target="_blank"><img src="images/paypal-donate-yellowgreen.svg" alt="PayPal Donate" style="width:auto;height:'+th+'px;" /></a>'
    +'</li>'
    +'</ol></p>'
    +'<h2>Penutup</h2>'
    +'<p>Bila ada pengguna yang mempunyai saran, kritik, masukan atau mendapati kesalahan pada aplikasi ini, silahkan hubungi kami melalui:</p>'
    +'<p>Email: luthfie@y7mail.com<br />Phone: +62 821-1071-9711</p>'
    +'<p>Sekian dari kami, dengan segala kekurangannya. Mohon maaf bila ada kesalahan kata.<br />Semoga aplikasi ini dapat menjadi bermanfaat bagi penggunanya.</p>'
    +'<p>--</p>'
    +'<p>Bekasi, 22 November 2017</p>'
    +'<p>&nbsp;</p>'
    +'<p><a href="https://luthfie.com/?author=1" target="_blank"><img src="images/author-9r3i-lightgrey.svg" alt="Author" style="width:auto;height:'+th+'px;" /></a></p>'
    +'<p>--9r3i a.k.a. Abu Ayyub a.k.a. Luthfie</p>'
    +'<p></p>'
    +'</div>';
  INDEX.innerHTML=html;
  scrollBBToTop();
}
/* load search page - [BOOK] */
function loadSearchPage(){
  menuHide();
  if(!licensed()){return;}
  book('loadSearchPage',null,'Pencarian');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Pencarian</div>'
      +'<div id="headfix">Pencarian</div>'
      +'<div class="each-config">'
      +'<div class="checkbox">'
      +'<input type="checkbox" value="true" id="search-tafsir" '
      +(SEARCH_TAFSIR?'checked="checked"':'')+' />'
      +'<label for="search-tafsir"></label></div>'
      +'<span class="each-label ayat-text-'+FONT_SIZE+'">Cari pada Tafsir<span>'
      +'</div>'
    +'<div class="each" style="background-color:#fff;"><div class="input-text" id="input-search-key">'
    +'<div class="label"><label for="search" class="ayat-text-'+FONT_SIZE+'">Cari</label></div>'
    +'<input class="input-clean" type="text" id="search" />'
    +'</div></div><div id="search-result">'
    +'<div class="each ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
    +'Masukan kata kunci, kemudian tekan GO atau Enter untuk pencarian menyeluruh.<br /><br />'
    +'Tanda plus (+) untuk parameter DAN.<br />'
    +'Tanda slash (/) untuk parameter ATAU.<br />'
    +'<br />'
    +'Contoh: <span style="color:red;font-size:inherit;">dua, tiga atau empat/dua+tiga+empat</span>'
    +'<br />'
    +'Artinya: "dua, tiga atau empat" ATAU "dua" DAN "tiga" DAN "empat"'
    +'</div>'
    +'</div>';
  INDEX.innerHTML=html;
  inputText('input-search-key');
  var input=gebi('search');
  var sr=gebi('search-result');
  var st=gebi('search-tafsir');
  if(st){st.onchange=function(e){
    var cek=this.checked?true:false;
    setCookie('search-tafsir',cek);
    SEARCH_TAFSIR=cek;
  };}
  if(input&&sr){input.onkeyup=function(e){
    var val=this.value;
    var fontfamily=val.match(/[\u0600-\u06ff]/ig)?'Traditional Arabic':'inherit';
    var fontclass=val.match(/[\u0600-\u06ff]/ig)?'ayat-arabic-'+FONT_SIZE:'inherit';
    if(e.keyCode!=13){
      var tmp='',res_count=0;
      for(var i in DB){
        if(DB[i].name.match(new RegExp(val,'ig'))
          ||searchSurahPrefix(DB[i].name).match(new RegExp(val,'ig'))
          ||searchSurahPrefix(DB[i].name).replace(' ','').match(new RegExp(val,'ig'))
          ||DB[i].nuzul.match(new RegExp(val,'ig'))
          ||DB[i].indonesian_name.match(new RegExp(val,'ig'))
          ||DB[i].arabic_name.match(new RegExp(val,'ig'))
          ||DB[i].surah_number.toString().match(new RegExp(val,'ig'))){
          var jsf=SEARCH_TAFSIR
            ?'loadTafsir('+DB[i].surah_number+',0)'
            :'loadSurahX('+DB[i].surah_number+')';
          tmp+='<div class="each"><div class="ayat-text ayat-text-'+FONT_SIZE+'">'
            +'<a href="javascript:'+jsf+'" '+'class="ayat-text-'+FONT_SIZE+'">'
            +(SEARCH_TAFSIR?'Tafsir Surah':'Q.S.')+' '+DB[i].name+' ['+DB[i].surah_number+']</a>'
            +'</div></div>';
          res_count++;
        }
      }sr.innerHTML='';
      if(res_count==0){
        sr.innerHTML+='<div class="each ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
          +'Hasil pencarian nihil untuk '
          +'"<span style="color:red;font-weight:bold;font-family:'+fontfamily+';" class="'+fontclass+'">'
          +val+'</span>".<div class="ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
          +'Tekan GO atau Enter untuk pencarian menyeluruh.</div></div>';
        return;
      }
      sr.innerHTML+='<div class="each ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
        +'<span style="color:green;font-weight:bold;font-size:inherit;">'
        +res_count+'</span> hasil pencarian untuk '
        +'"<span style="color:red;font-weight:bold;font-family:'+fontfamily+';" class="'+fontclass+'">'
        +val+'</span>".<div class="ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
        +'Tekan GO atau Enter untuk pencarian menyeluruh.</div></div>';
      sr.innerHTML+=tmp;
      return;
    }
    if(val==''){return;}
    this.value='';
    this.setAttribute('class','input-text input-clean');
    this.blur();
    sr.innerHTML='';
    loader('Searching...<br />'
      +'<span id="search-progress" style="font-family:inherit;font-size:inherit;"></span>');
    var trans={
      "arabic":"Arabic",
      "indonesian":"Indonesia",
      "english":"Inggris",
      "french":"Perancis",
      "spanish":"Spanyol",
      "russian":"Rusia",
      "japanese":"Jepang",
      "korean":"Korea",
      "chinese":"Cina",
      "spell":"Ejaan Latin",
      "tafsir":"Tafsir Arab",
    };
    search(val,function(r){
      /* result of search: index, name, lang, ayat, text */
      /* result of tafsir: n, t, name, title, text */
      if(r.length==0){
        sr.innerHTML+='<div class="each ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
          +'Hasil pencarian nihil untuk '
          +'"<span style="color:red;font-weight:bold;font-family:'+fontfamily+';" class="'+fontclass+'">'
          +val+'</span>".<div>';
        return;
      }
      sr.innerHTML+='<div class="each ayat-text-'+FONT_SIZE+'" style="text-align:center;">'
        +'<span style="color:green;font-weight:bold;font-size:inherit;">'
        +r.length+'</span> hasil pencarian untuk '
        +'"<span style="color:red;font-weight:bold;font-family:'+fontfamily+';" class="'+fontclass+'">'
        +val+'</span>".<div>';
      var html='';
      var regs=val.split(/\s*\/\s*/ig);
      if(regs>1){regs.unshift(val);}
      var reg=new RegExp(val,'ig');
      for(var i in r){
        if(r[i].index){
          var type='text';
          if(r[i].lang=='arabic'){type='arabic';}
          if(r[i].lang=='tafsir'){type='tafsir';}
          var text=r[i].text;
          for(var ri in regs){
            if(regs[ri].match(/\+/ig)){
              var regsi=regs[ri].split(/\s*\+\s*/ig);
              var regst=0;
              for(var si in regsi){
                text=text.replace(new RegExp(regsi[si],'ig'),function(m){
                  return '<span class="search-red-result">'+m+'</span>';
                });
              }
            }else{
              text=text.replace(new RegExp(regs[ri],'ig'),function(m){
                return '<span class="search-red-result">'+m+'</span>';
              });
            }
          }
          html+='<div class="each">'
            +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'
            +'<a href="javascript:loadAyatX('+r[i].index+','+r[i].ayat+')" class="ayat-text-'+FONT_SIZE+'">'
            +'['+r[i].name+': '+r[i].ayat+'; '+trans[r[i].lang]+']</a></div>'
            +'<div class="ayat-'+type+' ayat-'+type+'-'+FONT_SIZE+'">'+text+'</div>'
            +'</div>';
        }else if(r[i].n){
          html+='<div class="each">'
            +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'
            +'<span style="font-weight:bold;" class="ayat-text-'+FONT_SIZE+'">'
            +'[Tafsir]</span> '
            +'<span style="font-style:italic;" class="ayat-text-'+FONT_SIZE+'">'+r[i].name+'</span></div>'
            +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'
            +'<a href="javascript:loadTafsir('+r[i].n+','+r[i].t+')" '
            +'class="ayat-text-'+FONT_SIZE+'">'
            +''+r[i].title+'</a></div>'
            +'</div>';
        }
      }sr.innerHTML+=html;
    });
  };}
  function searchSurahPrefix(s){
    s=s.toString();
    s=s.replace(/\-/ig,' ').replace(/[`']/ig,'');
    var tp='',st='';
    for(var i=0;i<s.length;i++){
      if(s[i]===st){continue;}
      st=s[i];tp+=s[i];
    }return tp;
  }
}
/* search */
function search(s,cb,n,r){
    if(SEARCH_TAFSIR){
      n=0;
      searchTafsir(s,cb,n,r);
      return;
    }
  n=n?n:0;
  r=Array.isArray(r)?r:[];
  if(!DB||!DB[n]||s==''||s.replace(/\s*\/\s*/ig,'')==''){
    loader(false);
    if(typeof cb=='function'){
      return cb(r);
    }return;
  }
  var sp=gebi('search-progress');
  if(sp){sp.innerText=DB[n].name;}
  var tl=['arabic','tafsir','spell','indonesian','english','french','spanish','russian','japanese','korean','chinese'];
  var regs=s.split(/\s*\/\s*/ig);
  if(regs>1){regs.unshift(s);}
  var nu=n+1;
  var ni=nu<10?'00'+nu:nu<100?'0'+nu:nu;
  if(BANK.DB[ni]){
    var ayat=BANK.DB[ni].ayat;
    for(var i=0;i<ayat.length;i++){
      for(var ii in tl){
        var tli=tl[ii];
        for(var ri in regs){
          if(regs[ri].match(/\+/ig)){
            var regsi=regs[ri].split(/\s*\+\s*/ig);
            var regst=0;
            for(var si in regsi){
              if(CONFIG[tli]&&ayat[i][tli].match(new RegExp(regsi[si],'ig'))){regst++;}
            }
            if(regst>=regsi.length){
              r.push({"index":nu,"name":BANK.DB[ni].name,"lang":tli,"ayat":(i+1),"text":ayat[i][tli]});
              break;
            }
          }else{
            if(CONFIG[tli]&&ayat[i][tli].match(new RegExp(regs[ri],'ig'))){
              r.push({"index":nu,"name":BANK.DB[ni].name,"lang":tli,"ayat":(i+1),"text":ayat[i][tli]});
              break;
            }
          }
        }
      }
    }n++;
    return search(s,cb,n,r);
  }
  var op=new fs();
  if(op.on){
    op.read(op.iapp+QDIR+ni+'.db',0,null,function(t){
      var rx=false;
      try{rx=JSON.parse(t);}catch(e){}
      if(!rx.number){
        splash('Error: Failed to load surah '+DB[n].name+'.');
        n++;return search(s,cb,n,r);
      }BANK.DB[ni]=rx;
      return search(s,cb,n,r);
    },function(e){
      splash('Error: Failed to load surah '+DB[n].name+'.');
      n++;return search(s,cb,n,r);
    });return;
  }
  W.post(HOST+QDIR+ni+'.db',function(rx){
    if(!rx.number){
      splash('Error: Failed to load surah '+DB[n].name+'.');
      n++;return search(s,cb,n,r);
    }BANK.DB[ni]=rx;
    return search(s,cb,n,r);
  });
}
/* search tafsir */
function searchTafsir(s,cb,n,r){
  n=n?n:0;
  r=Array.isArray(r)?r:[];
  if(!TDB||!TDB[n]||s==''||s.replace(/\s*\/\s*/ig,'')==''){
    loader(false);
    if(typeof cb=='function'){
      return cb(r);
    }return;
  }
  var sp=gebi('search-progress');
  if(sp){sp.innerText='[Tafsir] '+TDB[n].name;}
  var regs=s.split(/\s*\/\s*/ig);
  if(regs>1){regs.unshift(s);}
  if(BANK.TDB[n]){
    var data=BANK.TDB[n];
    for(var i in data.part){
      for(var ri in regs){
        if(regs[ri].match(/\+/ig)){
          var regsi=regs[ri].split(/\s*\+\s*/ig);
          var regst=0;
          for(var si in regsi){
            if(data.part[i].text.match(new RegExp(regsi[si],'ig'))){regst++;}
          }
          if(regst>=regsi.length){
            r.push({"n":n,"t":i,"name":data.name,"title":data.part[i].title,"text":data.part[i].text});
            break;
          }
        }else{
          if(data.part[i].text.match(new RegExp(regs[ri],'ig'))){
            r.push({"n":n,"t":i,"name":data.name,"title":data.part[i].title,"text":data.part[i].text});
            break;
          }
        }
      }
    }n++;
    return searchTafsir(s,cb,n,r);
  }
  var op=new fs();
  if(op.on){
    op.read(op.iapp+TDIR+TDB[n].cid+'.db',0,null,function(t){
      var rx=false;
      try{rx=JSON.parse(t);}catch(e){}
      if(!rx.cid){
        splash(rx);n++;
        return searchTafsir(s,cb,n,r);
      }BANK.TDB[n]=rx;
      return searchTafsir(s,cb,n,r);
    },function(e){
      splash('Error: Failed to load tafsir database.');
      n++;return searchTafsir(s,cb,n,r);
    });return;
  }
  W.post(HOST+TDIR+TDB[n].cid+'.db',function(rx){
    if(!rx.cid){
      splash(rx);n++;
      return searchTafsir(s,cb,n,r);
    }BANK.TDB[n]=rx;
    return searchTafsir(s,cb,n,r);
  });
}
/* show menu of jump to ayat - mushaf */
function showJumpMenuMushaf(n){
  menuHide();
  var jbg=gebi('jta-bg');
  var jta=gebi('jump-to-ayat');
  if(jbg){jbg.parentElement.removeChild(jbg);}
  if(jta){jta.parentElement.removeChild(jta);}
  var store='';
  for(var i=1;i<=604;i++){
    store+='<option value="'+i+'" '+(i==n?'selected="selected"':'')+'>'
      +i+'</option>';
  }
  var html='<div class="each-header rightbar-header">Loncat Halaman</div>'
    +'<div class="each-config">'
    +'<select class="select" id="jump-to-ayat-select"></select>'
    +'</div>';
  var bg=ce('div');
  bg.id='jta-bg';
  D.body.appendChild(bg);
  var div=ce('div');
  div.id='jump-to-ayat';
  div.innerHTML=html;
  D.body.appendChild(div);
  var jt=gebi('jump-to-ayat-select');
  jt.style.float='none';
  jt.style.maxWidth='100px';
  jt.parentElement.style.textAlign='center';
  jt.innerHTML=store;
  jt.onchange=function(e){
    var val=this.value;
    var jbg=gebi('jta-bg');
    var jta=gebi('jump-to-ayat');
    if(jbg){jbg.parentElement.removeChild(jbg);}
    if(jta){jta.parentElement.removeChild(jta);}
    var r=pageData(val);
    if(!r||!r.surah||!r.ayat){return;}
    return loadMushaf(r.surah,r.ayat);
  };
  var jbg=gebi('jta-bg');
  if(jbg){jbg.onclick=function(e){
    var jbg=gebi('jta-bg');
    var jta=gebi('jump-to-ayat');
    if(jbg){jbg.parentElement.removeChild(jbg);}
    if(jta){jta.parentElement.removeChild(jta);}
  };}
}
/* show menu of jump to ayat - tafsir */
function showJumpMenuTafsir(n){
  menuHide();
  var jbg=gebi('jta-bg');
  var jta=gebi('jump-to-ayat');
  if(jbg){jbg.parentElement.removeChild(jbg);}
  if(jta){jta.parentElement.removeChild(jta);}
  if(!TDB[n]){return;}
  var hist=JSON.parse(HIS[HIS.length-1]);
  var store='';
  for(var i=0;i<TDB[n].part.length;i++){
    store+='<option value="'+i+'" '+(i==hist[1][1]?'selected="selected"':'')+'>'
      +TDB[n].part[i].title+'</option>';
  }if(store==''){return;}
  var html='<div class="each-header rightbar-header">Tafsir Pasal</div>'
    +'<div class="each-config">'
    +'<select class="select" id="jump-to-ayat-select"></select>'
    +'</div>';
  var bg=ce('div');
  bg.id='jta-bg';
  D.body.appendChild(bg);
  var div=ce('div');
  div.id='jump-to-ayat';
  div.innerHTML=html;
  D.body.appendChild(div);
  var jt=gebi('jump-to-ayat-select');
  jt.style.float='none';
  jt.style.maxWidth='100px';
  jt.parentElement.style.textAlign='center';
  jt.innerHTML+=store;
  jt.onchange=function(e){
    var val=this.value;
    var jbg=gebi('jta-bg');
    var jta=gebi('jump-to-ayat');
    if(jbg){jbg.parentElement.removeChild(jbg);}
    if(jta){jta.parentElement.removeChild(jta);}
    return loadTafsir(n,parseInt(val));
  };
  var jbg=gebi('jta-bg');
  if(jbg){jbg.onclick=function(e){
    var jbg=gebi('jta-bg');
    var jta=gebi('jump-to-ayat');
    if(jbg){jbg.parentElement.removeChild(jbg);}
    if(jta){jta.parentElement.removeChild(jta);}
  };}
}
/* show menu of jump to ayat */
function showJumpMenu(){
  menuHide();
  if(!licensed()){return;}
  var tafsirH=gebi('tafsir-header');
  if(tafsirH){
    var tid=tafsirH.getAttribute('tafsir-index');
    return showJumpMenuTafsir(parseInt(tid));
  }
  var ip=gebi('ipage');
  if(ip){
    var ipid=ip.getAttribute('pageid');
    return showJumpMenuMushaf(ipid);
  }
  var jbg=gebi('jta-bg');
  var jta=gebi('jump-to-ayat');
  if(jbg){jbg.parentElement.removeChild(jbg);}
  if(jta){jta.parentElement.removeChild(jta);}
  var store='',ayat_offset=false;
  for(var i=1;i<290;i++){
    var el=gebi('ayat-'+i);
    if(el){
      if(!ayat_offset&&el.offsetTop>BB.scrollTop){
        store+='<option value="'+i+'" selected="selected">'+i+'</option>';
        ayat_offset=true;
      }else{
        store+='<option value="'+i+'">'+i+'</option>';
      }
    }
  }if(store==''){return;}
  var html='<div class="each-header rightbar-header">Loncat ke Ayat</div>'
    +'<div class="each-config">'
    +'<select class="select" id="jump-to-ayat-select"></select>'
    +'</div>';
  var bg=ce('div');
  bg.id='jta-bg';
  D.body.appendChild(bg);
  var div=ce('div');
  div.id='jump-to-ayat';
  div.innerHTML=html;
  D.body.appendChild(div);
  var jt=gebi('jump-to-ayat-select');
  jt.style.float='none';
  jt.parentElement.style.textAlign='center';
  jt.innerHTML+=store;
  jt.onchange=function(e){
    var val=this.value;
    var jbg=gebi('jta-bg');
    var jta=gebi('jump-to-ayat');
    if(jbg){jbg.parentElement.removeChild(jbg);}
    if(jta){jta.parentElement.removeChild(jta);}
    return jumpToAyat(val);
  };
  var jbg=gebi('jta-bg');
  if(jbg){jbg.onclick=function(e){
    var jbg=gebi('jta-bg');
    var jta=gebi('jump-to-ayat');
    if(jbg){jbg.parentElement.removeChild(jbg);}
    if(jta){jta.parentElement.removeChild(jta);}
  };}
}
/* hide jump menu */
function hideJumpMenu(){
  var jbg=gebi('jta-bg');
  var jta=gebi('jump-to-ayat');
  if(jbg){jbg.parentElement.removeChild(jbg);}
  if(jta){jta.parentElement.removeChild(jta);}
}
/* jump to ayat */
function jumpToAyat(n){
  menuHide();
  if(!n){return;}
  var id='ayat-'+n;
  var el=gebi(id);
  if(!el){splash('Error: Cannot find element ayat.');return;}
  var hfh=31;
  scrollBBTo(id,function(el){
    el.classList.add('each-jumped');
    var jts=setTimeout(function(e){
      el.classList.remove('each-jumped');
    },1000);
  });
}
/* load tafsir from right-bar */
function loadTafsirRB(){
  menuHide();
  var cid=gebi('cid');
  var tid=gebi('tid');
  if(!tid||!cid){return;}
  return loadTafsir(cid.value,tid.value);
}
/* load tafsir index - [BOOK] */
function loadTafsir(n,p,recursive){
  menuHide();
  if(!licensed()){return;}
  if(!TDB[n]||!TDB[n].part[p]){return;}
  var cid=n<10?'00'+n:n<100?'0'+n:n;
  if(BANK.TDB[n]&&BANK.TDB[n].part[p]){
    var t=TDB[n].part[p].title;
    book('loadTafsir',[parseInt(n),parseInt(p)],'[Tafsir] '+t);
    var s=JSON.stringify(['loadTafsir',[parseInt(n),parseInt(p)],'[Tafsir] '+t]);
    var data=BANK.TDB[n].part[p];
    var header='<div class="each-header ayat-text-'+FONT_SIZE+'" id="tafsir-header" tafsir-index="'+n+'">'
      +'[Tafsir]<br />'
      +'<span class="ayat-text-'+FONT_SIZE+'">'+t+'</span></div>';
    header+='<div id="headfix" onclick="showJumpMenuTafsir('+n+')">[Tafsir] '+t+'</div>';
    var html='<div class="tafsir-content ayat-text-'+FONT_SIZE+'" id="tafsir-content">'+data.text+'</div>';
    INDEX.innerHTML=header+html;
    var par=gebtn('p');
    if(par){var i=par.length;while(i--){
      par[i].setAttribute('class','tafsir-paragraph ayat-text-'+FONT_SIZE);
    }}
    var spa=gebcn('tafsir-span');
    if(spa){var i=spa.length;while(i--){
      if(!spa[i].innerHTML.match(/^[\x00-xff]+$/ig)){
        var ah=spa[i].innerHTML;
        spa[i].innerHTML=numberChangeToArabic(ah);
        spa[i].parentElement.style.direction='rtl';
        spa[i].parentElement.style.textAlign='right';
        spa[i].setAttribute('class','tafsir-arabic ayat-arabic-'+FONT_SIZE);
      }else{
        spa[i].setAttribute('class','tafsir-span ayat-text-'+FONT_SIZE);
      }
    }}
    OPENED_SURAH=null;
    LOADED_AYAT=0;
    scrollBBToTop();
    var th=gebi('tafsir-header');
    if(th){th.oncontextmenu=function(e){
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble=true;
      /* removal option elements */
      var old=gebcn('ayat-option');
      if(old){var i=old.length;while(i--){
        old[i].parentElement.removeChild(old[i]);
      }}
      showJumpMenuTafsir(n);
      return false;
    };}
    /* right click - bookmark */
    var tc=gebi('tafsir-content');
    if(tc){tc.oncontextmenu=function(e){
      e.preventDefault&&e.preventDefault();
      e.stopPropagation&&e.stopPropagation();
      e.cancelBubble=true;
      e.returnValue=false;
      /* get ayat */
      var mi=t.match(/\d+/ig);
      var mo=t.match(/ayat/ig);
      var mm=mi&&mo?parseInt(mi[0]):0;
      var id='option-tafsir';
      /* removal option elements */
      var old=gebcn('ayat-option');
      if(old){var i=old.length;while(i--){
        old[i].parentElement.removeChild(old[i]);
      }}
      /* end of removal option elements */
      var div=ce('div');
      div.id=id;
      div.classList.add('ayat-option');
      div.classList.add('ayat-text-'+FONT_SIZE);
      var left=(e.clientX+85)>W.innerWidth?W.innerWidth-170:e.clientX<85?10:e.clientX-75;
      div.style.left=left+'px';
      var top=(e.clientY+(95+hbTop()))>W.innerHeight?W.innerHeight-185:e.clientY<(175+hbTop())?(80+hbTop()):e.clientY-(95-hbTop());
      div.style.top=top+'px';
      var html='<div class="each-header rightbar-header" id="'+id+'-header">Tafsir Opsi</div>';
      html+='<div class="ayat-option-each" id="'+id+'-bookmark">'
        +(BOOK.indexOf(s)<0
          ?'<i class="fa fa-star" style="color:#f93;"></i>Tandai'
          :'<i class="fa fa-remove"></i>Hapus Tanda')
        +'</div>';
      html+='<div class="ayat-option-each" id="'+id+'-load">'
        +'<i class="fa fa-external-link"></i>Muat '+(mm>0?'Ayat '+mm:'Surah')+'</div>';
      html+='<div class="ayat-option-each" id="'+id+'-jump"><i class="fa fa-book"></i>Tafsir Pasal</div>';
      html+='<div class="ayat-option-each" id="'+id+'-copy"><i class="fa fa-copy" style="font-weight:bold;"></i>Copy</div>';
      div.innerHTML=html;
      var text=tc.innerText;
      tc.insertBefore(div,tc.children[0]);
      var ab=gebi(id+'-bookmark');
      var at=gebi(id+'-load');
      var aj=gebi(id+'-jump');
      var aa=gebi(id);
      var ah=gebi(id+'-header');
      var copy=gebi(id+'-copy');
      if(copy){copy.onclick=function(e){
        aa.parentElement.removeChild(aa);
        splash('Copied to clipboard.');
        return textCopy(text);
      };}
      if(ah){ah.onclick=function(e){aa.parentElement.removeChild(aa);return;};}
      if(ab){ab.onclick=function(e){
        aa.parentElement.removeChild(aa);
        return bookSave(s);
      };}
      if(at){at.onclick=function(e){
        aa.parentElement.removeChild(aa);
        return loadSurahX(n,mm);
      };}
      if(aj){aj.onclick=function(e){
        aa.parentElement.removeChild(aa);
        return showJumpMenuTafsir(n);
      };}
      return false;
    };}return;
  }
  if(recursive){splash('Error: Cannot request database recursively.');return;}
  loader('Loading...<br />Tafsir: '+TDB[n].name);
  var op=new fs();
  if(op.on){
    op.read(op.iapp+TDIR+cid+'.db',0,null,function(t){
      loader(false);
      var r=false;
      try{r=JSON.parse(t);}catch(e){}
      if(!r.cid){return splash(r);}
      BANK.TDB[n]=r;
      return loadTafsir(n,p,true);
    },function(e){
      loader(false);
      return splash('Error: Failed to load tafsir database.');
    });return;
  }
  W.post(HOST+TDIR+cid+'.db',function(r){
    loader(false);
    if(!r.cid){splash(r);return;}
    BANK.TDB[n]=r;
    return loadTafsir(n,p,true);
  });
}
/* create index of tafsir */
function tafsirIndex(){
  var r={};
  for(var i in TDB){
    if(i==0){continue;}
    var aid=parseInt(TDB[i].cid).toString();
    r[aid]={};
    for(var ii in TDB[i].part){
      var mi=TDB[i].part[ii].title.match(/\d+/ig);
      var mo=TDB[i].part[ii].title.match(/ayat/ig);
      if(mi&&mo){
        var tia=tafsirIndexAyat(mi);
        for(var ie in tia){
          r[aid][parseInt(tia[ie])]=ii;
        }
      }
    }
  }return r;
  function tafsirIndexAyat(ar){
    if(!Array.isArray(ar)||ar.length==0){return;}
    if(ar.length==1){return ar;}
    var t=[];
    for(var i=parseInt(ar[0]);i<=parseInt(ar[1]);i++){
      t.push(i);
    }return t;
  }
}
/* start load ayat */
function loadAyatStart(){
  var las=gebi('la-surah');
  var laa=gebi('la-ayat');
  var lal=gebi('la-length');
  if(!las||!laa||!lal||las.value==''){return;}
  loadAyatX(las.value,laa.value,lal.value);
}
/* load right bar content */
function loadRightBarContent(){
  if(!DB||!RBAR){return;}
  var html='';
  /* load bookmark field */
  html+='<div id="bookmark-field"></div>';
  /* save xml form */
  html+='<div class="each-config">'
    +'<button class="audio-button" style="float:right;margin-top:-5px;" id="save-page-xml">'
    +'<i class="fa fa-save"></i></button>'
    +'<span class="each-label">Simpan Halaman<span></div>';
  /* config join audio */
    html+='<div class="each-config">'
      +'<div class="checkbox">'
      +'<input type="checkbox" value="true" id="join_audio_rb" '
      +(CONFIG.join_audio?'checked="checked"':'')+' />'
      +'<label for="join_audio_rb"></label></div>'
      +'<span class="each-label">Audio bersambung<span>'
      +'</div>';
  /* murattal syeikh */
  html+='<div class="each-config">'
    +'<span class="each-label">Murattal<span>'
    +'<select class="select" id="murattal-rb"></select>'
    +'</div>';
  /* load ayat form */
  html+='<div class="each-header rightbar-header">Muat Ayat</div>';
  html+='<div class="each-config">'
    +'<select class="select" id="la-surah"><option value="">Nama Surah</option></select>'
    +'<select class="select" id="la-ayat"><option value="">0</option></select>'
    +'<select class="select" id="la-length"><option value="">0</option></select>'
    +'<div style="text-align:center;">'
    +'<input type="submit" class="submit-load-ayat" onclick="loadAyatStart()" value="Mulai Memuat" '
    +' style="margin:10px 0px 0px;" /></div>'
    +'</div>';
  /* other form */
  
  
  /* insert into right-bar inner HTML */
  RBAR.innerHTML=html+'<div style="height:75px;background-color:#fff;"></div>';

  /* murattal */
  var mur=gebi('murattal-rb');
  if(mur){
    mur.style.maxWidth='100%';
    mur.style.float='none';
    var opt='';
    var sy=syeikh();
    for(var iy in sy){
      opt+='<option value="'+iy+'" '+(CONFIG.murattal==iy?'selected="selected"':'')+'>'+sy[iy]+'</option>';
    }mur.innerHTML=opt;
    mur.onchange=function(e){
      CONFIG.murattal=this.value;
      setCookie('quran-config',btoa(JSON.stringify(CONFIG)),365*7);
    };
  }
  /* join audio */
  var jaud=gebi('join_audio_rb');
  if(jaud){jaud.onchange=function(e){
    CONFIG.join_audio=this.checked?true:false;
    setCookie('quran-config',btoa(JSON.stringify(CONFIG)),365*7);
    var jarc=gebi('join_audio');
    if(jarc){jarc.checked=this.checked;}
  };}
  /* ----- starting of load ayat ----- */
  var las=gebi('la-surah');
  var laa=gebi('la-ayat');
  var lal=gebi('la-length');
  las.style.marginRight='5px';
  laa.style.marginRight='5px';
  las.style.float='none';
  laa.style.float='none';
  lal.style.float='none';
  las.style.width='131px';
  laa.style.width='43px';
  lal.style.width='43px';
  var temp='';
  for(var i in DB){
    temp+='<option value="'+DB[i].surah_number+'">'+DB[i].surah_number+'. '+DB[i].name+'</option>';
  }las.innerHTML+=temp;
  las.onchange=function(e){
    var sur=parseInt(this.value)-1;
    if(!DB[sur]){return;}
    var temp='';
    for(var i=0;i<DB[sur].total_ayat;i++){
      temp+='<option value="'+(i+1)+'">'+(i+1)+'</option>';
    }
    laa.innerHTML=temp;
    lal.innerHTML=temp;
  };
  /* ----- end of load ayat ----- */
}
/* load surah 2 - [BOOK] */
function loadSurahX(n,j){
  menuHide();
  if(!licensed()){return;}
  if(!n.toString().match(/^\d{1,3}$/ig)){return;}
  n=parseInt(n);
  if(!n||!DB[n-1]){splash('Error: Invalid argument.');return;}
  j=typeof j=='number'?parseInt(j):j;
  var rs=typeof j=='number'?', Read to '+j.toString():'';
  var name='Surah '+DB[n-1].name+' ['+DB[n-1].surah_number+']'+rs;
  book('loadSurahX',[n,j],name);
  var nu=n<10?'00'+n:n<100?'0'+n:n;
  INDEX.innerHTML='';
  loadSurah(nu,0,290,false);
  OPENED_SURAH=null;
  LOADED_AYAT=0;
  loadSurahXJump(j);
  loadSurahXBook();
  function loadSurahXBook(){
    var lsxt=setTimeout(function(e){
      var st=false;
      for(var i=1;i<290;i++){if(gebi('ayat-'+i)){st=true;break;}}
      return st?bookAyat(DB[n-1]):loadSurahXBook(j);
    },100);
  }
  function loadSurahXJump(j){
    if(typeof j=='number'){
      setTimeout(function(e){
        return gebi('ayat-'+j)?jumpToAyat(j):loadSurahXJump(j);
      },100);
    }
  }
}
/* load one ayat - [BOOK] */
function loadAyatX(s,a,l,j){
  menuHide();
  if(!licensed()){return;}
  var n=parseInt(s);
  if(!DB[n-1]){return;}
  var r=DB[n-1];
  a=parseInt(a);
  l=l?parseInt(l):1;
  var until=(a+l)>r.total_ayat?r.total_ayat:(a+l-1);
  var header='<div class="each-header ayat-text-'+FONT_SIZE+'">'
    +'<div class="each-header-arabic ayat-arabic-'+FONT_SIZE+'">'+r.arabic_name+'</div>'
    +'<div class="ayat-text-'+FONT_SIZE+'" style="font-weight:bold;">'
    +r.surah_number+'. '+r.name+' ('+r.indonesian_name+')</div>'
    +'<div class="ayat-text-'+FONT_SIZE+'">'+r.total_ayat+' ayat ('+r.nuzul+')</div>'
    +'<div class="ayat-text-'+FONT_SIZE+'">Ayat '+(l>1?a+'-'+until:a)+'</div>'
    +'</div>';
  header+='<div id="headfix" onclick="showJumpMenu()">'+r.name+' (Ayat '+(l>1?a+'-'+until:a)+')</div>';
  INDEX.innerHTML=header;
  j=typeof j=='number'?parseInt(j):j;
  book('loadAyatX',[n,a,l,j],'Surah '+r.name+' ['+r.surah_number+'], Ayat '+(l>1?a+'-'+until:a));
  n=n<10?'00'+n:n<100?'0'+n:n;
  loadSurah(n,(a-1),l,true);
  OPENED_SURAH=null;
  LOADED_AYAT=0;
  loadSurahXJump(j);
  loadSurahXBook();
  function loadSurahXBook(){
    var laxt=setTimeout(function(e){
      var st=false;
      for(var i=1;i<290;i++){if(gebi('ayat-'+i)){st=true;break;}}
      return st?bookAyat(DB[n-1]):loadSurahXBook(j);
    },100);
  }
  function loadSurahXJump(j){
    if(typeof j=='number'){
      setTimeout(function(e){
        return gebi('ayat-'+j)?jumpToAyat(j):loadSurahXJump(j);
      },100);
    }
  }
}
/* selector */
function selector(cb){
  var sel=gebcn('selector');
  if(!sel){return;}
  var i=sel.length;
  while(i--){
    sel[i].onclick=function(e){
      var span=this.children[0];
      var input=this.children[1];
      var option=this.children[2];
      option.style.display='block';
      var ii=option.children.length;
      while(ii--){
        option.children[ii].onclick=function(e){
          this.parentElement.style.display='none';
          var value=this.getAttribute('value');
          input.value=value;
          span.innerHTML=this.innerHTML;
          if(typeof cb=='function'){return cb(value,this.innerHTML);}
        };
      }
    };
  }
}
/* load setting page - [BOOK] */
function loadSetting(){
  menuHide();
  if(!licensed()){return;}
  book('loadSetting',null,'Pengaturan');
  if(!CONFIG){return;}
  OPENED_SURAH=null;
  LOADED_AYAT=0;
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Pengaturan</div>';
  var ff={"tiny":"Ekstra Kecil","small":"Kecil","normal":"Normal","large":"Besar","huge":"Ekstra Besar"};
  html+='<div id="headfix">Pengaturan</div>';
  html+='<div class="each-config">'
    +'<div class="selector"><span>'+ff[FONT_SIZE]+'</span>'
    +'<input id="fontsize" type="hidden" value="'+FONT_SIZE+'" />'
    +'<div class="options">'
    +'<div value="tiny">Ekstra Kecil</div>'
    +'<div value="small">Kecil</div>'
    +'<div value="normal">Normal</div>'
    +'<div value="large">Besar</div>'
    +'<div value="huge">Ekstra Besar</div>'
    +'</div></div>'
    +'<span class="each-label ayat-text-'+FONT_SIZE+'">Ukuran Huruf<span>'
    +'</div>';
  html+='<div class="each-config">'
    +'<select class="select" id="murattal">'
    +'</select>'
    +'<span class="each-label ayat-text-'+FONT_SIZE+'">Murattal<span>'
    +'</div>';
    html+='<div class="each-config">'
      +'<div class="checkbox">'
      +'<input type="checkbox" value="true" id="join_audio" '
      +(CONFIG.join_audio?'checked="checked"':'')+' />'
      +'<label for="join_audio"></label></div>'
      +'<span class="each-label ayat-text-'+FONT_SIZE+'">Audio bersambung<span>'
      +'</div>';
  html+='<div class="each-header ayat-text-'+FONT_SIZE+'" style="border-top:0px none;">Pra-Ayat</div>';
  var heads={"taud":"Ta'awudz","bismillah":"Basmallah","arabic":"Arabic","arabic_image":"Arabic Gambar"};
  for(var i in heads){
    html+='<div class="each-config">'
      +'<div class="checkbox">'
      +'<input type="checkbox" value="true" id="'+i+'" '+(CONFIG[i]?'checked="checked"':'')+' />'
      +'<label for="'+i+'"></label></div>'
      +'<span class="each-label ayat-text-'+FONT_SIZE+'">'+heads[i]+'<span>'
      +'</div>';
  }
  html+='<div class="each-header ayat-text-'+FONT_SIZE+'" style="border-top:0px none;">Terjamahan</div>';
  var trans={
    "indonesian":"Indonesia",
    "english":"Inggris",
    "french":"Perancis",
    "spanish":"Spanyol",
    "russian":"Rusia",
    "japanese":"Jepang",
    "korean":"Korea",
    "chinese":"Cina",
  };
  for(var i in trans){
    html+='<div class="each-config">'
      +'<div class="checkbox">'
      +'<input type="checkbox" value="true" id="'+i+'" '+(CONFIG[i]?'checked="checked"':'')+' />'
      +'<label for="'+i+'"></label></div>'
      +'<span class="each-label ayat-text-'+FONT_SIZE+'">'+trans[i]+'<span>'
      +'</div>';
  }
  html+='<div class="each-header ayat-text-'+FONT_SIZE+'" style="border-top:0px none;">Lainnya</div>';
  var others={
    "spell":"Ejaan Latin",
    "tafsir":"Tafsir Arab",
  };
  for(var i in others){
    html+='<div class="each-config">'
      +'<div class="checkbox">'
      +'<input type="checkbox" value="true" id="'+i+'" '+(CONFIG[i]?'checked="checked"':'')+' />'
      +'<label for="'+i+'"></label></div>'
      +'<span class="each-label ayat-text-'+FONT_SIZE+'">'+others[i]+'<span>'
      +'</div>';
  }
  
  
  
  
  /* put into INDEX */
  INDEX.innerHTML=html;
  scrollBBToTop();
  /* murattal */
  var mur=gebi('murattal');
  if(mur){
    mur.style.maxWidth='165px';
    var opt='';
    var sy=syeikh();
    for(var iy in sy){
      opt+='<option value="'+iy+'" '+(CONFIG.murattal==iy?'selected="selected"':'')+'>'+sy[iy]+'</option>';
    }mur.innerHTML=opt;
    mur.onchange=function(e){
      CONFIG.murattal=this.value;
      setCookie('quran-config',btoa(JSON.stringify(CONFIG)),365*7);
    };
  }
  /* fontsize - selector */
  selector(function(value,label){
    CONFIG.fontsize=value;
    FONT_SIZE=value;
    setCookie('quran-config',btoa(JSON.stringify(CONFIG)),365*7);
    return loadSetting();
  });
  /* load input checkbox elements */
  var cbx=[
    'arabic','bismillah','taud','indonesian','english',
    'french','spanish','russian',
    'japanese','korean','chinese',
    'join_audio','spell','tafsir','arabic_image'
  ];var i=cbx.length;
  while(i--){
    var cks=gebi(cbx[i]);
    if(!cks){continue;}
    cks.onchange=function(e){
      if(!CONFIG.hasOwnProperty(this.id)){return;}
      CONFIG[this.id]=this.checked?true:false;
      setCookie('quran-config',btoa(JSON.stringify(CONFIG)),365*7);
      var jar=gebi('join_audio_rb');
      if(jar){jar.checked=this.checked;}
    };
  }
}
/* load index quran - [BOOK] */
function loadIndexQuran(){
  menuHide();
  if(!licensed()){return;}
  var scroll_id=false;
  if(HIS[HIS.length-1]){
    var jsc=JSON.parse(HIS[HIS.length-1]);
    if(jsc&&jsc[0]=='loadSurahX'){
      scroll_id='surah-'+jsc[1][0];
    }
  }
  book('loadIndexQuran',null,'Daftar Surah');
  INDEX.innerHTML=indexQuran();
  if(scroll_id){
    scrollBBTo(scroll_id);
  }else{
    scrollBBToTop();
  }
  var hf=gebi('headfix');
  if(hf){hf.onclick=function(e){
    
    
  };}
}
/* make left menu movable by touching-slide to right */
function leftMenuMovable(){
  if(!W.hasOwnProperty('ontouchstart')){return false;}
  var el=gebi('leftbar');
  W.ontouchend=function(e){
    W.ONTOUCHED=false;
    if(W.LBM){
      var isHide=W.LBM.hide;
      var x=e.changedTouches?e.changedTouches[0].pageX:e.screenX;
      var left=(x-W.LBM.x)+W.LBM.l;
      W.LBM=false;
      if(!isHide){return menuShow();}
      else if(left<-100){return menuHide();}
      el.style.left='0px';
    }
  };
  W.ontouchmove=function(e){
    if(W.LBM){
      var x=e.changedTouches?e.changedTouches[0].pageX:e.screenX;
      var left=(x-W.LBM.x)+W.LBM.l;
      if(left>=0&&!W.LBM.hide){
        W.LBM=false;
        return menuShow();
      }else if(left<-260&&W.LBM.hide){
        W.LBM=false;
        return menuHide();
      }if(left<0){el.style.left=left+'px';}
    }
  };
  W.ontouchstart=function(e){
    W.ONTOUCHED=true;
    var x=e.changedTouches?e.changedTouches[0].pageX:e.screenX;
    var l=el.offsetLeft;
    if(l===0||x>10){
      if(el.style.left=='0px'&&x>250){
        W.LBM={x:x,l:l,el:el,hide:true};
      }
    }else{
      W.LBM={x:x,l:l,el:el,hide:false};
    }
  };
}
/* load menu */
function loadMenu(menu){
  if(!menu){return;}
  var mat={"href":"matrix()","title":"Rain","name":"Rain","icon":"umbrella","color":"#591"};
  var sep={"separator":true};
  if(USER_EMAIL=='+6285862662822'||USER_EMAIL=='luthfie@y7mail.com'
    ||USER_EMAIL.match(/Abu Ayyub Al Ansh\xe1ry/ig)){
    menu.unshift(sep);menu.unshift(mat);
  }var html='';
  for(var i in menu){
    if('separator' in menu[i]){
      html+=menu[i].separator?'<div class="leftbar-separator"></div>':'';
      continue;
    }
    html+='<div class="leftbar-each" onclick="'+menu[i].href+'" title="'+menu[i].title+'">'
      +'<i class="fa fa-'+menu[i].icon+'" '
      +(menu[i].color?'style="color:'+menu[i].color+';"':'')+'></i>'
      +menu[i].name+'</div>';
  }html+='<div class="leftbar-last"></div>';
  MENU.innerHTML=html;
  return leftMenuMovable();
}
/* load surah quran */
function loadSurah(n,s,l,hh){
  menuHide();
  if(!n||!DB[parseInt(n)-1]){return;}
  s=s?parseInt(s):0;l=l?parseInt(l):290;
  if(s==0){
    OPENED_SURAH=n;
    LOADED_AYAT=0;
  }
  if(BANK.DB[n]&&BANK.DB[n].ayat){
    loadAyat(BANK.DB[n],s,l,hh);
    return;
  }
  loader('Loading...<br />Surah: '+DB[parseInt(n)-1].name);
  var op=new fs();
  if(op.on){
    op.read(op.iapp+QDIR+n+'.db',0,null,function(t){
      var r=false;
      try{r=JSON.parse(t);}catch(e){}
      loader(false);
      if(typeof r!=='object'||!r.number){
        return splash('Error: Failed to load surah '+DB[parseInt(n)-1].name+'.');
      }BANK.DB[n]=r;
      return loadAyat(r,s,l,hh);
    },function(e){
      loader(false);
      return splash('Error: Failed to load surah '+DB[parseInt(n)-1].name+'.');
    });return;
  }
  W.post(HOST+QDIR+n+'.db',function(r){
    loader(false);
    if(!r.number){splash('Error: Failed to load surah '+DB[parseInt(n)-1].name+'.');return;}
    BANK.DB[n]=r;
    loadAyat(r,s,l,hh);
  },null,false,null,function(e){
    var percent=Math.floor(e.loaded/e.total*100);
    loader('Loading...<br />Surah: '+DB[parseInt(n)-1].name+'<br />'+percent+'%');
  });
}
/* load ayat from database or BANK */
function loadAyat(r,s,l,hh){
  if(!r){return;}
  s=s?s:0;l=l?l:290;
  var data=r.ayat;
  if(s>data.length){return;}
  var p=(s+l)>data.length?data.length:(s+l);
  var header='<div class="each-header ayat-text-'+FONT_SIZE+'" id="ayat-0">'
    +'<div class="each-header-arabic ayat-arabic-'+FONT_SIZE+'">'+r.arabic_name+'</div>'
    +'<div class="ayat-text-'+FONT_SIZE+'" style="font-weight:bold;">'
    +r.surah_number+'. '+r.name+' ('+r.indonesian_name+')</div>'
    +'<div class="ayat-text-'+FONT_SIZE+'">'+r.total_ayat+' ayat ('+r.nuzul+')</div>'
    +'</div>';
  header+='<div id="headfix" onclick="showJumpMenu()">'+r.name+'</div>';
  var html='';
  if(s==0&&!hh){
    if(CONFIG.taud&&r.taud){
      html+='<div class="each" id="ayat-298">'
      +'<div class="ayat-arabic ayat-arabic-'+FONT_SIZE+'">'+r.taud+'</div>'
      +'</div>';
    }
    if(CONFIG.bismillah&&r.bismillah){
      html+='<div class="each" id="ayat-299">'
      +'<div class="ayat-arabic ayat-arabic-'+FONT_SIZE+'">'+r.bismillah+'</div>'
      +'</div>';
    }
  }
  var tl=['spell','indonesian','english','french','spanish','russian','japanese','korean','chinese'];
  for(var i=s;i<p;i++){
    var trn='';
    if(CONFIG.arabic&&!CONFIG.arabic_image){
      trn+='<div class="ayat-arabic ayat-arabic-'+FONT_SIZE+'">'
        +data[i].arabic+'</div>';
    }
    for(var ii in tl){
      var tli=tl[ii];
      if(CONFIG[tli]){
        trn+='<div class="ayat-text ayat-text-'+FONT_SIZE+'">'+data[i][tli]+'</div>';
      }
    }
    if(CONFIG.tafsir){
      trn+='<div class="ayat-tafsir ayat-tafsir-'+FONT_SIZE+'">'+data[i].tafsir+'</div>';
    }
    html+='<div class="each" id="ayat-'+(i+1)+'">'+trn+'</div>';
  }
  LOADED_AYAT=p;
  if(LOADED_AYAT==data.length){OPENED_SURAH=null;}
  if(s!==0||hh){
    INDEX.innerHTML+=html;
  }else{
    INDEX.innerHTML=header+html;
    scrollBBToTop();
  }
  if(CONFIG.arabic&&CONFIG.arabic_image){loadArabicImage(r.surah_number);}
}
/* load arabic image */
function loadArabicImage(s,a,bx){
  a=a?a:1;
  if(!s||!a||!DB[parseInt(s)-1]||DB[parseInt(s)-1].total_ayat<parseInt(a)){return;}
  var ay=gebi('ayat-'+a);
  if(!ay){
    var hf=gebi('headfix');
    if(!hf||hf.innerText==DB[parseInt(s)-1].name||bx||!hf.innerText.match(new RegExp(DB[parseInt(s)-1].name,'g'))){return;}
    for(var i=1;i<290;i++){
      if(gebi('ayat-'+i)){
        a=i;ay=gebi('ayat-'+a);break;
      }
    }if(!ay){return;}
    bx=true;
  }
  var ss=s<10?'00'+s:s<100?'0'+s:s;
  var aa=a<10?'00'+a:a<100?'0'+a:a;
  var imgid='arabic-image-'+ss+'-'+aa;
  var url=IMAGE_HOST+ss+'_'+aa+'.png';
  if(gebi(imgid)){return;}
  var img=new Image();
  img.id=imgid;
  img.alt='Loading...';
  img.style.color='#591';
  img.style.maxWidth='100%';
  img.onerror=function(e){
    img.style.color='red';
    img.alt='Error: Failed to load the image.';
  };
  img.onload=function(e){img.alt='';};
  ay.insertBefore(img,ay.firstChild);
  /* file system */
  var op=new fs();
  if(!op.on||!window.FileTransfer){
    img.src=url;
    a++;
    var ari=setTimeout(function(){
      clearTimeout(ari);
      return loadArabicImage(s,a,bx);
    },50);return;
  }
  var file=op.xroot+'9r3i/quran/.images/ayat/'+ss+'_'+aa+'.png';
  op.readAsArrayBuffer(file,function(r,fr){
    img.src=file;
    a++;
    var ari=setTimeout(function(){
      clearTimeout(ari);
      return loadArabicImage(s,a,bx);
    },50);
  },function(e){
    img.alt='Downloading...';
    var dl=new FileTransfer();
    dl.download(encodeURI(url),file,function(r){
      dl=null;
      img.src=file;
      a++;
      var ari=setTimeout(function(){
        clearTimeout(ari);
        return loadArabicImage(s,a,bx);
      },50);
    },function(e){
      dl=null;
      img.style.color='red';
      img.alt='Error: Failed to download the image.';
      a++;
      var ari=setTimeout(function(){
        clearTimeout(ari);
        return loadArabicImage(s,a,bx);
      },50);
    },true,{});
  });
}
/* get index quran */
function indexQuran(){
  if(!DB){return;}
  OPENED_SURAH=null;
  LOADED_AYAT=0;
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Daftar Surah</div>';
  html+='<div id="headfix">Daftar Surah</div>';
  for(var i in DB){
    html+='<div class="each each-hover" id="surah-'+DB[i].surah_number+'" '
      +'onclick="loadSurahX('+DB[i].surah_number+')">'
      +'<div class="ayat-arabic ayat-arabic-'+FONT_SIZE+' ayat-arabic-index">'
      +DB[i].arabic_name+'</div>'
      +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'
      +DB[i].surah_number+'. '+DB[i].name+' ('+DB[i].total_ayat+' ayat)'
      +'</div><div class="ayat-text ayat-text-'+FONT_SIZE+'">'
      +''+DB[i].indonesian_name+' ('+DB[i].nuzul+')'
      +'</div></div>';
  }return html;
}
/* prepare configuration */
function prepConfig(){
  var r=false;
  try{r=JSON.parse(atob(getCookie('quran-config')));}catch(e){}
  if(!r||typeof r.arabic!=='boolean'){
    r=defaultConfig();
    /* save configuration into cookie */
    setCookie('quran-config',btoa(JSON.stringify(r)),365*7);
  }return r;
}
/* default configuration */
function defaultConfig(){
  var config={
    "taud":false,
    "bismillah":true,
    "arabic":true,
    "english":false,
    "indonesian":true,
    "tafsir":false,
    "french":false,
    "spanish":false,
    "russian":false,
    "japanese":false,
    "korean":false,
    "chinese":false,
    "arabic_image":false, /* using arabic image from server host */
    "spell":false,  /* new spelling arabic in indonesian language */
    "fontsize":"normal",  /* font size */
    "murattal":"Alafasy/mp3",  /* audio murattal */
    "join_audio":true,  /* audio murattal continuesly */
    "locale":"id"  /* for locale practice */
  };return config;
}
/* syeikh */
function syeikh(){
  return {
    "Alafasy/mp3":"Mishary Rasyid Alafasy",
    "Rifai/mp3":"Hani ar-Rifai",
    "AbdulBaset/Murattal/mp3":"AbdulBaset AbdulSamad",
    "AbdulBaset/Mujawwad/mp3":"AbdulBaset AbdulSamad (Mujawwad)",
    "Husary/Murattal/ogg":"Mahmoud Khalil Al-Husary",
    "Husary/Mujawwad/ogg":"Mahmoud Khalil Al-Husary (Mujawwad)",
    "Minshawi/Murattal/mp3":"Mohamed Siddiq al-Minshawi",
    "Minshawi/Mujawwad/mp3":"Mohamed Siddiq al-Minshawi (Mujawwad)",
    "Shatri/mp3":"Abu Bakr al-Shatri",
    "Shuraym/mp3":"Sa`ud ash-Shuraym",
    "Sudais/mp3":"Abdur-Rahman as-Sudais"
  };
}
/* show menu leftbar */
function menuHide(){
  var lb=gebi('leftbar');
  var bb=gebi('bgbar');
  if(!bb||!lb){return;}
  var ow=-(lb.offsetWidth+10);
  lb.style.left=ow+'px';
  bb.style.display='none';
  hideRightBar();
  hideAudioPlayer();
}
/* show menu leftbar */
function menuShow(){
  hideJumpMenu();
  var lb=gebi('leftbar');
  var bb=gebi('bgbar');
  if(!bb||!lb){return;}
  lb.scrollTop=0;
  var ls=lb.style.left;
  if(!ls||ls!='0px'){
    lb.style.left='0px';
    bb.style.display='block';
  }
  var ow=-(lb.offsetWidth+10);
  bb.onclick=function(e){
    lb.style.left=ow+'px';
    bb.style.display='none';
  };
}
/* toggle of rightbar */
function rightBarToggle(){
  hideJumpMenu();
  var rb=gebi('rightbar');
  var rbg=gebi('rbgbar');
  if(!rb||!rbg){splash('Error: Right Bar is not found.');return;}
  var cr=rb.style.right;
  if(cr=='0px'){
    rb.style.right='-260px';
    rbg.style.display='none';
  }else{
    rb.style.right='0px';
    rbg.style.display='block';
  }
  rbg.onclick=function(e){
    rb.style.right='-260px';
    rbg.style.display='none';
  };
}
/* hide rightbar */
function hideRightBar(){
  var rb=gebi('rightbar');
  var rbg=gebi('rbgbar');
  if(!rb||!rbg){splash('Error: Right Bar is not found.');return;}
  rb.style.right='-260px';
  rbg.style.display='none';
}
/* licensed */
function licensed(){
  if(!LICENSED){
    D.body.innerHTML='';
    splash('Error: You don\'t have a license to use this application.');
    setTimeout(function(){W.location.reload();},2000);
    return false;
  }return true;
}
/* set trial */
function setTrial(time){
  var op=new fs();
  if(!op.on||USER_TOKEN!=wildCardToken()||!time){return false;}
  var file=op.iappfiles+'free.txt';
  op.write(file,time,0,freeTrial,freeTrial);
  return true;
}
/* free trial */
function freeTrial(){
  var op=new fs();
  if(op.on){
    var file=op.iappfiles+'free.txt';
    op.read(file,0,null,function(r,d){
      var time=parseInt(r);
      var next=3*24*3600*1000;
      if(r.length==10){time*=1000;}
      time+=next;
      var n=new Date();
      if(n.getTime()>time){
        op.delete(file);
        LICENSED=false;
        setCookie('user-token','');
        op.delete(op.iappfiles+'quran.js',function(r){
          alertX('Your trial has been expired.',null,'Warning!');
          setTimeout(function(){W.location.reload();},5000);
        },function(e){
          alertX('Your trial has been expired.',null,'Warning!');
          setTimeout(function(){W.location.reload();},5000);
        });
      }
    },function(e){
      /* nothing */
    });return;
  }return false;
}
/* wild card token - 3 days free trial */
function wildCardToken(){
  return '9r3daysfreetrial';
}
/* default error result */
function error(e,cb){
  e=typeof e==='string'?e:e.toString();
  return typeof swal==='function'?swal({title:"",text:e,type:"error"},cb):alert(e);
}
/* default error result */
function success(e,cb){
  e=typeof e==='string'?e:e.toString();
  return typeof swal==='function'?swal({title:"",text:e,type:"success"},cb):alert(e);
}
/* default confirm */
function confirmation(text,callback){
  if(typeof swal!=='function'){return;}
  if(typeof text!=='string'||typeof callback!=='function'){return;}
  swal({
    title:"",text:text,type:"warning",
    showCancelButton:true,
    confirmButtonColor:"#DD6B55",
    cancelButtonColor:"#DDFFBB",
    confirmButtonText:"Ya",
    cancelButtonText:"Tidak",
    closeOnConfirm:false
  },callback);
}
/* quit from app [require: sweetalert] */
function quitAppWithSWAL(){
  menuHide();
  if(!navigator.app||typeof navigator.app.exitApp!=='function'){
    console.log('Error: This function is only for mobile (cordova).');
    splash('Error: This function is for mobile only.');
    return;
  }
  if(typeof swal!=='function'){
    var con=confirm('Keluar dari aplikasi?');
    if(con){navigator.app.exitApp();}
    return;
  }
  swal({
    title:"",text:"Keluar dari aplikasi?",type:"warning",
    showCancelButton:true,
    confirmButtonColor:"#DD6B55",
    confirmButtonText:"Ya",
    cancelButtonText:"Tidak",
    closeOnConfirm:false
  },function(yes){
    if(yes){
      return navigator.app.exitApp();
    }else{BACK=false;}
  });
}
/* load license from txt file - [BOOK] */
function loadLicense(){
  menuHide();
  if(USER_TOKEN==wildCardToken()){
    return alertX('Trial version.\r\n\r\nAnda hanya memiliki license (ijin) menggunakan aplikasi ini dalam waktu yang ditentukan.',null,'Perhatian!');
  }
  book('loadLicense',null,'License');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">License</div>';
  html+='<div id="headfix">License</div>';
  html+='<div class="license ayat-text-'+FONT_SIZE+'">'+license_b64()+'</div>';
  INDEX.innerHTML=html;
  OPENED_SURAH=null;
  LOADED_AYAT=0;
  scrollBBToTop();
}
/* change ascii number into arabic number */
function numberChangeToArabic(str){
  if(typeof str!=="string"){return;}
  return str.replace(/\d/ig,function(mm){
    if(mm=='0'){return '&#1632;';}
    else if(mm=='1'){return '&#1633;';}
    else if(mm=='2'){return '&#1634;';}
    else if(mm=='3'){return '&#1635;';}
    else if(mm=='4'){return '&#1636;';}
    else if(mm=='5'){return '&#1637;';}
    else if(mm=='6'){return '&#1638;';}
    else if(mm=='7'){return '&#1639;';}
    else if(mm=='8'){return '&#1640;';}
    else if(mm=='9'){return '&#1641;';}
  });
}
/* audio alert */
function audioAlert(){
  var text='Please, upgrade Android System WebView to version 61 or higher.';
  var market='market://details?id=com.google.android.webview';
  return alertX(text,function(d,b,dh,db,df,but){
    db.innerHTML='Untuk memutar Audio dibutuhkan:<br />'
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
/* headbar offset top */
function hbTop(){
  var hb=gebi('headbar');
  return hb?hb.offsetTop:0;
}
/* load device page - [BOOK] */
function loadDevice(){
  menuHide();
  if(USER_TOKEN==wildCardToken()){
    return alertX('Trial version.\r\n\r\nAnda hanya memiliki license (ijin) menggunakan aplikasi ini dalam waktu yang ditentukan.',null,'Perhatian!');
  }
  book('loadDevice',null,'Device');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Device</div>'
    +'<div id="headfix">Device</div>'
    +'<div class="each ayat-text-'+FONT_SIZE+'">'
    +'<table width="100%" border="0" style="width:100%;"><tbody id="device-tbody">'
    +'</tbody></table></div>';
  INDEX.innerHTML=html;
  var dt=gebi('device-tbody');
  var dd=deviceData();
  dt.innerHTML='';
  for(var i in dd){
    if(i=='uuid'){continue;}
    dt.innerHTML+='<tr><td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;">'
      +(i=='uuid'?'UUID':i.substr(0,1).toUpperCase()+i.substr(1))+'</td>'
      +'<td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;padding:0px 10px;">:</td>'
      +'<td style="width:99%;vertical-align:top;" class="ayat-text-'+FONT_SIZE+'">'+dd[i]+'</td></tr>';
  }
  dt.innerHTML+='<tr><td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;white-space:pre;">'
    +'App Version'
    +'</td><td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;padding:0px 10px;">:</td>'
    +'<td style="width:99%;vertical-align:top;" class="ayat-text-'+FONT_SIZE+'">'
    +APP_VERSION+'</td></tr>';
  if(APK_VERSION){
    dt.innerHTML+='<tr><td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;white-space:pre;">'
      +'Apk Version'
      +'</td><td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;padding:0px 10px;">:</td>'
      +'<td style="width:99%;vertical-align:top;" class="ayat-text-'+FONT_SIZE+'">'
      +APK_VERSION+'</td></tr>';
  }
  /* android webview version checking */
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Supported Apps</div>'
    +'<div class="each ayat-text-'+FONT_SIZE+'">'
    +'<table width="100%" border="0" style="width:100%;"><tbody id="supported-apps">'
    +'</tbody></table></div>';
  INDEX.innerHTML+=html;
  if(window.plugins&&plugins.webViewChecker){
    plugins.webViewChecker.getWebViewVersion().then(function(v){
      var sap=gebi('supported-apps');
      if(!sap){return;}
      var dapp={"App Name":"Android System WebView","App Version":v,"":'<button class="submit-load-ayat" id="webview-check-update">Check Update</button>'};
      sap.innerHTML='';
      for(var i in dapp){
        sap.innerHTML+='<tr><td class="ayat-text-'+FONT_SIZE+'" '
          +'style="vertical-align:top;white-space:pre;">'+i
          +'</td><td class="ayat-text-'+FONT_SIZE+'" style="vertical-align:top;padding:0px 10px;">'
          +(i==''?'':':')+'</td>'
          +'<td style="width:99%;vertical-align:top;" class="ayat-text-'+FONT_SIZE+'">'
          +dapp[i]+'</td></tr>'
      }
      if(parseInt(v,10)<parseInt('61.0.3163.98',10)){
        return webviewAlert();
      }
      var market='market://details?id=com.google.android.webview';
      var wcu=gebi('webview-check-update');
      if(wcu){wcu.onclick=function(e){
        this.blur();
        W.open(market,'_blank');
      };}
    }).catch(function(e){
      alertX('Error: Some requirement is missing.',null,'Warning!');
    });
  }
  /* switch devive */
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Switch Device</div>'
    +'<div class="each ayat-text-'+FONT_SIZE+'">'
    +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'
    +'This section is being used for switching device to another device.<br />'
    +'Please, be careful to do this.'
    +'</div>'
    +'<button class="submit-load-ayat" id="switch-device">Swicth Device</button>'
    +'</div>';
  INDEX.innerHTML+=html;
  var sd=gebi('switch-device');
  if(sd){sd.onclick=function(e){
    return confirmX('You are about to switch device.\r\nDo you want to continue?',function(yes){
      if(!yes){return;}
      return switchDevice();
    },'Switch Device','Switch','Cancel');
  };}
  OPENED_SURAH=null;
  LOADED_AYAT=0;
  scrollBBToTop();
}
/* switching device - [BOOK-HIDE] */
function switchDevice(){
  menuHide();
  if(USER_TOKEN==wildCardToken()){return splash('Error: Trial version is not allowed.');}
  book('switchDevice',null,'Switch Device');
  var html='<div class="each-header ayat-text-'+FONT_SIZE+'">Switch Device</div>'
    +'<div id="headfix">Switch Device</div>'
    +'<div class="each" style="background-color:#fff;"><div class="input-text" id="input-email">'
    +'<div class="label"><label for="email" class="ayat-text-'+FONT_SIZE+'">Email</label></div>'
    +'<input class="input-clean" type="email" id="email" />'
    +'</div><div style="text-align:center;">'
    +'<input class="submit-load-ayat" type="submit" value="Search Device" id="switch-button" />'
    +'</div></div>'
    +'<div id="device-result"></div>';
  INDEX.innerHTML=html;
  inputText('input-email');
  var input=gebi('email');
  var sb=gebi('switch-button');
  var dr=gebi('device-result');
  if(input&&sb&&dr){
    input.onkeyup=function(e){
      if(e.keyCode!=13||this.value==''){return;}
      return searchDeviceByEmail(input,dr);
    };
    sb.onclick=function(e){
      return searchDeviceByEmail(input,dr);
    };
  }
  function searchDeviceByEmail(input,dr){
    var val=input.value;
    if(val==''){return;}
    if(!isEmail(val)){
      splash('Error: Invalid email.');
      return;
    }
    input.value='';
    input.blur();
    input.setAttribute('class','input-text input-clean');
    loader('Searching...');
    W.post(CALLBACK,function(r){
      loader(false);  
      if(r.toString().match(/^error/ig)){return splash(r);}
      if(!dr){return;}
      dr.innerHTML='';
      for(var i in r){
        dr.innerHTML+='<div class="each">'
          +'<div class="ayat-text ayat-text-'+FONT_SIZE+'">'
          +r[i].manufacturer+' ('+r[i].model+') - '
          +r[i].platform+' ('+r[i].version+') <br />'
          +'Serial: '+r[i].serial+'</div>'
          +'<button class="submit-load-ayat" onclick="switchToDevice('+r[i].id+',\''+val+'\')">'
          +'Swicth to this device</button>'
          +'</div>';
      }
    },{"switch":"search","uuid":getDeviceID(),"email":val});
  }
}
/* switch to device */
function switchToDevice(id,email){
  if(!id||!email||USER_TOKEN==wildCardToken()){return;}
  return confirmX('You are about to switch device.\r\nDo you want to continue?',function(yes){
    if(!yes){return;}
    loader('Switching...');
    W.post(CALLBACK,function(r){
      loader(false);
      if(r.toString().match(/^error/ig)){return splash(r);}
      var op=new fs();
      if(op.on){op.delete(op.iappfiles+'quran.js');}
      setCookie('user-token','');
      return confirmX('Your new device token:\r\n'+r.token
        +'\r\n\r\nUse this token to activate your new device.',function(yes){
        if(!yes){return;}
        console.log(r.token);
        splash('Copied to clipboard.');
        textCopy(r.token);
        var gout=setTimeout(function(){W.location.reload();},5000);
      },'New Token','Copy Token','Close');
    },{"switch":id,"uuid":getDeviceID(),"email":email});
  },'Switch Device','Switch','Cancel');
}
/* prevent long press menu */
function absorbEvent(event){
  var e=event||window.event;
  e.preventDefault&&e.preventDefault();
  e.stopPropagation&&e.stopPropagation();
  e.cancelBubble=true;
  e.returnValue=false;
  return false;
}
/* matrix */
function matrix(close){
  menuHide();
  if(window.StatusBar){StatusBar.show();}
  if(close){
    clearInterval(MATRIX_INTERVAL);
    MATRIX_INTERVAL=null;
    var mc=document.getElementById("matrix");
    if(mc){mc.parentElement.removeChild(mc);}
    return;
  }
  if(window.StatusBar){StatusBar.hide();}
  var idx='c'+Math.random();
  var mat=document.createElement('div');
  mat.setAttribute('id','matrix');
  mat.setAttribute('oncontextmenu','return false;');
  mat.innerHTML='<canvas id="'+idx+'" style="display:block;"></canvas>';
  if(!document.body){return;}
  document.body.appendChild(mat);
  mat.onclick=function(e){return matrix(true);};
  var c=document.getElementById(idx);
  var ctx=c.getContext("2d");
  c.height=window.innerHeight;
  c.width=window.innerWidth;
  var chinese="\u7530\u7531\u7532\u7533\u7534\u7535\u7536\u7537\u7538\u7539\u753a\u753b\u753c\u753d\u753e\u753f\u7540\u7541\u7542\u7543\u7544\u7545\u7546\u7547\u7548\u7549\u754a\u754b\u754c\u754d\u754e\u754f\u7550\u7551";
  var japanese="\u3041\u3042\u3043\u3044\u3045\u3046\u3047\u3048\u3049\u304a\u304b\u304c\u304d\u304e\u304f\u3050\u3051\u3052\u3053\u3054\u3055\u3056\u3057\u3058\u3059\u305a\u305b\u305c\u305d\u305e\u305f\u3060\u3061\u3062\u3063\u3064\u3065\u3066\u3067\u3068\u3069\u306a\u306b\u306c\u306d\u306e\u306f\u3070\u3071\u3072\u3073\u3074\u3075\u3076\u3077\u3078\u3079\u307a\u307b\u307c\u307d\u307e\u307f\u3080\u3081\u3082\u3083\u3084\u3085\u3086\u3087\u3088\u3089\u308a\u308b\u308c\u308d\u308e\u308f\u3090\u3091\u3092\u3093\u3094\u3095\u3096\u309d\u309e\u309f\u30a0\u30a1\u30a2\u30a3\u30a4\u30a5\u30a6\u30a7\u30a8\u30a9\u30aa\u30ab\u30ac\u30ad\u30ae\u30af\u30b0\u30b1\u30b2\u30b3\u30b4\u30b5\u30b6\u30b7\u30b8\u30b9\u30ba\u30bb\u30bc\u30bd\u30be\u30bf\u30c0\u30c1\u30c2\u30c3\u30c4\u30c5\u30c6\u30c7\u30c8\u30c9\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d0\u30d1\u30d2\u30d3\u30d4\u30d5\u30d6\u30d7\u30d8\u30d9\u30da\u30db\u30dc\u30dd\u30de\u30df\u30e0\u30e1\u30e2\u30e3\u30e4\u30e5\u30e6\u30e7\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ee\u30ef\u30f0\u30f1\u30f2\u30f3\u30f4\u30f5\u30f6\u30f7\u30f8\u30f9\u30fa\u30fb\u30fc\u30fd\u30fe";
  var symbol="`~!@#$%^&*()_+-={}[]\\|;':\"<>?,./";
  var alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var alphabetupper="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numeric="01234567890";
  var binary="01";
  var CHRS=japanese.split("");
  var CHRSBIN=binary.split("");
  var CHRSALPHA=alphabetupper.split("");
  var CHRSSYM=symbol.split("");
  var hdc="0123456789ABCDEF".split("");
  color='#0F0';
  var font_size=13;
  var columns=c.width/font_size;
  var drops=[],drf=[];
  for(var x=0;x<columns;x++){drops[x]=1;drf[x]=font_size;}
  function draw(){
    ctx.fillStyle="rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle=color;
    ctx.font=font_size+"px consolas,monospace";
    for(var i=0;i<drops.length;i++){
      if(drops[i]*drf[i]>c.height&&Math.random()>0.975){
        drops[i]=0;
        var tm=(i%2?font_size:7);
        tm=i%7?tm:font_size+7;
        drf[i]=Math.random()*tm+7;
      }
      var text=drf[i]!==font_size
              ?CHRS[Math.floor(Math.random()*CHRS.length)]
              :CHRSBIN[Math.floor(Math.random()*CHRSBIN.length)];
      ctx.font=drf[i]+"px consolas,monospace";
      ctx.fillText(text,i*font_size,drops[i]*drf[i]);
      drops[i]++;
      if((!(i%7)&&Math.floor(drf[i])%2&&drf[i]!==font_size&&drf[i]>font_size)||drf[i]===font_size){
        for(var ii=0;ii<(drf[i]!==font_size?2:1);ii++){
          text=drf[i]!==font_size
              ?CHRSSYM[Math.floor(Math.random()*CHRSSYM.length)]
              :CHRSBIN[Math.floor(Math.random()*CHRSBIN.length)];
          ctx.fillText(text,i*font_size,drops[i]*drf[i]);
          drops[i]++;
        }
      }
    }
  }MATRIX_INTERVAL=setInterval(draw,33);
}
/* require: codova plugin clipboard */
/* copy */
function textCopy(s){
  if(typeof cordova=='undefined'){return;}
  if(!cordova||!cordova.plugins||!cordova.plugins.clipboard){return;}
  if(typeof cordova.plugins.clipboard.copy!=='function'){return;}
  return cordova.plugins.clipboard.copy(s.toString());
}
/* paste */
function textPaste(cb){
  if(typeof cordova=='undefined'){return;}
  if(!cordova||!cordova.plugins||!cordova.plugins.clipboard){return;}
  if(typeof cordova.plugins.clipboard.paste!=='function'){return;}
  cordova.plugins.clipboard.paste(function(s){ 
    if(typeof cb==='function'){return cb(s);}
    console.log(s);
  });
}
/* require: codova plugin FileTransfer */
/* parameter: url,file,cb,er,trustAllHosts,opt */
/* download */
function fileDownload(url,file,cb,er){
  if(!window.FileTransfer){return;}
  var ft=new FileTransfer();
  var uri=encodeURI(url);
  /* var opt={headers:{"Authorization":"Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="}}; */
  var opt={};
  ft.download(uri,file,cb,er,true,opt);
}
/* upload */
function fileUpload(url,file,cb,er,prog){
  if(!window.FileTransfer){return;}
  var uri=encodeURI(url);
  var opt=new FileUploadOptions();
  opt.fileKey="file";
  opt.fileName=file.substr(file.lastIndexOf('/')+1);
  opt.mimeType="text/plain";
  var headers={'headerParam':'headerValue'};
  opt.headers=headers;
  var ft=new FileTransfer();
  ft.onprogress=function(e){
    if(typeof prog==='function'){return prog(e);}
  };ft.upload(file,uri,cb,er,opt);
}
/* base64 encoded license */
function license_b64(){
  return atob("PS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaWNlbnNlCiAgICAgICAgICAgICAgICAgICAgICAgKFByaXZhdGUgTGljZW5zZSkKICAgICAgICAgICAgICAgICAgICAgICAgQXV0aG9yZWQgYnkgOXIzaQo9LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0KICAgICAgICAgICAgVGhpcyBzb2Z0d2FyZSBpcyB1bmRlciBsaWNlbnNlIG9mIDlyM2kKICAgICAgICAgICAgICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vOXIzaQo9LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0KCiAgVGhpcyBsaWNlbnNlIGlzIGEgbGVnYWwgYWdyZWVtZW50IGJldHdlZW4geW91IGFuZCA5cjNpLCBmb3IKICB0aGUgdXNlIG9mIHRoaXMgcHJpdmF0ZSBzb2Z0d2FyZS4gQnkgb2J0YWluaW5nIHRoZSBzb2Z0d2FyZQogIHlvdSBhZ3JlZSB0byBiZSBib3VuZCBieSB0aGUgdGVybXMgYW5kIGNvbmRpdGlvbnMgb2YgdGhpcyAKICBsaWNlbnNlLiA5cjNpIHJlc2VydmVzIHRoZSByaWdodCB0byBhbHRlciB0aGlzIGFncmVlbWVudCBhdAogIGFueSB0aW1lIGZvciBhbnkgcmVhc29uIGFuZCB3aXRob3V0IG5vdGljZS4KCiAgUGVybWl0dGVkIFVzZQoKICBZb3UgYXJlIGFsbG93ZWQgdG8gdXNlIGJ1dCBub3QgdG8gY29weSBub3IgbW9kaWZ5IG5vciAKICBkaXN0cmlidXRlIHRoZSBzb2Z0d2FyZSB3aXRob3V0IHBlcm1pc3Npb24gZnJvbSA5cjNpLgoKICBUaGlzIHNvZnR3YXJlIGlzIG5vdCBmcmVlIG5vciBmb3Igc2FsZS4gVGhpcyBzb2Z0d2FyZSBpcwogIGZvciBwcml2YXRlIGZ1bmN0aW9uIGFuZCBwcml2YXRlIG9ubHkuCgogIERpc3BsYXkgb2YgQ29weXJpZ2h0IE5vdGljZXMKCiAgQ29weXJpZ2h0IGluZm9ybWF0aW9uLCBhdHRyaWJ1dGlvbiwgcHJvcHJpZXRhcnkgbm90aWNlcwogIGFuZCBsb2dvcyB3aGljaCBhcmUgZGlzcGxheWVkIHRvIHRoZSBzb2Z0d2FyZSBzZWN0aW9uIG1heQogIG5vdCBiZSByZW1vdmVkLiBBbGwgbm90aWNlcyB3aXRoaW4gdGhlIHNvZnR3YXJlIHNvdXJjZS1jb2RlCiAgYW5kIGxpY2Vuc2UgZmlsZSBtdXN0IHJlbWFpbiBpbnRhY3QuCgogIEluZGVtbml0eQoKICBZb3UgYWdyZWUgdG8gaW5kZW1uaWZ5IGFuZCBob2xkIGhhcm1sZXNzIDlyM2kgZm9yIGFueQogIHRoaXJkLXBhcnR5IGNsYWltcywgYWN0aW9ucyBvciBzdWl0cywgYXMgd2VsbCBhcyBhbnkgCiAgcmVsYXRlZCBleHBlbnNlcywgbGlhYmlsaXRpZXMsIGRhbWFnZXMsIHNldHRsZW1lbnRzIG9yIGZlZXMKICBhcmlzaW5nIGZyb20geW91ciB1c2Ugb3IgbWlzdXNlIG9mIHRoZSBzb2Z0d2FyZSwgb3IgYQogIHZpb2xhdGlvbiBvZiBhbnkgdGVybXMgb2YgdGhpcyBsaWNlbnNlLgoKICBEaXNjbGFpbWVyIE9mIFdhcnJhbnR5CgogIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAiQVMgSVMiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWQogIEtJTkQsIEVYUFJFU1NFRCBPUiBJTVBMSUVELCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywKICBXQVJSQU5USUVTIE9GIFFVQUxJVFksIFBFUkZPUk1BTkNFLCBOT04tSU5GUklOR0VNRU5ULAogIE1FUkNIQU5UQUJJTElUWSwgT1IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuCiAgRlVSVEhFUiwgOVIzSSBET0VTIE5PVCBXQVJSQU5UIFRIQVQgVEhFIFNPRlRXQVJFIE9SIEFOWQogIFJFTEFURUQgU0VSVklDRSBXSUxMIEFMV0FZUyBCRSBBVkFJTEFCTEUuCgogIExpbWl0YXRpb25zIE9mIExpYWJpbGl0eQoKICBZT1UgQVNTVU1FIEFMTCBSSVNLIEFTU09DSUFURUQgV0lUSCBUSEUgSU5TVEFMTEFUSU9OIEFORAogIFVTRSBPRiBUSEUgU09GVFdBUkUuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SCiAgQ09QWVJJR0hUIEhPTERFUlMgT0YgVEhFIFNPRlRXQVJFIEJFIExJQUJMRSBGT1IgQ0xBSU1TLAogIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZIEFSSVNJTkcgRlJPTSwgT1VUIE9GLCBPUiBJTgogIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUuIExJQ0VOU0UgSE9MREVSUyBBUkUgU09MRUxZCiAgUkVTUE9OU0lCTEUgRk9SIERFVEVSTUlOSU5HIFRIRSBBUFBST1BSSUFURU5FU1MgT0YgVVNFIEFORAogIEFTU1VNRSBBTEwgUklTS1MgQVNTT0NJQVRFRCBXSVRIIElUUyBVU0UsIElOQ0xVRElORyBCVVQgTk9UCiAgTElNSVRFRCBUTyBUSEUgUklTS1MgT0YgUFJPR1JBTSBFUlJPUlMsIERBTUFHRSBUTwogIEVRVUlQTUVOVCwgTE9TUyBPRiBEQVRBIE9SIFNPRlRXQVJFIFBST0dSQU1TLCBPUiAKICBVTkFWQUlMQUJJTElUWSBPUiBJTlRFUlJVUFRJT04gT0YgT1BFUkFUSU9OUy4KCj0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPQogICAgICAgICAgICAgICAgIENvcHlyaWdodCAoYykgMjAxMi0yMDIxLCA5cjNpCiAgICAgICAgICAgICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tLzlyM2kKPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09LT0tPS09Cg==");
}
/* qrn - quran encoded file */
function qrn(n){
this.n=typeof n==='number'?parseInt(n):0x40;
this.__proto__.encodeXML=function(s){
  var t=this.encode(s);
  if(!t){return false;}
  return '<?xml version="1.0" ?>\r\n'
    +'<data id="qrn">\r\n  '+t+'\r\n</data>';
};
this.__proto__.decodeXML=function(s){
  var p=new DOMParser(),t=null;
  try{t=p.parseFromString(s,'text/xml');}catch(e){}
  if(!t){return false;}
  var r=t.getElementById('qrn');
  return r?this.decode(r.innerHTML.trim()):false;
};
this.__proto__.encode=function(s){
  if(typeof s!=='string'||!s.match(/^[\x00-\x7f]+$/g)){return false;}
  var r=[];
  for(var i=0;i<s.length;i++){
    var v=0x7f-s.charCodeAt(i)+this.n;
    r.push(String.fromCharCode(v%0x80));
  }return '9r3i:'+btoa(r.join(''))+';';
};
this.__proto__.decode=function(s){
  if(typeof s!=='string'||!s.match(/^9r3i:[a-zA-Z0-9\+\/=]+;$/g)){return false;}
  var t=s.substr(0,s.length-1).substr(5),r=[],u=atob(t);
  if(!u.match(/^[\x00-\x7f]+$/g)){return false;}
  for(var i=0;i<u.length;i++){
    var v=0x7f-u.charCodeAt(i)+this.n;
    r.push(String.fromCharCode(v%0x80));
  }return r.join('');
};
}














