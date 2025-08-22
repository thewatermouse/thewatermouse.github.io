// ID da sua planilha
const SHEET_ID = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";

// Mapeamento de abas por página
const SHEET_TABS = {
  "index.html": "Home",
  "cardapio.html": "Emporio",
  "emporio.html": "Emporio",
  "contato.html": "Contato",
  "sobre.html": "Sobre"
};

// Função para pegar nome do arquivo atual
function getCurrentPage() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1) || "index.html";
}

// Função para buscar dados de uma aba do Google Sheets
async function fetchSheetData(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const response = await fetch(url);
  const text = await response.text();

  // Remove o prefixo/sufixo que o Google coloca
  const json = JSON.parse(text.substring(47).slice(0, -2));
  return json.table.rows.map(row => row.c.map(cell => (cell ? cell.v : "")));
}

// Função para carregar textos comuns (campo/valor)
async function loadTexts(sheetName) {
  try {
    const data = await fetchSheetData(sheetName);
    data.forEach(row => {
      const [campo, valor] = row;
      const el = document.getElementById(campo);
      if (el) el.innerHTML = valor;
    });
  } catch (err) {
    console.error("Erro ao carregar textos:", err);
  }
}

// Função para carregar produtos do Empório/Cardápio
async function loadProducts(sheetName) {
  try {
    const data = await fetchSheetData(sheetName);
    const container = document.getElementById("products-container");
    if (!container) return;

    let html = "";
    let currentCategory = "";

    data.forEach(row => {
      const [categoria, nome, imagem, preco, descricao] = row;

      if (categoria && categoria !== currentCategory) {
        if (currentCategory !== "") html += "</div>";
        currentCategory = categoria;
        html += `<h2 class="category-title">${categoria}</h2><div class="category">`;
      }

      html += `
        <div class="product-card">
          <img src="${imagem}" alt="${nome}">
          <h3>${nome}</h3>
          <p class="price">R$ ${preco}</p>
          <p class="description">${descricao}</p>
        </div>
      `;
    });

    if (currentCategory !== "") html += "</div>";
    container.innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", async () => {
  const page = getCurrentPage();
  const sheetName = SHEET_TABS[page];

  if (!sheetName) return;

  if (sheetName === "Emporio") {
    await loadProducts(sheetName);
  } else {
    await loadTexts(sheetName);
  }
});
