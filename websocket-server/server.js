const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Set();

// Broadcast message to all clients including sender
function broadcastAll(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Handle new connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send welcome message only to the new client
    ws.send(JSON.stringify({
        type: 'system',
        username: 'System',
        content: 'Welcome to the chat!',
        timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (data) => {
        console.log('Received:', data.toString());
        // Broadcast to all clients (including sender)
        broadcastAll(data.toString());
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080'); 