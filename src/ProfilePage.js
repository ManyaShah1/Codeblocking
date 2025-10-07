// src/ProfilePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = ({ username, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Simple client-side logout
        onLogout();
        navigate('/');
    };

    if (!username) {
        // Should be caught by the PrivateRoute in App.js, but a good fallback
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>User Profile</h2>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {username.toLowerCase()}@codeblocking.com</p>
                <p><strong>Status:</strong> Basic User</p>
                <button onClick={handleLogout} className="btn btn-logout">
                    Logout
                </button>
            </div>
            <div className="profile-nav">
                <button onClick={() => navigate('/workspace')} className="btn btn-back">
                    Go to Workspace
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;