import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import BlocklyWorkspace from './BlocklyWorkspace';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ProfilePage from './ProfilePage';
import LearnMorePage from './LearnMorePage';
import TutorialsPage from './TutorialsPage';
import LeaderboardPage from './LeaderboardPage'; // <-- IMPORT LEADERBOARD
import { BlocklyProvider } from './BlocklyContext'; 

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext); // Export useTheme

const Navbar = ({ isLoggedIn, username, onLogout, isMusicPlaying, onMusicToggle }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (location.pathname === '/' || location.pathname === '/learn-more') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Codeblocking 🧩</Link>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            {/* --- Text Links --- */}
            <li><Link to="/workspace">Workspace</Link></li>
            <li><Link to="/tutorials">Tutorials</Link></li>
            <li><button onClick={onLogout} className="btn-logout" style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}>Logout</button></li>

            {/* --- Icon Links/Buttons (Grouped) --- */}
            {/* --- THIS IS THE FIX: Leaderboard icon moved next to Profile --- */}
            <li>
              <Link to="/leaderboard" className="nav-leaderboard-icon" title="Leaderboard">
                🏆
              </Link>
            </li>
            <li>
              <Link to="/profile" className="nav-profile-icon" title={`Profile (${username})`}>
                👤
              </Link>
            </li>
            <li>
              <button onClick={onMusicToggle} className="btn-music-toggle" title={isMusicPlaying ? "Mute" : "Unmute"}>
                {isMusicPlaying ? '🔈' : '🔇'}
              </button>
            </li>
            <li>
              <button onClick={toggleDarkMode} className="btn-theme-toggle">
                {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
            </li>
          </>
        ) : (
          <>
            {location.pathname !== '/login' && location.pathname !== '/signup' && (
              <>
                <li><Link to="/workspace">Workspace</Link></li>
                <li><Link to="/tutorials">Tutorials</Link></li>
              </>
            )}
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li>
              <button onClick={onMusicToggle} className="btn-music-toggle" title={isMusicPlaying ? "Mute" : "Unmute"}>
                {isMusicPlaying ? '🔈' : '🔇'}
              </button>
            </li>
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
  
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed: ", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);
  
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

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
          <Navbar 
            isLoggedIn={isLoggedIn} 
            username={username} 
            onLogout={handleLogout}
            isMusicPlaying={isMusicPlaying}
            onMusicToggle={toggleMusic}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleLogin} />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />

            <Route
              path="/leaderboard"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <LeaderboardPage />
                </PrivateRoute>
              }
            />
            <Route path="/workspace" element={<BlocklyWorkspace />} />
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
          
          <audio ref={audioRef} src="/assets/soundtrack.mp3" loop />
        </div>
      </BlocklyProvider>
    </ThemeContext.Provider>
  );
}

export default App;