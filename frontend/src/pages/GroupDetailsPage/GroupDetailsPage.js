import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchGroupDetails, leaveGroup, inviteUserToGroup } from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';
import styles from './GroupDetailsPage.module.css';

function GroupDetailsPage() 
{
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [emailToInvite, setEmailToInvite] = useState('');

    useEffect(() => {
        const loadGroupDetails = async () => {
            try {
                const details = await fetchGroupDetails(groupId, currentUser.token);
                setGroup(details);
            } catch (err) {
                setError('Failed to load group details');
                console.error('Error loading group details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadGroupDetails();
    }, [groupId, currentUser.token]);

    // Adjusted to check for admin role within the members array
    const isAdmin = group?.members?.some(member => member.user._id === currentUser._id && member.role === 'admin');

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        try {
            await inviteUserToGroup(groupId, emailToInvite, currentUser.token);
            alert('Invitation sent successfully');
            setEmailToInvite('');
        } catch (err) {
            console.error('Failed to send invitation:', err);
            alert('Failed to send invitation');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.groupDetails}>
            <header className={styles.groupHeader}>
                <h1>{group?.name}</h1>
                {isAdmin && (
                    <>
                    <Link to={`/groups/${groupId}/settings`} className={styles.settingsButton}>
                        Edit Settings
                    </Link>
                    </>
                )}
                <form onSubmit={handleInviteSubmit} className={styles.inviteForm}>
                    <input
                        type="email"
                        value={emailToInvite}
                        onChange={(e) => setEmailToInvite(e.target.value)}
                        placeholder="Invite user by email"
                        required
                    />
                    <button type="submit">Invite</button>
                </form>
                    
            </header>
            <p>Description: {group?.description}</p>
            <p>Privacy: {group?.privacy}</p>

            <section>
                <h2>Members</h2>
                <ul>
                    {group?.members.map((member, index) => (
                        // Adjusted to display username correctly from populated user document
                        <li key={index}>{member.user.username}</li>
                    ))}
                </ul>
            </section>

            <button onClick={() => leaveGroup(groupId, currentUser.token).then(() => navigate('/my-groups'))} className={styles.leaveGroupButton}>
                Leave Group
            </button>
        </div>
    );
}

export default GroupDetailsPage;
