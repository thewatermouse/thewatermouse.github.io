// Carrega o menu fixo em todas as páginas
fetch('menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu').innerHTML = html;

    // Marcar link ativo
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      }
    });
  });
