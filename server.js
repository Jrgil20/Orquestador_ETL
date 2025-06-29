import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Endpoint para ejecutar extracción
app.post('/api/extract', (req, res) => {
  const extractionScript = path.resolve(__dirname, '../extraction/src/core/main.js');
  const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node';
  const child = spawn(nodeCmd, [extractionScript], {
    cwd: path.resolve(__dirname, '../extraction'),
    env: process.env,
    shell: true,
  });

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  child.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  child.on('close', (code) => {
    if (code === 0) {
      res.json({ success: true, log: output });
    } else {
      res.status(500).json({ success: false, log: output, error: errorOutput });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Orchestration backend listening on port ${PORT}`);
}); 