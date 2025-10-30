// src/LeaderboardPage.js
import React from 'react';
import ShapesBackground from './ShapesBackground';
import './LandingPage.css'; // For the background
import './LeaderboardPage.css'; // For the card styles

// Mock data for the leaderboard
const mockLeaderboardData = [
  { rank: 1, name: 'CodeWizard', score: 2450, icon: '🧙' },
  { rank: 2, name: 'LogicMaster', score: 2300, icon: '🧪' },
  { rank: 3, name: 'PythonPioneer', score: 2150, icon: '🐍' },
  { rank: 4, name: 'BlockBuilder', score: 1900, icon: '🧱' },
  { rank: 5, name: 'LoopListener', score: 1750, icon: '🔁' },
  { rank: 6, name: 'ScriptKid', score: 1500, icon: '🧑‍💻' },
  { rank: 7, name: 'SyntaxStar', score: 1250, icon: '✨' },
];

const LeaderboardPage = () => {
  return (
    <div className="leaderboard-page-wrapper landing-page">
      <ShapesBackground />
      <div className="leaderboard-container">
        <h1>🏆 Leaderboard</h1>
        <p className="leaderboard-subtitle">
          See who's at the top of the Codeblocking charts!
        </p>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboardData.map((user) => (
              <tr key={user.rank}>
                <td className="rank">{user.rank}</td>
                <td className="user">
                  <span className="user-icon">{user.icon}</span>
                  {user.name}
                </td>
                <td className="score">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="leaderboard-note">
          Scores are based on completed tutorials and challenges. (Demo data)
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;