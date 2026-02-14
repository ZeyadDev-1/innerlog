import { useEffect, useState } from "react";
import api from "./api/client";
import Login from "./pages/Login";
import MoodForm from "./components/MoodForm";
import MoodTrendChart from "./charts/MoodTrendChart";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [trend, setTrend] = useState([]);

  // Load mood trend data
  async function loadTrend() {
    try {
      const res = await api.get("insights/trend/");
      setTrend(res.data);
    } catch (err) {
      console.error("Failed to load trend:", err);
    }
  }

  // Load data when user logs in
  useEffect(() => {
    if (loggedIn) {
      loadTrend();
    }
  }, [loggedIn]);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  // If not logged in → show login screen
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>InnerLog</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="content">
        <MoodForm onAdd={loadTrend} />
        <MoodTrendChart data={trend} />
      </div>
    </div>
  );
}
