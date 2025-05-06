# Cadenza 🎶
*Real-time AI-powered music collaboration platform*

---

## Overview
Cadenza is a platform for musicians and creators to compose, explore, and collaborate on music in real time, enhanced by AI-generated melodies and creative tools.

---

## Screenshots

| Compose | Explore | Collaborate |
|:---:|:---:|:---:|
| ![Compose](https://github.com/user-attachments/assets/b429ef57-a544-4715-b86a-0614b4720dad) | ![Explore](https://github.com/user-attachments/assets/a43b5bfe-164f-4d71-ac94-5d2f8ab89be3) | ![Collaborate](https://github.com/user-attachments/assets/42a572de-3655-4e09-a478-033f1646681a) |

---

## Features

### Compose
- **Piano Roll Interface:** Visually create and edit music.
- **Recording & Playback:** Record ideas and play them back instantly.
- **AI Melody Generation:** Use Magenta.js to generate new melodies.
- **Audio Effects:** Add reverb, delay, and distortion.
- **Tempo & Volume Control:** Fine-tune your sound.

### 🔍 Explore
- **Browse Compositions:** Discover music from other users.
- **Like & Comment:** Interact with the community.
- **Share & Visualize:** Share your work and see visual representations.

### Collaborate
- **Publish & Import:** Share your music or import others' work.
- **Preview & Manage Tracks:** Listen before importing and organize your creations.

---

## AI Features

![AI Screenshot](https://github.com/user-attachments/assets/faa32e2a-4566-4bdd-9760-f2e2036095a7)

- **Melody Generation:** Create new melodies with MusicRNN.
- **Style & Mood:** Generate music in different styles and moods.

---

## 🛠 Tech Stack
- **Frontend:** React, Material-UI, Tone.js, WebSocket
- **Backend:** Node.js, WebSocket server
- **AI:** Magenta.js (MusicRNN)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/Cadenza.git
cd Cadenza

# Set up the frontend
cd frontend
npm install
npm start

# In a new terminal, set up the backend
cd ../backend
npm install
npm start

# In a new terminal, start the WebSocket server
cd ../websocket-server
npm install
npm start
```
