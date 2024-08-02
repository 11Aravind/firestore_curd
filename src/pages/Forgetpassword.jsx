import { Link } from "react-router-dom"
import { useState } from "react";
import { auth } from '../firebaseConfig'; 
import { sendPasswordResetEmail } from "firebase/auth";
const Forgetpassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleForgetPassword = async () => {
        try {
            
            await sendPasswordResetEmail(auth, email)

            setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            let errorMessage;
            switch (error.code) {
              case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
              case 'auth/user-not-found':
                errorMessage = 'No user found with this email address.';
                break;
              default:
                errorMessage = 'Error sending password reset email.';
            }
        }

}
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
