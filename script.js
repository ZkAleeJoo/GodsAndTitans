const modal = document.getElementById("userModal");
const btns = document.querySelectorAll(".buy-btn");
const span = document.querySelector(".close-modal");
const userInput = document.getElementById("mcUsername");
const userHead = document.getElementById("userHead");
const btnContinue = document.getElementById("btnContinue");
const bedrockCheck = document.getElementById("bedrockCheck");

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
        alert("¡Por favor, introduce tu nombre de usuario!");
    } else {
        if (isBedrock && !username.startsWith(".")) {
            username = "." + username;
        }
        console.log("Usuario identificado: " + username);
        alert("¡Identidad confirmada, " + username + "! Procediendo al Olimpo...");
        modal.style.display = "none";
    }
};