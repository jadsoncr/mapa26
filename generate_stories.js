const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async ()=>{
  const outDir = path.resolve(__dirname, 'exports');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  // Look for layout assets inside the workspace first, then fall back to known desktop locations
  const candidateLayoutDirs = [
    path.join(__dirname, 'layout'),
    path.resolve('C:/Users/Jads/Layout'),
    path.resolve('C:/Users/Jads/OneDrive/Área de Trabalho/Layout')
  ];
  let layout = { logoDataUrl: null, customCss: '', backgroundDataUrl: null };
  try{
    let foundDir = null;
    for(const d of candidateLayoutDirs){ if(fs.existsSync(d)){ foundDir = d; break; } }
    if(foundDir){
      const files = fs.readdirSync(foundDir);
      const logoFile = files.find(f=>/(logo|brand|mark)\.(png|jpg|jpeg|svg)/i.test(f));
      if(logoFile){
        const buf = fs.readFileSync(path.join(foundDir, logoFile));
        const ext = path.extname(logoFile).slice(1).toLowerCase();
        const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'jpg' ? 'image/jpeg' : `image/${ext}`);
        layout.logoDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
      }
      const cssFile = files.find(f=>/\.css$/i.test(f));
      if(cssFile){ layout.customCss = fs.readFileSync(path.join(foundDir, cssFile), 'utf8'); }
      const bgFile = files.find(f=>/(background|bg|hero)\.(png|jpg|jpeg)/i.test(f));
      if(bgFile){
        const buf = fs.readFileSync(path.join(foundDir, bgFile));
        const ext = path.extname(bgFile).slice(1).toLowerCase();
        const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
        layout.backgroundDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
      }
      // If there is a fonts folder, embed WOFF2 fonts as data-URIs into customCss
      const fontsDir = path.join(foundDir, 'fonts');
      if(fs.existsSync(fontsDir)){
        const ffiles = fs.readdirSync(fontsDir).filter(f=>/\.woff2$/i.test(f));
        ffiles.forEach(ff=>{
          try{
            const buf = fs.readFileSync(path.join(fontsDir, ff));
            const b64 = buf.toString('base64');
            // derive font family and weight from filename
            let family = 'Inter';
            if(/Cormorant/i.test(ff)) family = 'Cormorant Garamond';
            let weight = '400';
            if(/SemiBold|Semi|600/i.test(ff)) weight = '600';
            if(/Medium|500/i.test(ff)) weight = '500';
            if(/Regular|400/i.test(ff)) weight = '400';
            layout.customCss += `@font-face{font-family:"${family}";src:url("data:font/woff2;base64,${b64}") format('woff2');font-weight:${weight};font-style:normal;font-display:swap;}\n`;
          }catch(e){ console.warn('Failed to embed font', ff, e) }
        });
      }
      console.log('Using layout assets from', foundDir);
    }
  }catch(e){ console.warn('Layout load failed', e) }

  const browser = await puppeteer.launch({headless: true, args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();

  // Story viewport (9:16)
  const STORY_W = 720;
  const STORY_H = Math.round(STORY_W * 16 / 9); // 1280
  await page.setViewport({width: STORY_W, height: STORY_H, deviceScaleFactor: 2});

  // load editorial JSON locally to avoid network
  const experPath = path.join(__dirname, 'editorial', 'experiencia_gratuita_sprint2_2026.json');
  const experData = JSON.parse(fs.readFileSync(experPath, 'utf8'));

  for(let n=1;n<=9;n++){
    console.log('Generating', n);

    // set a minimal page content (no external fetches)
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
    await page.evaluate(() => document.fonts && document.fonts.ready ? document.fonts.ready : null);

    // inject editorial data and build clean layout for number n
    await page.evaluate((num, exper, layout) => {
      const data = exper;
      const rec = data.find(x=>x.numero===num);
      // build clean inner HTML (ritual-only, no debug UI)
      const logoHtml = layout.logoDataUrl ? `<div style="text-align:center;margin-bottom:12px"><img src="${layout.logoDataUrl}" alt="logo" style="width:96px;height:auto;display:inline-block"/></div>` : '';
      const styleTag = layout.customCss ? `<style>${layout.customCss}</style>` : '';
        // add extra premium tweaks to ensure consistent export visuals
        const root = document.documentElement;
        root.style.setProperty('--premium-contrast', '#F5F5F5');
        root.style.setProperty('--muted-1', '#9A9A9A');
        root.style.setProperty('--muted-2', '#C9C9C9');

      const html = `
        <div class="mx-auto" style="width:360px;padding:36px;box-sizing:border-box;font-family:Inter,system-ui,Arial;">
          ${logoHtml}
          ${styleTag}
          <header style="text-align:center;margin-bottom:18px">
            <h1 style="font-family:Cormorant Garamond,serif;font-size:40px;margin:0">Mapa 2026</h1>
            <p style="color:rgba(255,255,255,0.65);margin-top:8px">Um convite para atravessar o ano com mais consciência e presença.</p>
          </header>

          <section style="margin-bottom:18px">
            <p style="text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 8px 0">Seu Ano Pessoal é</p>
            <div>
              <h2 style="font-family:Cormorant Garamond,serif;font-size:86px;margin:0;line-height:0.9">${rec.numero}</h2>
              <p style="color:rgba(255,255,255,0.75);margin-top:6px">${rec.telas.tela1.split('\n').pop()}</p>
            </div>
          </section>

          <section style="margin-bottom:18px">
            <h3 style="font-family:Cormorant Garamond,serif;font-size:20px;margin:0 0 8px 0">O significado deste ano</h3>
            <p style="color:rgba(255,255,255,0.7);line-height:1.4;margin:0">${(rec.telas.tela2||[]).join(' ')}</p>
          </section>

          <section style="background:rgba(0,0,0,0.2);padding:18px;border-radius:12px;text-align:center;margin-bottom:18px">
            <p style="font-family:Cormorant Garamond,serif;font-size:20px;margin:0">${rec.telas.tela3}</p>
          </section>

          <section style="margin-bottom:18px">
            <h3 style="font-family:Cormorant Garamond,serif;font-size:20px;margin:0 0 8px 0">As cores do seu ano</h3>
            <div style="display:flex;gap:12px;align-items:center;margin-top:8px;margin-bottom:8px">
              <div style="width:56px;height:56px;border-radius:999px;background:${rec.cores.hex[0]}"></div>
              <div style="width:56px;height:56px;border-radius:999px;background:${rec.cores.hex[1]}"></div>
            </div>
            <p style="color:rgba(255,255,255,0.7);margin:0">${rec.cores.texto.replace(/\n/g,' ')}</p>
          </section>

          <footer style="margin-top:12px;text-align:center">
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0">Mapa 2026 — imagem para Stories</p>
          </footer>
        </div>
      `;

      // create wrapper sized to story ratio centered
      let wrapper = document.getElementById('puppeteer_story_frame');
      if(wrapper) wrapper.remove();
      wrapper = document.createElement('div');
      wrapper.id = 'puppeteer_story_frame';
      wrapper.style.width = '720px';
      wrapper.style.height = Math.round(720*16/9) + 'px';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.background = '#071019';
      if(layout.backgroundDataUrl){
        wrapper.style.backgroundImage = `url("${layout.backgroundDataUrl}")`;
        wrapper.style.backgroundSize = 'cover';
        wrapper.style.backgroundPosition = 'center';
      }
      wrapper.style.padding = '0';
      wrapper.style.boxSizing = 'border-box';
      wrapper.innerHTML = html;

      document.body.appendChild(wrapper);
    }, n, experData, layout);

    // wait for the wrapper to be present and for fonts
    await page.waitForSelector('#puppeteer_story_frame');
    await page.evaluate(()=> document.fonts && document.fonts.ready ? document.fonts.ready : null);

    const elem = await page.$('#puppeteer_story_frame');
    const outPath = path.join(outDir, `ano-${n}.png`);
    await elem.screenshot({path: outPath, type:'png'});
    console.log('Saved', outPath);

    // cleanup wrapper
    await page.evaluate(()=>{ const w=document.getElementById('puppeteer_story_frame'); if(w) w.remove(); });
  }

  await browser.close();
  console.log('All done');
})();
