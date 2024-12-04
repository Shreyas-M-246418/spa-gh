import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    // Check for code in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Exchange code for token using a proxy server
      exchangeCodeForToken(code);
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [navigate]);

  const exchangeCodeForToken = async (code) => {
    try {
      // Use a proxy server to exchange the code for a token
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
          client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
          code: code,
        })
      });

      const data = await response.json();
      if (data.access_token) {
        await fetchUserData(data.access_token);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      navigate('/login');
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
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
  };

  const login = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
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