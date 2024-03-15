import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as necessary
import LoginForm from '../../components/LoginForm';
import styles from './LoginPage.module.css';

async function loginUser(credentials) {
  return fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  });
} 

function LoginPage() {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { currentUser, login } = useAuth(); // Use the login function from AuthContext
  const navigate = useNavigate(); // For redirecting after successful login

  useEffect(() => {
    // Redirect users to the dashboard if they are already logged in
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]); // Depend on currentUser and navigate

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser({
        email,
        password,
      });
  
      if (response.token) {
        login(response.token); // Use AuthContext's login to set the token globally
        setFeedbackMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000); // Redirect after a short delay to show the message
      } else {
        setFeedbackMessage('Failed to login. Please check your credentials.');
      }
    } catch (error) {
      setFeedbackMessage(error.message);
    }
  };

  // Automatically clear feedback message after a delay if needed
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <div className={styles.loginPage}>
      <h2>Login</h2>
      {feedbackMessage && (
        <p className={feedbackMessage.includes('successful') ? styles.successMessage : styles.errorMessage}>
          {feedbackMessage}
        </p>
      )}
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
