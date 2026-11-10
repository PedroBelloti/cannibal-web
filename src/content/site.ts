/**
 * Todo o texto do site. Cada valor entre colchetes é um indicador do que deve ser escrito ali;
 * o guia completo, com limites e o exemplo original, está em TEMPLATE.md.
 * Os campos `show`/`hide` estão sincronizados com os frames atuais — só mude se trocar o vídeo.
 */

export type Link = { label: string; href: string };

/** Card que aparece entre `show` e `hide` (fração 0–1 do scroll da seção). */
export type TimedCard = {
  id: string;
  show: number;
  hide: number;
  label?: string;
  quote: string;
  speaker: string;
  source: string;
};

export type Headline = { line1: string; highlight: string };

export type SiteContent = {
  meta: { lang: string; title: string; description: string; siteUrl: string };
  brand: { name: string };
  nav: { links: Link[]; cta: Link };
  hero: {
    statusLabel: string;
    readout: { label: string; base: number; amplitude: number; decimals: number; unit: string };
    eyebrow: string;
    title: Headline;
    lead: string;
    statement: { kicker: string; line1: string; line2Prefix: string; highlight: string; caption: string };
    bottomBar: { center: string; scrollHint: string };
    cards: TimedCard[];
    loader: { eyebrow: string; text: string };
  };
  cinematic: {
    statusLabel: string;
    eyebrow: string;
    titleBefore: Headline;
    titleAfter: Headline;
    lead: string;
    bottomBar: { left: string; center: string; scrollHint: string };
    cards: TimedCard[];
    outro: { kicker: string; cta: Link };
    loader: { eyebrow: string; text: string };
  };
  systems: {
    eyebrow: string;
    title: { lead: string; highlight: string };
    body: string;
    cta: Link;
    stats: { label: string; value: string; note: string }[];
  };
  footer: {
    legal: string;
    links: { name: string; note: string; href: string }[];
    buildLine: string;
    disclaimer: string;
  };
};

