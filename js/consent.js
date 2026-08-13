(function(){
var K='ct_analytics_consent_v1',ID='G-Z4E4XM1SNS',loaded=false;
function loadAnalytics(){
  if(loaded)return;loaded=true;
  if(typeof gtag!=='function'){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};}
  gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('js',new Date());gtag('config',ID);
  var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ID);
  document.head.appendChild(s);
}
function deny(){
  if(typeof gtag==='function')gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
}
function h(){var b=document.getElementById('ct-consent');if(b)b.remove();}
function s(v){try{localStorage.setItem(K,v)}catch(e){}if(v==='granted')loadAnalytics();else deny();h();}
function show(){
  if(document.getElementById('ct-consent'))return;
  var b=document.createElement('div');b.id='ct-consent';b.className='ct-consent';b.setAttribute('role','dialog');b.setAttribute('aria-label','Analytics cookies');
  b.innerHTML='<div class="ct-consent-copy"><strong>Help us improve Calculate This</strong><span>We use Google Analytics to understand visits and which tools are useful. Analytics cookies are optional.</span><a href="privacy.html">Privacy</a></div><div class="ct-consent-actions"><button type="button" class="ct-consent-reject">Reject analytics</button><button type="button" class="ct-consent-accept">Accept analytics</button></div>';
  document.body.appendChild(b);b.querySelector('.ct-consent-reject').onclick=function(){s('denied')};b.querySelector('.ct-consent-accept').onclick=function(){s('granted')};
}
var v=null;try{v=localStorage.getItem(K)}catch(e){}
if(v==='granted')loadAnalytics();else if(v==='denied')deny();else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show);else show();
window.CalculateThisPrivacy={show:show,reset:function(){try{localStorage.removeItem(K)}catch(e){}location.reload()}};
})();