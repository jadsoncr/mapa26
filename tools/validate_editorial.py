import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANCO = ROOT / 'editorial' / 'banco_editorial_ano_pessoal_2026.json'
EXP = ROOT / 'editorial' / 'experiencia_gratuita_sprint2_2026.json'

HEX_RE = re.compile(r'^#[0-9A-Fa-f]{6}$')
FORBIDDEN = ['sorte', 'destino', 'acontecimentos']
errors = []


def load(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'Erro ao ler {path}: {e}')
        return None


def check_banco(data):
    if not isinstance(data, list):
        errors.append('`banco` deve ser uma lista')
        return
    if len(data) != 9:
        errors.append(f'`banco` deve conter 9 registros (achados {len(data)})')

    nums = []
    for i, r in enumerate(data, start=1):
        base = f'banco[{i}]'
        if not isinstance(r, dict):
            errors.append(f'{base} não é objeto')
            continue
        # numero
        n = r.get('numero')
        if not isinstance(n, int) or not (1 <= n <= 9):
            errors.append(f'{base}.numero inválido: {n}')
        else:
            nums.append(n)
        # tema
        if not isinstance(r.get('tema'), str):
            errors.append(f'{base}.tema ausente ou não-string')
        # descricao_curta
        if not isinstance(r.get('descricao_curta'), str):
            errors.append(f'{base}.descricao_curta ausente ou não-string')
        # palavras_chave
        pk = r.get('palavras_chave')
        if not isinstance(pk, list) or not (3 <= len(pk) <= 5):
            errors.append(f'{base}.palavras_chave deve ter 3–5 itens')
        # cores
        cores = r.get('cores')
        if not isinstance(cores, list) or len(cores) != 2:
            errors.append(f'{base}.cores deve ter 2 nomes')
        # hex
        hx = r.get('hex')
        if not isinstance(hx, list) or len(hx) != 2:
            errors.append(f'{base}.hex deve ter 2 códigos')
        else:
            for x in hx:
                if not isinstance(x, str) or not HEX_RE.match(x):
                    errors.append(f'{base}.hex código inválido: {x}')
        # frases_impacto
        fi = r.get('frases_impacto')
        if not isinstance(fi, list) or len(fi) != 3:
            errors.append(f'{base}.frases_impacto deve ter exatamente 3 frases')
        else:
            for f in fi:
                if not isinstance(f, str):
                    errors.append(f'{base}.frase não-string: {f}')
                else:
                    low = f.lower()
                    for bad in FORBIDDEN:
                        if bad in low:
                            errors.append(f'{base}.frase contém termo proibido "{bad}": {f}')

    # check uniqueness and completeness
    nums_sorted = sorted(nums)
    if nums_sorted != list(range(1, 10)):
        errors.append(f'`numero` deve conter todos os inteiros 1..9 sem repetição; encontrado: {nums_sorted}')


def check_experiencia(data):
    if not isinstance(data, list):
        errors.append('`experiencia` deve ser uma lista')
        return
    if len(data) != 9:
        errors.append(f'`experiencia` deve conter 9 registros (achados {len(data)})')
    nums = set()
    for i, r in enumerate(data, start=1):
        base = f'experiencia[{i}]'
        n = r.get('numero')
        if not isinstance(n, int) or not (1 <= n <= 9):
            errors.append(f'{base}.numero inválido: {n}')
        else:
            nums.add(n)
        telas = r.get('telas')
        if not isinstance(telas, dict):
            errors.append(f'{base}.telas ausente ou não-objeto')
            continue
        if not isinstance(telas.get('tela1'), str):
            errors.append(f'{base}.telas.tela1 ausente ou não-string')
        t2 = telas.get('tela2')
        if not isinstance(t2, list) or not (2 <= len(t2) <= 3):
            errors.append(f'{base}.telas.tela2 deve ter 2–3 frases')
        if not isinstance(telas.get('tela3'), str):
            errors.append(f'{base}.telas.tela3 ausente ou não-string')
        # linha do tempo
        lt = r.get('linha_do_tempo')
        if not isinstance(lt, dict):
            errors.append(f'{base}.linha_do_tempo ausente ou não-objeto')
        else:
            for year in ['2025', '2026', '2027']:
                if year not in lt:
                    errors.append(f'{base}.linha_do_tempo faltando {year}')
        # cores
        cores = r.get('cores')
        if not isinstance(cores, dict):
            errors.append(f'{base}.cores ausente ou não-objeto')
        else:
            hx = cores.get('hex')
            if not isinstance(hx, list) or len(hx) != 2:
                errors.append(f'{base}.cores.hex deve ter 2 códigos')
            else:
                for x in hx:
                    if not isinstance(x, str) or not HEX_RE.match(x):
                        errors.append(f'{base}.cores.hex código inválido: {x}')

    if nums != set(range(1, 10)):
        errors.append(f'`experiencia` numeros devem ser 1..9; encontrados: {sorted(nums)}')


if __name__ == '__main__':
    banco = load(BANCO)
    exper = load(EXP)
    if banco is not None:
        check_banco(banco)
    if exper is not None:
        check_experiencia(exper)

    if errors:
        print('VALIDAÇÃO: FALHOU')
        for e in errors:
            print('-', e)
        sys.exit(2)
    else:
        print('VALIDAÇÃO: OK — todos os cheques passaram')
        sys.exit(0)
