import React from "react";

/**
 * Consola de logs para el dashboard de orquestación.
 * Props:
 * - logs: Array de strings (líneas de log)
 */
export default function LogsConsole({ logs }) {
  return (
    <div className="bg-black text-green-200 font-mono rounded p-3 h-40 overflow-y-auto text-xs shadow-inner">
      {logs.length === 0 ? (
        <span className="text-gray-400">Sin logs aún...</span>
      ) : (
        logs.map((line, i) => <div key={i}>{line}</div>)
      )}
    </div>
  );
} 