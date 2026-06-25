"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MESES_CURTOS } from "@/lib/constants";
import { formatBRL } from "@/lib/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function HistoricoChart({
  receitasPorMes,
  despesasPorMes,
}: {
  receitasPorMes: number[];
  despesasPorMes: number[];
}) {
  const data = {
    labels: [...MESES_CURTOS],
    datasets: [
      {
        label: "Receitas",
        data: receitasPorMes,
        backgroundColor: "#16A34A",
        hoverBackgroundColor: "#15803D",
        borderRadius: 5,
        maxBarThickness: 22,
      },
      {
        label: "Despesas",
        data: despesasPorMes,
        backgroundColor: "#DC2626",
        hoverBackgroundColor: "#B91C1C",
        borderRadius: 5,
        maxBarThickness: 22,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { boxWidth: 12, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${formatBRL(Number(ctx.raw) || 0)}`,
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
    <div className="h-72">
      <Bar data={data} options={options} />
    </div>
  );
}
