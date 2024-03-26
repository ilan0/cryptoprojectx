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

export const searchGroups = async (searchTerm, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/search?query=${encodeURIComponent(searchTerm)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to search for groups');
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

export const fetchMyInvitations = async (token) => {
  const response = await fetch('http://localhost:3001/api/groups/invitations', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Could not fetch invitations.');
  }
  return response.json();
};


export const inviteUserToGroup = async (groupId, userEmail, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/invite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail }), // Send the email as JSON
  });
  if (!response.ok) {
    throw new Error('Failed to send invitation');
  }
  return response.json();
};

export const requestToJoinGroup = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/request-join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // No need to send a body for a join request, unless your backend expects more data
  });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Failed to request to join the group');
  }
  return response.json(); // Or handle the response based on your backend's implementation
};
// Accept an invitation
export const acceptInvitation = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/invitations/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    // No need to send body since the backend should infer the user from the token
  });
  if (!response.ok) throw new Error('Failed to accept invitation');
  return response.json();
};

// Reject an invitation
export const rejectInvitation = async (groupId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/invitations/reject`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    // No need to send body since the backend should infer the user from the token
  });
  if (!response.ok) throw new Error('Failed to reject invitation');
  return response.json();
};


// Accept a join request
export const acceptJoinRequest = async (groupId, requestId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join-requests/${requestId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to accept join request');
  return response.json();
};

// Reject a join request
export const rejectJoinRequest = async (groupId, requestId, token) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join-requests/${requestId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to reject join request');
  return response.json();
};
