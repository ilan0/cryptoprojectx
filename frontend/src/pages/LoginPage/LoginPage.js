import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as necessary
import LoginForm from '../../components/LoginForm';
import { loginUser } from '../../api/authApi';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser({
        email,
        password,
      });
  
      if (response.token) {
        login(response.token);
        setFeedbackMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setFeedbackMessage('Failed to login. Please check your credentials.');
      }
    } catch (error) {
      setFeedbackMessage(error.message);
    }
  };

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <h2>Login</h2>
        {feedbackMessage && (
          <p className={feedbackMessage.includes('successful') ? styles.successMessage : styles.errorMessage}>
            {feedbackMessage}
          </p>
        )}
        <LoginForm onLogin={handleLogin} />
        <p className={styles.newUserPrompt}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;