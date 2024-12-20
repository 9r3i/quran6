/* header.js
 * ~ personal javascript helper
 * authored by 9r3i
 * github.com/9r3i
 * version 1.5.1
 * license: https://github.com/9r3i/crypto/blob/master/license.txt
 */
var D=document,W=window;
/* sortened functions - helper */
function gebi(id){return D.getElementById(id);}
function gebcn(id){return D.getElementsByClassName(id);}
function gebtn(id){return D.getElementsByTagName(id);}
function qs(id){return D.querySelector(id);}
function qsa(id){return D.querySelectorAll(id);}
function ce(id){return D.createElement(id);}
/* standalone functions */
function base64_encode(s){
  return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g,function(m,p){
    return String.fromCharCode('0x'+p);
  }));
}
function base64_decode(s){
  return decodeURIComponent(atob(s).split('').map(function(c){
    return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
function setCookie(cname,cvalue,exdays,domain,path){
  exdays=exdays?parseInt(exdays):1;
  var d=new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires=";expires="+d.toGMTString();
  var domain=domain?";domain="+domain:'';
  var path=path?";path="+path:'';
  /* BlackBerry browser v5 doesn't support document.cookie */
  document.cookie=cname+"="+cvalue+expires+domain+path;
}
function getCookie(cname){
  var name=cname+"=";
  var ca=document.cookie.split(';');
  for(var i=0;i<ca.length;i++){
    var c=ca[i].trim();
    if(c.indexOf(name)==0)return c.substring(name.length,c.length);
  }return "";
}
function htmlspecialchars(string){
  if(typeof string!=="string"){return;}
  if(string.toString()==''){return '';}
  return string.toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#039;').replace(/"/g,'&quot;');
}
function load_script(f,r){
  if(!f){return;}
  var j=document.createElement('script');
  j.type='text/javascript';
  j.async=true;
  var r=r?'?r='+Math.random():'';
  j.src=f+r;
  var s=document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(j,s);
}
function loading_view(id,text){
  var lp=document.getElementById(id);
  if(lp){
    if(text&&lp.childNodes[1]){
      lp.childNodes[1].innerHTML=text;
      return;
    }else{lp.parentElement.removeChild(lp);}
  }
  if(!text){return;}
  var ld=document.createElement('div');
  ld.setAttribute('style','position:fixed;width:0px;height:0px;top:50%;left:50%;z-index:1000;');
  ld.setAttribute('id',id);
  ld.innerHTML='<div style="background-color:#fff;opacity:0.8;position:fixed;width:100%;height:100%;top:0px;left:0px;right:0px;bottom:0px;margin:0px;padding:0px;z-index:1001;"></div><div style="margin:-35px 0px 0px 0px; padding:0px;left:0px; width:100%;height:50px; line-height:15px;vertical-align:top;text-align:center; font-family:consolas,monospace;color:#555;font-size:13px; z-index:1002;position:fixed;">'+text+'</div>';
  document.body.appendChild(ld);
  var lp=document.getElementById(id);
  return lp?lp:false;
}
function post(url,callback,data,unform,upload,download,header,error){
  var xmlhttp=false;
  if(window.XMLHttpRequest){
    xmlhttp=new XMLHttpRequest();
  }else{
    var xhf=[function(){return new ActiveXObject("Msxml2.XMLHTTP");},function(){return new ActiveXObject("Msxml3.XMLHTTP");},function(){return new ActiveXObject("Microsoft.XMLHTTP");}];
    for(var i=0;i<xhf.length;i++){
      try{xmlhttp=xhf[i]();}
      catch(e){continue;}
      break;
    }
  }
  if(!xmlhttp){return;}
  var method=data?'POST':'GET';
  xmlhttp.open(method,url,true);
  this.uniform=function(data){
    var ret=[];
    for(var d in data){
      if(Array.isArray(data[d])||(typeof data[d]=='object'&&data[d]!==null)){
        ret.push(this.uniform(data[d]));
      }
      else{ret.push(encodeURIComponent(d)+"="+encodeURIComponent(data[d]));}
    }
    return ret.join("&");
  };
  if(data&&!unform){
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    data=this.uniform(data);
  }
  if(header&&typeof header=='object'&&header!=null){
    for(var i in header){
      xmlhttp.setRequestHeader(i,header[i]);
    }
  }
  xmlhttp.onreadystatechange=function(){
    var er=false;
    if(callback&&xmlhttp.readyState==4&&xmlhttp.status==200&&xmlhttp.responseText){
      try{var res=JSON.parse(xmlhttp.responseText);}
      catch(e){var res=xmlhttp.responseText;}
      return callback(res);
    }else if(xmlhttp.status==0){
      if(xmlhttp.readyState==4){
        er='error: no internet connection';
        //console.log(er);
      }
    }else if(xmlhttp.readyState<4){
      //console.log('state '+xmlhttp.readyState+' reading...');
    }else{
      er='error: '+xmlhttp.status+' '+xmlhttp.statusText;
      //console.log(er);
      //console.log(xmlhttp);
    }
    if(er){return error?error(er):callback?callback(er):false;}
  };
  if(upload){xmlhttp.upload.onprogress = upload;}
  if(download){xmlhttp.addEventListener("progress",download,false);}
  xmlhttp.send(data);
}
/* require - function post and loading_view */
function load(url,callback,param,unform){
  post(url,callback,param,unform,upload_progress,download_progress);
}
function download_progress(e){
  var id='download_progress';
  if(!e.lengthComputable){return;}
  var ex=(e.loaded/e.total)*100;
  var xx=ex.toFixed(0);
  var xe=xx+'%';
  var lp=document.getElementById(id);
  if(lp){
    var loaded=lp.getAttribute('loaded');
    if(e.loaded<=loaded){return;}
    lp.parentElement.removeChild(lp);
  }
  var url=e.target.responseURL.toString().replace(/^(([^\/]+)?\/)+/g,'').replace(/\?[^\?]+$/g,'');
  var ld=document.createElement('div');
  ld.setAttribute('style','position:fixed;width:0px;height:0px;top:50%;left:50%;z-index:1000;');
  ld.setAttribute('id',id);
  ld.setAttribute('loaded',e.loaded);
  ld.innerHTML='<div style="background-color:#fff;opacity:0.8;position:fixed;width:100%;height:100%;top:0px;left:0px;right:0px;bottom:0px;margin:0px;padding:0px;z-index:1001;"></div><div style="margin:-35px 0px 0px 0px; padding:0px;left:0px; width:100%;height:50px; line-height:15px;vertical-align:top;text-align:center; font-family:consolas,monospace;color:#555;font-size:13px; z-index:1002;position:fixed;">Loading...<br />'+xe+'<br />'+url+'</div>';
  document.body.appendChild(ld);
  if(e.loaded==e.total){
    setTimeout(function(){
      loading_view(id,false);
    },500);
    console.log('Loading is completed; "'+url+'";');
    return;
  }
}
function upload_progress(e){
  var id='upload_progress';
  if(!e.lengthComputable){return;}
  var ex=(e.loaded/e.total)*100;
  var xx=ex.toFixed(0);
  var xe=xx+'%';
  var lp=document.getElementById(id);
  if(lp){
    var loaded=lp.getAttribute('loaded');
    if(e.loaded<=loaded){return;}
    lp.parentElement.removeChild(lp);
  }
  var ld=document.createElement('div');
  ld.setAttribute('style','position:fixed;width:0px;height:0px;top:50%;left:50%;z-index:1000;');
  ld.setAttribute('id',id);
  ld.setAttribute('loaded',e.loaded);
  ld.innerHTML='<div style="background-color:#fff;opacity:0.8;position:fixed;width:100%;height:100%;top:0px;left:0px;right:0px;bottom:0px;margin:0px;padding:0px;z-index:1001;"></div><div style="margin:-35px 0px 0px 0px; padding:0px;left:0px; width:100%;height:50px; line-height:15px;vertical-align:top;text-align:center; font-family:consolas,monospace;color:#555;font-size:13px; z-index:1002;position:fixed;">Sending...<br />'+xe+'</div>';
  document.body.appendChild(ld);
  if(e.loaded==e.total){
    setTimeout(function(){
      loading_view(id,false);
    },500);
    console.log('Sending is completed;');
    return;
  }
}
