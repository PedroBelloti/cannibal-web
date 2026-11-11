/**
 * Todo o texto do site. Fonte: docs/roteiro-grade-midias.md (Parte 3); limites por campo em
 * TEMPLATE.md. Fatos sobre o atleta só entram com fonte em docs/perfil-comunicacao.md.
 * Os campos `show`/`hide` estão sincronizados com os frames atuais — só mude se trocar o vídeo.
 */

export type Link = { label: string; href: string };

/**
 * Card que aparece entre `show` e `hide` (fração 0–1 do scroll da seção). `speaker` e `source` só
 * entram em fala dele com fonte no perfil; sem os dois a frase é do site e sai sem aspas.
 */
export type TimedCard = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker?: string;
  source?: string;
};

/** Título preso em dois cantos da sequência: `top` em cima, `bottom` embaixo. */
export type Headline = { top: string; bottom: string };

/**
 * Foto de `public/photos/` (origem e recorte em `media/README.md`). `credit` fica `null` enquanto
 * o autor não for confirmado; nesse caso a página não mostra crédito para ela.
 */
export type Photo = { src: string; alt: string; credit: string | null };

/**
 * Método de vitória do cartel: `count` marcas e a frase mostrada quando ele é escolhido.
 * `featured` põe o método na linha de destaque, com o número grande.
 */
export type RecordMethod = {
  id: string;
  label: string;
  count: number;
  result: string;
  featured: boolean;
};

/** Bloco do rodapé. Item sem `href` aparece como texto, não como link. */
export type FooterGroup = {
  title: string;
  items: { name: string; note?: string; href?: string }[];
};

export type SiteContent = {
  meta: { lang: string; title: string; description: string; siteUrl: string };
  brand: { name: string };
  nav: { label: string; links: Link[]; cta: Link };
  hero: {
    title: Headline;
    lead: string;
    cta: Link;
    photoCredit: string;
    cards: TimedCard[];
    loader: { text: string };
  };
  cinematic: {
    titleBefore: Headline;
    titleAfter: Headline;
    lead: string;
    cards: TimedCard[];
    /** Link final: `lead` na cor do texto e `highlight`, a palavra do destino, na cor de destaque. */
    outro: { lead: string; highlight: string; href: string };
    loader: { text: string };
  };
  record: {
    /**
     * Texto ao lado do percentual de vitórias; os dois formam o título da seção. O percentual não
     * é digitado: sai da soma dos `count` dos métodos e de `loss.count`.
     */
    rate: { label: string; note: string };
    /** Diz os números sem depender do toque; é o que aparece com nenhum método escolhido. */
    legend: string;
    filterLabel: string;
    methods: RecordMethod[];
    loss: { label: string; count: number };
    photo: Photo;
  };
  team: { title: string; body: string; photo: Photo };
  names: { label: string; items: string[]; caption: string };
  /** `cta` abre o WhatsApp e `instagram`, o perfil; cada botão leva o símbolo da rede. */
  sponsorCall: { title: string; body: string; cta: Link; instagram: Link; photo: Photo };
  footer: {
    menu: { label: string; links: Link[] };
    contact: FooterGroup;
    partners: FooterGroup;
    photo: Photo;
    legal: string;
    disclaimer: string;
  };
};

// Número informado para contato de patrocínio; o mesmo no botão da chamada e no rodapé.
const WHATSAPP_URL = "https://wa.me/5561986394253";

const INSTAGRAM_URL = "https://www.instagram.com/arthurcannibal";

