import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve('test-screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const routes = [
  { name: 'dashboard', path: '/dashboard' },
  { name: 'businesses', path: '/businesses' },
  { name: 'flows', path: '/flows' },
  { name: 'flow-builder', path: '/flows/builder/1' },
  { name: 'call-history', path: '/call-history' },
  { name: 'audio', path: '/audio' },
  { name: 'test-tools', path: '/test-tools' },
  { name: 'settings', path: '/settings' },
];

const viewports = [
  { name: '1080p', width: 1920, height: 1080 },
  { name: 'pc', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile_full', width: 390, height: 1800 },
];

const themes = [
  { name: 'light', query: '' },
  { name: 'dark', query: '?theme=dark' },
];

const PORT = 3005;

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          setTimeout(check, 300);
        }
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Server did not start in time'));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

function captureScreenshot(url, width, height, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--screenshot=${outputPath}`,
      '--virtual-time-budget=2000',
      '--run-all-compositor-stages-before-draw',
      url,
    ];

    const proc = spawn(CHROME_PATH, args, { stdio: 'ignore' });
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) resolve();
      else reject(new Error(`Chrome exited with code ${code} or file missing`));
    });
    proc.on('error', reject);
  });
}

async function run() {
  console.log(`Starting Next.js server on port ${PORT}...`);
  const server = spawn('node', ['./node_modules/next/dist/bin/next', 'start', '-p', PORT.toString()], {
    cwd: path.resolve('.'),
    stdio: 'ignore',
  });

  try {
    console.log(`Waiting for http://localhost:${PORT}/dashboard...`);
    await waitForServer(`http://localhost:${PORT}/dashboard`);
    console.log('Server is online! Capturing screenshots...');

    for (const vp of viewports) {
      for (const route of routes) {
        for (const th of themes) {
          const filename = `${vp.name}_${route.name}_${th.name}.png`;
          const filePath = path.join(OUTPUT_DIR, filename);
          const fullUrl = `http://localhost:${PORT}${route.path}${th.query}`;
          process.stdout.write(`Capturing ${filename}... `);
          await captureScreenshot(fullUrl, vp.width, vp.height, filePath);
          console.log('OK');
        }
      }
    }

    console.log(`\nAll screenshots successfully captured in ${OUTPUT_DIR}`);
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    console.log('Stopping server...');
    if (server.pid) {
      try {
        process.kill(server.pid);
      } catch (e) {}
    }
  }
}

run();
