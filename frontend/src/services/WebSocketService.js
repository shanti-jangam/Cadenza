class WebSocketService {
    constructor() {
        this.socket = null;
        this.callbacks = {
            onMessage: () => {},
            onConnect: () => {},
            onDisconnect: () => {}
        };
    }

    connect() {
        try {
            this.socket = new WebSocket('ws://localhost:8080');

            this.socket.onopen = () => {
                console.log('WebSocket Connected');
                this.callbacks.onConnect();
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.callbacks.onMessage(data);
            };

            this.socket.onclose = () => {
                console.log('WebSocket Disconnected');
                this.callbacks.onDisconnect();
                // Try to reconnect after 3 seconds
                setTimeout(() => this.connect(), 3000);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
        } catch (error) {
            console.error('WebSocket Connection Error:', error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }
}

export default new WebSocketService(); 