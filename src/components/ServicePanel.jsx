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
 * - children: Contenido personalizado para renderizar arriba del botón "Ejecutar"
 */
const statusColors = {
  idle: "bg-gray-200 text-gray-700",
  running: "bg-blue-200 text-blue-800 animate-pulse",
  success: "bg-green-200 text-green-800",
  error: "bg-red-200 text-red-800",
  unavailable: "bg-yellow-200 text-yellow-800",
};

export default function ServicePanel({ name, description, status, command, onExecute, disabled, children }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col gap-3 border ${statusColors[status] || statusColors.idle}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">{name}</h2>
        <span className="text-xs px-3 py-1 rounded-full font-mono border border-gray-300 bg-white/70 uppercase tracking-wide">{status}</span>
      </div>
      <p className="text-sm text-gray-600 flex-1 mb-2">{description}</p>
      <div className="bg-gray-800 text-green-300 font-mono text-xs p-3 rounded-lg border flex items-center gap-2">
        <span className="text-gray-400 text-xs whitespace-nowrap">Comando:</span>
        <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={command}>{command}</code>
      </div>

      {children && <div className="mt-2 flex flex-col gap-2">{children}</div>}

      <button
        className="mt-2 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
        onClick={onExecute}
        disabled={disabled}
      >
        Ejecutar
      </button>
    </div>
  );
} 