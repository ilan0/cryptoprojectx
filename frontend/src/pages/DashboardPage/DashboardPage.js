// src/pages/DashboardPage/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Removed { Link } since it's no longer used here
import { fetchGroups, searchPublicGroups, joinGroup } from '../../api/groupApi';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const fetchedGroups = await fetchGroups(currentUser.token);
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Failed to load groups:', error);
      }
    };

    if (currentUser.token) {
      loadGroups();
    }
  }, [currentUser]);

  const handleSearch = async () => {
    try {
      const results = await searchPublicGroups(searchQuery, currentUser.token);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for groups:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId, currentUser.token);
      const fetchedGroups = await fetchGroups(currentUser.token);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  // Function to navigate to the create group page
  const navigateToCreateGroup = () => {
    navigate('/create-group'); // Adjust as necessary based on your routing setup
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, {currentUser.email || 'User'}!</h1>
        <p>Your personal investment dashboard.</p>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.portfolioOverview}>
          <h2>Portfolio Overview</h2>
          {/* Portfolio summary widgets can be placed here */}
        </section>

        <section className={styles.investmentGroups}>
          <h2>Your Investment Groups</h2>
          <button onClick={() => setShowSearchBox(!showSearchBox)} className={styles.toggleButton}>
            {showSearchBox ? 'Cancel Search' : 'Add a Group'}
          </button>
          <button onClick={navigateToCreateGroup} className={styles.createGroupButton}>
            Create Group
          </button>
          {showSearchBox && (
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search public groups"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          )}
          {searchResults.length > 0 && (
            <ul className={styles.searchResults}>
              {searchResults.map((group) => (
                <li key={group._id}>
                  {group.name}
                  <button onClick={() => handleJoinGroup(group._id)}>Join</button>
                </li>
              ))}
            </ul>
          )}
          {/* Display user's groups here */}
        </section>

        <section className={styles.marketInsights}>
          <h2>Market Insights</h2>
          {/* Widgets or feeds with market news, trends, etc. can be placed here */}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
