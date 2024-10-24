// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const stickmanWidth = 20;
const stickmanHeight = 40;
let stickmanX = canvas.width / 2 - stickmanWidth / 2; // Start in the middle
let stickmanY = canvas.height - stickmanHeight - 10; // Position above the bottom
const moveSpeed = 5; // Movement speed

let paths = []; // Array to hold path segments

// Function to generate paths
function generatePaths() {
    paths = [];
    const pathCount = 10; // Number of paths
    const pathWidth = 100; // Width of each path
    const pathHeight = 20; // Height of each path

    for (let i = 0; i < pathCount; i++) {
        const x = Math.random() * (canvas.width - pathWidth);
        const y = i * (canvas.height / pathCount) + (canvas.height / pathCount - pathHeight / 2);
        paths.push({ x, y, width: pathWidth, height: pathHeight });
    }
}

// Function to draw paths
function drawPaths() {
    ctx.fillStyle = '#4caf50'; // Path color (green)
    paths.forEach(path => {
        ctx.fillRect(path.x, path.y, path.width, path.height);
    });
}

// Function to draw the stickman
function drawStickman() {
    ctx.fillStyle = 'white'; // Stickman color
    ctx.fillRect(stickmanX, stickmanY, stickmanWidth, stickmanHeight); // Draw stickman
}

// Function to check collision with paths
function checkCollision() {
    for (let path of paths) {
        if (
            stickmanX < path.x + path.width &&
            stickmanX + stickmanWidth > path.x &&
            stickmanY + stickmanHeight > path.y &&
            stickmanY + stickmanHeight < path.y + path.height
        ) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

// Function to update the game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawPaths(); // Draw paths
    drawStickman(); // Draw stickman

    if (!checkCollision()) {
        stickmanY += moveSpeed; // Move stickman down if no collision
    } else {
        stickmanY = canvas.height - stickmanHeight - 10; // Reset position if collision
    }

    requestAnimationFrame(update); // Loop the update function
}

// Event listener for keyboard input
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && stickmanX > 0) {
        stickmanX -= moveSpeed; // Move left
    } else if (e.key === 'ArrowRight' && stickmanX < canvas.width - stickmanWidth) {
        stickmanX += moveSpeed; // Move right
    } else if (e.key === 'ArrowUp' && stickmanY > 0) {
 stickmanY -= moveSpeed; // Move up
    } else if (e.key === 'ArrowDown' && stickmanY < canvas.height - stickmanHeight) {
        stickmanY += moveSpeed; // Move down
    }
});

// Initialize the game
generatePaths();
update();
