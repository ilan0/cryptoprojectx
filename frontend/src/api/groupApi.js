// src/api/groupApi.js
const API_BASE_URL = 'http://localhost:3001/api';

export const fetchGroups = async (token) => {
  const response = await fetch(`${API_BASE_URL}/groups`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch groups');
  return response.json();
};

export const createGroup = async (groupDetails, token) => {
    const response = await fetch('http://localhost:3001/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Ensure the token is being sent correctly
      },
      body: JSON.stringify(groupDetails), // Ensure the body is correctly structured
    });
  
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to create group: ${errorDetails.error || response.status}`);
    }
  
    return response.json();
  };
  

  export const searchPublicGroups = async (query, token) => {
    const response = await fetch(`http://localhost:3001/api/groups/search?query=${encodeURIComponent(query)}`, {
      method: 'GET', // Ensure method is GET for searching
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to search groups');
    }
    return await response.json();
  };

export const joinGroup = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to join group');
  return response.json();
};
