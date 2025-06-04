import { setGameMode, setBoardSize, resetGame, handleCellClick } from './ui.js';
import { initSkinSelector, setSkin } from './skins.js';

// Game state
export const gameState = {
    board: [],
    currentPlayer: 'X',
    gameMode: 'single',
    boardSize: 3,
    gameActive: true,
    moveCount: 0,
    roomCode: null,
    players: {
        'X': 'Player X',
        'O': 'AI (Hard)'
    },
    winningCells: [],
    currentSkin: 'classic'
};

// DOM elements
export const elements = {
    board: document.getElementById('board'),
    status: document.getElementById('status'),
    moveCount: document.getElementById('moveCount'),
    currentPlayer: document.getElementById('currentPlayer'),
    gameMode: document.getElementById('gameMode'),
    restartBtn: document.getElementById('restartBtn'),
    singlePlayerBtn: document.getElementById('singlePlayerBtn'),
    multiPlayerBtn: document.getElementById('multiPlayerBtn'),
    size3Btn: document.getElementById('size3Btn'),
    size4Btn: document.getElementById('size4Btn'),
    size5Btn: document.getElementById('size5Btn'),
    roomCodeInput: document.getElementById('roomCodeInput'),
    joinRoomBtn: document.getElementById('joinRoomBtn'),
    createRoomBtn: document.getElementById('createRoomBtn'),
    roomControls: document.getElementById('roomControls'),
    playerXCard: document.querySelector('.player-x'),
    playerOCard: document.querySelector('.player-o'),
    skinGrid: document.getElementById('skinGrid')
};

// Initialize game
export function initGame() {
    loadSettings();
    createBoard();
    initSkinSelector();
    updateUI();
    setupEventListeners();
    applySkin();
}

// Create the game board
export function createBoard() {
    elements.board.innerHTML = '';
    elements.board.style.gridTemplateColumns = `repeat(${gameState.boardSize}, 1fr)`;
    
    gameState.board = [];
    gameState.winningCells = [];
    
    for (let i = 0; i < gameState.boardSize; i++) {
        gameState.board[i] = [];
        for (let j = 0; j < gameState.boardSize; j++) {
            gameState.board[i][j] = '';
            
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            elements.board.appendChild(cell);
        }
    }
}

// Check win condition
export function checkWin(row, col) {
    const player = gameState.board[row][col];
    const size = gameState.boardSize;
    const winLength = size === 3 ? 3 : size === 4 ? 3 : 4;
    let winningCells = [];
    
    // Check row
    for (let i = 0; i <= size - winLength; i++) {
        let count = 0;
        let tempCells = [];
        for (let j = 0; j < winLength; j++) {
            if (gameState.board[row][i + j] === player) {
                count++;
                tempCells.push({row, col: i + j});
            }
        }
        if (count === winLength) {
            winningCells = tempCells;
            return { win: true, winningCells };
        }
    }
    
    // Check column
    for (let i = 0; i <= size - winLength; i++) {
        let count = 0;
        let tempCells = [];
        for (let j = 0; j < winLength; j++) {
            if (gameState.board[i + j][col] === player) {
                count++;
                tempCells.push({row: i + j, col});
            }
        }
        if (count === winLength) {
            winningCells = tempCells;
            return { win: true, winningCells };
        }
    }
    
    // Check diagonal (top-left to bottom-right)
    const diag1StartRow = Math.max(0, row - col);
    const diag1StartCol = Math.max(0, col - row);
    for (let i = 0; i <= size - winLength; i++) {
        let count = 0;
        let tempCells = [];
        for (let j = 0; j < winLength; j++) {
            const r = diag1StartRow + i + j;
            const c = diag1StartCol + i + j;
            if (r < size && c < size && gameState.board[r][c] === player) {
                count++;
                tempCells.push({row: r, col: c});
            }
        }
        if (count === winLength) {
            winningCells = tempCells;
            return { win: true, winningCells };
        }
    }
    
    // Check diagonal (top-right to bottom-left)
    const diag2StartRow = Math.max(0, row - (size - 1 - col));
    const diag2StartCol = Math.min(size - 1, col + row);
    for (let i = 0; i <= size - winLength; i++) {
        let count = 0;
        let tempCells = [];
        for (let j = 0; j < winLength; j++) {
            const r = diag2StartRow + i + j;
            const c = diag2StartCol - i - j;
            if (r < size && c >= 0 && gameState.board[r][c] === player) {
                count++;
                tempCells.push({row: r, col: c});
            }
        }
        if (count === winLength) {
            winningCells = tempCells;
            return { win: true, winningCells };
        }
    }
    
    return { win: false, winningCells: [] };
}

