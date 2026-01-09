import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import CassavaPage  from "./pages/CassavaPage";

interface User {
  displayName: string;
  photoURL: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser} />}
      />
      <Route
        path="/dashboard"
        element={
          user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />
        }
      />
      <Route path="/cassava" element={<CassavaPage />} />
    </Routes>
  );
}

export default App;
