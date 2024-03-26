import React, { useEffect, useState } from 'react';
import {
  fetchMyInvitations,
  acceptInvitation,
  rejectInvitation
} from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';

function NotificationsPage() {
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const myInvitations = await fetchMyInvitations(currentUser.token);
        setInvitations(myInvitations);
      } catch (error) {
        console.error('Failed to fetch invitations:', error);
      }
    };

    loadInvitations();
  }, [currentUser.token]);

  const handleAcceptInvitation = async (groupId) => {
    try {
      await acceptInvitation(groupId, currentUser.token);
      // Reload invitations to reflect the change
      const updatedInvitations = await fetchMyInvitations(currentUser.token);
      setInvitations(updatedInvitations);
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleRejectInvitation = async (groupId) => {
    try {
      await rejectInvitation(groupId, currentUser.token);
      // Reload invitations to reflect the change
      const updatedInvitations = await fetchMyInvitations(currentUser.token);
      setInvitations(updatedInvitations);
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
  };

  return (
    <div>
      <h1>Invitations</h1>
      {invitations.length > 0 ? (
        invitations.map((invite) => (
          <div key={invite.groupId}>
            <p>{invite.groupName}</p>
            <button onClick={() => handleAcceptInvitation(invite.groupId)}>Accept</button>
            <button onClick={() => handleRejectInvitation(invite.groupId)}>Reject</button>
          </div>
        ))
      ) : (
        <p>No invitations.</p>
      )}
    </div>
  );
}

export default NotificationsPage;
