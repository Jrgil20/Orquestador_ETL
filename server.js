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
  const { accounts, maxTweets, startDate, endDate } = req.body;

  const extractionScript = path.resolve(__dirname, '../extraction/src/core/main.js');
  
  const args = [];
  if (accounts) args.push('--accounts', accounts);
  if (maxTweets) args.push('--maxTweets', maxTweets);
  if (startDate) args.push('--startDate', startDate);
  if (endDate) args.push('--endDate', endDate);

  console.log(`Executing: node ${extractionScript} ${args.join(' ')}`);

  const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node';
  const child = spawn(nodeCmd, [extractionScript, ...args], {
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

// Endpoint para ejecutar transformación
app.post('/api/transform', (req, res) => {
  const transformationScript = 'src/chat_app.py';
  const inputFile = '../extraction/tweets.csv';
  const outputFile = 'results.json';

  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  const child = spawn(pythonCmd, [
    transformationScript,
    '--input',
    inputFile,
    '--output',
    outputFile
  ], {
    cwd: path.resolve(__dirname, '../transformation'),
    env: process.env,
    shell: false,
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