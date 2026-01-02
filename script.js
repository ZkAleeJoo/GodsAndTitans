const modal = document.getElementById("userModal");
const btns = document.querySelectorAll(".buy-btn");
const span = document.querySelector(".close-modal");
const userInput = document.getElementById("mcUsername");
const userHead = document.getElementById("userHead");

btns.forEach(btn => {
    btn.onclick = () => modal.style.display = "block";
});

span.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

userInput.oninput = function() {
    let username = this.value.trim();
    if (username.length > 2) {
        userHead.src = `https://mc-heads.net/avatar/${username}/50`;
    } else {
        userHead.src = `https://mc-heads.net/avatar/steve/50`;
    }
};