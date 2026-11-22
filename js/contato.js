
const select = document.getElementById('servico');
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        select.value = tile.dataset.service;
        document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => document.getElementById('nome').focus({ preventScroll: true }), 600);
    });
});

document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const servico = select.value;
    const msg = document.getElementById('mensagem').value;
    const texto = `Olá! Meu nome é ${nome}. Interesse: ${servico}. ${msg}`;
    document.getElementById('whats-link').href = 'https://wa.me/5511987654321?text=' + encodeURIComponent(texto);
    document.getElementById('form-success').classList.add('show');
});
    