export const site: SiteContent = {
  meta: {
    lang: "pt-BR",
    title: "[Marca] — [Produto ou slogan curto]",
    description: "[Descrição para buscadores: 1 frase de 120–160 caracteres dizendo o que é e convidando a rolar]",
    siteUrl: "http://localhost:3000",
  },

  brand: {
    name: "[Marca / Submarca]",
  },

  nav: {
    links: [
      { label: "[Link 1: 1 palavra]", href: "#systems" },
      { label: "[Link 2: 1 palavra]", href: "#footer" },
    ],
    cta: { label: "[Ação: 1 verbo]", href: "#systems" },
  },

  hero: {
    statusLabel: "[Status ao vivo: 2–3 palavras]",
    readout: { label: "[Medidor: 1–2 palavras]", base: 87.3, amplitude: 6.7, decimals: 1, unit: "%" },
    eyebrow: "[CÓDIGO // MARCA // ESTADO]",
    title: {
      line1: "[Frase de impacto]",
      highlight: "[Destaque.]",
    },
    lead: "[Subtítulo: 1–2 frases, até 140 caracteres, apresenta o produto e pede para rolar]",
    statement: {
      kicker: "[Rótulo: 2–3 palavras]",
      line1: "[Chamada]",
      line2Prefix: "[conector]",
      highlight: "[Marca]",
      caption: "[Proposta de valor em 1 linha, até 60 caracteres]",
    },
    bottomBar: {
      center: "[SISTEMA // MODO]",
      scrollHint: "[Role]",
    },
    cards: [
      {
        id: "hero-1",
        show: 0.1,
        hide: 0.3,
        quote: "[Citação 1 (início do vídeo): até 60 caracteres]",
        speaker: "[Autor]",
        source: "[ORIGEM — ANO]",
      },
      {
        id: "hero-2",
        show: 0.35,
        hide: 0.55,
        quote: "[Citação 2 (meio do vídeo): até 60 caracteres]",
        speaker: "[Autor]",
        source: "[ORIGEM — ANO]",
      },
      {
        id: "hero-3",
        show: 0.6,
        hide: 0.8,
        quote: "[Citação 3 (fim do vídeo): até 60 caracteres]",
        speaker: "[Autor]",
        source: "[ORIGEM — ANO]",
      },
    ],
    loader: {
      eyebrow: "[MENSAGEM DE CARGA // ESTADO]",
      text: "[Carregando o quê]",
    },
  },

  cinematic: {
    statusLabel: "[Rótulo da seção: 2–3 palavras]",
    eyebrow: "[CENA // MOMENTO]",
    titleBefore: {
      line1: "[Frase de abertura]",
      highlight: "[Destaque antes.]",
    },
    titleAfter: {
      line1: "[Frase de virada]",
      highlight: "[Destaque depois.]",
    },
    lead: "[Contexto da cena: 1–2 frases, até 120 caracteres]",
    bottomBar: {
      left: "[CÓDIGO // ARQUIVO]",
      center: "[SISTEMA // MODO]",
      scrollHint: "[Role]",
    },
    cards: [
      {
        id: "cine-1",
        show: 0.1,
        hide: 0.3,
        label: "01 — [Beat 1: 1 palavra]",
        quote: "[Fala do beat 1 (cena inicial): até 60 caracteres]",
        speaker: "[Autor]",
        source: "[ORIGEM — ANO]",
      },
      {
        id: "cine-2",
        show: 0.35,
        hide: 0.55,
        label: "02 — [Beat 2: 1 palavra]",
        quote: "[Fala do beat 2 (aproximação): até 60 caracteres]",
        speaker: "[Autor]",
        source: "[ORIGEM — ANO]",
      },
      {
        id: "cine-3",
        show: 0.6,
        hide: 0.8,
        label: "03 — [Beat 3: 1 palavra]",
        quote: "[Fala do beat 3 (desfecho): até 80 caracteres]",
        speaker: "[Autor]",
        source: "[ORIGEM — ANO]",
      },
    ],
    outro: {
      kicker: "[Próximo passo: 2 palavras]",
      cta: { label: "[Botão: 2 palavras]", href: "#systems" },
    },
    loader: {
      eyebrow: "[MENSAGEM DE CARGA // ESTADO]",
      text: "[Carregando o quê]",
    },
  },

  systems: {
    eyebrow: "[MARCA // TÍTULO DA SEÇÃO]",
    title: {
      lead: "[Frase principal]",
      highlight: "[Destaque.]",
    },
    body: "[Texto da seção: 2–3 frases, 200–280 caracteres, explica a história ou o produto e apresenta os números ao lado]",
    cta: { label: "[Botão: 2–3 palavras]", href: "#footer" },
    stats: [
      { label: "[Métrica 1]", value: "[00,0%]", note: "[Explicação curta da métrica 1]" },
      { label: "[Métrica 2]", value: "[0,0 un]", note: "[Explicação curta da métrica 2]" },
      { label: "[Métrica 3]", value: "[00 un]", note: "[Explicação curta da métrica 3]" },
      { label: "[Métrica 4]", value: "[0,00 s]", note: "[Explicação curta da métrica 4]" },
    ],
  },

  footer: {
    legal: "[© Empresa — endereço ou cidade. Linha legal / marca registrada]",
    links: [
      { name: "[Item 1]", note: "[Detalhe 1]", href: "#" },
      { name: "[Item 2]", note: "[Detalhe 2]", href: "#" },
      { name: "[Item 3]", note: "[Detalhe 3]", href: "#" },
      { name: "[Item 4]", note: "[Detalhe 4]", href: "#" },
      { name: "[Item 5]", note: "[Detalhe 5]", href: "#" },
      { name: "[Item 6]", note: "[Detalhe 6]", href: "#" },
    ],
    buildLine: "[Versão · Produto · Status]",
    disclaimer: "[Aviso legal ou de uso: 1 linha]",
  },
};
