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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [groupDetails, setGroupDetails] = useState({
        name: '',
        description: '',
        privacy: '',
    });

    useEffect(() => {
        const loadGroupDetails = async () => {
            setIsLoading(true);
            try {
                const details = await fetchGroupDetails(groupId, currentUser.token);
                setGroup(details);
                setGroupDetails({
                    name: details.name,
                    description: details.description,
                    privacy: details.privacy,
                });
            } catch (error) {
                setError('Failed to load group details. ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadGroupDetails();
    }, [groupId, currentUser.token]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setGroupDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await updateGroup(groupId, groupDetails, currentUser.token);
            alert('Group updated successfully');
            navigate('/my-groups');
        } catch (error) {
            setError('Failed to update group. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (window.confirm('Are you sure you want to delete this group? This cannot be undone.')) {
            setIsLoading(true);
            try {
                await deleteGroup(groupId, currentUser.token);
                alert('Group deleted successfully');
                navigate('/my-groups');
            } catch (error) {
                setError('Failed to delete group. ' + error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const performMemberAction = async (action, userId) => {
        setIsLoading(true);
        try {
            await action(groupId, userId, currentUser.token);
            const updatedDetails = await fetchGroupDetails(groupId, currentUser.token);
            setGroup(updatedDetails);
            alert('Action performed successfully');
        } catch (error) {
            setError('Failed to perform action on member. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!group) return <div>Group not found.</div>;

    return (
        <div className={styles.groupSettingsPage}>
            <h1>Group Settings - {group.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={groupDetails.name} onChange={handleInputChange} required />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={groupDetails.description} onChange={handleInputChange} required />
                </label>
                <label>
                    Privacy:
                    <select name="privacy" value={groupDetails.privacy} onChange={handleInputChange} required>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </label>
                <button type="submit" className={styles.updateGroupButton} disabled={isLoading}>Update Group</button>
            </form>
            <button onClick={handleDeleteGroup} className={styles.deleteGroupButton} disabled={isLoading}>Delete Group</button>
            <h2>Members</h2>
            {group.members?.map((member) => (
                <div key={member.user._id}>
                    Member Name: {member.user.username} - Role: {member.role}
                    <button onClick={() => performMemberAction(removeMember, member.user._id)} disabled={isLoading}>Remove Member</button>
                    {member.role !== 'admin' && (
                        <button onClick={() => performMemberAction(promoteToAdmin, member.user._id)} disabled={isLoading}>Promote to Admin</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GroupSettingsPage;
