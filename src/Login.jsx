// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import the auth object from firebaseConfig
import './Login.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const a = await signInWithEmailAndPassword(auth, email, password);
      console.log(a);
      alert("logined")
      navigate("/curd")
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error-message">{error}</p>}
          <div className="forgot-password">
            <Link to="/signup">create account?</Link>
          </div>
          <div className="forgot-password">
            <Link to="/forgetpassword">forget password ?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
