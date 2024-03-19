import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGroupDetails, updateGroup, deleteGroup, removeMember, promoteToAdmin } from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';
import styles from './GroupSettingsPage.module.css';

const GroupSettingsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState({
    name: '',
    description: '',
    privacy: '',
  });

  useEffect(() => {
    const loadGroupDetails = async () => {
      try {
        const details = await fetchGroupDetails(groupId, currentUser.token);
        setGroup(details);
        setGroupDetails({
          name: details.name,
          description: details.description,
          privacy: details.privacy,
        });
      } catch (error) {
        console.error('Failed to load group details', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGroupDetails();
  }, [groupId, currentUser.token]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateGroup(groupId, groupDetails, currentUser.token);
      alert('Group updated successfully');
      navigate('/my-groups');
    } catch (error) {
      console.error('Failed to update group', error);
      alert('Failed to update group');
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group? This cannot be undone.')) {
      try {
        await deleteGroup(groupId, currentUser.token);
        alert('Group deleted successfully');
        navigate('/my-groups');
      } catch (error) {
        console.error('Failed to delete group', error);
        alert('Failed to delete group');
      }
    }
  };

  // Example function to remove a member
  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(groupId, memberId, currentUser.token);
      alert('Member removed successfully');
      // Reload the group details to reflect changes
      const updatedDetails = await fetchGroupDetails(groupId, currentUser.token);
      setGroup(updatedDetails);
    } catch (error) {
      console.error('Failed to remove member', error);
      alert('Failed to remove member');
    }
  };

  // Example function to promote a member to admin
  const handlePromoteToAdmin = async (memberId) => {
    try {
      await promoteToAdmin(groupId, memberId, currentUser.token);
      alert('Member promoted to admin successfully');
      // Reload the group details to reflect changes
      const updatedDetails = await fetchGroupDetails(groupId, currentUser.token);
      setGroup(updatedDetails);
    } catch (error) {
      console.error('Failed to promote member to admin', error);
      alert('Failed to promote member to admin');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!group) return <div>Group not found.</div>;

  return (
    <div className={styles.groupSettingsPage}>
      <h1>Group Settings - {group.name}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={groupDetails.name} onChange={handleInputChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={groupDetails.description} onChange={handleInputChange} />
        </label>
        <label>
          Privacy:
          <select name="privacy" value={groupDetails.privacy} onChange={handleInputChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <button type="submit" className={styles.updateGroupButton}>Update Group</button>
      </form>
      <button onClick={handleDeleteGroup} className={styles.deleteGroupButton}>Delete Group</button>
      {/* Example member management actions */}
      {group.members?.map((member) => (
        <div key={member.userId}>
          Member ID: {member.userId} - Role: {member.role}
          <button onClick={() => handleRemoveMember(member.userId)}>Remove Member</button>
          <button onClick={() => handlePromoteToAdmin(member.userId)}>Promote to Admin</button>
        </div>
      ))}
    </div>
  );
};

export default GroupSettingsPage;
