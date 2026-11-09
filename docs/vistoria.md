# Vistoria de segurança: Clara Montenegro, Advogada (vitrine)

Data: 08/11/2026. Site estático, sem servidor próprio, publicado no GitHub Pages.

## O que foi conferido

| Item | Situação |
|---|---|
| Content-Security-Policy | Meta tag em `index.html` e `404.html`: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`. Sem scripts inline, sem estilos inline no HTML (o teste altera `style` via JavaScript só durante as capturas, o que a CSP permite porque é CSSOM, não atributo no markup). `frame-ancestors` ficou de fora porque navegadores ignoram essa diretiva em meta tag e avisam no console. |
| Envio de dados | Nenhum. `connect-src 'none'` bloqueia `fetch`, `XMLHttpRequest` e WebSocket. Os formulários têm `novalidate` e o `submit` é interceptado com `preventDefault`; não há `action`. O único link externo é https://mileumalinhas.com.br, com `rel="noopener"`. |
| localStorage | Uma chave, `cm-consulta`, gravada só quando o visitante registra um pedido de consulta na simulação. Guarda dia, hora, modo, nome, telefone, área e resumo digitados pelo próprio visitante, mais a data do registro. O site avisa disso na tela e oferece o botão "Apagar o que ficou salvo", que remove a chave. Leitura protegida com `try/catch` e checagem dos campos antes de usar. |
| Dependências | Nenhuma em produção. Fontes Newsreader e Public Sans servidas da pasta `fonts/` (woff2, SIL OFL 1.1, licenças ao lado). Playwright é usado só nos testes, fora do site publicado. |
| Dados reais | Nenhum. Advogada, OAB, endereço, telefone e e-mail são fictícios e identificados como tais no próprio site. |
| Entrada do visitante | Todo texto digitado vai para a tela por `textContent`, nunca por `innerHTML`. O JSON lido do `localStorage` é validado antes de ser mostrado. |
| Cabeçalhos HTTP | Dependem do GitHub Pages (não configuráveis pelo repositório). Por isso a CSP está em meta tag. |

## Riscos residuais

- A CSP por meta tag é respeitada pelos navegadores atuais, mas não protege contra um servidor comprometido que troque o próprio HTML. No GitHub Pages esse risco é o da plataforma.
- O conteúdo do `localStorage` fica legível para quem usar o mesmo navegador e perfil. Como os dados são digitados pelo próprio visitante em uma simulação, o impacto é baixo, e o botão de apagar está visível.
- A calculadora de prazos é uma simulação: usa feriados nacionais e recesso forense, mas não feriados estaduais e municipais nem suspensões de expediente. O site diz isso ao lado do resultado para ninguém tratar a conta como oficial.
- Sem `Subresource Integrity` porque não há recurso externo a proteger.

## Revisão de 08/11/2026 (leva final de design)

Revisão feita depois de aplicar os design systems da leva final e encaixar as fotos geradas por IA no Canva.

- **CSP:** a política do `index.html` é a mesma de antes da leva (conferida linha a linha). Continua sem `unsafe-inline`, sem `unsafe-eval` e sem origem externa.
- **Script e estilo inline:** nenhum `<script>` inline, nenhum `<style>` e nenhum atributo `style` nas páginas. Os efeitos novos mudam só classes, `textContent` e propriedades CSS pelo CSSOM, que a CSP permite.
- **Recursos externos:** nenhum script, fonte, imagem ou folha de estilo de fora. Os únicos links externos são de navegação comum (mileumalinhas.com.br e o perfil do GitHub).
- **Bibliotecas:** nenhuma entrou. Movimento, vidro, contadores e revelação ao rolar são CSS e JavaScript escritos à mão, desligados com `prefers-reduced-motion`.
- **innerHTML:** nenhum uso no JavaScript.
- **eval e Function:** nenhum uso.
- **Armazenamento:** `localStorage` continua só com o que já existia (`cm-consulta`), sem chave nova nesta leva.
- **Dados pessoais:** nenhum dado pessoal real entrou. Pessoas, empresas, telefones e endereços seguem fictícios. As fotos não retratam pessoas reais.
- **Imagens:** arquivos webp locais em `img/`, com `width`/`height`, `loading="lazy"` e `decoding="async"`. Nenhuma é carregada de outro domínio.
- **Testes:** `tests/site.cjs` passa em 1280x900, iPhone 13 e 320px, sem erro de console e sem rolagem horizontal.
