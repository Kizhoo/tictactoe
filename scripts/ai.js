import { gameState, handleWin, handleDraw, updateUI, applyEffect } from './game.js';
import { skins } from './skins.js';

// AI move logic
export function makeAIMove() {
    if (!gameState.gameActive) return;
    
    // For larger boards, use a heuristic approach
    if (gameState.boardSize > 3) {
        makeHeuristicAIMove();
        return;
    }
    
    // For 3x3 board, use minimax
    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < gameState.boardSize; i++) {
        for (let j = 0; j < gameState.boardSize; j++) {
            if (gameState.board[i][j] === '') {
                gameState.board[i][j] = 'O';
                let score = minimax(gameState.board, 0, false);
                gameState.board[i][j] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { i, j };
                }
            }
        }
    }
    
    // Make the best move
    if (bestMove) {
        setTimeout(() => {
            gameState.board[bestMove.i][bestMove.j] = 'O';
            gameState.moveCount++;
            
            const cell = document.querySelector(`.cell[data-row="${bestMove.i}"][data-col="${bestMove.j}"]`);
            
            const skin = skins.find(s => s.id === gameState.currentSkin) || skins[0];
            cell.innerHTML = `<i class="${skin.oIcon}"></i>`;
            cell.style.color = skin.oColor;
            applyEffect(cell, skin.oEffect);
            cell.classList.add('o');
            
            // Add animation
            cell.classList.add('cell-pop');
            setTimeout(() => cell.classList.remove('cell-pop'), 300);
            
            // Check for win or draw
            const winResult = checkWin(bestMove.i, bestMove.j);
            if (winResult.win) {
                handleWin(winResult.winningCells);
            } else if (gameState.moveCount === gameState.boardSize * gameState.boardSize) {
                handleDraw();
            } else {
                gameState.currentPlayer = 'X';
            }
            
            updateUI();
        }, 600);
    }
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
    // Check for terminal states
    const result = checkGameResult();
    if (result !== null) {
        if (result === 'O') return 10 - depth;
        if (result === 'X') return depth - 10;
        return 0;
    }
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < gameState.boardSize; i++) {
            for (let j = 0; j < gameState.boardSize; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < gameState.boardSize; i++) {
            for (let j = 0; j < gameState.boardSize; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

// Heuristic AI for larger boards
function makeHeuristicAIMove() {
    // Try to win if possible
    for (let i = 0; i < gameState.boardSize; i++) {
        for (let j = 0; j < gameState.boardSize; j++) {
            if (gameState.board[i][j] === '') {
                gameState.board[i][j] = 'O';
                if (checkWin(i, j).win) {
                    completeAIMove(i, j);
                    return;
                }
                gameState.board[i][j] = '';
            }
        }
    }
    
    // Block opponent from winning
    for (let i = 0; i < gameState.boardSize; i++) {
        for (let j = 0; j < gameState.boardSize; j++) {
            if (gameState.board[i][j] === '') {
                gameState.board[i][j] = 'X';
                if (checkWin(i, j).win) {
                    gameState.board[i][j] = 'O';
                    completeAIMove(i, j);
                    return;
                }
                gameState.board[i][j] = '';
            }
        }
    }
    
    // Center control
    const center = Math.floor(gameState.boardSize / 2);
    if (gameState.boardSize % 2 === 1 && gameState.board[center][center] === '') {
        completeAIMove(center, center);
        return;
    }
    
    // Take a corner if available
    const corners = [
        [0, 0],
        [0, gameState.boardSize - 1],
        [gameState.boardSize - 1, 0],
        [gameState.boardSize - 1, gameState.boardSize - 1]
    ];
    
    for (const [i, j] of corners) {
        if (gameState.board[i][j] === '') {
            completeAIMove(i, j);
            return;
        }
    }
    
    // Take any available edge
    for (let i = 0; i < gameState.boardSize; i++) {
        for (let j = 0; j < gameState.boardSize; j++) {
            if (gameState.board[i][j] === '') {
                completeAIMove(i, j);
                return;
            }
        }
    }
}

// Complete AI move
function completeAIMove(i, j) {
    setTimeout(() => {
        gameState.board[i][j] = 'O';
        gameState.moveCount++;
        
        const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
        
        const skin = skins.find(s => s.id === gameState.currentSkin) || skins[0];
        cell.innerHTML = `<i class="${skin.oIcon}"></i>`;
        cell.style.color = skin.oColor;
        applyEffect(cell, skin.oEffect);
        cell.classList.add('o');
        
        // Add animation
        cell.classList.add('cell-pop');
        setTimeout(() => cell.classList.remove('cell-pop'), 300);
        
        // Check for win or draw
        const winResult = checkWin(i, j);
        if (winResult.win) {
            handleWin(winResult.winningCells);
        } else if (gameState.moveCount === gameState.boardSize * gameState.boardSize) {
            handleDraw();
        } else {
            gameState.currentPlayer = 'X';
        }
        
        updateUI();
    }, 600);
}

// Check win condition for minimax
function checkWin(row, col) {
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

// Check game result for minimax
function checkGameResult() {
    for (let i = 0; i < gameState.boardSize; i++) {
        for (let j = 0; j < gameState.boardSize; j++) {
            if (gameState.board[i][j] !== '') {
                const result = checkWin(i, j);
                if (result.win) {
                    return gameState.board[i][j];
                }
            }
        }
    }
    
    if (gameState.moveCount === gameState.boardSize * gameState.boardSize) {
        return 'draw';
    }
    
    return null;
}
