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
    renderProducts("permanentes"); 
});

/**
 * Aplica los cambios visuales cuando un usuario inicia sesión
 *
 */
function setLoggedUser(username) {
    const guestText = document.getElementById("userDisplayName");
    if (guestText) {
        guestText.innerText = username;
        guestText.classList.add("logged-in"); // ACTIVA EL BRILLO Y COLOR DIVINO EN CSS
    }
    
    document.querySelector(".mini-head").src = `https://mc-heads.net/avatar/${username}/32`;
    document.querySelector(".cart-title").innerText = `Carro de ${username}`;
    document.querySelector(".login-link").innerText = "CAMBIAR DE PERSONAJE";
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
    userHead.style.opacity = "0.5"; 
    
    setTimeout(() => {
        userHead.src = username.length > 2 
            ? `https://mc-heads.net/avatar/${username}/100` 
            : `https://mc-heads.net/avatar/385/100`;
        userHead.style.opacity = "1";
    }, 200);
};

btnContinue.onclick = () => {
    let username = userInput.value.trim();
    if (username === "") {
        userInput.style.borderColor = "red";
        setTimeout(() => userInput.style.borderColor = "#222", 2000);
        return;
    }

    // Prefijo para usuarios de Bedrock
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
        ipBox.style.borderColor = "var(--success-green)"; // Feedback visual verde
        setTimeout(() => ipBox.style.borderColor = "rgba(255, 215, 0, 0.2)", 2000);
    });
}

/* =========================================
   CARRITO Y PRODUCTOS DINÁMICOS
   ========================================= */
const productsData = {
    permanentes: [
        { name: "URANO", price: "50.00", tag: "PRIMORDIAL", icon: "fa-cloud-moon", color: "#6a0dad", btn: "COMPRAR" },
        { name: "ZEUS", price: "40.00", tag: "REY DEL OLIMPO", icon: "fa-bolt-lightning", color: "#00d2ff", btn: "COMPRAR" },
        { name: "GEA", price: "30.00", tag: "MADRE TIERRA", icon: "fa-leaf", color: "#2ecc71", btn: "COMPRAR" },
        { name: "ARES", price: "20.00", tag: "DIOS DE GUERRA", icon: "fa-skull-crossbones", color: "#e74c3c", btn: "COMPRAR" },
        { name: "CRONOS", price: "10.00", tag: "TITÁN DEL TIEMPO", icon: "fa-hourglass-half", color: "#ff4500", btn: "COMPRAR" },
        { name: "APOLO", price: "5.00", tag: "LUZ DEL SOL", icon: "fa-sun", color: "#ffd700", btn: "COMPRAR" }
    ],
    llaves: [
        { name: "LLAVE DEL CAOS", price: "5.00", tag: "LEGENDARIO", icon: "fa-eye", color: "#e74c3c", btn: "ADQUIRIR" },
        { name: "LLAVE DEL CELESTIAL", price: "4.00", tag: "DIVINO", icon: "fa-spaghetti-monster-flying", color: "#3498db", btn: "ADQUIRIR" },
        { name: "LLAVE DEL TITÁN", price: "3.00", tag: "PODEROSO", icon: "fa-hand-fist", color: "#e67e22", btn: "ADQUIRIR" },
        { name: "LLAVE DEL TRONO", price: "2.00", tag: "NOBLE", icon: "fa-crown", color: "#f1c40f", btn: "ADQUIRIR" },
        { name: "LLAVE DEL HÉROE", price: "1.00", tag: "BÁSICO", icon: "fa-shield-halved", color: "#95a5a6", btn: "ADQUIRIR" },
    ],
    desbaneos: [{ name: "UNBAN", price: "10.00", tag: "ÚNICO", icon: "fa-gavel", color: "#ff4500", btn: "COMPRAR" }],
    extras: [{ name: "COSMÉTICOS", price: "7.00", tag: "PACK", icon: "fa-wand-magic-sparkles", color: "#00d2ff", btn: "COMPRAR" }]
};

function renderProducts(category) {
    const container = document.getElementById("productsContainer");
    if (!container) return;
    container.innerHTML = "";
    
    (productsData[category] || []).forEach(p => {
        const card = document.createElement("div");
        card.className = `product-card fade-in category-${category}`;
        card.style.setProperty('--rank-color', p.color);
        
        card.innerHTML = `
            <div class="card-tag" style="background: ${p.color}">${p.tag}</div>
            <div class="card-body">
                <div class="rank-logo"><i class="fas ${p.icon}" style="color: ${p.color}"></i></div>
                <h3>${p.name}</h3>
                <p class="price">${p.price} <span>USD</span></p>
            </div>
            <button class="buy-btn" style="background: ${p.color}" onclick="addToCart('${p.name}', '${p.price}')">${p.btn}</button>
        `;
        container.appendChild(card);
    });
}

// Navegación de categorías
document.querySelectorAll(".nav-item").forEach(item => {
    item.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
        renderProducts(item.getAttribute("data-category"));
    };
});

function addToCart(name, price) {
    // Verificar si el usuario está logueado antes de comprar
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
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
};

document.querySelectorAll(".close-modal").forEach(span => {
    span.onclick = () => {
        span.closest(".modal").style.display = "none";
    };
});