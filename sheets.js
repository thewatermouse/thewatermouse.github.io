document.addEventListener("DOMContentLoaded", function () {
  const publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc/pubhtml";

  Tabletop.init({
    key: publicSpreadsheetUrl,
    simpleSheet: false,
    callback: showInfo
  });

  function showInfo(data, tabletop) {
    const page = window.location.pathname.split("/").pop();

    if (page === "index.html" || page === "") {
      const inicio = tabletop.sheets("Inicio").all();
      inicio.forEach(item => {
        document.getElementById("titulo").innerText = item.titulo;
        document.getElementById("descricao").innerText = item.descricao;
        document.getElementById("imagem").src = item.imagem;
      });
    }

    if (page === "sobre.html") {
      const sobre = tabletop.sheets("Sobre").all();
      sobre.forEach(item => {
        document.getElementById("titulo").innerText = item.titulo;
        document.getElementById("texto").innerText = item.texto;
        document.getElementById("imagem").src = item.imagem;
      });
    }

    if (page === "cardapio.html") {
      const cardapio = tabletop.sheets("Cardapio").all();
      const container = document.getElementById("cardapio");
      cardapio.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card-item");
        div.innerHTML = `
          <h2>${item.texto}</h2>
          <img src="${item.imagem}" alt="Prato">
        `;
        container.appendChild(div);
      });
    }

    if (page === "emporio.html") {
      const emporio = tabletop.sheets("Emporio").all();
      const container = document.getElementById("emporio");
      emporio.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("produto");
        div.innerHTML = `
          <h3>${item.categoria} - ${item.nome}</h3>
          <img src="${item.imagem}" alt="${item.nome}">
          <p>${item.descricao}</p>
          <p><strong>Preço:</strong> ${item.preco}</p>
        `;
        container.appendChild(div);
      });
    }

    if (page === "contato.html") {
      const contato = tabletop.sheets("Contato").all();
      contato.forEach(item => {
        document.getElementById("titulo").innerText = item.titulo;
        document.getElementById("texto").innerText = item.texto;
      });
    }
  }
});
