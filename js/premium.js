/* Clara Montenegro (vitrine): movimento da criação premium, sem biblioteca.
   Grão de filme, topo que some ao descer, títulos que sobem por máscara, rótulos em mono que embaralham,
   as áreas presas à rolagem e a folha que é grifada e anotada passo a passo.
   Com "menos movimento" nada disso anima: tudo aparece no estado final. A página funciona sem este arquivo. */
(function () {
  "use strict";
  var raiz = document.documentElement;
  var calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var largo = window.matchMedia("(min-width: 900px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  if (!calmo) raiz.classList.add("js");

  /* ---------- grão: um ladrilho de ruído desenhado uma vez ---------- */
  (function grao() {
    try {
      var c = document.createElement("canvas"); c.width = c.height = 180;
      var x = c.getContext("2d"), d = x.createImageData(180, 180), i;
      for (i = 0; i < d.data.length; i += 4) { var v = (Math.random() * 255) | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      x.putImageData(d, 0, 0);
      var g = document.createElement("div"); g.className = "grao"; g.setAttribute("aria-hidden", "true");
      g.style.backgroundImage = "url(" + c.toDataURL("image/png") + ")";
      document.body.appendChild(g);
    } catch (e) { /* sem canvas, sem grão */ }
  })();

  /* ---------- embaralhar: só em fonte mono, trava da esquerda para a direita ---------- */
  var SIMBOLOS = "ABCDEFGHJKLMNPRSTUVXZ0123456789§/+";
  function embaralha(el, texto) {
    var fim = texto != null ? texto : (el.dataset.final || el.textContent);
    el.dataset.final = fim;
    if (calmo) { el.textContent = fim; return; }
    if (el._emb) cancelAnimationFrame(el._emb);
    var t0 = performance.now(), dur = Math.min(900, 260 + fim.length * 22), ultimo = 0;
    el.setAttribute("aria-label", fim);
    (function passo(t) {
      var p = Math.min(1, (t - t0) / dur);
      if (t - ultimo > 33 || p === 1) {
        ultimo = t;
        var travadas = Math.floor(p * fim.length), s = "", i;
        for (i = 0; i < fim.length; i++) {
          var ch = fim.charAt(i);
          s += i < travadas || ch === " " || ch === "·" || ch === "," || ch === "." ? ch : SIMBOLOS.charAt((Math.random() * SIMBOLOS.length) | 0);
        }
        el.textContent = s;
      }
      if (p < 1) el._emb = requestAnimationFrame(passo); else { el.textContent = fim; el._emb = 0; }
    })(t0);
  }

  /* ---------- entrada: o que cruza a tela ganha a classe "ver" ---------- */
  var alvos = $$(".hero, .hero-pe, .titulo, [data-embaralha]");
  if (calmo || !("IntersectionObserver" in window)) alvos.forEach(function (a) { a.classList.add("ver"); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target.hasAttribute("data-embaralha")) { if (!e.target.closest(".dossie")) embaralha(e.target); }
        else e.target.classList.add("ver");
      });
    }, { threshold: 0.2 });
    alvos.forEach(function (a) { io.observe(a); });
  }

  /* ---------- topo: some ao descer, volta ao subir ---------- */
  var topo = $(".topo"), menu = $("#menu"), yAntes = window.scrollY;
  function aoRolarTopo() {
    var y = window.scrollY;
    if (!topo) return;
    topo.classList.toggle("rolou", y > 40);
    var aberto = menu && menu.classList.contains("aberto");
    if (!aberto && y > 240 && y > yAntes + 4) topo.classList.add("some");
    else if (y < yAntes - 4 || y <= 240) topo.classList.remove("some");
    yAntes = y;
  }

  /* ---------- dossiês: a rolagem escolhe a área, a troca acontece por tempo ---------- */
  var dos = $(".dossies"), fichas = $$(".dossie"), trilho = $$(".dossies-trilho button"), barra = $(".dossies-barra i"), areaAtiva = -1;
  function preso() { return largo.matches && !calmo; }
  function ativaArea(n) {
    if (n === areaAtiva) return;
    areaAtiva = n;
    fichas.forEach(function (f, i) {
      var on = i === n; f.classList.toggle("ativa", on);
      $$(".titulo", f).forEach(function (t) { t.classList.toggle("ver", on); });
      if (on) $$("[data-embaralha]", f).forEach(function (d) { embaralha(d); });
    });
    trilho.forEach(function (b, i) { b.classList.toggle("ativa", i === n); });
  }
  function aoRolarDossies() {
    if (!dos || !fichas.length) return;
    if (!preso()) { if (areaAtiva !== -2) { areaAtiva = -2; fichas.forEach(function (f) { f.classList.remove("ativa"); }); } return; }
    var r = dos.getBoundingClientRect(), total = r.height - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    if (barra) barra.style.setProperty("--p", p.toFixed(3));
    ativaArea(Math.min(fichas.length - 1, Math.floor(p * fichas.length * 0.999)));
  }
  trilho.forEach(function (b) {
    b.addEventListener("click", function () {
      var n = +b.getAttribute("data-ir"), r = dos.getBoundingClientRect(), total = r.height - window.innerHeight;
      window.scrollTo({ top: window.scrollY + r.top + total * ((n + 0.3) / fichas.length), behavior: "smooth" });
    });
  });
  if (!preso() && !calmo && "IntersectionObserver" in window) {
    var ioD = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { ioD.unobserve(e.target); $$("[data-embaralha]", e.target).forEach(function (d) { embaralha(d); }); } });
    }, { threshold: 0.35 });
    fichas.forEach(function (f) { ioD.observe(f); });
  }

  /* ---------- a leitura: a folha é grifada e anotada por marcos ---------- */
  var lei = $(".leitura"), folha = $(".folha"), versao = $("[data-versao]"), passoAtual = 0;
  var VERSOES = ["", "Como chegou", "Lido e grifado", "Explicado por escrito"];
  var escrita = $(".escrita");
  if (escrita && !calmo) {
    var palavras = escrita.textContent.split(" "); escrita.textContent = "";
    palavras.forEach(function (w, i) {
      var s = document.createElement("span"); s.textContent = w + (i < palavras.length - 1 ? " " : "");
      s.style.transitionDelay = (0.25 + i * 0.045).toFixed(3) + "s"; escrita.appendChild(s);
    });
  }
  function passo(n) {
    if (n === passoAtual || !lei) return;
    passoAtual = n;
    $$("[data-passo]", lei).forEach(function (el) {
      var p = +el.getAttribute("data-passo");
      if (el.closest(".leitura-passos") || el.closest(".leitura-frases")) el.classList.toggle("ativa", p === n);
      else el.classList.toggle("feito", p <= n);
    });
    if (versao && n > 0) embaralha(versao, VERSOES[n]);
  }
  function aoRolarLeitura() {
    if (!lei || !folha) return;
    if (calmo) { passo(3); return; }
    var p;
    if (preso()) { var r = lei.getBoundingClientRect(), total = r.height - window.innerHeight; if (r.top > window.innerHeight * 0.6) { passo(0); return; } p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0; }
    else { var f = folha.getBoundingClientRect(); if (f.top > window.innerHeight * 0.85) { passo(0); return; } p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - f.top) / (f.height * 0.9))); }
    passo(p < 0.28 ? 1 : p < 0.62 ? 2 : 3);
  }

  /* ---------- um só ouvinte de rolagem, um quadro por vez ---------- */
  var pedido = false;
  function quadro() { pedido = false; aoRolarTopo(); aoRolarDossies(); aoRolarLeitura(); }
  function pede() { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } }
  window.addEventListener("scroll", pede, { passive: true });
  window.addEventListener("resize", pede);
  if (largo.addEventListener) largo.addEventListener("change", function () { areaAtiva = -1; pede(); });
  quadro();
})();
