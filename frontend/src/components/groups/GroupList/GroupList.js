import React, { useEffect, useState } from 'react';
import { fetchGroups } from '../../../api/groupApi';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

function GroupList() {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupsData = await fetchGroups(currentUser.token);
        setGroups(groupsData || []);
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

      {/* Test Button Below */}
      
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group._id}>
              <Link to={`/groups/${group._id}`}>{group.name}</Link> - {group.description}
              {/* Your existing logic to conditionally render settings link */}
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