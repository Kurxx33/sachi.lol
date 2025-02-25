let transitionActive = false;
var song = document.getElementById("song");
var current_page = "main";

// SONG HANDLING

var songList = ["https://r2.interrupted.me/F/QgrHcBd9.mp3", "https://r2.interrupted.me/F/DReihIGF.mp3", "https://r2.interrupted.me/F/EzrDmIBr.mp3", "https://r2.interrupted.me/F/Uiws8GeC.mp3", "https://r2.interrupted.me/F/Q6Kt23uF.mp3", "https://r2.interrupted.me/F/8xGLntzL.mp3"];
var previousSong = localStorage.getItem('previousSong'); // Get previously played song from localStorage

// Randomly select a song that's not the previous one
function getRandomSong() {
    // If there's no previous song, pick a random one from the list
    if (!previousSong) {
        previousSong = songList[Math.floor(Math.random() * songList.length)];
    } else {
        // If there's a previous song, pick the other one
        previousSong = previousSong === songList[0] ? songList[1] : songList[0];
    }

    localStorage.setItem('previousSong', previousSong); // Save the current song for next time
    return previousSong;
}

// Start the music and set up the fade-in effect
function startMusic() {
    var selectedSong = getRandomSong();
    song.src = selectedSong; // Set the song source to the randomly selected song
    song.loop = true; // Ensure the song loops
    song.volume = 0; // Start with the volume at 0
    song.playbackRate = 0.85; // Optionally adjust playback rate
    song.play(); // Start the song

    // Fade in the volume gradually
    var fadeInInterval = setInterval(function () {
        song.volume += 0.1;
        if (song.volume >= 0.7) {
            song.volume = 0.7; // Ensure max volume is 0.7
            clearInterval(fadeInInterval);
        }
    }, 350);
}

// PAGE LOADING

function startHome() {
    if (transitionActive) return;
    transitionActive = true;

    const displayText = document.querySelector('.display-text');
    displayText.style.opacity = 0;

    setTimeout(() => {
        displayText.innerHTML = getRandomSentence();
        displayText.style.opacity = 1;
        transitionActive = false;
    }, 2000);
}

function startPage() {
    const enterButton = document.getElementById("enter-container");
    enterButton.style.transition = "opacity 1s ease-in-out";
    enterButton.style.opacity = 0;

    setTimeout(() => {
        setTimeout(() => {
            const memberButtons = document.getElementById("member-container");
            const mainButtons = document.getElementById("main-container");
            memberButtons.style.display = "flex";
            mainButtons.style.display = "flex";

            requestAnimationFrame(() => {
                memberButtons.style.transition = "opacity 1s ease-in-out";
                memberButtons.style.opacity = 1;
                mainButtons.style.transition = "opacity 1s ease-in-out";
                mainButtons.style.opacity = 1;
            });

            enterButton.style.display = "none";
        }, 500);
    }, 1000);

    startMusic(); // Start the music when the page loads

    setTimeout(startHome, 1000);
}
// PAGE LOADING

function startHome() {
    if (transitionActive) return;
    transitionActive = true;

    const displayText = document.querySelector('.display-text');
    displayText.style.opacity = 0;

    setTimeout(() => {
        displayText.innerHTML = getRandomSentence();
        displayText.style.opacity = 1;
        transitionActive = false;
    }, 2000);
}

function startPage() {
    const enterButton = document.getElementById("enter-container");
    enterButton.style.transition = "opacity 1s ease-in-out";
    enterButton.style.opacity = 0;

    setTimeout(() => {
        setTimeout(() => {
            const memberButtons = document.getElementById("member-container");
            const mainButtons = document.getElementById("main-container");
            memberButtons.style.display = "flex";
            mainButtons.style.display = "flex";

            requestAnimationFrame(() => {
                memberButtons.style.transition = "opacity 1s ease-in-out";
                memberButtons.style.opacity = 1;
                mainButtons.style.transition = "opacity 1s ease-in-out";
                mainButtons.style.opacity = 1;
            });

            enterButton.style.display = "none";
        }, 500);
    }, 1000);
    
    song.volume = 0;
    song.playbackRate = 0.85;
    song.play();

    var fadeInInterval = setInterval(function () {
        song.volume += 0.1;
        if (song.volume >= 0.7) {
            song.volume = 0.7;
            clearInterval(fadeInInterval);
        }
    }, 350);

    setTimeout(startHome, 1000);
}

