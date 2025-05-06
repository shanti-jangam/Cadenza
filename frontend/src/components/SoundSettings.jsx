import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography,
} from '@mui/material';
import AudioService from '../services/AudioService';

const SoundSettings = ({ open, onClose }) => {
  const [settings, setSettings] = React.useState(AudioService.settings);

  const handleChange = (type, value) => {
    let newSettings = { ...settings };
    switch (type) {
      case 'oscillator':
        newSettings.oscillator.type = value;
        break;
      case 'attack':
      case 'decay':
      case 'sustain':
      case 'release':
        newSettings.envelope[type] = value;
        break;
      case 'volume':
        newSettings.volume = value;
        break;
      case 'reverb':
      case 'delay':
        newSettings.effects[type] = value;
        break;
    }
    setSettings(newSettings);
    AudioService[`set${type.charAt(0).toUpperCase() + type.slice(1)}`](value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sound Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Waveform</InputLabel>
            <Select
              value={settings.oscillator.type}
              onChange={(e) => handleChange('oscillator', e.target.value)}
              label="Waveform"
            >
              <MenuItem value="sine">Sine</MenuItem>
              <MenuItem value="square">Square</MenuItem>
              <MenuItem value="triangle">Triangle</MenuItem>
              <MenuItem value="sawtooth">Sawtooth</MenuItem>
            </Select>
          </FormControl>

          <Typography gutterBottom>Volume</Typography>
          <Slider
            value={settings.volume}
            onChange={(_, value) => handleChange('volume', value)}
            min={-60}
            max={0}
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Typography gutterBottom>Envelope</Typography>
          <Box sx={{ mb: 3 }}>
            {Object.entries(settings.envelope).map(([param, value]) => (
              <Box key={param} sx={{ mb: 2 }}>
                <Typography variant="caption" textTransform="capitalize">
                  {param}
                </Typography>
                <Slider
                  value={value}
                  onChange={(_, val) => handleChange(param, val)}
                  min={0}
                  max={1}
                  step={0.01}
                  valueLabelDisplay="auto"
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.effects.reverb}
                  onChange={(e) => handleChange('reverb', e.target.checked)}
                />
              }
              label="Reverb"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.effects.delay}
                  onChange={(e) => handleChange('delay', e.target.checked)}
                />
              }
              label="Delay"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SoundSettings; 