import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Define fetchUserInfo outside of the AuthProvider to avoid re-definitions
const fetchUserInfo = async (token) => {
  try {
    const response = await fetch('http://localhost:3001/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null; // Return null or an appropriate default value on failure
  }
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
  
    useEffect(() => {
      const userToken = localStorage.getItem('token');
      if (userToken) {
        fetchUserInfo(userToken).then((userInfo) => {
          if (userInfo) {
            setCurrentUser({ token: userToken, ...userInfo });
          }
          setIsLoading(false); // Set loading to false after verification
        });
      } else {
        setIsLoading(false); // No token found, also set loading to false
      }
    }, []);

  const login = async (userToken) => {
    const userInfo = await fetchUserInfo(userToken);
    if (userInfo) {
      localStorage.setItem('token', userToken);
      setCurrentUser({ token: userToken, ...userInfo });
    } else {
      // Handle login failure (e.g., by setting an error state, though not shown here)
      console.error('Login failed: Unable to fetch user info');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>} 
    </AuthContext.Provider>
  );
};