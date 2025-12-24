Recebi a imagem enviada como anexo nesta conversa.

Ação necessária (local):
- Salve a imagem anexa como `assets/gamma/hero-bg.jpg` no repositório local.

Exemplo de comando PowerShell (substitua o caminho de origem pelo local do arquivo baixado):

```powershell
# supondo que o anexo foi salvo em Downloads como 'anexo.jpg'
Copy-Item -Path "$env:USERPROFILE\Downloads\anexo.jpg" -Destination "C:\Users\Jads\Mapa2026\assets\gamma\hero-bg.jpg" -Force

# confirmar e commitar
cd 'C:\Users\Jads\Mapa2026'
git add assets/gamma/hero-bg.jpg
git commit -m "chore(gamma): add hero-bg.jpg from attachment"
git push -u origin mapa-site
```

Se preferir, eu posso tentar commitar o arquivo daqui — preciso que você coloque o binário em `assets/gamma/hero-bg.jpg` primeiro (ou me autorize a executar o upload se sua interface permitir). Depois de salvo, eu ajusto o CSS fino 1:1 se necessário.
