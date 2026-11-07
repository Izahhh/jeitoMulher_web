// Produtos disponíveis na loja
const products = [
    { id: 1, name: "Shampoo Nutritivo Pós-Química 300ml", price: 65.00, icon: "fa-bottle-droplet" },
    { id: 2, name: "Máscara de Hidratação Profunda 250g", price: 89.90, icon: "fa-jar" },
    { id: 3, name: "Óleo Reparador de Pontas Argan 60ml", price: 54.00, icon: "fa-spray-can-sparkles" },
    { id: 4, name: "Protetor Térmico Capilar Spray 150ml", price: 72.00, icon: "fa-wind" }
];

let cart = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Elementos DOM
const authModal = document.getElementById('auth-modal');
const cartModal = document.getElementById('cart-modal');
const authBtn = document.getElementById('auth-btn');
const userInfo = document.getElementById('user-info');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');
const closeModal = document.getElementById('close-modal');
const closeCart = document.getElementById('close-cart');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Só renderiza os produtos se a div existir na página atual
    if (document.getElementById('product-grid')) {
        renderProducts();
    }
    updateAuthUI();
    
    // Só adiciona evento de agendamento se o formulário existir na página
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            // ... seu código de agendamento atual ...
        });
    }
    // Eventos de Modais
    authBtn.addEventListener('click', () => authModal.style.display = 'flex');
    closeModal.addEventListener('click', () => authModal.style.display = 'none');
    
    cartBtn.addEventListener('click', () => {
        updateCartModal();
        cartModal.style.display = 'flex';
    });
    closeCart.addEventListener('click', () => cartModal.style.display = 'none');

    // Alternar abas Login / Cadastro
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Cadastro simulado
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        
        currentUser = { name, email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        authModal.style.display = 'none';
        updateAuthUI();
        alert('Cadastro realizado com sucesso!');
        registerForm.reset();
    });

    // Login simulado
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const name = email.split('@')[0]; // Nome provisório extraído do e-mail
        
        currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        authModal.style.display = 'none';
        updateAuthUI();
        alert('Login efetuado com sucesso!');
        loginForm.reset();
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
    });

    // Agendamento
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Por favor, faça login ou cadastre-se para confirmar o agendamento.');
            authModal.style.display = 'flex';
            return;
        }

        const service = document.getElementById('service-select').value;
        const prof = document.getElementById('professional-select').value;
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;

        alert(`Agendamento confirmado para ${currentUser.name}!\n\nServiço: ${service}\nProfissional: ${prof}\nData: ${date} às ${time}`);
        bookingForm.reset();
    });
});

// Renderizar Produtos na Loja
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                <i class="fa-solid ${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="price">R$ ${product.price.toFixed(2)}</span>
                <button class="btn-primary" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
}

// Adicionar ao Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    alert(`${product.name} adicionado ao carrinho!`);
}

// Atualizar contador do carrinho
function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
}

// Atualizar Modal do Carrinho
function updateCartModal() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotalPrice.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    cartItemsList.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <br><small>Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)}</small>
                </div>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
        `;
    }).join('');

    cartTotalPrice.textContent = `R$ ${total.toFixed(2)}`;
}

// Botão de Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }
    if (!currentUser) {
        alert('Faça login para finalizar sua compra.');
        cartModal.style.display = 'none';
        authModal.style.display = 'flex';
        return;
    }

    alert(`Compra realizada com sucesso, ${currentUser.name}! Obrigado pela preferência.`);
    cart = [];
    updateCartCount();
    cartModal.style.display = 'none';
});

// Atualizar interface de autenticação
function updateAuthUI() {
    if (currentUser) {
        authBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userGreeting.textContent = `Olá, ${currentUser.name}`;
    } else {
        authBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}