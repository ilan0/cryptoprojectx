// src/api/authApi.js
export const registerUser = async (details) => {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });
  
    if (!response.ok) {
      throw new Error('Signup failed');
    }
  
    return await response.json();
  };
  


export const loginUser = async (credentials) => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    return await response.json();
  };
  