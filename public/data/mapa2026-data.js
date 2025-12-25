window.MAPA2026_DATA = (function(){
  const targetYear = 2026;
  const base = {
    1: { keyword: "Autoconfiança" },
    2: { keyword: "Conciliação" },
    3: { keyword: "Expressividade" },
    4: { keyword: "Fundação" },
    5: { keyword: "Movimento" },
    6: { keyword: "Cuidado" },
    7: { keyword: "Interior" },
    8: { keyword: "Expansão" },
    9: { keyword: "Conclusão" }
  };

  const numbers = Object.keys(base).reduce((acc, k) => {
    const num = Number(k);
    const kw = base[k].keyword;
    acc[k] = {
      keyword: String(kw).toUpperCase(),
      impact: `Número regente do ano: ${num}. Eixos ativados: • relações • acordos • ritmo emocional. A leitura completa mostra como esses eixos se distribuem ao longo do ano.`,
      timelineText: `Número regente do ano: ${num}. Eixos ativados: • relações • acordos • ritmo emocional. A leitura completa mostra como esses eixos se distribuem ao longo do ano.`
    };
    return acc;
  }, {});

  return { targetYear: targetYear, numbers: numbers };
})();
