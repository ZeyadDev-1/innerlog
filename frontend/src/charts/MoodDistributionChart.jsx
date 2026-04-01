import { memo, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function MoodDistributionChart({ data }) {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => `Mood ${d.mood_score}`),
      datasets: [
        {
          label: "Entries",
          data: data.map((d) => d.count),
          backgroundColor: "rgba(199, 159, 106, 0.75)",
          borderRadius: 10,
        },
      ],
    }),
    [data]
  );

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} />
    </div>
  );
}

export default memo(MoodDistributionChart);
