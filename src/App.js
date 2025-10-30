import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import BlocklyWorkspace from './BlocklyWorkspace';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfilePage from './ProfilePage';
import LearnMorePage from './LearnMorePage';
import TutorialsPage from './TutorialsPage';
// We must keep the BlocklyProvider to ensure samples load correctly
import { BlocklyProvider } from './BlocklyContext'; 

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext); // Export useTheme

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (location.pathname === '/' || location.pathname === '/learn-more') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Codeblocking 🧩</Link>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/workspace">Workspace</Link></li>
            <li><Link to="/tutorials">Tutorials</Link></li>
            {/* "Files" link is removed */}
            <li><a href="#" onClick={onLogout}>Logout</a></li>

            {/* --- 1. MOVED PROFILE ICON HERE --- */}
            <li>
              <Link to="/profile" className="nav-profile-icon" title={`Profile (${username})`}>
                👤
              </Link>
            </li>
            {/* --- 1. MOVED DARK MODE BUTTON HERE --- */}
            <li>
              <button onClick={toggleDarkMode} className="btn-theme-toggle">
                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
            </li>
          </>
        ) : (
          <>
            {/* --- 2. HIDE TUTORIALS ON LOGIN/SIGNUP --- */}
            {location.pathname !== '/login' && location.pathname !== '/signup' && (
              <li><Link to="/tutorials">Tutorials</Link></li>
            )}
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            {/* --- 1. MOVED DARK MODE BUTTON HERE --- */}
            <li>
              <button onClick={toggleDarkMode} className="btn-theme-toggle">
                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const PrivateRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogin = async (user) => {
    setIsLoggedIn(true);
    setUsername((user && (user.displayName || user.email)) || 'User');
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
      <BlocklyProvider>
        <div className={appClassName}>
          <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleLogin} />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            
            <Route path="/tutorials" element={<TutorialsPage />} />

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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BlocklyProvider>
    </ThemeContext.Provider>
  );
}

export default App;