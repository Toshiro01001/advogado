/* Testes do site com Playwright.
   Como rodar, na raiz do projeto:  node tests/site.cjs
   O script sobe um servidor local (python3 -m http.server 8302, na pasta acima, para o site
   responder em /advogado/ como no GitHub Pages), abre o site
   em três tamanhos (1280x900, iPhone 13 e 320px), exercita as quatro funções,
   confere console, rolagem horizontal e textos cortados, e salva capturas PNG em
   CAP_DIR (quando a variável CAPTURAS=1; depois convertidas para webp em docs/) e PNGs na pasta indicada em SHOTS_DIR. */
"use strict";
const { chromium, devices } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORTA = 8302;
const RAIZ = path.resolve(__dirname, "..");
const SLUG = path.basename(RAIZ);
const URL = `http://127.0.0.1:${PORTA}/${SLUG}/`;
const CAPTURAS = process.env.CAPTURAS === "1";
const SHOTS_DIR = process.env.SHOTS_DIR || "";
const CAP_DIR = process.env.CAP_DIR || path.join(RAIZ, "tests", "capturas");

const falhas = [];
function checa(cond, msg) { if (!cond) falhas.push(msg); }
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function servidor() {
  const proc = spawn("python3", ["-m", "http.server", String(PORTA), "--bind", "127.0.0.1"], { cwd: path.dirname(RAIZ), stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(URL); if (r.ok) return proc; } catch (e) { /* ainda subindo */ }
    await espera(150);
  }
  proc.kill();
  throw new Error("Servidor local não subiu na porta " + PORTA);
}

