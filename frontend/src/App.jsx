import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import api from "./api/client";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import MoodForm from "./components/MoodForm";
import MoodList from "./components/MoodList";
import MoodTrendChart from "./charts/MoodTrendChart";
import WeeklyAverageChart from "./charts/WeeklyAverageChart";
import MoodDistributionChart from "./charts/MoodDistributionChart";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access_token"));

  // privacy mode toggle (stored)
  const [privacyMode, setPrivacyMode] = useState(
    localStorage.getItem("privacy_mode") === "true"
  );

  const togglePrivacy = () => {
    const next = !privacyMode;
    setPrivacyMode(next);
    localStorage.setItem("privacy_mode", String(next));
  };

  // data
  const [trend, setTrend] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2000);
  }

  async function loadAllData() {
    try {
      setLoading(true);
      const [trendRes, weeklyRes, distributionRes, moodsRes] = await Promise.all([
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
    if (loggedIn) loadAllData();
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  // Private route wrapper
  function PrivateRoute({ children }) {
    if (!loggedIn) return <Navigate to="/login" replace />;
    return children;
  }

  function Dashboard() {
    return (
      <div className="app-container">
        <header className="header">
          <h1>InnerLog</h1>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={togglePrivacy}>
              {privacyMode ? "Privacy: ON" : "Privacy: OFF"}
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="dashboard">
          <div className="left-panel">
            <MoodForm onAdd={loadAllData} onSuccess={showSuccess} />
          </div>

          <div className="right-panel">
            {loading ? (
              <div className="loading">Loading dashboard...</div>
            ) : (
              <>
                <MoodList
                  moods={moods}
                  onDelete={loadAllData}
                  onSuccess={showSuccess}
                  privacyMode={privacyMode}
                />

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

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}