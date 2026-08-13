
(function(){
  const page=(location.pathname.split('/').pop()||'index.html').split('?')[0];

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
    const title=CONSTRUCTION_REPORTS[page]?.title || pageTitle();
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
      ${constructionReport()}
      ${CONSTRUCTION_REPORTS[page]?'':`<section class="ct-print-section ct-print-results"><h2>Results</h2><div class="ct-print-result-content"></div></section>`}
      <footer class="ct-print-footer">
        <strong>CalculateThis.uk</strong>
        <span>Generated ${date} · Results are estimates and should be checked where accuracy is critical.</span>
      </footer>`;

    const dest=sheet.querySelector('.ct-print-result-content');
    if(dest){
      if(nodes.length){
        nodes.forEach(n=>dest.appendChild(cleanClone(n)));
      }else{
        const stats=document.querySelector('.text-workbench .stat-grid');
        if(stats) dest.appendChild(cleanClone(stats));
      }
    }
    document.body.appendChild(sheet);
  }



  const CONSTRUCTION_REPORTS={
    'plasterboard.html':{title:'Plasterboard Take-off',assumptions:['Board quantity is rounded up to full sheets.','Waste allowance is applied to the calculated board requirement.','Openings, layout and site cutting can alter final quantities.']},
    'metal-stud-partition.html':{title:'Metal Stud Partition Take-off',assumptions:['Upright quantity is based on the selected centres plus an end stud, with one additional full-height whipper/support stud allowed for each single or double door opening.','Every stud splice uses a 600 mm overlap; that overlap is included in the material requirement.','Stud ordering uses the selected single stock length and assumes usable offcuts can be reused elsewhere on the same partition. The recommended length minimises total extra stud material above installed upright length, including splice overlap.','Base track is calculated over the full partition length and is not reduced for door openings.','Head track is calculated over the full partition length plus 1.30 m for each single door and 2.10 m for each double door; these allowances include 150 mm turn-downs at both sides of each door head.','Base and head track are independently rounded up to their selected 3.0 m or 3.6 m stock lengths.','Board estimate covers both faces of the partition, supports one or two layers per side, applies the selected board waste allowance and does not deduct door openings.']},
    'mf-ceiling.html':{title:'MF Ceiling Take-off',assumptions:['MF5 sections are estimated at approximately 400 mm centres.','MF7 primary channels are estimated at approximately 1200 mm centres.','Bulkheads, changes in level, hangers and manufacturer details are not fully modelled.']},
    'screed.html':{title:'Screed Quantity Take-off',assumptions:['Volume uses the entered average screed depth.','Waste is added to the calculated net volume.','Falls, uneven substrates and minimum specified depths can increase requirements.']},
    'concrete.html':{title:'Concrete Quantity Take-off',assumptions:['Net volume is length × width × depth.','Waste allowance is added after the net volume calculation.','Excavation tolerance, uneven formation and supplier minimum loads should be checked.']},
    'insulation.html':{title:'Insulation Take-off',assumptions:['Pack quantity is rounded up to full packs.','Waste is applied to the surface area before pack quantity is calculated.','Cuts, framing centres and manufacturer installation requirements can change quantities.']},
    'brick-block.html':{title:'Brick & Block Take-off',assumptions:['Unit quantity uses the selected nominal units-per-square-metre rate.','Waste allowance is added to the calculated unit requirement.','Openings, piers, bonding patterns and cuts should be measured separately where significant.']}
  };

  function constructionReport(){
    const cfg=CONSTRUCTION_REPORTS[page];
    if(!cfg) return '';
    const stats=[...document.querySelectorAll('.takeoff-result .takeoff-stat')].map(x=>({
      label:(x.querySelector('span')?.textContent||'').trim(),
      value:(x.querySelector('strong')?.textContent||'—').trim()
    })).filter(x=>x.label);
    const note=(document.querySelector('.takeoff-note')?.textContent||'').trim();
    const rec=page==='metal-stud-partition.html' ? document.querySelector('#studRecommendation .stud-rec-head') : null;
    const recText=rec ? (rec.textContent||'').replace(/\s+/g,' ').trim() : '';
    return `
      ${recText?`<section class="ct-print-section ct-takeoff-recommendation"><h2>Recommended stud stock length</h2><p class="ct-print-rec">${escapeHtml(recText)}</p></section>`:''}
      <section class="ct-print-section ct-takeoff-summary">
        <h2>Material / quantity summary</h2>
        <table class="ct-print-takeoff-table">
          <thead><tr><th>Item</th><th>Calculated quantity</th></tr></thead>
          <tbody>${stats.map(x=>`<tr><td>${escapeHtml(x.label)}</td><td><strong>${escapeHtml(x.value)}</strong></td></tr>`).join('')}</tbody>
        </table>
      </section>
      <section class="ct-print-section ct-takeoff-assumptions">
        <h2>Basis & assumptions</h2>
        <ul>${cfg.assumptions.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>
        ${note?`<p class="ct-takeoff-note">${escapeHtml(note)}</p>`:''}
      </section>`;
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
