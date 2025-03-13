const player = document.getElementById('player');
const fallingObject = document.getElementById('falling-object');
const scoreElement = document.getElementById('score');

let score = 0;
let objectSpeed = 2; // Initial speed of the falling object
let objectInterval; // Interval for falling object
let gameOver = false; // Track game over status
const moveSpeed = 20; // Player movement speed for arrow keys

// Start the game
function startGame() {
    document.addEventListener('mousemove', movePlayer);
    document.addEventListener('keydown', movePlayerWithKeys);
    objectInterval = setInterval(fallObject, 20);
}

// Move the player with mouse 
function movePlayer(event) {
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const playerWidth = player.offsetWidth;

    // Get the position relative to the container and adjust for player width
    let x = event.clientX - containerRect.left - (playerWidth / 2);

    // Ensure the player stays within the left and right boundaries
    if (x < 0) {
        x = 0; // Don't go beyond the left boundary
    } else if (x > containerRect.width - playerWidth) {
        x = containerRect.width - playerWidth; // Don't go beyond the right boundary
    }

    player.style.left = `${x}px`;
}

// Move the player with arrow keys
function movePlayerWithKeys(event) {
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const playerWidth = player.offsetWidth;
    let playerLeft = parseFloat(player.style.left) || 0;

    // Movement speed for arrow keys
    const moveSpeed = 10;

    // Move left
    if (event.key === 'ArrowLeft') {
        playerLeft -= moveSpeed;
        if (playerLeft < 0) {
            playerLeft = 0; // Don't go beyond the left boundary
        }
    }

    // Move right
    if (event.key === 'ArrowRight') {
        playerLeft += moveSpeed;
        if (playerLeft > containerRect.width - playerWidth) {
            playerLeft = containerRect.width - playerWidth; // Don't go beyond the right boundary
        }
    }

    player.style.left = `${playerLeft}px`;
}

// Handle the falling object
function fallObject() {
    if (gameOver) return; // Stop if the game is over

    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const objectRect = fallingObject.getBoundingClientRect();

    if (!fallingObject.style.top) {
        resetGreenBoxPosition(); // Reset the falling object position with the new function
    } else {
        let top = parseFloat(fallingObject.style.top);
        top += objectSpeed;
        fallingObject.style.top = `${top}px`;

        // Check if object has reached the bottom (missed)
        if (top > containerRect.height) {
            endGame();
        }

        // Check for collision
        if (checkCollision()) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            increaseSpeed(); // Increase the speed after successful catch
            resetGreenBoxPosition(); // Call the function to reset the object's position
        }
    }
}

// Check for collision between player and falling object
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const objectRect = fallingObject.getBoundingClientRect();

    return !(objectRect.right < playerRect.left ||
             objectRect.left > playerRect.right ||
             objectRect.bottom < playerRect.top ||
             objectRect.top > playerRect.bottom);
}

// Reset the falling object (green box) to a random x position and top of the container
function resetGreenBoxPosition() {
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const greenBoxWidth = fallingObject.offsetWidth; // Assume fallingObject is the green box

    // Original random X position logic
    let randomX = Math.random() * (containerRect.width - greenBoxWidth);
    
    // Set the new position for the green box
    fallingObject.style.left = `${randomX}px`;
    fallingObject.style.top = '0px'; // Reset to the top
}

// End the game if the player misses the falling object
function endGame() {
    clearInterval(objectInterval);
    gameOver = true;
    scoreElement.textContent = `Game Over! Final Score: ${score}`;
    document.removeEventListener('mousemove', movePlayer);
    document.removeEventListener('keydown', movePlayerWithKeys);
}

// Increase the falling speed after each successful catch
function increaseSpeed() {
    objectSpeed += 0.5; // Increase speed by 0.5 each time
}

startGame();
