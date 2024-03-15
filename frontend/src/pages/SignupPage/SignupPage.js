
import React, { useState } from 'react';
import SignupForm from '../../components/SignupForm';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

async function registerUser(details) {
    return fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      return response.json();
    });
  }
  
  function SignupPage() {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', isSuccess: false });
  
    const handleSignup = async (email, username, password) => {
      try {
        const response = await registerUser({ email, username, password });
        if (response.token) {
          // Assume successful signup if there's a token
          setFeedback({ message: 'Signup successful! Forwarding to login page...', isSuccess: true });
          // Set a delay before redirecting to the login page
        setTimeout(() => {
            navigate('/login');
          }, 3000); // Delay of 3000 milliseconds (3 seconds)
          // Include auto-redirect or form reset logic here (See Step 2)
        } else {
          setFeedback({ message: 'Signup failed. Please try again.', isSuccess: false });
        }
      } catch (error) {
        setFeedback({ message: error.message, isSuccess: false });
      }
    };
  
    return (
      <div>
        <h2>Sign Up</h2>
        {feedback.message && (
          <p className={feedback.isSuccess ? styles.successMessage : styles.errorMessage}>
            {feedback.message}
          </p>
        )}
        <SignupForm onSignup={handleSignup} />
      </div>
    );
  }
  
  export default SignupPage;