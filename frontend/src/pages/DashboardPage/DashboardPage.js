import React from 'react';
import { useAuth } from '../../context/AuthContext';
import GroupList from '../../components/groups/GroupList/GroupList';
import PortfolioSummary from '../../components/PortfolioSummary/PortfolioSummary';
import MarketInsights from '../../components/MarketInsights/MarketInsights';
import Notifications from '../../components/Notifications/Notifications';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.dashboard}>
      {/* Ensure welcomeBanner is at the top */}
      <div className={styles.welcomeBanner}>
        <h1>Welcome, {currentUser.username || 'User'}!</h1>
        <p>Your personal dashboard</p>
      </div>

      <div className={styles.portfolioOverview}>
        <PortfolioSummary />
      </div>

      <div className={styles.groupSection}>
        <h2>My Groups</h2>
        <GroupList />
      </div>

      <div className={styles.notificationsColumn}>
        <Notifications />
      </div>

      <div className={styles.marketInsights}>
        <MarketInsights />
      </div>
    </div>
  );
}


export default DashboardPage;
