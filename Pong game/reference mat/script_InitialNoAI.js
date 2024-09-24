const canvas = document.querySelector('canvas')
canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext("2d");
const paddleWidth = 8;
const paddleHeight = 80;
let PlayerScore = 0;
let ComputerScore = 0;
let ballX = canvas.width /2;
let ballY = canvas.height /2;
let playerPosition = canvas.height /2;
let computerPosition = canvas.height /2;
let moveX = -2;
let moveY = 1;
let ballRadius = 10;
const winningTotal = 3;
let gameLoop;
let gameRunning = false;


ctx.fillStyle = "red";
ctx.font = "30px Helvetica"
ctx.textAlign = "center"
ctx.fillText("Press space to play!", canvas.width / 2, canvas.height /2)

document.addEventListener("keydown", handleKeyPressed)
function handleKeyPressed(e) {
    switch(e.code){
        case "Space":
            gameStart()
            break;
        case "KeyW":
            playerPosition -= 15
            break;
        case "KeyS":
            playerPosition += 15
            break;
    }
}

function gameStart() {
    if(gameRunning) return
    gameRunning = true;
    ballX = canvas.width / 2;
    PlayerScore = 0;
    ComputerScore = 0;
    clearInterval(gameLoop);
    gameLoop = setInterval(loop, 15);
}

function drawPlayerPaddle() {
    ctx.fillStyle = "red";
    ctx.fillRect(0, playerPosition - paddleHeight/2, paddleWidth, paddleHeight);
}

function drawComputerPaddle() {
    ctx.fillStyle = 'blue';

ctx.fillRect(canvas.width - paddleWidth, canvas.height /2 - paddleHeight/2, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = "gray";
    ctx.arc(ballX, ballY, ballRadius, 0, 2 *Math.PI);
    ctx.fill();
    ballX += moveX;
    ballY += moveY;


}

function drawScore(){
    ctx.fillStyle = "red";
    ctx.font = "30px Helvetica";
    ctx.fillText(PlayerScore, canvas.width /4, 50);
    ctx.fillText(ComputerScore, canvas.width * 0.75, 50);
}

function drawCanvas(){
    ctx.beginPath();
    ctx.setLineDash([6]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width /2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height /2, 20, 0, 2 *Math.PI);
    ctx.stroke();
}

function collide() {
    //bounce of top and botton
    if(ballY > canvas.height - ballRadius || ballY - ballRadius <= 0){
        moveY = -moveY;
     }
    // check for score x axis (both sides)
    if(ballX <= ballRadius) {
        score('computer');
    }
    else if(ballX + ballRadius >= canvas.width) {
        score('player');
    }
    // check player paddle contact
    if(ballX <= ballRadius+paddleWidth && Math.abs(ballY - playerPosition) <= paddleHeight /2 + ballRadius) {
        moveX = -moveX;
    }
    // check computer paddle contact
    if(ballX + ballRadius >= canvas.width - paddleWidth && Math.abs(ballY - computerPosition) <= paddleHeight /2 + ballRadius) {
        moveX = -moveX;
    }
}

function score (player) {
    if(player === "computer"){
        ComputerScore++;
    }
    else {
        PlayerScore++
    }
    if(ComputerScore === winningTotal){
        endGame("Computer")
        return;
    }
    else if(PlayerScore === winningTotal){
        endGame("Player")
        return;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}
/*
 * 
 *  CODE FROM https://github.com/jakesgordon/javascript-pong/tree/master/part1
function(dt, ball) {
    if (((ball.x < this.left) && (ball.dx < 0)) ||
        ((ball.x > this.right) && (ball.dx > 0))) {
        this.stopMovingUp();
        this.stopMovingDown();
        return;
    }

    this.predict(ball, dt);

    if (this.prediction) {
        if (this.prediction.y < (this.top + this.height / 2 - 5)) {
            this.stopMovingDown();
            this.moveUp();
        }
        else if (this.prediction.y > (this.bottom - this.height / 2 + 5)) {
            this.stopMovingUp();
            this.moveDown();
        }
        else {
            this.stopMovingUp();
            this.stopMovingDown();
        }
    }
},

predict: function(ball, dt) {
    // only re-predict if the ball changed direction, or its been some amount of time since last prediction
    if (this.prediction &&
        ((this.prediction.dx * ball.dx) > 0) &&
        ((this.prediction.dy * ball.dy) > 0) &&
        (this.prediction.since < this.level.aiReaction)) {
        this.prediction.since += dt;
        return;
    }

    var pt = Pong.Helper.ballIntercept(ball, { left: this.left, right: this.right, top: -10000, bottom: 10000 }, ball.dx * 10, ball.dy * 10);
    if (pt) {
        var t = this.minY + ball.radius;
        var b = this.maxY + this.height - ball.radius;

        while ((pt.y < t) || (pt.y > b)) {
            if (pt.y < t) {
                pt.y = t + (t - pt.y);
            }
            else if (pt.y > b) {
                pt.y = t + (b - t) - (pt.y - b);
            }
        }
        this.prediction = pt;
    }
    else {
        this.prediction = null;
    }

    if (this.prediction) {
        this.prediction.since = 0;
        this.prediction.dx = ball.dx;
        this.prediction.dy = ball.dy;
        this.prediction.radius = ball.radius;
        this.prediction.exactX = this.prediction.x;
        this.prediction.exactY = this.prediction.y;
        var closeness = (ball.dx < 0 ? ball.x - this.right : this.left - ball.x) / this.pong.width;
        var error = this.level.aiError * closeness;
        this.prediction.y = this.prediction.y + Game.random(-error, error);
    }
},
*/

function endGame(winner) {
    gameRunning = false;
    clearInterval(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    if(winner === 'Computer') {
        ctx.fillStyle = 'blue'
    }
    else {
        ctx.fillStyle = 'red'
    }
    ctx.textAlign = 'center'
    ctx.fillText(`The winner is: ${winner}`, canvas.width / 2, canvas.height / 2);
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