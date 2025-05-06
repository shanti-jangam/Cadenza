import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const Controls = ({ currentInstrument, onInstrumentChange, onGenerate }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Instrument</InputLabel>
        <Select
          value={currentInstrument}
          label="Instrument"
          onChange={(e) => onInstrumentChange(e.target.value)}
        >
          <MenuItem value="piano">Piano</MenuItem>
          <MenuItem value="guitar">Guitar</MenuItem>
          <MenuItem value="drums">Drums</MenuItem>
          <MenuItem value="synth">Synth</MenuItem>
        </Select>
      </FormControl>

      <ButtonGroup variant="contained">
        <Button onClick={onGenerate}>
          Generate Music
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Controls; 