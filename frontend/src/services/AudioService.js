import { Synth, PolySynth, MembraneSynth, MetalSynth, NoiseSynth, Transport, Reverb, FeedbackDelay, Distortion, Destination, start, AMSynth, FMSynth } from 'tone';

// Add MusicGen configuration
const MUSICGEN_API_URL = 'https://api-inference.huggingface.co/models/facebook/musicgen-large';

// Add Soundverse API configuration
const SOUNDVERSE_API_KEY = process.env.REACT_APP_SOUNDVERSE_API_KEY;
const SOUNDVERSE_API_URL = 'https://api.soundverse.ai/v1';

class AudioService {
  constructor() {
    // Initialize default values
    this.tempo = 120;
    this.volume = 75;
    this.isInitialized = false;
    this.isRecording = false;
    this.recordedNotes = [];
    this.currentInstrument = 'piano';

    // Create effects first
    this.effects = {
      reverb: new Reverb({
        decay: 2.5,
        wet: 0
      }),
      delay: new FeedbackDelay({
        delayTime: "8n",
        feedback: 0.5,
        wet: 0
      }),
      distortion: new Distortion({
        distortion: 0.8,
        wet: 0
      })
    };

    // Connect effects in series
    this.effects.reverb.connect(this.effects.delay);
    this.effects.delay.connect(this.effects.distortion);
    this.effects.distortion.connect(Destination);

    // Create instruments with initial volume
    this.instruments = {
      piano: new PolySynth(Synth, {
        oscillator: { 
          type: 'triangle',
          partials: [1, 0.8, 0.2, 0.1]
        },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1.5
        },
        volume: -8
      }),
      guitar: new PolySynth(FMSynth, {
        harmonicity: 3.01,
        modulationIndex: 14,
        oscillator: {
          type: "triangle8"
        },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.3,
          release: 0.4
        },
        modulation: {
          type: "square"
        },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0.01,
          sustain: 0.2,
          release: 0.5
        },
        volume: -10
      }),
      drums: {
        kick: new MembraneSynth({
          pitchDecay: 0.05,
          octaves: 6,
          oscillator: { type: "sine" },
          envelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0.01,
            release: 1.4,
            attackCurve: "exponential"
          },
          volume: -10
        }),
        snare: new NoiseSynth({
          noise: { type: "white" },
          envelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0,
            release: 0.2
          },
          volume: -15
        }),
        hihat: new MetalSynth({
          frequency: 200,
          envelope: {
            attack: 0.001,
            decay: 0.1,
            release: 0.01
          },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5,
          volume: -20
        })
      },
      synth: new PolySynth(AMSynth, {
        harmonicity: 2,
        detune: 0,
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.8,
          release: 1.5
        },
        modulation: {
          type: "square"
        },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0,
          sustain: 1,
          release: 0.5
        },
        volume: -12
      })
    };

    // Connect all instruments to the effects chain
    Object.values(this.instruments).forEach(instrument => {
      if (instrument instanceof PolySynth) {
        instrument.connect(this.effects.reverb);
      } else if (typeof instrument === 'object') {
        // Connect each drum component separately
        Object.values(instrument).forEach(component => {
          component.connect(this.effects.reverb);
        });
      }
    });
  }

  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Start audio context
      await start();
      
      // Set initial tempo
      if (!Transport.bpm.value) {
        Transport.bpm.value = this.tempo || 120;
      }
      
      // Connect all instruments to effects chain and set initial volume
      const initialDb = (this.volume / 100 * 60) - 60;
      
      Object.values(this.instruments).forEach(instrument => {
        if (instrument instanceof PolySynth) {
          instrument.connect(this.effects.reverb);
          if (instrument.volume) {
            instrument.volume.value = initialDb;
          }
        } else if (typeof instrument === 'object') {
          // Handle drum kit case
          Object.values(instrument).forEach(component => {
            if (component && component.connect) {
              component.connect(this.effects.reverb);
              if (component.volume) {
                component.volume.value = initialDb;
              }
            }
          });
        }
      });

      // Set master volume
      if (Destination.volume) {
        Destination.volume.value = initialDb;
      }
      
      this.isInitialized = true;
      console.log('AudioService initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing AudioService:', error);
      return false;
    }
  }

  startRecording() {
    this.recordedNotes = [];
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    console.log('Started recording at:', this.recordingStartTime);
  }

  stopRecording() {
    this.isRecording = false;
    const recorded = [...this.recordedNotes];
    this.recordedNotes = [];
    return recorded;
  }

  recordNote(note, duration = '8n') {
    if (this.isRecording) {
      const noteObj = {
        note: note,
        duration: duration,
        timestamp: Date.now() - this.recordingStartTime,
        instrument: this.currentInstrument
      };
      this.recordedNotes.push(noteObj);
      console.log('Recorded note:', noteObj);
    }
  }

  async playNote(noteInput, duration = "8n") {
    try {
      // Initialize if needed
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.error('Failed to initialize AudioService');
          return;
        }
      }
      
      // Handle both string notes and note objects
      let noteValue;
      let durationValue = duration;
      let instrumentValue = this.currentInstrument;
      
      if (typeof noteInput === 'object') {
        noteValue = noteInput.note;
        durationValue = noteInput.duration || duration;
        if (noteInput.instrument) {
          instrumentValue = noteInput.instrument;
        }
      } else {
        noteValue = noteInput;
      }

      // Get current time
      const now = Destination.now();

      if (instrumentValue === 'drums') {
        this.playDrumNote(noteValue, now);
      } else {
        const instrument = this.instruments[instrumentValue];
        if (!instrument) {
          console.error('Invalid instrument:', instrumentValue);
          return;
        }

        if (!noteValue) {
          console.error('Invalid note:', noteValue);
          return;
        }

        instrument.triggerAttackRelease(noteValue, durationValue, now);
      }

      // Record the note if recording is active
      if (this.isRecording) {
        this.recordNote(noteValue, durationValue);
      }
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  async playComposition(composition) {
    try {
      if (!composition || composition.length === 0) {
        console.warn('No composition to play');
        return;
      }

      // Initialize if needed
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Ensure audio context is started
      await start();
      
      // Clear any previously scheduled events and stop transport
      Transport.cancel();
      Transport.stop();
      
      console.log('Playing composition:', composition);

      // Simple sequential playback
      for (let i = 0; i < composition.length; i++) {
        const note = composition[i];
        const instrument = this.instruments[note.instrument || this.currentInstrument];
        
        if (!instrument) {
          console.error('Invalid instrument:', note.instrument);
          continue;
        }

        const noteValue = typeof note === 'string' ? note : note.note;
        const durationValue = note.duration || '8n';

        if (instrument instanceof PolySynth) {
          instrument.triggerAttackRelease(noteValue, durationValue);
        } else if (note.instrument === 'drums') {
          this.playDrumNote(noteValue);
        }

        // Wait before playing next note
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return composition.length * 500;
    } catch (error) {
      console.error('Error playing composition:', error);
      return 0;
    }
  }

  playDrumNote(note, time) {
    const { kick, snare, hihat } = this.instruments.drums;
    const noteLower = note.toLowerCase();
    
    switch(noteLower) {
      case 'c2':
      case 'c3':
      case 'c4':
        kick.triggerAttackRelease('C1', '8n', time);
        break;
      case 'd2':
      case 'd3':
      case 'd4':
        snare.triggerAttackRelease('8n', time);
        break;
      case 'e2':
      case 'e3':
      case 'e4':
        hihat.triggerAttackRelease('32n', time);
        break;
      default:
        kick.triggerAttackRelease('C1', '8n', time);
    }
  }

  stopAll() {
    Transport.stop();
    Transport.cancel();
    
    const instrument = this.instruments[this.currentInstrument];
    if (instrument && instrument.releaseAll) {
      instrument.releaseAll();
    }
  }

  setInstrument(instrumentName) {
    if (!this.instruments[instrumentName]) {
      console.warn('Invalid instrument:', instrumentName);
      return;
    }

    // Stop any currently playing notes
    const currentInst = this.instruments[this.currentInstrument];
    if (currentInst && currentInst.releaseAll) {
      currentInst.releaseAll();
    }

    this.currentInstrument = instrumentName;
    console.log('Switched to instrument:', instrumentName);
  }

  setTempo(tempo) {
    this.tempo = tempo;
    Transport.bpm.value = tempo;
  }

  setVolume(volume) {
    try {
      const db = (volume / 100 * 60) - 60; // Convert 0-100 to -60-0 dB
      
      // Handle all instruments
      Object.values(this.instruments).forEach(instrument => {
        if (instrument instanceof PolySynth) {
          instrument.volume.value = db;
        } else if (typeof instrument === 'object') {
          // Handle drum kit case
          Object.values(instrument).forEach(component => {
            if (component && component.volume) {
              component.volume.value = db;
            }
          });
        }
      });

      // Also set master volume
      if (Destination.volume) {
        Destination.volume.value = db;
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  applyEffect(effectName, isEnabled) {
    if (this.effects[effectName]) {
      console.log(`Setting ${effectName} to ${isEnabled ? 'on' : 'off'}`);
      this.effects[effectName].wet.value = isEnabled ? 0.5 : 0;
    }
  }

  // Method to publish a composition 
  publishComposition(composition, name, author) {
    try {
      // In a real app, this would be an API call to a server
      // For demo purposes, we'll just save it in local storage with a published flag
      
      let publishedCompositions = JSON.parse(localStorage.getItem('publishedCompositions') || '[]');
      
      const publishedComposition = {
        id: Date.now(),
        name: name,
        author: author || 'Anonymous',
        date: new Date().toISOString(),
        notes: composition,
        likes: 0,
        public: true
      };
      
      publishedCompositions.push(publishedComposition);
      localStorage.setItem('publishedCompositions', JSON.stringify(publishedCompositions));
      
      return publishedComposition.id;
    } catch (error) {
      console.error('Error publishing composition:', error);
      return null;
    }
  }
  
  // Get all published compositions
  getPublishedCompositions() {
    try {
      return JSON.parse(localStorage.getItem('publishedCompositions') || '[]');
    } catch (error) {
      console.error('Error loading published compositions:', error);
      return [];
    }
  }
}

// Add MusicGen AI music generation
export const generateAIMusic = async (prompt, duration = 60, genre = 'electronic') => {
  try {
    // Create a detailed prompt combining all parameters
    const fullPrompt = `${prompt}. Genre: ${genre}, Duration: ${duration} seconds. Make it ${prompt.toLowerCase().includes('happy') ? 'upbeat and energetic' : 
              prompt.toLowerCase().includes('sad') ? 'melancholic and emotional' : 
              prompt.toLowerCase().includes('energetic') ? 'dynamic and powerful' : 'balanced and melodic'}`;

    // Generate music using MusicGen API
    const response = await fetch(MUSICGEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: duration * 50, // Approximate tokens for duration
          temperature: 0.7,
          do_sample: true,
          guidance_scale: 7
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate music');
    }

    const audioData = await response.arrayBuffer();
    
    // Convert the audio data to our note format
    // This is a simplified conversion - we'll need to analyze the audio to extract actual notes
    const notes = await convertAudioToNotes(audioData);

    return notes;
  } catch (error) {
    console.error('Error generating AI music:', error);
    throw error;
  }
};

// Helper function to convert audio data to notes
const convertAudioToNotes = async (audioData) => {
  // This is a placeholder implementation
  // In a real implementation, we would:
  // 1. Analyze the audio data using Web Audio API
  // 2. Detect pitch and timing
  // 3. Convert to our note format
  
  // For now, return a simple melody
  return [
    { note: 'C4', duration: '4n', timestamp: 0, instrument: 'synth' },
    { note: 'E4', duration: '4n', timestamp: 500, instrument: 'synth' },
    { note: 'G4', duration: '4n', timestamp: 1000, instrument: 'synth' },
    { note: 'C5', duration: '4n', timestamp: 1500, instrument: 'synth' }
  ];
};

// Create and initialize a singleton instance
const audioServiceInstance = new AudioService();
audioServiceInstance.initialize();

export default audioServiceInstance; 