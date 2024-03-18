import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { fetchGroups } from '../../api/groupApi';
import { useAuth } from '../../context/AuthContext';

function GroupList() {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      try {
        // Assuming fetchGroups now directly returns the list of groups
        const groups = await fetchGroups(currentUser.token);
        setGroups(groups || []);
      } catch (err) {
        setError('Failed to fetch groups. Please try again later.');
        console.error(err);
      }
    };

    if (currentUser.token) {
      loadGroups();
    }
  }, [currentUser.token]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Your Investment Groups</h2>
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group._id}>
              <Link to={`/groups/${group._id}`}>{group.name}</Link> - {group.description}
              {/* Additional details and actions can be added here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not part of any groups yet.</p>
      )}
    </div>
  );
}

export default GroupList;
