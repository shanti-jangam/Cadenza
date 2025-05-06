import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class NeuralMusicService {
  constructor() {
    this.model = null;
    this.noteMapping = {
      'C4': 0, 'C#4': 1, 'D4': 2, 'D#4': 3, 'E4': 4, 'F4': 5,
      'F#4': 6, 'G4': 7, 'G#4': 8, 'A4': 9, 'A#4': 10, 'B4': 11,
      'C5': 12, 'C#5': 13, 'D5': 14, 'D#5': 15, 'E5': 16, 'F5': 17,
      'F#5': 18, 'G5': 19, 'G#5': 20, 'A5': 21, 'A#5': 22, 'B5': 23
    };
    this.reverseNoteMapping = Object.fromEntries(
      Object.entries(this.noteMapping).map(([k, v]) => [v, k])
    );
    this.isModelTrained = false;
  }

  async createModel() {
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
      units: 128,
      activation: 'relu',
      inputShape: [8, 24] // 8 time steps, 24 possible notes
    }));

    // LSTM layer for sequence learning
    model.add(tf.layers.lstm({
      units: 64,
      returnSequences: true
    }));

    // Output layer
    model.add(tf.layers.dense({
      units: 24,
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
    return model;
  }

  prepareTrainingData(compositions) {
    const sequences = [];
    const nextNotes = [];
    const sequenceLength = 8;

    compositions.forEach(composition => {
      const noteSequence = composition.map(note => this.noteMapping[note.note]);
      
      for (let i = 0; i < noteSequence.length - sequenceLength; i++) {
        const sequence = noteSequence.slice(i, i + sequenceLength);
        const nextNote = noteSequence[i + sequenceLength];
        
        // Convert to one-hot encoding
        const sequenceOneHot = sequence.map(note => 
          Array(24).fill(0).map((_, i) => i === note ? 1 : 0)
        );
        const nextNoteOneHot = Array(24).fill(0);
        nextNoteOneHot[nextNote] = 1;

        sequences.push(sequenceOneHot);
        nextNotes.push(nextNoteOneHot);
      }
    });

    return {
      xs: tf.tensor3d(sequences),
      ys: tf.tensor2d(nextNotes)
    };
  }

  async train(compositions, epochs = 50) {
    if (!this.model) {
      await this.createModel();
    }

    const { xs, ys } = this.prepareTrainingData(compositions);

    return await this.model.fit(xs, ys, {
      epochs,
      batchSize: 32,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      }
    });
  }

  async ensureModelTrained() {
    if (!this.isModelTrained) {
      console.log('Training model...');
      await api.post('/ai/train');
      this.isModelTrained = true;
    }
  }

  async generateContinuation(notes, options = {}) {
    try {
      // Add musical context to the request
      const context = {
        scale: 'C_MAJOR',  // or detect from input notes
        lastNote: notes[notes.length - 1].note,
        temperature: 0.8,
        creativityLevel: 0.7,
        rhythmicVariation: true,
        allowChromaticNotes: true,
        minInterval: 2,  // minimum interval between consecutive notes
        maxInterval: 12  // maximum interval between consecutive notes
      };

      const response = await api.post('/ai/complete-melody', {
        notes,
        options: {
          ...options,
          context
        }
      });

      return response.data.generatedNotes;
    } catch (error) {
      console.error('AI generation failed:', error);
      throw error;
    }
  }

  async generateVariation(notes, temperature = 0.7) {
    try {
      const response = await api.post('/ai/generate-variation', {
        melody: notes,
        temperature
      });
      return response.data.variation;
    } catch (error) {
      console.error('Variation generation failed:', error);
      throw error;
    }
  }

  async trainModel() {
    try {
      const response = await api.post('/ai/train');
      this.isModelTrained = true;
      return response.data;
    } catch (error) {
      console.error('Model training failed:', error);
      throw error;
    }
  }
}

export default new NeuralMusicService();