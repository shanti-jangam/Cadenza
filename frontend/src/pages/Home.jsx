import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Card, CardContent, CardMedia, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import CreateIcon from '@mui/icons-material/Create';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.3s ease-in-out',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h5" component="h3" gutterBottom align="center" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center">
        {description}
      </Typography>
    </Paper>
  </motion.div>
);

const ActionCard = ({ title, description, icon, path, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
        }}
      >
        {icon}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          component={RouterLink} 
          to={path}
          startIcon={<AutoAwesomeIcon />}
        >
          Get Started
        </Button>
      </Box>
    </Card>
  </motion.div>
);

const BenefitItem = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Box sx={{ display: 'flex', mb: 3 }}>
      <Box sx={{ mr: 2, color: 'primary.main' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  </motion.div>
);

function Home() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <HeroHeader />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom 
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Create Music with AI
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ActionCard
              title="Compose"
              description="Create your own music with our AI-powered composition tools. Express yourself through melody and harmony."
              icon={<CreateIcon sx={{ fontSize: 60, color: 'white' }} />}
              path="/compose"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActionCard
              title="Explore"
              description="Discover compositions from creators around the world. Get inspired by different styles and genres."
              icon={<ExploreIcon sx={{ fontSize: 60, color: 'white' }} />}
              path="/explore"
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActionCard
              title="Collaborate"
              description="Work together with other musicians and AI to create something unique. Share your ideas and build together."
              icon={<GroupsIcon sx={{ fontSize: 60, color: 'white' }} />}
              path="/collaborate"
              delay={0.6}
            />
          </Grid>
        </Grid>

        <Box sx={{ my: 10 }}>
          <Divider sx={{ mb: 6 }} />
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ mb: 6 }}
          >
            Why Choose Cadenza?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <BenefitItem
                icon={<MusicNoteIcon sx={{ fontSize: 40 }} />}
                title="AI-Powered Composition"
                description="Our advanced AI algorithms help you create beautiful melodies and harmonies, even if you're not a trained musician."
                delay={0.2}
              />
              <BenefitItem
                icon={<SpeedIcon sx={{ fontSize: 40 }} />}
                title="Real-Time Collaboration"
                description="Work with other musicians in real-time, no matter where they are in the world. Share your progress instantly."
                delay={0.4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BenefitItem
                icon={<AutoAwesomeIcon sx={{ fontSize: 40 }} />}
                title="Intuitive Interface"
                description="Our user-friendly interface makes music creation accessible to everyone, from beginners to professionals."
                delay={0.6}
              />
              <BenefitItem
                icon={<SecurityIcon sx={{ fontSize: 40 }} />}
                title="Secure & Private"
                description="Your compositions are stored securely and privately. You control who can access and collaborate on your work."
                delay={0.8}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/compose"
              sx={{
                mr: 2,
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                borderRadius: 2,
              }}
            >
              Start Composing
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

export default Home; 