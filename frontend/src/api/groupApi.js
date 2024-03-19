// src/api/groupApi.js
const API_BASE_URL = 'http://localhost:3001/api';

// Fetch groups the current user is a member of
export const fetchGroups = async (token) => {
  const response = await fetch(`${API_BASE_URL}/groups`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch groups');
  return response.json();
};

// Create a new group
export const createGroup = async (groupDetails, token) => {
  try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(groupDetails),
      });
      if (!response.ok) {
          throw new Error("Failed to create group");
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error in createGroup:", error);
      throw error;
  }
};

// Search for public groups
export const searchPublicGroups = async (query, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/search?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to search for groups: ${errorDetails.message}`);
  }
  return response.json();
};


// Create an investment proposal within a group
export const createInvestmentProposal = async (groupId, proposalDetails, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/investment-proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(proposalDetails),
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to create investment proposal: ${errorDetails.message}`);
  }
  return response.json();
};

// Vote on an investment proposal
export const voteOnInvestmentProposal = async (groupId, proposalId, vote, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/investment-proposals/${proposalId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ vote }),
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to vote on investment proposal: ${errorDetails.message}`);
  }
  return response.json();
};

export const leaveGroup = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/leave/${groupId}`, {
    method: 'POST', // or DELETE, depending on your API design
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to leave group: ${errorDetails.message}`);
  }

  return response.json();
};

export const fetchGroupDetails = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to fetch group details: ${errorDetails.message || response.status}`);
  }
  return response.json();
};

export const fetchInvestmentProposals = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/investment-proposals`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to fetch investment proposals: ${errorDetails.message || response.status}`);
  }
  return response.json();
};
// In groupApi.js
export const updateGroup = async (groupId, groupDetails, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'PUT', // Assuming you're using PUT for updates
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(groupDetails),
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to update group: ${errorDetails.message}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in updateGroup:", error);
    throw error;
  }
};

export const deleteGroup = async (groupId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'DELETE', // Using DELETE method to remove a group
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to delete group: ${errorDetails.message}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in deleteGroup:", error);
    throw error;
  }
};

// Add methods for managing group members
export const removeMember = async (groupId, memberId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/removeMember/${memberId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to remove member: ${errorDetails.message}`);
  }
  return response.json();
};

export const promoteToAdmin = async (groupId, memberId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/promoteToAdmin/${memberId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to promote member to admin: ${errorDetails.message}`);
  }
  return response.json();
};

export const joinGroup = async (groupId, token) => {
  const response = await fetch(`http://localhost:3001/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Could not join the group');
  }

  return response.json(); // Or simply return true if no response body
};