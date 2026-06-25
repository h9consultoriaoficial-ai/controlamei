"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MESES_CURTOS } from "@/lib/constants";
import { formatBRL } from "@/lib/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function HistoricoChart({
  valoresPorMes,
}: {
  valoresPorMes: number[];
}) {
  const data = {
    labels: [...MESES_CURTOS],
    datasets: [
      {
        data: valoresPorMes,
        backgroundColor: "#0F6E56",
        hoverBackgroundColor: "#0B5644",
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => formatBRL(Number(ctx.raw) || 0),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 },
          callback: (v) => {
            const n = Number(v);
            return n >= 1000 ? `${n / 1000}k` : `${n}`;
          },
        },
        grid: { color: "#f0f0f0" },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
