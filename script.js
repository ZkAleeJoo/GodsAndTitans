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
    const isBedrock = bedrockCheck.checked;

    if (username === "") {
        userInput.style.borderColor = "red";
        userInput.placeholder = "¡Escribe tu nombre!";
        setTimeout(() => userInput.style.borderColor = "#222", 2000);
    } else {
        if (isBedrock && !username.startsWith(".")) {
            username = "." + username;
        }
        
        modal.style.display = "none";
        
        showNotification(username);
        
        const guestText = document.querySelector(".guest-text");
        const loginLink = document.querySelector(".login-link");
        const miniHead = document.querySelector(".mini-head");
        const cartTitle = document.querySelector(".cart-title");

        guestText.innerText = username;
        guestText.style.color = "var(--god-color)"; 
        
        loginLink.innerText = "CAMBIAR DE PERSONAJE"; 
        loginLink.style.fontSize = "0.6rem";
        
        miniHead.src = `https://mc-heads.net/avatar/${username}/32`;
        cartTitle.innerText = `Carro de ${username}`;
        
        console.log("Sesión iniciada para: " + username);
    }
};

function showNotification(user) {
    toastMsg.innerText = `¡Bienvenido, ${user}! Tu rango te espera.`;
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