import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem 
          button 
          component={RouterLink} 
          to="/profile"
        >
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/wishlist"
        >
          <ListItemIcon><FavoriteIcon /></ListItemIcon>
          <ListItemText primary="Wishlist" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: { xs: 64, sm: 70 },
          }}
        >
          {/* Logo - Always on the left */}
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            <MusicNoteIcon 
              sx={{ 
                fontSize: { xs: 28, sm: 32 },
                mr: 1, 
                color: 'primary.main' 
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
              }}
            >
              Cadenza
            </Typography>
          </Box>

          {/* Mobile Menu Icon */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            /* Desktop Navigation Items */
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                startIcon={<PersonIcon />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  backgroundColor: location.pathname === '/profile' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/wishlist"
                startIcon={<FavoriteIcon />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  backgroundColor: location.pathname === '/wishlist' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                Wishlist
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            width: 250,
          }
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 