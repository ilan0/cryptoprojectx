import React, { useState } from 'react';
import { searchPublicGroups, joinGroup } from '../../../api/groupApi';
import { useAuth } from '../../../context/AuthContext';
import styles from './GroupSearchDialog.module.css'; // Ensure the CSS module is properly linked

function GroupSearchDialog({ onClose }) {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState(''); // State to hold messages

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId, currentUser.token);
      alert('Joined the group successfully'); // Or use a more sophisticated notification system
      onClose(); // Close the dialog and optionally refresh the group list
    } catch (error) {
      console.error('Error joining the group:', error);
      alert(error.message || 'Failed to join the group');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchPublicGroups(searchQuery, currentUser.token);
      // Assuming the API now returns an object with a message and groups array
      setSearchMessage(response.message);
      setSearchResults(response.groups || []); // Use the groups array if present, otherwise default to an empty array
    } catch (error) {
      console.error('Error searching for groups:', error);
      setSearchMessage(error.message || 'Failed to search for groups'); // Display the error message
      setSearchResults([]); // Clear previous results
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <input
          type="text"
          placeholder="Search public groups"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>Search</button>
        {searchMessage && <p className={styles.message}>{searchMessage}</p>} 
        <ul className={styles.resultsList}>
        {searchResults.map(group => (
          <li key={group._id} className={styles.resultItem}>
            {group.name}
            <button onClick={() => handleJoinGroup(group._id)}>Join Group</button>
          </li>
        ))}
      </ul>
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
}

export default GroupSearchDialog;
