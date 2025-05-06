import * as mm from '@magenta/music';
import * as Tone from 'tone';

class AIService {
    constructor() {
        this.musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
        this.stepsPerQuarter = 4;
        this.qpm = 120;
        
        this.initialized = false;
        this.activeNotes = new Set();
        this.isPlaying = false;
        this.currentPlaybackNotes = null;
        
        // Initialize instruments as null
        this.instruments = null;
    }

    async resetToneContext() {
        try {
            // Stop all current audio
            Tone.Transport.stop();
            Tone.Transport.cancel(0);
            
            // Dispose of current instruments
            if (this.instruments) {
                Object.values(this.instruments).forEach(instrument => {
                    try {
                        instrument.disconnect();
                        instrument.dispose();
                    } catch (e) {
                        console.warn('Error disposing instrument:', e);
                    }
                });
                this.instruments = null;
            }

            // Create fresh context
            await Tone.start();
            
            // Create fresh instruments
            await this.createInstruments();
            
            console.log('Audio context reset successful');
        } catch (error) {
            console.error('Error in resetToneContext:', error);
            // If we encounter an error, try one more time with a delay
            await new Promise(resolve => setTimeout(resolve, 100));
            await Tone.start();
            await this.createInstruments();
        }
    }

    async createInstruments() {
        // Create fresh instruments
        this.instruments = {
            'piano': new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: {
                    attack: 0.02,
                    decay: 0.15,
                    sustain: 0.6,
                    release: 0.8
                }
            }).toDestination(),
            
            'synth': new Tone.PolySynth(Tone.FMSynth, {
                oscillator: { type: 'square' },
                envelope: {
                    attack: 0.01,
                    decay: 0.15,
                    sustain: 0.4,
                    release: 0.4
                }
            }).toDestination(),
            
            'strings': new Tone.PolySynth(Tone.AMSynth, {
                oscillator: { type: 'triangle' },
                envelope: {
                    attack: 0.15,
                    decay: 0.25,
                    sustain: 0.5,
                    release: 1.0
                }
            }).toDestination(),
            
