document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0; // Score of the game
    let gameStarted = false; // Game status
    let food = { x: 300, y: 200 }; // Initial food position
    let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }]; // Snake body

    let dx = cellSize; // Initial movement in x direction
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;
    
    let touchStartX = 0;
    let touchStartY = 0;

    function moveFood() {
        let newX, newY;

        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while (snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));

        food = { x: newX, y: newY };
    }

    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead); // Add new head to the snake

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();

            if (gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }
        } else {
            snake.pop(); // Remove tail
        }
    }

    function changeDirection(e) {
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;

        if (e.key === 'ArrowUp' && !isGoingDown) {
            dx = 0;
            dy = -cellSize;
        } else if (e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if (e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if (e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function handleSwipeDirection(direction) {
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;

        if (direction === 'up' && !isGoingDown) {
            dx = 0;
            dy = -cellSize;
        } else if (direction === 'down' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if (direction === 'left' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if (direction === 'right' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // Clear the game arena

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        });

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        // Snake collision checks
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }

        // Wall collision checks
        const hitLeftWall = snake[0].x < 0; // snake[0] -> head
        const hitRightWall = snake[0].x > arenaSize - cellSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > arenaSize - cellSize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if (isGameOver()) {
                clearInterval(intervalId);
                gameStarted = false;
                alert('Game Over' + '\n' + 'Your Score: ' + score);
                return;
            }
            drawFoodAndSnake();
            updateSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    function runGame() {
        if (!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            document.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const diffX = touchEndX - touchStartX;
                const diffY = touchEndY - touchStartY;

                if (Math.abs(diffX) > Math.abs(diffY)) {
                    // Horizontal swipe
                    handleSwipeDirection(diffX > 0 ? 'right' : 'left');
                } else {
                    // Vertical swipe
                    handleSwipeDirection(diffY > 0 ? 'down' : 'up');
                }
            });

            gameLoop();
        }
    }

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena); // Insert score board before game arena

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function startGame() {
            startButton.style.display = 'none'; // Hide start button
            runGame();
        });

        document.body.appendChild(startButton); // Append start button to the body
    }

    initiateGame();
});
