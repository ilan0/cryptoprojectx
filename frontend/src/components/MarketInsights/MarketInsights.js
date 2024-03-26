// src/components/MarketInsights/MarketInsights.js
import React from 'react';
import styles from './MarketInsights.module.css'; // Import corresponding CSS module

function MarketInsights() {
  // Dummy data for the market insights
  const insightsData = [
    {
      title: "How We Revolutionize the Customer Experience Using Augmented Reality",
      imageUrl: "path_to_image",
      summary: "A brief summary of the article."
    },
    {
      title: "The Future of Marketing: Predictions for the Next 5 Years",
      imageUrl: "path_to_image",
      summary: "A brief summary of the article."
    },
    // Add more insights as needed
  ];

  return (
    <div className={styles.marketInsights}>
      {insightsData.map((insight, index) => (
        <div key={index} className={styles.insightCard}>
          <img src={insight.imageUrl} alt={insight.title} className={styles.insightImage} />
          <h3 className={styles.insightTitle}>{insight.title}</h3>
          <p className={styles.insightSummary}>{insight.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default MarketInsights;
