let boardSize = 3;
let currentPlayer = 'X';
let gameBoard = [];
let isGameOver = false;
let difficulty = 'easy';

const themeToggleButton = document.getElementById('theme-toggle');
const difficultySelect = document.getElementById('difficulty');
const sizeSelect = document.getElementById('size');
const boardElement = document.getElementById('game-board');
const messageElement = document.getElementById('message');

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

difficultySelect.addEventListener('change', (event) => {
    difficulty = event.target.value;
});

sizeSelect.addEventListener('change', (event) => {
    boardSize = parseInt(event.target.value);
    resetGame();
});

function initBoard() {
    gameBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (isGameOver || gameBoard[row][col]) return;

    gameBoard[row][col] = currentPlayer;
    updateBoard();

    if (checkWin(row, col)) {
        messageElement.textContent = `Player ${currentPlayer} wins!`;
        isGameOver = true;
        return;
    }

    if (checkDraw()) {
        messageElement.textContent = 'It\'s a draw!';
        isGameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O' && !isGameOver) {
        aiMove();
    }
}

function updateBoard() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        cell.textContent = gameBoard[row][col];
    });
}

function checkWin(row, col) {
    const win = (arr) => arr.every(cell => cell === currentPlayer);

    const rowCheck = win(gameBoard[row]);
    const colCheck = win(gameBoard.map(r => r[col]));
    const diag1Check = win(gameBoard.map((r, i) => r[i]));
    const diag2Check = win(gameBoard.map((r, i) => r[boardSize - 1 - i]));

    return rowCheck || colCheck || diag1Check || diag2Check;
}

function checkDraw() {
    return gameBoard.flat().every(cell => cell);
}

function aiMove() {
    let move = getBestMove();
    if (move) {
        handleCellClick(move.row, move.col);
    }
}

function getBestMove() {
    let bestMove;
    switch (difficulty) {
        case 'easy':
            bestMove = getRandomMove();
            break;
        case 'medium':
            bestMove = getMediumMove();
            break;
        case 'hard':
            bestMove = getHardMove();
            break;
    }
    return bestMove;
}

function getRandomMove() {
    const emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!gameBoard[i][j]) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getMediumMove() {
    // Simple medium AI strategy
    // TODO: Improve this
    return getRandomMove();
}

function getHardMove() {
    // Implement a more sophisticated AI
    // TODO: Implement Minimax algorithm for better AI
    return getRandomMove();
}

function resetGame() {
    currentPlayer = 'X';
    isGameOver = false;
    messageElement.textContent = '';
    initBoard();
}

initBoard();
