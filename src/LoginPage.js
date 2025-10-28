import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase" ;
import { useNavigate, Link } from "react-router-dom";
import "./AppTheme.css";

const LoginPage = ({onLogin}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Inform parent that login succeeded so it can update app state
      if (onLogin) onLogin(userCredential.user);
      alert("✅ Login successful!");
      navigate("/workspace");
    } catch (err) {
      setError(err.message || "❌ Invalid email or password");
    }
  };

  return (
    <div className="login-page">
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
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
