const sheetID = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

function carregarConteudo(aba, elementoId) {
  const query = encodeURIComponent("SELECT A,B");
  const url = `${base}&sheet=${aba}&tq=${query}`;

  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const data = JSON.parse(rep.substr(47).slice(0, -2));
      let html = "";
      data.table.rows.forEach(row => {
        const campo = row.c[0]?.v;
        const valor = row.c[1]?.v;
        if (campo && valor) {
          if (campo.toLowerCase().includes("imagem")) {
            html += `<img src="${valor}" alt="">`;
          } else {
            html += `<p>${valor}</p>`;
          }
        }
      });
      document.getElementById(elementoId).innerHTML = html;
    })
    .catch(err => {
      console.error("Erro ao carregar dados:", err);
      document.getElementById(elementoId).innerHTML = "Erro ao carregar conteúdo.";
    });
}

function carregarEmporio(aba, elementoId) {
  const query = encodeURIComponent("SELECT A,B,C,D,E");
  const url = `${base}&sheet=${aba}&tq=${query}`;

  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const data = JSON.parse(rep.substr(47).slice(0, -2));
      let categorias = {};

      data.table.rows.forEach(row => {
        const categoria = row.c[0]?.v;
        const nome = row.c[1]?.v;
        const imagem = row.c[2]?.v;
        const preco = row.c[3]?.v;
        const descricao = row.c[4]?.v;

        if (!categoria || !nome) return;
        if (!categorias[categoria]) categorias[categoria] = [];

        categorias[categoria].push({ nome, imagem, preco, descricao });
      });

      let html = "";
      for (const categoria in categorias) {
        html += `<h2>${categoria}</h2><div class="produtos">`;
        categorias[categoria].forEach(produto => {
          html += `
            <div class="produto">
              <img src="${produto.imagem}" alt="${produto.nome}">
              <h3>${produto.nome}</h3>
              <p>${produto.descricao || ""}</p>
              <strong>${produto.preco || ""}</strong>
            </div>
          `;
        });
        html += "</div>";
      }

      document.getElementById(elementoId).innerHTML = html;
    })
    .catch(err => {
      console.error("Erro ao carregar dados:", err);
      document.getElementById(elementoId).innerHTML = "Erro ao carregar produtos.";
    });
}

// Monta o menu dinamicamente
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.innerHTML = `
      <a href="index.html">Início</a>
      <a href="sobre.html">Sobre</a>
      <a href="cardapio.html">Cardápio</a>
      <a href="emporio.html">Empório</a>
      <a href="contato.html">Contato</a>
    `;
  }
});
