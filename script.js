// ===== CONFIG =====
const PUBLISHED_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc/pubhtml";

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // Garante Tabletop carregado
  if (typeof Tabletop === "undefined") {
    console.error("Tabletop não encontrado. Verifique a tag <script> do CDN.");
    return;
  }

  Tabletop.init({
    key: PUBLISHED_SHEET_URL,
    simpleSheet: false,
    callback: onDataReady
  });
});

function onDataReady(data, tabletop) {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  if (page === "" || page === "index.html") {
    renderInicio(tabletop);
  } else if (page === "sobre.html") {
    renderSobre(tabletop);
  } else if (page === "cardapio.html") {
    renderCardapio(tabletop);
  } else if (page === "emporio.html") {
    renderEmporio(tabletop);
  } else if (page === "contato.html") {
    renderContato(tabletop);
  }
}

/* ========= Helpers ========= */

function sheetRows(tt, name) {
  const s = tt.sheets(name);
  if (!s) {
    console.warn(`Aba "${name}" não encontrada no Google Sheets.`);
    return [];
  }
  return s.all();
}

function br(value) {
  return (value || "").toString().replace(/\n/g, "<br>");
}

/* ========= Renderers por página ========= */

function renderInicio(tt) {
  // Aba "Inicio": campos livres em (campo | valor)
  const rows = sheetRows(tt, "Inicio");
  const map = {};
  rows.forEach(r => { if (r.campo) map[r.campo.trim().toLowerCase()] = r.valor || ""; });

  const el = document.getElementById("conteudo-inicio");
  if (!el) return;

  const titulo = map.titulo || "Bem-vindo ao Melinda & Julius";
  const subtitulo = map.subtitulo || "";
  const descricao = map.descricao || "";
  const imagem = map.imagem || "";

  el.innerHTML = `
    <div class="content-block">
      <h1 style="margin-top:0">${br(titulo)}</h1>
      ${subtitulo ? `<p class="muted">${br(subtitulo)}</p>` : ""}
      ${imagem ? `<img src="${imagem}" alt="Imagem destaque">` : ""}
      ${descricao ? `<p>${br(descricao)}</p>` : ""}
    </div>
  `;
}

function renderSobre(tt) {
  // Aba "Sobre": (campo | valor) — usar título, texto, imagem
  const rows = sheetRows(tt, "Sobre");
  const map = {};
  rows.forEach(r => { if (r.campo) map[r.campo.trim().toLowerCase()] = r.valor || ""; });

  const el = document.getElementById("conteudo-sobre");
  if (!el) return;

  const titulo = map.titulo || "Sobre nós";
  const texto = map.texto || "";
  const imagem = map.imagem || "";

  el.innerHTML = `
    <div class="content-block">
      <h1 style="margin-top:0">${br(titulo)}</h1>
      ${imagem ? `<img src="${imagem}" alt="Sobre">` : ""}
      ${texto ? `<p>${br(texto)}</p>` : ""}
    </div>
  `;
}

function renderCardapio(tt) {
  // Aba "Cardapio": (texto | imagem) — um ou vários itens
  const rows = sheetRows(tt, "Cardapio");
  const el = document.getElementById("conteudo-cardapio");
  if (!el) return;

  if (!rows.length) {
    el.innerHTML = `<div class="content-block"><p>Nenhum item de cardápio encontrado.</p></div>`;
    return;
  }

  // Se houver só 1 linha, mostra como bloco único grande
  if (rows.length === 1) {
    const r = rows[0];
    el.innerHTML = `
      <div class="content-block">
        ${r.texto ? `<p>${br(r.texto)}</p>` : ""}
        ${r.imagem ? `<img src="${r.imagem}" alt="Cardápio">` : ""}
      </div>
    `;
    return;
  }

  // Senão, renderiza cards
  el.classList.add("grid");
  el.innerHTML = rows.map(r => `
    <div class="card">
      ${r.texto ? `<p>${br(r.texto)}</p>` : ""}
      ${r.imagem ? `<img src="${r.imagem}" alt="Item do cardápio">` : ""}
    </div>
  `).join("");
}

function renderEmporio(tt) {
  // Aba "Emporio": categoria | nome | imagem | preco | descricao
  const rows = sheetRows(tt, "Emporio");
  const el = document.getElementById("conteudo-emporio");
  if (!el) return;

  if (!rows.length) {
    el.innerHTML = `<div class="content-block"><p>Nenhum produto encontrado.</p></div>`;
    return;
  }

  el.classList.add("grid");
  el.innerHTML = rows.map(r => {
    const categoria = r.categoria || "";
    const nome = r.nome || r["nome do produto"] || "";
    const imagem = r.imagem || "";
    const preco = r.preco || r["preço"] || "";
    const descricao = r.descricao || r["descrição"] || "";

    return `
      <div class="product">
        ${categoria ? `<span class="category">${br(categoria)}</span>` : ""}
        <h3>${br(nome)}</h3>
        ${imagem ? `<img src="${imagem}" alt="${nome}">` : ""}
        ${descricao ? `<p class="muted">${br(descricao)}</p>` : ""}
        ${preco ? `<div class="price">${br(preco)}</div>` : ""}
      </div>
    `;
  }).join("");
}

function renderContato(tt) {
  // Aba "Contato": (campo | valor) — título, texto, endereço, etc.
  const rows = sheetRows(tt, "Contato");
  const map = {};
  rows.forEach(r => { if (r.campo) map[r.campo.trim().toLowerCase()] = r.valor || ""; });

  const el = document.getElementById("conteudo-contato");
  if (!el) return;

  const titulo = map.titulo || "Fale com a gente";
  const texto = map.texto || "";

  let extras = "";
  const camposExtras = ["endereco","telefone","email","instagram","whatsapp","horario"];
  camposExtras.forEach(k => {
    if (map[k]) extras += `<p><strong>${capitalize(k)}:</strong> ${br(map[k])}</p>`;
  });

  el.innerHTML = `
    <div class="content-block">
      <h1 style="margin-top:0">${br(titulo)}</h1>
      ${texto ? `<p>${br(texto)}</p>` : ""}
      ${extras}
    </div>
  `;
}

function capitalize(s){ return (s||"").charAt(0).toUpperCase()+ (s||"").slice(1); }
