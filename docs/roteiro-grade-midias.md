# Arthur The Cannibal: roteiro e grade de mídias (v1)

Entrega para o agente do template. Segue o formato pedido, nas 4 partes. Antes delas, os conflitos
declarados (nenhuma regra foi quebrada em silêncio).

## Conflitos declarados e decisões do cliente

1. **Regra 7 (rosto de pessoa real) na Sequência A.** O site é do próprio atleta. Decisão do cliente:
   a Sequência A usa a **foto real** dele (retrato de @m2l.cs) animada em **2.5D por profundidade**,
   sem IA redesenhando o rosto. Ela **não passa pelo Higgsfield**: é renderizada fora (pipeline
   `depth.py` + `render_shots.py`) e entregue pronta (MP4 7 s + 169 frames + pôster), já seguindo
   todas as outras regras deste briefing. A Sequência B é 100% gerada e respeita a regra 7
   (silhueta sem rosto reconhecível).
2. **Marcas na foto real.** Luvas Pretorian e short Venum: o short fica fora do enquadramento
   (corte acima do cós) e os logos das luvas são dessaturados e desfocados no retoque.
3. **Texto no protetor bucal ("CANNIBAL").** É a marca do próprio cliente e aparece pequeno.
   Mantido. Se colidir com o H1, desfocamos.
4. **Centro-direita versus mobile (Sequência A).** Com só 20% centrais visíveis no celular, o rosto
   não pode ir para 70% da largura. O rosto fica entre 50% e 56% da largura. Para manter a metade
   esquerda escura no desktop, a luz vem da direita e o lado esquerdo do corpo cai na sombra.
5. **Readout desligado** a pedido do cliente. As chaves foram mantidas no JSON só para não quebrar o
   schema: o componente deve ser ocultado.
6. **Número pendente.** A categoria (peso) ainda não foi informada pelo atleta e está como
   "A definir", listada no fim. Não publicar antes de trocar.

---

## Parte 1 — Conceito

- **Logline:** o site oficial de Arthur The Cannibal, lutador de MMA de Brasília que voltou da pausa
  mais perigoso.
- **Público:** patrocinadores, organizadores de eventos e fãs de luta do DF.
- **Tom:** intenso, direto, de guerreiro, com gratidão e fé como contraponto. Frases curtas, voz
  dele (citações dos próprios posts).
- **Paleta:**
  - `background`: `#0a0a0b`
  - `accent`: `#D72631` (vermelho sangue)
  - Dominantes dos vídeos: âmbar `#E8A33D` (início da A), vermelho `#B3121F` (fim da A e início
    da B), dourado claro `#F2D29B` (fim da B).
  - Arco de cor: a A vai do âmbar ao vermelho (entrar na luta); a B vai do vermelho ao dourado
    (a dor que lapida).
- **Assunto principal:** Arthur, lutador magro e atlético, cabelo escuro curto com degradê, torso
  nu, luvas de MMA pretas de dedos abertos. Na A é ele mesmo (foto real). Na B é a mesma figura
  em silhueta de contraluz, rosto sempre na sombra, luvas pretas lisas sem logo, short preto liso e
  um terço pequeno com crucifixo no peito (referência à fé dele). Sem tatuagens visíveis na B.
- **Origem do apelido:** gíria militar do tempo em que serviu ao Exército e virou codinome na Força
  Tática do QGEx. CANNIBAL é o cara muito aloprado e sanguíneo.

---

## Parte 2 — Grade de mídias

### Sequência A (Hero), foto real em 2.5D, produzida fora do Higgsfield

> **Substituída em 2026-11-10.** A versão abaixo (foto 4) foi reprovada. A Sequência A em uso é
> a foto 1 por camadas locais: ver `plan-sequencia-a.md`.

- `duracao_s`: 7 (169 frames a 24 fps, 1920x1080)
- **Movimento:** afastamento lento e contínuo da câmera (pull-back por profundidade) enquanto o
  atleta desliza um pouco para a direita e a luz de contorno troca de âmbar para vermelho.
- **Fonte:** IMG_3709 (crédito @m2l.cs), 1717x2576. Todo enquadramento é redução da original
  (sem ampliação). Laterais além da foto completadas com preto `#0a0a0b` e fumaça procedural, que
  se fundem na vinheta do site.
