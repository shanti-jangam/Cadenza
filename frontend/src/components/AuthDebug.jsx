import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('Auth State:', {
    user,
    isAuthenticated,
    loading
  });

  return null;
};

export default AuthDebug; 