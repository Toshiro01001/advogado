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
