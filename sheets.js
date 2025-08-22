const sheetId = "15nxHrFuoDs5yw9wQK43kh3BhCCsg0cPUtfk6pesCRJc";
const apiKey = "AIzaSyDVWzA6oj1l32GubPuxPjQF3z3aw";
const urlBase = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/`;

async function carregarConteudo() {
  try {
    // 🔹 Abas que seguem o padrão "campo/valor"
    const abasFixas = ["Home", "Sobre", "Contato", "Emporio"];
    for (let aba of abasFixas) {
      await carregarPagina(aba);
    }

    // 🔹 Cardápio (dinâmico por categorias)
    await carregarCardapio();

  } catch (e) {
    console.error("Erro geral:", e);
  }
}

async function carregarPagina(aba) {
  const url = `${urlBase}${aba}?key=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();

  if (!data.values) return;

  // Se for Empório, usa lógica especial
  if (aba === "Emporio") {
    preencherEmporio(data.values);
    return;
  }

  // Caso contrário, usa campo/valor
  data.values.slice(1).forEach(([campo, valor]) => {
    const el = document.querySelector(`[data-content="${campo.toLowerCase()}_${aba.toLowerCase()}"]`);
    if (el) {
      el.innerText = valor;
    }
  });
}

async function carregarCardapio() {
  const url = `${urlBase}Cardapio?key=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();

  if (!data.values) return;

  const cabecalhos = data.values[0];
  const linhas = data.values.slice(1);

  // Estrutura: { Categoria: [ {nome, descricao, preco}, ... ] }
  const categorias = {};

  linhas.forEach(linha => {
    const item = {};
    cabecalhos.forEach((col, i) => {
      item[col] = linha[i] || "";
    });

    if (!categorias[item.Categoria]) {
      categorias[item.Categoria] = [];
    }
    categorias[item.Categoria].push(item);
  });

  const container = document.querySelector("main.container");
  container.innerHTML = ""; // limpa antes

  Object.entries(categorias).forEach(([categoria, itens]) => {
    const section = document.createElement("section");
    section.classList.add("categoria");

    const titulo = document.createElement("h2");
    titulo.innerText = categoria;
    section.appendChild(titulo);

    const grid = document.createElement("div");
    grid.classList.add("grid-produtos");

    itens.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("produto");

      card.innerHTML = `
        <h3>${item.Nome}</h3>
        <p class="descricao">${item.Descricao.replace(/\\n/g, "<br>")}</p>
        <p class="preco">${item.Preco}</p>
      `;

      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function preencherEmporio(valores) {
  const cabecalhos = valores[0];
  const linhas = valores.slice(1);
  const container = document.getElementById("emporio");
  if (!container) return;

  container.innerHTML = "";

  linhas.forEach(linha => {
    const item = {};
    cabecalhos.forEach((col, i) => {
      item[col] = linha[i] || "";
    });

    const card = document.createElement("div");
    card.classList.add("produto");

    card.innerHTML = `
      <h3>${item.Nome}</h3>
      <p class="descricao">${item.Descricao.replace(/\\n/g, "<br>")}</p>
      <p class="preco">${item.Preco}</p>
    `;

    container.appendChild(card);
  });
}

carregarConteudo();
