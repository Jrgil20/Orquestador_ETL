import React, { useState } from "react";

/**
 * Formulario de configuración de Supabase.
 * Props:
 * - config: { url, apiKey, table }
 * - onChange: función para actualizar la config
 * - onValidate: función para validar conexión
 * - validationStatus: 'idle' | 'validating' | 'success' | 'error'
 * - validationMessage: string
 */
export default function SupabaseConfig({ config, onChange, onValidate, validationStatus, validationMessage }) {
  const [localConfig, setLocalConfig] = useState(config);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => ({ ...prev, [name]: value }));
    onChange({ ...localConfig, [name]: value });
  };

  return (
    <form className="bg-white rounded shadow p-4 flex flex-col gap-2 border border-gray-200">
      <h3 className="font-semibold text-base mb-1">Configuración Supabase</h3>
      <input
        className="border rounded px-2 py-1 text-sm"
        name="url"
        placeholder="URL del proyecto"
        value={localConfig.url}
        onChange={handleChange}
        autoComplete="off"
      />
      <input
        className="border rounded px-2 py-1 text-sm"
        name="apiKey"
        placeholder="API Key"
        value={localConfig.apiKey}
        onChange={handleChange}
        autoComplete="off"
      />
      <input
        className="border rounded px-2 py-1 text-sm"
        name="table"
        placeholder="Tabla destino"
        value={localConfig.table}
        onChange={handleChange}
        autoComplete="off"
      />
      <button
        type="button"
        className="mt-2 py-1 px-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
        onClick={onValidate}
        disabled={validationStatus === 'validating'}
      >
        Validar conexión
      </button>
      {validationStatus !== 'idle' && (
        <div className={`text-xs mt-1 ${validationStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{validationMessage}</div>
      )}
    </form>
  );
} 