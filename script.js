// script.js

const board = document.getElementById('game-board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const confetti = document.getElementById('confetti');
const vsAIButton = document.getElementById('vs-ai-button');
const vsPlayerButton = document.getElementById('vs-player-button');

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
    if (gameOver || (currentPlayer === 'yellow' && isAIEnabled)) return; // Stop if the game is over or it's AI's turn

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
                
                showConfetti(); // Show confetti
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
                console.log("AI's turn");
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

    if (validColumns.length === 0) {
        console.log("AI move aborted: No valid columns.");
        return; // No valid columns to choose from
    }

    const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
    console.log(`AI selects column ${randomCol}`);

    // Find the lowest available row in the chosen column
    let row = -1;
    for (let r = rows - 1; r >= 0; r--) {
        if (gameBoard[r][randomCol] === null) {
            row = r;
            break;
        }
    }

    if (row === -1) {
        console.log("AI move aborted: Column is full.");
        return; // Column is full
    }

    // Update the gameBoard array
    gameBoard[row][randomCol] = currentPlayer;

    // Update the visual representation
    const cell = board.querySelector(`.cell[data-row='${row}'][data-col='${randomCol}']`);
    if (cell) {
        cell.classList.add(currentPlayer);
    } else {
        console.log(`Cell not found for AI move at row ${row}, col ${randomCol}`);
    }

    console.log(`AI placed at row ${row}, col ${randomCol}`);

    // Check for win or draw
    if (checkWin(row, randomCol)) {
        message.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
        updateScore();
        gameOver = true; // Set the game as over
        console.log(`Game over: Player ${currentPlayer} wins.`);
        board.style.pointerEvents = 'none'; // Disable further clicks
        showConfetti(); // Show confetti
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
}

// Show confetti animation
function showConfetti() {
    confetti.style.display = 'flex'; // Show confetti
    confetti.innerHTML = '';
    for (let i = 0; i < 13; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti-piece');
        confettiPiece.style.left = `${Math.random() * 100}%`;
        confettiPiece.style.animation = `makeItRain ${Math.random() * 3 + 2}s linear`;
        confetti.appendChild(confettiPiece);
    }
    setTimeout(() => {
        confetti.style.display = 'none'; // Hide confetti after animation
    }, 4000); // Match duration with animation duration
}

// Restart game
restartButton.addEventListener('click', () => {
    gameBoard = Array(rows).fill().map(() => Array(cols).fill(null));
    currentPlayer = 'red';
    message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    board.style.pointerEvents = 'auto'; // Enable clicks
    gameOver = false;
    createBoard();
    console.log("Game restarted.");
});

// Set game mode
function setGameMode(mode) {
    if (mode === 'AI') {
        isAIEnabled = true;
        console.log("Game mode set to Player vs AI.");
    } else if (mode === 'Player') {
        isAIEnabled = false;
        console.log("Game mode set to Player vs Player.");
    }
    gameBoard = Array(rows).fill().map(() => Array(cols).fill(null));
    currentPlayer = 'red';
    message.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
    board.style.pointerEvents = 'auto'; // Enable clicks
    gameOver = false;
    createBoard();
}

// Event listeners for game mode buttons
vsAIButton.addEventListener('click', () => setGameMode('AI'));
vsPlayerButton.addEventListener('click', () => setGameMode('Player'));

// Set initial game state
createBoard();
