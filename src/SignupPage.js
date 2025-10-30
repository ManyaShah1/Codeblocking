// src/SignupPage.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import "./AppTheme.css";
import { useTheme } from "./App"; // <-- 1. IMPORT useTheme

const SignupPage = ({ onSignup }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme(); // <-- 1. GET DARK MODE STATE

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Optionally inform the parent app that a user is logged in
      if (onSignup) onSignup(userCredential.user);
      alert("✅ Account created successfully!");
      // Auto-navigate to workspace after signup (user is signed in)
      navigate("/workspace");
    } catch (err) {
      setError(err.message || "⚠️ Failed to create account. Try again.");
    }
  };

  return (
    // <-- 1. APPLY DARK MODE CLASS -->
    <div className={`login-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="shapes-container">
        <div className="shape shape-pink"></div>
        <div className="shape shape-mint"></div>
        <div className="shape shape-blue"></div>
        <div className="shape shape-lavender"></div>
        <div className="shape shape-yellow"></div>
        <div className="shape shape-coral"></div>
        <div className="shape shape-peach"></div>
      </div>

      <div className="login-container">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;