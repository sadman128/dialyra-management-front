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
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
        <canvas ref={canvasRef} />
      </div>

      {/* Designed "Total Calls" Metric Card */}
      <div className="mt-4 w-full max-w-[260px] mx-auto p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] via-surface-container-low to-purple-500/[0.02] dark:from-purple-900/25 dark:via-[#1a1329] dark:to-purple-950/20 border border-purple-500/25 dark:border-purple-400/30 shadow-xs flex items-center justify-between transition-all hover:scale-[1.01] hover:shadow-sm">
        <div className="flex flex-col text-left">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#9a55ff] dark:text-[#c084fc]">
            <span className="w-2 h-2 rounded-full bg-[#07cdae] animate-pulse" />
            <span>Total Calls</span>
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
            Period: {timeframeLabel}
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-black text-on-surface font-mono tracking-tight leading-none block">
            {totalOrders.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5 block">
            Completed
          </span>
        </div>
      </div>
    </div>
  );
}
