// src/pages/DashboardPage/DashboardPage.js
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css'; // Assuming you have CSS module for styling

function DashboardPage() {
  const { currentUser, logout } = useAuth();

  return (
    <div className={styles.dashboard}>
      <nav className={styles.topNav}>
        <span className={styles.logo}>GroupInvest</span>
        <ul className={styles.navLinks}>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><button onClick={logout} className={styles.logoutButton}>Logout</button></li>
        </ul>
      </nav>

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
          {/* List or cards representing different investment groups the user is part of */}
        </section>

        <section className={styles.marketInsights}>
          <h2>Market Insights</h2>
          {/* Widgets or feeds with market news, trends, etc. */}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
