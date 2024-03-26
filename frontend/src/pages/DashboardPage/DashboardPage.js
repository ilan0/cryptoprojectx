import React from 'react';
import { useAuth } from '../../context/AuthContext';
import GroupList from '../../components/groups/GroupList/GroupList';
import PortfolioSummary from '../../components/PortfolioSummary/PortfolioSummary'; // Example component
import MarketInsights from '../../components/MarketInsights/MarketInsights'; // Example component
import Notifications from '../../components/Notifications/Notifications'; // Assuming you have a Notifications component
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.dashboard}>
      {/* Welcome header */}
      <header className={styles.header}>
        <h1>Welcome, {currentUser.username || 'User'}!</h1>
        <p>{currentUser.email}</p>
      </header>

      {/* Total revenue and other widgets */}
      <section className={styles.portfolioOverview}>
        <PortfolioSummary />
      </section>

      {/* My Groups section */}
      <section className={styles.investmentGroups}>
        <h2>My Groups</h2>
        <GroupList />
      </section>

      {/* Notifications sidebar */}
      <aside className={styles.notifications}>
        <Notifications />
      </aside>

      {/* Market Insights */}
      <section className={styles.marketInsights}>
        <MarketInsights />
      </section>
    </div>
  );
}

export default DashboardPage;