// Handle win
export function handleWin(winningCells) {
    gameState.gameActive = false;
    gameState.winningCells = winningCells;
    
    // Highlight winning cells
    winningCells.forEach(cell => {
        const cellElem = document.querySelector(`.cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
        cellElem.classList.add('winning-cell');
    });
    
    elements.status.textContent = `Player ${gameState.currentPlayer} wins!`;
}

// Handle draw
export function handleDraw() {
    gameState.gameActive = false;
    elements.status.textContent = "It's a draw!";
}

// Update UI
export function updateUI() {
    // Update status
    if (gameState.gameActive) {
        elements.status.textContent = gameState.gameMode === 'single' && gameState.currentPlayer === 'O' 
            ? "AI is thinking..." 
            : `Your turn! Place your ${gameState.currentPlayer}`;
    }
    
    // Update move count
    elements.moveCount.textContent = gameState.moveCount;
    
    // Update current player
    elements.currentPlayer.textContent = gameState.currentPlayer;
    
    // Update game mode
    elements.gameMode.textContent = gameState.gameMode === 'single' ? 'Single Player' : 'Multiplayer';
    
    // Update player cards
    elements.playerXCard.classList.toggle('active', gameState.currentPlayer === 'X');
    elements.playerOCard.classList.toggle('active', gameState.currentPlayer === 'O');
    
    // Update player status
    document.querySelector('.player-x .player-status').textContent = 
        gameState.currentPlayer === 'X' ? 'Your Turn!' : 'Waiting...';
    
    document.querySelector('.player-o .player-status').textContent = 
        gameState.currentPlayer === 'O' ? (gameState.gameMode === 'single' ? 'Thinking...' : 'Your Turn!') : 'Waiting...';
}

// Setup event listeners
function setupEventListeners() {
    // Restart button
    elements.restartBtn.addEventListener('click', () => {
        resetGame();
    });
    
    // Game mode buttons
    elements.singlePlayerBtn.addEventListener('click', () => {
        setGameMode('single');
    });
    
    elements.multiPlayerBtn.addEventListener('click', () => {
        setGameMode('multi');
    });
    
    // Board size buttons
    elements.size3Btn.addEventListener('click', () => {
        setBoardSize(3);
    });
    
    elements.size4Btn.addEventListener('click', () => {
        setBoardSize(4);
    });
    
    elements.size5Btn.addEventListener('click', () => {
        setBoardSize(5);
    });
    
    // Room controls
    elements.createRoomBtn.addEventListener('click', () => {
        createRoom();
    });
    
    elements.joinRoomBtn.addEventListener('click', () => {
        joinRoom();
    });
}

// Create room (simulated)
function createRoom() {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    gameState.roomCode = roomCode;
    
    elements.roomCodeInput.value = roomCode;
    elements.status.textContent = `Room created! Code: ${roomCode}`;
    
    // Simulate sharing the code
    setTimeout(() => {
        elements.status.textContent = "Waiting for opponent to join...";
    }, 3000);
}

// Join room (simulated)
function joinRoom() {
    const roomCode = elements.roomCodeInput.value.trim().toUpperCase();
    
    if (roomCode.length === 4) {
        gameState.roomCode = roomCode;
        elements.status.textContent = `Joined room ${roomCode}! Waiting for game to start...`;
        
        // Simulate connection
        setTimeout(() => {
            resetGame();
            elements.status.textContent = "Game started! Your turn!";
        }, 2000);
    } else {
        elements.status.textContent = "Please enter a valid 4-character room code";
    }
}

// Skin functions
export function applySkin() {
    const skin = skins.find(s => s.id === gameState.currentSkin) || skins[0];
    
    // Update player cards
    document.querySelector('.player-x .player-icon').innerHTML = `<i class="${skin.xIcon}"></i>`;
    document.querySelector('.player-o .player-icon').innerHTML = `<i class="${skin.oIcon}"></i>`;
    document.querySelector('.player-x .player-icon').style.color = skin.xColor;
    document.querySelector('.player-o .player-icon').style.color = skin.oColor;
    
    // Update cells
    document.querySelectorAll('.cell.x').forEach(cell => {
        cell.innerHTML = `<i class="${skin.xIcon}"></i>`;
        cell.style.color = skin.xColor;
        applyEffect(cell, skin.xEffect);
    });
    
    document.querySelectorAll('.cell.o').forEach(cell => {
        cell.innerHTML = `<i class="${skin.oIcon}"></i>`;
        cell.style.color = skin.oColor;
        applyEffect(cell, skin.oEffect);
    });
    
    // Update CSS variables
    document.documentElement.style.setProperty('--x-color', skin.xColor);
    document.documentElement.style.setProperty('--o-color', skin.oColor);
}

export function applyEffect(element, effect) {
    // Reset previous effects
    element.classList.remove(
        'effect-fire', 'effect-ice', 'effect-glow', 
        'effect-scale', 'effect-pulse', 'effect-rotate',
        'effect-grow', 'effect-bounce', 'effect-spin', 'effect-shake'
    );
    
    if (effect !== 'none') {
        element.classList.add(`effect-${effect}`);
    }
}

export function saveSettings() {
    localStorage.setItem('ticTacToeSettings', JSON.stringify({
        skin: gameState.currentSkin,
        boardSize: gameState.boardSize,
        gameMode: gameState.gameMode
    }));
}

export function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('ticTacToeSettings'));
    if (settings) {
        gameState.currentSkin = settings.skin || 'classic';
        gameState.boardSize = settings.boardSize || 3;
        gameState.gameMode = settings.gameMode || 'single';
        
        // Update UI for settings
        elements.singlePlayerBtn.classList.toggle('active', gameState.gameMode === 'single');
        elements.multiPlayerBtn.classList.toggle('active', gameState.gameMode === 'multi');
        
        elements.size3Btn.classList.toggle('active', gameState.boardSize === 3);
        elements.size4Btn.classList.toggle('active', gameState.boardSize === 4);
        elements.size5Btn.classList.toggle('active', gameState.boardSize === 5);
        
        // Update room controls
        elements.roomControls.style.opacity = gameState.gameMode === 'multi' ? 1 : 0.5;
        elements.roomCodeInput.disabled = gameState.gameMode !== 'multi';
        elements.joinRoomBtn.disabled = gameState.gameMode !== 'multi';
        elements.createRoomBtn.disabled = gameState.gameMode !== 'multi';
        
        // Update player names
        gameState.players.O = gameState.gameMode === 'single' ? 'AI (Hard)' : 'Player O';
        document.querySelector('.player-o .player-name').textContent = gameState.players.O;
    }
}

// Initialize the game
window.addEventListener('DOMContentLoaded', initGame);
