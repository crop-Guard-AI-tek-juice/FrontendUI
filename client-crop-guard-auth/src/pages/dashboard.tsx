import React from "react";
import "./dashboard.css";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface User {
  displayName: string;
  photoURL: string;
}

interface DashboardProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear user state
      setUser(null);

      // Navigate back to login
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const crops = [
    { name: "Cassava", img: "https://unsplash.com/photos/pile-of-raw-cassava-roots-0_GtcvY4Mj4" },
    { name: "Millet", img: "https://images.unsplash.com/photo-1602526216437-31e1d39fe284" },
    { name: "Passion Fruit", img: "https://images.unsplash.com/photo-1504114133367-631ecd3db3ca" },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="welcome-text">Welcome, {user.displayName}</h2>
        <img src={user.photoURL} alt="Profile" className="profile-pic" />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="crop-grid">
        {crops.map((crop) => (
          <div key={crop.name} className="crop-card">
            <img src={crop.img} alt={crop.name} className="crop-img" />
            <h3>{crop.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
