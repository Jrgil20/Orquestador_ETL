import React from "react";

/**
 * Panel de servicio individual para el dashboard de orquestación.
 * Props:
 * - name: Nombre del servicio (Extraction, Transformation, Loading)
 * - description: Descripción corta
 * - status: Estado actual (idle, running, success, error, unavailable)
 * - command: Comando que se ejecutará
 * - onExecute: Función para ejecutar el servicio
 * - disabled: Si el botón debe estar deshabilitado
 */
const statusColors = {
  idle: "bg-gray-200 text-gray-700",
  running: "bg-blue-200 text-blue-800 animate-pulse",
  success: "bg-green-200 text-green-800",
  error: "bg-red-200 text-red-800",
  unavailable: "bg-yellow-200 text-yellow-800",
};

export default function ServicePanel({ name, description, status, command, onExecute, disabled }) {
  return (
    <div className={`rounded-lg shadow p-4 flex flex-col gap-2 border ${statusColors[status] || statusColors.idle}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">{name}</h2>
        <span className="text-xs px-2 py-1 rounded font-mono border border-gray-300 bg-white/70">{status}</span>
      </div>
      <p className="text-sm text-gray-600 flex-1">{description}</p>
      <div className="bg-gray-800 text-green-300 font-mono text-xs p-2 rounded border">
        <div className="text-gray-400 text-xs mb-1">Comando:</div>
        <code>{command}</code>
      </div>
      <button
        className="mt-2 py-1 px-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
        onClick={onExecute}
        disabled={disabled}
      >
        Ejecutar
      </button>
    </div>
  );
} 