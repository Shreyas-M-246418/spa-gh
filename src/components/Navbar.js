import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="top-navbar">
      <div className="nav-left">
        <a href="/" className="nav-brand">
          JobHub
        </a>
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <a href="/jobs" className="nav-link">My Jobs</a>
            <a href="/hire" className="nav-link">Post Job</a>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="login-button">Login</a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;