(function (Namespace) {
    const elements = {
        board: document.getElementById('game-board'),
        difficulty: document.getElementById('difficulty'),
        start: document.getElementById('start'),
        restart: document.getElementById('restart'),
        flagMode: document.getElementById('flag-mode'),
        flagModeLabel: document.getElementById('flag-mode-label'),
        minesLeft: document.getElementById('mines-left'),
        timer: document.getElementById('timer'),
        moves: document.getElementById('moves'),
        message: document.getElementById('message'),
        toast: document.getElementById('toast')
    };

    const state = {
        game: null,
        seconds: 0,
        timerId: null,
        flagMode: false
    };

    function stopTimer() {
        clearInterval(state.timerId);
        state.timerId = null;
    }

    function startTimer() {
        if (state.timerId) return;

        state.timerId = setInterval(() => {
            state.seconds += 1;
            Namespace.ui.updateHud(elements, state.game, state.seconds);
        }, 1000);
    }

    function toast(message) {
        Namespace.ui.showToast(elements.toast, message);
    }

    function setFlagMode(active) {
        state.flagMode = active;
        elements.flagMode.setAttribute('aria-pressed', String(active));
        elements.flagModeLabel.textContent = active ? 'Marcando minas' : 'Marcar minas';
    }

    function render() {
        Namespace.ui.renderBoard(elements.board, state.game);
        Namespace.ui.updateHud(elements, state.game, state.seconds);
    }

    function newGame() {
        stopTimer();
        const settings = Namespace.difficulties[elements.difficulty.value];
        state.game = new Namespace.Game(settings.size, settings.mines);
        state.seconds = 0;
        setFlagMode(false);
        Namespace.ui.setStatus(elements.message, 'Clique em uma célula para começar.');
        render();
    }

    function flagCell(row, col) {
        const result = state.game.toggleFlag(row, col);

        if (result.limit) {
            toast('Você já marcou todas as minas.');
            return;
        }

        if (result.changed) render();
    }

    function revealCell(row, col) {
        const result = state.game.reveal(row, col);
        if (!result.changed) return;

        if (state.game.status === 'playing') startTimer();

        if (result.lost) {
            stopTimer();
            state.game.revealMines();
            Namespace.ui.setStatus(elements.message, 'Você encontrou uma mina. Clique em “Novo jogo” para tentar de novo.', 'lose');
            render();
            toast('Partida encerrada.');
            return;
        }

        if (result.won) {
            stopTimer();
            state.game.flagMines();
            Namespace.ui.setStatus(elements.message, 'Você abriu todas as células seguras. Parabéns!', 'win');
            render();
            toast('Vitória! Tabuleiro concluído.');
            return;
        }

        render();
    }

    elements.board.addEventListener('click', (event) => {
        const cell = event.target.closest('.cell');
        if (!cell) return;

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        if (state.flagMode) {
            flagCell(row, col);
            return;
        }

        revealCell(row, col);
    });

    elements.board.addEventListener('contextmenu', (event) => {
        const cell = event.target.closest('.cell');
        if (!cell) return;

        event.preventDefault();
        flagCell(Number(cell.dataset.row), Number(cell.dataset.col));
    });

    elements.start.addEventListener('click', newGame);
    elements.restart.addEventListener('click', newGame);
    elements.difficulty.addEventListener('change', newGame);
    elements.flagMode.addEventListener('click', () => setFlagMode(!state.flagMode));

    newGame();
})(window.Minesweeper);
