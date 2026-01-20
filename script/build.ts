import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔨 Building RealtyPro for production...');
console.log('📁 Root directory:', rootDir);

function execCommand(command: string, cwd: string = rootDir) {
  console.log(`\n📦 Running: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    process.exit(1);
  }
}

const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  console.log('🗑️ Cleaning dist directory...');
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('\n📊 Step 1: Building Apollo Server...');
const serverDir = path.join(rootDir, 'apps', 'server');
execCommand('npx tsc', serverDir);

console.log('\n🌐 Step 2: Building Next.js...');
const webDir = path.join(rootDir, 'apps', 'web');
execCommand('npx next build', webDir);

console.log('\n📋 Step 3: Copying build artifacts...');

const serverDistSrc = path.join(serverDir, 'dist');
const serverDistDest = path.join(distDir, 'server');
if (fs.existsSync(serverDistSrc)) {
  fs.cpSync(serverDistSrc, serverDistDest, { recursive: true });
  console.log('✅ Apollo Server built to dist/server');
}

const nextStandaloneSrc = path.join(webDir, '.next', 'standalone');
const nextStaticSrc = path.join(webDir, '.next', 'static');
const nextPublicSrc = path.join(webDir, 'public');

if (fs.existsSync(nextStandaloneSrc)) {
  fs.cpSync(nextStandaloneSrc, path.join(distDir, 'web'), { recursive: true });
  
  if (fs.existsSync(nextStaticSrc)) {
    fs.cpSync(nextStaticSrc, path.join(distDir, 'web', 'apps', 'web', '.next', 'static'), { recursive: true });
  }
  
  if (fs.existsSync(nextPublicSrc)) {
    fs.cpSync(nextPublicSrc, path.join(distDir, 'web', 'apps', 'web', 'public'), { recursive: true });
  }
  
  console.log('✅ Next.js built to dist/web');
}

console.log('\n📄 Step 4: Creating production launcher...');

const launcherCode = `const { spawn } = require('child_process');
const path = require('path');

const distDir = __dirname;
let serverProcess = null;
let webProcess = null;

function cleanup() {
  console.log('\\n🛑 Shutting down...');
  if (serverProcess) serverProcess.kill('SIGTERM');
  if (webProcess) webProcess.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('🚀 Starting RealtyPro in production mode...');

console.log('🔧 Starting Apollo Server on port 4000...');
serverProcess = spawn('node', [path.join(distDir, 'server', 'index.js')], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
});

serverProcess.on('error', (err) => {
  console.error('❌ Server error:', err);
});

setTimeout(() => {
  console.log('🌐 Starting Next.js on port 5000...');
  
  const webAppDir = path.join(distDir, 'web', 'apps', 'web');
  webProcess = spawn('node', [path.join(webAppDir, 'server.js')], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      PORT: '5000',
      HOSTNAME: '0.0.0.0',
    },
    cwd: webAppDir,
  });

  webProcess.on('error', (err) => {
    console.error('❌ Web error:', err);
  });
}, 2000);
`;

fs.writeFileSync(path.join(distDir, 'index.cjs'), launcherCode);
console.log('✅ Production launcher created at dist/index.cjs');

console.log('\n✅ Build complete! Run with: node dist/index.cjs');
