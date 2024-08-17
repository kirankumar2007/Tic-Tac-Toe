const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const playerXSelect = document.getElementById('playerX');
const playerOSelect = document.getElementById('playerO');
const aiDifficultySelect = document.getElementById('aiDifficulty');

let currentPlayer = 'X';
let gameActive = false;
let scores = { X: 0, O: 0 };
let aiPlayer = 'O';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'win');
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    message.textContent = '';
    if (isAITurn()) {
        setTimeout(makeAIMove, 500);
    }
}

function handleCellClick(e) {
    const cell = e.target;
    placeMark(cell, currentPlayer);
    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        switchPlayer();
        if (isAITurn()) {
            setTimeout(makeAIMove, 500);
        }
    }
}

function placeMark(cell, player) {
    cell.classList.add(player.toLowerCase());
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
    
    let bestScore = -Infinity;
    let bestMove;
    const difficulty = aiDifficultySelect.value;
    
    cells.forEach((cell, index) => {
        if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
            cell.classList.add(currentPlayer.toLowerCase());
            let score = minimax(0, false, difficulty);
            cell.classList.remove(currentPlayer.toLowerCase());
            if (score > bestScore) {
                bestScore = score;
                bestMove = cell;
            }
        }
    });

    if (bestMove) {
        placeMark(bestMove, currentPlayer);
        if (checkWin()) {
            endGame(false);
        } else if (checkDraw()) {
            endGame(true);
        } else {
            switchPlayer();
        }
    }
}

function minimax(depth, isMaximizing, difficulty) {
    if (checkWin()) return isMaximizing ? -1 : 1;
    if (checkDraw()) return 0;
    
    // Limit depth based on difficulty
    const maxDepth = difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 3 : Infinity);
    if (depth >= maxDepth) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach(cell => {
            if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                cell.classList.add(currentPlayer.toLowerCase());
                let score = minimax(depth + 1, false, difficulty);
                cell.classList.remove(currentPlayer.toLowerCase());
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        cells.forEach(cell => {
            if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                cell.classList.add(currentPlayer === 'X' ? 'o' : 'x');
                let score = minimax(depth + 1, true, difficulty);
                cell.classList.remove(currentPlayer === 'X' ? 'o' : 'x');
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentPlayer.toLowerCase());
        });
    });
}

function checkDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        message.textContent = "It's a draw!";
    } else {
        message.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells();
        updateScore();
    }
}

function highlightWinningCells() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => cells[index].classList.contains(currentPlayer.toLowerCase()))) {
            combination.forEach(index => cells[index].classList.add('win'));
        }
    });
}

function updateScore() {
    scores[currentPlayer]++;
    scoreX.textContent = scores['X'];
    scoreO.textContent = scores['O'];
}

function restartGame() {
    startGame();
}

restartButton.addEventListener('click', restartGame);
playerXSelect.addEventListener('change', startGame);
playerOSelect.addEventListener('change', startGame);
aiDifficultySelect.addEventListener('change', startGame);

startGame();