Geração em lote de PNGs (Puppeteer)

Pré-requisitos:
- Node.js (v18+ recomendado)
- O servidor local deve estar rodando na raiz do projeto: `python -m http.server 8000 --bind 127.0.0.1`

Passos:

1) Instalar dependências

```bash
npm install
```

2) Executar geração (gera `exports/ano-1.png` .. `exports/ano-9.png`)

```bash
npm run generate
```

Notas:
- O script `generate_stories.js` abre `http://127.0.0.1:8000/preview_map.html` e injeta o conteúdo limpo para cada número (1..9), garantindo visual ritual-only (sem botões, sem painel raw).
- Os PNGs são 9:16 (720x1280) e salvos em `exports/`.
- Puppeteer faz o download do Chromium na primeira instalação; isso pode demorar alguns minutos.
- Se você preferir usar o Chrome já instalado, ajuste `puppeteer.launch({executablePath: '/c/Program Files/Google/Chrome/Application/chrome.exe'})` no script (Windows) e remova dependência extra.
