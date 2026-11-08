/* Clara Montenegro, Advogada: comportamento do site.
   Tudo roda no navegador. Nenhum pedido sai para a internet. */
(function () {
  "use strict";

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------
     Datas e feriados (usados pela agenda e pela calculadora de prazos)
     ------------------------------------------------------------------ */
  function hoje() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function somaDias(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }
  function chave(d) {
    var m = String(d.getMonth() + 1), dia = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (dia.length < 2 ? "0" + dia : dia);
  }
  function deChave(s) {
    var p = s.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function fimDeSemana(d) {
    var w = d.getDay();
    return w === 0 || w === 6;
  }
  /* Páscoa pelo algoritmo de Meeus/Jones/Butcher */
  function pascoa(ano) {
    var a = ano % 19, b = Math.floor(ano / 100), c = ano % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
  }
  var cacheFeriados = {};
  function feriadosDoAno(ano) {
    if (cacheFeriados[ano]) return cacheFeriados[ano];
    var lista = {};
    function fixo(mes, dia, nome) { lista[chave(new Date(ano, mes - 1, dia))] = nome; }
    fixo(1, 1, "Confraternização Universal");
    fixo(4, 21, "Tiradentes");
    fixo(5, 1, "Dia do Trabalho");
    fixo(9, 7, "Independência do Brasil");
    fixo(10, 12, "Nossa Senhora Aparecida");
    fixo(11, 2, "Finados");
    fixo(11, 15, "Proclamação da República");
    fixo(11, 20, "Dia da Consciência Negra");
    fixo(12, 25, "Natal");
    var p = pascoa(ano);
    lista[chave(somaDias(p, -48))] = "Segunda-feira de Carnaval";
    lista[chave(somaDias(p, -47))] = "Terça-feira de Carnaval";
    lista[chave(somaDias(p, -2))] = "Sexta-feira Santa";
    lista[chave(somaDias(p, 60))] = "Corpus Christi";
    cacheFeriados[ano] = lista;
    return lista;
  }
  function feriado(d) {
    return feriadosDoAno(d.getFullYear())[chave(d)] || null;
  }
  /* Recesso forense: 20 de dezembro a 20 de janeiro (CPC art. 220) */
  function emRecesso(d) {
    var m = d.getMonth(), dia = d.getDate();
    return (m === 11 && dia >= 20) || (m === 0 && dia <= 20);
  }
  function diaUtil(d, considerarRecesso) {
    if (fimDeSemana(d) || feriado(d)) return false;
    if (considerarRecesso && emRecesso(d)) return false;
    return true;
  }

  var fmtLongo = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fmtCurto = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  var fmtMesAno = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
  var fmtMes = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  function capitalizar(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ------------------------------------------------------------------
     Menu no celular
     ------------------------------------------------------------------ */
  (function menu() {
    var botao = $(".menu-botao"), nav = $("#menu");
    if (!botao || !nav) return;
    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
      });
    });
  })();

  /* ------------------------------------------------------------------
     Abertura: o grifo passa sobre o trecho do título
     ------------------------------------------------------------------ */
  (function abertura() {
    var grifo = $(".hero .grifo");
    if (!grifo) return;
    var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) { grifo.classList.add("pronto"); return; }
    window.setTimeout(function () { grifo.classList.add("pronto"); }, 400);
  })();

  /* ------------------------------------------------------------------
     Triagem em 3 perguntas
     ------------------------------------------------------------------ */
  (function triagem() {
    var form = $("#form-triagem");
    if (!form) return;
    var erro = $("#triagem-erro"), resultado = $("#triagem-resultado");
    var titulo = $("#triagem-titulo"), texto = $("#triagem-texto"), passo = $("#triagem-passo");
    var urgenciaEl = $("#triagem-urgencia"), agendar = $("#triagem-agendar");

    var areas = {
      familia: {
        nome: "Direito de família",
        texto: "A sua situação envolve relações de família: casamento, união estável, filhos, pensão ou herança. É uma das duas áreas em que eu atuo, e em geral é possível começar buscando um acordo antes de pensar em processo."
      },
      consumidor: {
        nome: "Direito do consumidor",
        texto: "A sua situação envolve uma relação de consumo: uma empresa, um banco, um plano de saúde ou um prestador de serviço. É uma das duas áreas em que eu atuo. Boa parte desses casos se resolve com uma notificação bem feita e os documentos certos em mãos."
      },
      outro: {
        nome: "Fora das minhas áreas",
        texto: "Pelo que você respondeu, o seu caso é de outra área (trabalho, imóveis, acidentes, crime ou empresa). Eu não atuo nela, e prefiro dizer isso logo a aceitar um caso que não vou conduzir bem. Na consulta inicial eu posso ouvir a sua história e indicar que tipo de profissional procurar."
      }
    };
    var passos = {
      entender: "junte os documentos que tiver (contratos, comprovantes, mensagens, certidões) e marque a consulta inicial. Nela eu explico os seus direitos e as opções, sem compromisso de continuidade.",
      tentei: "guarde as provas das tentativas (protocolos, e-mails, conversas) e marque a consulta inicial. Como a conversa direta não funcionou, o próximo movimento costuma ser uma notificação formal ou o pedido judicial.",
      processo: "localize o número do processo ou o documento que recebeu e marque a consulta o quanto antes. Com processo em andamento, o que importa primeiro é o prazo."
    };
    var urgencias = {
      prazo: "Como há uma data nos próximos 15 dias, escolha o primeiro horário livre na agenda e traga o documento com o prazo. Prazos processuais correm em dias úteis e, perdidos, raramente voltam.",
      risco: "Se há violência, ligue 190 (Polícia) ou 180 (Central de Atendimento à Mulher) antes de qualquer outra coisa. Para corte de serviço essencial ou bloqueio de conta, existem pedidos urgentes à Justiça, e a consulta pode ser marcada para o primeiro horário do dia."
    };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var tema = form.tema.value, momento = form.momento.value, urgencia = form.urgencia.value;
      if (!tema || !momento || !urgencia) {
        erro.textContent = "Responda as três perguntas para ver a indicação.";
        erro.hidden = false;
        resultado.hidden = true;
        return;
      }
      erro.hidden = true;
      var area = areas[tema];
      titulo.textContent = area.nome;
      texto.textContent = area.texto;
      passo.textContent = passos[momento];
      if (urgencias[urgencia]) {
        urgenciaEl.textContent = urgencias[urgencia];
        urgenciaEl.hidden = false;
      } else {
        urgenciaEl.hidden = true;
      }
      agendar.setAttribute("data-area", tema);
      resultado.hidden = false;
      resultado.setAttribute("tabindex", "-1");
      resultado.focus({ preventScroll: true });
      resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    form.addEventListener("reset", function () {
      erro.hidden = true;
      resultado.hidden = true;
    });
    agendar.addEventListener("click", function () {
      var sel = $("#area");
      if (sel) sel.value = agendar.getAttribute("data-area") || "";
    });
  })();

  /* ------------------------------------------------------------------
     Agenda de consulta inicial (simulada)
     ------------------------------------------------------------------ */
  (function agenda() {
    var form = $("#form-agenda");
    if (!form) return;
    var CHAVE = "cm-consulta";
    var HORARIOS = ["09:00", "10:30", "14:00", "15:30", "17:00"];
    var SEMANAS_VISIVEIS = 2, SEMANAS_MAX = 8;

    var calDias = $("#cal-dias"), calTitulo = $("#cal-titulo");
    var btAnterior = $("#cal-anterior"), btProximo = $("#cal-proximo");
    var horariosEl = $("#horarios"), diaEscolhidoEl = $("#dia-escolhido");
    var erro = $("#agenda-erro"), resultado = $("#agenda-resultado");

    var inicio = hoje();
    var segundaBase = somaDias(inicio, -((inicio.getDay() + 6) % 7)); /* segunda-feira desta semana */
    var deslocamento = 0; /* em blocos de SEMANAS_VISIVEIS semanas */
    var diaSelecionado = null, horaSelecionada = null;

    /* Ocupações fictícias, mas determinísticas: o mesmo dia sempre dá o mesmo resultado */
    function semente(d, extra) {
      var s = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate() + (extra || 0) * 7;
      var x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    }
    function diaTomado(d) { return semente(d, 0) < 0.18; }
    function horaTomada(d, i) { return semente(d, i + 1) < 0.35; }

    function disponivel(d) {
      return d > inicio && diaUtil(d, false) && !diaTomado(d);
    }

    function desenharCalendario() {
      calDias.textContent = "";
      var primeiro = somaDias(segundaBase, deslocamento * SEMANAS_VISIVEIS * 7);
      var ultimo = somaDias(primeiro, SEMANAS_VISIVEIS * 7 - 3);
      var t1 = fmtMesAno.format(primeiro), t2 = fmtMesAno.format(ultimo);
      calTitulo.textContent = capitalizar(t1 === t2 ? t1 : fmtMes.format(primeiro).replace(".", "") + " a " + t2);

      for (var s = 0; s < SEMANAS_VISIVEIS; s++) {
        for (var w = 0; w < 5; w++) {
          var d = somaDias(primeiro, s * 7 + w);
          var b = document.createElement("button");
          b.type = "button";
          b.className = "dia";
          b.setAttribute("data-dia", chave(d));
          var num = document.createElement("span");
          num.textContent = String(d.getDate());
          var sub = document.createElement("small");
          var f = feriado(d);
          if (f) sub.textContent = "feriado";
          else if (d <= inicio) sub.textContent = d.getTime() === inicio.getTime() ? "hoje" : "passou";
          else if (diaTomado(d)) sub.textContent = "tomado";
          else sub.textContent = fmtMes.format(d).replace(".", "");
          b.appendChild(num);
          b.appendChild(sub);
          var ok = disponivel(d);
          if (!ok) b.disabled = true;
          b.setAttribute("aria-label", capitalizar(fmtLongo.format(d)) + (ok ? "" : ", indisponível"));
          b.setAttribute("aria-pressed", diaSelecionado && chave(d) === diaSelecionado ? "true" : "false");
          calDias.appendChild(b);
        }
      }
      btAnterior.disabled = deslocamento === 0;
      btProximo.disabled = deslocamento >= (SEMANAS_MAX / SEMANAS_VISIVEIS) - 1;
    }

    function desenharHorarios() {
      horariosEl.textContent = "";
      if (!diaSelecionado) {
        diaEscolhidoEl.textContent = "nenhum dia escolhido";
        var p = document.createElement("p");
        p.className = "nota";
        p.textContent = "Escolha um dia no calendário para ver os horários.";
        horariosEl.appendChild(p);
        return;
      }
      var d = deChave(diaSelecionado);
      diaEscolhidoEl.textContent = fmtLongo.format(d);
      HORARIOS.forEach(function (h, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "hora";
        b.textContent = h;
        b.setAttribute("data-hora", h);
        if (horaTomada(d, i)) {
          b.disabled = true;
          b.setAttribute("aria-label", h + ", ocupado");
        }
        b.setAttribute("aria-pressed", horaSelecionada === h ? "true" : "false");
        horariosEl.appendChild(b);
      });
    }

    calDias.addEventListener("click", function (ev) {
      var b = ev.target.closest(".dia");
      if (!b || b.disabled) return;
      diaSelecionado = b.getAttribute("data-dia");
      horaSelecionada = null;
      $$(".dia", calDias).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      desenharHorarios();
      erro.hidden = true;
    });
    horariosEl.addEventListener("click", function (ev) {
      var b = ev.target.closest(".hora");
      if (!b || b.disabled) return;
      horaSelecionada = b.getAttribute("data-hora");
      $$(".hora", horariosEl).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      erro.hidden = true;
    });
    btAnterior.addEventListener("click", function () { if (deslocamento > 0) { deslocamento--; desenharCalendario(); } });
    btProximo.addEventListener("click", function () { deslocamento++; desenharCalendario(); });

    /* Máscara simples do telefone: só dígitos, formatados ao digitar */
    var tel = $("#telefone");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11);
      var out = d;
      if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length === 11 ? 7 : 6) + "-" + d.slice(d.length === 11 ? 7 : 6);
      tel.value = out;
    });

    function nomeArea(v) {
      return { familia: "Família", consumidor: "Consumidor", outro: "Não sei ou outra" }[v] || v;
    }
    function mostrarResultado(pedido) {
      $("#res-quando").textContent = capitalizar(fmtLongo.format(deChave(pedido.dia))) + ", às " + pedido.hora;
      $("#res-modo").textContent = pedido.modo === "video" ? "Por videochamada" : "Presencial, no escritório";
      $("#res-nome").textContent = pedido.nome;
      $("#res-telefone").textContent = pedido.telefone;
      $("#res-area").textContent = nomeArea(pedido.area);
      $("#res-resumo").textContent = pedido.resumo || "(sem resumo)";
      form.hidden = true;
      resultado.hidden = false;
    }
    function limparCampoErro() { $$(".campo-erro", form).forEach(function (c) { c.classList.remove("campo-erro"); }); }
    function marcarErro(el, msg) {
      var campo = el.closest(".campo");
      if (campo) campo.classList.add("campo-erro");
      erro.textContent = msg;
      erro.hidden = false;
      el.focus();
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      limparCampoErro();
      if (!diaSelecionado) {
        erro.textContent = "Escolha um dia no calendário.";
        erro.hidden = false;
        calDias.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (!horaSelecionada) {
        erro.textContent = "Escolha um horário para o dia " + fmtCurto.format(deChave(diaSelecionado)) + ".";
        erro.hidden = false;
        return;
      }
      var nome = $("#nome"), area = $("#area"), resumo = $("#resumo");
      if (nome.value.trim().length < 3) return marcarErro(nome, "Escreva o seu nome (pelo menos 3 letras).");
      var digitos = tel.value.replace(/\D/g, "");
      if (digitos.length < 10 || digitos.length > 11) return marcarErro(tel, "Informe um telefone com DDD, com 10 ou 11 números.");
      if (!area.value) return marcarErro(area, "Escolha a área, ou marque \"Não sei ou outra\".");
      erro.hidden = true;

      var pedido = {
        dia: diaSelecionado,
        hora: horaSelecionada,
        modo: form.modo.value,
        nome: nome.value.trim(),
        telefone: tel.value,
        area: area.value,
        resumo: resumo.value.trim(),
        registradoEm: new Date().toISOString()
      };
      try { window.localStorage.setItem(CHAVE, JSON.stringify(pedido)); } catch (e) { /* navegador sem armazenamento: segue só na tela */ }
      mostrarResultado(pedido);
      resultado.setAttribute("tabindex", "-1");
      resultado.focus();
    });

    $("#agenda-novo").addEventListener("click", function () {
      resultado.hidden = true;
      form.hidden = false;
      diaSelecionado = null;
      horaSelecionada = null;
      form.reset();
      desenharCalendario();
      desenharHorarios();
      calDias.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    $("#agenda-apagar").addEventListener("click", function () {
      try { window.localStorage.removeItem(CHAVE); } catch (e) { /* nada a apagar */ }
      resultado.hidden = true;
      form.hidden = false;
      diaSelecionado = null;
      horaSelecionada = null;
      form.reset();
      desenharCalendario();
      desenharHorarios();
    });

    desenharCalendario();
    desenharHorarios();

    /* Se já há um pedido salvo neste navegador, mostra o resumo */
    try {
      var salvo = window.localStorage.getItem(CHAVE);
      if (salvo) {
        var p = JSON.parse(salvo);
        if (p && p.dia && p.hora && p.nome) mostrarResultado(p);
      }
    } catch (e) { /* conteúdo inválido: ignora */ }
  })();

  /* ------------------------------------------------------------------
     Calculadora de prazo
     ------------------------------------------------------------------ */
  (function prazos() {
    var form = $("#form-prazo");
    if (!form) return;
    var inicioEl = $("#prazo-inicio"), diasEl = $("#prazo-dias");
    var erro = $("#prazo-erro"), resultado = $("#prazo-resultado");
    var fimEl = $("#prazo-fim"), explicaEl = $("#prazo-explica"), pulosEl = $("#prazo-pulos");

    inicioEl.value = chave(hoje());
    /* O recesso só faz sentido em dias úteis */
    var recessoEl = form.recesso;
    $$('input[name="tipo"]', form).forEach(function (r) {
      r.addEventListener("change", function () { recessoEl.disabled = form.tipo.value !== "uteis"; });
    });

    function motivo(d, recesso) {
      var f = feriado(d);
      if (f) return f;
      if (fimDeSemana(d)) return d.getDay() === 0 ? "domingo" : "sábado";
      if (recesso && emRecesso(d)) return "recesso forense";
      return null;
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var dias = parseInt(diasEl.value, 10);
      if (!inicioEl.value || isNaN(deChave(inicioEl.value).getTime())) {
        erro.textContent = "Informe a data da publicação ou intimação.";
        erro.hidden = false; resultado.hidden = true; return;
      }
      if (isNaN(dias) || dias < 1 || dias > 365) {
        erro.textContent = "Informe uma quantidade de dias entre 1 e 365.";
        erro.hidden = false; resultado.hidden = true; return;
      }
      erro.hidden = true;
      var uteis = form.tipo.value === "uteis";
      var recesso = uteis && form.recesso.checked;
      var inicio = deChave(inicioEl.value);
      var pulos = [];
      var fim, primeiroDia;

      if (uteis) {
        /* Art. 224: exclui o dia do começo e inclui o do vencimento; a contagem
           começa no primeiro dia útil seguinte (art. 224, §§ 1º e 3º). */
        var d = somaDias(inicio, 1);
        while (!diaUtil(d, recesso)) { pulos.push({ d: d, m: motivo(d, recesso) }); d = somaDias(d, 1); }
        primeiroDia = d;
        var contados = 1;
        while (contados < dias) {
          d = somaDias(d, 1);
          if (diaUtil(d, recesso)) contados++;
          else pulos.push({ d: d, m: motivo(d, recesso) });
        }
        fim = d;
      } else {
        primeiroDia = somaDias(inicio, 1);
        fim = somaDias(inicio, dias);
        /* Art. 224, § 1º: se o vencimento cai em dia sem expediente, prorroga */
        while (fimDeSemana(fim) || feriado(fim)) { pulos.push({ d: fim, m: motivo(fim, false) }); fim = somaDias(fim, 1); }
      }

      fimEl.textContent = fmtLongo.format(fim);
      explicaEl.textContent = (uteis
        ? "Contando " + dias + (dias === 1 ? " dia útil" : " dias úteis") + " a partir de " + fmtCurto.format(inicio) + ": o primeiro dia contado é " + fmtCurto.format(primeiroDia) + " e o último, " + fmtCurto.format(fim) + "."
        : "Contando " + dias + (dias === 1 ? " dia corrido" : " dias corridos") + " a partir de " + fmtCurto.format(inicio) + ", o vencimento cai em " + fmtCurto.format(fim) + ".")
        + (recesso ? " A contagem ficou suspensa entre 20 de dezembro e 20 de janeiro." : "");

      pulosEl.textContent = "";
      /* Agrupa fins de semana e recesso, que seriam muitos itens, e lista cada feriado */
      var feriadosPulados = pulos.filter(function (p) { return p.m && p.m !== "sábado" && p.m !== "domingo" && p.m !== "recesso forense"; });
      var fds = pulos.filter(function (p) { return p.m === "sábado" || p.m === "domingo"; }).length;
      var rec = pulos.filter(function (p) { return p.m === "recesso forense"; }).length;
      function item(texto) { var li = document.createElement("li"); li.textContent = texto; pulosEl.appendChild(li); }
      if (uteis && fds) item(fds + (fds === 1 ? " dia de fim de semana não contado." : " dias de fim de semana não contados."));
      if (!uteis) pulos.filter(function (p) { return p.m === "sábado" || p.m === "domingo"; }).forEach(function (p) { item("O vencimento caiu em " + p.m + ", " + fmtCurto.format(p.d) + ": foi adiado para o dia útil seguinte."); });
      if (rec) item(rec + (rec === 1 ? " dia útil de recesso forense não contado." : " dias úteis de recesso forense não contados."));
      feriadosPulados.forEach(function (p) { item(capitalizar(p.m) + ", em " + fmtCurto.format(p.d) + (uteis ? ", não contado." : ": o vencimento foi adiado.")); });
      if (!pulosEl.children.length) item("Nenhum feriado ou fim de semana interferiu na contagem.");

      resultado.hidden = false;
      resultado.setAttribute("tabindex", "-1");
      resultado.focus();
    });
  })();

  /* ------------------------------------------------------------------
     Busca nos artigos
     ------------------------------------------------------------------ */
  (function artigos() {
    var campo = $("#busca-artigos");
    if (!campo) return;
    var lista = $$("#lista-artigos .artigo"), status = $("#busca-status"), vazio = $("#busca-vazio");
    function normalizar(s) {
      return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }
    var indice = lista.map(function (a) {
      return normalizar(a.textContent + " " + (a.getAttribute("data-tags") || ""));
    });
    function filtrar() {
      var termo = normalizar(campo.value.trim());
      var vistos = 0;
      lista.forEach(function (a, i) {
        var mostra = !termo || indice[i].indexOf(termo) !== -1;
        a.hidden = !mostra;
        if (mostra) vistos++;
      });
      vazio.hidden = vistos !== 0;
      status.textContent = !termo
        ? lista.length + " artigos."
        : (vistos === 0 ? "Nenhum artigo encontrado." : vistos + (vistos === 1 ? " artigo encontrado" : " artigos encontrados") + " para “" + campo.value.trim() + "”.");
    }
    campo.addEventListener("input", filtrar);
  })();
})();
