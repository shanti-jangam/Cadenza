import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ComposeNew from './pages/ComposeNew';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Collaborate from './pages/Collaborate';
import Wishlist from './pages/Wishlist';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Box sx={{ 
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default',
              color: 'text.primary'
            }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/compose" element={<ComposeNew />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/collaborate" element={<Collaborate />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
