# Identidade visual: Clara Montenegro, Advogada

Estudo curto feito antes do código. Tudo aqui é fictício: a advogada, o número da OAB, o endereço e o telefone.

## Nome e posicionamento

**Clara Montenegro, Advogada** (OAB/MT 00.000, número fictício). Advocacia autônoma em Cuiabá, direito de família e direito do consumidor.

Frase de posicionamento: **"O seu caso explicado em português claro, por quem vai cuidar dele pessoalmente."**

A ideia é a de uma advogada que atende sozinha, sem recepção e sem equipe: a pessoa fala direto com ela. Por isso o site evita a cara de "escritório" (mármore, balança, martelo, madeira escura) e vai para o universo da mesa de trabalho de uma pessoa que lê e anota: papel, caneta de tinta azul e um marca-texto amarelo.

## Paleta

| Papel | Nome | Hex | Uso |
|---|---|---|---|
| Fundo | Papel | `#F6F4EF` | fundo de toda a página, um branco quebrado neutro (não é creme amarelado) |
| Fundo 2 | Papel escuro | `#ECE9E1` | blocos de apoio, calendário, campos de formulário |
| Texto | Grafite | `#1E2228` | todo o texto corrido e os títulos |
| Primária | Tinta azul | `#27456B` | botões, links, ícones, a linha da "caneta"; é a cor da marca |
| Destaque | Marca-texto | `#F2DC6B` | a única cor quente: um trecho grifado por tela, como marca-texto em um contrato |
| Apoio | Linha | `#CFCBC1` | bordas, divisórias, estados desativados |
| Sinal | Verde confirmado | `#2F6B4F` | confirmação de ação (agenda marcada, resultado da triagem) |

Regras de uso:

