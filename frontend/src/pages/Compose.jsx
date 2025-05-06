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
  ListSubheader,
  Stack,
} from '@mui/material';
import PianoRoll from '../components/PianoRoll';
import AudioService from '../services/AudioService';
import { Destination } from 'tone';
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
import { Box as MuiBox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { useSnackbar } from 'notistack';

const Compose = () => {
  // Basic composition state
  const [composition, setComposition] = useState([]);
  const [currentInstrument, setCurrentInstrument] = useState('piano');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(75);
  const [effects, setEffects] = useState({
    reverb: false,
    delay: false,
    distortion: false
  });
  const [pianoRollKey, setPianoRollKey] = useState(0);

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [myCompositionsOpen, setMyCompositionsOpen] = useState(false);
  const [collaborationsOpen, setCollaborationsOpen] = useState(false);

  // Track states
  const [trackName, setTrackName] = useState('');
  const [trackFilter, setTrackFilter] = useState('regular');
  const [regularTracks, setRegularTracks] = useState([]);
  const [importedTracks, setImportedTracks] = useState([]);
  const [mergedTracks, setMergedTracks] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Composition and collaboration states
  const [compositionName, setCompositionName] = useState('');
  const [savedCompositions, setSavedCompositions] = useState([]);
  const [collaborationCompositions, setCollaborationCompositions] = useState([]);
  const [libraryCompositions, setLibraryCompositions] = useState([]);

  // Publishing states
  const [publishName, setPublishName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedPublishTracks, setSelectedPublishTracks] = useState([]);

  // Additional tabs
  const allTabs = ['instrument', 'settings', 'effects', 'project', 'collab'];

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initializeAudio = async () => {
      await AudioService.initialize();
      loadSavedCompositions();
      loadSavedTracks();
      loadCollaborationCompositions();
      
      // Set initial volume
      AudioService.setVolume(volume);
    };

    // Initialize audio on first user interaction
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

  // Add effect for volume changes
  useEffect(() => {
    AudioService.setVolume(volume);
  }, [volume]);

  const loadSavedCompositions = () => {
    const compositions = AudioService.getAllCompositions();
    setSavedCompositions(compositions);
  };
  
  const loadSavedTracks = () => {
    try {
      const tracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      
      // Categorize tracks
      const regular = tracks.filter(track => track.type === 'regular' || !track.type);
      const imported = tracks.filter(track => track.type === 'imported');
      const merged = tracks.filter(track => track.type === 'merged');
      
      setRegularTracks(regular);
      setImportedTracks(imported);
      setMergedTracks(merged);
      setSavedTracks(tracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
      enqueueSnackbar('Failed to load tracks', { variant: 'error' });
    }
  };
  
  const loadCollaborationCompositions = () => {
    // Demo compositions
    const demoCompositions = [
      {
        id: 'demo1',
        name: 'Jazz Piano Solo',
        author: 'Demo Composer',
        instrument: 'piano',
        notes: [
          { note: 'C4', duration: '4n' }, { note: 'E4', duration: '4n' }, { note: 'G4', duration: '4n' },
          { note: 'B4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'G4', duration: '4n' },
          { note: 'E4', duration: '4n' }, { note: 'C4', duration: '2n' }, { note: 'D4', duration: '4n' },
          { note: 'F4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'C5', duration: '2n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo2',
        name: 'Rock Drum Beat',
        author: 'Demo Drummer',
        instrument: 'drums',
        notes: [
          { note: 'C2', duration: '8n' }, { note: 'G2', duration: '8n' }, { note: 'C2', duration: '8n' },
          { note: 'G2', duration: '8n' }, { note: 'C2', duration: '8n' }, { note: 'G2', duration: '8n' },
          { note: 'C2', duration: '8n' }, { note: 'G2', duration: '8n' }, { note: 'C2', duration: '8n' },
          { note: 'G2', duration: '8n' }, { note: 'C2', duration: '8n' }, { note: 'G2', duration: '8n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo3',
        name: 'Guitar Riff',
        author: 'Demo Guitarist',
        instrument: 'guitar',
        notes: [
          { note: 'E3', duration: '8n' }, { note: 'G3', duration: '8n' }, { note: 'A3', duration: '8n' },
          { note: 'C4', duration: '8n' }, { note: 'B3', duration: '8n' }, { note: 'G3', duration: '8n' },
          { note: 'A3', duration: '8n' }, { note: 'E3', duration: '8n' }, { note: 'G3', duration: '8n' },
          { note: 'A3', duration: '8n' }, { note: 'B3', duration: '8n' }, { note: 'C4', duration: '8n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo4',
        name: 'Synth Melody',
        author: 'Demo Producer',
        instrument: 'synth',
        notes: [
          { note: 'F4', duration: '4n' }, { note: 'A4', duration: '4n' }, { note: 'C5', duration: '4n' },
          { note: 'D5', duration: '4n' }, { note: 'C5', duration: '4n' }, { note: 'A4', duration: '4n' },
          { note: 'F4', duration: '4n' }, { note: 'D4', duration: '4n' }, { note: 'F4', duration: '4n' },
          { note: 'A4', duration: '4n' }, { note: 'C5', duration: '4n' }, { note: 'D5', duration: '4n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo5',
        name: 'Piano Ballad',
        author: 'Demo Pianist',
        instrument: 'piano',
        notes: [
          { note: 'D4', duration: '2n' }, { note: 'F4', duration: '2n' }, { note: 'A4', duration: '2n' },
          { note: 'C5', duration: '2n' }, { note: 'B4', duration: '2n' }, { note: 'G4', duration: '2n' },
          { note: 'E4', duration: '2n' }, { note: 'C4', duration: '2n' }, { note: 'D4', duration: '2n' },
          { note: 'F4', duration: '2n' }, { note: 'A4', duration: '2n' }, { note: 'C5', duration: '2n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo6',
        name: 'Blues Guitar Solo',
        author: 'Blues Master',
        instrument: 'guitar',
        notes: [
          { note: 'E3', duration: '8n' }, { note: 'G3', duration: '8n' }, { note: 'Bb3', duration: '8n' },
          { note: 'B3', duration: '8n' }, { note: 'Bb3', duration: '8n' }, { note: 'G3', duration: '8n' },
          { note: 'E3', duration: '8n' }, { note: 'G3', duration: '8n' }, { note: 'Bb3', duration: '8n' },
          { note: 'C4', duration: '8n' }, { note: 'B3', duration: '8n' }, { note: 'G3', duration: '8n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo7',
        name: 'Funky Bass Line',
        author: 'Funk Master',
        instrument: 'synth',
        notes: [
          { note: 'C3', duration: '8n' }, { note: 'E3', duration: '8n' }, { note: 'G3', duration: '8n' },
          { note: 'A3', duration: '8n' }, { note: 'G3', duration: '8n' }, { note: 'E3', duration: '8n' },
          { note: 'C3', duration: '8n' }, { note: 'D3', duration: '8n' }, { note: 'F3', duration: '8n' },
          { note: 'A3', duration: '8n' }, { note: 'G3', duration: '8n' }, { note: 'E3', duration: '8n' }
        ],
        type: 'regular'
      },
      {
        id: 'demo8',
        name: 'Latin Percussion',
        author: 'Rhythm Master',
        instrument: 'drums',
        notes: [
          { note: 'C2', duration: '16n' }, { note: 'E2', duration: '16n' }, { note: 'G2', duration: '16n' },
          { note: 'C2', duration: '16n' }, { note: 'E2', duration: '16n' }, { note: 'G2', duration: '16n' },
          { note: 'C2', duration: '16n' }, { note: 'E2', duration: '16n' }, { note: 'G2', duration: '16n' },
          { note: 'C2', duration: '16n' }, { note: 'E2', duration: '16n' }, { note: 'G2', duration: '16n' }
        ],
        type: 'regular'
      }
    ];

    // Combine demo compositions with any existing ones from localStorage
    const existingComps = JSON.parse(localStorage.getItem('collaborationCompositions') || '[]');
    const allComps = [...demoCompositions, ...existingComps];
    setCollaborationCompositions(allComps);
  };

  const handleInstrumentChange = (event) => {
    const newInstrument = event.target.value;
    setCurrentInstrument(newInstrument);
    AudioService.setInstrument(newInstrument);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Load data when switching to specific tabs
    if (newValue === 3) { // Tracks tab
      loadSavedTracks();
    } else if (newValue === 4) { // Collaborations tab
      loadCollaborationCompositions();
    }
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
      genre: currentInstrument
    });
  };

  const handleStartRecording = () => {
    try {
      // Stop any ongoing playback
      handleStopComposition();
      
      // Reset states
      setComposition([]);
      setIsPlaying(false);
      setPianoRollKey(prevKey => prevKey + 1);
      
      // Start recording
      setIsRecording(true);
      AudioService.startRecording();
      
      enqueueSnackbar('Recording started...', { variant: 'info' });
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      enqueueSnackbar('Error starting recording', { variant: 'error' });
    }
  };

  const handleStopRecording = async () => {
    try {
      // Stop recording first
      setIsRecording(false);
      const recorded = AudioService.stopRecording();
      
      console.log('Recorded notes:', recorded);
      
      if (recorded && recorded.length > 0) {
        // Update composition with recorded notes
        setComposition(recorded);
        setPianoRollKey(prevKey => prevKey + 1);
        
        // Show success message
        enqueueSnackbar('Recording completed! You can now play or save as track.', { variant: 'success' });
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

  const handlePlayComposition = () => {
    if (composition.length === 0) {
      enqueueSnackbar('No composition to play', { variant: 'warning' });
      return;
    }

    try {
      // Stop any existing playback first
      handleStopComposition();
      
      setIsPlaying(true);
      AudioService.playComposition(composition);
      
      // Calculate duration based on the last note's timestamp
      const lastNote = composition[composition.length - 1];
      const duration = lastNote.timestamp ? 
        (lastNote.timestamp + 1000) : // Add 1 second buffer
        composition.length * (60 / tempo) * 1000; // Fallback calculation
      
      setTimeout(() => {
        if (isPlaying) { // Only stop if still playing
          setIsPlaying(false);
          AudioService.stopAll();
        }
      }, duration);
    } catch (error) {
      console.error('Error playing composition:', error);
      setIsPlaying(false);
      AudioService.stopAll();
      enqueueSnackbar('Error playing composition', { variant: 'error' });
    }
  };

  const handleStopComposition = () => {
    try {
      setIsPlaying(false);
      AudioService.stopAll();
    } catch (error) {
      console.error('Error stopping composition:', error);
      enqueueSnackbar('Error stopping playback', { variant: 'error' });
    }
  };

  const handleGenerateMusic = () => {
    try {
      const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
      const durations = ['4n', '8n', '16n'];
      const generatedNotes = [];
      
      // Generate 8 random notes
      for (let i = 0; i < 8; i++) {
        generatedNotes.push({
          note: notes[Math.floor(Math.random() * notes.length)],
          duration: durations[Math.floor(Math.random() * durations.length)],
          instrument: currentInstrument,
          timestamp: i * (60 / tempo) * 1000 // Add timestamps for proper playback
        });
      }
      
      setComposition(generatedNotes);
      enqueueSnackbar('Generated new melody', { variant: 'success' });
      
      // Auto-play the generated music
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
      // Stop any ongoing playback or recording
      handleStopComposition();
      setIsRecording(false);
      AudioService.stopAll();
      
      // Clear composition
      setComposition([]);
      setPianoRollKey(prevKey => prevKey + 1);
      
      enqueueSnackbar('Composition reset', { variant: 'info' });
    } catch (error) {
      console.error('Error resetting composition:', error);
      enqueueSnackbar('Error resetting composition', { variant: 'error' });
    }
  };

  const handleOpenPublishDialog = () => {
    // Force reload all track types to ensure merged tracks are available
    loadSavedTracks();
    
    // Reset the publish form
    setPublishName('');
    setAuthorName('');
    setSelectedPublishTracks([]);
    
    // Debug logging - this helps see what tracks are available
    console.log("Regular tracks:", regularTracks.map(t => ({ id: t.id, name: t.name })));
    console.log("Merged tracks:", mergedTracks.map(t => ({ id: t.id, name: t.name })));
    console.log("Imported tracks:", importedTracks.map(t => ({ id: t.id, name: t.name })));
    
    // Open the dialog
    setPublishDialogOpen(true);
  };
  
  // Generic publish function that handles both tracks and compositions
  const handlePublishContent = async (content, name, author = 'Anonymous') => {
    try {
      const publishId = AudioService.publishComposition(content, name, author);
      if (publishId) {
        setPublishDialogOpen(false);
        alert(`"${name}" published successfully! Added to your library.`);
        // Reload collaborations and library
        loadCollaborationCompositions();
        loadSavedCompositions();
      }
    } catch (error) {
      console.error("Publishing error:", error);
      alert(`Error publishing: ${error.message || "Unknown error"}`);
    }
  };

  const handlePublish = () => {
    try {
      let contentToPublish;
      let finalName;
      
      if (selectedPublishTracks.length > 0) {
        const trackId = selectedPublishTracks[0];
        const foundTrack = [...regularTracks, ...mergedTracks, ...importedTracks].find(
          t => String(t.id) === String(trackId)
        );
        
        if (!foundTrack) {
          enqueueSnackbar('Could not find selected track. Please try again.', { variant: 'error' });
          return;
        }
        
        contentToPublish = foundTrack.notes;
        finalName = publishName || foundTrack.name;
      } else {
        if (composition.length === 0) {
          enqueueSnackbar('Please create a composition or select a track first.', { variant: 'warning' });
          return;
        }
        contentToPublish = composition;
        finalName = publishName || `${currentInstrument.charAt(0).toUpperCase() + currentInstrument.slice(1)} Composition`;
      }

      // Create the composition object
      const newComposition = {
        id: Date.now().toString(),
        name: finalName,
        author: authorName || 'Anonymous',
        notes: contentToPublish,
        instrument: currentInstrument,
        createdAt: new Date().toISOString()
      };

      // Save to library
      const existingComps = JSON.parse(localStorage.getItem('savedCompositions') || '[]');
      localStorage.setItem('savedCompositions', JSON.stringify([...existingComps, newComposition]));
      
      // Update state
      setLibraryCompositions(prev => [...prev, newComposition]);
      setCollaborationCompositions(prev => [...prev, newComposition]);
      
      // Close dialog and show success message
      setPublishDialogOpen(false);
      enqueueSnackbar(`"${finalName}" published successfully!`, { variant: 'success' });
      
      // Reset form
      setPublishName('');
      setAuthorName('');
      setSelectedPublishTracks([]);
    } catch (error) {
      console.error('Error publishing:', error);
      enqueueSnackbar('Failed to publish. Please try again.', { variant: 'error' });
    }
  };

  const handleOpenSaveDialog = () => {
    if (composition.length > 0) {
      setCompositionName(`Composition ${savedCompositions.length + 1}`);
      setSaveDialogOpen(true);
    } else {
      alert('Nothing to save. Record or generate a composition first!');
    }
  };

  // Generic save function for both tracks and compositions
  const handleSaveContent = (content, name, type = 'composition') => {
    if (content.length === 0) {
      alert(`Nothing to save. Record or generate a ${type} first!`);
      return;
    }

    try {
      if (type === 'composition') {
        const saved = AudioService.saveComposition(content, name);
        if (saved) {
          loadSavedCompositions();
          setSaveDialogOpen(false);
          alert(`"${name}" saved successfully!`);
        }
      } else if (type === 'track') {
        const trackId = Date.now().toString();
        const newTrack = {
          id: trackId,
          name,
          instrument: currentInstrument,
          notes: content,
          type: 'regular',
          createdAt: new Date().toISOString()
        };
        
        setRegularTracks(prev => [...prev, newTrack]);
        setSavedTracks(prev => [...prev, newTrack]);
        setTrackDialogOpen(false);
        alert(`Track "${name}" saved successfully!`);
        setTrackName('');
        loadSavedTracks();
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      alert(`Failed to save ${type}. Please try again.`);
    }
  };

  // Updated handlers that use the generic save function
  const handleSaveComposition = () => {
    handleSaveContent(composition, compositionName, 'composition');
  };

  const handleSaveTrack = () => {
    if (!trackName.trim()) {
      enqueueSnackbar('Please provide a track name', { variant: 'warning' });
      return;
    }

    try {
      const trackId = Date.now().toString();
      const newTrack = {
        id: trackId,
        name: trackName,
        instrument: currentInstrument,
        notes: composition,
        type: 'regular',
        createdAt: new Date().toISOString()
      };

      // Update state
      setRegularTracks(prev => [...prev, newTrack]);
      setSavedTracks(prev => [...prev, newTrack]);
      
      // Save to localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      const updatedTracks = [...existingTracks, newTrack];
      localStorage.setItem('savedTracks', JSON.stringify(updatedTracks));
      
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

  const handleOpenMyCompositions = () => {
    loadSavedCompositions();
    setMyCompositionsOpen(true);
  };

  // Generic load function for both tracks and compositions
  const handleLoadContent = (content, type = 'composition') => {
    handleStopComposition();
    
    if (type === 'track' && content.instrument) {
      setCurrentInstrument(content.instrument);
      AudioService.setInstrument(content.instrument);
    }
    
    setComposition(content.notes || content);
    
    // Auto-play functionality
    setTimeout(() => {
      AudioService.playComposition(content.notes || content);
      setIsPlaying(true);
      
      const approxDuration = (content.notes || content).length * (60 / tempo) * 1000;
      setTimeout(() => {
        setIsPlaying(false);
      }, approxDuration);
    }, 100);
  };

  // Updated handlers that use the generic load function
  const handleLoadComposition = (idOrComp) => {
    try {
      // Stop any current playback
      handleStopComposition();
      
      let composition;
      if (typeof idOrComp === 'string' || typeof idOrComp === 'number') {
        // Case 1: Loading from ID
        composition = AudioService.getComposition(idOrComp);
        if (composition) {
          handleLoadContent(composition, 'composition');
          setMyCompositionsOpen(false);
        }
      } else {
        // Case 2: Loading from composition object
        setComposition(idOrComp.notes || []);
        if (idOrComp.instrument) {
          setCurrentInstrument(idOrComp.instrument);
        }
        setLibraryDialogOpen(false);
        alert(`Loaded composition: ${idOrComp.name}`);
      }
    } catch (error) {
      console.error('Error loading composition:', error);
      alert('Failed to load composition. Please try again.');
    }
  };

  const handleDeleteComposition = (compId) => {
    try {
      if (window.confirm('Are you sure you want to delete this composition?')) {
        // Try deleting from AudioService first
        AudioService.deleteComposition(compId);
        loadSavedCompositions();
        
        // Also try updating library compositions if they exist
        if (libraryCompositions) {
          const updatedComps = libraryCompositions.filter(comp => comp.id !== compId);
          setLibraryCompositions(updatedComps);
          localStorage.setItem('savedCompositions', JSON.stringify(updatedComps));
        }
        
        alert('Composition deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting composition:', error);
      alert('Failed to delete composition. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDeleteTrack = async (trackId) => {
    if (!window.confirm('Are you sure you want to delete this track?')) {
      return;
    }

    try {
      // Get current tracks from localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      const updatedTracks = existingTracks.filter(track => track.id !== trackId);
      
      // Update localStorage
      localStorage.setItem('savedTracks', JSON.stringify(updatedTracks));
      
      // Update state
      setSavedTracks(prev => prev.filter(track => track.id !== trackId));
      setRegularTracks(prev => prev.filter(track => track.id !== trackId));
      setMergedTracks(prev => prev.filter(track => track.id !== trackId));
      setImportedTracks(prev => prev.filter(track => track.id !== trackId));
      
      enqueueSnackbar('Track deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting track:', error);
      enqueueSnackbar('Failed to delete track', { variant: 'error' });
    }
  };

  const handleLoadTrack = (track) => {
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
      
      // Update composition
      setComposition(track.notes);
      setPianoRollKey(prevKey => prevKey + 1);
      
      // Auto-play the loaded track
      setTimeout(() => {
        handlePlayComposition();
      }, 100);

      enqueueSnackbar(`Loaded track: ${track.name}`, { variant: 'success' });
    } catch (error) {
      console.error('Error loading track:', error);
      enqueueSnackbar('Error loading track', { variant: 'error' });
    }
  };

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

  const handleImportCollaboration = (collab) => {
    if (collab && collab.notes) {
      try {
        const importedTrack = {
          ...collab,
          id: `imported_${Date.now()}`,
          type: 'imported',
          importedAt: new Date().toISOString(),
          originalAuthor: collab.author
        };

        // Update state
        setImportedTracks(prev => [...prev, importedTrack]);
        setSavedTracks(prev => [...prev, importedTrack]);
        
        // Save to localStorage
        const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
        localStorage.setItem('savedTracks', JSON.stringify([...existingTracks, importedTrack]));
        
        enqueueSnackbar(`"${collab.name}" imported successfully!`, { variant: 'success' });
        setCollaborationsOpen(false);
      } catch (error) {
        console.error('Error importing track:', error);
        enqueueSnackbar('Failed to import track', { variant: 'error' });
      }
    }
  };

  // Add function to generate track preview for merge dialog
  const getMergePreview = () => {
    if (selectedTracks.length === 0) return null;
    
    // Collect all notes from selected tracks
    const allNotes = [];
    selectedTracks.forEach(trackId => {
      const track = savedTracks.find(t => t.id === trackId);
      if (track) {
        track.notes.forEach(note => {
          allNotes.push({
            ...note,
            instrument: track.instrument
          });
        });
      }
    });
    
    // Sort by timestamp if available
    allNotes.sort((a, b) => {
      if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;
      return 0;
    });
    
    // Get unique pitches for vertical positioning
    const pitches = [...new Set(allNotes.map(note => note.pitch))].sort((a, b) => b - a);
    
    return (
      <MuiBox sx={{ 
        height: '80px', 
        width: '100%', 
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        mt: 2,
        mb: 1,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Draw grid lines */}
        {[...Array(8)].map((_, i) => (
          <MuiBox key={`grid-v-${i}`} sx={{
            position: 'absolute',
            left: `${i * (100/8)}%`,
            top: 0,
            height: '100%',
            width: '1px',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <MuiBox key={`grid-h-${i}`} sx={{
            position: 'absolute',
            top: `${i * (100/4)}%`,
            left: 0,
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }} />
        ))}
        
        {/* Draw notes */}
        {allNotes.map((note, index) => {
          // Calculate position
          const pitchIndex = pitches.indexOf(note.pitch);
          const noteWidth = 10; // Width in pixels
          const noteHeight = 100 / (pitches.length || 1);
          
          // Position horizontally based on index or timestamp
          let left;
          if (note.timestamp) {
            // Normalize timestamp to 0-100 range
            const minTime = Math.min(...allNotes.filter(n => n.timestamp).map(n => n.timestamp));
            const maxTime = Math.max(...allNotes.filter(n => n.timestamp).map(n => n.timestamp));
            const range = maxTime - minTime || 1;
            left = ((note.timestamp - minTime) / range) * (100 - noteWidth);
          } else {
            // Fallback to index-based position
            left = (index / allNotes.length) * (100 - noteWidth);
          }
          
          // Get color based on instrument
          const color = note.instrument === 'piano' ? '#2196f3' : 
                        note.instrument === 'guitar' ? '#4caf50' :
                        note.instrument === 'drums' ? '#f44336' : '#ff9800';
          
          return (
            <MuiBox
              key={`note-preview-${index}`}
              sx={{
                position: 'absolute',
                top: `${pitchIndex * noteHeight}%`,
                left: `${left}%`,
                width: `${noteWidth}px`,
                height: `${noteHeight}%`,
                backgroundColor: color,
                opacity: 0.7,
                borderRadius: '2px',
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                }
              }}
            />
          );
        })}
      </MuiBox>
    );
  };

  // Add Track Dialog component
  const TrackDialog = () => (
    <Dialog 
      open={trackDialogOpen} 
      onClose={() => setTrackDialogOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          background: '#1a1a1a',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>
        Save as Track
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Track Name"
          type="text"
          fullWidth
          variant="outlined"
          value={trackName}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTrackName(e.target.value);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          inputProps={{
            style: { color: '#fff' }
          }}
          sx={{ 
            mt: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2196f3',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#2196f3',
              }
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTrackDialogOpen(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveTrack}
          variant="contained"
          disabled={!trackName.trim()}
        >
          Save Track
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleOpenLibrary = async () => {
    try {
      // Get saved compositions from local storage
      const savedComps = JSON.parse(localStorage.getItem('savedCompositions') || '[]');
      setLibraryCompositions(savedComps);
      setLibraryDialogOpen(true);
    } catch (error) {
      console.error('Error loading library:', error);
      alert('Failed to load library. Please try again.');
    }
  };

  // Library Dialog component
  const LibraryDialog = () => (
    <Dialog
      open={libraryDialogOpen}
      onClose={() => setLibraryDialogOpen(false)}
      fullWidth
      maxWidth="md"
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

        {selectedTracks.length >= 2 && (
          <>
            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
              Preview of merged tracks:
            </Typography>
            {getMergePreview()}
          </>
        )}
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
  );

  const handleOpenTrackDialog = () => {
    try {
      if (isRecording) {
        enqueueSnackbar('Please stop recording first', { variant: 'warning' });
        return;
      }
      
      if (composition.length === 0) {
        enqueueSnackbar('Create a composition first before saving as a track', { variant: 'warning' });
        return;
      }
      
      setTrackName('');
      setTrackDialogOpen(true);
    } catch (error) {
      console.error('Error opening track dialog:', error);
      enqueueSnackbar('Error opening track dialog', { variant: 'error' });
    }
  };

  const handleImportTrack = (track) => {
    try {
      const importedTrack = {
        ...track,
        id: `imported_${Date.now()}`,
        type: 'imported',
        importedAt: new Date().toISOString()
      };

      // Update both the imported tracks list and the full tracks list
      setImportedTracks(prev => [...prev, importedTrack]);
      setSavedTracks(prev => [...prev, importedTrack]);
      
      // Save to localStorage
      const existingTracks = JSON.parse(localStorage.getItem('savedTracks') || '[]');
      localStorage.setItem('savedTracks', JSON.stringify([...existingTracks, importedTrack]));
      
      enqueueSnackbar('Track imported successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error importing track:', error);
      enqueueSnackbar('Failed to import track', { variant: 'error' });
    }
  };

  // Load tracks when component mounts
  useEffect(() => {
    loadSavedTracks();
  }, []);

  // Update the add track button's disabled state
  const isAddTrackDisabled = isRecording || composition.length === 0;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 4, 
        mb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.05), transparent 70%), radial-gradient(circle at bottom left, rgba(76, 175, 80, 0.05), transparent 70%)',
          zIndex: -1,
        }
      }}
    >
      {/* Header with more elegant styling */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3, #3d5afe)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '0.5px'
          }}
        >
          Compose Music
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '700px' }}>
          Create your own music with our AI-powered composition tools. Express yourself through melody and harmony.
        </Typography>
        <Divider sx={{ 
          my: 2, 
          background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.1), transparent)',
          height: '1px',
          border: 'none'
        }} />
      </Box>

      <Grid container spacing={3}>
        {/* Main content area - enhance paper styling */}
        <Grid item xs={12} md={8} lg={7}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 3,
              background: 'rgba(15, 15, 20, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Top Control Bar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3, 
              pb: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#2196f3'
                }}
              >
                <MusicNoteIcon sx={{ mr: 1 }} />
                Piano Roll
              </Typography>
              
              {/* Playback Controls */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Play Button */}
                <Tooltip title={composition.length === 0 ? "Record or create a composition first" : "Play Composition"}>
                  <span>
                    <IconButton 
                      color="primary" 
                      onClick={handlePlayComposition}
                      disabled={isRecording || composition.length === 0}
                      sx={{ 
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' },
                        '&.Mui-disabled': { 
                          opacity: 0.4,
                          bgcolor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </span>
                </Tooltip>

                {/* Stop Button - Always enabled when playing */}
                <Tooltip title="Stop Playback">
                  <span>
                    <IconButton 
                      color="error" 
                      onClick={handleStopComposition}
                      disabled={!isPlaying} // Only disabled when nothing is playing
                      sx={{ 
                        bgcolor: 'rgba(211, 47, 47, 0.08)',
                        '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.15)' },
                        '&.Mui-disabled': { opacity: 0.4 }
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
                      onClick={handleOpenTrackDialog}
                      disabled={isRecording || composition.length === 0}
                      sx={{ 
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.15)' },
                        '&.Mui-disabled': { 
                          opacity: 0.4,
                          bgcolor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </span>
                </Tooltip>

                {/* Generate Music Button */}
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
                <Tooltip title="Reset Composition">
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
            
            {/* Piano Roll Component */}
            <Box 
              sx={{ 
                mb: 3, 
                height: 'calc(100vh - 330px)', 
                minHeight: '300px', 
                border: '1px solid rgba(255, 255, 255, 0.07)', 
                borderRadius: 2,
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <PianoRoll 
                key={pianoRollKey}
                composition={composition.length > 0 ? composition : []}
                onNotePlay={handleNotePlay}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Controls panel - Enhanced styling */}
        <Grid item xs={12} md={4} lg={5}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 3,
              background: 'rgba(15, 15, 20, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1) inset',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              }
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                mb: 2, 
                pb: 1, 
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#e0e0e0'
              }}
            >
              Composition Controls
            </Typography>
            
            {/* Enhanced tabs styling */}
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                mb: 3,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #2196f3, #1976d2)',
                },
                '& .MuiTab-root': {
                  minHeight: '50px',
                  padding: '6px 8px',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  transition: 'all 0.2s',
                  minWidth: 0,
                  backdropFilter: 'blur(8px)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s',
                    opacity: 0.6,
                  },
                  '&.Mui-selected': {
                    fontWeight: 'bold',
                    color: '#2196f3',
                    '&::after': {
                      opacity: 0,
                    }
                  },
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    '&::after': {
                      left: '0%',
                      right: '0%',
                      opacity: 0.8,
                    }
                  }
                }
              }}
            >
              <Tab 
                icon={<MusicNoteIcon />} 
                label="INSTRUMENT" 
              />
              <Tab 
                icon={<TuneIcon />} 
                label="EFFECTS" 
              />
              <Tab 
                icon={<LayersIcon />} 
                label="TRACKS" 
              />
              <Tab 
                icon={<GroupIcon />} 
                label="COLLAB" 
              />
            </Tabs>
            
            {/* Instrument Tab - enhance select and slider styling */}
            {activeTab === 0 && (
              <Box>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Instrument</InputLabel>
                  <Select
                    value={currentInstrument}
                    onChange={handleInstrumentChange}
                    label="Instrument"
                    size="small"
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderWidth: '1px',
                        transition: 'all 0.2s',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2196f3',
                        borderWidth: '1px',
                      },
                      '.MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                  >
                    <MenuItem value="piano">Piano</MenuItem>
                    <MenuItem value="guitar">Guitar</MenuItem>
                    <MenuItem value="drums">Drums</MenuItem>
                    <MenuItem value="synth">Synth</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mb: 3 }}>
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
                      color: '#2196f3',
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 14,
                        height: 14,
                        transition: 'all 0.2s cubic-bezier(.47,1.64,.41,.8)',
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)',
                        },
                        '&::before': {
                          boxShadow: '0 0 1px 0 rgba(0,0,0,0.4)'
                        }
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.3,
                      },
                      '& .MuiSlider-track': {
                        background: 'linear-gradient(90deg, #21CBF3, #2196F3)',
                        border: 'none',
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 4 }}>
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
                      color: '#2196f3',
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 14,
                        height: 14,
                        transition: 'all 0.2s cubic-bezier(.47,1.64,.41,.8)',
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)',
                        },
                        '&::before': {
                          boxShadow: '0 0 1px 0 rgba(0,0,0,0.4)'
                        }
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.3,
                      },
                      '& .MuiSlider-track': {
                        background: 'linear-gradient(90deg, #21CBF3, #2196F3)',
                        border: 'none',
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
                  color="error"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={isRecording}
                  startIcon={isRecording ? <RadioButtonCheckedIcon /> : <FiberManualRecordIcon />}
                  sx={{
                    mb: 4,
                    py: 1,
                    borderRadius: '10px',
                    background: isRecording ? 'linear-gradient(45deg, #f44336 30%, #ff1744 90%)' : 'transparent',
                    border: isRecording ? 'none' : '1px solid rgba(244, 67, 54, 0.5)',
                    boxShadow: isRecording ? '0 4px 10px rgba(244, 67, 54, 0.25), 0 1px 3px rgba(0, 0, 0, 0.12)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: isRecording ? 'linear-gradient(45deg, #ff1744 30%, #f44336 90%)' : 'rgba(244, 67, 54, 0.08)',
                      boxShadow: isRecording ? '0 6px 12px rgba(244, 67, 54, 0.3), 0 1px 4px rgba(0, 0, 0, 0.12)' : 'none',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      border: 'none'
                    }
                  }}
                >
                  {isRecording ? "STOP RECORDING" : "START RECORDING"}
                </Button>
                
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Composition Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleOpenTrackDialog}
                      disabled={isAddTrackDisabled}
                      sx={{
                        py: 1.5,
                        borderRadius: '10px',
                        borderColor: isAddTrackDisabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.5)',
                        color: isAddTrackDisabled ? 'rgba(255, 255, 255, 0.3)' : '#2196F3',
                        background: 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: isAddTrackDisabled ? 'rgba(255, 255, 255, 0.1)' : '#2196F3',
                          backgroundColor: isAddTrackDisabled ? 'transparent' : 'rgba(33, 150, 243, 0.08)',
                        },
                        '&.Mui-disabled': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      ADD TRACK
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FolderIcon />}
                      onClick={() => {
                        loadSavedCompositions();
                        setLibraryDialogOpen(true);
                      }}
                      sx={{
                        py: 1.5,
                        borderRadius: '10px',
                        borderColor: 'rgba(79, 195, 247, 0.5)',
                        color: '#4FC3F7',
                        background: 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: '#4FC3F7',
                          backgroundColor: 'rgba(79, 195, 247, 0.08)',
                        }
                      }}
                    >
                      LIBRARY
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GroupIcon />}
                      onClick={handleOpenPublishDialog}
                      sx={{
                        py: 1.5,
                        borderRadius: '10px',
                        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3), 0 1px 3px rgba(0, 0, 0, 0.12)',
                        border: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #81C784 30%, #4CAF50 90%)',
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4), 0 1px 3px rgba(0, 0, 0, 0.12)',
                        }
                      }}
                    >
                      PUBLISH
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Effects Tab */}
            {activeTab === 1 && (
              <Box sx={{ 
                p: 3,
                borderRadius: 2,
                background: 'rgba(25, 25, 35, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: '#E3F2FD',
                  fontWeight: 600,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  Sound Effects
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 3,
                      background: 'rgba(15, 15, 20, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                      }
                    }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={effects.reverb}
                            onChange={() => handleEffectToggle('reverb')}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2196f3',
                                '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.08)' }
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2196f3'
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#E3F2FD' }}>
                              Reverb
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Adds space and depth to your sound
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 3,
                      background: 'rgba(15, 15, 20, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                      }
                    }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={effects.delay}
                            onChange={() => handleEffectToggle('delay')}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2196f3',
                                '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.08)' }
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2196f3'
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#E3F2FD' }}>
                              Delay
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Creates echo-like repeating patterns
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 3,
                      background: 'rgba(15, 15, 20, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                      }
                    }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={effects.distortion}
                            onChange={() => handleEffectToggle('distortion')}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2196f3',
                                '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.08)' }
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2196f3'
                              }
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#E3F2FD' }}>
                              Distortion
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Adds grit and character to the sound
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tracks Tab */}
            {activeTab === 2 && (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Tracks Library
                  </Typography>
                  
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
                    Merge Selected Tracks
                  </Button>

                  {/* Track Categories */}
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`My Tracks (${regularTracks.length})`}
                      onClick={() => setTrackFilter('regular')}
                      color={trackFilter === 'regular' ? 'primary' : 'default'}
                      variant={trackFilter === 'regular' ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label={`Imported (${importedTracks.length})`}
                      onClick={() => setTrackFilter('imported')}
                      color={trackFilter === 'imported' ? 'primary' : 'default'}
                      variant={trackFilter === 'imported' ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label={`Merged (${mergedTracks.length})`}
                      onClick={() => setTrackFilter('merged')}
                      color={trackFilter === 'merged' ? 'primary' : 'default'}
                      variant={trackFilter === 'merged' ? 'filled' : 'outlined'}
                    />
                  </Stack>
                </Box>

                {/* Track List */}
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                  {/* Show message if no tracks */}
                  {(trackFilter === 'regular' ? regularTracks : 
                    trackFilter === 'imported' ? importedTracks : 
                    trackFilter === 'merged' ? mergedTracks : 
                    savedTracks).length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '200px',
                      color: 'text.secondary'
                    }}>
                      <Typography variant="body1" gutterBottom>
                        No tracks in this category
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trackFilter === 'regular' ? 'Record and save tracks to see them here' :
                         trackFilter === 'imported' ? 'Import tracks from the Collab section' :
                         'Merge two or more tracks to create merged tracks'}
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ width: '100%' }}>
                      {(trackFilter === 'regular' ? regularTracks :
                        trackFilter === 'imported' ? importedTracks :
                        trackFilter === 'merged' ? mergedTracks :
                        savedTracks).map((track) => (
                        <ListItem
                          key={track.id}
                          sx={{
                            mb: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1">{track.name}</Typography>
                                {track.type === 'imported' && track.originalAuthor && (
                                  <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                    by {track.originalAuthor}
                                  </Typography>
                                )}
                              </Box>
                            }
                            secondary={`${track.instrument} • ${track.notes?.length || 0} notes • ${new Date(track.createdAt).toLocaleDateString()}`}
                          />
                          <Button
                            size="small"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => handleLoadTrack(track)}
                            sx={{ mr: 1 }}
                          >
                            Play
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTrack(track.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
            )}

            {/* Collab Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Community Compositions
                </Typography>
                <List sx={{ width: '100%' }}>
                  {collaborationCompositions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography color="text.secondary">
                        No community compositions available yet
                      </Typography>
                    </Box>
                  ) : (
                    collaborationCompositions.map((collab) => (
                      <ListItem
                        key={collab.id}
                        sx={{
                          mb: 1,
                          bgcolor: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: 1
                        }}
                      >
                        <ListItemText
                          primary={collab.name}
                          secondary={
                            <>
                              by {collab.author || 'Anonymous'} • {collab.instrument} • {collab.notes?.length || 0} notes
                            </>
                          }
                        />
                        <Button
                          size="small"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => {
                            handleStopComposition(); // Stop any current playback
                            setCurrentInstrument(collab.instrument);
                            AudioService.setInstrument(collab.instrument);
                            AudioService.playComposition(collab.notes || []);
                            setIsPlaying(true);
                            
                            // Set timeout to update playing state
                            const approxDuration = (collab.notes?.length || 0) * (60 / tempo) * 1000;
                            setTimeout(() => {
                              setIsPlaying(false);
                            }, approxDuration);
                          }}
                          disabled={isPlaying}
                          sx={{ mr: 1 }}
                        >
                          Play
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleImportCollaboration(collab)}
                        >
                          Import
                        </Button>
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Enhance all dialogs with more elegant styling */}
      {/* Publish Dialog - with enhanced styling */}
      <Dialog 
        open={publishDialogOpen} 
        onClose={() => setPublishDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(15, 15, 20, 0.97)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          pb: 1,
          background: 'rgba(15, 15, 18, 0.8)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ mr: 1.5, color: '#4CAF50' }} />
            <Typography variant="h6" component="div" fontWeight="bold" sx={{ letterSpacing: '0.5px' }}>
              Publish Composition
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Share your composition with the community. Other musicians will be able to
            import and use your composition in their own projects.
          </Typography>
          
          {/* Option to publish from existing tracks */}
          {savedTracks.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Select a track to publish (optional)
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <Select
                  value={selectedPublishTracks.length > 0 ? selectedPublishTracks[0] : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log("Selected track ID:", value);
                    
                    if (value) {
                      setSelectedPublishTracks([value]);
                      
                      // Look in all track categories
                      const allTracks = [...regularTracks, ...mergedTracks, ...importedTracks];
                      console.log("All available tracks:", allTracks.map(t => ({ id: t.id, name: t.name })));
                      
                      // Find the track in all track types
                      const track = allTracks.find(t => String(t.id) === String(value));
                      console.log("Found track for selection:", track);
                      
                      if (track) {
                        setPublishName(track.name || '');
                        // Set author name if it's an imported track with original author
                        if (track.originalAuthor) {
                          setAuthorName(`${track.originalAuthor} (remixed)`);
                        }
                      }
                    } else {
                      setSelectedPublishTracks([]);
                      setPublishName('');
                    }
                  }}
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        backgroundColor: 'rgba(15, 15, 20, 0.97)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
                      }
                    }
                  }}
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      borderWidth: '1px',
                      transition: 'all 0.2s',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                      borderWidth: '1px',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }}
                >
                  <MenuItem value=""><em>Use current composition</em></MenuItem>
                  
                  {regularTracks && regularTracks.length > 0 && (
                    <>
                      <ListSubheader sx={{ background: 'rgba(30, 30, 40, 0.95)', color: '#90caf9', fontSize: '0.75rem', letterSpacing: '1px' }}>
                        Regular Tracks
                      </ListSubheader>
                      {regularTracks.map(track => (
                        <MenuItem key={track.id} value={String(track.id)}>
                          {track.name} ({track.instrument})
                        </MenuItem>
                      ))}
                    </>
                  )}
                  
                  {mergedTracks && mergedTracks.length > 0 && (
                    <>
                      <ListSubheader sx={{ background: 'rgba(30, 30, 40, 0.95)', color: '#90caf9', fontSize: '0.75rem', letterSpacing: '1px' }}>
                        Merged Tracks
                      </ListSubheader>
                      {mergedTracks.map(track => (
                        <MenuItem key={track.id} value={String(track.id)}>
                          {track.name} {track.instrument === 'mixed' ? '(multi-instrument)' : `(${track.instrument})`}
                        </MenuItem>
                      ))}
                    </>
                  )}
                  
                  {importedTracks && importedTracks.length > 0 && (
                    <>
                      <ListSubheader sx={{ background: 'rgba(30, 30, 40, 0.95)', color: '#90caf9', fontSize: '0.75rem', letterSpacing: '1px' }}>
                        Imported Tracks
                      </ListSubheader>
                      {importedTracks.map(track => (
                        <MenuItem key={track.id} value={String(track.id)}>
                          {track.name} ({track.instrument}) {track.originalAuthor ? `by ${track.originalAuthor}` : ''}
                        </MenuItem>
                      ))}
                    </>
                  )}
                </Select>
              </FormControl>
            </Box>
          )}
          
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#4CAF50',
                }
              },
              '& .MuiInputBase-input': {
                transition: 'all 0.2s',
              }
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
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#4CAF50',
                }
              }
            }}
          />
          
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'rgba(76, 175, 80, 0.08)', 
            borderRadius: 2, 
            border: '1px solid rgba(76, 175, 80, 0.15)',
            boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="body2" color="#81C784" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon fontSize="small" sx={{ mr: 1 }} />
              Publishing makes your composition available to all Cadenza users.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          px: 3, 
          py: 2,
          background: 'rgba(15, 15, 18, 0.8)'
        }}>
          <Button 
            onClick={() => setPublishDialogOpen(false)}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish} 
            variant="contained" 
            color="success"
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)',
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #81C784 30%, #4CAF50 90%)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Track Dialog */}
      <TrackDialog />

      {/* Library Dialog */}
      <LibraryDialog />
    </Container>
  );
};

export default Compose;