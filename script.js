let boardSize = 3;
let currentPlayer = 'X';
let gameBoard = [];
let isGameOver = false;

const boardElement = document.getElementById('game-board');
const messageElement = document.getElementById('message');
const playAgainButton = document.getElementById('play-again');
const bgElement = document.querySelector('.bg');

function initBoard() {
    gameBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    boardElement.innerHTML = '';
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'box align';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

function handleCellClick(index) {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    if (isGameOver || gameBoard[row][col]) return;

    gameBoard[row][col] = currentPlayer;
    updateBoard();

    if (checkWin(row, col)) {
        messageElement.textContent = `${currentPlayer} wins!`;
        isGameOver = true;
        playAgainButton.style.display = 'inline';
        return;
    }

    if (checkDraw()) {
        messageElement.textContent = "It's a draw!";
        isGameOver = true;
        playAgainButton.style.display = 'inline';
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    bgElement.style.left = currentPlayer === 'O' ? '85px' : '0';
}

function updateBoard() {
    const cells = boardElement.querySelectorAll('.box');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        cell.textContent = gameBoard[row][col] || '';
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

playAgainButton.addEventListener('click', () => {
    isGameOver = false;
    currentPlayer = 'X';
    bgElement.style.left = '0';
    messageElement.textContent = '';
    playAgainButton.style.display = 'none';
    initBoard();
});

initBoard();
