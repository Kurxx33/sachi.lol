const countDownDate = new Date("Dec 31, 2024 18:00 UTC").getTime();
setInterval(function () {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("cd").innerHTML = "site opening in: " + days + ":" + hours + ":"
        + minutes + ":" + seconds;
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("cd").innerHTML = "<h4 style='" +
            "color: var(--available)'>RELOADING...</h4>";
        document.location.reload();
    }
}, 1000);
