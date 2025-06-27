document.addEventListener("DOMContentLoaded", () => {
    const snakeBoard = document.getElementById("snake-board"); 
    const snakeBoardSize = 600; 
    const cellSize = 20; 

    let score = 0; 
    let gameStarted = false; 
    let food = {x:300 , y:200};
    let snake = [{x:160, y:200}, {x:140, y:200}, {x:120, y:200}];
    let dx = cellSize;  //* displacement with x-axis  
    let dy = 0;    //* displacement with y-axis  


    function drawScoreboard() {
        const scoreBoard = document.getElementById("score-board"); 
        scoreBoard.textContent = `Score : ${score}`;
    } 

   function drawDiv(x,y, className) {
    const div = document.createElement("div"); 
    div.classList.add(className); 
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;  

    return div; 
   }

    function drawFoodAndSnake() {
        snakeBoard.innerHTML = ""; 
        const foodElement = drawDiv(food.x, food.y, 'food'); 
        snakeBoard.appendChild(foodElement); 

    }

   function gameLoop() {
    setInterval(() => { 
        drawScoreboard(); 
        drawFoodAndSnake(); 
    }, 1000)
   } 

   function runGame() {
    gameStarted = true; 
    gameLoop(); 
   }


    function initiateGame() { 
        /**
         * Adding score Board 
         */
        const scoreBoard = document.createElement("div"); 
        scoreBoard.id = 'score-board';
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
        })


    }

    initiateGame(); 



})