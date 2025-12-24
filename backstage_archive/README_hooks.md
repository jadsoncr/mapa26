Habilitar hooks locais para rodar o validador editorial

1) Configure o Git para usar a pasta de hooks deste projeto:

```bash
git config core.hooksPath .githooks
```

2) Teste localmente o validador:

```bash
python tools\validate_editorial.py
```

3) Agora, ao fazer `git commit`, o hook `.githooks/pre-commit` executará o validador e abortará o commit se a validação falhar.

Observações:
- No Windows use PowerShell/Command Prompt ou Git Bash; o hook é um shell script e funciona com Git Bash.
- Para remover o hook: `git config --unset core.hooksPath`.
