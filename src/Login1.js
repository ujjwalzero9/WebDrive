import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login1.css';

function Login1() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const userid = data.userid; // Replace with the key used in your API response for userid
      const keytoken = data.keytoken; // Replace with the key used in your API response for keytoken

      // Store userid and keytoken in session storage
      sessionStorage.setItem('userid', userid);
      sessionStorage.setItem('keytoken', keytoken);

      // Navigate to the desired page after successful login
      navigate('/home3');

      // Print userid and keytoken in the console
      console.log(`userid: ${userid}`);
      console.log(`keytoken: ${keytoken}`);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSignup = async () => {
    navigate('/signup');
  };

  return (
    <div className="login-form">
      <h3>Login</h3>
      <div>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>
      <h5>"New to our website? Sign up here."</h5>
      <button className="signup-button" onClick={handleSignup}>Signup</button>
      
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login1;
