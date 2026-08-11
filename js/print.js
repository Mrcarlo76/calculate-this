
(function(){
  const PRINTABLE_SELECTORS=[
    '.takeoff-result','.u-result','.result-box','.big-result',
    '.summary','#summary','#result','.sports-result','.cooking-result',
    '.stat-grid','table'
  ];

  const pageTitle=()=>(
    document.querySelector('.tool-hero h1, main h1, h1')?.textContent ||
    document.title.split('|')[0] || 'Calculator'
  ).trim();

  function visible(el){
    const s=getComputedStyle(el);
    return s.display!=='none' && s.visibility!=='hidden';
  }

  function resultNodes(){
    const found=[];
    for(const sel of PRINTABLE_SELECTORS){
      document.querySelectorAll(sel).forEach(el=>{
        if(!visible(el)) return;
        if(found.some(x=>x===el || x.contains(el) || el.contains(x))) return;
        found.push(el);
      });
    }
    return found.slice(0,6);
  }

  function hasUsefulOutput(){
    return PRINTABLE_SELECTORS.some(sel=>document.querySelector(sel)) ||
           !!document.querySelector('.text-workbench .stat-grid');
  }

  function fieldRows(){
    const rows=[];
    const seen=new Set();
    document.querySelectorAll('main input,main select,main textarea').forEach(el=>{
      if(!visible(el) || el.type==='button' || el.type==='submit' || el.type==='reset' || el.type==='hidden') return;
      if(el.closest('.ct-print-sheet')) return;
      if(/u-value\.html$/i.test(location.pathname) && el.closest('.layer-row')) return;
      const label=(
        el.labels?.[0]?.textContent ||
        el.closest('label')?.textContent ||
        document.querySelector(`label[for="${el.id}"]`)?.textContent ||
        el.getAttribute('aria-label') ||
        el.name || el.id || ''
      ).replace(/\s+/g,' ').trim();
      let value='';
      if(el.tagName==='SELECT'){
        value=el.options[el.selectedIndex]?.textContent||'';
      }else if(el.type==='checkbox'||el.type==='radio'){
        if(!el.checked) return;
        value=el.value||'Selected';
      }else{
        value=el.value;
      }
      if(!label || !String(value).trim()) return;
      const cleanLabel=label.replace(String(value),'').replace(/\s+/g,' ').trim();
      const key=cleanLabel+'|'+value;
      if(seen.has(key)) return;
      seen.add(key);
      rows.push({label:cleanLabel||label,value:String(value).trim()});
    });
    return rows.slice(0,24);
  }

  function cleanClone(el){
    const c=el.cloneNode(true);
    c.querySelectorAll('button,input,select,textarea,script,.ct-print-actions,.copy-btn,.clear-btn').forEach(x=>x.remove());
    c.querySelectorAll('[hidden]').forEach(x=>x.remove());
    c.querySelectorAll('[style]').forEach(x=>{
      const style=x.getAttribute('style')||'';
      if(/display\s*:\s*none/i.test(style)) x.remove();
    });
    return c;
  }

  function buildSheet(){
    document.querySelector('.ct-print-sheet')?.remove();
    const sheet=document.createElement('section');
    sheet.className='ct-print-sheet';
    sheet.setAttribute('aria-hidden','true');

    const now=new Date();
    const date=now.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    const title=pageTitle();
    const rows=fieldRows();
    const nodes=resultNodes();

    const inputs=rows.length?`
      <section class="ct-print-section">
        <h2>Inputs</h2>
        <div class="ct-print-inputs">
          ${rows.map(r=>`<div><span>${escapeHtml(r.label)}</span><strong>${escapeHtml(r.value)}</strong></div>`).join('')}
        </div>
      </section>`:'';

    sheet.innerHTML=`
      <header class="ct-print-header">
        <div class="ct-print-brand"><span>⌁</span><strong>Calculate This</strong></div>
        <div class="ct-print-meta">calculatethis.uk · ${date}</div>
      </header>
      <div class="ct-print-title"><p>CALCULATOR REPORT</p><h1>${escapeHtml(title)}</h1></div>
      ${inputs}
      ${uValueBuildUp()}
      <section class="ct-print-section ct-print-results"><h2>Results</h2><div class="ct-print-result-content"></div></section>
      <footer class="ct-print-footer">
        <strong>CalculateThis.uk</strong>
        <span>Generated ${date} · Results are estimates and should be checked where accuracy is critical.</span>
      </footer>`;

    const dest=sheet.querySelector('.ct-print-result-content');
    if(nodes.length){
      nodes.forEach(n=>dest.appendChild(cleanClone(n)));
    }else{
      const stats=document.querySelector('.text-workbench .stat-grid');
      if(stats) dest.appendChild(cleanClone(stats));
    }
    document.body.appendChild(sheet);
  }


  function uValueBuildUp(){
    if(!/u-value\.html$/i.test(location.pathname)) return '';
    const rows=[...document.querySelectorAll('.layer-row')].map((row,i)=>{
      const material=row.querySelector('.material')?.selectedOptions?.[0]?.textContent?.split(' — ')[0] || `Layer ${i+1}`;
      const thickness=row.querySelector('.thickness')?.value || '';
      const lambda=row.querySelector('.lambda')?.value || '';
      const resistance=row.querySelector('.layer-r')?.textContent || '—';
      if(!thickness && !lambda) return null;
      return {material,thickness,lambda,resistance};
    }).filter(Boolean);
    if(!rows.length) return '';
    return `
      <section class="ct-print-section ct-uvalue-build">
        <h2>Construction build-up</h2>
        <table class="ct-print-u-table">
          <thead><tr><th>Layer / material</th><th>Thickness</th><th>λ</th><th>R-value</th></tr></thead>
          <tbody>
            ${rows.map(r=>`<tr>
              <td>${escapeHtml(r.material)}</td>
              <td>${escapeHtml(r.thickness)} mm</td>
              <td>${escapeHtml(r.lambda)} W/mK</td>
              <td>${escapeHtml(r.resistance)} m²K/W</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </section>`;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }

  function addButton(){
    if(!document.body.classList.contains('ct-tool-page') || !hasUsefulOutput()) return;
    if(document.querySelector('.ct-print-actions')) return;

    const result=resultNodes()[0] || PRINTABLE_SELECTORS.map(sel=>document.querySelector(sel)).find(Boolean);
    const main=document.querySelector('main');
    if(!main) return;

    const wrap=document.createElement('div');
    wrap.className='ct-print-actions';
    wrap.innerHTML=`<button type="button" class="ct-print-btn"><span aria-hidden="true">⎙</span><span>Print / Save PDF</span></button>`;

    const anchor=result || main.querySelector('.text-workbench') || main.lastElementChild;
    if(anchor && anchor.parentNode) anchor.insertAdjacentElement('afterend',wrap);
    else main.appendChild(wrap);

    wrap.querySelector('button').addEventListener('click',()=>{
      buildSheet();
      requestAnimationFrame(()=>window.print());
    });
  }

  window.addEventListener('beforeprint',()=>{if(document.body.classList.contains('ct-tool-page')&&hasUsefulOutput())buildSheet()});
  window.addEventListener('afterprint',()=>document.querySelector('.ct-print-sheet')?.remove());
  document.addEventListener('DOMContentLoaded',addButton);
})();
