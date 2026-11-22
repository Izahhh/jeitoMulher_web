
const buttons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.treat-card');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let i = 0;
        cards.forEach(card => {
            const show = filter === 'all' || card.dataset.cat === filter;
            card.classList.toggle('is-hidden', !show);
            if (show) {
                // reinicia a animação de entrada com pequeno atraso escalonado
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = '';
                card.style.animationDelay = (i++ * 0.06) + 's';
            }
        });
    });
});
    
