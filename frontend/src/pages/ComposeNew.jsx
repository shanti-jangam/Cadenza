import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Divider,
  Tabs, Tab, IconButton, Tooltip, Button, Slider,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemSecondary,
  ListItemIcon, ListItemButton, Chip, Avatar, Badge,
  Switch, FormControlLabel, Accordion, AccordionSummary,
  AccordionDetails, Card, CardContent, CardActions,
  CardHeader, ListSubheader, Stack, CircularProgress,
  Alert, AlertTitle
} from '@mui/material';
import { useSnackbar } from 'notistack';
import PianoRoll from '../components/PianoRoll';
import AudioService from '../services/AudioService';
import { Destination } from 'tone';
import { generateAIMusic } from '../services/AudioService';
import AIService from '../services/AIService';

// Import icons
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
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import MusicOffIcon from '@mui/icons-material/MusicOff';

const ComposeNew = () => {
  // State Management
  const [composition, setComposition] = useState([]);
  const [currentInstrument, setCurrentInstrument] = useState('piano');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(75);
  const [pianoRollKey, setPianoRollKey] = useState(0);

  // Effects state
  const [effects, setEffects] = useState({
    reverb: false,
    delay: false,
    distortion: false
  });

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [myCompositionsOpen, setMyCompositionsOpen] = useState(false);
  const [collaborationsOpen, setCollaborationsOpen] = useState(false);

  // Track management states
  const [trackName, setTrackName] = useState('');
  const [trackFilter, setTrackFilter] = useState('regular');
  const [regularTracks, setRegularTracks] = useState([]);
  const [importedTracks, setImportedTracks] = useState([]);
  const [mergedTracks, setMergedTracks] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Composition states
  const [compositionName, setCompositionName] = useState('');
  const [savedCompositions, setSavedCompositions] = useState([]);
  const [collaborationCompositions, setCollaborationCompositions] = useState([]);
  const [libraryCompositions, setLibraryCompositions] = useState([]);

  // Publishing states
  const [publishName, setPublishName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedPublishTracks, setSelectedPublishTracks] = useState([]);

  // Add AI generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStyle, setAiStyle] = useState('classical');
  const [aiLength, setAiLength] = useState('medium');
  const [aiMood, setAiMood] = useState('happy');

  const { enqueueSnackbar } = useSnackbar();

  // Initialize audio context and load saved data
  useEffect(() => {
    const initializeAudio = async () => {
      await AudioService.initialize();
      loadSavedCompositions();
      loadSavedTracks();
      loadCollaborationCompositions();
      AudioService.setVolume(volume);
    };

    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    AudioService.setVolume(volume);
  }, [volume]);

  // Core Playback Functions
  const handlePlayComposition = async () => {
    if (composition.length === 0) {
      enqueueSnackbar('No composition to play', { variant: 'warning' });
      return;
    }

    try {
      // Stop any existing playback
      handleStopComposition();
      
      setIsPlaying(true);
      
      // Play the composition and get the duration
      const duration = await AudioService.playComposition(composition);
      
      // Set a timeout to update the playing state
      setTimeout(() => {
        setIsPlaying(false);
      }, duration);
      
    } catch (error) {
      console.error('Error playing composition:', error);
      setIsPlaying(false);
      enqueueSnackbar('Error playing composition', { variant: 'error' });
    }
  };

  const handleStopComposition = () => {
    setIsPlaying(false);
    AudioService.stopAll();
  };

  // Recording Functions
  const handleStartRecording = () => {
    try {
      handleStopComposition();
      setComposition([]);
      setIsPlaying(false);
      setPianoRollKey(prevKey => prevKey + 1);
      
      setIsRecording(true);
      AudioService.startRecording();
      
      enqueueSnackbar('Recording started...', { variant: 'info' });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      enqueueSnackbar('Error starting recording', { variant: 'error' });
    }
  };

  const handleStopRecording = () => {
    try {
      setIsRecording(false);
      const recorded = AudioService.stopRecording();
      
      if (recorded && recorded.length > 0) {
        setComposition(recorded);
        setPianoRollKey(prevKey => prevKey + 1);
        enqueueSnackbar('Recording completed!', { variant: 'success' });
      } else {
        enqueueSnackbar('No notes were recorded', { variant: 'warning' });
        setComposition([]);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      enqueueSnackbar('Error stopping recording', { variant: 'error' });
      setComposition([]);
    }
  };

  // Track Management Functions
  const handleSaveTrack = () => {
    if (!trackName.trim()) {
      enqueueSnackbar('Please provide a track name', { variant: 'warning' });
      return;
    }

    try {
      const trackId = Date.now().toString();
      
      // Ensure notes have timestamps
      const notesWithTimestamps = composition.map((note, index) => ({
        ...note,
        timestamp: note.timestamp || index * 500, // 500ms spacing if no timestamp
        instrument: note.instrument || currentInstrument
      }));

      const newTrack = {
        id: trackId,
        name: trackName,
        instrument: currentInstrument,
        notes: notesWithTimestamps,
        type: 'regular',
        createdAt: new Date().toISOString()
      };

      // Update state
      setRegularTracks(prev => [...prev, newTrack]);
      setSavedTracks(prev => [...prev, newTrack]);
      
      // Save to localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      localStorage.setItem('savedTracks', JSON.stringify([...existingTracks, newTrack]));
      
      // Close dialog and reset state
      setTrackDialogOpen(false);
      setTrackName('');
      
      // Show success message
      enqueueSnackbar('Track saved successfully!', { variant: 'success' });
      
      // Reload tracks to ensure UI is up to date
      loadSavedTracks();
    } catch (error) {
      console.error('Error saving track:', error);
      enqueueSnackbar('Failed to save track', { variant: 'error' });
    }
  };

  const handleLoadTrack = async (track) => {
    try {
      if (!track || !track.notes) {
        enqueueSnackbar('Invalid track data', { variant: 'error' });
        return;
      }

      // Stop any current playback
      handleStopComposition();
      
      // Set the instrument
      if (track.instrument) {
        setCurrentInstrument(track.instrument);
        AudioService.setInstrument(track.instrument);
      }
      
      // Ensure notes have timestamps and instrument info
      let currentTime = 0;
      const processedNotes = track.notes.map((note, index) => {
        // If note has a timestamp, use it, otherwise calculate based on index
        const timestamp = note.timestamp || currentTime;
        
        // Calculate next note's start time
        const duration = note.duration || '8n';
        const durationMs = {
          '2n': 1000,
          '4n': 500,
          '4n.': 750,
          '8n': 250,
          '8n.': 375,
          '16n': 125
        }[duration] || 500;
        
        currentTime = timestamp + durationMs;
        
        return {
          ...note,
          timestamp,
          instrument: note.instrument || track.instrument || currentInstrument,
          duration: duration
        };
      });
      
      // Update composition with processed notes
      setComposition(processedNotes);
      setPianoRollKey(prevKey => prevKey + 1);
      
      // Play the track using handlePlayComposition
      await handlePlayComposition();

      enqueueSnackbar(`Loaded track: ${track.name}`, { variant: 'success' });
    } catch (error) {
      console.error('Error loading track:', error);
      enqueueSnackbar('Error loading track', { variant: 'error' });
    }
  };

  const handleDeleteTrack = (trackId) => {
    try {
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      const updatedTracks = existingTracks.filter(track => track.id !== trackId);
      localStorage.setItem('savedTracks', JSON.stringify(updatedTracks));
      
      setRegularTracks(prev => prev.filter(track => track.id !== trackId));
      setSavedTracks(prev => prev.filter(track => track.id !== trackId));
      
      enqueueSnackbar('Track deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting track:', error);
      enqueueSnackbar('Error deleting track', { variant: 'error' });
    }
  };

  // Additional Functions
  const handleGenerateMusic = () => {
    try {
      const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
      const durations = ['4n', '8n', '16n'];
      const generatedNotes = [];
      
      for (let i = 0; i < 8; i++) {
        generatedNotes.push({
          note: notes[Math.floor(Math.random() * notes.length)],
          duration: durations[Math.floor(Math.random() * durations.length)],
          instrument: currentInstrument,
          timestamp: i * (60 / tempo) * 1000
        });
      }
      
      setComposition(generatedNotes);
      enqueueSnackbar('Generated new melody', { variant: 'success' });
      
      setTimeout(() => {
        handlePlayComposition();
      }, 100);
    } catch (error) {
      console.error('Error generating music:', error);
      enqueueSnackbar('Error generating music', { variant: 'error' });
    }
  };

  const handleResetComposition = () => {
    try {
      handleStopComposition();
      setIsRecording(false);
      AudioService.stopAll();
      setComposition([]);
      setPianoRollKey(prevKey => prevKey + 1);
      enqueueSnackbar('Composition reset', { variant: 'info' });
    } catch (error) {
      console.error('Error resetting composition:', error);
      enqueueSnackbar('Error resetting composition', { variant: 'error' });
    }
  };

  const handleInstrumentChange = (event) => {
    const newInstrument = event.target.value;
    console.log('Changing instrument in ComposeNew:', {
      from: currentInstrument,
      to: newInstrument
    });
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
    setEffects(prev => {
      const newEffects = { ...prev, [effectName]: !prev[effectName] };
      AudioService.applyEffect(effectName, newEffects[effectName]);
      return newEffects;
    });
  };

  const handleNotePlay = (note) => {
    console.log('handleNotePlay called with:', {
      note,
      currentInstrument
    });
    
    // Create a proper note object
    const noteToPlay = {
      note: typeof note === 'string' ? note : note.note,
      duration: '8n',
      instrument: currentInstrument
    };
    
    console.log('Playing note with:', noteToPlay);
    AudioService.playNote(noteToPlay);
  };

  // Load functions
  const loadSavedCompositions = () => {
    try {
      const compositions = JSON.parse(localStorage.getItem('savedCompositions') || '[]');
      setSavedCompositions(compositions);
    } catch (error) {
      console.error('Error loading compositions:', error);
      enqueueSnackbar('Error loading compositions', { variant: 'error' });
    }
  };

  const loadSavedTracks = () => {
    try {
      const tracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      const regular = tracks.filter(track => track.type === 'regular' || !track.type);
      const imported = tracks.filter(track => track.type === 'imported');
      const merged = tracks.filter(track => track.type === 'merged');
      
      setRegularTracks(regular);
      setImportedTracks(imported);
      setMergedTracks(merged);
      setSavedTracks(tracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
      enqueueSnackbar('Error loading tracks', { variant: 'error' });
    }
  };

  const loadCollaborationCompositions = () => {
    const demoCompositions = [
      {
        id: 'demo1',
        name: 'Jazz Piano Solo',
        author: 'Marcus Thompson',
        instrument: 'piano',
        notes: [
          { note: 'D4', duration: '4n', timestamp: 0 },
          { note: 'F4', duration: '4n', timestamp: 500 },
          { note: 'A4', duration: '4n', timestamp: 1000 },
          { note: 'G4', duration: '8n', timestamp: 1500 },
          { note: 'E4', duration: '8n', timestamp: 1750 },
          { note: 'D4', duration: '2n', timestamp: 2000 },
          { note: 'C4', duration: '4n', timestamp: 3000 },
          { note: 'E4', duration: '4n', timestamp: 3500 },
          { note: 'D4', duration: '2n', timestamp: 4000 }
        ]
      },
      {
        id: 'demo2',
        name: 'Rock Guitar Riff',
        author: 'Alex Rivera',
        instrument: 'guitar',
        notes: [
          { note: 'E3', duration: '8n', timestamp: 0 },
          { note: 'G3', duration: '8n', timestamp: 250 },
          { note: 'A3', duration: '8n', timestamp: 500 },
          { note: 'B3', duration: '8n', timestamp: 750 },
          { note: 'E4', duration: '4n', timestamp: 1000 },
          { note: 'B3', duration: '8n', timestamp: 1500 },
          { note: 'A3', duration: '8n', timestamp: 1750 },
          { note: 'G3', duration: '4n', timestamp: 2000 }
        ]
      },
      {
        id: 'demo3',
        name: 'Funky Synth Line',
        author: 'Sarah Chen',
        instrument: 'synth',
        notes: [
          { note: 'C4', duration: '16n', timestamp: 0 },
          { note: 'E4', duration: '16n', timestamp: 125 },
          { note: 'G4', duration: '8n', timestamp: 250 },
          { note: 'C5', duration: '8n', timestamp: 500 },
          { note: 'B4', duration: '16n', timestamp: 750 },
          { note: 'G4', duration: '16n', timestamp: 875 },
          { note: 'E4', duration: '8n', timestamp: 1000 },
          { note: 'C4', duration: '4n', timestamp: 1250 }
        ]
      },
      {
        id: 'demo4',
        name: 'Basic Drum Pattern',
        author: 'Mike Johnson',
        instrument: 'drums',
        notes: [
          { note: 'C2', duration: '8n', timestamp: 0 },    // Kick
          { note: 'E2', duration: '8n', timestamp: 250 },  // HiHat
          { note: 'D2', duration: '8n', timestamp: 500 },  // Snare
          { note: 'E2', duration: '8n', timestamp: 750 },  // HiHat
          { note: 'C2', duration: '8n', timestamp: 1000 }, // Kick
          { note: 'E2', duration: '8n', timestamp: 1250 }, // HiHat
          { note: 'D2', duration: '8n', timestamp: 1500 }, // Snare
          { note: 'E2', duration: '8n', timestamp: 1750 }  // HiHat
        ]
      },
      {
        id: 'demo5',
        name: 'Classical Piano Theme',
        author: 'Emily Williams',
        instrument: 'piano',
        notes: [
          { note: 'G4', duration: '4n', timestamp: 0 },
          { note: 'E4', duration: '8n', timestamp: 500 },
          { note: 'E4', duration: '8n', timestamp: 750 },
          { note: 'F4', duration: '4n', timestamp: 1000 },
          { note: 'D4', duration: '4n', timestamp: 1500 },
          { note: 'C4', duration: '4n', timestamp: 2000 },
          { note: 'E4', duration: '4n', timestamp: 2500 },
          { note: 'G4', duration: '2n', timestamp: 3000 }
        ]
      },
      {
        id: 'demo6',
        name: 'Spanish Guitar',
        author: 'Carlos Ruiz',
        instrument: 'guitar',
        notes: [
          { note: 'E3', duration: '8n', timestamp: 0 },
          { note: 'A3', duration: '8n', timestamp: 250 },
          { note: 'C4', duration: '8n', timestamp: 500 },
          { note: 'B3', duration: '8n', timestamp: 750 },
          { note: 'G3', duration: '4n', timestamp: 1000 },
          { note: 'F3', duration: '8n', timestamp: 1500 },
          { note: 'E3', duration: '2n', timestamp: 1750 }
        ]
      },
      {
        id: 'demo7',
        name: 'Dreamy Synth Pad',
        author: 'Luna Park',
        instrument: 'synth',
        notes: [
          { note: 'F4', duration: '2n', timestamp: 0 },
          { note: 'A4', duration: '2n', timestamp: 1000 },
          { note: 'C5', duration: '2n', timestamp: 2000 },
          { note: 'E5', duration: '2n', timestamp: 3000 },
          { note: 'D5', duration: '2n', timestamp: 4000 },
          { note: 'B4', duration: '2n', timestamp: 5000 }
        ]
      },
      {
        id: 'demo8',
        name: 'Jazz Drum Solo',
        author: 'Tony Brooks',
        instrument: 'drums',
        notes: [
          { note: 'C2', duration: '16n', timestamp: 0 },
          { note: 'E2', duration: '16n', timestamp: 125 },
          { note: 'D2', duration: '8n', timestamp: 250 },
          { note: 'E2', duration: '16n', timestamp: 500 },
          { note: 'C2', duration: '16n', timestamp: 625 },
          { note: 'D2', duration: '8n', timestamp: 750 },
          { note: 'E2', duration: '16n', timestamp: 1000 },
          { note: 'C2', duration: '8n', timestamp: 1250 }
        ]
      },
      {
        id: 'demo9',
        name: 'Romantic Piano',
        author: 'Sophie Chen',
        instrument: 'piano',
        notes: [
          { note: 'C4', duration: '4n', timestamp: 0 },
          { note: 'E4', duration: '4n', timestamp: 500 },
          { note: 'G4', duration: '4n', timestamp: 1000 },
          { note: 'C5', duration: '2n', timestamp: 1500 },
          { note: 'B4', duration: '4n', timestamp: 2500 },
          { note: 'G4', duration: '2n', timestamp: 3000 }
        ]
      },
      {
        id: 'demo10',
        name: 'Metal Guitar Riff',
        author: 'Jack Steel',
        instrument: 'guitar',
        notes: [
          { note: 'E3', duration: '16n', timestamp: 0 },
          { note: 'G3', duration: '16n', timestamp: 125 },
          { note: 'B3', duration: '16n', timestamp: 250 },
          { note: 'E4', duration: '8n', timestamp: 375 },
          { note: 'B3', duration: '16n', timestamp: 625 },
          { note: 'G3', duration: '16n', timestamp: 750 },
          { note: 'E3', duration: '8n', timestamp: 875 }
        ]
      },
      {
        id: 'demo11',
        name: 'Electronic Dance',
        author: 'DJ Wave',
        instrument: 'synth',
        notes: [
          { note: 'F4', duration: '8n', timestamp: 0 },
          { note: 'A4', duration: '8n', timestamp: 250 },
          { note: 'C5', duration: '8n', timestamp: 500 },
          { note: 'F5', duration: '4n', timestamp: 750 },
          { note: 'E5', duration: '8n', timestamp: 1250 },
          { note: 'C5', duration: '8n', timestamp: 1500 },
          { note: 'A4', duration: '4n', timestamp: 1750 }
        ]
      },
      {
        id: 'demo12',
        name: 'Hip Hop Beat',
        author: 'Beat Master',
        instrument: 'drums',
        notes: [
          { note: 'C2', duration: '8n', timestamp: 0 },
          { note: 'E2', duration: '16n', timestamp: 250 },
          { note: 'E2', duration: '16n', timestamp: 375 },
          { note: 'D2', duration: '8n', timestamp: 500 },
          { note: 'C2', duration: '8n', timestamp: 750 },
          { note: 'E2', duration: '16n', timestamp: 1000 },
          { note: 'D2', duration: '8n', timestamp: 1250 }
        ]
      },
      {
        id: 'demo13',
        name: 'Blues Piano',
        author: 'Ray Johnson',
        instrument: 'piano',
        notes: [
          { note: 'G3', duration: '8n', timestamp: 0 },
          { note: 'Bb3', duration: '8n', timestamp: 250 },
          { note: 'C4', duration: '8n', timestamp: 500 },
          { note: 'Eb4', duration: '4n', timestamp: 750 },
          { note: 'D4', duration: '8n', timestamp: 1250 },
          { note: 'C4', duration: '4n', timestamp: 1500 }
        ]
      },
      {
        id: 'demo14',
        name: 'Acoustic Guitar',
        author: 'Maria Garcia',
        instrument: 'guitar',
        notes: [
          { note: 'D3', duration: '4n', timestamp: 0 },
          { note: 'F#3', duration: '4n', timestamp: 500 },
          { note: 'A3', duration: '4n', timestamp: 1000 },
          { note: 'D4', duration: '2n', timestamp: 1500 },
          { note: 'B3', duration: '4n', timestamp: 2500 },
          { note: 'G3', duration: '2n', timestamp: 3000 }
        ]
      },
      {
        id: 'demo15',
        name: 'Ambient Synth',
        author: 'Echo Dreams',
        instrument: 'synth',
        notes: [
          { note: 'E4', duration: '2n', timestamp: 0 },
          { note: 'G4', duration: '2n', timestamp: 1000 },
          { note: 'B4', duration: '2n', timestamp: 2000 },
          { note: 'D5', duration: '2n', timestamp: 3000 },
          { note: 'C5', duration: '2n', timestamp: 4000 },
          { note: 'A4', duration: '2n', timestamp: 5000 }
        ]
      }
    ];
    setCollaborationCompositions(demoCompositions);
  };

  // Add function to preview composition
  const handlePreviewComposition = async (composition) => {
    try {
      // Stop any current playback
      handleStopComposition();
      
      // Set the instrument
      if (composition.instrument) {
        AudioService.setInstrument(composition.instrument);
      }
      
      // Play the composition
      await AudioService.playComposition(composition.notes);
      
      enqueueSnackbar(`Playing: ${composition.name}`, { variant: 'info' });
    } catch (error) {
      console.error('Error previewing composition:', error);
      enqueueSnackbar('Error playing preview', { variant: 'error' });
    }
  };

  // Add handlePublish function
  const handlePublish = async () => {
    try {
      if (!publishName.trim()) {
        enqueueSnackbar('Please provide a composition name', { variant: 'warning' });
        return;
      }

      // Create the composition object
      const compositionToPublish = {
        id: Date.now().toString(),
        name: publishName,
        author: authorName || 'Anonymous',
        notes: composition,
        instrument: currentInstrument,
        createdAt: new Date().toISOString(),
        isPublished: true
      };

      // Save to local storage
      const existingCompositions = JSON.parse(localStorage.getItem('publishedCompositions') || '[]');
      localStorage.setItem('publishedCompositions', JSON.stringify([...existingCompositions, compositionToPublish]));

      // Update state
      setCollaborationCompositions(prev => [...prev, compositionToPublish]);
      
      // Close dialog and reset form
      setPublishDialogOpen(false);
      setPublishName('');
      setAuthorName('');
      
      enqueueSnackbar('Composition published successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error publishing composition:', error);
      enqueueSnackbar('Failed to publish composition', { variant: 'error' });
    }
  };

  // Add handleImportCollaboration function
  const handleImportCollaboration = async (collab) => {
    try {
      // Stop any current playback
      handleStopComposition();
      
      // Set the instrument from the collaboration
      if (collab.instrument) {
        setCurrentInstrument(collab.instrument);
        AudioService.setInstrument(collab.instrument);
      }
      
      // Process notes with timestamps
      let currentTime = 0;
      const processedNotes = (collab.notes || []).map((note, index) => {
        const timestamp = note.timestamp || currentTime;
        const duration = note.duration || '8n';
        const durationMs = {
          '2n': 1000,
          '4n': 500,
          '4n.': 750,
          '8n': 250,
          '8n.': 375,
          '16n': 125
        }[duration] || 500;
        
        currentTime = timestamp + durationMs;
        
        return {
          ...note,
          timestamp,
          instrument: note.instrument || collab.instrument || currentInstrument,
          duration: duration
        };
      });
      
      // Save as imported track
      const trackId = Date.now().toString();
      const importedTrack = {
        id: trackId,
        name: `${collab.name} (imported)`,
        instrument: collab.instrument || currentInstrument,
        notes: processedNotes,
        type: 'imported',
        originalAuthor: collab.author,
        createdAt: new Date().toISOString()
      };

      // Update tracks state
      setImportedTracks(prev => [...prev, importedTrack]);
      setSavedTracks(prev => [...prev, importedTrack]);
      
      // Save to localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      localStorage.setItem('savedTracks', JSON.stringify([...existingTracks, importedTrack]));
      
      // Set composition and play
      setComposition(processedNotes);
      setPianoRollKey(prevKey => prevKey + 1);
      
      enqueueSnackbar(`Imported "${collab.name}" successfully!`, { variant: 'success' });
      
      // Play the imported composition
      await handlePlayComposition();
      
    } catch (error) {
      console.error('Error importing collaboration:', error);
      enqueueSnackbar('Failed to import collaboration', { variant: 'error' });
    }
  };

  // Update handleAIGenerate function
  const handleAIGenerate = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      
      // Convert length to seconds
      const lengthMap = {
        'short': 30,
        'medium': 60,
        'long': 120
      };
      const lengthInSeconds = lengthMap[aiLength] || 60;

      // Generate music using AIService
      const generatedNotes = await AIService.generateMusic(
        null, // No prompt needed
        aiStyle,
        aiMood,
        lengthInSeconds
      );

      // Update composition with generated notes
      setComposition(generatedNotes);
      setPianoRollKey(prevKey => prevKey + 1);

      // Automatically save as a track
      const trackId = Date.now().toString();
      const newTrack = {
        id: trackId,
        name: `AI ${aiStyle} - ${aiMood} (${aiLength})`,
        instrument: currentInstrument,
        notes: generatedNotes,
        type: 'ai-generated',
        createdAt: new Date().toISOString()
      };

      // Update state
      setRegularTracks(prev => [...prev, newTrack]);
      setSavedTracks(prev => [...prev, newTrack]);
      
      // Save to localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      localStorage.setItem('savedTracks', JSON.stringify([...existingTracks, newTrack]));
      
      // Play the generated music
      handlePlayComposition();
      
      enqueueSnackbar('Music generated and saved as track!', { variant: 'success' });
    } catch (error) {
      console.error('Error generating music:', error);
      enqueueSnackbar('Failed to generate music', { variant: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add these functions before the return statement

  const handleOpenMergeDialog = () => {
    try {
      if (savedTracks.length < 2) {
        enqueueSnackbar('You need at least 2 tracks to merge. Create more tracks first.', { variant: 'warning' });
        return;
      }
      setSelectedTracks([]);
      setMergeDialogOpen(true);
    } catch (error) {
      console.error('Error opening merge dialog:', error);
      enqueueSnackbar('Error opening merge dialog', { variant: 'error' });
    }
  };

  const handleToggleTrackSelection = (trackId) => {
    try {
      setSelectedTracks(prev => {
        if (prev.includes(trackId)) {
          return prev.filter(id => id !== trackId);
        } else {
          return [...prev, trackId];
        }
      });
    } catch (error) {
      console.error('Error toggling track selection:', error);
      enqueueSnackbar('Error selecting track', { variant: 'error' });
    }
  };

  const handleMergeTracks = () => {
    if (selectedTracks.length < 2) {
      enqueueSnackbar('Please select at least 2 tracks to merge', { variant: 'warning' });
      return;
    }

    try {
      // Get selected tracks
      const tracksToMerge = savedTracks.filter(track => selectedTracks.includes(track.id));

      if (tracksToMerge.length < 2) {
        enqueueSnackbar('Could not find all selected tracks', { variant: 'error' });
        return;
      }

      // Sort all notes by timestamp
      const allNotes = tracksToMerge.reduce((notes, track) => {
        return [...notes, ...track.notes.map(note => ({
          ...note,
          originalTrack: track.name,
          instrument: note.instrument || track.instrument
        }))];
      }, []).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      // Create merged track
      const newMergedTrack = {
        id: `merged_${Date.now()}`,
        name: `Merged: ${tracksToMerge.map(t => t.name).join(' + ')}`,
        notes: allNotes,
        type: 'merged',
        instrument: 'mixed',
        createdAt: new Date().toISOString(),
        parentTracks: tracksToMerge.map(t => t.id)
      };

      // Update state
      setMergedTracks(prev => [...prev, newMergedTrack]);
      setSavedTracks(prev => [...prev, newMergedTrack]);

      // Save to localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      localStorage.setItem('savedTracks', JSON.stringify([...existingTracks, newMergedTrack]));

      // Close dialog and reset selection
      setMergeDialogOpen(false);
      setSelectedTracks([]);

      // Show success message
      enqueueSnackbar('Tracks merged successfully!', { variant: 'success' });

      // Load the merged track
      handleLoadTrack(newMergedTrack);
    } catch (error) {
      console.error('Error merging tracks:', error);
      enqueueSnackbar('Failed to merge tracks', { variant: 'error' });
    }
  };

  // UI Components
  const MainControls = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3,
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      pb: 2
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        display: 'flex', 
        alignItems: 'center',
        color: '#2196f3'
      }}>
        <MusicNoteIcon sx={{ mr: 1 }} />
        Piano Roll
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Play Button */}
        <Tooltip title={composition.length === 0 ? "Create a composition first" : "Play"}>
          <span>
            <IconButton
              color="primary"
              onClick={handlePlayComposition}
              disabled={isRecording || composition.length === 0}
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' }
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Stop Button */}
        <Tooltip title="Stop">
          <span>
            <IconButton
              color="error"
              onClick={handleStopComposition}
              disabled={!isPlaying}
              sx={{
                bgcolor: 'rgba(211, 47, 47, 0.08)',
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.15)' }
              }}
            >
              <StopIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Add Track Button */}
        <Tooltip title={composition.length === 0 ? "Create a composition first" : "Save as Track"}>
          <span>
            <IconButton
              color="primary"
              onClick={() => setTrackDialogOpen(true)}
              disabled={isRecording || composition.length === 0}
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' }
              }}
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Generate Button */}
        <Tooltip title="Generate Random Melody">
          <IconButton
            color="secondary"
            onClick={handleGenerateMusic}
            sx={{
              bgcolor: 'rgba(156, 39, 176, 0.08)',
              '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.15)' }
            }}
          >
            <AutoAwesomeIcon />
          </IconButton>
        </Tooltip>

        {/* Reset Button */}
        <Tooltip title="Reset">
          <IconButton
            color="warning"
            onClick={handleResetComposition}
            sx={{
              bgcolor: 'rgba(255, 152, 0, 0.08)',
              '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.15)' }
            }}
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  // Controls Panel Component
  const ControlsPanel = () => (
    <Paper sx={{ 
      p: 3,
      borderRadius: 3,
      background: 'rgba(15, 15, 20, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#e0e0e0', fontWeight: 'bold' }}>
        Composition Controls
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab icon={<MusicNoteIcon />} label="INSTRUMENT" />
        <Tab icon={<TuneIcon />} label="EFFECTS" />
        <Tab icon={<LayersIcon />} label="TRACKS" />
        <Tab icon={<GroupIcon />} label="COLLAB" />
        <Tab icon={<AutoAwesomeIcon />} label="AI" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Instrument</InputLabel>
            <Select
              value={currentInstrument}
              onChange={handleInstrumentChange}
              label="Instrument"
            >
              <MenuItem value="piano">Piano</MenuItem>
              <MenuItem value="guitar">Guitar</MenuItem>
              <MenuItem value="drums">Drums</MenuItem>
              <MenuItem value="synth">Synth</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" gutterBottom>Volume</Typography>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={100}
            sx={{ mb: 3 }}
          />

          <Typography variant="body2" gutterBottom>Tempo</Typography>
          <Slider
            value={tempo}
            onChange={handleTempoChange}
            min={60}
            max={200}
            sx={{ mb: 3 }}
          />

          <Typography variant="body2" gutterBottom>Recording Controls</Typography>
          <Button
            variant={isRecording ? "contained" : "outlined"}
            fullWidth
            color="error"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            startIcon={isRecording ? <RadioButtonCheckedIcon /> : <FiberManualRecordIcon />}
            sx={{ mb: 3 }}
          >
            {isRecording ? "STOP RECORDING" : "START RECORDING"}
          </Button>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <FormControlLabel
            control={
              <Switch 
                checked={effects.reverb}
                onChange={() => handleEffectToggle('reverb')}
              />
            }
            label="Reverb"
          />
          <FormControlLabel
            control={
              <Switch 
                checked={effects.delay}
                onChange={() => handleEffectToggle('delay')}
              />
            }
            label="Delay"
          />
          <FormControlLabel
            control={
              <Switch 
                checked={effects.distortion}
                onChange={() => handleEffectToggle('distortion')}
              />
            }
            label="Distortion"
          />
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          {/* Add Merge Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<MergeTypeIcon />}
            onClick={handleOpenMergeDialog}
            disabled={savedTracks.length < 2}
            sx={{
              mb: 2,
              py: 1,
              borderColor: 'rgba(33, 150, 243, 0.5)',
              color: '#2196F3',
              '&:hover': {
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.08)'
              },
              '&.Mui-disabled': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Merge Tracks
          </Button>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={`My Tracks (${regularTracks.length})`}
              onClick={() => setTrackFilter('regular')}
              color={trackFilter === 'regular' ? 'primary' : 'default'}
            />
            <Chip
              label={`Imported (${importedTracks.length})`}
              onClick={() => setTrackFilter('imported')}
              color={trackFilter === 'imported' ? 'primary' : 'default'}
            />
            <Chip
              label={`Merged (${mergedTracks.length})`}
              onClick={() => setTrackFilter('merged')}
              color={trackFilter === 'merged' ? 'primary' : 'default'}
            />
          </Stack>

          <List>
            {(trackFilter === 'regular' ? regularTracks :
              trackFilter === 'imported' ? importedTracks :
              mergedTracks).map((track) => (
              <ListItem
                key={track.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => handleLoadTrack(track)}>
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteTrack(track.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {track.type === 'ai-generated' && (
                        <AutoAwesomeIcon sx={{ color: '#2196f3', fontSize: 20 }} />
                      )}
                      <Typography>{track.name}</Typography>
                    </Box>
                  }
                  secondary={`${track.instrument} • ${track.notes?.length || 0} notes • ${
                    track.type === 'ai-generated' ? 'AI Generated' :
                    track.type === 'imported' ? 'Imported' :
                    track.type === 'merged' ? 'Merged' : 'Regular'
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GroupIcon />}
            onClick={() => setPublishDialogOpen(true)}
            sx={{ mb: 2 }}
          >
            Publish Composition
          </Button>

          <Typography variant="subtitle2" gutterBottom>
            Community Compositions
          </Typography>

          <List>
            {collaborationCompositions.map((collab) => (
              <ListItem
                key={collab.id}
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ color: '#2196f3' }}>
                      {collab.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      by {collab.author} • {collab.instrument}
                    </Typography>
                  }
                />
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Preview">
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewComposition(collab)}
                      sx={{ color: '#4caf50' }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleImportCollaboration(collab)}
                  >
                    Import
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 4 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>AI Music Generation</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Style</InputLabel>
                <Select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  label="Style"
                >
                  <MenuItem value="Classical">Classical</MenuItem>
                  <MenuItem value="Jazz">Jazz</MenuItem>
                  <MenuItem value="Electronic">Electronic</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mood</InputLabel>
                <Select
                  value={aiMood}
                  onChange={(e) => setAiMood(e.target.value)}
                  label="Mood"
                >
                  <MenuItem value="happy">Happy</MenuItem>
                  <MenuItem value="sad">Sad</MenuItem>
                  <MenuItem value="energetic">Energetic</MenuItem>
                  <MenuItem value="relaxed">Relaxed</MenuItem>
                  <MenuItem value="epic">Epic</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Length</InputLabel>
                <Select
                  value={aiLength}
                  onChange={(e) => setAiLength(e.target.value)}
                  label="Length"
                >
                  <MenuItem value="short">Short (30s)</MenuItem>
                  <MenuItem value="medium">Medium (60s)</MenuItem>
                  <MenuItem value="long">Long (120s)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              >
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Main Piano Roll Section */}
        <Grid item xs={12} md={8} lg={7}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 3,
            background: 'rgba(15, 15, 20, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <MainControls />
            
            <Box sx={{ 
              height: 'calc(100vh - 330px)',
              minHeight: '300px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <PianoRoll
                key={pianoRollKey}
                composition={composition}
                onNotePlay={handleNotePlay}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Controls Panel */}
        <Grid item xs={12} md={4} lg={5}>
          <ControlsPanel />
        </Grid>
      </Grid>

      {/* Add Track Dialog */}
      <Dialog 
        open={trackDialogOpen} 
        onClose={() => setTrackDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Save as Track</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Track Name"
            fullWidth
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTrack} variant="contained" disabled={!trackName.trim()}>
            Save Track
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Publish Composition</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Composition Name"
            fullWidth
            value={publishName}
            onChange={(e) => setPublishName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Author Name (optional)"
            fullWidth
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handlePublish}
            variant="contained"
            disabled={!publishName.trim()}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog
        open={mergeDialogOpen}
        onClose={() => setMergeDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(15, 15, 20, 0.97)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          pb: 1,
          background: 'rgba(15, 15, 18, 0.8)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MergeTypeIcon sx={{ mr: 1.5, color: '#2196F3' }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              Merge Tracks
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select two or more tracks to merge them into a new track.
          </Typography>
          
          <List sx={{ width: '100%' }}>
            {savedTracks.map((track) => (
              <ListItem
                key={track.id}
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <ListItemButton
                  onClick={() => handleToggleTrackSelection(track.id)}
                  selected={selectedTracks.includes(track.id)}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(33, 150, 243, 0.15)',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.2)'
                      }
                    }
                  }}
                >
                  <ListItemText
                    primary={track.name}
                    secondary={`${track.instrument} • ${track.notes?.length || 0} notes`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          px: 3, 
          py: 2,
          background: 'rgba(15, 15, 18, 0.8)'
        }}>
          <Button 
            onClick={() => setMergeDialogOpen(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleMergeTracks}
            variant="contained"
            disabled={selectedTracks.length < 2}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)'
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Merge Selected Tracks
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComposeNew; 