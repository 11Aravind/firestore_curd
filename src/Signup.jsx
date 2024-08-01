import './Login.css'; // Import the CSS file for styling
import { useState } from 'react';
import { auth } from './firebaseConfig'; // Import the auth object from firebaseConfig

import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getFirestore, query, where, getDocs } from 'firebase/firestore';

const Signup = () => {
    const db = getFirestore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            createUserWithEmailAndPassword(auth,email,password)
            .then(res=>{
                alert("user created successfuly")
                navigate("/login");
            })
            .catch(err=>{ 
                alert("insertion failed");
                console.log(err)
            })
            }catch(err){
                console.log(`hya huva ${err}`);
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
                    <a href="#">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default Signup;
