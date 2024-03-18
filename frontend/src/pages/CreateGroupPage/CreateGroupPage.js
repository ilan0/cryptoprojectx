// src/pages/CreateGroupPage/CreateGroupPage.js
import React from 'react';
import CreateGroupForm from '../../components/CreateGroupForm/CreateGroupForm';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/groupApi'; // Import the API call
import { useAuth } from '../../context/AuthContext'; // Import if you need the current user's token

function CreateGroupPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Use the auth context to access the current user's token

  const handleCreateGroup = async (groupDetails) => {
    try {
      // Assuming createGroup API function needs the group details and the user's token
      await createGroup(groupDetails, currentUser.token);
      navigate('/dashboard'); // Redirect the user to the dashboard after successful group creation
    } catch (error) {
      console.error('Failed to create group:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div>
      <h1>Create a New Investment Group</h1>
      <CreateGroupForm onCreate={handleCreateGroup} />
    </div>
  );
}

export default CreateGroupPage;
