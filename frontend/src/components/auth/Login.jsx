import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper,
  Container, Alert, Link
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                type="email"
              />
              <TextField
                fullWidth
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                type="password"
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
              >
                Login
              </Button>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register">
                    Register here
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Login; 