import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;