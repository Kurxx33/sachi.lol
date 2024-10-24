// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const stickman = document.getElementById('stickman');

let stickmanPosition = canvas.width / 2;  
const moveBy = 20; 

function drawStickman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = 'white';
    ctx.fillRect(stickmanPosition, canvas.height - 50, 20, 40); 
}

function moveLeft() {
    if (stickmanPosition > 0) {
        stickmanPosition -= moveBy;
        drawStickman();
    }
}

function moveRight() {
    if (stickmanPosition < canvas.width - 20) {
        stickmanPosition += moveBy;
        drawStickman();
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft();
    } else if (e.key === 'ArrowRight') {
        moveRight();
    }
});

drawStickman();
