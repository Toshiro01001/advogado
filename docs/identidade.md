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
- Não existe gradiente. Não existe sombra em cartão: os blocos são separados por linha de 1px ou por troca de fundo (Papel para Papel escuro).
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

O hero é uma **folha de papel desenhada em CSS e SVG**: um bloco de Papel escuro, levemente girado, com linhas pautadas e três parágrafos de "texto" representados por traços (nenhum texto falso em imagem). Sobre ele, um trecho real do posicionamento aparece grifado com o marca-texto amarelo, e uma caneta de tinta azul em SVG repousa no canto. A mensagem é: aqui alguém lê o seu caso de verdade, linha por linha.

Fora do hero, nenhuma imagem decorativa. Os ícones das áreas são traços simples em SVG (uma casa com duas pessoas, uma nota fiscal), em tinta azul, com `aria-hidden`.

## Movimento

- Um único momento orquestrado na abertura: o grifo de marca-texto no hero "passa" da esquerda para a direita em 700ms, 400ms depois de a página carregar, como alguém marcando um trecho. Só isso.
- Respostas a ações do visitante: resultado da triagem e confirmação da agenda surgem com um fade de 200ms; o foco de teclado ganha contorno de 3px em tinta azul.
- Com `prefers-reduced-motion: reduce`, o grifo já aparece pronto e os fades somem.
