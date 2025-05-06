import React from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const CompositionVisualizer = ({ composition }) => {
  const getNotePosition = (note) => {
    const noteMap = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    const octave = parseInt(note.slice(-1));
    const noteName = note.slice(0, -1);
    return (octave - 4) * 12 * 5 + noteMap[noteName] * 5;
  };

  return (
    <Box sx={{ position: 'relative', height: '150px', mt: 2 }}>
      <AnimatePresence>
        {composition.map((note, index) => (
          <motion.div
            key={`${note.note}-${note.timestamp}`}
            initial={{ opacity: 0, x: -20, y: getNotePosition(note.note) }}
            animate={{ opacity: 1, x: index * 30 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#2196f3',
            }}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default CompositionVisualizer; 