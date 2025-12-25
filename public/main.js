// main.js — small shared script for Mapa 2026
// Responsibilities:
// - validate and store `mapa2026_name` and `mapa2026_birthdate`
// - compute a simple personal year number for 2026
// - populate preview and timeline (free screens)
// - handle simulated payment and set `mapa2026_paid` flag
// - copy link and print functions

(function(){
  // Defensive check: ensure data file window.MAPA2026_DATA is present.
  if (!window.MAPA2026_DATA) {
    console.error("[MAPA2026] Dados ausentes: window.MAPA2026_DATA não carregou. Verifique a ordem do <script src='data/mapa2026-data.js'> antes do main.js.");
    const isIndex = location.pathname === "/" || /index\.html$/.test(location.pathname);
    if (!isIndex) location.href = "index.html";
    return;
  }

  // Guard: map payment status handling and protected resultado access
  const params = new URLSearchParams(window.location.search);

  const status =
    params.get("status") ||
    params.get("collection_status");

  if (status === "approved") {
    localStorage.setItem("mapa2026_paid", "true");
  }

  if (window.location.pathname.includes("resultado.html")) {
    const paid = localStorage.getItem("mapa2026_paid") === "true";

    if (!paid) {
      window.location.href = "convite.html";
    }
  }

  // read data-driven content (source of truth)
  const DATA = (window.MAPA2026_DATA || { targetYear:2026, numbers: {} });
  const NUMBERS = DATA.numbers || {};
  const TARGET_YEAR = DATA.targetYear || 2026;

  // helpers
  function getStored(){
    return {
      name: localStorage.getItem('mapa2026_name') || '',
      birthdate: localStorage.getItem('mapa2026_birthdate') || '',
      paid: localStorage.getItem('mapa2026_paid') === 'true'
    };
  }

  function saveStored(name,birthdate){
    localStorage.setItem('mapa2026_name', name || '');
    localStorage.setItem('mapa2026_birthdate', birthdate || '');
  }

  function digitalRoot(n){ n = Math.abs(n); while(n>9){ n = String(n).split('').reduce((s,c)=>s+Number(c),0); } return n===0?9:n; }
  function computePersonalYear(birthdate){
    if(!birthdate) return null; // expect yyyy-mm-dd
    const parts = birthdate.split('-').map(Number);
    if(parts.length!==3) return null;
    const day = parts[2], month = parts[1];
    const total = day + month + TARGET_YEAR;
    return digitalRoot(total);
  }

  // Copy link helper
  function copyLink(){
    const url = location.href.split('#')[0];
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(url).then(()=>true).catch(()=>false);
    }
    try{ window.prompt('Copiar link:', url); return Promise.resolve(true); }catch(e){ return Promise.resolve(false); }
  }

  // Populate preview.html
  function populatePreview(){
    const elYear = document.getElementById('year');
    const elKeyword = document.getElementById('keyword');
    const elImpact = document.getElementById('impact');
    const elSwatches = document.getElementById('swatches');
    if(!elYear) return;
    const s = getStored();
    if(!s.birthdate){ window.location.href = 'inicio.html'; return; }
    const num = computePersonalYear(s.birthdate) || 1;
    const entry = NUMBERS[num] || NUMBERS[9] || {};
    elYear.textContent = num + ' • ' + TARGET_YEAR;
    elKeyword.textContent = entry.keyword || '';
    elImpact.textContent = entry.impact || ''; // short, print-worthy
    if(elSwatches){ elSwatches.innerHTML=''; ['#F2EFEA','#DCE7F0','#2F5D8C'].forEach(c=>{ const d = document.createElement('div'); d.className='swatch'; d.style.background = c; elSwatches.appendChild(d); }); }

    // wire copy link
    const copyBtn = document.getElementById('copyLink');
    if(copyBtn) copyBtn.addEventListener('click', async ()=>{
      await copyLink();
      copyBtn.textContent = 'Link copiado';
      setTimeout(()=>copyBtn.textContent = 'Copiar link',1200);
    });
  }

  // Populate mapa.html timeline
  function populateTimeline(){
    const container = document.getElementById('timeline');
    if(!container) return;
    const s = getStored();
    if(!s.birthdate){ window.location.href='inicio.html'; return; }
    const num = computePersonalYear(s.birthdate) || 1;
    // compute previous/current/next numbers with wrap 1..9
    const current = num;
    const prev = current - 1 >= 1 ? current - 1 : 9;
    const next = current + 1 <= 9 ? current + 1 : 1;

    const prevYear = TARGET_YEAR - 1;
    const currYear = TARGET_YEAR;
    const nextYear = TARGET_YEAR + 1;
    // helper to create a short teaser
    function teaser(text){
      if(!text) return '';
      const cleaned = String(text).replace(/\s+/g,' ').trim();
      const firstSentenceEnd = cleaned.indexOf('. ');
      if(firstSentenceEnd !== -1 && firstSentenceEnd < 120) return cleaned.slice(0, firstSentenceEnd+1);
      return cleaned.length > 120 ? cleaned.slice(0,120).trim() + '…' : cleaned;
    }

    const paid = localStorage.getItem('mapa2026_paid') === 'true';

    const numbersToRender = [
      { number: prev, year: prevYear },
      { number: current, year: currYear },
      { number: next, year: nextYear }
    ];

    container.innerHTML = '';
    numbersToRender.forEach(nr=>{
      const idx = nr.number;
      const entry = NUMBERS[idx] || {};
      const keyword = entry.keyword || '';
      let contentText = '';
      if(paid){
        contentText = entry.timelineText || entry.impact || '';
      } else {
        // before payment: only show keyword + impact + a short teaser
        const impact = entry.impact || '';
        const shortTease = entry.timelineText ? teaser(entry.timelineText) : '';
        contentText = (impact ? impact + ' ' : '') + (shortTease ? shortTease : '');
      }

      const item = document.createElement('div'); item.className='timeline-entry';
      const h = document.createElement('h3'); h.textContent = nr.number + ' • ' + nr.year + ' — ' + keyword; item.appendChild(h);
      const p = document.createElement('p'); p.textContent = contentText; p.style.color = '#6B6B6B'; item.appendChild(p);

      if(!paid){
        const unlock = document.createElement('div'); unlock.style.marginTop='10px';
        const a = document.createElement('a'); a.href = 'convite.html'; a.className = 'button'; a.textContent = 'Desvendar 2026';
        unlock.appendChild(a);
        item.appendChild(unlock);
      }

      container.appendChild(item);
    });

    // add short print-worthy sentence at end
    const end = document.createElement('p'); end.style.marginTop='14px'; end.style.fontStyle='italic'; end.textContent = 'Um ano para perceber mais do que decidir.';
    container.appendChild(end);
  }

  // Simulate payment (convite.html)
  function bindPaymentSimulation(){
    const form = document.getElementById('payForm');
    if(!form) return;
    const btn = document.getElementById('payBtn');
    const msg = document.getElementById('payMessage');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      btn.disabled = true; btn.textContent = 'Processando…';
      const name = (document.getElementById('name')||{}).value || '';
      const email = (document.getElementById('email')||{}).value || '';
      // small delay to simulate
      setTimeout(()=>{
        localStorage.setItem('mapa2026_paid','true');
        localStorage.setItem('mapa2026_purchase_name', name);
        if(email) localStorage.setItem('mapa2026_purchase_email', email);
        // redirect to resultado
        location.href = 'resultado.html';
      },800);
    });

    // if came from protected redirect, show calm message
    const params = new URLSearchParams(location.search);
    if(params.get('protected')==='1' && msg) msg.textContent = 'É necessário adquirir o mapa para acessar esta leitura. O pagamento garante acesso imediato.';
  }

  // Resultado: protect and populate full reading
  async function populateResultado(){
    const container = document.getElementById('result');
    if(!container) return;
    const s = getStored();
    if(!s.paid){
      // redirect to payment with calm message
      location.href = 'convite.html?protected=1';
      return;
    }
    const num = computePersonalYear(s.birthdate) || 1;
    const entry = NUMBERS[num] || NUMBERS[9] || {};

    container.innerHTML = '';
    const h2 = document.createElement('h2'); h2.textContent = (entry.keyword || '') + ' — ' + TARGET_YEAR; container.appendChild(h2);
    const p0 = document.createElement('p'); p0.style.color = '#6B6B6B'; p0.textContent = 'Leitura para ' + (s.name || 'você') + ' — foco exclusivo em 2026.'; container.appendChild(p0);
    const p1 = document.createElement('p'); p1.textContent = entry.impact || ''; container.appendChild(p1);
    const p2 = document.createElement('p'); p2.textContent = 'Contexto: ' + (TARGET_YEAR - 1) + ' traz referências; ' + (TARGET_YEAR + 1) + ' aparece como horizonte. A atenção aqui é para ' + TARGET_YEAR + '.'; p2.style.color = '#6B6B6B'; container.appendChild(p2);
  }

  // Print binding
  function bindPrint(){
    const btn = document.getElementById('printBtn');
    if(!btn) return;
    btn.addEventListener('click', ()=> window.print());
  }

  // Handle inicio form submission
  function bindInicio(){
    const form = document.getElementById('f');
    if(!form) return;
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const errName = document.getElementById('err-name');
    const errDob = document.getElementById('err-dob');
    const btn = document.getElementById('btnContinue');
    // do not show errors initially; show on blur or on submit
    let touchedName = false;
    let touchedDob = false;

    function validateName(show){
      const ok = nameInput.value && nameInput.value.trim().length>0;
      if(show && !ok) errName.style.display='block'; else errName.style.display='none';
      return ok;
    }
    function validateDob(show){
      const ok = !!dobInput.value;
      if(show && !ok) errDob.style.display='block'; else errDob.style.display='none';
      return ok;
    }

    nameInput.addEventListener('blur', ()=>{ touchedName = true; validateName(true); });
    dobInput.addEventListener('blur', ()=>{ touchedDob = true; validateDob(true); });

    nameInput.addEventListener('input', ()=>{ if(touchedName) validateName(true); else errName.style.display='none'; });
    dobInput.addEventListener('input', ()=>{ if(touchedDob) validateDob(true); else errDob.style.display='none'; });

    form.addEventListener('submit', e=>{
      e.preventDefault();
      const okName = validateName(true);
      const okDob = validateDob(true);
      if(!okName || !okDob) return;
      // save and go to preview
      saveStored(nameInput.value.trim(), dobInput.value);
      btn.disabled = true; btn.textContent = 'Gerando…';
      setTimeout(()=> location.href = 'preview.html', 500);
    });
  }

  // On DOM ready wire everything depending on page
  document.addEventListener('DOMContentLoaded', ()=>{
    bindInicio();
    bindPaymentSimulation();
    bindPrint();

    if(document.getElementById('year')) populatePreview();
    if(document.getElementById('timeline')) populateTimeline();
    if(document.getElementById('result')) populateResultado();
  });

})();
