/* ====== CONFIG: links CSV de cada aba ====== */
const CSV_URLS = {
  inicio:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=540799331&single=true&output=csv",
  sobre:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=1554737554&single=true&output=csv",
  cardapio:"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=1728270825&single=true&output=csv",
  emporio: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=0&single=true&output=csv",
  contato: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6QflR93iZW68-D16QlTyZNGZzimz83XofgiWe4JvFRWPE1dPQi0H6wVQW1yCy-ubRI-xkN-CZWiS7/pub?gid=2038291047&single=true&output=csv"
};

/* ====== CSV parser robusto (suporta aspas e vírgulas) ====== */
function parseCSV(text){
  const rows=[]; let row=[], cur='', inQuotes=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], next=text[i+1];
    if(c==='\"'){
      if(inQuotes && next==='\"'){ cur+='\"'; i++; }
      else { inQuotes=!inQuotes; }
    } else if(c===',' && !inQuotes){
      row.push(cur); cur='';
    } else if((c==='\n' || c==='\r') && !inQuotes){
      if(cur!=='' || row.length){ row.push(cur); rows.push(row); row=[]; cur=''; }
      // pular \r\n
      if(c==='\r' && next==='\n'){ i++; }
    } else {
      cur+=c;
    }
  }
  if(cur!=='' || row.length){ row.push(cur); rows.push(row); }
  // headers
  const headers = rows.shift().map(h => h.trim());
  return rows
    .filter(r => r.some(v => (v||'').trim()!=='')) // ignora linhas vazias
    .map(r => {
      const obj={};
      headers.forEach((h,idx)=> obj[h]= (r[idx]||'').trim());
      return obj;
    });
}

/* ====== Util ====== */
function br(s){ return (s||'').replace(/\n/g,'<br>'); }
function $(id){ return document.getElementById(id); }

/* ====== Loader genérico com debug ====== */
async function carregarCSV(url, pageKey, containerId, renderer){
  const el = $(containerId);
  if(!el){ console.error(`❌ container #${containerId} não encontrado`); return; }
  el.innerHTML = 'Carregando...';

  console.log(`🔎 [${pageKey}] Fetch →`, url);
  try{
    const res = await fetch(url, { cache: "no-store" });
    console.log(`✅ [${pageKey}] HTTP status:`, res.status);
    const text = await res.text();
    console.log(`📄 [${pageKey}] CSV (primeiros 300 chars):`, text.slice(0,300));
    const data = parseCSV(text);
    console.log(`🧾 [${pageKey}] Objetos parseados:`, data);
    renderer(data, el);
    console.log(`🎯 [${pageKey}] Render OK`);
  }catch(err){
    console.error(`💥 [${pageKey}] Erro no fetch/parse:`, err);
    el.innerHTML = 'Erro ao carregar dados.';
  }
}

/* ====== Renderers ====== */
function renderInicio(data, el){
  // Espera: Titulo | Texto | Imagem (várias linhas possíveis)
  if(!data.length){ el.innerHTML='<p>Nenhum conteúdo.</p>'; return; }
  el.innerHTML = data.map(d => `
    <div class="texto-bloco">
      ${d.Titulo ? `<h2>${br(d.Titulo)}</h2>`:''}
      ${d.Texto ? `<p>${br(d.Texto)}</p>`:''}
      ${d.Imagem ? `<img src="${d.Imagem}" alt="">`:''}
    </div>
  `).join('');
}
function renderSobre(data, el){
  if(!data.length){ el.innerHTML='<p>Nenhum conteúdo.</p>'; return; }
  el.innerHTML = data.map(d => `
    <div class="texto-bloco">
      ${d.Titulo ? `<h2>${br(d.Titulo)}</h2>`:''}
      ${d.Texto ? `<p>${br(d.Texto)}</p>`:''}
      ${d.Imagem ? `<img src="${d.Imagem}" alt="">`:''}
    </div>
  `).join('');
}
function renderCardapio(data, el){
  // Espera: Texto | Imagem
  if(!data.length){ el.innerHTML='<p>Nenhum item no cardápio.</p>'; return; }
  el.innerHTML = data.map(d => `
    <div class="cardapio-item">
      ${d.Texto ? `<p>${br(d.Texto)}</p>`:''}
      ${d.Imagem ? `<img src="${d.Imagem}" alt="">`:''}
    </div>
  `).join('');
}
function renderEmporio(data, el){
  // Espera colunas: Imagem | Nome | Descricao | Preco
  if(!data.length){ el.innerHTML='<p>Nenhum produto.</p>'; return; }
  el.classList.add('emporio-grid');
  el.innerHTML = data.map(d => `
    <div class="produto">
      ${d.Imagem ? `<img src="${d.Imagem}" alt="${d.Nome||''}">`:''}
      ${d.Nome ? `<h3>${br(d.Nome)}</h3>`:''}
      ${d.Descricao ? `<p>${br(d.Descricao)}</p>`:''}
      ${d.Preco ? `<p><strong>${br(d.Preco)}</strong></p>`:''}
    </div>
  `).join('');
}
function renderContato(data, el){
  // Espera: Titulo | Valor (várias linhas com infos)
  if(!data.length){ el.innerHTML='<p>—</p>'; return; }
  el.innerHTML = data.map(d => `
    <div class="texto-bloco">
      ${d.Titulo ? `<h3>${br(d.Titulo)}</h3>`:''}
      ${d.Valor ? `<p>${br(d.Valor)}</p>`:''}
    </div>
  `).join('');
}

/* ====== Bootstrap por página ====== */
document.addEventListener('DOMContentLoaded', () => {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  console.log('📍 Página atual:', page);

  if(page==='index.html' || page===''){
    carregarCSV(CSV_URLS.inicio, 'inicio', 'content', renderInicio);
  } else if(page==='sobre.html'){
    carregarCSV(CSV_URLS.sobre, 'sobre', 'content', renderSobre);
  } else if(page==='cardapio.html'){
    carregarCSV(CSV_URLS.cardapio, 'cardapio', 'content', renderCardapio);
  } else if(page==='emporio.html'){
    carregarCSV(CSV_URLS.emporio, 'emporio', 'content', renderEmporio);
  } else if(page==='contato.html'){
    carregarCSV(CSV_URLS.contato, 'contato', 'content', renderContato);
  }
});
