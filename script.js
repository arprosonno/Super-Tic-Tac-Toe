const board = document.getElementById("board");
const statusDiv = document.getElementById("game-status");
const restartButton = document.getElementById("restart-button");

let currentPlayer = "X";
let nextBoard = null;
let gameActive = true;
let largeBoard = Array(3).fill(null).map(() => Array(3).fill(null));
let smallBoards = Array(9).fill(null).map(() => Array(3).fill(null).map(() => Array(3).fill(null)));
let wonSmallBoards = Array(9).fill(false);  // Track which small boards are won
let drawSmallBoards = Array(9).fill(false); // Track which small boards are drawn

function initializeGame() {
    board.innerHTML = "";
    gameActive = true;
    currentPlayer = "X";
    nextBoard = null;
    largeBoard = Array(3).fill(null).map(() => Array(3).fill(null));
    smallBoards = Array(9).fill(null).map(() => Array(3).fill(null).map(() => Array(3).fill(null)));
    wonSmallBoards = Array(9).fill(false);  // Reset won small boards
    drawSmallBoards = Array(9).fill(false); // Reset drawn small boards
    statusDiv.textContent = "Player X's Turn";
    createLargeBoard();
}

function createLargeBoard() {
    for (let i = 0; i < 9; i++) {
        const smallBoard = document.createElement("div");
        smallBoard.classList.add("small-board");
        smallBoard.dataset.index = i;

        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = j;
            cell.addEventListener("click", () => handleCellClick(i, j, cell));
            smallBoard.appendChild(cell);
        }

        board.appendChild(smallBoard);
    }
}

function handleCellClick(smallBoardIndex, cellIndex, cell) {
    if (!gameActive || cell.textContent !== "") return;

    // If the small block is already won or drawn, allow play anywhere
    if (wonSmallBoards[smallBoardIndex] || drawSmallBoards[smallBoardIndex]) {
        nextBoard = null;  // Allow play anywhere
    }

    if (nextBoard !== null && smallBoardIndex !== nextBoard) {
        alert(`You must play in the highlighted board!`);
        return;
    }

    const smallRow = Math.floor(cellIndex / 3);
    const smallCol = cellIndex % 3;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    smallBoards[smallBoardIndex][smallRow][smallCol] = currentPlayer;

    if (checkWin(smallBoards[smallBoardIndex])) {
        markSmallBoardWin(smallBoardIndex, currentPlayer);
        const largeRow = Math.floor(smallBoardIndex / 3);
        const largeCol = smallBoardIndex % 3;
        largeBoard[largeRow][largeCol] = currentPlayer;
        wonSmallBoards[smallBoardIndex] = true;  // Mark this small board as won
    } else if (isDraw(smallBoards[smallBoardIndex])) {
        markSmallBoardDraw(smallBoardIndex);
        drawSmallBoards[smallBoardIndex] = true;  // Mark this small board as drawn
    }

    if (checkWin(largeBoard)) {
        statusDiv.textContent = `Player ${currentPlayer} Wins the Game!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    // Determine next board based on the move
    nextBoard = cellIndex;
    highlightNextBoard(nextBoard);

    // If the next board is already won or drawn, reset the nextBoard to null (allowing play anywhere)
    if (wonSmallBoards[nextBoard] || drawSmallBoards[nextBoard]) {
        nextBoard = null;
    }

    statusDiv.textContent = `Player ${currentPlayer}'s Turn`;
}

function highlightNextBoard(boardIndex) {
    // If nextBoard is null (play anywhere), or if the nextBoard is already won or drawn, remove the highlight
    if (nextBoard === null || wonSmallBoards[nextBoard] || drawSmallBoards[nextBoard]) {
        document.querySelectorAll(".small-board").forEach((board) => {
            board.classList.remove("highlight");
        });
    } else {
        document.querySelectorAll(".small-board").forEach((board, index) => {
            board.classList.toggle("highlight", index === boardIndex);
        });
    }
}

function markSmallBoardWin(boardIndex, player) {
    const smallBoard = document.querySelector(`.small-board[data-index="${boardIndex}"]`);
    smallBoard.innerHTML = `<div class="winner-block">${player}</div>`;
    smallBoard.classList.add("disabled");
}

function markSmallBoardDraw(boardIndex) {
    const smallBoard = document.querySelector(`.small-board[data-index="${boardIndex}"]`);
    smallBoard.innerHTML = `<div class="winner-block">Draw</div>`;
    smallBoard.classList.add("disabled");
}

function checkWin(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return lines.some(line =>
        line.every(index => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            return board[row][col] === currentPlayer;
        })
    );
}

function isDraw(board) {
    return board.every(row => row.every(cell => cell !== null));
}

restartButton.addEventListener("click", initializeGame);
initializeGame();
