import React from "react";

/**
 * Panel de métricas del pipeline ETL.
 * Props:
 * - metrics: { totalTime, recordsProcessed, successRate, timestamps }
 */
export default function MetricsPanel({ metrics }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2 border border-gray-200">
      <h3 className="font-semibold text-base mb-1">Métricas del Pipeline</h3>
      <div className="flex flex-wrap gap-4 text-sm">
        <div><span className="font-bold">Tiempo total:</span> {metrics.totalTime || "-"}</div>
        <div><span className="font-bold">Registros procesados:</span> {metrics.recordsProcessed ?? "-"}</div>
        <div><span className="font-bold">Tasa de éxito:</span> {metrics.successRate ?? "-"}%</div>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        <div><span className="font-bold">Timestamps:</span></div>
        {metrics.timestamps?.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    </div>
  );
} 