
(function(){
  const FAV_KEY='ct_favourites_v1', REC_KEY='ct_recent_v1', MAX_RECENT=5, HOME_LIMIT=5;
  const read=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const cleanPath=(u)=>String(u||'').split('/').pop().split('?')[0].split('#')[0];
  const page=cleanPath(location.pathname)||'index.html';
  const title=(document.querySelector('h1')?.textContent||document.title.split('|')[0]).trim();
  const isTool=document.body.classList.contains('ct-tool-page');

  function saveButton(){
    if(!isTool) return;
    const header=document.querySelector('header.nav');
    const nav=header?.querySelector('nav');
    if(!header||!nav||header.querySelector('.ct-fav-btn')) return;

    let right=header.querySelector('.ct-nav-right');
    if(!right){
      right=document.createElement('div');
      right.className='ct-nav-right';
      nav.parentNode.insertBefore(right,nav);
      right.appendChild(nav);
    }

    let fav=read(FAV_KEY);
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='ct-fav-btn';
    btn.setAttribute('aria-label','Save this tool to favourites');

    const paint=()=>{
      fav=read(FAV_KEY);
      const on=fav.some(x=>x.url===page);
      btn.classList.toggle('saved',on);
      btn.setAttribute('aria-pressed',String(on));
      btn.innerHTML=`<span class="ct-fav-star" aria-hidden="true">${on?'★':'☆'}</span><span class="ct-fav-label">${on?'Saved':'Save'}</span>`;
      btn.setAttribute('aria-label',on?'Remove this tool from favourites':'Save this tool to favourites');
    };

    btn.addEventListener('click',()=>{
      fav=read(FAV_KEY);
      const i=fav.findIndex(x=>x.url===page);
      if(i>=0) fav.splice(i,1);
      else fav.unshift({name:title,url:page});
      write(FAV_KEY,fav);
      paint();
    });

    paint();
    right.appendChild(btn);
  }

  function recordRecent(){
    if(!isTool) return;
    let r=read(REC_KEY).filter(x=>x.url!==page);
    r.unshift({name:title,url:page,ts:Date.now()});
    write(REC_KEY,r.slice(0,MAX_RECENT));
  }

  function renderHome(){
    const mount=document.getElementById('ctPersonalTools');
    if(!mount) return;
    const fav=read(FAV_KEY).slice(0,HOME_LIMIT);
    const recent=read(REC_KEY).slice(0,HOME_LIMIT);
    if(!fav.length&&!recent.length){mount.hidden=true;return}

    const cards=(arr,empty)=>arr.length
      ? arr.map(x=>`<a class="ct-personal-card" href="${x.url}"><span>${x.name}</span><b aria-hidden="true">→</b></a>`).join('')
      : `<p class="ct-personal-empty">${empty}</p>`;

    mount.hidden=false;
    mount.innerHTML=`
      <div class="ct-personal-col favourites">
        <div class="ct-personal-head"><span aria-hidden="true">★</span><h2>Favourites</h2></div>
        <div class="ct-personal-list">${cards(fav,'Save calculators and they’ll appear here.')}</div>
      </div>
      <div class="ct-personal-col recent">
        <div class="ct-personal-head"><span aria-hidden="true">↻</span><h2>Recently used</h2></div>
        <div class="ct-personal-list">${cards(recent,'Your recent calculators will appear here.')}</div>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded',()=>{recordRecent();saveButton();renderHome()});
})();
