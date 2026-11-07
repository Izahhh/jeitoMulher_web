// 1. Lista ÚNICA de Produtos (com todos que você pediu)
const products = [
    {
        id: 1,
        name: "Shampoo Revitalizante 300ml",
        description: "Limpeza suave que devolve o brilho natural dos fios.",
        price: 45.90,
        image: "https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7?w=500"
    },
    {
        id: 2,
        name: "Condicionador Nutritivo 300ml",
        description: "Selamento de cutículas e hidratação profunda.",
        price: 49.90,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"
    },
    {
        id: 3,
        name: "Máscara de Hidratação Profunda 250g",
        description: "Tratamento intensivo para cabelos danificados.",
        price: 75.50,
        image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500"
    },
    {
        id: 4,
        name: "Creme de Pentear Definição 200ml",
        description: "Controle de frizz e definição prolongada.",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500"
    },
    {
        id: 5,
        name: "Mousse Modelador 150ml",
        description: "Volume e fixação leve sem ressecar os fios.",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500"
    },
    {
        id: 6,
        name: "Óleo Reparador de Pontas Argan 60ml",
        description: "Brilho intenso e reparação de pontas duplas.",
        price: 54.00,
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500"
    }
];

// Variáveis globais
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
    // Renderiza produtos APENAS se a div existir na página
    if (document.getElementById('product-grid')) {
        renderProducts();
    }
    
    updateAuthUI();
    
    // Agendamento (só se o form existir na página)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
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
    }

    // Eventos de Modais
    if(authBtn) authBtn.addEventListener('click', () => authModal.style.display = 'flex');
    if(closeModal) closeModal.addEventListener('click', () => authModal.style.display = 'none');
    
    if(cartBtn) {
        cartBtn.addEventListener('click', () => {
            updateCartModal();
            cartModal.style.display = 'flex';
        });
    }
    if(closeCart) closeCart.addEventListener('click', () => cartModal.style.display = 'none');

    // Alternar abas Login / Cadastro
    if(tabLogin && tabRegister) {
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
    }

    // Cadastro simulado
    if(registerForm) {
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
    }

    // Login simulado
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const name = email.split('@')[0]; 
            currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            authModal.style.display = 'none';
            updateAuthUI();
            alert('Login efetuado com sucesso!');
            loginForm.reset();
        });
    }

    // Logout
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI();
        });
    }
    
    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
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
    }
});

// Função ÚNICA para renderizar os produtos na tela
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; 

    productGrid.innerHTML = ''; // Limpa a div

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'service-card'; // Usando a classe do seu CSS para ficar bonito
        productCard.style.textAlign = 'center';
        productCard.style.padding = '1.5rem';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem; height: 200px; object-fit: cover;">
            <h3>${product.name}</h3>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem; min-height: 40px;">${product.description}</p>
            <span class="price" style="display: block; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem;">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
            <button class="btn-secondary full-width" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
        `;
        
        productGrid.appendChild(productCard);
    });
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
    if(cartCount) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalCount;
    }
}

// Atualizar Modal do Carrinho
function updateCartModal() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    if (!cartItemsList || !cartTotalPrice) return;

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
            <div class="cart-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div>
                    <strong>${item.name}</strong>
                    <br><small>Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}</small>
                </div>
                <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    }).join('');

    cartTotalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Atualizar interface de autenticação
function updateAuthUI() {
    if (!authBtn || !userInfo || !userGreeting) return;
    
    if (currentUser) {
        authBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userGreeting.textContent = `Olá, ${currentUser.name}`;
    } else {
        authBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}