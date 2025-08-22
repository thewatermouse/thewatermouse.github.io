const SHEET_ID = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";
const SHEET_BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// Determina a aba com base na página
const page = window.location.pathname.split("/").pop().replace(".html","") || "index";
const sheetName = page === "index" ? "Home" : page.charAt(0).toUpperCase() + page.slice(1);

console.log("🚀 Página atual:", page);
console.log("📄 Nome da aba a ser carregada:", sheetName);

async function loadSheetData(sheet) {
  try {
    const url = `${SHEET_BASE}&sheet=${sheet}`;
    console.log("🌐 Fetching URL:", url);

    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0,-2));
    
    console.log("📊 Dados brutos do Sheets:", json);

    const rows = json.table.rows;

    // Se for Empório, cria grid de produtos
    if(sheet === "Emporio") {
      const container = document.getElementById("produtos");
      if(!container) return;
      container.innerHTML = "";

      rows.forEach(r => {
        if(r.c[0]) {
          const categoria = r.c[0]?.v || "";
          const nome = r.c[1]?.v || "";
          const imagem = r.c[2]?.v || "";
          const preco = r.c[3]?.v || "";
          const descricao = r.c[4]?.v || "";

          console.log("📦 Produto:", {categoria, nome, imagem, preco, descricao});

          const div = document.createElement("div");
          div.className = "produto";
          div.innerHTML = `
            <img src="${imagem}" alt="${nome}">
            <h3>${nome}</h3>
            <p class="preco">${preco}</p>
            <p>${descricao}</p>
            <small>${categoria}</small>
          `;
          container.appendChild(div);
        }
      });
    } else {
      // Para todas as outras páginas
      const data = {};
      rows.forEach(r => {
        const key = r.c[0]?.v;
        const value = r.c[1]?.v;
        if(key && value) {
          data[key] = value;
          console.log("📝 Campo lido:", key, "=", value);
        }
      });

      document.querySelectorAll("[data-content]").forEach(el => {
        const key = el.getAttribute("data-content");
        if(data[key]) {
          el.innerHTML = data[key];
          console.log("✅ Atualizado:", key);
        } else {
          console.warn("⚠️ Campo não encontrado no Sheets:", key);
        }
      });
    }

    console.log("🎉 Dados do Sheets carregados com sucesso!");
  } catch(err) {
    console.error("❌ Erro lendo Google Sheets:", err);
    console.warn("Verifique se o arquivo está público e se o nome da aba está correto.");
  }
}

// Carrega a aba correspondente
loadSheetData(sheetName);
