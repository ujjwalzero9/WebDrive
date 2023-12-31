import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  // Function to handle the logout action
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    
    // Redirect to the landing page (adjust the path accordingly)
    navigate('/');
  };

  return (
    <div>
      {/* Place the Logout button on every page where it's needed */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
