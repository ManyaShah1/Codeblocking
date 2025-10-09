// src/LearnMorePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import ShapesBackground from './ShapesBackground';
import './LearnMorePage.css';
// Placeholder images - ensure these are in your public folder or accessible via URL
const BLOCKLY_IMAGE_URL = 'https://developers.google.com/blockly/images/logo_color_192.png';
const PYTHON_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Python_logo_and_wordmark.svg';

const LearnMorePage = () => {
    return (
        <div className="learn-more-container landing-page">
            <ShapesBackground />
            <div className="learn-more-content">
                <header className="header">
                    <h1>Codeblocking: Visual Coding for Future Engineers</h1>
                    <p className="subtitle">Bridging the gap between visual programming and real-world Python.</p>
                </header>

                {/* Section 1: What is Blockly? */}
                <section className="info-section">
                    <div className="text-content">
                        <h2>What is Google Blockly?</h2>
                        <p>Blockly is a client-side JavaScript library that creates visual programming editors. It allows users to combine code blocks like puzzle pieces to generate syntax-correct code in many languages, making it an ideal tool for teaching programming concepts without the frustration of syntax errors.</p>
                        <ul>
                            <li>**Visual First:** Simplifies complex logic into understandable, stackable blocks.</li>
                            <li>**Syntax Guarantee:** Blocks only connect if the generated code is grammatically correct.</li>
                            <li>**Extensible:** Highly customizable with tools, categories, and custom blocks.</li>
                        </ul>
                    </div>
                    <div className="image-container">
                        <img src={BLOCKLY_IMAGE_URL} alt="Google Blockly Logo" />
                    </div>
                </section>

                {/* Section 2: Our Innovation: Python Backend */}
                <section className="info-section reverse-flex">
                    <div className="image-container">
                        <img src={PYTHON_IMAGE_URL} alt="Python Logo" />
                    </div>
                    <div className="text-content">
                        <h2>Our Core Innovation</h2>
                        <p>Unlike standard Blockly projects that often execute JavaScript, Codeblocking generates **pure, standard Python code** and executes it securely on a serverless platform (API Mock). This provides two major advantages:</p>
                        <div className="feature-grid">
                            <div className="feature-card">
                                <h3>Real-World Code</h3>
                                <p>Students learn Python syntax and logic that translates directly to professional applications, from data science to web development.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Security & Scalability</h3>
                                <p>By using a serverless execution environment, we sandbox user-submitted code, protecting the host system from malicious inputs and ensuring rapid scalability for thousands of users.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="footer">
                    <p>Ready to start visual programming?</p>
                    <Link to="/signup" className="btn btn-primary">Start Coding Now</Link>
                </footer>
            </div>
        </div>
    );
};

export default LearnMorePage;