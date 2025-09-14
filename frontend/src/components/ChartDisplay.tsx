import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Props = {
  spots: number[];
  prices?: number[];
  payoffs?: number[];
  deltas?: number[];
  gammas?: number[];
  vegas?: number[];
};

export default function ChartDisplay({ spots, prices, payoffs, deltas, gammas, vegas }: Props) {
  const labels = spots.map((s) => s.toFixed(2));
  const datasets: any[] = [];

  if (prices && prices.length) {
    datasets.push({
      label: "BS Price",
      data: prices,
      borderColor: "#8884d8",
      fill: false,
      tension: 0.2,
    });
  }
  if (payoffs && payoffs.length) {
    datasets.push({
      label: "Payoff at Maturity",
      data: payoffs,
      borderColor: "#82ca9d",
      fill: false,
      tension: 0.2,
    });
  }
  if (deltas && deltas.length) {
    datasets.push({
      label: "Delta",
      data: deltas,
      borderColor: "#ff7300",
      fill: false,
      tension: 0.2,
    });
  }
  if (gammas && gammas.length) {
    datasets.push({
      label: "Gamma",
      data: gammas,
      borderColor: "#ff0000",
      fill: false,
      tension: 0.2,
    });
  }
  if (vegas && vegas.length) {
    datasets.push({
      label: "Vega",
      data: vegas,
      borderColor: "#00bfff",
      fill: false,
      tension: 0.2,
    });
  }

  const data = { labels, datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Spot" } },
      y: { title: { display: true, text: "Value" } },
    },
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      {datasets.length > 0 ? <Line data={data} options={options} /> : <div style={{ textAlign: "center", lineHeight: "400px", color: "#999" }}>En attente de données...</div>}
    </div>
  );
}
