const modal = document.getElementById("userModal");
const btns = document.querySelectorAll(".buy-btn");
const span = document.querySelector(".close-modal");
const userInput = document.getElementById("mcUsername");
const userHead = document.getElementById("userHead");
const btnContinue = document.getElementById("btnContinue");
const bedrockCheck = document.getElementById("bedrockCheck");
const toast = document.getElementById("customToast");
const toastMsg = document.getElementById("toastMessage");
const loginLink = document.querySelector(".login-link");
let cart = [];
const cartInfo = document.querySelector(".cart-info");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const cartCountElement = document.querySelector(".cart-count");
const paymentModal = document.getElementById("paymentModal");
const successModal = document.getElementById("successModal");
const btnCheckout = document.getElementById("btnCheckout");
const closePayment = document.getElementById("closePayment");

document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("mcUser");
    if (savedUser) {
        setLoggedUser(savedUser);
    }
});

function setLoggedUser(username) {
    document.querySelector(".guest-text").innerText = username;
    document.querySelector(".mini-head").src = `https://mc-heads.net/avatar/${username}/32`;
    document.querySelector(".cart-title").innerText = `Carro de ${username}`;
    document.querySelector(".login-link").innerText = "CAMBIAR DE PERSONAJE";
}

btns.forEach(btn => {
    btn.onclick = () => {
        modal.style.display = "block";
    };
});

if (span) {
    span.onclick = () => {
        modal.style.display = "none";
    };
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

loginLink.onclick = (e) => {
    e.preventDefault();
    modal.style.display = "block";
};


userInput.oninput = function() {
    let username = this.value.trim();
    
    if (username.length > 2) {
        userHead.src = `https://mc-heads.net/avatar/${username}/50`;
    } else {
        userHead.src = `https://mc-heads.net/avatar/385/50`;
    }
};

btnContinue.onclick = () => {
    let username = userInput.value.trim();
    if (username !== "") {
        localStorage.setItem("mcUser", username); 
        setLoggedUser(username);
        modal.style.display = "none";
        showNotification(username);
    }
};

function showNotification(user) {
    toastMsg.innerText = `Tu paquete ${user} fue llenado al carrito`;
    toast.classList.add("active");
    
    setTimeout(() => {
        toast.classList.remove("active");
    }, 4000);
}

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
    item.onclick = (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
        
        console.log("Cambiando a categoría: " + item.innerText.trim());
    };
});

const productsData = {
    divinos: [
        { name: "ZEUS", price: "25.00", tag: "PERMANENTE", type: "god", btn: "COMPRAR PODER" },
        { name: "APOLO", price: "15.00", tag: "MENSUAL", type: "god", btn: "HEREDAR LUZ" }
    ],
    titanes: [
        { name: "CRONOS", price: "25.00", tag: "PERMANENTE", type: "titan", btn: "DESATAR CAOS" },
        { name: "ATLAS", price: "12.00", tag: "MENSUAL", type: "titan", btn: "CARGAR MUNDO" }
    ],
    llaves: [
        { name: "KEY OLIMPO", price: "5.00", tag: "X5 LLAVES", type: "god", btn: "PROBAR SUERTE" }
    ]
};

const productsContainer = document.getElementById("productsContainer");

function renderProducts(category) {
    productsContainer.innerHTML = "";
    
    const products = productsData[category] || [];
    
    products.forEach(p => {
        const card = document.createElement("div");
        card.className = `product-card ${p.type} fade-in`; 
        card.innerHTML = `
            <div class="card-tag">${p.tag}</div>
            <div class="card-body">
                <h3>${p.name}</h3>
                <p class="price">${p.price} <span>USD</span></p>
            </div>
            <button class="buy-btn">${p.btn}</button>
        `;
        productsContainer.appendChild(card);
    });

    attachBuyEvents();
}

navItems.forEach(item => {
    item.onclick = (e) => {
        e.preventDefault();
        const category = item.getAttribute("data-category");
        
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
        
        renderProducts(category);
    };
});

function attachBuyEvents() {
    const newBtns = document.querySelectorAll(".buy-btn");
    newBtns.forEach(btn => {
        btn.onclick = () => modal.style.display = "block";
    });
}

renderProducts("divinos");

cartInfo.onclick = () => {
    updateCartUI();
    cartModal.style.display = "block";
};

closeCart.onclick = () => cartModal.style.display = "none";

function addToCart(productName, price) {
    const currentUser = document.querySelector(".guest-text").innerText;
    
    if (currentUser === "Invitado") {
        modal.style.display = "block"; 
        return;
    }

    cart.push({ name: productName, price: parseFloat(price) });
    
    showNotification(`¡${productName}`);
    updateCartUI();
}

function updateCartUI() {
    cartCountElement.innerText = cart.length;
    
    const cartStatus = document.querySelector(".cart-status");
    cartStatus.innerText = cart.length > 0 ? `${cart.length} ARTÍCULO(S)` : "CARRO VACÍO";

    cartItemsList.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="color: #666; margin: 20px 0;">Tu carro está esperando ser llenado...</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item fade-in";
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.price.toFixed(2)} USD</span>
                </div>
                <i class="fas fa-trash-alt remove-item" onclick="removeFromCart(${index})"></i>
            `;
            cartItemsList.appendChild(itemDiv);
        });
    }

    cartTotalPrice.innerText = `${total.toFixed(2)} USD`;
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

function renderProducts(category) {
    productsContainer.innerHTML = "";
    const products = productsData[category] || [];
    
    products.forEach(p => {
        const card = document.createElement("div");
        card.className = `product-card ${p.type} fade-in`; 
        card.innerHTML = `
            <div class="card-tag">${p.tag}</div>
            <div class="card-body">
                <h3>${p.name}</h3>
                <p class="price">${p.price} <span>USD</span></p>
            </div>
            <button class="buy-btn" onclick="addToCart('${p.name}', '${p.price}')">${p.btn}</button>
        `;
        productsContainer.appendChild(card);
    });
}

btnCheckout.onclick = () => {
    if (cart.length === 0) {
        showNotification("¡Tu carrito está vacío!");
        return;
    }
    cartModal.style.display = "none";
    paymentModal.style.display = "block";
};

closePayment.onclick = () => paymentModal.style.display = "none";

window.processFinalPayment = function(method) {
    paymentModal.style.display = "none";
    
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const username = document.querySelector(".guest-text").innerText;

    document.getElementById("successDetail").innerText = `Gracias, ${username}. Has pagado ${total.toFixed(2)} USD vía ${method}.`;
    
    successModal.style.display = "block";
    
    console.log(`Pago procesado con éxito para ${username}. Método: ${method}`);
    
    cart = [];
    updateCartUI();
};

function copyIP() {
    const ipText = document.getElementById("serverIP").innerText;
    
    navigator.clipboard.writeText(ipText).then(() => {
        showNotification("¡IP COPIADA! Te esperamos en el servidor.");
        
        const ipBox = document.querySelector(".ip-copy-box");
        ipBox.style.borderColor = "#4caf50";
        setTimeout(() => {
            ipBox.style.borderColor = "rgba(255, 215, 0, 0.2)";
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}