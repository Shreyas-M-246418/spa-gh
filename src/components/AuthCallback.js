import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const code = hashParams.get('code');
    
    if (code) {
      // The code will be handled by AuthContext's useEffect
      console.log('Received code in callback:', code);
    }
    
    if (user) {
      navigate('/jobs');
    }
  }, [user, navigate]);

  return null;
};

export default AuthCallback; 