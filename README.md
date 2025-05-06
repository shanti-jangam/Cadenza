# Cadenza 
*Real-time AI-powered music collaboration platform*

<img width="656" alt="Screenshot 2025-05-06 at 1 00 03 AM" src="https://github.com/user-attachments/assets/1a1bb9dd-acfc-403e-8863-9f58d8eb58ba" />

---

## Overview
Cadenza is a real-time music collaboration platform that combines the power of AI with intuitive music creation tools. Built for musicians, composers, and music enthusiasts, Cadenza enables seamless collaboration and creative exploration through its integrated AI-powered features.

---

## Core Features

### Compose 

---

<img width="621" alt="Screenshot 2025-05-06 at 1 02 42 AM" src="https://github.com/user-attachments/assets/b429ef57-a544-4715-b86a-0614b4720dad" />

---

- **Piano Roll Interface**: Create and edit music using a visual piano roll
- **Basic Recording**: Record your musical ideas
- **Playback Controls**: Play, stop, and reset your compositions
- **AI Generation**: Generate melodies using Magenta.js's MusicRNN
- **Audio Effects**: Apply basic effects (reverb, delay, distortion)
- **Tempo Control**: Adjust the speed of your compositions
- **Volume Control**: Manage the audio output level

### Explore 


<img width="318" alt="Screenshot 2025-05-06 at 1 07 42 AM" src="https://github.com/user-attachments/assets/a43b5bfe-164f-4d71-ac94-5d2f8ab89be3" />


- **Browse Compositions**: View compositions from other users
- **Like System**: Like and save your favorite compositions
- **Comments**: Interact with other users through comments
- **Share**: Share compositions with others
- **Visualization**: View composition visualizations

### Collaborate 


<img width="593" alt="Screenshot 2025-05-06 at 1 04 33 AM" src="https://github.com/user-attachments/assets/42a572de-3655-4e09-a478-033f1646681a" />


- **Publish**: Share your compositions with the community
- **Import**: Import compositions from other users
- **Preview**: Preview compositions before importing
- **Track Management**: Save and organize your tracks

## AI Features


<img width="1421" alt="Screenshot 2025-05-06 at 12 22 56 AM" src="https://github.com/user-attachments/assets/faa32e2a-4566-4bdd-9760-f2e2036095a7" />


Cadenza's AI capabilities are powered by Magenta.js:
- **Melody Generation**: Create new melodies using MusicRNN
- **Style-Based Generation**: Generate music in different styles
- **Mood-Based Variations**: Adjust the emotional tone of generated music


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
