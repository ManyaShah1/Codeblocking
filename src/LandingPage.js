// src/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="shapes-container">
                <div className="shape shape-pink"></div>
                <div className="shape shape-mint"></div>
                <div className="shape shape-blue"></div>
                <div className="shape shape-lavender"></div>
                <div className="shape shape-yellow"></div>
                <div className="shape shape-coral"></div>
                <div className="shape shape-peach"></div>
            </div>
            <div className="content">
                <h1>Codeblocking 🧩</h1>
                <p>Visual programming made easy with visual blocks.</p>
                <div className="buttons-container">
                    <Link to="/learn-more" className="btn btn-primary">Learn More</Link>
                    <Link to="/login" className="btn btn-secondary">Login / Signup</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;