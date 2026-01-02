/* =========================================
   VARIABLES Y SELECTORES
   ========================================= */
const modal = document.getElementById("userModal");
const cartModal = document.getElementById("cartModal");
const paymentModal = document.getElementById("paymentModal");
const successModal = document.getElementById("successModal");

const userInput = document.getElementById("mcUsername");
const userHead = document.getElementById("userHead");
const btnContinue = document.getElementById("btnContinue");
const bedrockCheck = document.getElementById("bedrockCheck");

const toast = document.getElementById("customToast");
const toastMsg = document.getElementById("toastMessage");

const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const cartCountElement = document.querySelector(".cart-count");

let cart = [];

/* =========================================
   PERSISTENCIA DE USUARIO (LocalStorage)
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("mcUser");
    if (savedUser) {
        setLoggedUser(savedUser);
    }
    renderProducts("divinos"); 
});

function setLoggedUser(username) {
    document.querySelector(".guest-text").innerText = username;
    document.querySelector(".mini-head").src = `https://mc-heads.net/avatar/${username}/32`;
    document.querySelector(".cart-title").innerText = `Carro de ${username}`;
    document.querySelector(".login-link").innerText = "CAMBIAR DE PERSONAJE";
    document.querySelector(".guest-text").style.color = "var(--god-color)";
}

/* =========================================
   LÓGICA DE IDENTIFICACIÓN
   ========================================= */
document.querySelector(".login-link").onclick = (e) => {
    e.preventDefault();
    modal.style.display = "block";
};

userInput.oninput = function() {
    let username = this.value.trim();
    userHead.src = username.length > 2 
        ? `https://mc-heads.net/avatar/${username}/50` 
        : `https://mc-heads.net/avatar/385/50`;
};

btnContinue.onclick = () => {
    let username = userInput.value.trim();
    if (username === "") {
        userInput.style.borderColor = "red";
        setTimeout(() => userInput.style.borderColor = "#222", 2000);
        return;
    }

    if (bedrockCheck.checked && !username.startsWith(".")) {
        username = "." + username;
    }

    localStorage.setItem("mcUser", username);
    setLoggedUser(username);
    modal.style.display = "none";
    showNotification(`¡Identidad confirmada, ${username}!`);
};

/* =========================================
   SISTEMA DE COPIADO DE IP
   ========================================= */
function copyIP() {
    const ipText = document.getElementById("serverIP").innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        showNotification("¡IP COPIADA! Pégala en tu Minecraft.");
        const ipBox = document.querySelector(".ip-copy-box");
        ipBox.style.borderColor = "var(--success-green)";
        setTimeout(() => ipBox.style.borderColor = "rgba(255, 215, 0, 0.2)", 2000);
    });
}

/* =========================================
   CARRITO Y PRODUCTOS
   ========================================= */
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

function renderProducts(category) {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";
    
    (productsData[category] || []).forEach(p => {
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
        container.appendChild(card);
    });
}

document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
        renderProducts(item.getAttribute("data-category"));
    };
});

function addToCart(name, price) {
    if (localStorage.getItem("mcUser") === null) {
        modal.style.display = "block";
        return;
    }
    cart.push({ name, price: parseFloat(price) });
    showNotification(`¡${name} añadido al carro!`);
    updateCartUI();
}

function updateCartUI() {
    cartCountElement.innerText = cart.length;
    document.querySelector(".cart-status").innerText = cart.length > 0 ? `${cart.length} ARTÍCULO(S)` : "CARRO VACÍO";
    
    cartItemsList.innerHTML = cart.length === 0 
        ? '<p style="color: #666; margin: 20px 0;">Tu carro está vacío...</p>'
        : "";

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement("div");
        div.className = "cart-item fade-in";
        div.innerHTML = `
            <div class="cart-item-info"><h4>${item.name}</h4><span>${item.price.toFixed(2)} USD</span></div>
            <i class="fas fa-trash-alt remove-item" onclick="removeFromCart(${index})"></i>
        `;
        cartItemsList.appendChild(div);
    });
    cartTotalPrice.innerText = `${total.toFixed(2)} USD`;
}

window.removeFromCart = (index) => { cart.splice(index, 1); updateCartUI(); };

/* =========================================
   FLUJO DE PAGO FINAL
   ========================================= */
document.querySelector(".cart-info").onclick = () => { updateCartUI(); cartModal.style.display = "block"; };
document.getElementById("closeCart").onclick = () => cartModal.style.display = "none";
document.getElementById("closePayment").onclick = () => paymentModal.style.display = "none";

document.getElementById("btnCheckout").onclick = () => {
    if (cart.length === 0) return showNotification("¡El carro está vacío!");
    cartModal.style.display = "none";
    paymentModal.style.display = "block";
};

window.processFinalPayment = (method) => {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    paymentModal.style.display = "none";
    document.getElementById("successDetail").innerText = `Has pagado ${total.toFixed(2)} USD vía ${method}.`;
    successModal.style.display = "block";
    cart = [];
    updateCartUI();
};

/* =========================================
   UTILIDADES
   ========================================= */
function showNotification(msg) {
    toastMsg.innerText = msg;
    toast.classList.add("active");
    setTimeout(() => toast.classList.remove("active"), 4000);
}

window.onclick = (e) => {
    if (e.target.className === "modal") e.target.style.display = "none";
};