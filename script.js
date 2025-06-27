document.addEventListener("DOMContentLoaded", () => {
  const snakeBoard = document.getElementById("snake-board");
  const boardWidth = 800;
  const boardHeight = 500;
  const cellSize = 20;
  let gameSpeed = 200;
  let score = 0;
  let gameStarted = false;
  let intervalId; 

  let food = { x: 300, y: 200 };
  let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
    { x: 100, y: 200 },
  ];
  let dx = cellSize; //* displacement with x-axis
  let dy = 0; //* displacement with y-axis

  function drawScoreboard() {
    const scoreBoard = document.getElementById("score-board");
    scoreBoard.textContent = `Score : ${score}`;
  }

  function drawDiv(x, y, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.style.position = "absolute";
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;

    return div;
  }

  function isGameOver() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }

    // Check wall collision
    const isHittingLeftWall = snake[0].x < 0;
    const isHittingTopWall = snake[0].y < 0;
    const isHittingRightWall = snake[0].x >= boardWidth;
    const isHittingBottomWall = snake[0].y >= boardHeight;

    return (
      isHittingTopWall ||
      isHittingRightWall ||
      isHittingBottomWall ||
      isHittingLeftWall
    );
  }

  function moveFood() {
    let newX;
    let newY;

    do {
      newX = Math.floor(Math.random() * (boardWidth / cellSize)) * cellSize;
      newY = Math.floor(Math.random() * (boardHeight / cellSize)) * cellSize;
    } while (
      snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY)
    );

    food = { x: newX, y: newY };
  }

  function drawFoodAndSnake() {
    snakeBoard.innerHTML = "";

    snake.forEach((snakeCell) => {
      const element = drawDiv(snakeCell.x, snakeCell.y, "snake");
      snakeBoard.appendChild(element);
    });

    const foodElement = drawDiv(food.x, food.y, "food");
    snakeBoard.appendChild(foodElement);
  }

  function updateSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      score += 2;
      if(gameSpeed > 30) {
          gameSpeed -= 2; 
          clearInterval(intervalId); 
          gameLoop();
      }
      moveFood();
    } else {
      snake.pop();
    }
  }

  function gameLoop() {
  intervalId = setInterval(() => {
      if (!gameStarted) return;
      if (isGameOver()) {
        gameStarted = false;
        alert(`Game Over Score is ${score}`);
        document.location.reload();
        return;
      }
      updateSnake();
      drawScoreboard();
      drawFoodAndSnake();
    }, gameSpeed);
  }

  function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 40;
    const DOWN_KEY = 38;

    const keyPressed = event.keyCode;

    const isGoingUp = dy == -cellSize;
    const isGoingDown = dy == cellSize;
    const isGoingLeft = dx == -cellSize;
    const isGoingRight = dx == cellSize;

    if (keyPressed == LEFT_KEY && !isGoingRight) {
      dy = 0;
      dx = -cellSize;
    }
    if (keyPressed == RIGHT_KEY && !isGoingLeft) {
      dy = 0;
      dx = cellSize;
    }
    if (keyPressed == UP_KEY && !isGoingDown) {
      dy = cellSize;
      dx = 0;
    }
    if (keyPressed == DOWN_KEY && !isGoingUp) {
      dy = -cellSize;
      dx = 0;
    }
  }

  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop();
      document.addEventListener("keydown", changeDirection);
    }
  }

  function initiateGame() {
    /**
     * Adding score Board
     */
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    // scoreBoard.textContent = 10;
    document.body.insertBefore(scoreBoard, snakeBoard);

    /**
     * Adding Start Button
     */
    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.classList.add("start-game");
    document.body.appendChild(startButton);
    /**
     *  Adding eventlistener to startButton
     */
    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      runGame();
    });
  }

  initiateGame();
});
