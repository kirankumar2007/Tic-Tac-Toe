document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const gameStatus = document.getElementById('gameStatus');
    const scoreboard = document.getElementById('scoreboard');
    const restartBtn = document.getElementById('restartBtn');
    const undoBtn = document.getElementById('undoBtn');
    let boardSize = 3; // Default 3x3 board
    let currentPlayer = 'X';
    let gameActive = true;
    let gameHistory = [];
    let scores = { X: 0, O: 0 };

    function initializeBoard() {
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
        board.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const cell = event.target;
        if (!gameActive || cell.textContent !== '') return;
        
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        gameHistory.push({ cellIndex: [...board.children].indexOf(cell), player: currentPlayer });

        if (checkWin()) {
            gameStatus.textContent = `Player ${currentPlayer} wins!`;
            scores[currentPlayer]++;
            scoreboard.textContent = `X: ${scores.X} | O: ${scores.O}`;
            gameActive = false;
        } else if (gameHistory.length === boardSize * boardSize) {
            gameStatus.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function checkWin() {
        const winPatterns = [];

        // Rows
        for (let i = 0; i < boardSize; i++) {
            winPatterns.push([...Array(boardSize).keys()].map(j => i * boardSize + j));
        }

        // Columns
        for (let i = 0; i < boardSize; i++) {
            winPatterns.push([...Array(boardSize).keys()].map(j => i + j * boardSize));
        }

        // Diagonals
        winPatterns.push([...Array(boardSize).keys()].map(i => i * (boardSize + 1)));
        winPatterns.push([...Array(boardSize).keys()].map(i => (i + 1) * (boardSize - 1)));

        return winPatterns.some(pattern =>
            pattern.every(index => board.children[index].textContent === currentPlayer)
        );
    }

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        gameHistory = [];
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
        initializeBoard();
    }

    function undoMove() {
        if (gameHistory.length === 0 || !gameActive) return;
        const lastMove = gameHistory.pop();
        const lastCell = board.children[lastMove.cellIndex];
        lastCell.textContent = '';
        lastCell.classList.remove('x', 'o');
        currentPlayer = lastMove.player;
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }

    restartBtn.addEventListener('click', restartGame);
    undoBtn.addEventListener('click', undoMove);

    // Initialize the game board
    initializeBoard();
});
