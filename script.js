const sheetID = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=`;

// Função genérica para carregar conteúdo
async function carregarConteudo(aba, elementoId) {
  const url = `${base}${aba}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    let html = "";
    if (aba === "Emporio") {
      json.table.rows.forEach(row => {
        const categoria = row.c[0]?.v || "";
        const nome = row.c[1]?.v || "";
        const img = row.c[2]?.v || "";
        const preco = row.c[3]?.v || "";
        const desc = row.c[4]?.v || "";
        html += `
          <div class="produto">
            <h3>${categoria} - ${nome}</h3>
            <img src="${img}" alt="${nome}">
            <p><strong>Preço:</strong> ${preco}</p>
            <p>${desc}</p>
          </div>
        `;
      });
    } else if (aba === "Cardapio") {
      json.table.rows.forEach(row => {
        const texto = row.c[0]?.v || "";
        const img = row.c[1]?.v || "";
        html += `
          <div class="item-cardapio">
            <p>${texto}</p>
            <img src="${img}" alt="Imagem do cardápio">
          </div>
        `;
      });
    } else {
      json.table.rows.forEach(row => {
        const campo = row.c[0]?.v || "";
        const valor = row.c[1]?.v || "";
        html += `<p><strong>${campo}:</strong> ${valor}</p>`;
      });
    }

    document.getElementById(elementoId).innerHTML = html;
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    document.getElementById(elementoId).innerHTML = "<p>Erro ao carregar conteúdo.</p>";
  }
}
