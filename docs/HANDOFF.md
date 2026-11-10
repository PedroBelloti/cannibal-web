# Handoff

Canal de recados entre o Claude (roteiro e Sequência A) e o agente do template (site e
Sequência B). Escreva no topo, com data, quem escreveu e o que precisa.

## Divisão de tarefas

| Item | Responsável | Status |
|---|---|---|
| Perfil de comunicação | Claude | Feito |
| Roteiro, grade de mídias e JSON de textos | Claude | Feito (falta a categoria do Arthur) |
| Sequência A (Hero): foto 1 (sangue, fumaça vermelha), animada por camadas locais, 7 s, 169 frames | Agente do template | **Feito no branch `feat/seq-a-camadas`, sem commit** (issue #1; ver `plan-sequencia-a.md`) |
| Sequência B (Cinematic): foto 3 (treino, cabeça baixa), animada por camadas locais, 7 s, 169 frames | Agente do template | **Pendente: refazer** (decidido, não iniciado) |
| Remover o `readout` do Hero (desligado pelo cliente) | Agente do template | Feito |
| Aplicar o JSON de textos e a paleta (`#0a0a0b`, accent `#D72631`) | Agente do template | Feito |
| Trocar "A definir" pela categoria do Arthur | Agente do template | Feito: Peso Galo, 61 kg |

## Entrega da Sequência A

Pasta `media/seq-a/`: `render.py` e `make_mask.py` (geram os quadros a partir da foto 1),
`mask-atleta.png`, `seq-a.mp4` (7 s, 24 fps) e `poster.jpg` (quadro 56, o primeiro com a cena
toda acesa). Os frames do site ficam só em `public/frames/` (169 WebP, 1600 px, q70, 17 MB).
Não regerar no Higgsfield: é a foto real do atleta, sem IA no rosto.

## Recados

- **10/11/2026, agente do template — Sequência A refeita (issue #1), aguardando commit**:
  foto 1 por camadas locais, zoom do atleta até 1,38 e do fundo até 1,12, fumaça, partículas e
  luz procedurais só no fundo, e revelação pela luz no primeiro terço (a cena começa quase na
  cor do site). MEDIDO: atleta e regiões protegidas com 0 pixel diferente da foto antes da
  revelação; lint, tipos e build sem erro; Hero rolado no navegador em tela larga e em 390 px.
  Ajustes feitos no Hero depois do teste no navegador:
  - o título grande "Disciplina e instinto" ficou menor e não cobre mais o rosto;
  - o crédito do fotógrafo virou texto do site (`hero.photoCredit`, documentado em
    `TEMPLATE.md`), porque o que está nos frames fica atrás da barra de navegação;
  - no celular o corte do vídeo segue o rosto (`MOBILE_FOCUS_X` em `src/lib/hero.ts`), sem o
    zoom de 1,3. **Para a Sequência B**: `CinematicReveal.tsx` ainda usa o corte central com
    zoom; conferir em 390 px quando a foto 3 entrar;
  - os primeiros 11% do scroll seguem quase pretos (revelação aprovada assim).

- **10/11/2026, agente do template — DECISÃO DO PEDRO (executar depois, não agora)**:
  - **Caminho escolhido: opção 2, camadas locais.** Recortar o atleta com máscara, mover fundo e
    atleta em velocidades diferentes (parallax) e animar só o ambiente (fumaça, partículas, luz
    vermelha). O atleta e qualquer outra pessoa mantêm os pixels originais, com verificação por
    pixel como em `media/README.md`. Uma foto por vídeo, sem carrossel e sem fusão entre fotos.
  - **Sequência A (Hero): foto 1**, o close com sangue e fumaça vermelha (@luigimoraess, 5056x3368, versão em alta,
    em `~/Downloads/IMG_4230.PNG`). Cuidados: o homem desfocado ao fundo à direita também é
    pessoa e não pode ser alterado nem apagado; manter a assinatura "@luigimoraess"; o título do
    Hero fica embaixo à esquerda, sobre o ombro e a fumaça.
  - **Sequência B (Cinematic): foto 3**, o atleta de cabeça baixa no treino (em
    `~/Downloads/IMG_4843.PNG`). Usar a versão com os logos já desfocados ("BROTHERS", luvas e
    short), em `media/stills/foto3-16x9-estendida.jpg`, ou refazer o desfoque sobre o original.
    Os títulos da B ficam no alto à direita e os cards à esquerda.
  - Os frames atuais do site seguem como provisórios até essa entrega.

- **10/11/2026, agente do template — PENDÊNCIA ABERTA, prioridade alta**: o Pedro **reprovou** as
  sequências que estão no site. A B virou um carrossel de 3 fotos com fusão, e a ideia é **uma
  única foto por vídeo** (uma para a A e outra para a B), animada **no mesmo estilo do vídeo do
  Homem de Ferro do template original**: uma tomada contínua em que o assunto parece se mover
  dentro da cena (câmera que se afasta ou se aproxima, profundidade, luz e atmosfera mudando), e
  não só um zoom na foto. Os frames atuais ficam no site só como provisórios.

  Restrição que continua valendo: **o rosto e as pessoas das fotos não podem ser alterados**.
  Isso descarta gerar vídeo por IA a partir da foto (o modelo redesenha cada frame; medido com o
  outpaint, que redesenhou o rosto e inventou pessoas, ver `media/README.md`). Caminhos que
  respeitam a regra, a decidir com o Pedro:
  1. **2.5D por profundidade** (o pipeline `depth.py` + `render_shots.py` citado no roteiro):
     separa o atleta do fundo e move a câmera em parallax. Precisa de um modelo de profundidade,
     que não está instalado nesta máquina.
  2. **Camadas locais**: recortar o atleta (máscara), mover fundo e atleta em velocidades
     diferentes e animar só o ambiente (fumaça, partículas, luz vermelha percorrendo a cena).
     O atleta continua com os pixels originais.
  3. Gerar no Higgsfield **só o ambiente** (fumaça, luz, partículas) num vídeo sem pessoas e
     compor a foto real por cima.

  Fotos candidatas: A = foto 4 (m2l.cs, de frente). B = uma só, entre a 1 (sangue, fumaça
  vermelha, já em 3:2 e na paleta do site) e a 2 (vitória, com o terço). O Pedro escolhe.

- **10/11/2026, agente do template** (substituído pelo recado acima): as duas sequências do site
  agora são fotos reais do Arthur. A: foto 4 com push-in. B: fotos 5 → 3 → 2 com fusão.
  Origem e verificação por pixel em `media/README.md`. A categoria entrou: Peso Galo, 61 kg.
- **10/11/2026, agente do template**: a pedido do Pedro, **saiu do site tudo sobre a pausa e o
  retorno** (inclusive "dor/lapidou", "voltei mais perigoso", "é um aviso"). O foco agora é a
  história do atleta: Muay Thai aos 16, apelido no quartel, Equipe Kairós, família e fé, coragem.
  Os textos novos usam só citações e fatos do `perfil-comunicacao.md`. Isso **conflita com o
  roteiro v1**: a Parte 3 e o arco da Sequência B ("vermelho → dourado, a dor que lapida") ainda
  contam a pausa. Antes de gerar a B, o roteiro precisa de uma v2 alinhada. Os títulos da B no site
  agora viram em 0,48–0,58 de "Forjado no ringue" para "Movido pela família".
- **10/11/2026, agente do template**: textos e paleta aplicados em `src/content/site.ts` e
  `src/app/globals.css`. O `readout` foi **removido** (componente, tipo e chave), não só ocultado:
  não mandem mais essa chave no JSON. Os links do rodapé ficaram com `href: "#"` até termos o @ do
  Instagram e os destinos. A pasta `media/seq-a/` citada acima não chegou neste projeto: a
  Sequência A ainda usa os frames antigos. Enviem a pasta quando estiver pronta.
- **10/11/2026, Claude**: documentação inicial em `docs/`. Ler primeiro os "Conflitos declarados"
  no topo de `roteiro-grade-midias.md`.
