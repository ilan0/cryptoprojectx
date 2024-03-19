import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GroupItem.module.css'; // Make sure to create this CSS module

const GroupItem = ({ group }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate(`/groups/${group._id}/settings`);
  };

  return (
    <li className={styles.groupItem}>
      <div onClick={() => navigate(`/groups/${group._id}`)} className={styles.groupInfo}>
        <h3>{group.name}</h3>
        <p>{group.description}</p>
      </div>
      <button onClick={handleSettingsClick} className={styles.settingsButton}>
        Settings
      </button>
    </li>
  );
};

export default GroupItem;
