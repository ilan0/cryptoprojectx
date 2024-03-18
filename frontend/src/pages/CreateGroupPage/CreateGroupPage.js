import React, { useState } from 'react';
import CreateGroupForm from '../../components/groups/CreateGroupForm/CreateGroupForm';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/groupApi'; // Import the API call
import { useAuth } from '../../context/AuthContext'; // Import if you need the current user's token
import styles from './CreateGroupPage.module.css'; // Assuming you have CSS for this page

function CreateGroupPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Use the auth context to access the current user's token
  const [error, setError] = useState(''); // State to handle any error messages

  const handleCreateGroup = async (groupDetails) => {
    try {
      // Assuming createGroup API function needs the group details and the user's token
      await createGroup(groupDetails, currentUser.token);
      navigate('/dashboard'); // Redirect the user to the dashboard after successful group creation
    } catch (error) {
      console.error('Failed to create group:', error);
      setError(error.message || "An error occurred while trying to create the group."); // Set the error message to display to the user
    }
  };

  return (
    <div className={styles.createGroupPage}>
      <h1>Create a New Investment Group</h1>
      {error && <p className={styles.errorMsg}>{error}</p>} {/* Display any error messages */}
      <CreateGroupForm onCreate={handleCreateGroup} />
    </div>
  );
}

export default CreateGroupPage;
