// src/SignupPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ShapesBackground from './ShapesBackground'; // ADDED
import './AuthPage.css'; 
import './LandingPage.css'; // ADDED to inherit background/shapes styles

const SignupPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock Signup Logic
        if (username && email && password) {
            onLogin(username); 
            navigate('/workspace');
        } else {
            alert('Please fill out all fields');
        }
    };

    // ADDED: Use landing-page class for background effect
    return (
        <div className="auth-container landing-page">
            <ShapesBackground />
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Create Your Codeblocking Account</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-auth">Sign Up</button>
                <p style={{marginTop: '20px'}}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;