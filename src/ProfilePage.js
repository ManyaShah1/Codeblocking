// src/ProfilePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import ShapesBackground from './ShapesBackground'; // ADDED
import './LandingPage.css'; // ADDED to inherit background/shapes styles

const ProfilePage = ({ username, onLogout }) => {
    const navigate = useNavigate();
    const [mockEmail, setMockEmail] = useState(`${username.toLowerCase()}@codeblocking.com`);
    const [mockStatus, setMockStatus] = useState('Basic User');
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const handleSave = () => {
        console.log(`Saving profile for ${username}: Email=${mockEmail}, Status=${mockStatus}`);
        setIsEditing(false);
    };

    if (!username) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container landing-page"> {/* ADDED landing-page class for BG */}
            <ShapesBackground /> {/* ADDED */}
            <div className="profile-card">
                <h2>User Profile</h2>
                <p><strong>Username:</strong> {username}</p>

                <div style={{ marginBottom: '15px' }}>
                    <strong>Email:</strong> 
                    {isEditing ? (
                        <input
                            type="email"
                            value={mockEmail}
                            onChange={(e) => setMockEmail(e.target.value)}
                            style={{ marginLeft: '10px' }}
                        />
                    ) : (
                        <span style={{ marginLeft: '10px' }}>{mockEmail}</span>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <strong>Status:</strong> 
                    {isEditing ? (
                        <select
                            value={mockStatus}
                            onChange={(e) => setMockStatus(e.target.value)}
                            style={{ marginLeft: '10px' }}
                        >
                            <option>Basic User</option>
                            <option>Premium Tier</option>
                            <option>Student</option>
                        </select>
                    ) : (
                        <span style={{ marginLeft: '10px' }}>{mockStatus}</span>
                    )}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    {isEditing ? (
                        <button onClick={handleSave} className="btn btn-save">
                            Save Changes
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="btn btn-edit">
                            Edit Profile
                        </button>
                    )}
                    
                    <button onClick={handleLogout} className="btn btn-logout">
                        Logout
                    </button>
                </div>
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