import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchGroups } from '../../api/groupApi';
import GroupList from '../../components/groups/GroupList'; // Assuming this component is updated to display groups more interactively
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

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

  // Navigate to the Create Group Page
  const navigateToCreateGroup = () => {
    navigate('/create-group');
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
          {/* Add widgets or information summarizing the user's investment portfolio */}
        </section>

        <section className={styles.investmentGroups}>
          <h2>Your Investment Groups</h2>
          <button onClick={navigateToCreateGroup} className={styles.createGroupButton}>
            Create Group
          </button>
          <GroupList groups={groups} />
          {/* GroupList component is assumed to handle both displaying groups and providing
              interactive elements like joining or viewing group details */}
        </section>

        <section className={styles.marketInsights}>
          <h2>Market Insights</h2>
          {/* Include widgets or feeds for market news, trends, etc. */}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
