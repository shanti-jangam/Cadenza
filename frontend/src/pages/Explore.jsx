import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Tab,
  Tabs,
  InputAdornment,
  CircularProgress,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import AudioService from '../services/AudioService';
import WishlistService from '../services/WishlistService';

const genres = [
  { id: 'classical', name: 'Classical', color: '#FF5252' },
  { id: 'jazz', name: 'Jazz', color: '#7C4DFF' },
  { id: 'rock', name: 'Rock', color: '#FF6D00' },
  { id: 'electronic', name: 'Electronic', color: '#00BFA5' },
  { id: 'pop', name: 'Pop', color: '#FF4081' },
  { id: 'hiphop', name: 'Hip Hop', color: '#FFAB00' },
  { id: 'ambient', name: 'Ambient', color: '#2979FF' },
  { id: 'folk', name: 'Folk', color: '#8D6E63' }
];

const mockTracks = [
  {
    id: 1,
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    genre: "classical",
    duration: "5:23",
    likes: 1200,
    plays: 5000,
    isFeatured: true,
    coverImage: "/images/covers/moonlight-sonata.jpg",
    defaultCover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    notes: [
      { note: 'C4', duration: '4n', instrument: 'piano' },
      { note: 'E4', duration: '4n', instrument: 'piano' },
      { note: 'G4', duration: '4n', instrument: 'piano' },
      { note: 'C5', duration: '4n', instrument: 'piano' },
      { note: 'E4', duration: '4n', instrument: 'piano' },
      { note: 'G4', duration: '4n', instrument: 'piano' }
    ]
  },
  {
    id: 2,
    title: "Take Five",
    artist: "Dave Brubeck",
    genre: "jazz",
    duration: "4:15",
    likes: 800,
    plays: 3500,
    isFeatured: true,
    coverImage: "/images/covers/take-five.jpg",
    defaultCover: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop",
    notes: [
      { note: 'D4', duration: '4n', instrument: 'piano' },
      { note: 'F4', duration: '4n', instrument: 'piano' },
      { note: 'A4', duration: '4n', instrument: 'piano' },
      { note: 'D5', duration: '4n', instrument: 'piano' },
      { note: 'F4', duration: '4n', instrument: 'piano' },
      { note: 'A4', duration: '4n', instrument: 'piano' }
    ]
  },
  {
    id: 3,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "rock",
    duration: "5:55",
    likes: 3500,
    plays: 18000,
    isFeatured: true,
    coverImage: "/images/covers/bohemian-rhapsody.jpg",
    defaultCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    notes: [
      { note: 'E4', duration: '4n', instrument: 'synth' },
      { note: 'G4', duration: '4n', instrument: 'synth' },
      { note: 'B4', duration: '4n', instrument: 'synth' },
      { note: 'E5', duration: '4n', instrument: 'synth' },
      { note: 'G4', duration: '4n', instrument: 'synth' },
      { note: 'B4', duration: '4n', instrument: 'synth' }
    ]
  },
  {
    id: 4,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    genre: "rock",
    duration: "8:02",
    likes: 2500,
    plays: 10000,
    isFeatured: true,
    coverImage: "/images/covers/stairway-to-heaven.jpg",
    defaultCover: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Strobe",
    artist: "Deadmau5",
    genre: "electronic",
    duration: "10:37",
    likes: 1500,
    plays: 7500,
    isFeatured: false,
    coverImage: "/images/covers/strobe.jpg",
    defaultCover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Billie Jean",
    artist: "Michael Jackson",
    genre: "pop",
    duration: "4:54",
    likes: 3000,
    plays: 15000,
    isFeatured: true,
    coverImage: "/images/covers/billie-jean.jpg",
    defaultCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    id: 7,
    title: "Lose Yourself",
    artist: "Eminem",
    genre: "hiphop",
    duration: "5:26",
    likes: 2800,
    plays: 12000,
    isFeatured: true,
    coverImage: "/images/covers/lose-yourself.jpg",
    defaultCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
  },
  {
    id: 8,
    title: "Weightless",
    artist: "Marconi Union",
    genre: "ambient",
    duration: "8:05",
    likes: 900,
    plays: 4000,
    isFeatured: false,
    coverImage: "/images/covers/weightless.jpg",
    defaultCover: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop"
  },
  {
    id: 9,
    title: "The Sound of Silence",
    artist: "Simon & Garfunkel",
    genre: "folk",
    duration: "3:05",
    likes: 1800,
    plays: 8000,
    isFeatured: false,
    coverImage: "/images/covers/sound-of-silence.jpg",
    defaultCover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop"
  },
  {
    id: 10,
    title: "Symphony No. 5",
    artist: "Beethoven",
    genre: "classical",
    duration: "7:15",
    likes: 1100,
    plays: 4800,
    isFeatured: false,
    coverImage: "/images/covers/symphony-5.jpg",
    defaultCover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&h=400&fit=crop"
  },
  {
    id: 11,
    title: "So What",
    artist: "Miles Davis",
    genre: "jazz",
    duration: "9:22",
    likes: 950,
    plays: 3200,
    isFeatured: false,
    coverImage: "/images/covers/so-what.jpg",
    defaultCover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=400&fit=crop"
  },
  {
    id: 12,
    title: "Sandstorm",
    artist: "Darude",
    genre: "electronic",
    duration: "3:45",
    likes: 2200,
    plays: 11000,
    isFeatured: false,
    coverImage: "/images/covers/sandstorm.jpg",
    defaultCover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
  }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [tracks, setTracks] = useState(mockTracks);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(null);

  useEffect(() => {
    // Here you would typically fetch tracks from your backend
    setLoading(true);
    setTimeout(() => {
      setTracks(mockTracks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortTracks = (tracks) => {
    return [...tracks].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.id - a.id;
        case 'popular':
          return b.plays - a.plays;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  };

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
        
        try {
          // Stop any currently playing audio
          if (currentlyPlaying) {
            AudioService.stopAll();
          }

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
        }
      }
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
    } finally {
      setLoadingTrack(null);
    }
  };

  const handleWishlist = (track) => {
    try {
      const isWishlisted = WishlistService.isInWishlist(track.id);
      
      if (isWishlisted) {
        WishlistService.removeFromWishlist(track.id);
      } else {
        WishlistService.addToWishlist({
          ...track,
          notes: track.notes || [] // Ensure notes are included
        });
      }
      
      // Force re-render
      setTracks([...tracks]);
    } catch (error) {
      console.error('Error updating wishlist:', error);
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
    try {
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
    } catch (error) {
      console.error('Error downloading track:', error);
    }
  };

  const isWishlisted = (trackId) => {
    return WishlistService.isInWishlist(trackId);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredTracks = sortTracks(tracks.filter(track => {
    if (selectedGenre !== 'all' && track.genre !== selectedGenre) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return track.title.toLowerCase().includes(query) ||
             track.artist.toLowerCase().includes(query);
    }
    return true;
  }));

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="white">
          Explore Compositions
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search compositions..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'grey.500' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'grey.500' }}>Filter by Genre</InputLabel>
              <Select
                value={selectedGenre}
                onChange={handleGenreChange}
                label="Filter by Genre"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuItem value="all">All Genres</MenuItem>
                {genres.map(genre => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'grey.500' }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="likes">Most Liked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: 'grey.500',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Tab label="ALL" />
          <Tab label="FEATURED" />
          <Tab label="FOLLOWING" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTracks.map((track) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}
              sx={{
                opacity: loading ? 0 : 1,
                transform: loading ? 'translateY(20px)' : 'translateY(0)',
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
              }}
            >
              <Card 
                sx={{ 
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
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={track.defaultCover}
                  alt={track.title}
                  sx={{ 
                    position: 'relative',
                    filter: loadingTrack === track.id ? 'brightness(0.7)' : 'none',
                    transition: 'filter 0.3s ease-in-out'
                  }}
                />
                {loadingTrack === track.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                )}
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
                      backgroundColor: genres.find(g => g.id === track.genre)?.color,
                      color: 'white',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    {track.title}
                  </Typography>
                  <Typography variant="subtitle2" color="grey.400" gutterBottom>
                    {track.artist}
                  </Typography>
                  <Typography variant="body2" color="grey.500">
                    {track.duration} • {track.plays.toLocaleString()} plays
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <IconButton
                      onClick={() => handlePlayPause(track)}
                      color={currentlyPlaying === track.id ? "primary" : "default"}
                      sx={{ color: currentlyPlaying === track.id ? 'primary.main' : 'grey.400' }}
                    >
                      {currentlyPlaying === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton 
                      onClick={() => handleWishlist(track)}
                      sx={{ color: isWishlisted(track.id) ? 'error.main' : 'grey.400' }}
                    >
                      {isWishlisted(track.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <IconButton 
                      onClick={() => handleShare(track)}
                      sx={{ color: 'grey.400' }}
                    >
                      <ShareIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDownload(track)}
                      sx={{ color: 'grey.400' }}
                    >
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

export default Explore;