- `keyframe_inicial` (descrição de referência, não é prompt para gerar):
  > Medium close-up of the athlete from head to mid chest, looking straight into the camera,
  > face centered horizontally at 50% of the width and at 38% of the height, warm amber rim light
  > from the right, faint smoke, pure black surroundings, left side of his body falling into
  > shadow, lower left third dark and calm.
- `keyframe_final` (descrição de referência):
  > Same athlete, same photo, camera further back: framed from head to just above the waistband,
  > face at 56% of the width, both raised black gloves visible with logos removed, rim light now
  > deep blood red and dimmed, smoke settled, wide black space on the left half.
- `prompt_video` (referência para o render 2.5D, **não usar em gerador de vídeo**):
  > The camera slowly and steadily pulls back from a medium close-up of the athlete to a wider
  > framing from head to waist, while he drifts slightly to the right of center; depth parallax makes
  > the raised gloves move a little more than the face; the warm amber rim light gradually shifts to
  > deep blood red through the middle of the shot, faint smoke drifts slowly, and the light softly
  > dims at the end. single continuous shot, no cuts, no scene changes, slow steady camera, no
  > handheld shake, no text, consistent subject identity, cinematic lighting, 16:9
- `negativos`: deformação do rosto, borda da foto aparecendo, esticamento nas bordas de
  profundidade, logos legíveis, cós do short no quadro, fade para preto, tremor.

| progresso | segundos | o que se vê no quadro | onde está o assunto |
|---|---|---|---|
| 0,00–0,08 | 0,0–0,6 | Pôster: close médio, olhar direto, contorno âmbar, fumaça leve, terço inferior esquerdo escuro | centro (rosto em 50%) |
| 0,10–0,30 | 0,7–2,1 | Câmera começa a se afastar, as luvas entram no quadro, assunto desliza para a direita | centro, indo para centro-direita (rosto 50% a 53%) |
| 0,35–0,55 | 2,5–3,9 | Mudança visível: contorno passa de âmbar a vermelho sangue, fumaça ganha tom vermelho | centro-direita (rosto 54% a 55%) |
| 0,60–0,80 | 4,2–5,6 | Afastamento desacelera e assenta no enquadramento da cabeça à cintura | centro-direita (rosto 56%) |
| 0,80–1,00 | 5,6–7,0 | Luz baixa devagar até restar só o contorno vermelho; fundo quase preto | centro-direita (rosto 56%) |

`checagem_mobile`: o rosto fica entre 50% e 56% da largura do início ao fim, dentro ou na borda da
faixa central de 40% a 60%, então aparece no celular em todos os beats.

### Sequência B (Cinematic), foto real por camadas locais

Substitui a versão "gerada no Higgsfield" deste roteiro. Decisões e medidas em
`plan-sequencia-b.md`; o render é `media/seq-b/render.py`, sem IA generativa.

- `duracao_s`: 7 (169 frames a 24 fps)
- **Fonte:** foto 3 (`IMG_4843`, 1023x1537), o atleta de cabeça baixa no treino. O atleta sai da
  foto original; o fundo é o still estendido `media/stills/foto3-16x9-estendida.jpg`.
- **Movimento:** aproximação contínua com arco de câmera. A câmera anda para a esquerda e desce
  enquanto se aproxima: a parede gira em perspectiva e desliza atrás do atleta, que só cresce e se
  desloca (nenhum pixel dele muda). O arco se concentra no meio do scroll, junto com a virada da
  luz.
- **Detalhes, todos só no fundo:** feixe de luz com raios, névoa em duas camadas, três planos de
  poeira em profundidades diferentes, sombra suave do atleta na parede, fundo que perde foco
  conforme a câmera chega, vinheta.

