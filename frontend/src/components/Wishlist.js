import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Container } from '@mui/material';
import Track from './Track';
import WishlistService from '../services/WishlistService';

const Wishlist = () => {
  const [wishlistTracks, setWishlistTracks] = useState([]);

  const loadWishlist = () => {
    const tracks = WishlistService.getWishlist();
    setWishlistTracks(tracks);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleWishlistChange = () => {
    loadWishlist();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Wishlist
        </Typography>
        {wishlistTracks.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Your wishlist is empty. Add some tracks to get started!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {wishlistTracks.map((track) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
                <Track
                  track={track}
                  onWishlistChange={handleWishlistChange}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Wishlist; 