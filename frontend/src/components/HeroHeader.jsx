import React from 'react';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeroHeader = () => {
  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          zIndex: 0,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              borderRadius: '50%',
              background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, Math.random() * 0.5 + 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  mb: 2,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                <motion.span
                  initial={{ display: 'inline-block' }}
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <MusicNoteIcon sx={{ fontSize: 'inherit', mr: 2, color: '#ffeb3b' }} />
                </motion.span>
                Cadenza
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 300,
                }}
              >
                Where AI meets Musical Creativity
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  maxWidth: '600px',
                }}
              >
                Create, explore, and collaborate on music with the power of artificial intelligence. 
                Express yourself through melody and harmony, no matter your skill level.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/compose"
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  mr: 2,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #ffeb3b 30%, #ffc107 90%)',
                  color: 'black',
                  boxShadow: '0 3px 5px 2px rgba(255, 235, 59, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ffc107 30%, #ffeb3b 90%)',
                  },
                }}
              >
                Start Composing
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/explore"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Explore
              </Button>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '400px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Piano keys animation */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[...Array(14)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: i % 7 === 0 || i % 7 === 3 ? '60px' : '40px',
                        height: '200px',
                        background: i % 7 === 0 || i % 7 === 3 ? 'white' : 'black',
                        borderRadius: '0 0 5px 5px',
                      }}
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </Box>
                
                {/* Music notes animation */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={`note-${i}`}
                    style={{
                      position: 'absolute',
                      fontSize: '2rem',
                      color: 'white',
                    }}
                    animate={{
                      y: [100, -100],
                      x: [Math.random() * 300 - 150, Math.random() * 300 - 150],
                      rotate: [0, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 5 + 5,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    <MusicNoteIcon />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          cursor: 'pointer',
        }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: '3rem' }} />
      </motion.div>
    </Box>
  );
};

export default HeroHeader; 