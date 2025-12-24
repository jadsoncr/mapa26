// main.js — small shared script for Mapa 2026
// Responsibilities:
// - validate and store `mapa2026_name` and `mapa2026_birthdate`
// - compute a simple personal year number for 2026
// - populate preview and timeline (free screens)
// - handle simulated payment and set `mapa2026_paid` flag
// - copy link and print functions

(function(){
  // map of keywords and short impacts (1-9)
  const MAP = {
    1:{keyword:'Início',impact:'Um ano de inaugurações e foco.'},
    2:{keyword:'Relação',impact:'Assuntos de conexão marcam o ritmo.'},
    3:{keyword:'Expressão',impact:'A criatividade encontra formas novas.'},
    4:{keyword:'Fundação',impact:'Rotina e estrutura ganham espaço.'},
    5:{keyword:'Movimento',impact:'Mudanças e adaptação em evidência.'},
    6:{keyword:'Cuidado',impact:'Responsabilidades afetivas e práticas.'},
    7:{keyword:'Interior',impact:'Um ano de recolhimento e profundidade.'},
    8:{keyword:'Expansão',impact:'Assuntos de poder e maturidade.'},
    9:{keyword:'Conclusão',impact:'Fechamentos simbólicos e liberação.'}
  };

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
    const total = day + month + 2026;
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
    const entry = MAP[num] || MAP[9];
    elYear.textContent = num + ' • 2026';
    elKeyword.textContent = entry.keyword;
    elImpact.textContent = entry.impact; // short, print-worthy
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
    const entry = MAP[num] || MAP[9];

    const rows = [
      {year:2025, keyword:'Contexto', text:'O ano anterior aparece como pano de fundo, oferecendo pontos de referência.'},
      {year:2026, keyword:entry.keyword, text:entry.impact},
      {year:2027, keyword:'Perspectiva', text:'O ano seguinte surge como campo de possibilidade.'}
    ];

    container.innerHTML='';
    rows.forEach(r=>{
      const item = document.createElement('div'); item.className='timeline-entry';
      const h = document.createElement('h3'); h.textContent = r.year + ' — ' + r.keyword; item.appendChild(h);
      const p = document.createElement('p'); p.textContent = r.text; p.style.color = '#6B6B6B'; item.appendChild(p);
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
    const entry = MAP[num] || MAP[9];

    container.innerHTML = '';
    const h2 = document.createElement('h2'); h2.textContent = entry.keyword + ' — 2026'; container.appendChild(h2);
    const p0 = document.createElement('p'); p0.style.color = '#6B6B6B'; p0.textContent = 'Leitura para ' + (s.name || 'você') + ' — foco exclusivo em 2026.'; container.appendChild(p0);

    const p1 = document.createElement('p'); p1.textContent = entry.impact; container.appendChild(p1);
    const p2 = document.createElement('p'); p2.textContent = 'Contexto: 2025 traz referências; 2027 aparece como horizonte. A atenção aqui é para 2026.'; p2.style.color = '#6B6B6B'; container.appendChild(p2);
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

    form.addEventListener('submit', e=>{
      e.preventDefault();
      let ok = true;
      if(!nameInput.value.trim()){ errName.style.display='block'; ok=false; } else errName.style.display='none';
      if(!dobInput.value){ errDob.style.display='block'; ok=false; } else errDob.style.display='none';
      if(!ok) return;
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
