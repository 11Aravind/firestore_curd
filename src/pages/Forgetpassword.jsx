import { Link, useNavigate } from "react-router-dom"
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
const Forgetpassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()
    const handleForgetPassword = async () => {  
        try {
          // Attempt to send a password reset email
          await sendPasswordResetEmail(auth, email);
          alert('Password reset email sent! Check your inbox.');
          navigate('/login');
        } catch (error) {
          // Handle Firebase errors
          if (error.code === 'auth/invalid-email') {
            alert('Invalid email address.');
          } else if (error.code === 'auth/user-not-found') {
            alert('No user found with this email address.');
          } else {
            alert('Error sending password reset email.');
          }
        }
      };
    
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Forget Password</h2>
                {/* <form onSubmit={handleLogin}> */}
                <div className="input-container">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email</label>
                </div>
                <button type="submit" className="login-button" onClick={handleForgetPassword}>Confirm</button>
                {/* {error && <p className="error-message">{error}</p>} */}
                <div className="forgot-password">
                    <Link to="/login">Go back?</Link>
                </div>

                {/* </form> */}
            </div>
        </div>
    )
}

export default Forgetpassword
