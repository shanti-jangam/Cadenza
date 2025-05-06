# Cadenza 

Cadenza is a real-time music collaboration platform that combines the power of AI with intuitive music creation tools. Built for musicians, composers, and music enthusiasts, Cadenza enables seamless collaboration and creative exploration through its integrated AI-powered features.

<img width="653" alt="Screenshot 2025-05-06 at 1 27 51 AM" src="https://github.com/user-attachments/assets/8d1ea02f-7ee6-44e0-94cf-2bd88276f988" />

---

## Core Features


### 1. Compose 


<img width="624" alt="Screenshot 2025-05-06 at 1 28 58 AM" src="https://github.com/user-attachments/assets/5a0d5dce-3bdb-4cda-bfa1-4ca10e191d80" />


- **Piano Roll Interface**: Create and edit music using a visual piano roll
- **Basic Recording**: Record musical ideas
- **Playback Controls**: Play, stop, and reset the compositions
- **AI Generation**: Generate melodies using Magenta.js's MusicRNN
- **Audio Effects**: Apply basic effects (reverb, delay, distortion)
- **Tempo Control**: Adjust the speed of compositions
- **Volume Control**: Manage the audio output level


### 2. Explore 


<img width="768" alt="Screenshot 2025-05-06 at 1 46 25 AM" src="https://github.com/user-attachments/assets/e5491456-e5f9-4fbe-932e-5cc84978364b" />


- **Browse Compositions**: View compositions from other users
- **Like System**: Like and save favorite compositions
- **Comments**: Interact with other users through comments
- **Share**: Share compositions with others
- **Visualization**: View composition visualizations
- **Track Management**: Save and organize the tracks


### 3. Collaborate 


<img width="587" alt="Screenshot 2025-05-06 at 1 30 03 AM" src="https://github.com/user-attachments/assets/93a19611-7a49-4f26-880f-4c27dfe0f364" />


- **Publish**: Share the compositions with the community
- **Import**: Import compositions from other users
- **Preview**: Preview compositions before importing
- **Real-Time Collaboration: Collaborate instantly with others using WebSockets

## AI Features


<img width="318" alt="Screenshot 2025-05-06 at 1 30 31 AM" src="https://github.com/user-attachments/assets/1f2437bf-5b09-42ef-a52c-7fb5c5e7fa31" />


Cadenza's AI capabilities are powered by Magenta.js:
- **Melody Generation**: Create new melodies using MusicRNN
- **Style-Based Generation**: Generate music in different styles
- **Mood-Based Variations**: Adjust the emotional tone of generated music

---

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

---

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
