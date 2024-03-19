import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchGroups } from '../../api/groupApi';
import GroupList from '../../components/groups/GroupList/GroupList'; // Assuming this component is updated to display groups more interactively
import GroupSearchDialog from '../../components/groups/GroupSearchDialog/GroupSearchDialog';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showSearchDialog, setShowSearchDialog] = useState(false); // State to control the visibility of the search dialog

  // Function to toggle the search dialog visibility
  const toggleSearchDialog = () => {
    setShowSearchDialog(!showSearchDialog);
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
          {/* Portfolio summary widgets */}
        </section>

        <section className={styles.investmentGroups}>
          <h2>Your Investment Groups</h2>
          <button onClick={() => navigate('/create-group')} className={styles.createGroupButton}>
            Create Group
          </button>
          <button onClick={toggleSearchDialog} className={styles.searchGroupButton}>
            Search Groups
          </button>
          {/* GroupList component shows the user's groups */}
          <GroupList />
        </section>

        <section className={styles.marketInsights}>
          <h2>Market Insights</h2>
          {/* Market news, trends, etc. */}
        </section>
      </main>

      {/* Conditionally render the GroupSearchDialog based on state */}
      {showSearchDialog && <GroupSearchDialog onClose={toggleSearchDialog} />}
    </div>
  );
}

export default DashboardPage;