function removeOverlay() {
    const overlay = document.getElementById("overlay");
    const button = overlay.querySelector("button");
    const audio = document.getElementById("audio");

    overlay.classList.add("hidden");
    button.style.opacity = "0";

    audio.play();

    setTimeout(() => {
        button.style.display = "none"; 
    }, 100);
}

function teclear() {
}
