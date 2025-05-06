import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Box sx={{ mt: 2 }}>{message}</Box>
    </Box>
  );
};

export default LoadingSpinner; 