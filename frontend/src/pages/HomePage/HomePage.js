// src/pages/HomePage/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css'; // Assuming you have CSS modules set up
import { useAuth } from '../../context/AuthContext';
const HomePage = () => {
  const { currentUser } = useAuth();
  return (
    <div className={styles.homepage}>
      <header className={styles.header}>
        <h1>Welcome to Our Application</h1>
        <p>Explore the features of our platform.</p>
      </header>
      {currentUser ? (
        // Display a welcome message if the user is logged in
        <p>Welcome back! Access your <Link to="/dashboard">Dashboard</Link>.</p>
      ) : (
          //<nav className={styles.navLinks}></nav>
          // Prompt to log in or sign up if the user is not logged in
          <p>Please <Link to="/login">Log In</Link> or <Link to="/signup">Sign Up</Link>.</p>
        
      )}
    </div>
  );
};

export default HomePage;
