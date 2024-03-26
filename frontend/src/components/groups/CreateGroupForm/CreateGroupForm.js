import React, { useState } from 'react';
import styles from './CreateGroupForm.module.css'; // Ensure you have CSS styles defined

function CreateGroupForm({ onCreate }) {
  const [groupDetails, setGroupDetails] = useState({
    name: '',
    description: '',
    privacy: 'public', // Default to 'public' to align with the group schema default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle inputs like text and select
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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

      <button type="submit" className={styles.submitButton}>Create Group</button>
    </form>
  );
}

export default CreateGroupForm;
