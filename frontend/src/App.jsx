import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import api from "./api/client";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Layout from "./components/Layout";
import OnboardingTutorial from "./components/OnboardingTutorial";

const THEME_KEY = "innerlog_theme";
const ONBOARDING_STATUS_KEY = "innerlog_onboarding_completed";
const ONBOARDING_STATUS_PREFIX = "innerlog_onboarding_completed:";

function onboardingStatusKeyForUser(username) {
  return `${ONBOARDING_STATUS_PREFIX}${username || "anonymous"}`;
}

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
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [onboardingStorageKey, setOnboardingStorageKey] = useState(
    ONBOARDING_STATUS_KEY
  );
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2000);
  }

  const loadMoods = useCallback(async () => {
    const start = performance.now();
    const moodsRes = await api.get("journal/moods/");
    setMoods(moodsRes.data);
    if (import.meta.env.DEV) {
      console.debug(`[perf] journal/moods loaded in ${(performance.now() - start).toFixed(1)}ms`);
    }
  }, []);

  const loadInsights = useCallback(async () => {
    const start = performance.now();
    const [trendRes, weeklyRes, distributionRes] = await Promise.all([
      api.get("insights/trend/"),
      api.get("insights/weekly-average/"),
      api.get("insights/distribution/"),
    ]);
    setTrend(trendRes.data);
    setWeekly(weeklyRes.data);
    setDistribution(distributionRes.data);
    if (import.meta.env.DEV) {
      console.debug(`[perf] insights bundle loaded in ${(performance.now() - start).toFixed(1)}ms`);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    const start = performance.now();
    try {
      setLoading(true);
      await Promise.all([loadInsights(), loadMoods()]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      if (import.meta.env.DEV) {
        console.debug(`[perf] dashboard loadAllData took ${(performance.now() - start).toFixed(1)}ms`);
      }
      setLoading(false);
    }
  }, [loadInsights, loadMoods]);

  useEffect(() => {
    if (loggedIn) loadAllData();
  }, [loggedIn, loadAllData]);

  useEffect(() => {
    if (loggedIn && onboardingReady && !onboardingCompleted) {
      setOnboardingOpen(true);
    }
  }, [loggedIn, onboardingCompleted, onboardingReady]);

  useEffect(() => {
    async function loadOnboardingState() {
      if (!loggedIn) {
        setOnboardingReady(false);
        return;
      }

      try {
        const profileRes = await api.get("auth/me/");
        const profile = profileRes.data || {};
        const scopedStorageKey = onboardingStatusKeyForUser(profile.username);
        setOnboardingStorageKey(scopedStorageKey);

        const localValue = localStorage.getItem(scopedStorageKey) === "true";
        const hasBackendValue = typeof profile.onboarding_completed === "boolean";
        const completed = hasBackendValue ? profile.onboarding_completed : localValue;

        setOnboardingCompleted(completed);
        setOnboardingReady(true);
        localStorage.setItem(scopedStorageKey, String(completed));
      } catch (err) {
        console.error("Failed to load onboarding state:", err);
        const legacyValue = localStorage.getItem(ONBOARDING_STATUS_KEY) === "true";
        setOnboardingStorageKey(ONBOARDING_STATUS_KEY);
        setOnboardingCompleted(legacyValue);
        setOnboardingReady(true);
      }
    }

    loadOnboardingState();
  }, [loggedIn]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
    setOnboardingReady(false);
    setOnboardingOpen(false);
  };

  const completeOnboarding = async () => {
    setOnboardingCompleted(true);
    setOnboardingOpen(false);
    localStorage.setItem(onboardingStorageKey, "true");
    localStorage.setItem(ONBOARDING_STATUS_KEY, "true");

    try {
      await api.patch("auth/me/", { onboarding_completed: true });
    } catch (err) {
      console.error("Failed to persist onboarding completion:", err);
    }
  };

  const openOnboarding = () => setOnboardingOpen(true);

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
    <Layout
      loggedIn={loggedIn}
      onLogout={handleLogout}
      theme={theme}
      onThemeToggle={toggleTheme}
      onOpenOnboarding={openOnboarding}
    >
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard
                privacyMode={privacyMode}
                togglePrivacy={togglePrivacy}
                successMessage={successMessage}
                loading={loading}
                moods={moods}
                trend={trend}
                weekly={weekly}
                distribution={distribution}
                loadAllData={loadAllData}
                loadMoods={loadMoods}
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
      {onboardingOpen && (
        <OnboardingTutorial
          onSkip={completeOnboarding}
          onFinish={completeOnboarding}
        />
      )}
    </Layout>
  );
}
