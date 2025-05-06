import React, { useState } from 'react';
import {
  Box,
  Button,
  Slider,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TuneIcon from '@mui/icons-material/Tune';

const AIControls = ({ onGenerate, onSuggestHarmony, onGenerateVariation }) => {
  const [temperature, setTemperature] = useState(0.7);
  const [style, setStyle] = useState('classical');
  const [variationType, setVariationType] = useState('jazz');

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        AI Assistance
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Style</InputLabel>
          <Select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            label="Style"
          >
            <MenuItem value="classical">Classical</MenuItem>
            <MenuItem value="jazz">Jazz</MenuItem>
            <MenuItem value="pop">Pop</MenuItem>
            <MenuItem value="rock">Rock</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ width: 200 }}>
          <Typography variant="caption">Creativity</Typography>
          <Slider
            value={temperature}
            onChange={(_, value) => setTemperature(value)}
            min={0}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AutoFixHighIcon />}
          onClick={() => onGenerate({ temperature, style })}
        >
          Complete Melody
        </Button>

        <Button
          variant="contained"
          startIcon={<MusicNoteIcon />}
          onClick={onSuggestHarmony}
        >
          Suggest Harmony
        </Button>

        <Button
          variant="contained"
          startIcon={<TuneIcon />}
          onClick={() => onGenerateVariation(variationType)}
        >
          Generate Variation
        </Button>
      </Box>
    </Box>
  );
};

export default AIControls; 