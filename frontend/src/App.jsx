import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import api from "./api/client";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";

const THEME_KEY = "innerlog_theme";

function getInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [theme, setTheme] = useState(getInitialTheme);

  // Privacy mode (stored)
  const [privacyMode, setPrivacyMode] = useState(
    localStorage.getItem("privacy_mode") === "true"
  );

  const togglePrivacy = () => {
    const next = !privacyMode;
    setPrivacyMode(next);
    localStorage.setItem("privacy_mode", String(next));
  };

  // Dashboard data
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

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === "light" ? "dark" : "light"
    );
  };

  // Private route wrapper
  function PrivateRoute({ children }) {
    if (!loggedIn) return <Navigate to="/login" replace />;
    return children;
  }

  return (
    <>
      <button
        type="button"
        className="theme-toggle btn btn-sm btn-primary"
        onClick={toggleTheme}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard
                privacyMode={privacyMode}
                togglePrivacy={togglePrivacy}
                handleLogout={handleLogout}
                successMessage={successMessage}
                loading={loading}
                moods={moods}
                trend={trend}
                weekly={weekly}
                distribution={distribution}
                loadAllData={loadAllData}
                showSuccess={showSuccess}
              />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}
