import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function WeeklyAverageChart({ data }) {
  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
      <h3>Weekly Average Mood</h3>

      <Line
        data={{
          labels: data.map(d => {
            const date = new Date(d.week);
            return date.toLocaleDateString();
          }),
          datasets: [
            {
              label: "Weekly Average",
              data: data.map(d => d.avg_mood),
              borderColor: "#10b981",
              tension: 0.3,
            },
          ],
        }}
      />
    </div>
  );
}
