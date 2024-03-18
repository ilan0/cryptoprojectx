// src/components/NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './NavigationBar.module.css'; // Import the CSS module
function NavigationBar() {
    const { currentUser, logout } = useAuth();
  
    return (
      <nav className={styles.navBar}>
        <Link to="/" className={styles.logo}>YourLogo</Link>
        <ul className={styles.navList}>
          {currentUser ? (
            <>
              <li className={styles.navItem}><Link to="/dashboard">Dashboard</Link></li>
              <li className={styles.navItem}><Link to="/my-groups">My Groups</Link></li>
              <li className={styles.navItem}><Link to="/create-group">Create Group</Link></li>
              <li className={styles.navItem}><Link to="/profile">Profile</Link></li>
              <li className={styles.navItem}><button onClick={logout} className={styles.logoutButton}>Logout</button></li>
            </>
          ) : (
            <>
              <li className={styles.navItem}><Link to="/about">About</Link></li>
              <li className={styles.navItem}><Link to="/features">Features</Link></li>
              <li className={styles.navItem}><Link to="/login">Login</Link></li>
              <li className={styles.navItem}><Link to="/signup" className={styles.signUpButton}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    );
  }
  
  export default NavigationBar;