const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const undoButton = document.getElementById('undoButton');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const playerXSelect = document.getElementById('playerX');
const playerOSelect = document.getElementById('playerO');
const playerXName = document.getElementById('playerXName');
const playerOName = document.getElementById('playerOName');
const aiDifficultySelect = document.getElementById('aiDifficulty');
const boardSizeSelect = document.getElementById('boardSize');
const gameHistory = document.getElementById('gameHistory');

let currentPlayer = 'X';
let gameActive = false;
let scores = { X: 0, O: 0 };
let moveHistory = [];
let boardState = [];
let boardSize = 3;
let winningCombinations = [];

function startGame() {
    gameActive = true;
    currentPlayer = 'X';
    moveHistory = [];
    boardState = Array(boardSize * boardSize).fill('');
    updateBoard();
    message.textContent = '';
    if (isAITurn()) {
        setTimeout(makeAIMove, 500);
    }
    updateGameHistory('Game started');
}

function updateBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        if (boardState[i]) {
            cell.classList.add(boardState[i].toLowerCase());
        }
    }
}

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);
    if (boardState[index] || !gameActive || isAITurn()) return;

    makeMove(index);
    if (gameActive && isAITurn()) {
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index) {
    boardState[index] = currentPlayer;
    moveHistory.push(index);
    updateBoard();
    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        switchPlayer();
    }
    updateGameHistory(`${getCurrentPlayerName()} placed ${currentPlayer} at position ${index}`);
}

function getCurrentPlayerName() {
    return currentPlayer === 'X' ? playerXName.value : playerOName.value;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function isAITurn() {
    return (currentPlayer === 'X' && playerXSelect.value === 'ai') ||
           (currentPlayer === 'O' && playerOSelect.value === 'ai');
}

function makeAIMove() {
    if (!gameActive) return;
    
    const availableMoves = boardState.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);
    let bestMove;

    switch (aiDifficultySelect.value) {
        case 'easy':
            bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            break;
        case 'medium':
            bestMove = Math.random() < 0.5 ? findBestMove() : availableMoves[Math.floor(Math.random() * availableMoves.length)];
            break;
        case 'hard':
            bestMove = findBestMove();
            break;
    }

    makeMove(bestMove);
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = currentPlayer;
            let score = minimax(boardState, 0, false);
            boardState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) return isMaximizing ? -1 : 1;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer === 'X' ? 'O' : 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return boardState[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return boardState.every(cell => cell !== '');
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        message.textContent = "It's a draw!";
        updateGameHistory("Game ended in a draw");
    } else {
        message.textContent = `${getCurrentPlayerName()} wins!`;
        updateGameHistory(`${getCurrentPlayerName()} won the game`);
        highlightWinningCells();
        updateScore();
    }
}

function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => boardState[index] === currentPlayer)) {
            combination.forEach(index => {
                board.children[index].classList.add('win');
            });
        }
    });
}

function updateScore() {
    scores[currentPlayer]++;
    scoreX.textContent = scores['X'];
    scoreO.textContent = scores['O'];
}

function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        boardState[lastMove] = '';
        switchPlayer();
        updateBoard();
        updateGameHistory(`Undid last move`);
        if (isAITurn()) {
            undoMove(); // Undo AI's move as well
        }
    }
}

function updateGameHistory(message) {
    const historyEntry = document.createElement('div');
    historyEntry.textContent = message;
    gameHistory.prepend(historyEntry);
}

function generateWinningCombinations() {
    winningCombinations = [];

    // Rows
    for (let i = 0; i < boardSize; i++) {
        winningCombinations.push(Array.from({length: boardSize}, (_, j) => i * boardSize + j));
    }

    // Columns
    for (let i = 0; i < boardSize; i++) {
        winningCombinations.push(Array.from({length: boardSize}, (_, j) => j * boardSize + i));
    }

    // Diagonals
    winningCombinations.push(Array.from({length: boardSize}, (_, i) => i * boardSize + i));
    winningCombinations.push(Array.from({length: boardSize}, (_, i) => (i + 1) * boardSize - (i + 1)));
}

function restartGame() {
    startGame();
    updateGameHistory('Game restarted');
}

function initializeGame() {
    boardSize = parseInt(boardSizeSelect.value);
    generateWinningCombinations();
    startGame();
}

restartButton.addEventListener('click', restartGame);
undoButton.addEventListener('click', undoMove);
boardSizeSelect.addEventListener('change', initializeGame);
aiDifficultySelect.addEventListener('change', initializeGame);

playerXSelect.addEventListener('change', () => {
    if (isAITurn()) {
        makeAIMove();
    }
});

playerOSelect.addEventListener('change', () => {
    if (isAITurn()) {
        makeAIMove();
    }
});

initializeGame();
