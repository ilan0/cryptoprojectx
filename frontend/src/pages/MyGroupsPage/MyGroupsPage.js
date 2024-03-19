// src/pages/MyGroupsPage/MyGroupsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGroups } from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';
import GroupSearchDialog from '../../components/groups/GroupSearchDialog/GroupSearchDialog'; // Update the import path as necessary
import styles from './MyGroupsPage.module.css'; // Create and import your CSS module

function MyGroupsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const loadMyGroups = async () => {
    setIsLoading(true);
    try {
        const myGroups = await fetchGroups(currentUser.token); // Fetch groups with the current user's token
        setGroups(myGroups); // Assuming the API returns an array of groups
    } catch (error) {
        console.error('Failed to fetch groups:', error);
        // Optionally, handle the error by showing a message to the user
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (currentUser.token) {
        loadMyGroups(); // Call the function to load groups
    }
}, [currentUser.token]); // This will re-run when currentUser.token changes


  const handleViewGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleOpenSearchDialog = () => {
    setShowSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setShowSearchDialog(false);
    // Reload groups in case a new group was joined
    loadMyGroups();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.myGroupsPage}>
      <h1>My Groups</h1>
      <button onClick={handleOpenSearchDialog} className={styles.addButton}>Add Group</button>
      {showSearchDialog && <GroupSearchDialog onClose={handleCloseSearchDialog} />}
      {groups.length > 0 ? (
        <ul className={styles.groupList}>
          {groups.map(group => (
            <li key={group._id} className={styles.groupItem}>
              <h2>{group.name}</h2>
              <p>{group.description}</p>
              <button onClick={() => handleViewGroup(group._id)}>View Group</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not part of any groups yet. Start by joining or creating one!</p>
      )}
    </div>
  );
}

export default MyGroupsPage;
