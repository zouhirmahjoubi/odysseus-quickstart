#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { fallbackBlogs } from '../src/data/fallbackBlogs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration Paths
const WEB_ROOT = path.resolve(__dirname, '..');
const MONOREPO_ROOT = path.resolve(WEB_ROOT, '../..');
const PUBLIC_DIR = path.resolve(WEB_ROOT, 'public');
const CACHE_FILE = path.resolve(WEB_ROOT, 'tools/sitemap-dates.json');
const SITEMAP_OUTPUT = path.resolve(PUBLIC_DIR, 'sitemap.xml');

const BASE_URL = 'https://odysseusai.ai';
const INDEXNOW_KEY = 'f63a4087dbd74fa19bb01e9d1bf7a9f2';

// Map static routes to their source files relative to WEB_ROOT
const staticRoutes = [
  { route: '/', file: 'src/pages/HomePage.jsx' },
  { route: '/products', file: 'src/pages/ProductsPage.jsx' },
  { route: '/calculator', file: 'src/pages/CalculatorPage.jsx' },
  { route: '/workspace-simulator', file: 'src/pages/WorkspaceSimulatorPage.jsx' },
  { route: '/resources', file: 'src/pages/ResourcesPage.jsx' },
  { route: '/triage-wizard', file: 'src/pages/TriageWizardPage.jsx' },
  { route: '/launch-kit', file: 'src/pages/LaunchKitPage.jsx' },
  { route: '/llm-directory', file: 'src/pages/LLMDirectoryPage.jsx' },
  { route: '/workloads', file: 'src/pages/WorkloadsPage.jsx' },
  { route: '/odysseus-ai-install', file: 'src/pages/InstallHubPage.jsx' },
  { route: '/install/docker', file: 'src/pages/DockerInstallPage.jsx' },
  { route: '/install/ollama', file: 'src/pages/OllamaInstallPage.jsx' },
  { route: '/install/windows', file: 'src/pages/WindowsInstallPage.jsx' },
  { route: '/install/macbook', file: 'src/pages/MacBookInstallPage.jsx' },
  { route: '/fix', file: 'src/pages/FixPage.jsx' },
  { route: '/about', file: 'src/pages/AboutPage.jsx' },
  { route: '/contact', file: 'src/pages/ContactPage.jsx' },
  { route: '/privacy', file: 'src/pages/PrivacyPage.jsx' },
  { route: '/terms', file: 'src/pages/TermsOfServicePage.jsx' },
  { route: '/blog', file: 'src/pages/BlogListPage.jsx' },
  { route: '/login', file: 'src/pages/LoginPage.jsx' }
];

// Helper to get Git modification date
function getGitModificationDate(relativeWebFilePath) {
  try {
    const gitRootRelativePath = path.join('apps/web', relativeWebFilePath).replace(/\\/g, '/');
    const fullPath = path.resolve(WEB_ROOT, relativeWebFilePath);
    if (!fs.existsSync(fullPath)) return null;

    const stdout = execSync(`git log -1 --format="%cs" -- "${gitRootRelativePath}"`, {
      cwd: MONOREPO_ROOT,
      stdio: ['pipe', 'pipe', 'ignore']
    });
    const dateStr = stdout.toString().trim();
    return dateStr || null;
  } catch (error) {
    return null; // Git not available or file untracked
  }
}

// Load cache if it exists
let dateCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    dateCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    console.warn('⚠️ Could not parse sitemap-dates.json cache, resetting.');
  }
}

let isGitAvailable = false;
try {
  execSync('git rev-parse --is-inside-work-tree', { cwd: MONOREPO_ROOT, stdio: 'ignore' });
  isGitAvailable = true;
} catch (e) {}

const finalUrls = [];

// Process Static Routes
for (const item of staticRoutes) {
  let modDate = null;

  if (isGitAvailable) {
    modDate = getGitModificationDate(item.file);
    if (modDate) {
      dateCache[item.route] = modDate; // Update cache
    }
  }

  // Fallback to cache if Git failed/omitted (e.g. Docker)
  if (!modDate) {
    modDate = dateCache[item.route] || new Date().toISOString().split('T')[0];
  }

  finalUrls.push({ loc: `${BASE_URL}${item.route}`, lastmod: modDate });
}

// Process Blog/Guides Routes from fallbackBlogs.js
if (Array.isArray(fallbackBlogs)) {
  fallbackBlogs.forEach(post => {
    let rawDate = post.publication_date || post.publishedAt || post.updatedAt || '2026-06-15';
    // Format publication_date (e.g., 2026-06-11T00:00:00.000Z -> 2026-06-11)
    const formattedDate = rawDate.split('T')[0];
    finalUrls.push({
      loc: `${BASE_URL}/guides/${post.slug}`,
      lastmod: formattedDate
    });
  });
}

// Write out updated cache only if Git was running locally to preserve it for Docker
if (isGitAvailable) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(dateCache, null, 2), 'utf8');
    console.log('✅ sitemap-dates.json cache updated.');
  } catch (err) {
    console.warn('⚠️ Failed to write sitemap-dates.json cache:', err.message);
  }
}

// Build Lean XML String
let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

finalUrls.forEach(urlObj => {
  xmlContent += '  <url>\n';
  xmlContent += `    <loc>${urlObj.loc}</loc>\n`;
  xmlContent += `    <lastmod>${urlObj.lastmod}</lastmod>\n`;
  xmlContent += '  </url>\n';
});

xmlContent += '</urlset>\n';

// Ensure public directory exists and write sitemap
fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(SITEMAP_OUTPUT, xmlContent, 'utf8');
console.log(`🚀 Clean sitemap generated at ${SITEMAP_OUTPUT} (${finalUrls.length} URLs)`);

// Handle IndexNow Engine Notification Pings
const shouldPing = process.argv.includes('--ping');
if (shouldPing) {
  console.log('📡 Initializing IndexNow API submissions...');
  const engines = [
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  const payload = {
    host: BASE_URL.replace(/^https?:\/\//, ''),
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: finalUrls.map(u => u.loc)
  };

  engines.forEach(async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log(`   ✅ Successfully pinged ${new URL(endpoint).hostname}`);
      } else {
        console.error(`   ❌ Failed pinging ${new URL(endpoint).hostname}: Status ${response.status}`);
      }
    } catch (err) {
      console.error(`   ❌ Connection error to ${new URL(endpoint).hostname}:`, err.message);
    }
  });
}