            'bass': new Tone.MonoSynth({
                oscillator: { type: 'sawtooth' },
                envelope: {
                    attack: 0.04,
                    decay: 0.15,
                    sustain: 0.5,
                    release: 0.6
                }
            }).toDestination()
        };
    }

    async stopAllPlayback() {
        // Stop all current playback immediately
        this.isPlaying = false;
        if (this.currentPlaybackNotes) {
            this.currentPlaybackNotes.forEach(note => {
                note.shouldPlay = false;
            });
            this.currentPlaybackNotes = null;
        }

        // Clear active notes
        this.activeNotes.clear();

        // Stop and reset transport
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
        Tone.Transport.position = 0;

        // Reset all instruments
        await this.resetToneContext();
    }

    async initialize() {
        if (!this.initialized) {
            try {
                await this.musicRNN.initialize();
                await Tone.start();
                this.initialized = true;
                console.log('AIService initialized successfully');
    } catch (error) {
                console.error('Error initializing AIService:', error);
      throw error;
    }
  }
    }

    getTemperatureForMood(mood) {
        const moodTemperatures = {
            'happy': 1.2,
            'sad': 0.8,
            'energetic': 1.5,
            'relaxed': 0.6,
            'epic': 1.3
        };
        return moodTemperatures[mood] || 1.0;
    }

    getMoodModifiers(mood) {
        const modifiers = {
            'happy': { octaveShift: 1, velocityBase: 0.8 },
            'sad': { octaveShift: -1, velocityBase: 0.6 },
            'energetic': { octaveShift: 1, velocityBase: 0.9 },
            'relaxed': { octaveShift: 0, velocityBase: 0.5 },
            'epic': { octaveShift: 2, velocityBase: 1.0 }
        };
        return modifiers[mood] || { octaveShift: 0, velocityBase: 0.7 };
    }

    getStyleSeedSequence(style) {
        // Style-specific moderate tempos
        const styleTempos = {
            'Electronic': 128,  // Moderate electronic tempo
            'Jazz': 112,       // Medium swing tempo
            'Classical': 96     // Comfortable classical tempo
        };
        
        // Create a properly quantized sequence
        const sequence = {
            notes: [
                { pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2 },
                { pitch: 64, quantizedStartStep: 2, quantizedEndStep: 4 }
            ],
            totalQuantizedSteps: 4,
            quantizationInfo: {
                stepsPerQuarter: this.stepsPerQuarter
            },
            tempos: [{
                time: 0,
                qpm: styleTempos[style] || 120
            }]
        };

        return sequence;
    }

    async generateMusic(prompt, style, mood, lengthInSeconds, instrument = 'piano') {
        try {
            console.log('Starting new music generation...');
            
            // Stop any existing playback and wait for cleanup
            this.isPlaying = false;
            if (this.currentPlaybackNotes) {
                this.currentPlaybackNotes.forEach(note => {
                    note.shouldPlay = false;
                });
                this.currentPlaybackNotes = null;
            }
            
            // Complete cleanup and reset with a small delay
            await this.stopAllPlayback();
            
            // Initialize if needed
            await this.initialize();
            
            // Reset Tone.js transport and cancel all scheduled events
            Tone.Transport.stop();
            Tone.Transport.cancel(0);
            Tone.Transport.position = 0;
            
            const temperature = this.getTemperatureForMood(mood);
            const moodModifiers = this.getMoodModifiers(mood);
            
            // Adjust timing for moderate playback
            const adjustedLength = lengthInSeconds * 0.75; // Play at 75% speed (moderate pace)
            const stepsPerSecond = this.stepsPerQuarter * (this.qpm / 60);
            const totalSteps = Math.floor(adjustedLength * stepsPerSecond);
            
            const seedSequence = this.getStyleSeedSequence(style);
            const result = await this.musicRNN.continueSequence(
                seedSequence,
                totalSteps,
                temperature
            );

            // Calculate target number of notes
            const targetNotes = lengthInSeconds === 30 ? 30 : 
                              lengthInSeconds === 60 ? 60 : 120;

            // Process notes with style-specific characteristics
            let processedNotes = result.notes.map((note, index) => {
                const basePitch = note.pitch + (moodModifiers.octaveShift * 12);
                let pitchVariation = 0;
                
                // Calculate moderate timing
                let time = (note.quantizedStartStep / stepsPerSecond) * 0.75; // Moderate pace
                
                // Style-specific settings with moderate durations
                let duration;
                switch(style) {
                    case 'Electronic':
                        duration = '16n'; // Moderate electronic notes
                        if (index % 2 === 0) {
                            pitchVariation = [0, 12, 7, -12][Math.floor(Math.random() * 4)];
                        }
                        time = Math.round(time * 4) / 4; // Moderate quantization
                        break;
                        
                    case 'Jazz':
                        duration = Math.random() < 0.4 ? '8n' : '4n'; // Mix of eighth and quarter notes
                        pitchVariation = Math.floor(Math.random() * 7) - 3;
                        if (index % 2 === 1) time += 0.08; // Moderate swing
                        break;
                        
                    case 'Classical':
                        duration = Math.random() < 0.6 ? '4n' : '8n'; // More quarter notes
                        pitchVariation = Math.floor(Math.random() * 5) - 2;
                        break;
                        
                    default:
                        duration = '8n';
                }

                const modifiedPitch = Math.min(Math.max(basePitch + pitchVariation, 36), 84);

                return {
                    note: Tone.Frequency(modifiedPitch, 'midi').toNote(),
                    duration: duration,
                    time: time,
                    velocity: moodModifiers.velocityBase + (Math.random() * 0.3),
                    timestamp: time * 1000,
                    instrument: instrument,
                    shouldPlay: false,
                    id: `${Date.now()}-${index}` // Add unique ID to each note
                };
            });

            // Ensure correct number of notes and proper spacing
            if (processedNotes.length > targetNotes) {
                processedNotes = processedNotes.slice(0, targetNotes);
            } else if (processedNotes.length < targetNotes) {
                const originalLength = processedNotes.length;
                for (let i = originalLength; i < targetNotes; i++) {
                    const originalNote = processedNotes[i % originalLength];
                    const newNote = {...originalNote};
                    newNote.time = (i * (adjustedLength / targetNotes));
                    newNote.timestamp = newNote.time * 1000;
                    processedNotes.push(newNote);
                }
            }

            // Sort by time
            processedNotes.sort((a, b) => a.time - b.time);

            // Store new notes
            this.currentPlaybackNotes = processedNotes;
            processedNotes.forEach(note => {
                note.shouldPlay = false;
            });

            console.log('Music generation completed. Notes ready but not playing.');
            return processedNotes;
    } catch (error) {
            console.error('Error generating music:', error);
      throw error;
    }
  }

    playNote(note) {
        if (!note?.shouldPlay || !this.isPlaying || !this.currentPlaybackNotes?.includes(note)) {
            return;
        }

        const instrument = this.instruments[note.instrument] || this.instruments['piano'];
        if (!instrument) return;

        try {
            this.activeNotes.add(note);
            instrument.triggerAttackRelease(
                note.note,
                note.duration,
                undefined,
                note.velocity
            );
        } catch (e) {
            console.error('Error playing note:', e);
            this.activeNotes.delete(note);
        }
    }

    async startPlayback(notes) {
        console.log('Starting playback of new notes...');
        
        // Stop any existing playback first
        this.isPlaying = false;
        if (this.currentPlaybackNotes) {
            this.currentPlaybackNotes.forEach(note => {
                note.shouldPlay = false;
            });
            this.currentPlaybackNotes = null;
        }
        
        // Reset Tone.js transport and cancel all scheduled events
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
        Tone.Transport.position = 0;
        
        // Ensure clean state before starting
        await this.stopAllPlayback();
        
        // Start new playback
        this.currentPlaybackNotes = notes;
        this.isPlaying = true;
        
        if (notes && Array.isArray(notes)) {
            notes.forEach(note => {
                note.shouldPlay = true;
            });
        }
    }

    async stopPlayback() {
        console.log('Stopping playback...');
        await this.stopAllPlayback();
  }
}

export default new AIService(); 