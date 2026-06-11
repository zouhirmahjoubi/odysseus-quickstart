import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWin = process.platform === 'win32';
const binName = isWin ? 'pocketbase.exe' : './pocketbase';
const binPath = isWin ? path.join(__dirname, binName) : binName;

const args = process.argv.slice(2);

// Load env variables from apps/api/.env if present
let pbEncryptionKey = process.env.PB_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
try {
  const envPath = path.join(__dirname, '..', 'api', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        envVars[key] = value.trim();
      }
    });
    if (envVars.PB_ENCRYPTION_KEY) {
      pbEncryptionKey = envVars.PB_ENCRYPTION_KEY;
    } else if (envVars.ENCRYPTION_KEY && !pbEncryptionKey) {
      pbEncryptionKey = envVars.ENCRYPTION_KEY;
    }
  }
} catch (e) {
  console.warn('Could not read api/.env file for PB_ENCRYPTION_KEY fallback:', e.message);
}

// Fallback to the default docker-compose key if not set anywhere
if (!pbEncryptionKey) {
  pbEncryptionKey = 'your-secure-encryption-key-here';
}

// Ensure the key is exactly 32 bytes for AES-256 key size
pbEncryptionKey = pbEncryptionKey.padEnd(32, '0').slice(0, 32);

const child = spawn(binPath, args, {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    PB_ENCRYPTION_KEY: pbEncryptionKey
  }
});

child.on('close', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('Failed to start PocketBase process:', err);
  process.exit(1);
});

