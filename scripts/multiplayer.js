import { gameState, elements, resetGame, updateUI } from './game.js';

// Simulated multiplayer functionality
export function createRoom() {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    gameState.roomCode = roomCode;
    
    elements.roomCodeInput.value = roomCode;
    elements.status.textContent = `Room created! Code: ${roomCode}`;
    
    // Simulate sharing the code
    setTimeout(() => {
        elements.status.textContent = "Waiting for opponent to join...";
    }, 3000);
}

export function joinRoom() {
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
