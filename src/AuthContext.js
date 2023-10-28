import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook for accessing the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // State to track authentication status
  const [authenticated, setAuthenticated] = useState(false);

  // Function to handle user login
  const login = () => {
    setAuthenticated(true);
  };

  // Function to handle user logout
  const logout = () => {
    setAuthenticated(false);
  };

  // Check for authentication on initial load
  useEffect(() => {
    const userid = localStorage.getItem('userid');
    const keytoken = localStorage.getItem('keytoken');
    
    if (userid && keytoken) {
      // If userid and keytoken exist in local storage, consider the user as authenticated
      setAuthenticated(true);
    }
  }, []);

  // Context value to be provided to components
  const contextValue = {
    authenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
