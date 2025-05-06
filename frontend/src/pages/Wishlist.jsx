import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import AudioService from '../services/AudioService';
import WishlistService from '../services/WishlistService';

const Wishlist = () => {
  const [wishlistedTracks, setWishlistedTracks] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTrack, setLoadingTrack] = useState(null);

  useEffect(() => {
    // Load wishlisted tracks from localStorage
    const loadWishlist = () => {
      const savedWishlist = WishlistService.getWishlist();
      setWishlistedTracks(savedWishlist);
      setLoading(false);
    };
    loadWishlist();
  }, []);

  const handlePlayPause = async (track) => {
    try {
      if (!track.notes || track.notes.length === 0) {
        console.error('No notes data available for track:', track.id);
        return;
      }

      if (currentlyPlaying === track.id) {
        AudioService.stopAll();
        setCurrentlyPlaying(null);
      } else {
        setLoadingTrack(track.id);
        if (currentlyPlaying) {
          AudioService.stopAll();
        }
        
        try {
          // Initialize audio and set instrument
          await AudioService.initialize();
          const instrument = track.notes[0]?.instrument || 'piano';
          AudioService.setInstrument(instrument);
          
          setCurrentlyPlaying(track.id);
          
          // Play the composition
          await AudioService.playComposition(track.notes);
          
          // Calculate total duration based on the last note's timestamp
          const lastNote = track.notes[track.notes.length - 1];
          const totalDuration = lastNote.timestamp + 1000; // Add 1 second buffer
          
          // Auto-stop after playback
          setTimeout(() => {
            setCurrentlyPlaying(null);
            AudioService.stopAll();
          }, totalDuration);
        } catch (error) {
          console.error('Error playing composition:', error);
          setCurrentlyPlaying(null);
        } finally {
          setLoadingTrack(null);
        }
      }
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
      setLoadingTrack(null);
    }
  };

  const handleRemoveFromWishlist = (trackId) => {
    try {
      // Stop playback if the track is currently playing
      if (currentlyPlaying === trackId) {
        AudioService.stopAll();
        setCurrentlyPlaying(null);
      }
      
      WishlistService.removeFromWishlist(trackId);
      setWishlistedTracks(WishlistService.getWishlist());
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleShare = async (track) => {
    try {
      await navigator.share({
        title: track.title,
        text: `Check out "${track.title}" by ${track.artist} on Cadenza!`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/explore?track=${track.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = (track) => {
    // Create a blob from the notes data
    const data = JSON.stringify(track.notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Wishlist
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : wishlistedTracks.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
          Your wishlist is empty. Add compositions from the Explore page!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlistedTracks.map((track) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={track.defaultCover}
                  alt={track.title}
                  sx={{ 
                    objectFit: 'cover',
                    filter: loadingTrack === track.id ? 'brightness(0.7)' : 'none',
                    transition: 'filter 0.3s ease-in-out'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    p: 1
                  }}
                >
                  <Chip
                    label={track.genre}
                    size="small"
                    sx={{
                      backgroundColor: track.genreColor || '#1976d2',
                      color: 'white'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    {track.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {track.artist}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {track.duration} • {track.plays.toLocaleString()} plays
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <IconButton
                      onClick={() => handlePlayPause(track)}
                      color={currentlyPlaying === track.id ? "primary" : "default"}
                    >
                      {currentlyPlaying === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveFromWishlist(track.id)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleShare(track)}>
                      <ShareIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDownload(track)}>
                      <DownloadIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist; 