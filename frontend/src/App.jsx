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

  async function loadTrend() {
    const res = await api.get("insights/trend/");
    setTrend(res.data);
  }

  useEffect(() => {
    if (loggedIn) {
      loadTrend();
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>

      <MoodForm onAdd={loadTrend} />
      <MoodTrendChart data={trend} />
    </div>
  );
}
