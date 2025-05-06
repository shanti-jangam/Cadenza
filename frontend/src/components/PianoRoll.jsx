import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const PianoRoll = ({ composition, onNotePlay }) => {
  const [activeNotes, setActiveNotes] = useState([]);
  const [grid, setGrid] = useState([]);
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octaves = [3, 4, 5];
  const beats = 16;

  useEffect(() => {
    // Initialize grid
    const newGrid = [];
    for (let octave of octaves) {
      for (let note of notes) {
        newGrid.push({
          id: `${note}${octave}`,
          note: `${note}${octave}`,
          active: false,
          beat: 0,
        });
      }
    }
    setGrid(newGrid);
  }, []);

  const handleNoteClick = (noteId, beat) => {
    const updatedGrid = grid.map(note => {
      if (note.id === noteId) {
        return { ...note, active: !note.active, beat };
      }
      return note;
    });
    setGrid(updatedGrid);
    onNotePlay({
      note: noteId,
      duration: '8n'
    });
  };

  const renderPianoKeys = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {octaves.map(octave => (
          <Box key={octave} sx={{ display: 'flex', mb: 1 }}>
            {notes.map(note => {
              const isBlack = note.includes('#');
              return (
                <motion.div
                  key={`${note}${octave}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: isBlack ? '40px' : '60px',
                    height: isBlack ? '120px' : '180px',
                    backgroundColor: isBlack ? '#333' : '#fff',
                    border: '1px solid #ccc',
                    margin: '0 1px',
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: '0 0 4px 4px',
                  }}
                  onClick={() => handleNoteClick(`${note}${octave}`, 0)}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: isBlack ? '#fff' : '#000',
                    }}
                  >
                    {note}{octave}
                  </Typography>
                </motion.div>
              );
            })}
          </Box>
        ))}
      </Box>
    );
  };

  const renderGrid = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {grid.map((note, index) => (
          <Box
            key={note.id}
            sx={{
              display: 'flex',
              height: '30px',
              borderBottom: '1px solid #eee',
            }}
          >
            {Array.from({ length: beats }).map((_, beatIndex) => (
              <Box
                key={beatIndex}
                sx={{
                  width: '40px',
                  borderRight: '1px solid #eee',
                  backgroundColor: note.active && note.beat === beatIndex ? '#1976d2' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                }}
                onClick={() => handleNoteClick(note.id, beatIndex)}
              />
            ))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ width: '200px' }}>
        {renderPianoKeys()}
      </Box>
      <Box sx={{ flex: 1, overflowX: 'auto' }}>
        {renderGrid()}
      </Box>
    </Box>
  );
};

export default PianoRoll; 