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
  const response = await fetch(`${API_BASE_URL}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(groupDetails),
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to create group: ${errorDetails.message || response.status}`);
  }
  return response.json();
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

// Join a group
export const joinGroup = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Failed to join group: ${errorDetails.message}`);
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
