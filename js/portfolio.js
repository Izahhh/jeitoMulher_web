// Carrossel do portfólio (avança de 3 em 3)

// Slider "de 3 em 3": cada clique/avanço automático troca a página inteira
(function () {
    const slider   = document.getElementById('work-slider');
    const track    = slider.querySelector('.slider-track');
    const slides   = slider.querySelectorAll('.slide');
    const dotsBox  = slider.querySelector('.slider-dots');
    const viewport = slider.querySelector('.slider-viewport');
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let page = 0, perView = 3, pages = 1, timer = null;

    function calc() {
        perView = window.innerWidth >= 992 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        pages = Math.ceil(slides.length / perView);
        slider.style.setProperty('--per-view', perView);
        page = Math.min(page, pages - 1);
        dotsBox.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', 'Ir para a página ' + (i + 1));
            b.addEventListener('click', () => { go(i); restart(); });
            dotsBox.appendChild(b);
        }
        go(page);
    }
    function go(p) {
        page = p;
        track.style.transform = 'translateX(' + (-page * 100) + '%)';
        dotsBox.querySelectorAll('button').forEach((d, n) => d.classList.toggle('active', n === page));
    }
    const next = () => go(page >= pages - 1 ? 0 : page + 1);
    const prev = () => go(page <= 0 ? pages - 1 : page - 1);
    function start() { if (!reduce) timer = setInterval(next, 5000); }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    slider.querySelector('.next').addEventListener('click', () => { next(); restart(); });
    slider.querySelector('.prev').addEventListener('click', () => { prev(); restart(); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    let startX = 0;
    viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    viewport.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
        start();
    });

    window.addEventListener('resize', calc);
    calc();
    start();
})();
    
