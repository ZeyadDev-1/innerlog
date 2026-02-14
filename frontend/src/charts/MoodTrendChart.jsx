import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function MoodTrendChart({ data }) {
  return (
  <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
    <Line
      data={{
        labels: data.map(d => d.date),
        datasets: [
          {
            label: "Mood Trend",
            data: data.map(d => d.mood_score),
            borderColor: "#4f46e5",
            tension: 0.3,
          },
        ],
      }}
    />
  </div>
);

}
