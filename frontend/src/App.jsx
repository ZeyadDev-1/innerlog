import { useEffect, useState } from "react";
import api from "./api/client";
import Login from "./pages/Login";
import MoodForm from "./components/MoodForm";
import MoodTrendChart from "./charts/MoodTrendChart";
import WeeklyAverageChart from "./charts/WeeklyAverageChart";
import MoodDistributionChart from "./charts/MoodDistributionChart";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [trend, setTrend] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [distribution, setDistribution] = useState([]);

  async function loadTrend() {
    try {
      const res = await api.get("insights/trend/");
      setTrend(res.data);
    } catch (err) {
      console.error("Failed to load trend:", err);
    }
  }

  async function loadWeekly() {
    try {
      const res = await api.get("insights/weekly-average/");
      setWeekly(res.data);
    } catch (err) {
      console.error("Failed to load weekly data:", err);
    }
  }

  async function loadDistribution() {
    try {
      const res = await api.get("insights/distribution/");
      setDistribution(res.data);
    } catch (err) {
      console.error("Failed to load distribution:", err);
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadTrend();
      loadWeekly();
      loadDistribution();
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
  <div className="app-container">
    <header className="header">
      <h1>InnerLog</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>

    <div className="dashboard">
      <div className="left-panel">
        <MoodForm
          onAdd={() => {
            loadTrend();
            loadWeekly();
            loadDistribution();
          }}
        />
      </div>

      <div className="right-panel">
        <MoodTrendChart data={trend} />
        <WeeklyAverageChart data={weekly} />
        <MoodDistributionChart data={distribution} />
      </div>
    </div>
  </div>
);
}
