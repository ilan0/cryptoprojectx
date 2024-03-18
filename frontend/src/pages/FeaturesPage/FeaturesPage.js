import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeaturesPage.module.css'; // Assume you will create this CSS module

function FeaturesPage() {
  const navigate = useNavigate();

  const handleJoinNowClick = () => {
    navigate('/signup');
  };
  return (
    <div className={styles.featuresPage}>
      <section className={styles.featureSection}>
        <h1>Platform Features</h1>
        <p>Explore the unique features that set our platform apart.</p>
      </section>

      <section className={styles.individualFeature}>
        <h2>Community-Driven Investment Groups</h2>
        <p>Create or join investment groups to pool resources, share insights, and make informed decisions collectively.</p>
      </section>

      <section className={styles.individualFeature}>
        <h2>Seamless Wallet Integration</h2>
        <p>Easily connect your cryptocurrency wallets for a streamlined investment process, supporting a wide range of cryptocurrencies.</p>
      </section>

      <section className={styles.individualFeature}>
        <h2>Dynamic Voting System</h2>
        <p>Empower your investment group with democratic decision-making tools to vote on investment opportunities.</p>
      </section>

      <section className={styles.individualFeature}>
        <h2>Real-Time Market Insights</h2>
        <p>Stay informed with live market data, analytics, and community insights to make data-driven investment choices.</p>
      </section>

      <section className={styles.individualFeature}>
        <h2>Enhanced Security and Transparency</h2>
        <p>Our platform ensures the highest security standards and transparent operations to protect your investments and information.</p>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to Elevate Your Investment Strategy?</h2>
        <p>Join our community today and start leveraging collective wisdom for better investment outcomes.</p>
        <button className={styles.joinNowButton} onClick={handleJoinNowClick}>Join Now</button>
      </section>
    </div>
  );
}

export default FeaturesPage;
