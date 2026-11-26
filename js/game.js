window.Minesweeper = window.Minesweeper || {};

(function (Namespace) {
    class Game {
        constructor(size, mines) {
            this.size = size;
            this.mineCount = mines;
            this.reset();
        }

        reset() {
            this.cells = Array.from({ length: this.size }, () =>
                Array.from({ length: this.size }, () => ({
                    mine: false,
                    revealed: false,
                    flagged: false,
                    adjacent: 0,
                    wrong: false
                }))
            );
            this.minesPlaced = false;
            this.revealedCount = 0;
            this.flagCount = 0;
            this.moves = 0;
            this.status = 'ready';
        }

        neighbors(row, col, callback) {
            for (let r = row - 1; r <= row + 1; r += 1) {
                for (let c = col - 1; c <= col + 1; c += 1) {
                    if ((r !== row || c !== col) && r >= 0 && r < this.size && c >= 0 && c < this.size) {
                        callback(r, c);
                    }
                }
            }
        }

        shuffle(positions) {
            for (let i = positions.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }
            return positions;
        }

        placeMines(safeRow, safeCol) {
            const forbidden = new Set([`${safeRow},${safeCol}`]);
            this.neighbors(safeRow, safeCol, (row, col) => forbidden.add(`${row},${col}`));

            let positions = [];
            for (let row = 0; row < this.size; row += 1) {
                for (let col = 0; col < this.size; col += 1) {
                    if (!forbidden.has(`${row},${col}`)) positions.push([row, col]);
                }
            }

            if (positions.length < this.mineCount) {
                positions = [];
                for (let row = 0; row < this.size; row += 1) {
                    for (let col = 0; col < this.size; col += 1) {
                        if (row !== safeRow || col !== safeCol) positions.push([row, col]);
                    }
                }
            }

            this.shuffle(positions)
                .slice(0, this.mineCount)
                .forEach(([row, col]) => {
                    this.cells[row][col].mine = true;
                });

            for (let row = 0; row < this.size; row += 1) {
                for (let col = 0; col < this.size; col += 1) {
                    let count = 0;
                    this.neighbors(row, col, (nearRow, nearCol) => {
                        if (this.cells[nearRow][nearCol].mine) count += 1;
                    });
                    this.cells[row][col].adjacent = count;
                }
            }

            this.minesPlaced = true;
            this.status = 'playing';
        }

        reveal(row, col) {
            if (this.status === 'won' || this.status === 'lost') return { changed: false };

            const cell = this.cells[row]?.[col];
            if (!cell || cell.revealed || cell.flagged) return { changed: false };

            if (!this.minesPlaced) this.placeMines(row, col);

            this.moves += 1;

            if (cell.mine) {
                cell.revealed = true;
                this.status = 'lost';
                return { changed: true, lost: true };
            }

            this.floodReveal(row, col);

            if (this.revealedCount === this.size * this.size - this.mineCount) {
                this.status = 'won';
            }

            return { changed: true, won: this.status === 'won' };
        }

        floodReveal(row, col) {
            const stack = [[row, col]];

            while (stack.length) {
                const [currentRow, currentCol] = stack.pop();
                const cell = this.cells[currentRow][currentCol];

                if (cell.revealed || cell.flagged || cell.mine) continue;

                cell.revealed = true;
                this.revealedCount += 1;

                if (cell.adjacent === 0) {
                    this.neighbors(currentRow, currentCol, (nearRow, nearCol) => {
                        const neighbor = this.cells[nearRow][nearCol];
                        if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine) {
                            stack.push([nearRow, nearCol]);
                        }
                    });
                }
            }
        }

        toggleFlag(row, col) {
            if (this.status === 'won' || this.status === 'lost') return { changed: false };

            const cell = this.cells[row]?.[col];
            if (!cell || cell.revealed) return { changed: false };

            if (!cell.flagged && this.flagCount >= this.mineCount) {
                return { changed: false, limit: true };
            }

            cell.flagged = !cell.flagged;
            this.flagCount += cell.flagged ? 1 : -1;
            return { changed: true };
        }

        revealMines() {
            this.cells.forEach((line) => {
                line.forEach((cell) => {
                    if (cell.mine && !cell.flagged) cell.revealed = true;
                    if (cell.flagged && !cell.mine) cell.wrong = true;
                });
            });
        }

        flagMines() {
            this.cells.forEach((line) => {
                line.forEach((cell) => {
                    if (cell.mine && !cell.flagged) {
                        cell.flagged = true;
                        this.flagCount += 1;
                    }
                });
            });
        }

        get minesLeft() {
            return this.mineCount - this.flagCount;
        }
    }

    Namespace.Game = Game;
})(window.Minesweeper);
