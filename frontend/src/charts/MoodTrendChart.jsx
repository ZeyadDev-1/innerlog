import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function MoodTrendChart({ data }) {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Mood Trend",
          data: data.map((d) => d.mood_score),
          borderColor: "#8b6f47",
          backgroundColor: "rgba(139, 111, 71, 0.15)",
          tension: 0.3,
          fill: true,
        },
      ],
    }),
    [data]
  );

  return (
    <div className="chart-wrapper">
      <Line data={chartData} />
    </div>
  );
}

export default memo(MoodTrendChart);
