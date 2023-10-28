import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        // Save the user ID and key token to sessionStorage
        sessionStorage.setItem('userid', data.user_id);
        sessionStorage.setItem('keytoken', data.keytoken);
        // Registration successful, redirect to Home
        navigate('/home3');
      } else {
        // Handle registration error, show a message or take appropriate action
      }
    } catch (error) {
      // Handle network or other errors
    }
  };

  const handleLoginClick = () => {
    navigate('/'); // Redirect to the Login page
  };

  return (
    <div className="signup-form">
      <h1>Sign up here</h1>
      <h5>New to our website? .</h5>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <h5>Already have an account? Sign in here.</h5>
        <button onClick={handleLoginClick} className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Signup;
