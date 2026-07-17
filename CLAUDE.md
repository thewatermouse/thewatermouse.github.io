# CLAUDE.md — Site Melinda & Julius

Contexto do projeto para o Claude Code. Leia antes de qualquer alteração.

## Sobre o projeto

Site institucional do **Melinda & Julius** — restaurante macrobiótico, empório
(mercearia orgânica) e livraria, desde 2006. Endereço: Rua Dom Armando
Lombardi, 511 — Caxingui, São Paulo/SP.

Marca com forte apelo de sustentabilidade — esses temas guiam copy e design.

## Stack & convenções

- **HTML/CSS/JS puro.** Sem frameworks, sem build tools. Não introduzir React,
  npm, etc.
- **Hospedagem:** GitHub Pages (`thewatermouse/thewatermouse.github.io`,
  branch `main`). Deploy = push na `main` (~1 min pra republicar).
- **CMS:** Google Sheets publicado em CSV, consumido por `script.js`
  (`renderEmporio` etc.).
- **GTM:** GTM-PMT8HCLV · **Formspree:** `xblkndze` · **Geocoding:** Nominatim.
- **Design system:** Playfair Display (títulos), Lora (corpo), DM Sans (UI);
  verde-escuro, terracota, creme; classes utilitárias `reveal`,
  `section-label`, `section-title`.

### Regras importantes
- **NUNCA** embutir imagens em base64 no HTML (já quebrou deploy). Sempre
  arquivos referenciados por nome.
- Contatos corretos (não alterar sem pedido):
  - WhatsApp **+55 11 98476-0015** → `https://wa.me/5511984760015`
  - Catálogo WhatsApp: `https://wa.me/c/5511984760015`
  - Empório **seg–sáb 8h–16h**; Restaurante **seg–sáb 12h–15h**.

## Catálogo de produtos

`meta_import_final.csv` na raiz = catálogo WhatsApp/Meta (319 produtos, 16
categorias oficiais): Barras & Snacks, Temperos & Especiarias, Grãos Cereais &
Sementes, Incensos & Aromas, Farinhas Amidos & Panificação, Molhos &
Condimentos, Suplementos & Saúde, Biscoitos & Crackers, Cosméticos & Higiene,
Óleos & Gorduras, Chás & Infusões, Chocolates & Cacau, Limpeza, Massas,
Conservas & Antepastos, Oleaginosas.

Imagens de produto: `imagens_produtos/{id}.jpg`. Imagens de categoria: jpgs na
raiz (`graos_cereais_sementes.jpg` etc.), usadas no grid de seções da
`emporio.html`.


## Qualidade de dados do catálogo (importante)

- `custom_label_0` sub-tagueado: só 5 "Sem Gluten" declarados; ~60 candidatos
  fortes aguardando validação da loja (ver `validacao-sem-gluten.csv`).
  Não anunciar filtro sem glúten antes dessa validação.
- Campo `brand` tem fallback errado: 12 produtos marcados "Melinda & Julius"
  são de outras marcas (Tapibrownie, Kenko, Ufe...). Não tratar como marca
  própria.
- Análise completa de preços e arquitetura de cestas em
  `analise-catalogo-cestas.md` (fora do repo, com o Digo).

## Tarefas

### 1. [ALTA · PENDENTE] Webhook de delivery
`cardapio.html` linha 143: trocar `SEU_SCRIPT_ID` pela URL real do Apps Script
(`.../exec`) fornecida pelo Digo. O form envia POST com:
`nome, telefone, email, endereco, distancia_km, data`.

Apps Script esperado (planilha com aba `Leads`):
```javascript
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    aba.appendRow([dados.data, dados.nome, dados.telefone,
                   dados.email, dados.endereco, dados.distancia_km]);
    return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status:'erro', msg:err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
Publicar: Implantar → App da Web → Executar como "Eu" → Acesso "Qualquer pessoa".

### 2. [MÉDIA · PENDENTE] Fotos reais na cursos.html
Substituir placeholders comentados (`<!-- FOTO HERO -->`, `<!-- FOTO 1/2/3 -->`)
por `<img>`/backgrounds com arquivos reais fornecidos pelo Digo. Sem base64.

### 3. [MÉDIA · EXTERNA] Domínio melindaejulius.com.br
Registrar no registro.br (ação manual do Digo). Depois: criar arquivo `CNAME`
na raiz com o domínio + orientar registros DNS (A do GitHub Pages + CNAME www).
**Não criar o CNAME antes do domínio estar registrado e configurado.**

### 4. [BAIXA · EXTERNA] Nuvemshop em loja.melindaejulius.com.br
Depende da tarefa 3. Plataforma configurada pelo Digo; no repo, apenas linkar
a loja a partir da `emporio.html` quando existir.

### 5. [FEITA ✅] Botão da cesta → WhatsApp
O CTA "Quero minha cesta" (seção "Feira Orgânica na sua porta" da
`emporio.html`) apontava pra `contato.html`; agora abre conversa direta no
WhatsApp (`wa.me/5511984760015` com mensagem pré-preenchida sobre a cesta
orgânica), em nova aba.

### 6. [FEITA ✅] Feed do Merchant Center
`merchant-feed.csv` na raiz do repo: cópia do `meta_import_final.csv` (319
produtos) com a coluna `link` preenchida com
`https://thewatermouse.github.io/emporio.html` em todas as linhas. Serve o
Google Merchant Center via busca programada na URL pública
`https://thewatermouse.github.io/merchant-feed.csv` (listagens gratuitas —
ver kit operacional, Parte 3).

### 7. [FEITA ✅] Grid visual de categorias no empório
`emporio.html` ganhou a seção `.emporio-cats-section` ("Explore o empório")
com 14 cards de categoria usando as imagens da raiz, todos linkando pro
catálogo do WhatsApp. CSS em `style.css` (final do arquivo). A `cats-bar` do
header já listava as ~23 categorias em texto.

## Fluxo de trabalho
1. Alterar arquivos conforme pedido.
2. `git add` + commit descritivo + push na `main`.
3. Confirmar republicação do Pages.
