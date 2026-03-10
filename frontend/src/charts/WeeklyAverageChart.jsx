import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function WeeklyAverageChart({ data }) {
  return (
    <div className="chart-wrapper">
      <Line
        data={{
          labels: data.map((d) => {
            const date = new Date(d.week);
            return date.toLocaleDateString();
          }),
          datasets: [
            {
              label: "Weekly Average",
              data: data.map((d) => d.avg_mood),
              borderColor: "#9a7b52",
              backgroundColor: "rgba(154, 123, 82, 0.18)",
              tension: 0.3,
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
}