- O marca-texto aparece **uma vez por tela**, sempre atrás de texto (como um grifo real), nunca como fundo de botão ou caixa.
- A tinta azul é a cor de ação: tudo que é clicável é azul; nada decorativo é azul.
- Nenhum gradiente colorido. O único degradê é o do fundo, de Papel para Papel escuro (duas cores da própria paleta), descrito na seção da leva final. Os cartões flutuam com um anel translúcido e uma sombra longa a 10%, sempre em cinza neutro, nunca em cor.
- Contraste: Grafite sobre Papel 14,5:1; Tinta azul sobre Papel 8,9:1; Grafite sobre Marca-texto 11,6:1; Papel sobre Tinta azul 8,9:1; Papel sobre Verde 5,7:1; texto desativado (#5F646C) sobre Papel escuro 4,9:1. Tudo acima de AA.

## Tipografia

Duas famílias, ambas com licença SIL OFL 1.1, servidas da pasta `fonts/` (arquivos woff2 latinos, licenças ao lado):

- **Newsreader** (variável, eixos peso e tamanho óptico): títulos e citações. É uma serifa de leitura, desenhada para texto de jornal, com cara de coisa escrita e lida, não de luxo. Peso 500 nos títulos, 400 nas citações. Nunca em caixa alta.
- **Public Sans** (variável): corpo, formulários, botões, legendas. É a fonte do serviço público dos Estados Unidos, feita para ser clara e sóbria. Peso 400 no corpo, 600 em botões e rótulos.

Escala (base 16px, razão aproximada 1,25, com `clamp` para o celular):

| Papel | Tamanho | Família e peso | Entrelinha |
|---|---|---|---|
| Título do hero | 40 a 64px | Newsreader 500 | 1,05 |
| Título de seção | 30 a 40px | Newsreader 500 | 1,15 |
| Subtítulo | 22 a 26px | Newsreader 500 | 1,25 |
| Corpo | 17px | Public Sans 400 | 1,6 |
| Corpo pequeno | 15px | Public Sans 400 | 1,5 |
| Legenda e rótulo | 13px | Public Sans 600 | 1,4 |

Regra de peso: um peso por família por tela além do regular. Nada de negrito dentro de parágrafo para "destacar": quando algo precisa chamar atenção, recebe o grifo de marca-texto.

## Layout

- Grade de 12 colunas, largura máxima de 1120px, calha de 24px. No celular, uma coluna com margem lateral de 20px (16px em 320px).
- Alinhamento à esquerda em tudo. Nada centralizado, nem o hero: o texto começa onde o olho começa a ler.
- Ritmo de espaçamento em múltiplos de 8px; as seções respiram 96px no computador e 64px no celular.
- Cada seção começa com uma frase que diz o que ela é e o que fazer, antes de qualquer botão.
- Sem cartões iguais em fileira: as áreas de atuação são duas colunas de texto separadas por uma linha vertical, como duas colunas de um jornal.

## Imagem forte

O hero é uma **foto gerada por IA (Canva)**, ilustrativa: uma mesa de trabalho vista de cima, em tom de papel, com folhas pautadas cheias de anotações (desfocadas de propósito, para não haver texto falso legível), uma caneta-tinteiro azul-marinho com a tampa ao lado, óculos de armação escura, um marca-texto amarelo e um caderno preto no canto. Tinta azul, papel e marca-texto são exatamente os três materiais da identidade, e a mensagem continua a mesma: aqui alguém lê o seu caso de verdade, linha por linha. Não há pessoas.

O contêiner tem proporção fixa de 4:3, borda de 1 px na cor Linha e cantos de 4 px, como os campos e botões do site. Enquanto a foto carrega, ele mostra a cor média dela.

O grifo amarelo do título continua sendo o acento oficial da tela e o único movimento da abertura; o marca-texto da foto apenas ecoa essa cor. Na leva final entraram mais sete fotos, todas geradas por IA no Canva e ilustrativas, listadas no README: as duas áreas ganharam fotos quadradas no lugar dos ícones em SVG, e as seções de consulta, prazos, artigos e Quem atende ganharam uma foto cada.

### Foto do hero

- **Arquivo**: `img/hero.webp`, 1440 x 1080 px, proporção 4:3.
- **Origem**: gerada por IA no Canva. O README e este estudo avisam que é ilustrativa.
- **Prompt resumido**: "Mesa de trabalho vista de cima, superfície em tom de papel marfim. Folhas pautadas com anotações manuscritas desfocadas, uma caneta-tinteiro azul-marinho com detalhes dourados sobre elas, a tampa da caneta ao lado, óculos de armação escura, um marca-texto amarelo e um caderno de capa preta no canto. Luz natural suave de janela, sombras longas e macias. Estilo editorial de site premium, sem texto legível, sem pessoas, proporção 4:3."
- **Texto alternativo**: descreve a mesa, as folhas, a caneta, os óculos, o marca-texto e o caderno.
- **Texto do hero**: fica ao lado da foto no computador e abaixo dela no celular, nunca por cima. O contraste do texto é o da página (Grafite sobre Papel) e não depende da foto.

## Movimento

- Um único momento orquestrado na abertura: o grifo de marca-texto no hero "passa" da esquerda para a direita em 700ms, 400ms depois de a página carregar, como alguém marcando um trecho. Só isso.
- Respostas a ações do visitante: resultado da triagem e confirmação da agenda surgem com um fade de 200ms; o foco de teclado ganha contorno de 3px em tinta azul.
- Com `prefers-reduced-motion: reduce`, o grifo já aparece pronto e os fades somem.

## Design systems aplicados (leva final)

A paleta e as fontes não mudaram. O que mudou foi a superfície, a navegação, os botões, os cartões, as faixas, o rodapé, o fundo e o movimento, seguindo dois sistemas do catálogo da Mil e Uma Linhas!:

- **Dupla:** `hanzo-design-system` (claro, consultoria premium e freelancer com reserva de agenda) e `fluxora-design-system` (escuro, vidro com borda em degradê a 225 graus).
- **Mistura:** toda a página clara usa os padrões do hanzo com as cores da identidade: Papel no lugar do branco, Papel escuro no lugar do cinza do degradê, Tinta azul no lugar do laranja (links, plus do acordeão, botão) e o Marca-texto segue sendo o único amarelo, uma vez por tela. O bloco Quem atende (`#sobre`) e o rodapé viram faixas em Tinta azul e recebem os padrões do fluxora: cartões de vidro branco a 5% com borda em degradê a 225 graus, selo de passo flutuante e rodapé em cartão de vidro com grade de 64px a 3% ao fundo. Nenhum gradiente decorativo colorido.

Componentes aplicados:

| Padrão | De | Onde |
|---|---|---|
| Cartão Papel com anel translúcido de 8px e sombra longa | hanzo | `.resultado` (triagem, agenda, prazos), `.marca`, `.menu`, `.hero-aba`, `.cartao` das áreas e as molduras de todas as fotos |
| Olho (eyebrow) em serifa itálica entre réguas que desvanecem | hanzo | `.hero-chamada` no hero e `.resultado-rotulo` nos resultados (`.olho`) |
| Heading 2 com segundo tom a 50% | hanzo | `h2` de Áreas, Triagem, Consulta, Prazos e Artigos (`.h2-tom`) |
| Botão principal com sombra interna e seta a 50%, anel de 8px no hero | hanzo | `.botao` em todo o site; `.botao-anel` no hero |
| Aba de disponibilidade com ponto verde | hanzo | `.hero-aba` acima do olho do hero ("Atendimento de segunda a sexta, 9h às 18h") |
| Pílula flutuante da marca + botão redondo de menu que abre um cartão | hanzo | `.topo`, `.marca`, `.menu-botao` (48px, barras viram X) e `.menu` (cartão Papel no celular) |
| Acordeão com plus que gira 45 graus e corpo que desliza em 250ms | hanzo | `details.artigo` em Artigos |
| Cartões levemente rotacionados com numeral em Newsreader 300 | hanzo | `.colunas .coluna` em Áreas (01 e 02, rotação de 0,6 grau) |
| Fundo: degradê a 225 graus, cinco raios de luz a 4% e grão fractal fixo a 4% | hanzo | `body` (CSS e SVG inline, sem imagem externa) |
| Lead com revelação de palavras ao rolar (0,2 para 1) | hanzo | primeiro parágrafo de Quem atende (`.sobre-lead`) |
| Vidro com borda em degradê a 225 graus | fluxora | `.vidro` nas duas colunas de `#sobre`, nos passos e no rodapé; `.resultado-ok` da agenda |
| Selo de passo flutuante no canto do cartão | fluxora | `ol.passos li` em Quem atende (01, 02, 03 a -16px do topo) |
| Rodapé em cartão de vidro com quatro colunas e grade de 64px a 3% | fluxora | `.rodape` e `.rodape-linha` |
| fadeSlideIn em escada na abertura + revelação ao rolar | fluxora | hero (`.hero-anim`, 80ms entre itens depois do grifo) e `.secao .miolo` (`.revela`, 500ms ao cruzar 12% da tela) |

Movimento: o grifo continua sendo o primeiro gesto (400ms de espera, 700ms de passagem). Depois dele, aba, olho, apoio, botões e foto sobem 12px com fade em escada de 80ms. Ao rolar, cada `.miolo` de seção revela em 500ms, e as palavras do lead de Quem atende acendem de 20% para 100% conforme a seção sobe na tela. Com `prefers-reduced-motion: reduce` nada disso acontece: tudo aparece pronto, os cartões ficam sem rotação e o plus do acordeão não gira.

Contraste nas novas superfícies: Papel sobre Tinta azul 8,9:1 (texto das faixas), Papel a 80% sobre Tinta azul cerca de 6,5:1 (endereço e rodapé), segundo tom do título (Grafite a 50% sobre Papel) cerca de 3,5:1, aceito só porque o `h2` tem 30px ou mais (texto grande, AA pede 3:1). Os cartões de vidro a 5% sobre Tinta azul praticamente não alteram o fundo, então o contraste do texto é o da faixa.
