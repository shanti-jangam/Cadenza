import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';

const Profile = () => {
  const { user } = useAuth();
  const [compositions, setCompositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchUserCompositions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Debug log to check user object
        console.log('Current user:', user);
        
        if (!user?._id) {
          setError('User ID not available');
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        console.log('Fetching compositions for user:', user._id);
        const response = await axios.get(
          `http://localhost:5000/api/compositions/user/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Received compositions:', response.data);
        setCompositions(response.data);
      } catch (error) {
        console.error('Error fetching compositions:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompositions();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="80vh"
      >
        <Typography color="error" gutterBottom>
          Error loading compositions: {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: theme.palette.background.default,
        pt: 3,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Profile Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4,
            background: theme.palette.background.paper,
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={4}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '2.5rem'
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="500">
                {user?.username}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Compositions Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            background: theme.palette.background.paper,
            borderRadius: 2
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="500">
              <Box display="flex" alignItems="center" gap={1}>
                <MusicNoteIcon color="primary" />
                My Compositions ({compositions.length})
              </Box>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/compose"
              startIcon={<AddIcon />}
            >
              New Composition
            </Button>
          </Box>

          {compositions.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 6,
                px: 2,
                background: theme.palette.action.hover,
                borderRadius: 1
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No compositions yet
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={3}>
                Start creating music to see your compositions here!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/compose"
                startIcon={<AddIcon />}
              >
                Create Your First Composition
              </Button>
            </Box>
          ) : (
            <List sx={{ bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
              {compositions.map((composition, index) => (
                <React.Fragment key={composition._id}>
                  <ListItem
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: theme.palette.action.selected,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {index + 1}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6" component="div">
                            {composition.title}
                          </Typography>
                        }
                        secondary={`Created: ${new Date(composition.createdAt).toLocaleDateString()}`}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrowIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Play composition
                      }}
                      sx={{ minWidth: 100 }}
                    >
                      Play
                    </Button>
                  </ListItem>
                  {index < compositions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;