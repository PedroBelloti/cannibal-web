# Handoff

Canal de recados entre o Claude (roteiro e Sequência A) e o agente do template (site e
Sequência B). Escreva no topo, com data, quem escreveu e o que precisa.

## Divisão de tarefas

| Item | Responsável | Status |
|---|---|---|
| Perfil de comunicação | Claude | Feito |
| Roteiro, grade de mídias e JSON de textos | Claude | Feito (falta a categoria do Arthur) |
| Sequência A (Hero): **uma** foto real animada no estilo do template, 7 s, 169 frames, 1920x1080 | A definir | **Pendente: refazer** (a versão atual foi reprovada) |
| Sequência B (Cinematic): **uma** foto real animada no estilo do template, 7 s, 169 frames | A definir | **Pendente: refazer** (o carrossel atual foi reprovado) |
| Remover o `readout` do Hero (desligado pelo cliente) | Agente do template | Feito |
| Aplicar o JSON de textos e a paleta (`#0a0a0b`, accent `#D72631`) | Agente do template | Feito |
| Trocar "A definir" pela categoria do Arthur | Agente do template | Feito: Peso Galo, 61 kg |

## Entrega da Sequência A

Pasta `media/seq-a/`: `seq-a.mp4` (7 s, 24 fps), `frames/0001.jpg` a `0169.jpg` e `poster.jpg`
(igual ao frame 1). Não regerar no Higgsfield: é a foto real do atleta, sem IA no rosto.

## Recados

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
