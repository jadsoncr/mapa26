import React from "react";

export default function Mapa2026() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-[420px] px-6 py-16 space-y-20">

        {/* 1️⃣ HEADER — ABERTURA RITUAL */}
          <header className="text-center" style={{marginBottom:28}}>
          <h1 className="font-cormorant text-4xl tracking-tight">Mapa 2026</h1>
            <p className="font-inter text-base" style={{color:'var(--muted-1)',marginTop:10}}>Um convite para atravessar o ano com mais consciência.</p>
        </header>

        {/* 2️⃣ NÚCLEO DO ANO */}
        <section className="space-y-6">
          <p className="uppercase tracking-widest text-xs text-neutral-500">Seu Ano Pessoal é</p>

          <div className="space-y-4" style={{marginTop:8,marginBottom:16}}>
            <p className="text-xs uppercase" style={{color:'var(--muted-1)',letterSpacing:2}}>Seu Ano Pessoal é</p>
            <h2 className="font-cormorant" style={{fontSize:96,lineHeight:0.9,color:'var(--premium-contrast)',margin:0}}>{numero}</h2>
            <p className="font-inter" style={{color:'var(--muted-2)',marginTop:8}}>{meaning}</p>
          </div>
        </section>

        {/* 3️⃣ SIGNIFICADO */}
        <section className="space-y-4">
          <h2 className="font-cormorant text-2xl">O significado deste ano</h2>
          <p className="font-inter text-base leading-relaxed text-neutral-300">
            2026 não é sobre acelerar. É sobre ajustar. Refinar relações, perceber o clima emocional ao redor
            e agir com mais consciência do impacto das suas escolhas.
          </p>
        </section>

        {/* 4️⃣ FRASE-ORÁCULO */}
        <section className="rounded-2xl bg-neutral-900 px-6 py-10 text-center">
          <p className="font-cormorant text-2xl">“Escolher com calma também é uma forma de coragem.”</p>
        </section>

        {/* 5️⃣ CORES DO ANO */}
        <section className="space-y-6">
          <h2 className="font-cormorant text-2xl">As cores do seu ano</h2>

          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-[#F4A261]" />
            <div className="h-16 w-16 rounded-full bg-[#E9A0B8]" />
          </div>

          <p className="font-inter text-base text-neutral-400 leading-relaxed">
            O laranja sustenta o movimento com vitalidade. O rosa suaviza, protege e convida à empatia.
            Juntas, essas cores lembram que avançar não exige dureza.
          </p>
        </section>

        {/* 6️⃣ CTA FINAL — DISCRETO */}
        <footer className="pt-10">
          <button
            className={
              `w-full rounded-full border border-neutral-700 py-4 font-inter text-sm text-neutral-200 transition hover:bg-neutral-800`
            }
          >
            Salvar Mapa como Imagem
          </button>
        </footer>

      </div>
    </main>
  );
}
