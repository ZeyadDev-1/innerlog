import MoodForm from "../components/MoodForm";
import MoodList from "../components/MoodList";
import MoodTrendChart from "../charts/MoodTrendChart";
import WeeklyAverageChart from "../charts/WeeklyAverageChart";
import MoodDistributionChart from "../charts/MoodDistributionChart";

export default function Dashboard({
  privacyMode,
  togglePrivacy,
  handleLogout,
  successMessage,
  loading,
  moods,
  trend,
  weekly,
  distribution,
  loadAllData,
  showSuccess,
}) {
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