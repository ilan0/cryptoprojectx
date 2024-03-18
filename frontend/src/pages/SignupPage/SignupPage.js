import React, { useState } from 'react';
import SignupForm from '../../components/SignupForm';
import { useNavigate, Link } from 'react-router-dom';
import styles from './SignupPage.module.css'; // Ensure this is the updated CSS module
import { registerUser } from '../../api/authApi';

function SignupPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ message: '', isSuccess: false });

  const handleSignup = async (email, username, password) => {
    try {
      const response = await registerUser({ email, username, password });
      if (response.token) {
        setFeedback({ message: 'Signup successful! Forwarding to login page...', isSuccess: true });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setFeedback({ message: 'Signup failed. Please try again.', isSuccess: false });
      }
    } catch (error) {
      setFeedback({ message: error.message, isSuccess: false });
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.container}>
        <h2>Sign Up</h2>
        {feedback.message && (
          <p className={feedback.isSuccess ? styles.successMessage : styles.errorMessage}>
            {feedback.message}
          </p>
        )}
        <SignupForm onSignup={handleSignup} />
        <p className={styles.alreadyUser}>
          Already a user? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
