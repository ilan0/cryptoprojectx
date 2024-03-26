// src/components/PortfolioSummary/PortfolioSummary.js
import React from 'react';
import styles from './PortfolioSummary.module.css'; // Import corresponding CSS module

function PortfolioSummary() {
  // Dummy data for the portfolio summary
  const portfolioData = {
    totalRevenue: 122000.05,
    investments: [
      {
        currency: "Bitcoin",
        budget: 200,
        income: 1000
      },
      // ... other investments
    ]
  };

  return (
    <div className={styles.portfolioSummary}>
      <h2>Total Revenue: ${portfolioData.totalRevenue.toFixed(2)}</h2>
      {/* Displaying the investments */}
      {portfolioData.investments.map((investment, index) => (
        <div key={index} className={styles.investmentCard}>
          <div>Currency: {investment.currency}</div>
          <div>Budget: ${investment.budget}</div>
          <div>Income: ${investment.income}</div>
        </div>
      ))}
    </div>
  );
}

export default PortfolioSummary;
