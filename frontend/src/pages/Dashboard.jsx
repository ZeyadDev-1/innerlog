import MoodForm from "../components/MoodForm";
import MoodList from "../components/MoodList";
import MoodTrendChart from "../charts/MoodTrendChart";
import WeeklyAverageChart from "../charts/WeeklyAverageChart";
import MoodDistributionChart from "../charts/MoodDistributionChart";

export default function Dashboard({
  privacyMode,
  togglePrivacy,
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
    <div className="app-container dashboard-view container">
      <header className="dashboard-header dashboard-appear d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
        <div>
          <p className="dashboard-kicker mb-2">Your emotional wellness space</p>
          <h1 className="mb-0">InnerLog Dashboard</h1>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn btn-sm btn-outline-primary px-3" onClick={togglePrivacy}>
            {privacyMode ? "Privacy: ON" : "Privacy: OFF"}
          </button>
        </div>
      </header>

      {successMessage && <div className="success-message dashboard-appear">{successMessage}</div>}

      <div className="row g-4 align-items-start dashboard-grid">
        <div className="col-12 col-lg-4 dashboard-appear" style={{ "--appear-delay": "0.08s" }}>
          <MoodForm onAdd={loadAllData} onSuccess={showSuccess} />
        </div>

        <div className="col-12 col-lg-8 dashboard-appear" style={{ "--appear-delay": "0.16s" }}>
          {loading ? (
            <div className="loading">Loading dashboard...</div>
          ) : (
            <div className="d-grid gap-4 dashboard-stack">
              <MoodList
                moods={moods}
                onDelete={loadAllData}
                onSuccess={showSuccess}
                privacyMode={privacyMode}
              />

              <section className="dashboard-card chart-panel dashboard-item">
                <h3 className="section-title">Mood Trend</h3>
                <MoodTrendChart data={trend} />
              </section>

              <section className="dashboard-card chart-panel dashboard-item">
                <h3 className="section-title">Weekly Average Mood</h3>
                <WeeklyAverageChart data={weekly} />
              </section>

              <section className="dashboard-card chart-panel dashboard-item">
                <h3 className="section-title">Mood Distribution</h3>
                <MoodDistributionChart data={distribution} />
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
