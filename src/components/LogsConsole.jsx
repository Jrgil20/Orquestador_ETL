import React from "react";

/**
 * Consola de logs para el dashboard de orquestación.
 * Props:
 * - logs: Array de strings (líneas de log)
 */
export default function LogsConsole({ logs }) {
  return (
    <div className="bg-black text-green-200 font-mono rounded-xl p-4 h-48 overflow-y-auto text-xs shadow-lg border border-gray-300">
      {logs.length === 0 ? (
        <span className="text-gray-400">Sin logs aún...</span>
      ) : (
        logs.map((line, i) => <div key={i}>{line}</div>)
      )}
    </div>
  );
} 