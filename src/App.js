/// src/App.js
import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import BlocklyWorkspace from './BlocklyWorkspace';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfilePage from './ProfilePage';
import LearnMorePage from './LearnMorePage'; // ADDED

// Create a Context for Dark Mode
const ThemeContext = createContext();

// Custom hook to use the Theme context
const useTheme = () => useContext(ThemeContext);

// Component for the navbar
const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Hide navbar on the landing page/learn more page
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
            <li><Link to="/profile">Profile ({username})</Link></li> 
            <li><a href="#" onClick={onLogout}>Logout</a></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
        {/* Dark Mode Toggle Button */}
        <li>
          <button onClick={toggleDarkMode} className="btn-theme-toggle">
            {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

// PrivateRoute component to protect the workspace and profile pages
const PrivateRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); 

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user || 'User'); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const appClassName = `App ${isDarkMode ? 'dark-mode' : ''}`;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        <div className={appClassName}>
            <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
                
                {/* Updated route to use new component */}
                <Route 
                  path="/learn-more" 
                  element={<LearnMorePage />} 
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
    </ThemeContext.Provider>
  );
}

export default App;