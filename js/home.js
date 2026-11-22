// Página inicial: slider de serviços e troca automática das imagens do topo

(function () {
    const slider   = document.getElementById('services-slider');
    const track    = slider.querySelector('.slider-track');
    const slides   = slider.querySelectorAll('.slide');
    const dotsBox  = slider.querySelector('.slider-dots');
    const viewport = slider.querySelector('.slider-viewport');
    const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0, perView = 3, maxIndex = 0, timer = null;

    function calc() {
        perView = window.innerWidth >= 992 ? 3 : window.innerWidth >= 640 ? 2 : 1;
        maxIndex = Math.max(0, slides.length - perView);
        slider.style.setProperty('--per-view', perView);
        index = Math.min(index, maxIndex);
        buildDots();
        go(index);
    }
    function buildDots() {
        dotsBox.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
            b.addEventListener('click', () => { go(i); restart(); });
            dotsBox.appendChild(b);
        }
    }
    function go(i) {
        index = i;
        track.style.transform = 'translateX(' + (-index * 100 / perView) + '%)';
        dotsBox.querySelectorAll('button').forEach((d, n) => d.classList.toggle('active', n === index));
    }
    const next = () => go(index >= maxIndex ? 0 : index + 1);
    const prev = () => go(index <= 0 ? maxIndex : index - 1);

    function start() { if (!reduce) timer = setInterval(next, 4000); }
    function stop()  { clearInterval(timer); }
    function restart() { stop(); start(); }

    slider.querySelector('.next').addEventListener('click', () => { next(); restart(); });
    slider.querySelector('.prev').addEventListener('click', () => { prev(); restart(); });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    // Arrastar com o dedo no celular
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
    

(function () {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsBox = document.querySelector('.hero-dots');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0, timer = null;

    slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Mostrar imagem ' + (i + 1));
        b.addEventListener('click', () => { show(i); restart(); });
        dotsBox.appendChild(b);
    });
    const dots = dotsBox.querySelectorAll('button');

    function show(i) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = i;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }
    const next = () => show((current + 1) % slides.length);
    function start() { if (!reduce) timer = setInterval(next, 6000); }
    function restart() { clearInterval(timer); start(); }

    dots[0].classList.add('active');
    start();
})();
    
