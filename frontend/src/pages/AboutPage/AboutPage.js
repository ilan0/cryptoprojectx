import React from 'react';
import styles from './AboutPage.module.css'; // Assume you'll create a corresponding CSS module

function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <section className={styles.heroSection}>
        <h1>Welcome to GroupInvest</h1>
        <p>Empowering individuals through collaborative investment opportunities.</p>
      </section>

      <section className={styles.missionSection}>
        <h2>Our Mission</h2>
        <p>Our mission transcends mere cryptocurrency investment; it aims to revolutionize the landscape by fostering a global community anchored in security, transparency, and collaboration.</p>
      </section>

      <section className={styles.visionSection}>
        <h2>Our Vision</h2>
        <p>To create an intuitive platform that breaks down the barriers of cryptocurrency investment, making it universally accessible and fostering an environment where users, regardless of their experience level, can contribute to and benefit from the collective wisdom of the community.</p>
      </section>

      <section className={styles.problemSolutionSection}>
        <h2>The Problem & Our Solution</h2>
        <p>The world of investment can be complex and inaccessible for many. GroupInvest demystifies this process, providing a user-centric platform where individuals can join forces, share wisdom, and embark on investment ventures together, securely and transparently.</p>
      </section>

      <section className={styles.ctaSection}>
        <h2>Join Our Community</h2>
        <p>Ready to explore the power of collective investing? Join GroupInvest today and be part of the revolution.</p>
        <button className={styles.joinNowButton}>Join Now</button>
      </section>
    </div>
  );
}

export default AboutPage;
