import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupDetails, joinGroup, createInvestmentProposal, voteOnInvestmentProposal } from '../../api/groupApi'; // Make sure to implement these API calls
import { useAuth } from '../../context/AuthContext';
import InvestmentProposalForm from './InvestmentProposalForm'; // Assume you have this component for creating proposals

function GroupDetails() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false); // To toggle the proposal form display

  useEffect(() => {
    const loadGroupDetails = async () => {
      try {
        const data = await fetchGroupDetails(groupId, currentUser.token);
        setGroup(data); // Adjust depending on your API response
      } catch (err) {
        setError('Failed to fetch group details. Please try again later.');
        console.error(err);
      }
    };

    loadGroupDetails();
  }, [groupId, currentUser.token]);

  const handleJoinGroup = async () => {
    try {
      await joinGroup(groupId, currentUser.token);
      // Refresh the group details to reflect the new membership
      const updatedGroup = await fetchGroupDetails(groupId, currentUser.token);
      setGroup(updatedGroup);
      setError('');
    } catch (err) {
      setError('Failed to join the group. Please try again later.');
      console.error(err);
    }
  };

  // Placeholder for handling proposal creation - implement as needed
  const handleCreateProposal = async (proposalDetails) => {
    try {
      await createInvestmentProposal(groupId, proposalDetails, currentUser.token);
      // Refresh group details to show the new proposal
      const updatedGroup = await fetchGroupDetails(groupId, currentUser.token);
      setGroup(updatedGroup);
      setShowProposalForm(false); // Hide the form after successful creation
    } catch (err) {
      console.error('Failed to create investment proposal:', err);
      setError('Failed to create investment proposal. Please try again.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!group) {
    return <p>Loading group details...</p>;
  }

  return (
    <div>
      <h2>{group.name}</h2>
      <p>{group.description}</p>
      {/* Display additional group details and investment proposals */}
      <button onClick={handleJoinGroup}>Join Group</button>
      {group.members.some(member => member.userId === currentUser._id) && (
        <>
          <button onClick={() => setShowProposalForm(!showProposalForm)}>
            {showProposalForm ? 'Cancel' : 'Create Investment Proposal'}
          </button>
          {showProposalForm && <InvestmentProposalForm onCreate={handleCreateProposal} />}
        </>
      )}
      {/* Display investment proposals and voting options */}
    </div>
  );
}

export default GroupDetails;