// MEMBER BUTTONS

function memberCall(pfpSrc, textContent, user) {
    if (transitionActive) return;
    transitionActive = true;

    if (current_page === "member") {
        const displayText = document.querySelector(".display-text");
        const pfpImage = document.getElementById("pfp-image");

        displayText.innerHTML = textContent;
        document.title = "@scare; " + user;
        pfpImage.src = pfpSrc;

        transitionActive = false;
    } else {
        current_page = "member";
        document.title = "@scare; " + user;
        const displayText = document.querySelector(".display-text");
        const randomGif = document.getElementById("random-gif");
        const pfpImage = document.getElementById("pfp-image");

        pfpImage.style.display = "block";
        pfpImage.style.opacity = 1;

        displayText.innerHTML = textContent;
        pfpImage.src = pfpSrc;
        randomGif.style.display = "none";

        transitionActive = false;
    }
}

function noire() {
    memberCall(
        "https://r2.interrupted.me/F/yIpEiNOZ.jpg",
        "dead",
        "noire"
    );
}

function com() {
    memberCall(
        "https://r2.interrupted.me/F/pctf.png",
        "breaking",
        "com"
    );
}

function bmw43() {
    memberCall(
        "https://r2.interrupted.me/F/rvle.jpg",
        "dying",
        "bmw43"
    );
}

// CORE BUTTONS

function about() {
    updatePage(
        "<a href='https://t.me/fatebreaker' target='_blank' style='color: white;'>@evx</a> is an buisness focused group based on negotiations & trades",
        "about"
    );
}

function telegram() {
    window.open("https://t.me/fatebreaker", "_blank");
}

function updatePage(htmlContent, pageTitle) {
    if (transitionActive) return;
    transitionActive = true;
    document.title = "@scare; " + pageTitle;
    const displayText = document.querySelector(".display-text");

    if (current_page !== "main") {
        current_page = "main";
        const randomGif = document.getElementById("random-gif");
        const pfpImage = document.getElementById("pfp-image");

        pfpImage.style.opacity = 0;
        randomGif.style.display = "block";
        randomGif.style.opacity = 1;
        displayText.innerHTML = htmlContent;
        pfpImage.style.display = "none";
        displayText.style.opacity = 1;

        transitionActive = false;
    } else {
        displayText.innerHTML = htmlContent;
        transitionActive = false;
    }
}

// OTHER

function getRandomSentence() {
    const sentences = [
        "@ <a href='https://t.me/scareanc' target='_blank' style='color: white;'>scare</a>, a party o_O"
    ];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
}

var gifs = [
    "https://r2.interrupted.me/F/c8i1qQrC.gif",
    "https://r2.interrupted.me/F/edg44KkU.gif",
    "https://r2.interrupted.me/F/IFBodsEw.gif"
];

function setRandomGif() {
    var randomIndex = Math.floor(Math.random() * gifs.length);
    var randomGif = gifs[randomIndex];
    document.getElementById("random-gif").src = "gifs/" + randomGif;

    document.body.setAttribute("data-current-gif", randomGif);

    updateButtonHoverColor();
}

setRandomGif();

function updateButtonHoverColor() {
    var currentGif = document.body.getAttribute("data-current-gif");
    var buttons = document.querySelectorAll(".buttons-container button");

    buttons.forEach(function(button) {
        button.setAttribute("data-gif", currentGif);
    });
}
