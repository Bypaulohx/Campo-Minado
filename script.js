const board = document.getElementById("game-board");
const difficultySelect = document.getElementById("difficulty");
const message = document.getElementById("message");

let gridSize, mineCount, boardData, revealedCells, flaggedCells;

function startGame() {
    message.textContent = "";
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        gridSize = 8;
        mineCount = 10;
    } else if (difficulty === "medium") {
        gridSize = 10;
        mineCount = 20;
    } else {
        gridSize = 12;
        mineCount = 30;
    }

    revealedCells = 0;
    flaggedCells = 0;
    generateBoard();
}

function generateBoard() {
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;

    boardData = Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(0));

    placeMines();

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", () => revealCell(i, j));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(i, j);
            });
            board.appendChild(cell);
        }
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);

        if (boardData[row][col] !== "M") {
            boardData[row][col] = "M";
            minesPlaced++;
        }
    }
}

function revealCell(row, col) {
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!cell || cell.classList.contains("revealed") || cell.classList.contains("flag")) return;

    cell.classList.add("revealed");

    if (boardData[row][col] === "M") {
        cell.classList.add("mine");
        message.textContent = "💥 BOOM! Você perdeu!";
        setTimeout(startGame, 2000);
        return;
    }

    let minesAround = countMinesAround(row, col);
    if (minesAround > 0) {
        cell.textContent = minesAround;
    } else {
        revealAdjacentCells(row, col);
    }

    revealedCells++;
    checkWin();
}

function countMinesAround(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let r = row + i;
            let c = col + j;
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && boardData[r][c] === "M") {
                count++;
            }
        }
    }
    return count;
}

function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let r = row + i;
            let c = col + j;
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
                revealCell(r, c);
            }
        }
    }
}

function toggleFlag(row, col) {
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!cell || cell.classList.contains("revealed")) return;

    if (cell.classList.contains("flag")) {
        cell.classList.remove("flag");
        flaggedCells--;
    } else {
        cell.classList.add("flag");
        flaggedCells++;
    }
    checkWin();
}

function checkWin() {
    if (revealedCells + mineCount === gridSize * gridSize) {
        message.textContent = "🎉 Parabéns! Você venceu!";
    }
}