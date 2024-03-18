import React, { useState } from 'react';
import styles from './CreateGroupForm.module.css'; // Ensure you have CSS styles defined

function CreateGroupForm({ onCreate }) {
  const [groupDetails, setGroupDetails] = useState({
    name: '',
    description: '',
    privacy: 'private', // Default privacy setting
    votingSystem: 'majority', // Default voting system
    investmentThreshold: 100, // Default investment threshold in your chosen currency
    investmentStrategy: '',
    investmentFocus: [], // Array to hold multiple focuses
    isActive: true, // Assume new groups are active by default
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'isActive') {
      // Handle isActive as a special case
      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        [name]: checked,
      }));
    } else if (type === 'checkbox') {
      // Handle checkboxes for investmentFocus
      let updatedFocus;
      if (checked) {
        updatedFocus = [...groupDetails.investmentFocus, value];
      } else {
        updatedFocus = groupDetails.investmentFocus.filter((focus) => focus !== value);
      }
      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        investmentFocus: updatedFocus,
      }));
    } else {
      // Handle other inputs like text, number, and select
      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(groupDetails);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Group Name:
        <input
          type="text"
          name="name"
          value={groupDetails.name}
          required
          onChange={handleChange}
        />
      </label>
      
      <label>
        Description:
        <textarea
          name="description"
          value={groupDetails.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Privacy:
        <select name="privacy" value={groupDetails.privacy} onChange={handleChange}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>

      <label>
        Voting System:
        <select name="votingSystem" value={groupDetails.votingSystem} onChange={handleChange}>
          <option value="majority">Majority</option>
          <option value="unanimous">Unanimous</option>
          <option value="threshold">Threshold</option>
        </select>
      </label>

      <label>
        Investment Threshold ($):
        <input
          type="number"
          name="investmentThreshold"
          value={groupDetails.investmentThreshold}
          min="1"
          onChange={handleChange}
        />
      </label>

      <label>
        Investment Strategy:
        <input
          type="text"
          name="investmentStrategy"
          value={groupDetails.investmentStrategy}
          onChange={handleChange}
        />
      </label>

      <fieldset>
        <legend>Investment Focus:</legend>
        {/* Dynamically generate these based on your application's investment focus options */}
        <label>
          <input
            type="checkbox"
            name="investmentFocus"
            value="cryptocurrency"
            checked={groupDetails.investmentFocus.includes('cryptocurrency')}
            onChange={handleChange}
          />
          Cryptocurrency
        </label>
        <label>
          <input
            type="checkbox"
            name="investmentFocus"
            value="stocks"
            checked={groupDetails.investmentFocus.includes('stocks')}
            onChange={handleChange}
          />
          Stocks
        </label>
        {/* Add more options as needed */}
      </fieldset>

      <label>
        Active Group:
        <input
          type="checkbox"
          name="isActive"
          checked={groupDetails.isActive}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className={styles.submitButton}>Create Group</button>
    </form>
  );
}

export default CreateGroupForm;
