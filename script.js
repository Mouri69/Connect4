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
    const col = event.target.dataset.col;

    // Find the first empty cell in the clicked column
    for (let row = rows - 1; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = currentPlayer;
            const cell = board.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer);

            if (checkWin(row, col)) {
                message.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
                updateScore();
                board.style.pointerEvents = 'none'; // Disable further clicks
                return;
            }

            if (isBoardFull()) {
                message.textContent = "It's a draw!";
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
function checkWin(row, col) {
    console.log(`Checking win for ${currentPlayer} at row ${row}, col ${col}`);
    return checkDirection(row, col, 1, 0) || // Horizontal
           checkDirection(row, col, 0, 1) || // Vertical
           checkDirection(row, col, 1, 1) || // Diagonal /
           checkDirection(row, col, 1, -1);  // Diagonal \
}

// Check a specific direction for 4 in a row
function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    count += countCells(row, col, rowDir, colDir);
    count += countCells(row, col, -rowDir, -colDir);
    console.log(`Direction (${rowDir}, ${colDir}) count: ${count}`);
    return count >= 4;
}

// Count consecutive cells in a direction
function countCells(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    let count = 0;
    while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
        count++;
        r += rowDir;
        c += colDir;
    }
    return count;
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
}

// Simple AI move
function aiMove() {
    let validColumns = [];
    for (let col = 0; col < cols; col++) {
        if (gameBoard[0][col] === null) {
            validColumns.push(col);
        }
    }
    const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
    handleCellClick({target: board.querySelector(`.cell[data-col='${randomCol}']`)});
}

// Restart the game
restartButton.addEventListener('click', () => {
    gameBoard = Array(rows).fill().map(() => Array(cols).fill(null));
    currentPlayer = 'red';
    board.style.pointerEvents = 'auto';
    createBoard();
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
    board.style.pointerEvents = 'auto';
    createBoard();
}

// Initialize the game
createBoard();
