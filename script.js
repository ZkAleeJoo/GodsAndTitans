const modal = document.getElementById("userModal");
const btns = document.querySelectorAll(".buy-btn");
const span = document.querySelector(".close-modal");
const userInput = document.getElementById("mcUsername");
const userHead = document.getElementById("userHead");
const btnContinue = document.getElementById("btnContinue");
const bedrockCheck = document.getElementById("bedrockCheck");
const toast = document.getElementById("customToast");
const toastMsg = document.getElementById("toastMessage");

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


userInput.oninput = function() {
    let username = this.value.trim();
    
    if (username.length > 2) {
        userHead.src = `https://mc-heads.net/avatar/${username}/50`;
    } else {
        userHead.src = `https://mc-heads.net/avatar/steve/50`;
    }
};

btnContinue.onclick = () => {
    let username = userInput.value.trim();
    const isBedrock = bedrockCheck.checked;

    if (username === "") {
        userInput.style.borderColor = "red";
        setTimeout(() => userInput.style.borderColor = "#222", 2000);
    } else {
        if (isBedrock && !username.startsWith(".")) {
            username = "." + username;
        }
        
        modal.style.display = "none";
        showNotification(username);
        
        document.querySelector(".guest-text").innerText = username;
        document.querySelector(".mini-head").src = `https://mc-heads.net/avatar/${username}/32`;
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