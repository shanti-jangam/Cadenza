import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  ListItemIcon,
  ListItemButton,
  Chip,
  Avatar,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Stack
} from '@mui/material';
import PianoRoll from '../components/PianoRoll';
import AudioService from '../services/AudioService';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReplayIcon from '@mui/icons-material/Replay';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import LayersIcon from '@mui/icons-material/Layers';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { Box as MuiBox } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';

const Compose = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [composition, setComposition] = useState([]);
  const [currentInstrument, setCurrentInstrument] = useState('piano');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(75);
  const [effects, setEffects] = useState({
    reverb: false,
    delay: false,
    distortion: false
  });
  
  const [selectedTracks, setSelectedTracks] = useState([]);
  
  // New state for track filtering
  const [trackFilter, setTrackFilter] = useState('all');
  const [regularTracks, setRegularTracks] = useState([]);
  const [importedTracks, setImportedTracks] = useState([]);
  const [mergedTracks, setMergedTracks] = useState([]);
  
  // New state for publishing
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishName, setPublishName] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // Initialize audio service
    AudioService.initialize();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleInstrumentChange = (event) => {
    const newInstrument = event.target.value;
    setCurrentInstrument(newInstrument);
    AudioService.setInstrument(newInstrument);
  };

  const handleTempoChange = (event, newValue) => {
    setTempo(newValue);
    AudioService.setTempo(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    AudioService.setVolume(newValue);
  };

  const handleEffectToggle = (effectName) => {
    const newEffects = { ...effects, [effectName]: !effects[effectName] };
    setEffects(newEffects);
    AudioService.applyEffect(effectName, !effects[effectName]);
  };
  
  const handleNotePlay = (note) => {
    AudioService.playNote({
      note: note,
      duration: '8n',
      instrument: currentInstrument
    });
  };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    AudioService.startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const recorded = AudioService.stopRecording();
    if (recorded.length > 0) {
      // Merge with existing composition
      setComposition(prevComposition => [...prevComposition, ...recorded]);
    }
  };
  
  const handlePlayComposition = () => {
    if (composition.length > 0) {
      setIsPlaying(true);
      AudioService.playComposition(composition);
      // Set a timeout to change the playing state when the composition is done
      const approxDuration = composition.length * (60 / tempo) * 1000;
      setTimeout(() => {
        setIsPlaying(false);
      }, approxDuration);
    }
  };

  const handleStopComposition = () => {
    setIsPlaying(false);
    AudioService.stopAll();
  };
  
  const handleGenerateMusic = () => {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    const durations = ['4n', '8n', '16n'];
    const generatedNotes = [];
    
    // Generate 8 random notes
    for (let i = 0; i < 8; i++) {
      generatedNotes.push({
        note: notes[Math.floor(Math.random() * notes.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        instrument: currentInstrument
      });
    }
    
    setComposition(generatedNotes);
  };
  
  const handleResetComposition = () => {
    setComposition([]);
    setIsPlaying(false);
    setIsRecording(false);
    AudioService.stopAll();
  };
  
  const handleOpenSaveDialog = () => {
    // Dialog opening logic
  };
  
  const handleOpenTrackDialog = () => {
    // Dialog opening logic
  };
  
  const handleOpenMyCompositions = () => {
    // Dialog opening logic
  };

  const handleOpenPublishDialog = () => {
    if (composition.length > 0) {
      setPublishName(`${currentInstrument.charAt(0).toUpperCase() + currentInstrument.slice(1)} Composition ${new Date().toLocaleDateString()}`);
      setAuthorName('');
      setPublishDialogOpen(true);
    } else {
      alert('Nothing to publish. Record or generate a composition first!');
    }
  };
   
  const handlePublish = () => {
    if (composition.length > 0) {
      const publishId = AudioService.publishComposition(
        composition,
        publishName,
        authorName || 'Anonymous'
      );
      
      if (publishId) {
        setPublishDialogOpen(false);
        alert(`"${publishName}" published successfully! Other musicians can now use your composition.`);
      }
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        background: 'rgba(18, 18, 24, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Piano Roll
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Play Composition">
            <IconButton 
              color="primary" 
              onClick={handlePlayComposition}
              disabled={isPlaying || composition.length === 0}
              sx={{ 
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop Playback">
            <IconButton 
              color="error" 
              onClick={handleStopComposition}
              disabled={!isPlaying}
              sx={{ 
                bgcolor: 'rgba(211, 47, 47, 0.1)',
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.2)' } 
              }}
            >
              <StopIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Generate Music">
            <IconButton 
              color="secondary" 
              onClick={handleGenerateMusic}
              sx={{ 
                bgcolor: 'rgba(156, 39, 176, 0.1)',
                '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.2)' } 
              }}
            >
              <AutoAwesomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Composition">
            <IconButton 
              color="warning" 
              onClick={handleResetComposition}
              sx={{ 
                bgcolor: 'rgba(255, 152, 0, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.2)' } 
              }}
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3, height: '200px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
        <PianoRoll 
          composition={composition}
          onNotePlay={handleNotePlay}
        />
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="fullWidth"
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px',
          },
          '& .MuiTab-root': {
            minHeight: '50px',
            padding: '6px 8px',
            fontSize: '12px',
            transition: 'all 0.2s',
            minWidth: 0,
            '&.Mui-selected': {
              fontWeight: 'bold',
            }
          }
        }}
      >
        <Tab 
          icon={<MusicNoteIcon />} 
          label="INSTRUMENT" 
          sx={{
            '&.Mui-selected': { color: '#2196f3' },
          }}
        />
        <Tab 
          icon={<TuneIcon />} 
          label="EFFECTS" 
          sx={{
            '&.Mui-selected': { color: '#4caf50' },
          }}
        />
        <Tab 
          icon={<LayersIcon />} 
          label="TRACKS" 
          sx={{
            '&.Mui-selected': { color: '#9c27b0' },
          }}
        />
        <Tab 
          icon={<GroupIcon />} 
          label="COLLAB" 
          sx={{
            '&.Mui-selected': { color: '#f44336' },
          }}
        />
      </Tabs>
      
      {/* Content container with appropriate padding */}
      <Box sx={{ px: 1, py: 1 }}>
        {/* Instrument Tab */}
        {activeTab === 0 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Instrument</InputLabel>
              <Select
                value={currentInstrument}
                onChange={handleInstrumentChange}
                label="Instrument"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value="piano">Piano</MenuItem>
                <MenuItem value="guitar">Guitar</MenuItem>
                <MenuItem value="drums">Drums</MenuItem>
                <MenuItem value="synth">Synth</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Volume
              </Typography>
              <Slider
                value={volume}
                onChange={(event, newValue) => handleVolumeChange(event, newValue)}
                aria-labelledby="volume-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
                size="small"
                sx={{ 
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                    }
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.5,
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Tempo
              </Typography>
              <Slider
                value={tempo}
                onChange={(event, newValue) => handleTempoChange(event, newValue)}
                aria-labelledby="tempo-slider"
                valueLabelDisplay="auto"
                min={60}
                max={200}
                size="small"
                sx={{ 
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 14,
                    height: 14,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                    }
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.5,
                  }
                }}
              />
            </Box>

            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Recording Controls
            </Typography>
            <Button
              variant={isRecording ? "contained" : "outlined"}
              fullWidth
              size="small"
              color="error"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              startIcon={isRecording ? <RadioButtonCheckedIcon /> : <FiberManualRecordIcon />}
              sx={{
                mb: 2,
                py: 0.7,
                borderRadius: '8px',
                background: isRecording ? 'linear-gradient(45deg, #f44336 30%, #ff1744 90%)' : 'transparent',
                boxShadow: isRecording ? '0 4px 10px rgba(244, 67, 54, 0.25)' : 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  background: isRecording ? 'linear-gradient(45deg, #ff1744 30%, #f44336 90%)' : 'rgba(244, 67, 54, 0.08)',
                  boxShadow: isRecording ? '0 6px 12px rgba(244, 67, 54, 0.3)' : 'none',
                }
              }}
            >
              {isRecording ? "STOP RECORDING" : "START RECORDING"}
            </Button>
            
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleOpenSaveDialog}
                  disabled={composition.length === 0}
                  sx={{
                    py: 0.7,
                    borderRadius: '8px',
                    borderColor: 'rgba(25, 118, 210, 0.5)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'rgba(25, 118, 210, 0.08)',
                    }
                  }}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<LayersIcon />}
                  onClick={handleOpenTrackDialog}
                  disabled={composition.length === 0}
                  sx={{
                    py: 0.7,
                    borderRadius: '8px',
                    borderColor: 'rgba(25, 118, 210, 0.5)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'rgba(25, 118, 210, 0.08)',
                    }
                  }}
                >
                  Track
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  startIcon={<FolderIcon />}
                  onClick={handleOpenMyCompositions}
                  sx={{
                    py: 0.7,
                    borderRadius: '8px',
                    borderColor: 'rgba(25, 118, 210, 0.5)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: 'rgba(25, 118, 210, 0.08)',
                    }
                  }}
                >
                  Library
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  color="success"
                  startIcon={<GroupIcon />}
                  onClick={handleOpenPublishDialog}
                  disabled={composition.length === 0}
                  sx={{
                    py: 0.7,
                    borderRadius: '8px',
                    borderColor: 'rgba(76, 175, 80, 0.5)',
                    color: 'success.main',
                    '&:hover': {
                      borderColor: 'success.main',
                      background: 'rgba(76, 175, 80, 0.08)',
                    }
                  }}
                >
                  Publish
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Effects Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Audio Effects
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant={effects.reverb ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleEffectToggle('reverb')}
                  sx={{ mb: 2 }}
                >
                  Reverb
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={effects.delay ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleEffectToggle('delay')}
                  sx={{ mb: 2 }}
                >
                  Delay
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant={effects.distortion ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => handleEffectToggle('distortion')}
                  sx={{ mb: 2 }}
                >
                  Distortion
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Tracks Tab */}
        {activeTab === 2 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tab content here... */}
          </Box>
        )}
        
        {/* Collaborations Tab */}
        {activeTab === 3 && (
          <Box>
            {/* Tab content here... */}
          </Box>
        )}
      </Box>

      {/* Publish Dialog */}
      <Dialog 
        open={publishDialogOpen} 
        onClose={() => setPublishDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(22, 22, 30, 0.98)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              Publish Composition
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share your composition with the community. Other musicians will be able to
            import and use your composition in their own projects.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Composition Name"
            type="text"
            fullWidth
            variant="outlined"
            value={publishName}
            onChange={(e) => setPublishName(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
          <TextField
            margin="dense"
            label="Your Name (optional)"
            placeholder="Anonymous"
            type="text"
            fullWidth
            variant="outlined"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
            <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon fontSize="small" sx={{ mr: 1 }} />
              Publishing makes your composition available to all Cadenza users.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
          <Button 
            onClick={() => setPublishDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            variant="contained" 
            color="success"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #81C784 30%, #4CAF50 90%)',
                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)',
              }
            }}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Compose; 