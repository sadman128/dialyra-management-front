"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface TrafficDonutChartProps {
  confirmed: number;
  noAnswer: number;
  cancelled: number;
  inQueue: number;
  confirmedPercent: number;
  noAnswerPercent: number;
  cancelledPercent: number;
  inQueuePercent: number;
  totalOrders: number;
  timeframeLabel: string;
}

export function TrafficDonutChart({
  confirmed,
  noAnswer,
  cancelled,
  inQueue,
  confirmedPercent,
  noAnswerPercent,
  cancelledPercent,
  inQueuePercent,
  totalOrders,
  timeframeLabel,
}: TrafficDonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"doughnut"> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy any existing chart instance to prevent canvas reuse errors
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Exact Purple React Template Gradients:
    // 1. Emerald to Mint (Confirmed)
    const gradientdonutConfirmed = ctx.createLinearGradient(0, 0, 0, 200);
    gradientdonutConfirmed.addColorStop(0, "rgba(6, 185, 157, 1)");
    gradientdonutConfirmed.addColorStop(1, "rgba(132, 217, 210, 1)");

    // 2. Cyan to Sky Blue (No Answer)
    const gradientdonutNoAnswer = ctx.createLinearGradient(0, 0, 0, 200);
    gradientdonutNoAnswer.addColorStop(0, "rgba(54, 215, 232, 1)");
    gradientdonutNoAnswer.addColorStop(1, "rgba(100, 181, 246, 1)");

    // 3. Coral to Peach (Cancelled)
    const gradientdonutCancelled = ctx.createLinearGradient(0, 0, 0, 200);
    gradientdonutCancelled.addColorStop(0, "rgba(254, 124, 150, 1)");
    gradientdonutCancelled.addColorStop(1, "rgba(255, 205, 150, 1)");

    // 4. Vivid Lavender to Royal Purple (In Queue - Purple Option)
    const gradientdonutQueue = ctx.createLinearGradient(0, 0, 0, 200);
    gradientdonutQueue.addColorStop(0, "rgba(218, 140, 255, 1)");
    gradientdonutQueue.addColorStop(1, "rgba(154, 85, 255, 1)");

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        // Labels for tooltips
        labels: ["Confirmed", "No Answer", "Cancelled", "In Queue"],
        datasets: [
          {
            data: [confirmed, noAnswer, cancelled, inQueue],
            backgroundColor: [
              gradientdonutConfirmed,
              gradientdonutNoAnswer,
              gradientdonutCancelled,
              gradientdonutQueue,
            ],
            hoverBackgroundColor: [
              gradientdonutConfirmed,
              gradientdonutNoAnswer,
              gradientdonutCancelled,
              gradientdonutQueue,
            ],
            borderColor: [
              gradientdonutConfirmed,
              gradientdonutNoAnswer,
              gradientdonutCancelled,
              gradientdonutQueue,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "50%",
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#1f2937",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 12, weight: "bold" },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: false,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                return ` ${label}: ${value}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [confirmed, noAnswer, cancelled, inQueue]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Chart Canvas with 50% Cutout Doughnut */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
        <canvas ref={canvasRef} />
      </div>

      {/* Simple Total Calls */}
      <div className="mt-2 text-center">
        <span className="text-xs sm:text-sm font-bold text-on-surface">
          Total Calls : <span className="font-mono text-[#9a55ff] dark:text-[#c084fc] font-extrabold text-sm sm:text-base">{totalOrders.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
