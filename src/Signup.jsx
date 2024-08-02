import './Login.css'; // Import the CSS file for styling
import { useState } from 'react';
import { auth } from './firebaseConfig'; // Import the auth object from firebaseConfig
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
          // Check if the user already exists
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          if (signInMethods.length > 0) {
            alert('User already exists');
          } else {
            // Create a new user if the email is not in use
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User created successfully');
            navigate('/login');
          }
        } catch (error) {
          // Handle errors
          if (error.code === 'auth/email-already-in-use') {
            alert('The email address is already exist. please login');
          } else if (error.code === 'auth/weak-password') {
            alert('Password should be at least 6 characters.');
          } else {
            alert('An error occurred. Please try again.');
            console.error('Error during signup:', error);
          }
        }
      };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Signup</h2>
                <div className="input-container">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email</label>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>
                <button type="submit" onClick={handleSignup} className="login-button">Signup</button>
                {error && <p className="error-message">{error}</p>}
                <div className="forgot-password">
                    <Link to="/login">Already have and account?</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
