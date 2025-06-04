import { gameState, elements, createBoard, updateUI, applySkin } from './game.js';
import { makeAIMove } from './ai.js';
import { createRoom, joinRoom } from './multiplayer.js';
import { setSkin } from './skins.js';

// Handle cell click
export function handleCellClick(row, col) {
    if (!gameState.gameActive || gameState.board[row][col] !== '') return;
    
    // Player move
    gameState.board[row][col] = gameState.currentPlayer;
    gameState.moveCount++;
    
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    
    const skin = skins.find(s => s.id === gameState.currentSkin) || skins[0];
    const iconClass = gameState.currentPlayer === 'X' ? skin.xIcon : skin.oIcon;
    const color = gameState.currentPlayer === 'X' ? skin.xColor : skin.oColor;
    const effect = gameState.currentPlayer === 'X' ? skin.xEffect : skin.oEffect;
    
    cell.innerHTML = `<i class="${iconClass}"></i>`;
    cell.style.color = color;
    applyEffect(cell, effect);
    cell.classList.add(gameState.currentPlayer.toLowerCase());
    
    // Add animation class
    cell.classList.add('cell-pop');
    setTimeout(() => cell.classList.remove('cell-pop'), 300);
    
    // Check for win or draw
    const winResult = checkWin(row, col);
    if (winResult.win) {
        handleWin(winResult.winningCells);
    } else if (gameState.moveCount === gameState.boardSize * gameState.boardSize) {
        handleDraw();
    } else {
        // Switch player
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        
        // AI move in single player mode
        if (gameState.gameMode === 'single' && gameState.currentPlayer === 'O') {
            setTimeout(makeAIMove, 600);
        }
    }
    
    updateUI();
}

// Set game mode
export function setGameMode(mode) {
    gameState.gameMode = mode;
    
    // Update UI for buttons
    elements.singlePlayerBtn.classList.toggle('active', mode === 'single');
    elements.multiPlayerBtn.classList.toggle('active', mode === 'multi');
    
    // Update player names
    gameState.players.O = mode === 'single' ? 'AI (Hard)' : 'Player O';
    document.querySelector('.player-o .player-name').textContent = gameState.players.O;
    
    // Enable/disable room controls
    elements.roomControls.style.opacity = mode === 'multi' ? 1 : 0.5;
    elements.roomCodeInput.disabled = mode !== 'multi';
    elements.joinRoomBtn.disabled = mode !== 'multi';
    elements.createRoomBtn.disabled = mode !== 'multi';
    
    resetGame();
}

// Set board size
export function setBoardSize(size) {
    gameState.boardSize = size;
    
    // Update UI for buttons
    elements.size3Btn.classList.toggle('active', size === 3);
    elements.size4Btn.classList.toggle('active', size === 4);
    elements.size5Btn.classList.toggle('active', size === 5);
    
    resetGame();
}

// Reset game
export function resetGame() {
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    gameState.moveCount = 0;
    gameState.winningCells = [];
    
    createBoard();
    applySkin();
    updateUI();
}