async function verificacoesBasicas(page, rotulo) {
  const largura = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  checa(largura.doc <= largura.win, `${rotulo}: rolagem horizontal (${largura.doc} > ${largura.win})`);

  const cortados = await page.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll("h1,h2,h3,p,a,button,label,legend,li,dt,dd,summary,span,small,address");
    for (const el of els) {
      if (el.closest("[hidden]") || el.offsetParent === null && getComputedStyle(el).position !== "fixed") continue;
      const cs = getComputedStyle(el);
      if (cs.overflow === "hidden" || cs.overflowX === "hidden") continue;
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
        out.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`);
      }
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 1 && r.width > 0) out.push(`${el.tagName.toLowerCase()}.${el.className} sai da tela (${Math.round(r.right)})`);
    }
    return out;
  });
  checa(cortados.length === 0, `${rotulo}: textos cortados ou fora da tela: ${cortados.join(" | ")}`);
}

async function capturar(page, seletor, nome) {
  /* Tira o topo fixo do caminho para a captura do bloco sair limpa */
  await page.evaluate(() => { document.querySelector(".topo").style.position = "static"; });
  await page.locator(seletor).screenshot({ path: path.join(CAP_DIR, nome + ".png") });
  await page.evaluate(() => { document.querySelector(".topo").style.position = ""; });
}

async function testaFuncoes(page, rotulo, capturas, sufixo) {
  /* Triagem */
  await page.check('input[name="tema"][value="consumidor"]');
  await page.check('input[name="momento"][value="tentei"]');
  await page.check('input[name="urgencia"][value="prazo"]');
  await page.click('#form-triagem button[type="submit"]');
  await page.waitForSelector("#triagem-resultado:not([hidden])");
  const tituloTriagem = await page.textContent("#triagem-titulo");
  checa(tituloTriagem.includes("consumidor"), `${rotulo}: triagem não indicou consumidor (${tituloTriagem})`);
  checa(!(await page.isHidden("#triagem-urgencia")), `${rotulo}: aviso de urgência não apareceu`);
  if (capturas) await capturar(page, "#triagem", `funcao-triagem${sufixo}`);

  /* Agenda: vai para a consulta preenchendo a área a partir da triagem */
  await page.click("#triagem-agendar");
  checa((await page.inputValue("#area")) === "consumidor", `${rotulo}: área não veio preenchida da triagem`);
  await page.click('#form-agenda button[type="submit"]');
  checa(!(await page.isHidden("#agenda-erro")), `${rotulo}: agenda aceitou pedido sem dia`);
  const dia = page.locator("#cal-dias .dia:not([disabled])").first();
  if (await dia.count() === 0) {
    await page.click("#cal-proximo");
  }
  await page.locator("#cal-dias .dia:not([disabled])").first().click();
  const hora = page.locator("#horarios .hora:not([disabled])").first();
  checa(await hora.count() > 0, `${rotulo}: nenhum horário livre no primeiro dia disponível`);
  await hora.click();
  await page.fill("#nome", "Maria de Teste");
  await page.fill("#telefone", "65999990000");
  checa((await page.inputValue("#telefone")) === "(65) 99999-0000", `${rotulo}: máscara do telefone errada: ${await page.inputValue("#telefone")}`);
  await page.fill("#resumo", "Cobrança indevida no cartão, já contestei duas vezes.");
  if (capturas) await capturar(page, "#consulta", `funcao-agenda${sufixo}`);
  await page.click('#form-agenda button[type="submit"]');
  await page.waitForSelector("#agenda-resultado:not([hidden])");
  const quando = await page.textContent("#res-quando");
  checa(/às \d{2}:\d{2}/.test(quando), `${rotulo}: resumo do pedido sem horário (${quando})`);
  const salvo = await page.evaluate(() => localStorage.getItem("cm-consulta"));
  checa(!!salvo && JSON.parse(salvo).nome === "Maria de Teste", `${rotulo}: pedido não ficou no localStorage`);

  /* Recarrega: o pedido salvo deve reaparecer; depois apaga */
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#agenda-resultado:not([hidden])");
  await page.click("#agenda-apagar");
  checa((await page.evaluate(() => localStorage.getItem("cm-consulta"))) === null, `${rotulo}: apagar não limpou o localStorage`);
  checa(!(await page.isHidden("#form-agenda")), `${rotulo}: formulário da agenda não voltou após apagar`);

  /* Prazos: 15 dias úteis a partir de 10/12/2026 (quinta). Com recesso: 11, 14 a 18/12, depois 21/1 em diante, termina em 02/02/2027. Sem recesso: pula Natal e Ano Novo, termina em 04/01/2027. */
  await page.fill("#prazo-inicio", "2026-12-10");
  await page.fill("#prazo-dias", "15");
  await page.click('#form-prazo button[type="submit"]');
  await page.waitForSelector("#prazo-resultado:not([hidden])");
  const fim = await page.textContent("#prazo-fim");
  checa(fim.includes("2 de fevereiro de 2027"), `${rotulo}: prazo com recesso errado: ${fim}`);
  await page.uncheck('input[name="recesso"]');
  await page.click('#form-prazo button[type="submit"]');
  const fim2 = await page.textContent("#prazo-fim");
  checa(fim2.includes("4 de janeiro de 2027"), `${rotulo}: prazo sem recesso errado: ${fim2}`);
  await page.check('input[name="tipo"][value="corridos"]');
  await page.fill("#prazo-inicio", "2026-11-06");
  await page.fill("#prazo-dias", "15");
  await page.click('#form-prazo button[type="submit"]');
  const fim3 = await page.textContent("#prazo-fim");
  /* 06/11 + 15 = 21/11 (sábado) -> prorroga para segunda 23/11 */
  checa(fim3.includes("23 de novembro de 2026"), `${rotulo}: prazo corrido não prorrogou: ${fim3}`);
  checa((await page.textContent("#prazo-pulos")).includes("adiado"), `${rotulo}: explicação do prazo corrido não fala do adiamento`);
  checa(await page.isDisabled('input[name="recesso"]'), `${rotulo}: opção de recesso continua ativa em dias corridos`);
  if (capturas) await capturar(page, "#prazos", `funcao-prazos${sufixo}`);

  /* Artigos: busca sem acento encontra "pensão" */
  await page.fill("#busca-artigos", "pensao");
  await espera(100);
  const visiveis = await page.locator("#lista-artigos .artigo:not([hidden])").count();
  checa(visiveis >= 1 && visiveis < 8, `${rotulo}: busca por "pensao" deixou ${visiveis} artigos`);
  await page.fill("#busca-artigos", "zzzz");
  await espera(100);
  checa(!(await page.isHidden("#busca-vazio")), `${rotulo}: aviso de busca vazia não apareceu`);
  await page.fill("#busca-artigos", "");
  await espera(100);
  checa((await page.locator("#lista-artigos .artigo:not([hidden])").count()) === 8, `${rotulo}: limpar a busca não devolveu os 8 artigos`);
  await page.fill("#busca-artigos", "negativado");
  await espera(100);
  await page.locator("#lista-artigos .artigo:not([hidden]) summary").first().click();
  if (capturas) await capturar(page, "#artigos", `funcao-artigos${sufixo}`);
  await page.fill("#busca-artigos", "");
}

(async () => {
  if (CAPTURAS) fs.mkdirSync(CAP_DIR, { recursive: true });
  const proc = await servidor();
  const browser = await chromium.launch();
  const cenarios = [
    { nome: "1280x900", ctx: { viewport: { width: 1280, height: 900 } }, sufixo: "" },
    { nome: "iPhone 13", ctx: { ...devices["iPhone 13"] }, sufixo: "-celular" },
    { nome: "320px", ctx: { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, sufixo: "" }
  ];
  try {
    for (const c of cenarios) {
      const context = await browser.newContext(c.ctx);
      const page = await context.newPage();
      const erros = [];
      page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") erros.push(`${m.type()}: ${m.text()}`); });
      page.on("pageerror", (e) => erros.push("pageerror: " + e.message));
      page.on("requestfailed", (r) => erros.push("requestfailed: " + r.url()));
      await page.goto(URL, { waitUntil: "networkidle" });
      await espera(1300);
      await verificacoesBasicas(page, c.nome + " (abertura)");

      /* Teclado: o primeiro Tab vai para o link "Pular para o conteúdo" */
      await page.keyboard.press("Tab");
      const ativo = await page.evaluate(() => document.activeElement.className);
      checa(ativo.includes("pular"), `${c.nome}: primeiro Tab não foi para o link "Pular para o conteúdo" (${ativo})`);
      await page.mouse.click(5, 5);

      const capturas = CAPTURAS && c.nome !== "320px";
      if (CAPTURAS && c.nome !== "320px") {
        await page.screenshot({ path: path.join(CAP_DIR, `capa${c.sufixo || "-desktop"}.png`) });
      }
      /* Menu no celular */
      if (c.nome !== "1280x900") {
        await page.click(".menu-botao");
        checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "true", `${c.nome}: menu não abriu`);
        await page.click('#menu a[href="#consulta"]');
        checa((await page.getAttribute(".menu-botao", "aria-expanded")) === "false", `${c.nome}: menu não fechou ao clicar`);
      }
      await testaFuncoes(page, c.nome, capturas, c.sufixo);
      await verificacoesBasicas(page, c.nome + " (após uso)");

      /* Página 404 */
      await page.goto(URL + "404.html", { waitUntil: "networkidle" });
      await verificacoesBasicas(page, c.nome + " (404)");

      const errosReais = erros.filter((e) => !/404\.html|favicon/.test(e) || /pageerror/.test(e));
      checa(errosReais.length === 0, `${c.nome}: console: ${errosReais.join(" | ")}`);
      console.log(`${c.nome}: ok (console ${errosReais.length}, falhas até aqui ${falhas.length})`);
      await context.close();
    }

    if (SHOTS_DIR) {
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
      const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await d.goto(URL, { waitUntil: "networkidle" }); await espera(1300);
      await d.screenshot({ path: path.join(SHOTS_DIR, "advogado-desk.png") });
      await d.close();
      const ctx = await browser.newContext({ ...devices["iPhone 13"] });
      const m = await ctx.newPage();
      await m.goto(URL, { waitUntil: "networkidle" }); await espera(1300);
      await m.screenshot({ path: path.join(SHOTS_DIR, "advogado-cel.png") });
      await ctx.close();
    }
  } finally {
    await browser.close();
    proc.kill();
  }

  if (falhas.length) {
    console.error("\nFALHAS:\n- " + falhas.join("\n- "));
    process.exit(1);
  }
  console.log("\nTodos os testes passaram.");
})().catch((e) => { console.error(e); process.exit(1); });
