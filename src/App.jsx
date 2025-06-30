import { useState } from "react";
import ServicePanel from "./components/ServicePanel";
import LogsConsole from "./components/LogsConsole";
import MetricsPanel from "./components/MetricsPanel";
import SupabaseConfig from "./components/SupabaseConfig";
import "./App.css";

const initialServices = [
  {
    key: "extraction",
    name: "Extraction Service",
    description: "Recolección automatizada de posts de redes sociales.",
    command: "cd ../extraction && node ./src/core/main.js",
    status: "idle",
  },
  {
    key: "transformation",
    name: "Analyzer Service",
    description: "Procesamiento de sentimientos con modelos de IA generativa.",
    command: "cd ../transformation && python src/chat_app.py --input ../extraction/tweets.csv --output results.json",
    status: "idle",
  },
  {
    key: "loading",
    name: "Dashboard Service",
    description: "Interfaz web para gestión y visualización.",
    command: "cd ../load && node load-to-supabase.js --input ../transformation/results.json",
    status: "idle",
  },
];

const initialMetrics = {
  totalTime: "-",
  recordsProcessed: 0,
  successRate: 0,
  timestamps: [],
};

const initialSupabase = {
  url: "",
  apiKey: "",
  table: "",
};

const initialFiles = [
  { name: "tweets.csv", size: 10240 },
  { name: "results.json", size: 20480 },
];

export default function App() {
  const [services, setServices] = useState(initialServices);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [supabase, setSupabase] = useState(initialSupabase);
  const [supabaseStatus, setSupabaseStatus] = useState("idle");
  const [supabaseMsg, setSupabaseMsg] = useState("");
  const [files] = useState(initialFiles);

  // Mock handlers
  const handleExecute = async (key) => {
    const service = services.find(s => s.key === key);
    setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] Ejecutando: ${service.command}`]);
    setServices((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, status: "running" } : s
      )
    );
    if (key === "extraction") {
      try {
        const res = await fetch("http://localhost:4000/api/extract", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          setLogs((l) => [...l, ...data.log.split("\n").map(line => `[extractor] ${line}`)]);
          setServices((prev) =>
            prev.map((s) =>
              s.key === key ? { ...s, status: "success" } : s
            )
          );
        } else {
          setLogs((l) => [...l, `[extractor][error] ${data.error || "Error desconocido"}`]);
          setServices((prev) =>
            prev.map((s) =>
              s.key === key ? { ...s, status: "error" } : s
            )
          );
        }
      } catch (err) {
        setLogs((l) => [...l, `[extractor][error] ${err.message}`]);
        setServices((prev) =>
          prev.map((s) =>
            s.key === key ? { ...s, status: "error" } : s
          )
        );
      }
    } else {
      setTimeout(() => {
        setServices((prev) =>
          prev.map((s) =>
            s.key === key ? { ...s, status: "success" } : s
          )
        );
        setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] Servicio ${key} finalizado con éxito.`]);
      }, 1500);
    }
  };

  const handlePipeline = () => {
    setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] Iniciando pipeline completo...`]);
    setServices((prev) => prev.map((s) => ({ ...s, status: "running" })));
    
    // Ejecutar servicios secuencialmente
    let currentIndex = 0;
    const executeNext = () => {
      if (currentIndex < services.length) {
        const service = services[currentIndex];
        setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] Ejecutando: ${service.command}`]);
        currentIndex++;
        setTimeout(executeNext, 2000);
      } else {
        // Pipeline completo terminado
        setServices((prev) => prev.map((s) => ({ ...s, status: "success" })));
        setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] Pipeline completo finalizado con éxito.`]);
        setMetrics({
          totalTime: "00:01:23",
          recordsProcessed: 1234,
          successRate: 100,
          timestamps: [
            "Inicio: 2024-03-21 10:00:00",
            "Extracción: 2024-03-21 10:00:10",
            "Transformación: 2024-03-21 10:00:40",
            "Carga: 2024-03-21 10:01:20",
            "Fin: 2024-03-21 10:01:23",
          ],
        });
      }
    };
    executeNext();
  };

  const handleSupabaseChange = (cfg) => setSupabase(cfg);
  const handleSupabaseValidate = () => {
    setSupabaseStatus("validating");
    setSupabaseMsg("");
    setTimeout(() => {
      if (supabase.url && supabase.apiKey && supabase.table) {
        setSupabaseStatus("success");
        setSupabaseMsg("Conexión exitosa a Supabase.");
      } else {
        setSupabaseStatus("error");
        setSupabaseMsg("Faltan datos de configuración.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">ETL Orchestration Service</h1>
        <h2 className="text-xl text-blue-700 font-medium">Análisis Selección Venezuela - Pipeline FIFA Marzo</h2>
      </header>
      
      {/* Services Section - Full width */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Servicios del Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <ServicePanel
              key={svc.key}
              name={svc.name}
              description={svc.description}
              command={svc.command}
              status={svc.status}
              onExecute={() => handleExecute(svc.key)}
              disabled={svc.status === "running"}
            />
          ))}
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="flex flex-wrap gap-6 justify-center">
        
        {/* Pipeline Control */}
        <div className="w-full sm:w-auto sm:min-w-[280px] flex-1 max-w-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-fit">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Control del Pipeline</h3>
            <button
              className="py-3 px-4 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 disabled:bg-gray-400 transition-all duration-300 w-full shadow-md hover:shadow-lg"
              onClick={handlePipeline}
              disabled={services.some((s) => s.status === "running")}
            >
              Ejecutar Pipeline Completo
            </button>
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="w-full sm:w-auto sm:min-w-[300px] flex-1 max-w-md">
          <MetricsPanel metrics={metrics} />
        </div>

        {/* Intermediate Files */}
        <div className="w-full sm:w-auto sm:min-w-[280px] flex-1 max-w-sm">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Archivos Intermedios</h3>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <ul className="text-sm space-y-2">
              {files.map((f) => (
                <li key={f.name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{f.name}</span>
                  <span className="text-gray-500 text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {(f.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Supabase Config */}
        <div className="w-full sm:w-auto sm:min-w-[320px] flex-1 max-w-md">
          <SupabaseConfig
            config={supabase}
            onChange={handleSupabaseChange}
            onValidate={handleSupabaseValidate}
            validationStatus={supabaseStatus}
            validationMessage={supabaseMsg}
          />
        </div>
      </div>

      {/* Logs Console - Full width at bottom */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Logs Consolidados</h3>
        <LogsConsole logs={logs} />
      </div>
    </div>
  );
}