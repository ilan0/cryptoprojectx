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
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null); // For managing authentication errors

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      fetchUserInfo(userToken).then((userInfo) => {
        if (userInfo) {
          setCurrentUser({ token: userToken, ...userInfo });
        } else {
          // Clear token if userInfo fetch is unsuccessful
          localStorage.removeItem('token');
        }
        setIsLoading(false);
      }).catch((error) => {
        console.error('Authentication error:', error);
        setAuthError(error.message);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (userToken) => {
    try {
      const userInfo = await fetchUserInfo(userToken);
      if (userInfo) {
        localStorage.setItem('token', userToken);
        setCurrentUser({ token: userToken, ...userInfo });
        setAuthError(null);
      } else {
        throw new Error('Login failed: Unable to fetch user info');
      }
    } catch (error) {
      setAuthError(error.message);
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setAuthError(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};