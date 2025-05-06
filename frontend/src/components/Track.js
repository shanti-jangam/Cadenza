import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Stack, Box, Chip, CardActions } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import WishlistService from '../services/WishlistService';

const Track = ({ track, onPlay, isPlaying, isLoading, onWishlistChange }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(WishlistService.isInWishlist(track.id));
  }, [track.id]);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      WishlistService.removeFromWishlist(track.id);
    } else {
      WishlistService.addToWishlist(track);
    }
    setIsInWishlist(!isInWishlist);
    if (onWishlistChange) {
      onWishlistChange();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: track.title,
          text: `Check out this track: ${track.title} by ${track.artist}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
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
        image={track.coverImage || track.defaultCover}
        alt={track.title}
        sx={{ 
          position: 'relative',
          filter: isLoading ? 'brightness(0.7)' : 'none',
          transition: 'filter 0.3s ease-in-out'
        }}
      />
      {track.genre && (
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
              backgroundColor: track.genreColor || 'primary.main',
              color: 'white',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {track.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {track.artist}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {track.duration} • {track.plays?.toLocaleString() || 0} plays
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <IconButton
            onClick={() => onPlay(track.id)}
            color={isPlaying ? "primary" : "default"}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton
            onClick={handleWishlistToggle}
            color={isInWishlist ? "error" : "default"}
          >
            {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
          <IconButton>
            <DownloadIcon />
          </IconButton>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
        <Box>
          <IconButton
            onClick={handleWishlistToggle}
            color="primary"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton onClick={handleShare} aria-label="share">
            <ShareIcon />
          </IconButton>
        </Box>
        <IconButton
          onClick={() => onPlay && onPlay(track)}
          color="primary"
          aria-label="play"
        >
          <PlayArrowIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Track; 