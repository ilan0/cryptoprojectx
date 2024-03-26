// src/pages/MyGroupsPage/MyGroupsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGroups } from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';
import GroupSearchDialog from '../../components/groups/GroupSearchDialog/GroupSearchDialog';
import styles from './MyGroupsPage.module.css';

function MyGroupsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const loadMyGroups = async () => {
    setIsLoading(true);
    try {
      const myGroups = await fetchGroups(currentUser.token);
      setGroups(myGroups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.token) {
      loadMyGroups();
    }
  }, [currentUser.token]);

  const handleViewGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleOpenSearchDialog = () => {
    setShowSearchDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setShowSearchDialog(false);
    loadMyGroups(); // Re-fetch groups after closing the search dialog
  };

  // Navigate to create group page
  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.myGroupsPage}>
      <h1>My Groups</h1>
      <div className={styles.actionButtons}>
        <button onClick={handleOpenSearchDialog} className={styles.addButton}>Add Group</button>
        <button onClick={handleCreateGroup} className={styles.createGroupButton}>Create Group</button>
      </div>
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
