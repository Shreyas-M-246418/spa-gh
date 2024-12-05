import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async (token) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const userData = await response.json();
      const user = {
        id: userData.id,
        name: userData.name,
        username: userData.login,
        avatar: userData.avatar_url,
        email: userData.email
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('gh_token', token);
      
      navigate('/jobs');
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    
    // Check hash parameters if no URL code
    const hashParams = new URLSearchParams(window.location.hash.replace('#/', ''));
    const hashCode = hashParams.get('code');
    
    const code = urlCode || hashCode;
    
    if (code) {
      fetch(`https://github-oauth-worker.shreyas-m246418.workers.dev?code=${code}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to exchange code');
          return response.json();
        })
        .then(data => {
          if (data.access_token) {
            fetchUserData(data.access_token);
          } else {
            throw new Error('No access token received');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          navigate('/login');
        });
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [navigate, fetchUserData]);

  const login = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/spa-gh/#/callback`);
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('gh_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};