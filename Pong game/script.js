const canvas = document.querySelector('canvas')
canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext("2d");
const paddleWidth = 8;
const paddleHeight = 80;
let PlayerScore = 0;
let ComputerScore = 0;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let playerPosition = canvas.height / 2;
let computerPosition = canvas.height / 2;
let moveBallX = -2;  // Ball's horizontal movement speed
let moveBallY = 1;   // Ball's vertical movement speed
let initialSpeedX = moveBallX;  // Store the initial horizontal speed
let initialSpeedY = moveBallY;  // Store the initial vertical speed
let ballRadius = 10;
const winningTotal = 3;
let gameLoop;
let gameRunning = false;
const computerSpeed = 2;  // Speed of the AI paddle
const maxSpeed = 6;       // Max ball speed to prevent it from getting too fast

ctx.fillStyle = "red";
ctx.font = "30px Helvetica";
ctx.textAlign = "center";
ctx.fillText("Press space to play!", canvas.width / 2, canvas.height / 2);

document.addEventListener("keydown", handleKeyPressed);
function handleKeyPressed(e) {
    switch (e.code) {
        case "Space":
            gameStart();
            break;
        case "KeyW":
            // This if will move player up but prevent it from going off the top using the playerPosition value camparison.
            if (playerPosition - paddleHeight / 2 > 0) {
                playerPosition -= 15;
            }
            break;
        case "KeyS":
            // This if will move player down but prevent it from going off the bottom
            if (playerPosition + paddleHeight / 2 < canvas.height) {
                playerPosition += 15;
            }
            break;
    }
}

function gameStart() {
    if (gameRunning) return;
    gameRunning = true;
    ballX = canvas.width / 2;
    PlayerScore = 0;
    ComputerScore = 0;
    clearInterval(gameLoop);
    gameLoop = setInterval(loop, 15);
}

function drawPlayerPaddle() {
    ctx.fillStyle = "red";
    ctx.fillRect(0, playerPosition - paddleHeight / 2, paddleWidth, paddleHeight);
}

function drawComputerPaddle() {
    ctx.fillStyle = 'blue';

    // AI follows the ball at a regular speed also using same if statement to prevent computer bar to go offboard.
    if (ballY > computerPosition + paddleHeight / 4) {
        if (computerPosition + paddleHeight / 2 < canvas.height) {
            computerPosition += computerSpeed;
        }
    } else if (ballY < computerPosition - paddleHeight / 4) {
        if (computerPosition - paddleHeight / 2 > 0) {
            computerPosition -= computerSpeed;
        }
    }

    ctx.fillRect(canvas.width - paddleWidth, computerPosition - paddleHeight / 2, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = "gray";
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ballX += moveBallX;
    ballY += moveBallY;
}

function drawScore() {
    ctx.fillStyle = "red";
    ctx.font = "30px Helvetica";
    ctx.fillText(PlayerScore, canvas.width / 4, 50);
    ctx.fillText(ComputerScore, canvas.width * 0.75, 50);
}

function drawCanvas() {
    ctx.beginPath();
    ctx.setLineDash([6]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
    ctx.stroke();
}

function collide() {
    //bounce off top and bottom
    if (ballY > canvas.height - ballRadius || ballY - ballRadius <= 0) {
        moveBallY = -moveBallY;
    }
    // check for score x axis (both sides)
    if (ballX <= ballRadius) {
        score('computer');
    } else if (ballX + ballRadius >= canvas.width) {
        score('player');
    }
    // check player paddle contact
    if (ballX <= ballRadius + paddleWidth && Math.abs(ballY - playerPosition) <= paddleHeight / 2 + ballRadius) {
        moveBallX = -moveBallX;
        randomizeBallSpeedAndDirection();
    }
    // check computer paddle contact
    if (ballX + ballRadius >= canvas.width - paddleWidth && Math.abs(ballY - computerPosition) <= paddleHeight / 2 + ballRadius) {
        moveBallX = -moveBallX;
        randomizeBallSpeedAndDirection();
    }
}

function score(player) {
    if (player === "computer") {
        ComputerScore++;
    } else {
        PlayerScore++;
    }
    if (ComputerScore === winningTotal) {
        endGame("Computer");
        return;
    } else if (PlayerScore === winningTotal) {
        endGame("Player");
        return;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    moveBallX = initialSpeedX;
    moveBallY = initialSpeedY;
}

function endGame(winner) {
    gameRunning = false;
    clearInterval(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    if (winner === 'Computer') {
        ctx.fillStyle = 'blue';
    } else {
        ctx.fillStyle = 'red';
    }
    ctx.textAlign = 'center';
    ctx.fillText(`The winner is: ${winner}`, canvas.width / 2, canvas.height / 2);
}

// Randomize the ball's speed and angle after hitting a paddle
function randomizeBallSpeedAndDirection() {
    // Slightly increase the speed
    moveBallX *= 1.1;
    moveBallY *= 1.1;
    // Prevent the ball from exceeding max speed
    if (Math.abs(moveBallX) > maxSpeed) {
        moveBallX = maxSpeed * Math.sign(moveBallX);
    }
    if (Math.abs(moveBallY) > maxSpeed) {
        moveBallY = maxSpeed * Math.sign(moveBallY);
    }
    // Randomly adjust the Y direction to vary the ball's movement angle
    moveBallY += (Math.random() - 0.7);  // Adds a small random variation to Y movement
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayerPaddle();
    drawComputerPaddle();
    drawScore();
    drawCanvas();
    collide();
}
