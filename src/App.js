import React from 'react';
import './App.css';
import webDriveLogo from './WebDrive.jpeg'; // Your logo import
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Signup from './Signup';
import Home3 from './Home3';
import FileUploader from './FileUploader';
import Login1 from './Login1';
import Logout from './Logout';
import linkedinIcon from './linkedin2.png'; // Replace with your LinkedIn icon image
import gmailIcon from './gmail.png'; // Replace with your Gmail icon image
import githubIcon from './github.png'; // Replace with your GitHub icon image
import pdfIcon from './pdf-icon.png'; // Add a PDF icon image
import './Ujjwal-Kumar_SOA.pdf';
function App() {
  return (
    <AuthProvider>
      <div className="top-banner">
        <div className="left-content">
          <img src={webDriveLogo} alt="WebDrive Logo" className="round-logo" />
          <h1>WebDrive</h1>
        </div>
        <div className="right-content">
          <div className="icons-container">
            <a href="https://www.linkedin.com/in/ujjwalzero9/" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn Icon" className="custom-icon linkedin-icon" />
            </a>
            <a href="https://github.com/ujjwalzero9" target="_blank" rel="noopener noreferrer">
              <img src={githubIcon} alt="GitHub Icon" className="custom-icon" />
            </a>
            <a href="https://drive.google.com/file/d/1v3gntkIEtnqF2MJ9PKZIlRLZihnV2Kw7/view?usp=sharing" download>
              <img src={pdfIcon} alt="PDF Icon" className="custom-icon pdf-icon" />
            </a>
            <a href="mailto:ujjwalzero9@gmail.com">
              <img src={gmailIcon} alt="Gmail Icon" className="custom-icon" />
            </a>
          </div>
        </div>
      </div>
      <Router>
        <div className="form">
          <Routes>
            <Route exact path="/" element={<Login1 />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route path="/home3" element={<Home3 />} />
            <Route path="/upload" element={<FileUploader />} />
            <Route path="/logout" element={<Logout />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
