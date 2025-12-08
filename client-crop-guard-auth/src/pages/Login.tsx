import React from "react";
import "./Login.css";
import Background from "../assets/Background_1.jpg";
import CropIcon from "../assets/Logo.png";
import GoogleIcon from "../assets/googleicon.png";

import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// User interface
interface User {
  displayName: string;
  photoURL: string;
}

// Props for Login
interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.displayName && user.photoURL) {
        setUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });

        // Navigate to dashboard after login
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="login-card">
        <div className="icon-container">
          <img src={CropIcon} alt="Crop Guard AI Icon" className="crop-icon" />
        </div>

        <div className="login-content">
          <h2>Welcome to Crop Guard AI</h2>
          <p>Login with your Google account to monitor crop health</p>

          <button className="google-login-btn" onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt="Google logo" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
