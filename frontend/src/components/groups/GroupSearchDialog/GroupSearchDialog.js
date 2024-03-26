import React, { useState } from 'react';
import { searchGroups, joinGroup, requestToJoinGroup } from '../../../api/groupApi'; // Adjust API imports as needed
import { useAuth } from '../../../context/AuthContext';
import styles from './GroupSearchDialog.module.css';

function GroupSearchDialog({ onClose }) {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');

  const handleJoinOrRequest = async (group) => {
    try {
      if (group.privacy === 'public') {
        await joinGroup(group._id, currentUser.token);
        alert('Joined the group successfully');
      } else {
        await requestToJoinGroup(group._id, currentUser.token);
        alert('Join request sent successfully');
      }
      onClose(); // Close the dialog and refresh the group list as needed
    } catch (error) {
      console.error('Error processing group action:', error);
      alert(error.message || 'Failed to process your request');
    }
  };

  const handleSearch = async () => {
    try {
      // Assuming searchGroups can search for all groups without privacy filter
      const response = await searchGroups(searchQuery, currentUser.token);
      setSearchMessage(response.message);
      setSearchResults(response.groups || []);
    } catch (error) {
      console.error('Error searching for groups:', error);
      setSearchMessage(error.message || 'Failed to search for groups');
      setSearchResults([]);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <input
          type="text"
          placeholder="Search for groups"
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
              <button onClick={() => handleJoinOrRequest(group)}>
                {group.privacy === 'public' ? 'Join Group' : 'Request to Join'}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
}

export default GroupSearchDialog;
