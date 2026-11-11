# Identidade do Arthur The Cannibal

Guia da marca usada no site. Fonte dos fatos: `docs/perfil-comunicacao.md`. Direção de design e
decisões de página: `docs/plan-redesenho-poster-fixo.md`. Os valores de cor e de tipo moram em
`src/app/globals.css`; este guia diz como usá-los e não repete o arquivo em outro formato.

## Resumo

| Item | Valor |
|---|---|
| Nome | Arthur The Cannibal, sempre por extenso (outro lutador usa o mesmo apelido) |
| Posição | Lutador de MMA de Brasília que vence a maioria das lutas e resolve mais da metade antes do fim |
| Prova principal | 89% de vitórias: 8 em 9 lutas |
| Prova de apoio | 5 das 8 vitórias antes do fim da luta: 3 nocautes e 2 finalizações |
| Cores | Preto `#0a0a0b`, tinta `#f4f4f5`, vermelho `#d72631` |
| Tipo | Schibsted Grotesk, peso 800 nos títulos e números |
| Bordão | "Vamos vencer." |

## Posicionamento e mensagens

**Proposta de valor.** Marca ao lado de quem vence: 8 vitórias em 9 lutas, 5 delas antes do fim.

| Mensagem | Prova (fonte: perfil) | Onde aparece |
|---|---|---|
| Ele vence | 89% de vitórias em 9 lutas, cartel 8–1 | Cartel, número gigante |
| Ele resolve a luta | 3 nocautes e 2 finalizações em 8 vitórias | Cartel, linha de destaque |
| Ele tem base e equipe | Muay Thai desde os 16, Equipe Kairós, Brasília Luta Livre | Equipe |
| Ele tem história própria | apelido do quartel, família | Hero e Trajetória |

Por público:

| Público | O que precisa ler primeiro | Chamada |
|---|---|---|
| Patrocinador | 89% de vitórias e quem já está com ele | "Seja patrocinador" |
| Organizador de evento | 8–1, 5 vitórias antes do fim, peso galo | contato |
| Fã | o apelido, as frases, as fotos de luta | Instagram |

O percentual é aproveitamento, não promessa. A página diz "89% de vitórias"; não diz "invicto",
"imbatível", "garantia de vitória" nem projeta resultado futuro.

## Cores

| Papel | Token | Hex | RGB | Uso |
|---|---|---|---|---|
| Fundo | `--bg` | `#0a0a0b` | 10, 10, 11 | toda a página; igual ao fundo dos frames |
| Superfície | `--surface` | `#18181b` | 24, 24, 27 | blocos sobre o fundo |
| Tinta | `--ink` | `#f4f4f5` | 244, 244, 245 | texto, números, marcas do cartel |
| Apoio | `--muted` | `#a1a1aa` | 161, 161, 170 | notas e itens fora de foco |
| Destaque | `--accent` | `#d72631` | 215, 38, 49 | só o que leva a algum lugar ou responde ao toque |

Proporção: preto domina, tinta carrega o conteúdo, vermelho é exceção. Vermelho em tudo deixa de
dizer "toque aqui".

Contraste (MEDIDO em 2026-11-11, fórmula WCAG 2.x sobre os hex):

| Par | Razão | Serve para |
|---|---|---|
| tinta sobre fundo | 18,0 | qualquer texto |
| apoio sobre fundo | 7,7 | qualquer texto |
| tinta sobre vermelho | 4,5 | texto do botão |
| vermelho sobre fundo | 4,0 | só texto grande (24 px ou mais) e formas; nunca texto corrido |

## Tipografia

Uma família: Schibsted Grotesk (`--font-schibsted`, carregada em `src/app/layout.tsx`).

| Papel | Classe | Peso | Uso |
|---|---|---|---|
| Número ou nome gigante | tamanho próprio da seção ou `text-display` | 800 | 89%, placares, nome no rodapé |
| Título | `text-head` | 800 | título de seção, até 2 linhas |
| Destaque | `text-lead` | 600 | rótulo de número, frase de apoio |
| Corpo | `text-body` | 400 | texto corrido, na tinta |
| Nota | `text-small` | 400 | crédito de foto, aviso |

Números grandes usam altura de linha 0,8 e espaçamento de -0,05 a -0,06 em. Título em caixa normal;
caixa alta só no que já é assim na origem ("VAMOS VENCER.", "CANNIBAL").

## Nome e marca

Não existe logotipo desenhado. A marca é o nome composto em Schibsted Grotesk 800.

- Escreva "Arthur The Cannibal". Nunca só "Cannibal" como nome nem "The Cannibal" sozinho em
  título de página ou busca.
- Não invente símbolo, escudo ou monograma sem pedido do Arthur.
- PENDENTE (Arthur): se quiser logotipo, é trabalho à parte.

## Voz

| Traço | É | Não é |
|---|---|---|
| Intensa | frase curta, verbo no começo | grito, ponto de exclamação em série |
| Direta | número e fato | adjetivo sem prova |
| Grata | cita equipe, família, parceiros | discurso institucional |
| Confiante | "Vamos vencer." | provocação a adversário, promessa de resultado |

Por contexto:

| Onde | Tom | Exemplo |
|---|---|---|
| Número | seco | "89% de vitórias" |
| Chamada a patrocinador | convite direto | "Sua marca ao lado de um lutador de Brasília com 8 vitórias em 9 lutas." |
| Trajetória | fala dele, entre aspas, com origem | "Fome de vencer: algo que não se ensina." |

Frase entre aspas e com o nome dele só quando ele disse e o perfil registra. Frase criada para o
site ("Sede de sangue. Fome de vitória.") sai sem aspas e sem assinatura.

Fora da página: conquista sem fonte no perfil; a derrota além de "1 derrota"; a pausa na carreira;
equipe antiga como atual; "Jungle Fight" como evento disputado; modalidade do cartel enquanto não
for confirmada (o rótulo é só "Cartel").

## Imagem

- Foto real de luta ou treino, fundo escuro que se funde ao preto da página.
- Só recorte e redução. Nenhum rosto ou pessoa é alterado, e nada de imagem gerada de pessoa.
- Crédito do fotógrafo em texto solto no alto à direita; sem autor confirmado, sem crédito.
- Sem filtro de cor, sem moldura, sem texto queimado na foto.
- Origem e comando de recorte de cada arquivo: `media/README.md`.

## Sem medição

- Reconhecimento da marca e leitura das mensagens por patrocinador ou organizador real.
- Contraste do vermelho sobre foto (link final da Trajetória): só os pares sobre cor chapada
  foram calculados.
