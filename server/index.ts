import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting Fullstack GraphQL Monorepo...');
console.log('📁 Root directory:', rootDir);

let serverProcess: ChildProcess | null = null;
let webProcess: ChildProcess | null = null;

function cleanup() {
  console.log('\n🛑 Shutting down...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  if (webProcess) {
    webProcess.kill('SIGTERM');
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start Apollo Server
console.log('🔧 Starting Apollo Server on port 4000...');
serverProcess = spawn('npx', ['tsx', 'watch', 'src/index.ts'], {
  cwd: path.join(rootDir, 'apps', 'server'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' },
});

serverProcess.on('error', (err) => {
  console.error('❌ Server process error:', err);
});

// Wait for server to start, then start Next.js
setTimeout(() => {
  console.log('🌐 Starting Next.js on port 5000...');
  webProcess = spawn('npx', ['next', 'dev', '-p', '5000', '-H', '0.0.0.0'], {
    cwd: path.join(rootDir, 'apps', 'web'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' },
  });

  webProcess.on('error', (err) => {
    console.error('❌ Web process error:', err);
  });
}, 3000);
