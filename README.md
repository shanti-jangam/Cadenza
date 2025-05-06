# Cadenza

Cadenza is a real-time music collaboration platform that combines the power of AI with intuitive music creation tools. Built for musicians, composers, and music enthusiasts, Cadenza enables seamless collaboration and creative exploration through its integrated AI-powered features.

## Core Features

### Compose 🎼
- **Piano Roll Interface**: Create and edit music using a visual piano roll
- **Basic Recording**: Record your musical ideas
- **Playback Controls**: Play, stop, and reset your compositions
- **AI Generation**: Generate melodies using Magenta.js's MusicRNN
- **Audio Effects**: Apply basic effects (reverb, delay, distortion)
- **Tempo Control**: Adjust the speed of your compositions
- **Volume Control**: Manage the audio output level

### Explore 🎵
- **Browse Compositions**: View compositions from other users
- **Like System**: Like and save your favorite compositions
- **Comments**: Interact with other users through comments
- **Share**: Share compositions with others
- **Visualization**: View composition visualizations

## Tech Stack

- **Frontend**: 
  - React with Material-UI
  - Tone.js for audio processing
  - WebSocket for real-time features
- **Backend**: 
  - Node.js server
  - WebSocket server
- **AI Engine**: 
  - Magenta.js for music generation
  - MusicRNN for melody generation

## Getting Started

1. Clone this repository
2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
3. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
4. Launch the WebSocket server:
   ```bash
   cd websocket-server
   npm install
   npm start
   ```

## AI Features

Cadenza's AI capabilities are powered by Magenta.js:

- **Melody Generation**: Create new melodies using MusicRNN
- **Style-Based Generation**: Generate music in different styles
- **Mood-Based Variations**: Adjust the emotional tone of generated music
