// Animação de entrada dos elementos ao rolar a página

// Anima os elementos ao entrarem na tela
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.2 });
    items.forEach(el => io.observe(el));
} else {
    items.forEach(el => el.classList.add('visible'));
}
    