| progresso | segundos | o que se vê no quadro | onde está o assunto |
|---|---|---|---|
| 0,00–0,22 | 0,0–1,5 | Plano aberto e frio: academia inteira, saco de pancadas à direita, poeira fina | direita (centro do corpo em 69% da largura) |
| 0,22–0,48 | 1,5–3,4 | A câmera começa o arco: a parede desliza para a esquerda e inclina, o atleta cresce | direita |
| 0,48–0,58 | 3,4–4,1 | Virada: a luz passa de fria para quente, o feixe acende, o fundo perde foco por um instante | direita |
| 0,58–0,80 | 4,1–5,6 | Fim do arco: feixe quente com raios cruzando a parede, névoa e poeira iluminadas | direita |
| 0,80–1,00 | 5,6–7,0 | Plano da cintura para cima, câmera assentando, fundo quente e desfocado | direita (centro do corpo em 73%) |

`checagem_mobile`: o atleta fica fora da faixa central; o corte do celular segue o ponto
`CINE_MOBILE_FOCUS_X` (`src/lib/cinematic.ts`), que mantém a cabeça (58% a 71% da largura) na
tela do início ao fim.

---

## Parte 3 — Textos do site

As citações são do próprio Arthur, tiradas dos posts dele no Instagram (uma com "Aonde" corrigido
para "Onde").

```json
{
  "meta": {
    "lang": "pt-BR",
    "title": "Arthur The Cannibal | Lutador de MMA de Brasília",
    "description": "Site oficial de Arthur The Cannibal, lutador de MMA de Brasília com base no Muay Thai. Trajetória, lutas e contato para patrocínio."
  },
  "brand": { "name": "Arthur The Cannibal" },
  "nav": { "links": ["Trajetória", "Patrocínio"], "cta": "Patrocine" },
  "hero": {
    "statusLabel": "Em preparação",
    "readout": { "label": "Desligado", "base": 0, "amplitude": 0, "decimals": 0, "unit": "" },
    "eyebrow": "MMA // MUAY THAI // BRASÍLIA DF",
    "title": { "line1": "Arthur", "highlight": "The Cannibal" },
    "lead": "Lutador de MMA de Brasília, com base no Muay Thai. Voltou da pausa mais agressivo, mais focado e com fome de vencer.",
    "statement": {
      "kicker": "A pausa acabou",
      "line1": "Voltei",
      "line2Prefix": "mais",
      "highlight": "perigoso",
      "caption": "A dor não me quebrou, me lapidou."
    },
    "bottomBar": { "center": "VAMOS // VENCER", "scrollHint": "Role" },
    "cards": [
      { "quote": "CANNIBAL é gíria militar para um cara aloprado e sanguíneo.", "speaker": "Arthur Henrique", "source": "Sobre o apelido" },
      { "quote": "Mais agressivo. Mais focado. Mais disposto.", "speaker": "Arthur Henrique", "source": "Instagram" },
      { "quote": "Não é só um retorno. É um aviso.", "speaker": "Arthur Henrique", "source": "Instagram" }
    ],
    "loader": { "eyebrow": "ARTHUR // CANNIBAL", "text": "Aquecendo o treino" }
  },
  "cinematic": {
    "statusLabel": "O retorno",
    "eyebrow": "CAPÍTULO 02 // RETORNO",
    "titleBefore": { "line1": "A dor não", "highlight": "quebrou" },
    "titleAfter": { "line1": "Ela me", "highlight": "lapidou" },
    "lead": "Teve pausa. Teve dor. E teve a escolha de voltar mais perigoso do que antes.",
    "bottomBar": { "left": "PAUSA // RETORNO", "center": "DOR // LAPIDAÇÃO", "scrollHint": "Continue" },
    "cards": [
      { "label": "01 — Pausa", "quote": "Onde muitos poderiam desistir, eu voltei.", "speaker": "Arthur Henrique", "source": "Instagram" },
      { "label": "02 — Combustível", "quote": "Transformou dúvida em ódio, fraqueza em combustível.", "speaker": "Arthur Henrique", "source": "Instagram" },
      { "label": "03 — Vencer", "quote": "Treine duro, construa sua imagem e faça seu nome ser conhecido. VAMOS VENCER.", "speaker": "Arthur Henrique", "source": "Instagram" }
    ],
    "outro": { "kicker": "Próximo round", "cta": "Ver números" },
    "loader": { "eyebrow": "CAPÍTULO // 02", "text": "Preparando o retorno" }
  },
  "systems": {
    "eyebrow": "CARTEL // NÚMEROS",
    "title": { "lead": "Por trás do", "highlight": "lutador" },
    "body": "Arthur Henrique treina Muay Thai há 7 anos. Hoje luta pela Equipe Kairós, com Railson Rodrigues no MMA e striking, e pela Brasília Luta Livre, com Washington Sena no grappling. O apelido nasceu no Exército, na Força Tática do QGEx.",
    "cta": "Seja patrocinador",
    "stats": [
      { "label": "Cartel", "value": "8-1", "note": "3 KO, 3 decisões, 2 finalizações" },
      { "label": "Muay Thai", "value": "7 anos", "note": "Treinando desde os 16 anos" },
      { "label": "Equipe", "value": "Kairós", "note": "Com Railson Rodrigues" },
      { "label": "Categoria", "value": "A definir", "note": "Peso em que compete" }
    ]
  },
  "footer": {
    "legal": "© 2026 Arthur The Cannibal. Fotos: @m2l.cs, @luigimoraess, Foguinho Clicks. Todos os direitos reservados.",
    "links": [
      { "name": "Instagram", "note": "Perfil oficial" },
      { "name": "Patrocínio", "note": "Seja parceiro" },
      { "name": "Contato", "note": "Imprensa e eventos" },
      { "name": "Move Nutrição", "note": "Cupom CANNIBAL" },
      { "name": "No Talk", "note": "Cupom CANNIBAL" },
      { "name": "Tarumã", "note": "Gama e Sudoeste" }
    ],
    "buildLine": "Brasília DF // Vamos vencer",
    "disclaimer": "Cupons sujeitos às regras de cada parceiro."
  }
}
```

