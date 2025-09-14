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
  delta?: number[];
  gamma?: number[];
  vega?: number[];
};

export default function ChartDisplay({ spots, prices, payoffs, delta, gamma, vega }: Props) {
  const labels = spots.length ? spots.map((s) => s.toFixed(2)) : [];

  const datasets: any[] = [];

  if (prices?.length) {
    datasets.push({ label: "BS Price", data: prices, borderColor: "#8884d8", tension: 0.2 });
  }
  if (payoffs?.length) {
    datasets.push({ label: "Payoff", data: payoffs, borderColor: "#82ca9d", tension: 0.2 });
  }
  if (delta?.length) {
    datasets.push({ label: "Delta", data: delta, borderColor: "#ff7300", tension: 0.2 });
  }
  if (gamma?.length) {
    datasets.push({ label: "Gamma", data: gamma, borderColor: "#ff0000", tension: 0.2 });
  }
  if (vega?.length) {
    datasets.push({ label: "Vega", data: vega, borderColor: "#00bfff", tension: 0.2 });
  }

  return (
    <div style={{ width: "100%", height: 400 }}>
      {datasets.length > 0 ? (
        <Line
          data={{ labels, datasets }}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      ) : (
        <div style={{ textAlign: "center", lineHeight: "400px", color: "#999" }}>
          En attente de données...
        </div>
      )}
    </div>
  );
}
