const tf = require('@tensorflow/tfjs-node');

class NeuralMusicService {
  constructor() {
    this.noteMapping = {
      'C4': 0, 'C#4': 1, 'D4': 2, 'D#4': 3, 'E4': 4, 'F4': 5,
      'F#4': 6, 'G4': 7, 'G#4': 8, 'A4': 9, 'A#4': 10, 'B4': 11,
      'C5': 12, 'C#5': 13, 'D5': 14, 'D#5': 15, 'E5': 16, 'F5': 17,
      'F#5': 18, 'G5': 19, 'G#5': 20, 'A5': 21, 'A#5': 22, 'B5': 23
    };
    this.reverseNoteMapping = Object.fromEntries(
      Object.entries(this.noteMapping).map(([k, v]) => [v, k])
    );
  }

  async generateContinuation(notes, options = {}) {
    try {
      const length = options.length || 8;
      const generatedNotes = [];
      
      // Find repeating motifs in the input
      const motifs = this.findMotifs(notes);
      console.log('Found motifs:', motifs);

      // Get the last few notes as a starting point
      const lastFewNotes = notes.slice(-3);
      let currentNotes = [...lastFewNotes];

      for (let i = 0; i < length; i++) {
        // Find the next note based on the motifs
        const nextNote = this.predictNextNote(currentNotes, motifs, notes);
        const timestamp = notes[notes.length - 1].timestamp + (i + 1) * 500;
        
        generatedNotes.push({
          note: nextNote,
          timestamp,
          duration: 500
        });

        // Update current notes window
        currentNotes.push({ note: nextNote });
        currentNotes.shift();
      }

      return generatedNotes;
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }

  findMotifs(notes) {
    const motifs = [];
    
    // Look for patterns of different lengths (2-4 notes)
    for (let length = 2; length <= 4; length++) {
      for (let i = 0; i < notes.length - length; i++) {
        const pattern = notes.slice(i, i + length).map(n => n.note);
        const nextNote = notes[i + length]?.note;
        
        if (nextNote) {
          motifs.push({
            pattern,
            nextNote,
            length: length
          });
        }
      }
    }

    // Count pattern occurrences
    const patternCounts = {};
    motifs.forEach(motif => {
      const key = motif.pattern.join(',');
      if (!patternCounts[key]) {
        patternCounts[key] = {
          pattern: motif.pattern,
          nextNotes: {},
          count: 0
        };
      }
      patternCounts[key].count++;
      patternCounts[key].nextNotes[motif.nextNote] = 
        (patternCounts[key].nextNotes[motif.nextNote] || 0) + 1;
    });

    return Object.values(patternCounts)
      .sort((a, b) => b.count - a.count);
  }

  predictNextNote(currentNotes, motifs, originalNotes) {
    const currentPattern = currentNotes.map(n => n.note);
    
    // Try to find matching patterns of different lengths
    for (const motif of motifs) {
      const patternLength = motif.pattern.length;
      if (this.patternsMatch(currentPattern.slice(-patternLength), motif.pattern)) {
        // Get the most common next note for this pattern
        const nextNotes = motif.nextNotes;
        const mostCommonNext = Object.entries(nextNotes)
          .sort((a, b) => b[1] - a[1])[0];
        
        if (mostCommonNext) {
          return mostCommonNext[0];
        }
      }
    }

    // If no pattern match found, use interval-based continuation
    const lastNote = currentNotes[currentNotes.length - 1].note;
    const intervals = this.findCommonIntervals(originalNotes);
    
    if (intervals.length > 0) {
      const interval = intervals[Math.floor(Math.random() * intervals.length)];
      const lastIndex = this.noteMapping[lastNote];
      const nextIndex = (lastIndex + interval + 24) % 24;
      return this.reverseNoteMapping[nextIndex];
    }

    // Fallback to chromatic movement
    const lastIndex = this.noteMapping[lastNote];
    const direction = Math.random() < 0.5 ? 1 : -1;
    const nextIndex = (lastIndex + direction + 24) % 24;
    return this.reverseNoteMapping[nextIndex];
  }

  patternsMatch(pattern1, pattern2) {
    if (pattern1.length !== pattern2.length) return false;
    return pattern1.every((note, i) => note === pattern2[i]);
  }

  findCommonIntervals(notes) {
    const intervals = [];
    for (let i = 1; i < notes.length; i++) {
      const interval = this.noteMapping[notes[i].note] - 
                      this.noteMapping[notes[i-1].note];
      intervals.push(interval);
    }
    
    // Count and sort intervals by frequency
    const counts = {};
    intervals.forEach(interval => {
      counts[interval] = (counts[interval] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([interval]) => parseInt(interval));
  }

  async train() {
    return { message: 'Pattern-based generation does not require training' };
  }
}

module.exports = new NeuralMusicService();