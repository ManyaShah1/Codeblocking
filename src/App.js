// manyashah1/codeblocking/Codeblocking-4d9959361a2ef58f4120e565e625b375b87b32e0/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import BlocklyWorkspace from './BlocklyWorkspace';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfilePage from './ProfilePage';

// Component for the navbar, separated for clarity and to handle auth state
const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const location = useLocation();
  // Hide navbar on the landing page for a cleaner look
  if (location.pathname === '/' || location.pathname === '/learn-more') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Codeblocking 🧩</Link>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/workspace">Workspace</Link></li>
            <li><a href="#">Files</a></li>
            <li><a href="#">Save</a></li>
            <li><a href="#">Tutorials</a></li>
            {/* Added Profile Link */}
            <li><Link to="/profile">Profile ({username})</Link></li> 
            <li><a href="#" onClick={onLogout}>Logout</a></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

// PrivateRoute component to protect the workspace and profile pages
const PrivateRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};


function App() {
  // Use a simple state for mock authentication
  // Start as not logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    // Use 'User' as a default if no username is passed (e.g., from an old session mock)
    setUsername(user || 'User'); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
        {/* Placeholder for "Learn More" page */}
        <Route 
          path="/learn-more" 
          element={
            <div className="landing-page" style={{backgroundColor: '#FFFFE0', flexDirection: 'column'}}>
              <div className="content">
                <h1 style={{color: '#87CEEB'}}>What is Codeblocking?</h1>
                <p>Codeblocking is an interactive, visual programming platform built on Blockly, allowing users to drag and drop code blocks to create Python programs without writing traditional syntax.</p>
                <Link to="/" className="btn btn-secondary">Go Back</Link>
              </div>
            </div>
          } 
        /> 

        {/* Protected Routes */}
        <Route 
          path="/workspace" 
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <BlocklyWorkspace />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ProfilePage username={username} onLogout={handleLogout} />
            </PrivateRoute>
          } 
        />
        
        {/* Redirect any unmatched route to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;