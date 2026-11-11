# Handoff

Canal de recados entre o Claude (roteiro e Sequência A) e o agente do template (site e
Sequência B). Escreva no topo, com data, quem escreveu e o que precisa.

## Divisão de tarefas

| Item | Responsável | Status |
|---|---|---|
| Perfil de comunicação | Claude | Feito |
| Roteiro, grade de mídias e JSON de textos | Claude | Feito (falta a categoria do Arthur) |
| Sequência A (Hero): foto 1 (sangue, fumaça vermelha), animada por camadas locais, 7 s, 169 frames | Agente do template | **Feito, commit `f8f8c66` no branch `feat/seq-a-camadas`, PR #2 aberto, sem merge** (issue #1; ver `plan-sequencia-a.md`) |
| Sequência B (Cinematic): foto 3 (treino, cabeça baixa), animada por camadas locais, 7 s, 169 frames | Agente do template | **Feito: segunda versão aprovada pelo Pedro e validada no navegador; commit `67f9596` no branch `feat/seq-b-camadas`, sem push nem PR** (issue #3; ver `plan-sequencia-b.md`) |
| Remover o `readout` do Hero (desligado pelo cliente) | Agente do template | Feito |
| Aplicar o JSON de textos e a paleta (`#0a0a0b`, accent `#D72631`) | Agente do template | Feito |
| Trocar "A definir" pela categoria do Arthur | Agente do template | Feito: Peso Galo, 61 kg |

## Entrega da Sequência A

Pasta `media/seq-a/`: `render.py` e `make_mask.py` (geram os quadros a partir da foto 1),
`mask-atleta.png`, `seq-a.mp4` (7 s, 24 fps) e `poster.jpg` (quadro 56, o primeiro com a cena
toda acesa). Os frames do site ficam só em `public/frames/` (169 WebP, 1600 px, q60, 14,9 MB; eram q70 e 17,3 MB até a issue #5).
Não regerar no Higgsfield: é a foto real do atleta, sem IA no rosto.

## Recados

- **11/11/2026 (manhã, depois), agente do template — rodapé e aviso de scroll, commit `940072d`, enviado (ler primeiro)**:
  - Estado: branch `feat/redesenho-poster-fixo` igual ao remoto em `940072d`, working tree limpo.
    Issue #6 aberta, sem PR deste branch.
  - Saiu o item "Imprensa e eventos" do contato; o nome do rodapé subiu e "The Cannibal" ficou
    em vermelho (exceção à regra do vermelho, registrada no `AGENTS.md`). O nome do rodapé sai
    de `hero.title`, não mais de `brand.name`.
  - Aviso de scroll na tela em pé (`ui/ScrollCue.tsx`): mão arrastando para cima (Material
    Symbols `swipe-up`, Apache 2.0, colado como SVG) depois de 2,5 s parado; some ao rolar e não
    aparece na última meia tela. Fica na borda direita a 58% da altura: no canto de baixo cobria
    o botão do Hero. Uma seta dupla piscando foi tentada antes e recusada pelo Pedro.
  - Sem medição: celular real e toque, a animação da mão em movimento, movimento reduzido,
    Safari e Firefox, foco por teclado nos botões novos.
  - Aberto com o Pedro: a 1366 px os dois botões da chamada empilham (lado a lado pede tirar a
    seta dos botões com símbolo); nome do link "Mentalidade"; manter ou não o "Seja
    patrocinador" do Hero.
- **11/11/2026 (manhã), agente do template — botão do Instagram e símbolos das redes, commit `30d4aa2`, enviado**:
  - Na chamada (`#patrocinio`): "Chamar no Instagram" ao lado de "Chamar no WhatsApp", em placa
    escura (`tone="quiet"`), e o símbolo de cada rede antes do texto (`ui/BrandGlyph.tsx`).
- **11/11/2026 (madrugada, depois), agente do template — links, botão e freio da faixa, commit `9d5fea1`, enviado**:
  - O aviso do cartel e a marca nova foram commitados e enviados (`609fd79`).
  - Neste commit: o link "Trajetória" virou "Mentalidade" (`#mentalidade`); o botão ganhou
    ponta cortada, seta e varredura; a faixa de nomes freia com o mouse (`ui/HoverBrake.tsx`); o
    botão da chamada abre o WhatsApp ("Chamar no WhatsApp"); rodapé com Instagram, WhatsApp e
    endereços dos parceiros; "+11 mil seguidores" no rodapé e na chamada.
- **11/11/2026 (madrugada), agente do template — aviso sorteado no cartel e marca nova, commit `609fd79`, enviado**:
  - Os commits `6944c4b` e `fdc1883` já estão no remoto (o recado abaixo, que diz "sem push",
    ficou velho nesse ponto).
  - Neste commit: `ui/useHintCycle.ts` (novo, extraído do `HintMenu`), `HintMenu.tsx` e
    `RecordMarks.tsx`. O cartel ganhou o mesmo aviso do menu do rodapé (as marcas de um método
    sorteado acendem) e a marca deixou de ser quadrado: é um risco inclinado, a barra do "%".
    Uma presa foi tentada antes e recusada pelo Pedro; não voltar a ela.
- **11/11/2026 (fim da noite), agente do template — rodada do cartel, commitada, SEM PUSH (ler primeiro)**:
  - **Onde está**: branch `feat/redesenho-poster-fixo`. O redesenho está commitado em `fe93432`
    (no remoto) e `6944c4b` (só local). A rodada do cartel, a faixa de nomes e o aviso do menu do
    rodapé estão no commit seguinte, também só local. Push depende de pedido do Pedro.
  - **O que mudou**: o Cartel abre com o percentual de vitórias gigante (calculado dos `count`),
    Nocautes e Finalizações em destaque, Decisões e a derrota numa linha menor. Saíram
    `record.title` e `record.score`; entrou `record.rate` e `featured` em cada método. Guia de
    marca novo em `docs/brand-guidelines.md`. Detalhes na seção "Rodada do cartel" do PLAN.
  - **Frase do Hero**: o terceiro card virou "Sede de sangue. Fome de vitória.", frase do site,
    sem assinatura (`speaker`/`source` agora opcionais). PENDENTE: o Arthur aprovar ou trocar.
    Com isso "Agora somos três." saiu e o Hero ficou sem o contraponto da família; a Trajetória
    mantém "Movido pela família".
  - MEDIDO: lint, tsc, build, inspetor de design (0 FAIL) e o cartel em cinco tamanhos de tela.
  - **Faixa de nomes**: refeita em duas fileiras opostas, menor e mais lenta (seção "Rodada da
    faixa de nomes" do PLAN).
  - **Menu do rodapé**: o sorteio começa quando o menu entra na tela (primeiro link em ~0,3 s);
    o intervalo entre um e outro não mudou.
- **11/11/2026 (noite), agente do template — redesenho, fases 3 a 6 feitas, SEM COMMIT (ler primeiro)**:
  - **Onde está**: branch `feat/redesenho-poster-fixo`, a partir de `ebf1fa8`; todo o redesenho
    (issue #6) está na árvore de trabalho, nada em stage. Commit, push e PR dependem de pedido do
    Pedro.
  - **O que existe**: Cartel que toca (`FightRecord` + `ui/RecordMarks`), Equipe, faixa de nomes,
    chamada e rodapé novos; quatro fotos em `public/photos/`; entradas por CSS preso ao scroll.
    Saíram `SystemsNominal.tsx`, `EyebrowBadge.tsx`, `AnimatedSection.tsx`, `HudFrame.tsx`, a
    dependência `geist` e os campos `systems`, `footer.links` e `footer.buildLine`.
  - **Validado**: MEDIDO lint, tipos e build com saída 0; `inspect.mjs` da skill com 0 FAIL e os
    dois avisos esperados; seis tamanhos de tela no Chromium. Números, desvios e os três defeitos
    corrigidos (um deles no scroll suave, anterior ao redesenho) em
    `plan-redesenho-poster-fixo.md`, "Fases 3 a 6".
  - **Sem medição**: celular real, Safari e Firefox; a regressão dos 48 pontos contra o `ebf1fa8`
    não foi refeita depois da fase 2.
  - **Bloqueia publicar**: destino de "Seja patrocinador" e dos itens de contato e parceiros
    (hoje texto sem link); autor da IMG_0438 e da IMG_0554 e autorização dos fotógrafos; terceiros
    identificáveis na IMG_7798 e na IMG_0554; o Arthur confirmar os nomes da faixa e o que o 8–1
    cobre; `meta.siteUrl` ainda é `localhost`.
  - **Recomendações em aberto**: remover `framer-motion` e `@phosphor-icons/react` (sem uso);
    suíte E2E permanente.
  - **Ferramenta**: o build de produção fica em `npx next start -p 3102 -H 0.0.0.0`; rodar
    `next build` com ele no ar derruba as páginas, então pare o servidor antes. O Funnel do
    Tailscale não está habilitado na tailnet: o acesso de fora da rede é só pela tailnet.
- **11/11/2026 (tarde), agente do template — redesenho, fases 1 e 2 feitas, sem commit**:
  o Pedro viu o Hero e manteve o título em uma linha. A Trajetória foi refeita com os mesmos
  componentes (`PinnedTitle`, `SequenceQuote`): coluna à esquerda, títulos que trocam em 50% do
  scroll, link "Ver o cartel" no fim. Saíram `HudFrame.tsx`, `.card-surface`, `.hud-tick` e os
  campos `statusLabel`, `eyebrow`, `bottomBar`, `cards[].label` e `outro.kicker` do `cinematic`.
  MEDIDO: lint, tsc e build com saída 0; 48 pontos de frame e de frase iguais aos do `ebf1fa8`.
  Desvios do desenho em `plan-redesenho-poster-fixo.md`, "Fase 2". O bloco de números e o
  rodapé seguem no visual antigo; `TEMPLATE.md` está desatualizado até a fase 5.
- **11/11/2026 (tarde), agente do template — redesenho aprovado, fase 1 na parada do Pedro**:
  o Pedro aprovou o PLAN `plan-redesenho-poster-fixo.md` (issue #6), a retirada do bloco
  "Forjado no quartel" e a IMG_7798 larga. A parte B (#4) está em `ebf1fa8`; o trabalho segue no
  branch `feat/redesenho-poster-fixo`, **sem commit**. Fase 1 implementada: tokens e fonte
  (`globals.css`, `layout.tsx`), `Button`, `PinnedTitle`, `SequenceQuote`, Hero e Navbar novos.
  A Trajetória, o bloco de números e o rodapé continuam no visual antigo até as fases 2 a 4, e
  os links `#cartel`, `#equipe` e `#patrocinio` ainda não têm destino. MEDIDO: lint, tsc e build
  com saída 0; os 48 pontos de frame e de frase das duas sequências iguais aos do `ebf1fa8`.
  **Depende do Pedro**: ver as capturas do Hero e escolher o título em uma ou duas linhas
  (item 8 da tabela do PLAN); só então começa a fase 2.
- **11/11/2026 (tarde), agente do template — auditoria de design**: a pedido do Pedro, o site
  foi auditado com a skill `design-taste-frontend`. Resultado, nota e direção proposta em
  `auditoria-design.md`. Nenhum código foi alterado. **Depende do Pedro**: aprovar a direção,
  dizer se o redesenho vale para o template ou só para o site do Arthur e escolher a coisa
  viva; só depois disso entram PLAN, issue e implementação. A pasta `.taste-skill/` na raiz é
  arquivo de trabalho da skill, sem rastreio no git e fora do `.gitignore`.
- **11/11/2026 (manhã), agente do template — ESTADO ATUAL E PONTO DE RETOMADA (ler primeiro)**:
  - **Onde está**: branch `feat/componente-sequencia`, só local, a partir de `feat/seq-b-camadas`.
    Commits: `e432d67` (componente único, parte A, #4) e `2667d48` (frames do Hero em q60, #5).
    A parte B da fase 3 (#4) está no commit seguinte ao `2667d48`: `ScrollSequence.tsx`,
    `useFramePreload.ts`, `Hero.tsx`, `CinematicReveal.tsx`, `src/lib/hero.ts`,
    `src/lib/cinematic.ts` e `AGENTS.md`. Detalhe e medições em `plan-componente-sequencia.md`,
    "Fase 3, parte B".
  - **Validado**: MEDIDO lint, tipos e build sem erro; no Chromium headless, antes e depois
    iguais nas três larguras de referência, frame e corte conferidos pixel a pixel em 9 telas,
    resize sem rolar, carga adiada do Cinematic, movimento reduzido e frame com erro.
  - **Sem medição**: celular real, rede móvel e toque; roda do mouse; barra de endereço do
    celular; Safari e Firefox.
  - **Depende do Pedro**: conferir no celular; push, PR
    (`Closes #4`, `Closes #5`, e `Closes #3` se a B for junto) e merge do PR #2; decisão de
    layout do F1 (cards do Hero sobre o rosto) e do texto de apoio do Cinematic sobre o cabelo
    em tela em pé acima de 768 px.
  - **Ferramenta**: a verificação no navegador foi um script Playwright temporário
    (`playwright-core` do cache do `npx` com `/usr/bin/chromium`; o comando `playwright` da
    máquina falha no `mise`). Não está no repositório; a suíte E2E permanente é recomendação em
    aberto no PLAN.
  - O recado abaixo fica como histórico da Sequência B.

- **11/11/2026 (início do dia), agente do template — SEQUÊNCIA B COMMITADA (histórico)**:
  - **Onde está**: Sequência B commitada em `67f9596`, branch `feat/seq-b-camadas`, só local
    (sem push, sem PR). O branch parte de `feat/seq-a-camadas` (`f8f8c66`, PR #2 aberto, sem
    merge), então um PR da B contra `main` leva junto o commit da A enquanto o #2 não entrar.
    Árvore limpa depois do commit; servidor local parado.
  - RELATO (Pedro, 10/11): o movimento "atende perfeitamente"; o emblema "D" da luva fica sem
    desfoque; a foto 3 é de autoria do Arthur e não leva crédito.
  - **Ajuste de layout** (`CinematicReveal.tsx`): no navegador o título cobria ombro e cabeça
    do atleta. Título e texto foram para o alto à esquerda, os três cards para baixo à esquerda;
    no celular o texto de apoio (`cinematic.lead`) não aparece e os cards ficam na base. O botão
    do fim segue embaixo à direita, sobre o antebraço. Detalhes em `plan-sequencia-b.md`,
    "Navegador".
  - **Validado**: MEDIDO lint, tipos e build sem erro; VISTO a rolagem de 0,05 a 0,95 em
    2093x962, 1280x720 e 390x844 (o de 390 px num iframe).
  - **Sem medição**: rolagem de volta (de baixo para cima); celular real e rede móvel; larguras
    entre 768 e 1280 px; console durante a carga da página; verificação por pixel só em 5 dos
    169 quadros.
  - **Depende do Pedro**: push do branch; PR com `Closes #3` (decidir se espera o merge do #2);
    merge do PR #2; ver o ajuste do título num celular de verdade.
  - **Fora do escopo, registrado**: `Hero.tsx` e `CinematicReveal.tsx` seguem duplicando a
    lógica de canvas (dívida do `AGENTS.md`); autorizações de uso das fotos sem registro
    (bloqueia publicar, não o trabalho local).
  - Os dois recados abaixo ficam como histórico; as pendências deles estão resolvidas.

- **10/11/2026 (fim da noite), agente do template — SEQUÊNCIA B, SEGUNDA VERSÃO (histórico)**:
  - **O que mudou**: a câmera agora faz um arco enquanto se aproxima (a parede gira em
    perspectiva e desliza para a esquerda atrás do atleta) e o fundo ganhou feixe de luz com
    raios, névoa, três planos de poeira, sombra do atleta e foco que muda. O atleta continua só
    escalado e deslocado. Decisões e números em `plan-sequencia-b.md`, seção "Resultado".
  - **Feito**: `media/seq-b/seq-b.mp4` e `poster.jpg` novos; `public/frames2/` com os 169 WebP
    novos (6,8 MB); lint, tipos e build sem erro; vídeo antigo e stills das fotos 2, 4 e 5
    removidos; `media/README.md`, `roteiro-grade-midias.md` e `AGENTS.md` atualizados.
    `render.py` perdeu a opção `--grade` e ganhou `--step=N` para prévia.
  - **Falta**: o Pedro ver a prévia e aprovar; rolar a seção no navegador (tela larga e 390 px)
    e reposicionar título e cards se cobrirem o atleta; autorização de commit. Nada foi
    commitado.
  - **Em aberto com o Pedro**: emblema dourado "D" da luva direita sem desfoque; nome do
    fotógrafo da foto 3 (a seção segue sem crédito).
  - O recado abaixo fica como histórico do pedido; o "estado do código" dele está superado.

- **10/11/2026 (noite), agente do template — PONTO DE RETOMADA DA SEQUÊNCIA B (histórico)**:
  - **Pedido do Pedro, nas palavras dele**: *"Não gostei do resultado, esperava uma animação
    mais detalhada, vamos tentar adicionar mais detalhes e uma transição nesse zoom mexendo no
    ângulo da câmera"*. A primeira versão (só zoom do atleta 1,00 a 1,50, fundo 1,00 a 1,16,
    poeira, luz fria virando quente) foi reprovada. As duas prévias que ele viu eram a de luz só
    no fundo e a de luz no quadro inteiro; ele não escolheu entre elas.
  - **O que fazer**: propor ao Pedro, em poucas linhas e antes de renderizar tudo, como entra a
    mudança de ângulo (por exemplo: giro/arco da câmera com as camadas deslocando em sentidos
    diferentes, leve inclinação de perspectiva no fundo, mais planos de profundidade: parede,
    saco, atleta, poeira na frente) e quais detalhes novos entram (feixe de luz com poeira,
    névoa, sombra do atleta acompanhando a luz, foco que muda). Mandar um MP4 curto de teste
    pelo celular (`SendUserFile`) e só então fechar. É mudança das decisões do PLAN: registrar
    em `plan-sequencia-b.md`.
  - **Restrição que continua**: nenhum pixel do atleta muda de conteúdo (só escala e posição);
    sem IA generativa em pessoa. Girar o atleta em perspectiva deforma a pessoa: tratar como
    decisão do Pedro, não fazer por conta. Deslocamento lateral revela fundo atrás do atleta,
    que encosta no saco: a área revelada precisa de preenchimento conferido a olho.
  - **Estado do código (tudo sem commit, branch `feat/seq-b-camadas`)**: `media/layered.py`
    (motor comum, extraído da A; MEDIDO: a A continua com 0 pixel diferente),
    `media/seq-b/make_mask.py`, `media/seq-b/mask-atleta.png`, `media/seq-b/render.py`
    (`--grade=background|full`, `--verify`). MEDIDO na versão reprovada: 0 pixel do atleta
    diferente da foto nos quadros 1, 43, 85, 127 e 169, fora das caixas dos logos; 5.045 px de
    fundo preenchido visíveis no último quadro. Nada foi gravado em `public/frames2/`, que
    segue com os frames antigos; `media/seq-b/` ainda não tem MP4 nem pôster.
  - **Site**: `CINE_MOBILE_FOCUS_X = 0.68` em `src/lib/cinematic.ts` e o corte do celular sem
    zoom de 1,3 em `CinematicReveal.tsx` já estão aplicados, **sem lint, build nem navegador
    rodados**. O valor 0,68 é INFERIDO da posição do atleta na versão reprovada: reposicionar.
    `.gitignore` ganhou `__pycache__/`.
  - **Pendente do PLAN**: etapas 6 a 9 (aprovação do movimento, extração dos WebP, remoção de
    `media/video/seq-b-trajetoria.mp4` e dos stills das fotos 2, 4 e 5, validação do site,
    documentos e `AGENTS.md`). O cabeçalho do PLAN precisa do status real.
  - **Em aberto com o Pedro**: o emblema dourado "D" da luva direita não foi desfocado (as
    caixas cobrem só os textos); nome do fotógrafo da foto 3.
  - **Ambiente**: o Python com numpy, OpenCV e rembg está em
    `/tmp/claude-1000/-home-belloti-Projects-iron-man/4adf3f5a-d5df-46b1-878b-aaf37b95a648/scratchpad/venv`
    (usar `venv/bin/python -I`); se a pasta sumir, remontar com `uv`. Comando do render:
    `python -I media/seq-b/render.py ~/Downloads/IMG_4843.PNG media/stills/foto3-16x9-estendida.jpg <saida> --verify`.
    Os demais cuidados (uso do `gh` com `-R`, fotos autorizadas, commit só com autorização)
    estão no recado seguinte e continuam valendo.

- **10/11/2026, agente do template — PONTO DE RETOMADA (ler primeiro numa sessão nova)**:
  - **Sequência A**: commit `f8f8c66` enviado, PR #2 aberto contra `main`
    (https://github.com/PedroBelloti/iron-man-scroll-template/pull/2, `Closes #1`). Merge e
    fechamento da issue dependem de pedido do Pedro.
  - **Sequência B**: `docs/plan-sequencia-b.md` foi enviado ao Pedro e **ainda não foi
    aprovado**. Ele recebeu também um esboço do enquadramento. Não implementar antes do sim.
    Depois da aprovação: criar a issue no GitHub, registrar o `#N` no PLAN e aqui, e seguir as
    etapas até o primeiro ponto de parada (máscara e base).
  - **Decisões da B em aberto com o Pedro** (detalhe no PLAN): enquadramento aberto com zoom do
    atleta até 1,5; parede esquerda suavizada ou quadro começando em x 1124; luz só no fundo ou
    no quadro inteiro (duas prévias); extração do motor comum de `media/seq-a/render.py`;
    remoção do vídeo antigo e dos stills das fotos 2, 4 e 5; nome do fotógrafo da foto 3.
  - **Estado do repositório**: branch `feat/seq-a-camadas`; sem commit ficam
    `docs/plan-sequencia-b.md` e as edições de hoje neste arquivo e em `plan-sequencia-a.md`.
  - **Cuidados de ferramenta**: o `gh` neste repositório resolve para o template original
    (`KingOfSites/iron-man`); usar sempre `-R PedroBelloti/iron-man-scroll-template`. O ambiente
    Python (numpy, OpenCV, rembg) e os scripts de medição da B ficavam na pasta temporária da
    sessão anterior e não estão no repositório: remontar com `uv` como na etapa 2 do
    `plan-sequencia-a.md`. As medidas necessárias (posição da foto dentro do still, caixas dos
    logos) estão no PLAN da B.
  - **Leitura de fotos autorizada pelo Pedro**: só `~/Downloads/IMG_4230.PNG` (foto 1) e
    `~/Downloads/IMG_4843.PNG` (foto 3), para este trabalho.
  - **O Pedro pode estar no celular**: mandar PLAN, máscaras e prévias como arquivo, não só o
    caminho.

- **10/11/2026, agente do template — Sequência A refeita (issue #1)**:
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