### Pendências antes de publicar

| Campo | Valor atual | Depende de |
|---|---|---|
| `systems.stats[3]` Categoria | A definir | Peso em que ele luta (não respondido) |
| `systems.stats[0]` Cartel | 8-1 | Confirmar se as 9 lutas somam todas as modalidades |
| `footer.links` Instagram | sem URL | @ oficial dele |
| `footer.legal` créditos | 3 fotógrafos | Autorização de uso das fotos |

---

## Parte 4 — Autochecagem

- [x] Cada vídeo é uma tomada única, sem corte implícito? **Sim.** Nenhum "then", "cut to" ou
  "suddenly"; as mudanças são graduais (luz na A, fumaça e luz na B).
- [x] O movimento é lento e numa só direção? **Sim.** A: pull-back do início ao fim. B: dolly-in do
  início ao fim.
- [x] O primeiro frame da A deixa o terço inferior esquerdo livre? **Sim**, escurecido por
  luz lateral vinda da direita e gradiente.
- [x] A virada da B cai entre 0,48 e 0,58? **Sim.**
- [x] O assunto passa pelo centro horizontal nos beats? **Sim.** B sempre no centro; A com o rosto
  entre 50% e 56% (conflito 4 declarado).
- [ ] Não há pessoa real, marca de terceiros nem texto nos vídeos? **B: sim. A: não**, por decisão
  do cliente (conflito 1): é o próprio atleta, em foto real, sem IA no rosto. Marcas removidas
  (conflito 2). Texto do protetor mantido por ser a marca dele (conflito 3).
- [x] Todos os textos estão dentro dos limites? **Sim**, conferido por script.
- [x] O texto de cada card comenta o que o vídeo mostra na faixa? **Sim.** A: origem do apelido
  (assunto se revelando), agressividade (luz fica vermelha), aviso (enquadramento assenta). B: pausa (silhueta
  de cabeça baixa no vermelho), combustível (aproximação e tensão antes da virada), vencer (punho
  erguido na luz dourada).

---

## Fotos para seções futuras

| Foto | Uso sugerido |
|---|---|
| IMG_3709 retrato do protetor (@m2l.cs) | Sequência A |
| IMG_4230 close com sangue (@luigimoraess) | Seção futura "O retorno" em tela cheia |
| IMG_0554 vitória beijando a luva | Seção futura "Fé e família" |
| IMG_7798 Muay Thai no ringue (Foguinho Clicks) | Seção futura de trajetória |
| IMG_0438 guarda no cage | Cartel ou galeria |
| IMG_4843 cabeça baixa, saco "BROTHERS" | Descartar (1,6 MP e marca da equipe antiga) |
