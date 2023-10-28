// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Header() {
  const { authenticated, logout } = useAuth();

  return (
    <div>
      <nav>
        {authenticated ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/upload">Upload</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Header;