export const site: SiteContent = {
  meta: {
    lang: "pt-BR",
    title: "Arthur The Cannibal | Lutador de MMA de Brasília",
    description:
      "Site oficial de Arthur The Cannibal, lutador de MMA de Brasília com base no Muay Thai. Trajetória, lutas e contato para patrocínio.",
    siteUrl: "https://cannibal-web.vercel.app",
  },

  brand: {
    name: "Arthur The Cannibal",
  },

  nav: {
    label: "Seções do site",
    links: [
      { label: "Mentalidade", href: "#mentalidade" },
      { label: "Cartel", href: "#cartel" },
      { label: "Equipe", href: "#equipe" },
    ],
    cta: { label: "Seja patrocinador", href: "#patrocinio" },
  },

  hero: {
    title: {
      top: "Arthur",
      bottom: "The Cannibal",
    },
    lead: "Lutador de MMA de Brasília, com base no Muay Thai desde os 16 anos. Disciplina de quartel, fé na família e fome de vencer.",
    cta: { label: "Seja patrocinador", href: "#patrocinio" },
    photoCredit: "Foto: @luigimoraess",
    cards: [
      {
        id: "hero-1",
        show: 0.1,
        hide: 0.3,
        quote: "CANNIBAL é gíria militar para um cara aloprado e sanguíneo.",
        speaker: "Arthur Henrique",
        source: "sobre o apelido",
      },
      {
        id: "hero-2",
        show: 0.35,
        hide: 0.55,
        quote: "Fome de vencer: algo que não se ensina.",
        speaker: "Arthur Henrique",
        source: "no Instagram",
      },
      {
        id: "hero-3",
        show: 0.6,
        hide: 0.8,
        // Frase do site, não fala dele: fica sem autor até o Arthur dizer ou aprovar.
        quote: "Sede de sangue. Fome de vitória.",
      },
    ],
    loader: {
      text: "Aquecendo o treino",
    },
  },

  cinematic: {
    titleBefore: {
      top: "Forjado",
      bottom: "no ringue",
    },
    titleAfter: {
      top: "Movido",
      bottom: "pela família",
    },
    lead: "Muay Thai aos 16 anos, o apelido no quartel, a Equipe Kairós: uma trajetória de disciplina e gratidão.",
    cards: [
      {
        id: "cine-1",
        show: 0.1,
        hide: 0.3,
        quote: "Treine duro, construa sua imagem e faça seu nome ser conhecido.",
        speaker: "Arthur Henrique",
        source: "no Instagram",
      },
      {
        id: "cine-2",
        show: 0.35,
        hide: 0.55,
        quote: "Quem prefere a zona de conforto jamais mudará sua realidade.",
        speaker: "Arthur Henrique",
        source: "no Instagram",
      },
      {
        id: "cine-3",
        show: 0.6,
        hide: 0.8,
        quote: "VAMOS VENCER.",
        speaker: "Arthur Henrique",
        source: "no Instagram",
      },
    ],
    outro: { lead: "Ver o", highlight: "cartel", href: "#cartel" },
    loader: {
      text: "Contando a trajetória",
    },
  },

  record: {
    rate: { label: "de vitórias", note: "em 9 lutas" },
    legend: "5 das 8 vitórias vieram antes do fim da luta.",
    filterLabel: "Vitórias por método",
    methods: [
      {
        id: "ko",
        label: "Nocautes",
        count: 3,
        result: "3 das 8 vitórias vieram por nocaute.",
        featured: true,
      },
      {
        id: "submission",
        label: "Finalizações",
        count: 2,
        result: "2 das 8 vitórias vieram por finalização.",
        featured: true,
      },
      {
        id: "decision",
        label: "Decisões",
        count: 3,
        result: "3 das 8 vitórias vieram por decisão.",
        featured: false,
      },
    ],
    loss: { label: "Derrota", count: 1 },
    photo: {
      src: "/photos/guarda-cage.webp",
      alt: "Arthur em guarda dentro do cage, de luvas pretas e bermuda azul.",
      // PENDENTE: autor da foto, a confirmar com o Arthur (docs/plan-redesenho-poster-fixo.md, item 5).
      credit: null,
    },
  },

  team: {
    title: "Sete anos de Muay Thai",
    body: "Arthur Henrique treina Muay Thai há 7 anos. Hoje luta pela Equipe Kairós, com Railson Rodrigues no MMA e striking, e pela Brasília Luta Livre, com Washington Sena no grappling. O apelido nasceu no Exército, na Força Tática do QGEx. Luta no peso galo, até 61 kg.",
    photo: {
      src: "/photos/muay-thai-kairos.webp",
      alt: "Arthur, de calção branco com KAIRÓS escrito, troca golpes com o adversário num ringue de Muay Thai, com o público ao fundo.",
      credit: "Foto: Foguinho Clicks",
    },
  },

  names: {
    label: "Equipes, eventos e parceiros",
    items: [
      "Equipe Kairós",
      "Brasília Luta Livre",
      "Samurai Fight 7",
      "Move Nutrição",
      "No Talk",
      "Tarumã",
    ],
    caption: "Onde ele treina, onde venceu e quem já está com ele.",
  },

  sponsorCall: {
    title: "Vamos vencer.",
    body: "Sua marca ao lado de um lutador de Brasília com 8 vitórias em 9 lutas e mais de 11 mil seguidores.",
    // Os botões da barra e do Hero trazem até aqui; este é o que abre a conversa.
    cta: { label: "Chamar no WhatsApp", href: WHATSAPP_URL },
    instagram: { label: "Chamar no Instagram", href: INSTAGRAM_URL },
    photo: {
      src: "/photos/vitoria.webp",
      alt: "Arthur beija a luva, com o outro braço erguido pelo árbitro, depois de uma vitória no cage.",
      // PENDENTE: autor da foto, a confirmar com o Arthur (docs/plan-redesenho-poster-fixo.md, item 5).
      credit: null,
    },
  },

  footer: {
    menu: {
      label: "Mapa do site",
      links: [
        { label: "Mentalidade", href: "#mentalidade" },
        { label: "Cartel", href: "#cartel" },
        { label: "Equipe", href: "#equipe" },
        { label: "Patrocínio", href: "#patrocinio" },
      ],
    },
    contact: {
      title: "Contato",
      items: [
        {
          name: "Instagram",
          note: "+11 mil seguidores",
          href: INSTAGRAM_URL,
        },
        { name: "WhatsApp", note: "+55 (61) 98639-4253", href: WHATSAPP_URL },
      ],
    },
    partners: {
      title: "Parceiros",
      items: [
        {
          name: "Move Nutrição",
          note: "Cupom CANNIBAL",
          href: "https://www.instagram.com/movenutricaoesportiva",
        },
        { name: "No Talk", note: "Cupom CANNIBAL", href: "https://notalk.com.br/" },
        {
          name: "Tarumã",
          note: "Gama e Sudoeste",
          href: "https://www.instagram.com/tarumacozinhaebar",
        },
      ],
    },
    photo: {
      src: "/photos/protetor.webp",
      alt: "Rosto de Arthur de queixo erguido, mostrando o protetor bucal com CANNIBAL escrito.",
      credit: "Foto: @m2l.cs",
    },
    legal:
      "© 2026 Arthur The Cannibal. Fotos: @m2l.cs, @luigimoraess, Foguinho Clicks. Todos os direitos reservados.",
    disclaimer: "Cupons sujeitos às regras de cada parceiro.",
  },
};
