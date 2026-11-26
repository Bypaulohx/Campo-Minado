window.Minesweeper = window.Minesweeper || {};

(function (Namespace) {
    let toastTimer = null;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const rest = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
    }

    function icon(className) {
        const element = document.createElement('i');
        element.className = className;
        element.setAttribute('aria-hidden', 'true');
        return element;
    }

    function describeCell(row, col, cell) {
        if (cell.wrong) return `Linha ${row + 1}, coluna ${col + 1}: marcação incorreta`;
        if (cell.flagged) return `Linha ${row + 1}, coluna ${col + 1}: mina marcada`;
        if (cell.revealed && cell.mine) return `Linha ${row + 1}, coluna ${col + 1}: mina`;
        if (cell.revealed && cell.adjacent > 0) return `Linha ${row + 1}, coluna ${col + 1}: ${cell.adjacent} minas por perto`;
        if (cell.revealed) return `Linha ${row + 1}, coluna ${col + 1}: área segura`;
        return `Linha ${row + 1}, coluna ${col + 1}: célula fechada`;
    }

    function renderBoard(board, game) {
        board.style.setProperty('--grid-size', String(game.size));
        const fragment = document.createDocumentFragment();

        for (let row = 0; row < game.size; row += 1) {
            for (let col = 0; col < game.size; col += 1) {
                const cell = game.cells[row][col];
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'cell';
                button.dataset.row = String(row);
                button.dataset.col = String(col);
                button.setAttribute('role', 'gridcell');
                button.setAttribute('aria-label', describeCell(row, col, cell));

                if (cell.revealed) button.classList.add('revealed');

                if (cell.wrong) {
                    button.classList.add('wrong');
                    button.append(icon('bi bi-x-lg'));
                } else if (cell.flagged) {
                    button.classList.add('flag');
                    button.append(icon('bi bi-flag-fill'));
                } else if (cell.revealed && cell.mine) {
                    button.classList.add('mine');
                    button.append(icon('bi bi-emoji-dizzy-fill'));
                } else if (cell.revealed && cell.adjacent > 0) {
                    button.classList.add(`n${cell.adjacent}`);
                    button.textContent = String(cell.adjacent);
                }

                fragment.append(button);
            }
        }

        board.replaceChildren(fragment);
    }

    function updateHud(elements, game, seconds) {
        elements.minesLeft.textContent = String(game.minesLeft);
        elements.timer.textContent = formatTime(seconds);
        elements.moves.textContent = String(game.moves);
    }

    function setStatus(element, message, tone = '') {
        element.textContent = message;
        element.className = `status${tone ? ` is-${tone}` : ''}`;
    }

    function showToast(element, message) {
        clearTimeout(toastTimer);
        element.textContent = message;
        element.hidden = false;

        requestAnimationFrame(() => element.classList.add('is-visible'));

        toastTimer = setTimeout(() => {
            element.classList.remove('is-visible');
            element.hidden = true;
        }, 3000);
    }

    Namespace.ui = {
        formatTime,
        renderBoard,
        updateHud,
        setStatus,
        showToast
    };
})(window.Minesweeper);
