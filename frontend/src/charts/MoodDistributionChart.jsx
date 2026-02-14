import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function MoodDistributionChart({ data }) {
  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <h3>Mood Distribution</h3>

      <Bar
        data={{
          labels: data.map(d => `Mood ${d.mood_score}`),
          datasets: [
            {
              label: "Entries",
              data: data.map(d => d.count),
              backgroundColor: "#f59e0b",
            },
          ],
        }}
      />
    </div>
  );
}
