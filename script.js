// script.js

const board = document.getElementById('game-board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

const rows = 6;
const cols = 7;
let currentPlayer = 'red';
let gameBoard = Array(rows).fill().map(() => Array(cols).fill(null));
let redScore = 0;
let yellowScore = 0;
let isAIEnabled = false;
let gameOver = false;

// Initialize the board
function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
    message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
}

// Handle cell clicks
function handleCellClick(event) {
    if (gameOver) return; // Stop if the game is over

    const col = parseInt(event.target.dataset.col);

    // Find the first empty cell in the clicked column
    for (let row = rows - 1; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = currentPlayer;
            const cell = board.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer);

            console.log(`Player ${currentPlayer} placed at row ${row}, col ${col}`);

            if (checkWin(row, col)) {
                message.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
                updateScore();
                gameOver = true; // Set the game as over
                console.log(`Game over: Player ${currentPlayer} wins.`);
                board.style.pointerEvents = 'none'; // Disable further clicks
                return;
            }

            if (isBoardFull()) {
                message.textContent = "It's a draw!";
                console.log("The game ended in a draw.");
                gameOver = true; // Set the game as over for a draw
                return;
            }

            // Switch players
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;

            // If AI is enabled and it's AI's turn, make AI move
            if (isAIEnabled && currentPlayer === 'yellow') {
                setTimeout(aiMove, 500); // Delay AI move to feel natural
            }
            break;
        }
    }
}

// Check for a win
// script.js

// Check for a win
function checkWin(row, col) {
    console.log(`Checking win for ${currentPlayer} at row ${row}, col ${col}`);
    return checkDirection(row, col, 1, 0) || // Horizontal
           checkDirection(row, col, 0, 1) || // Vertical
           checkDirection(row, col, 1, 1) || // Diagonal /
           checkDirection(row, col, 1, -1);  // Diagonal \
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1; // Start with the current piece
    let winningCells = [{ row, col }]; // Include the initial cell
    let r = row + rowDir;
    let c = col + colDir;

    // Count in the positive direction
    while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
        winningCells.push({ row: r, col: c });
        count++;
        console.log(`Positive direction: counting (${r}, ${c}) - count: ${count}`);
        r += rowDir;
        c += colDir;
    }

    // Count in the negative direction
    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
        winningCells.push({ row: r, col: c });
        count++;
        console.log(`Negative direction: counting (${r}, ${c}) - count: ${count}`);
        r -= rowDir;
        c -= colDir;
    }

    console.log(`Total count in direction (${rowDir}, ${colDir}): ${count}`);

    if (count >= 4) {
        // Highlight winning cells
        winningCells.forEach(cell => {
            const cellElement = board.querySelector(`.cell[data-row='${cell.row}'][data-col='${cell.col}']`);
            cellElement.classList.add('winning');
        });
        return true;
    }

    return false;
}

// Check if the board is full
function isBoardFull() {
    return gameBoard[0].every(cell => cell !== null);
}

// Update score based on the winning player
function updateScore() {
    if (currentPlayer === 'red') {
        redScore++;
        document.getElementById('red-score').textContent = `Red: ${redScore}`;
    } else {
        yellowScore++;
        document.getElementById('yellow-score').textContent = `Yellow: ${yellowScore}`;
    }
    console.log(`Updated score - Red: ${redScore}, Yellow: ${yellowScore}`);
}

// Simple AI move
function aiMove() {
    if (gameOver) return; // Stop if the game is over

    let validColumns = [];
    for (let col = 0; col < cols; col++) {
        if (gameBoard[0][col] === null) {
            validColumns.push(col);
        }
    }
    const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
    console.log(`AI selects column ${randomCol}`);
    handleCellClick({target: board.querySelector(`.cell[data-col='${randomCol}']`)});
}

// Restart the game
restartButton.addEventListener('click', () => {
    gameBoard = Array(rows).fill().map(() => Array(cols).fill(null));
    currentPlayer = 'red';
    gameOver = false;
    board.style.pointerEvents = 'auto';
    createBoard();
    console.log("Game restarted.");
});

// Mode selection
document.getElementById('1v1-mode').addEventListener('click', () => {
    isAIEnabled = false;
    startGame();
});

document.getElementById('ai-mode').addEventListener('click', () => {
    isAIEnabled = true;
    startGame();
});

function startGame() {
    gameBoard = Array(rows).fill().map(() => Array(cols).fill(null));
    currentPlayer = 'red';
    gameOver = false;
    board.style.pointerEvents = 'auto';
    createBoard();
    console.log("New game started.");
}

// Initialize the game
createBoard();
