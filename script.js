const board = document.querySelector(".board");
const food = document.getElementById("appleObj");
const scoreText = document.getElementById("score");
const restartButton = document.getElementById("restartButton");
let gameActive = true;
let score = 0;
let unitSize = 20;
let xDirection = unitSize;
let yDirection = 0;
let snake = [
  { x: 4 * unitSize, y: 0 },
  { x: 3 * unitSize, y: 0 },
  { x: 2 * unitSize, y: 0 },
  { x: 1 * unitSize, y: 0 },
  { x: 0, y: 0 },
];
let gameInterval;

window.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", restartGame);
gameStart();

function gameStart() {
  gameActive = true;
  scoreText.textContent = `Score ${score}`;
  spawnObj();
  nextTick();
}

function nextTick() {
  gameInterval = setInterval(() => {
    if (gameActive) {
      moveSnake();
      drawSnake();
      checkWallCollision();
      checkAppleCollision();
      checkSelfCollision();
    }
  }, 100); // Reduced interval to 100ms for faster updates
}

function spawnObj() {
  const gameBoard = board.getBoundingClientRect();
  const appleSize = food.offsetWidth;
  let posX =
    Math.floor(Math.random() * (gameBoard.width / unitSize)) * unitSize;
  let posY =
    Math.floor(Math.random() * (gameBoard.height / unitSize)) * unitSize;

  // Ensure the apple doesn't spawn outside the board
  if (posX + appleSize > gameBoard.width && posY + appleSize > gameBoard.height) {
    posX = gameBoard.width - appleSize;
    posY = gameBoard.height - appleSize;
  }

  food.style.left = `${posX}px`;
  food.style.top = `${posY}px`;
  /* food.style.zIndex = 2; */ // Ensure apple z-index is the same as the snake
}

function drawSnake() {
  board.innerHTML = "";
  snake.forEach((snakePart) => {
    const snakeBody = document.createElement("div");
    snakeBody.className = "snakebody";
    board.appendChild(snakeBody);
    snakeBody.style.left = `${snakePart.x}px`;
    snakeBody.style.top = `${snakePart.y}px`;
    /* snakeBody.style.zIndex = 2; */ // Ensure snake z-index is the same as the apple
  });
  board.appendChild(food);
}

function moveSnake() {
/*   const head = { x: snake[0].x + xDirection, y: snake[0].y + yDirection };
  snake.unshift(head);
  snake.pop(); */
}

function checkAppleCollision() {
  const head = snake[0];
  const foodX = parseInt(food.style.left);
  const foodY = parseInt(food.style.top);

  if (head.x === foodX && head.y === foodY) {
    score += 1;
    scoreText.textContent = `Score ${score}`;
    spawnObj();
    snake.push({}); // Add new segment to snake
  }
  console.log(foodX,foodY)
}

function checkSelfCollision() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameActive = false;
      clearInterval(gameInterval);
      board.innerHTML = `<p>Game Over!</p>`;
    }
  }
}

function changeDirection(event) {
  const keyPressed = event.keyCode;

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yDirection === -unitSize;
  const goingDown = yDirection === unitSize;
  const goingLeft = xDirection === -unitSize;
  const goingRight = xDirection === unitSize;

  switch (true) {
    case keyPressed === LEFT && !goingRight:
      xDirection = -unitSize;
      yDirection = 0;
      break;
    case keyPressed === RIGHT && !goingLeft:
      xDirection = unitSize;
      yDirection = 0;
      break;
    case keyPressed === UP && !goingDown:
      yDirection = -unitSize;
      xDirection = 0;
      break;
    case keyPressed === DOWN && !goingUp:
      yDirection = unitSize;
      xDirection = 0;
      break;
  }
}

function checkWallCollision() {
  const gameBoard = board.getBoundingClientRect();
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= gameBoard.width ||
    head.y < 0 ||
    head.y >= gameBoard.height
  ) {
    gameActive = false;
    clearInterval(gameInterval);
    board.innerHTML = `<p>Game Over!</p>`;
  }
}

function restartGame() {
  clearInterval(gameInterval); // Clear the previous interval to prevent speedup
  score = 0;
  xDirection = unitSize;
  yDirection = 0;
  snake = [
    { x: 4 * unitSize, y: 0 },
    { x: 3 * unitSize, y: 0 },
    { x: 2 * unitSize, y: 0 },
    { x: 1 * unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
