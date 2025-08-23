// Função genérica para buscar e converter CSV em array de objetos
async function fetchCsvData(url) {
  const res = await fetch(url);
  const text = await res.text();
  const rows = text.split("\n").map(r => r.split(","));
  const headers = rows.shift().map(h => h.trim());
  return rows.map(r => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = r[i] ? r[i].trim() : "");
    return obj;
  });
}

// URLs de cada aba do Google Sheets
const urls = {
  inicio: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=540799331&single=true&output=csv",
  sobre: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=1554737554&single=true&output=csv",
  cardapio: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=1728270825&single=true&output=csv",
  emporio: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=0&single=true&output=csv",
  contato: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=2038291047&single=true&output=csv"
};

// Renderização de acordo com a página
async function renderPage(page) {
  let container = document.getElementById("content");
  container.innerHTML = "Carregando...";

  try {
    const data = await fetchCsvData(urls[page]);

    if (page === "inicio" || page === "sobre") {
      container.innerHTML = data.map(d => `
        <div class="texto-bloco">
          <h2>${d.Titulo || ""}</h2>
          <p>${d.Texto || ""}</p>
          ${d.Imagem ? `<img src="${d.Imagem}" alt="${d.Titulo}">` : ""}
        </div>
      `).join("");
    }

    if (page === "cardapio") {
      container.innerHTML = data.map(d => `
        <div class="cardapio-item">
          <p>${d.Texto || ""}</p>
          ${d.Imagem ? `<img src="${d.Imagem}" alt="Item do cardápio">` : ""}
        </div>
      `).join("");
    }

    if (page === "emporio") {
      container.innerHTML = data.map(d => `
        <div class="produto">
          <h3>${d.Nome || ""}</h3>
          <p>${d.Descricao || ""}</p>
          ${d.Imagem ? `<img src="${d.Imagem}" alt="${d.Nome}">` : ""}
          <p><strong>${d.Preco || ""}</strong></p>
        </div>
      `).join("");
    }

    if (page === "contato") {
      container.innerHTML = data.map(d => `
        <div class="contato-info">
          <h3>${d.Titulo || ""}</h3>
          <p>${d.Valor || ""}</p>
        </div>
      `).join("");
    }

  } catch (err) {
    container.innerHTML = "Erro ao carregar dados.";
    console.error(err);
  }
}
