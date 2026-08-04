const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const base = 'C:/Users/Acer/Downloads/prd-generator-&-agreement-builder';
const dirs = ['.next', '.turbo', 'node_modules/.cache', path.join('.cache', 'turbo')];

for (const dir of dirs) {
  const full = path.join(base, dir);
  if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
}

const child = spawn('pnpm', ['install', '--ignore-scripts'], {
  cwd: base,
  shell: true,
  stdio: 'inherit',
  windowsHide: false,
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error('pnpm install failed with', code);
    process.exit(code);
  }

  const dev = spawn('pnpm', ['run', 'dev'], {
    cwd: base,
    shell: true,
    stdio: 'inherit',
    windowsHide: false,
  });

  dev.on('error', (err) => {
    console.error('Dev spawn error:', err);
  });
});

child.on('error', (err) => {
  console.error('Install spawn error:', err);
});
