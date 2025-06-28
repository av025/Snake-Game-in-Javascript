/**
 * This event listener (DOMContentLoaded) ensures that all DOM nodes are fully created and rendered before executing any JavaScript.
 */

document.addEventListener("DOMContentLoaded", () => {

  // Accessing the snake board using getElementById() and storing it in a variable
  const snakeBoard = document.getElementById("snake-board");

  // Creating essential game variables
  const boardWidth = 800;
  const boardHeight = 500;
  // These define the width and height of the snake board respectively

  const cellSize = 20;
  // This defines the size of each cell (block) on the snake board

  let gameSpeed = 200;
  // Initial speed of the snake in milliseconds

  let score = 0;
  // Variable to store the player's score

  let gameStarted = false;
  // Indicates whether the game has started or not

  let intervalId;
  // Stores the ID of the interval so we can clear it when needed

  /**
   * The 'food' variable defines the initial position of the food on the board.
   * The 'snake' variable is an array of objects, each representing a segment of the snake using x and y coordinates.
   * We're using simple x-y objects instead of a matrix to simplify movement and position tracking.
   */
  let food = { x: 300, y: 200 };
  let snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
    { x: 100, y: 200 },
  ];

  /**
   * 'dx' and 'dy' represent the initial direction (displacement) of the snake.
   * Initially, the snake moves 20px on the x-axis and 0 on the y-axis.
   */
  let dx = cellSize;
  let dy = 0;

  /**
   * The drawScoreboard function updates the scoreboard with the current score.
   */
  function drawScoreboard() {
    const scoreBoard = document.getElementById("score-board");
    scoreBoard.textContent = `Score: ${score}`;
  }

  /**
   * drawDiv is a reusable function that creates a div at a given (x, y) coordinate
   * and assigns it a class. It's used to render both snake parts and food.
   */
  function drawDiv(x, y, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.style.position = "absolute";
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;

    return div;
  }

  /**
   * The isGameOver function checks two main conditions:
   * 1. If the snake collides with itself.
   * 2. If the snake hits any of the board's boundaries (walls).
   */
  function isGameOver() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }

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

  /**
   * The moveFood function generates a new random position for the food.
   * It ensures the food doesn't appear on the snake's body.
   * 
   * Formula used:
   *   Math.floor(Math.random() * (boardSize / cellSize)) * cellSize
   */
  function moveFood() {
    let newX;
    let newY;

    do {
      newX = Math.floor(Math.random() * (boardWidth / cellSize)) * cellSize;
      newY = Math.floor(Math.random() * (boardHeight / cellSize)) * cellSize;
    } while (
      snake.some((segment) => segment.x === newX && segment.y === newY)
    );

    food = { x: newX, y: newY };
  }

  /**
   * The drawFoodAndSnake function clears the board and re-renders the snake and food
   * using absolute positioning.
   */
  function drawFoodAndSnake() {
    snakeBoard.innerHTML = "";

    snake.forEach((segment) => {
      const element = drawDiv(segment.x, segment.y, "snake");
      snakeBoard.appendChild(element);
    });

    const foodElement = drawDiv(food.x, food.y, "food");
    snakeBoard.appendChild(foodElement);
  }

  /**
   * The updateSnake function handles the movement of the snake.
   * - It adds a new head based on current direction (dx, dy).
   * - If food is eaten, score increases and speed increases.
   * - If not, the tail segment is removed to simulate movement.
   */
  function updateSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      score += 2;
      if (gameSpeed > 30) {
        gameSpeed -= 2;
        clearInterval(intervalId);
        gameLoop();
      }
      moveFood();
    } else {
      snake.pop();
    }
  }

  /**
   * gameLoop runs the core game functions at regular intervals:
   * - Checks if the game is over.
   * - Updates the snake's position.
   * - Updates the scoreboard.
   * - Re-renders the snake and food.
   */
  function gameLoop() {
    intervalId = setInterval(() => {
      if (!gameStarted) return;
      if (isGameOver()) {
        gameStarted = false;
        alert(`Game Over! Your score: ${score}`);
        document.location.reload();
        return;
      }
      updateSnake();
      drawScoreboard();
      drawFoodAndSnake();
    }, gameSpeed);
  }

  /**
   * changeDirection handles keyboard arrow key inputs
   * to change the direction of the snake.
   * It prevents the snake from reversing into itself.
   */
  function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 40;
    const DOWN_KEY = 38;

    const keyPressed = event.keyCode;

    const isGoingUp = dy === -cellSize;
    const isGoingDown = dy === cellSize;
    const isGoingLeft = dx === -cellSize;
    const isGoingRight = dx === cellSize;

    if (keyPressed === LEFT_KEY && !isGoingRight) {
      dy = 0;
      dx = -cellSize;
    }
    if (keyPressed === RIGHT_KEY && !isGoingLeft) {
      dy = 0;
      dx = cellSize;
    }
    if (keyPressed === UP_KEY && !isGoingDown) {
      dy = cellSize;
      dx = 0;
    }
    if (keyPressed === DOWN_KEY && !isGoingUp) {
      dy = -cellSize;
      dx = 0;
    }
  }

  /**
   * runGame starts the game by:
   * - Setting gameStarted to true.
   * - Starting the game loop.
   * - Adding keyboard event listener to control the snake.
   */
  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop();
      document.addEventListener("keydown", changeDirection);
    }
  }

  /**
   * initiateGame sets up the scoreboard and start button.
   * Clicking the start button triggers the game using runGame().
   */
  function initiateGame() {
    const scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    document.body.insertBefore(scoreBoard, snakeBoard);

    const startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    startButton.classList.add("start-game");
    document.body.appendChild(startButton);

    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      runGame();
    });
  }

  initiateGame();
});

