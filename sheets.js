// ID da sua planilha
const SHEET_ID = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";
const SHEET_BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// Pega o nome da aba baseado no arquivo HTML
const page = window.location.pathname.split("/").pop().replace(".html","") || "index";
const sheetName = page === "index" ? "Home" : page.charAt(0).toUpperCase() + page.slice(1);

// Função para carregar conteúdo
function loadContent() {
  fetch(`${SHEET_BASE}&sheet=${sheetName}`)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0,-2));
      const rows = json.table.rows;

      if(sheetName === "Emporio") {
        const container = document.getElementById("produtos");
        rows.forEach(r => {
          if (r.c[0]) {
            const categoria = r.c[0]?.v || "";
            const nome = r.c[1]?.v || "";
            const imagem = r.c[2]?.v || "";
            const preco = r.c[3]?.v || "";
            const descricao = r.c[4]?.v || "";

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
        rows.forEach(r => {
          const chave = r.c[0]?.v;
          const valor = r.c[1]?.v;
          const el = document.querySelector(`[data-content="${chave}"]`);
          if(el) el.textContent = valor;
        });
      }
    });
}
loadContent();
