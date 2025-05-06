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
    coverImage: "https://source.unsplash.com/random/400x400?classical,piano"
  },
  {
    id: 2,
    title: "Take Five",
    artist: "Dave Brubeck",
    genre: "jazz",
    duration: "4:15",
    likes: 800,
    plays: 3500,
    coverImage: "https://source.unsplash.com/random/400x400?jazz,saxophone"
  },
  {
    id: 3,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    genre: "rock",
    duration: "8:02",
    likes: 2500,
    plays: 10000,
    coverImage: "https://source.unsplash.com/random/400x400?rock,guitar"
  },
  {
    id: 4,
    title: "Strobe",
    artist: "Deadmau5",
    genre: "electronic",
    duration: "10:37",
    likes: 1500,
    plays: 7500,
    coverImage: "https://source.unsplash.com/random/400x400?electronic,dj"
  },
  {
    id: 5,
    title: "Billie Jean",
    artist: "Michael Jackson",
    genre: "pop",
    duration: "4:54",
    likes: 3000,
    plays: 15000,
    coverImage: "https://source.unsplash.com/random/400x400?pop,dance"
  },
  {
    id: 6,
    title: "Lose Yourself",
    artist: "Eminem",
    genre: "hiphop",
    duration: "5:26",
    likes: 2800,
    plays: 12000,
    coverImage: "https://source.unsplash.com/random/400x400?hiphop,rap"
  },
  {
    id: 7,
    title: "Weightless",
    artist: "Marconi Union",
    genre: "ambient",
    duration: "8:05",
    likes: 900,
    plays: 4000,
    coverImage: "https://source.unsplash.com/random/400x400?ambient,calm"
  },
  {
    id: 8,
    title: "The Sound of Silence",
    artist: "Simon & Garfunkel",
    genre: "folk",
    duration: "3:05",
    likes: 1800,
    plays: 8000,
    coverImage: "https://source.unsplash.com/random/400x400?folk,acoustic"
  },
  {
    id: 9,
    title: "Symphony No. 5",
    artist: "Beethoven",
    genre: "classical",
    duration: "7:15",
    likes: 1100,
    plays: 4800,
    coverImage: "https://source.unsplash.com/random/400x400?orchestra,symphony"
  },
  {
    id: 10,
    title: "So What",
    artist: "Miles Davis",
    genre: "jazz",
    duration: "9:22",
    likes: 950,
    plays: 3200,
    coverImage: "https://source.unsplash.com/random/400x400?jazz,trumpet"
  },
  {
    id: 11,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "rock",
    duration: "5:55",
    likes: 3500,
    plays: 18000,
    coverImage: "https://source.unsplash.com/random/400x400?rock,concert"
  },
  {
    id: 12,
    title: "Sandstorm",
    artist: "Darude",
    genre: "electronic",
    duration: "3:45",
    likes: 2200,
    plays: 11000,
    coverImage: "https://source.unsplash.com/random/400x400?electronic,party"
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
    // Implement search logic here
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    // Filter tracks by genre
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortTracks = (tracks) => {
    return [...tracks].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.id - a.id; // Assuming newer tracks have higher IDs
        case 'popular':
          return b.plays - a.plays;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  };

  const handlePlayPause = async (trackId) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
      AudioService.stopAll();
    } else {
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        setLoadingTrack(trackId);
        setCurrentlyPlaying(trackId);
        
        // Create a simple melody based on the genre
        const melodyMap = {
          classical: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'],
          jazz: ['D4', 'F4', 'A4', 'C5', 'A4', 'F4', 'D4'],
          rock: ['E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'E4'],
          electronic: ['F4', 'A4', 'C5', 'F5', 'C5', 'A4', 'F4'],
          pop: ['G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4'],
          hiphop: ['A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'A4'],
          ambient: ['B4', 'D5', 'F5', 'B5', 'F5', 'D5', 'B4'],
          folk: ['C4', 'F4', 'A4', 'C5', 'A4', 'F4', 'C4']
        };

        const melody = melodyMap[track.genre] || melodyMap.classical;
        const duration = '8n';
        
        // Stop any currently playing audio
        AudioService.stopAll();
        
        // Play the melody
        let time = 0;
        for (let note of melody) {
          await new Promise(resolve => {
            setTimeout(() => {
              AudioService.playNote({ note, duration });
              resolve();
            }, time);
          });
          time += 300;
        }
        
        setLoadingTrack(null);
      }
    }
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
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
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Genre</InputLabel>
              <Select
                value={selectedGenre}
                onChange={handleGenreChange}
                label="Filter by Genre"
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
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
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
          sx={{ mb: 3 }}
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
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => `0 8px 24px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={track.coverImage}
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
                <CardContent sx={{ flexGrow: 1 }}>
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
                      onClick={() => handlePlayPause(track.id)}
                      color={currentlyPlaying === track.id ? "primary" : "default"}
                    >
                      {currentlyPlaying === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton>
                      <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                    <IconButton>
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