// src/components/CreateGroupForm/CreateGroupForm.js
import React, { useState } from 'react';
import styles from './CreateGroupForm.module.css'; // Assume you have CSS styles defined

function CreateGroupForm({ onCreate }) {
  const [groupDetails, setGroupDetails] = useState({
    name: '', // Corrected from 'title' to 'name' to match your Group model
    description: '',
    isPublic: true, // Correct, matches your Group model
    investmentGoals: '', // Matches your Group model
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGroupDetails(prevDetails => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(groupDetails);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Name: {/* Updated from Title to Name for clarity */}
        <input
          type="text"
          name="name" // Corrected to match the state and your Group model
          value={groupDetails.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={groupDetails.description}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Public Group:
        <input
          type="checkbox"
          name="isPublic"
          checked={groupDetails.isPublic}
          onChange={handleChange}
        />
      </label>
      <label>
        Investment Goals:
        <input
          type="text"
          name="investmentGoals"
          value={groupDetails.investmentGoals}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Create Group</button>
    </form>
  );
}

export default CreateGroupForm;
