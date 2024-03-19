import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchGroupDetails, leaveGroup } from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';
import styles from './GroupDetailsPage.module.css'; // Ensure styles are correctly set up

function GroupDetailsPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadGroupDetails = async () => {
            try {
                const details = await fetchGroupDetails(groupId, currentUser.token);
                console.log('Group Details:', details); // Debug: Log fetched group details
                setGroup(details);
            } catch (err) {
                setError('Failed to load group details');
                console.error('Error loading group details:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadGroupDetails();
    }, [groupId, currentUser.token, currentUser.id]); // Include currentUser.id if using it in useEffect

    // Admin check: Adjust based on received data structure
    const isAdmin = group?.admins?.some(admin => admin._id.toString() === currentUser._id);

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
                    <Link to={`/groups/${groupId}/settings`} className={styles.settingsButton}>
                        Edit Settings
                    </Link>
                )}
            </header>
            <p>Description: {group?.description}</p>
            <p>Privacy: {group?.privacy}</p>

            <section>
                <h2>Members</h2>
                <ul>
                    {group?.members.map((member, index) => (
                        // Assuming the member object includes user details. Adjust according to your data structure.
                        <li key={index}>{member.userId.username || 'Member ID: ' + member.userId}</li>
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
