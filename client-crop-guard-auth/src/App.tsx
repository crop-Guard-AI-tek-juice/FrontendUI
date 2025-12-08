import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";

interface User {
  displayName: string;
  photoURL: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Routes>
      <Route
        path="/"
        element={<Login setUser={setUser} />}
      />
      <Route
        path="/dashboard"
        element={
          user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />
        }
      />
    </Routes>
  );
}

export default App;
