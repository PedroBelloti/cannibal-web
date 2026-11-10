/**
 * Todo o texto do site. Fonte: docs/roteiro-grade-midias.md (Parte 3); limites por campo em
 * TEMPLATE.md. Fatos sobre o atleta só entram com fonte em docs/perfil-comunicacao.md.
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
    eyebrow: string;
    title: Headline;
    lead: string;
    statement: { kicker: string; line1: string; line2Prefix: string; highlight: string; caption: string };
    bottomBar: { center: string; scrollHint: string };
    photoCredit: string;
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
    title: "Arthur The Cannibal | Lutador de MMA de Brasília",
    description:
      "Site oficial de Arthur The Cannibal, lutador de MMA de Brasília com base no Muay Thai. Trajetória, lutas e contato para patrocínio.",
    siteUrl: "http://localhost:3000",
  },

  brand: {
    name: "Arthur The Cannibal",
  },

  nav: {
    links: [
      { label: "Trajetória", href: "#systems" },
      { label: "Patrocínio", href: "#footer" },
    ],
    cta: { label: "Patrocine", href: "#footer" },
  },

  hero: {
    statusLabel: "Fome de vencer",
    eyebrow: "MMA // MUAY THAI // BRASÍLIA DF",
    title: {
      line1: "Arthur",
      highlight: "The Cannibal",
    },
    lead: "Lutador de MMA de Brasília, com base no Muay Thai desde os 16 anos. Disciplina de quartel, fé na família e fome de vencer.",
    statement: {
      kicker: "Forjado no quartel",
      line1: "Disciplina",
      line2Prefix: "e",
      highlight: "instinto",
      caption: "Disciplina de quartel com instinto agressivo de luta.",
    },
    bottomBar: {
      center: "VAMOS // VENCER",
      scrollHint: "Role",
    },
    photoCredit: "Foto: @luigimoraess",
    cards: [
      {
        id: "hero-1",
        show: 0.1,
        hide: 0.3,
        quote: "CANNIBAL é gíria militar para um cara aloprado e sanguíneo.",
        speaker: "Arthur Henrique",
        source: "Sobre o apelido",
      },
      {
        id: "hero-2",
        show: 0.35,
        hide: 0.55,
        quote: "Fome de vencer: algo que não se ensina.",
        speaker: "Arthur Henrique",
        source: "Instagram",
      },
      {
        id: "hero-3",
        show: 0.6,
        hide: 0.8,
        quote: "Agora somos três.",
        speaker: "Arthur Henrique",
        source: "Instagram",
      },
    ],
    loader: {
      eyebrow: "ARTHUR // CANNIBAL",
      text: "Aquecendo o treino",
    },
  },

  cinematic: {
    statusLabel: "A trajetória",
    eyebrow: "CAPÍTULO 02 // TRAJETÓRIA",
    titleBefore: {
      line1: "Forjado no",
      highlight: "ringue",
    },
    titleAfter: {
      line1: "Movido pela",
      highlight: "família",
    },
    lead: "Muay Thai aos 16 anos, o apelido no quartel, a Equipe Kairós: uma trajetória de disciplina e gratidão.",
    bottomBar: {
      left: "MUAY THAI // QUARTEL",
      center: "DISCIPLINA // FAMÍLIA",
      scrollHint: "Continue",
    },
    cards: [
      {
        id: "cine-1",
        show: 0.1,
        hide: 0.3,
        label: "01 — Disciplina",
        quote: "Treine duro, construa sua imagem e faça seu nome ser conhecido.",
        speaker: "Arthur Henrique",
        source: "Instagram",
      },
      {
        id: "cine-2",
        show: 0.35,
        hide: 0.55,
        label: "02 — Coragem",
        quote: "Quem prefere a zona de conforto jamais mudará sua realidade.",
        speaker: "Arthur Henrique",
        source: "Instagram",
      },
      {
        id: "cine-3",
        show: 0.6,
        hide: 0.8,
        label: "03 — Vencer",
        quote: "VAMOS VENCER.",
        speaker: "Arthur Henrique",
        source: "Instagram",
      },
    ],
    outro: {
      kicker: "Próximo round",
      cta: { label: "Ver números", href: "#systems" },
    },
    loader: {
      eyebrow: "CAPÍTULO // 02",
      text: "Contando a trajetória",
    },
  },

  systems: {
    eyebrow: "CARTEL // NÚMEROS",
    title: {
      lead: "Por trás do",
      highlight: "lutador",
    },
    body: "Arthur Henrique treina Muay Thai há 7 anos. Hoje luta pela Equipe Kairós, com Railson Rodrigues no MMA e striking, e pela Brasília Luta Livre, com Washington Sena no grappling. O apelido nasceu no Exército, na Força Tática do QGEx.",
    cta: { label: "Seja patrocinador", href: "#footer" },
    stats: [
      { label: "Cartel", value: "8-1", note: "3 KO, 3 decisões, 2 finalizações" },
      { label: "Muay Thai", value: "7 anos", note: "Treinando desde os 16 anos" },
      { label: "Equipe", value: "Kairós", note: "Com Railson Rodrigues" },
      { label: "Categoria", value: "61 kg", note: "Peso Galo" },
    ],
  },

  footer: {
    legal: "© 2026 Arthur The Cannibal. Fotos: @m2l.cs, @luigimoraess, Foguinho Clicks. Todos os direitos reservados.",
    links: [
      // PENDENTE: URL do Instagram oficial e destinos dos demais links (docs/roteiro-grade-midias.md).
      { name: "Instagram", note: "Perfil oficial", href: "#" },
      { name: "Patrocínio", note: "Seja parceiro", href: "#" },
      { name: "Contato", note: "Imprensa e eventos", href: "#" },
      { name: "Move Nutrição", note: "Cupom CANNIBAL", href: "#" },
      { name: "No Talk", note: "Cupom CANNIBAL", href: "#" },
      { name: "Tarumã", note: "Gama e Sudoeste", href: "#" },
    ],
    buildLine: "Brasília DF // Vamos vencer",
    disclaimer: "Cupons sujeitos às regras de cada parceiro.",
  },
};
