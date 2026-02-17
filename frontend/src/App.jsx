import { useEffect, useState } from "react";
import api from "./api/client";
import Login from "./pages/Login";
import MoodForm from "./components/MoodForm";
import MoodTrendChart from "./charts/MoodTrendChart";
import WeeklyAverageChart from "./charts/WeeklyAverageChart";
import MoodDistributionChart from "./charts/MoodDistributionChart";
import MoodList from "./components/MoodList";


export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [trend, setTrend] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moods, setMoods] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");



  async function loadAllData() {
  try {
    setLoading(true);

    const [
      trendRes,
      weeklyRes,
      distributionRes,
      moodsRes,
    ] = await Promise.all([
      api.get("insights/trend/"),
      api.get("insights/weekly-average/"),
      api.get("insights/distribution/"),
      api.get("journal/moods/"),
    ]);

    setTrend(trendRes.data);
    setWeekly(weeklyRes.data);
    setDistribution(distributionRes.data);
    setMoods(moodsRes.data);
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
  if (loggedIn) {
    loadAllData();
  }
}, [loggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  function showSuccess(message) {
  setSuccessMessage(message);

  setTimeout(() => {
    setSuccessMessage("");
  }, 2000);
}


  return (
  <div className="app-container">
    <header className="header">
      <h1>InnerLog</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>

    <div className="dashboard">
      <div className="left-panel">
        <MoodForm onAdd={loadAllData} />
      </div>

      <div className="right-panel">
  {loading ? (
    <div className="loading">Loading dashboard...</div>
  ) : (
    <>
      <MoodList moods={moods} onDelete={loadAllData} />
      <MoodTrendChart data={trend} />
      <WeeklyAverageChart data={weekly} />
      <MoodDistributionChart data={distribution} />
    </>
  )}
</div>

    </div>
  </div>
);
}

async function loadMoods() {
  try {
    const res = await api.get("journal/moods/");
    setMoods(res.data);
  } catch (err) {
    console.error("Failed to load moods:", err);
  }
}

