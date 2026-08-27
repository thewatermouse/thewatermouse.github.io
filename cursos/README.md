# Fotos dos cursos — cursos.html

Solte aqui as fotos reais com **exatamente estes nomes**. Assim que o arquivo
existir, ele aparece no site automaticamente (sem mexer no código). Enquanto o
arquivo não existir, o site mostra uma foto stock de fallback — nunca quebra.

Formato: `.jpg`, ~800px de largura, sem base64 (regra do repo).
Cada curso tem 1 foto **hero** (topo) + 3 fotos de **carrossel**.

| Curso | Tema | hero | carrossel |
|---|---|---|---|
| 1 | Introdução à Macrobiótica | `curso1-hero.jpg` | `curso1-1.jpg` `curso1-2.jpg` `curso1-3.jpg` |
| 2 | Culinária Natural para o Dia a Dia | `curso2-hero.jpg` | `curso2-1.jpg` `curso2-2.jpg` `curso2-3.jpg` |
| 3 | Fermentados: Missô, Chucrute e Kombucha | `curso3-hero.jpg` | `curso3-1.jpg` `curso3-2.jpg` `curso3-3.jpg` |
| 4 | Sustentabilidade e Consumo Consciente | `curso4-hero.jpg` | `curso4-1.jpg` `curso4-2.jpg` `curso4-3.jpg` |
| 5 | Yoga e Alimentação Consciente | `curso5-hero.jpg` | `curso5-1.jpg` `curso5-2.jpg` `curso5-3.jpg` |
| 6 | Pães Integrais e Sem Glúten | `curso6-hero.jpg` | `curso6-1.jpg` `curso6-2.jpg` `curso6-3.jpg` |

Quando **todas** as 24 fotos reais estiverem aqui, dá pra remover os fallbacks
`onerror` do `cursos.html` (tira a dependência externa do Unsplash) — é só pedir.
