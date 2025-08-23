const SHEET_ID = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";
const BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=`;

// Mapear os GIDs de cada aba
const PAGES = {
  "inicio-content": "540799331",
  "sobre-content": "1554737554",   // substitua pelo GID real da aba "Sobre"
  "cardapio-content": "1728270825", // substitua pelo GID real da aba "Cardápio"
  "emporio-content": "0", // GID da aba "Empório"
};

// Renderização
async function loadContent(id, gid) {
  try {
    const res = await fetch(BASE + gid);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0,-2));
    const rows = json.table.rows;

    let html = "";

    if (id === "emporio-content") {
      rows.forEach(r => {
        if (r.c[0] && r.c[1] && r.c[2]) {
          html += `
            <div class="product-card">
              <img src="${r.c[2].v}" alt="${r.c[1].v}">
              <h3>${r.c[1].v}</h3>
              <p>${r.c[4]?.v || ""}</p>
              <strong>${r.c[3]?.v || ""}</strong>
            </div>
          `;
        }
      });
    } else if (id === "cardapio-content") {
      rows.forEach(r => {
        if (r.c[0]) {
          html += `
            <div class="product-card">
              <p>${r.c[0].v}</p>
              ${r.c[1] ? `<img src="${r.c[1].v}" alt="">` : ""}
            </div>
          `;
        }
      });
    } else {
      rows.forEach(r => {
        if (r.c[0] && r.c[1]) {
          html += `<p><strong>${r.c[0].v}:</strong> ${r.c[1].v}</p>`;
        }
      });
    }

    document.getElementById(id).innerHTML = html;

  } catch (e) {
    console.error("Erro carregando conteúdo:", e);
    document.getElementById(id).innerHTML = "<p>Erro ao carregar conteúdo.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Object.entries(PAGES).forEach(([id,gid]) => {
    if (document.getElementById(id)) {
      loadContent(id, gid);
    }
  });
});
