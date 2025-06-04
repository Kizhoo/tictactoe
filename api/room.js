// Simulated API endpoints for multiplayer functionality

// Simulated database
let rooms = {};

// Create a new room
export function createRoom(req, res) {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    rooms[roomCode] = {
        players: [],
        board: Array(3).fill().map(() => Array(3).fill('')),
        currentPlayer: 'X',
        status: 'waiting'
    };
    
    res.status(201).json({ roomCode });
}

// Join an existing room
export function joinRoom(req, res) {
    const { roomCode } = req.params;
    
    if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
        rooms[roomCode].players.push(`Player ${rooms[roomCode].players.length + 1}`);
        
        if (rooms[roomCode].players.length === 2) {
            rooms[roomCode].status = 'playing';
        }
        
        res.json({ success: true, room: rooms[roomCode] });
    } else {
        res.status(404).json({ error: 'Room not found or full' });
    }
}

// Make a move
export function makeMove(req, res) {
    const { roomCode } = req.params;
    const { player, row, col } = req.body;
    
    if (!rooms[roomCode]) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    const room = rooms[roomCode];
    
    if (room.currentPlayer !== player) {
        return res.status(400).json({ error: 'Not your turn' });
    }
    
    if (room.board[row][col] !== '') {
        return res.status(400).json({ error: 'Cell already occupied' });
    }
    
    room.board[row][col] = player;
    room.currentPlayer = player === 'X' ? 'O' : 'X';
    
    // Check win condition here...
    
    res.json({ success: true, room });
}
