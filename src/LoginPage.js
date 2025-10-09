// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ShapesBackground from './ShapesBackground'; // ADDED
import './AuthPage.css'; 
import './LandingPage.css'; // ADDED to inherit background/shapes styles

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock Authentication Logic
        if (username && password) {
            onLogin(username); 
            navigate('/workspace');
        } else {
            alert('Please enter username and password');
        }
    };

    // ADDED: Use landing-page class for background effect
    return (
        <div className="auth-container landing-page">
            <ShapesBackground />
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login to Codeblocking</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-auth">Login</button>
                <p style={{marginTop: '20px'}}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;