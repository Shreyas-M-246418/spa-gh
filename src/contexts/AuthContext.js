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
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Trigger token generation workflow
      fetch('https://api.github.com/repos/Shreyas-M-246418/spa-gh/dispatches', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${process.env.REACT_APP_REPO_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'oauth-code',
          client_payload: { code }
        })
      }).then(() => {
        // Poll for token file every second for up to 30 seconds
        let attempts = 0;
        const checkToken = () => {
          const tokenEndpoint = `${window.location.origin}${window.location.pathname}tokens/${code}.json`;
          fetch(tokenEndpoint)
            .then(response => {
              if (!response.ok) throw new Error('Token not ready');
              return response.json();
            })
            .then(data => {
              if (data.access_token) {
                fetchUserData(data.access_token);
              }
            })
            .catch(error => {
              attempts++;
              if (attempts < 30) {
                setTimeout(checkToken, 1000);
              } else {
                console.error('Error fetching token:', error);
                navigate('/login');
              }
            });
        };
        setTimeout(checkToken, 5000); // Initial delay
      });
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [navigate]);

  const fetchUserData = async (token) => {
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
  };

  const login = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    window.location.href = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=user`;
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