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
const LLMS_TXT_OUTPUT = path.resolve(PUBLIC_DIR, 'llms.txt');

const BASE_URL = 'https://odysseusai.ai';
const PROJECT_TITLE = 'Odysseus AI';
const PROJECT_DESC = 'A self-hosted local-first orchestration client cockpit for managing local LLMs, hardware requirements, and multi-agent crews securely.';
const INDEXNOW_KEY = 'f63a4087dbd74fa19bb01e9d1bf7a9f2';

// 1. Unified Route Metadata Definition
const staticRoutes = [
  { route: '/', file: 'src/pages/HomePage.jsx', name: 'Home Page', desc: 'PewDiePie\'s Odysseus AI local installation and configuration hub.' },
  { route: '/odysseus-Launch-Kit', file: 'src/pages/ProductsPage.jsx', name: 'Marketplace', desc: 'Hardware and software products optimized for Odysseus AI workflows.' },
  { route: '/odysseus-calculator', file: 'src/pages/CalculatorPage.jsx', name: 'Infrastructure & Cost Calculator', desc: 'Calculate AI API costs and VRAM requirement breakdown for local LLM models.' },
  { route: '/odysseus-workspace-simulator', file: 'src/pages/WorkspaceSimulatorPage.jsx', name: 'Workspace Simulator', desc: 'Interactive local model simulator and parameter tuning cockpit.' },
  { route: '/odysseus-resources', file: 'src/pages/ResourcesPage.jsx', name: 'Guides & Resources', desc: 'Technical tutorials, configuration manuals, and setup resources.' },
  { route: '/odysseus-triage-wizard', file: 'src/pages/TriageWizardPage.jsx', name: 'Triage Wizard', desc: 'Diagnose local AI setup issues and parse container logs.' },
  { route: '/odysseus-launch-kit', file: 'src/pages/LaunchKitPage.jsx', name: 'Launch Kit', desc: 'Odysseus AI complete local-first setup workbook and diagnostic checklist.' },
  { route: '/odysseus-llm-directory', file: 'src/pages/LLMDirectoryPage.jsx', name: 'LLM Directory', desc: 'Comprehensive catalog of local-first LLMs, parameter counts, and VRAM requirements.' },
  { route: '/odysseus-workloads', file: 'src/pages/WorkloadsPage.jsx', name: 'Workloads Framework', desc: 'Multi-agent crew task orchestrator and prompt compiler.' },
  { route: '/odysseus-ai-install', file: 'src/pages/InstallHubPage.jsx', name: 'Install Hub', desc: 'Central guide directory for deploying Odysseus AI on Windows, Mac, and Linux.' },
  { route: '/odysseus-install/docker', file: 'src/pages/DockerInstallPage.jsx', name: 'Docker Setup Guide', desc: 'Deploy Odysseus AI locally in containerized environments using Docker Compose.' },
  { route: '/odysseus-install/ollama', file: 'src/pages/OllamaInstallPage.jsx', name: 'Ollama Setup Guide', desc: 'Configure local model serving acceleration endpoints with Ollama.' },
  { route: '/odysseus-install/windows', file: 'src/pages/WindowsInstallPage.jsx', name: 'Windows Installation Guide', desc: 'Native Windows installation walkthrough with NVIDIA CUDA acceleration.' },
  { route: '/odysseus-install/macbook', file: 'src/pages/MacBookInstallPage.jsx', name: 'macOS Installation Guide', desc: 'Native macOS installation instructions with Metal API acceleration.' },
  { route: '/odysseus-fix', file: 'src/pages/FixPage.jsx', name: 'Error Doctor', desc: 'Diagnose and fix common terminal, CUDA context, and container issues.' },
  { route: '/odysseus-about', file: 'src/pages/AboutPage.jsx', name: 'About Us', desc: 'Our open-source local-first vision, background, and credentials.' },
  { route: '/odysseus-contact', file: 'src/pages/ContactPage.jsx', name: 'Contact Us', desc: 'Get in touch with support, community channels, and business inquiries.' },
  { route: '/odysseus-privacy', file: 'src/pages/PrivacyPage.jsx', name: 'Privacy Policy', desc: 'Our strict local-first zero data tracking privacy policy.' },
  { route: '/odysseus-terms', file: 'src/pages/TermsOfServicePage.jsx', name: 'Terms of Service', desc: 'Terms and conditions for utilizing the Odysseus AI companion tools.' },
  { route: '/odysseus-blog', file: 'src/pages/BlogListPage.jsx', name: 'Blog Directory', desc: 'Latest technical guides and articles regarding local LLM setups.' },
  { route: '/odysseus-login', file: 'src/pages/LoginPage.jsx', name: 'Auth Cockpit', desc: 'User login and registration cockpit workspace.' },
  { route: '/odysseus-comparison', file: 'src/pages/ComparisonPage.jsx', name: 'UI Interface Landscape Comparison', desc: 'Detailed architectural and performance comparison of local AI client workspaces.' },
  { route: '/odysseus-benchmark', file: 'src/pages/BenchmarkPage.jsx', name: 'Model Inference Benchmarks', desc: 'In-depth speed, latency, and quality benchmarks comparing local GGUF models.' },
  { route: '/odysseus-purchase-pro-license', file: 'src/pages/PurchaseProPage.jsx', name: 'Purchase Pro License', desc: 'Acquire commercial licenses and priority support blueprints for Odysseus AI.' }
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

  finalUrls.push({
    loc: `${BASE_URL}${item.route}`,
    lastmod: modDate,
    name: item.name,
    desc: item.desc
  });
}

// Process Blog/Guides Routes from fallbackBlogs.js
if (Array.isArray(fallbackBlogs)) {
  fallbackBlogs.forEach(post => {
    let rawDate = post.publication_date || post.publishedAt || post.updatedAt || '2026-06-15';
    const formattedDate = rawDate.split('T')[0];
    finalUrls.push({
      loc: `${BASE_URL}/guides/${post.slug}`,
      lastmod: formattedDate,
      name: `Guide: ${post.title}`,
      desc: post.excerpt || 'Technical guide regarding local LLM workflows.'
    });
  });
}

// Save Date Cache (Only if local git context is live)
if (isGitAvailable) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(dateCache, null, 2), 'utf8');
    console.log('✅ sitemap-dates.json cache updated.');
  } catch (err) {
    console.warn('⚠️ Failed to write sitemap-dates.json cache:', err.message);
  }
}

// Ensure distribution/public folders exist
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// --- OUTPUT 1: Clean sitemap.xml ---
let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
finalUrls.forEach(urlObj => {
  xmlContent += '  <url>\n';
  xmlContent += `    <loc>${urlObj.loc}</loc>\n`;
  xmlContent += `    <lastmod>${urlObj.lastmod}</lastmod>\n`;
  xmlContent += '  </url>\n';
});
xmlContent += '</urlset>\n';
fs.writeFileSync(SITEMAP_OUTPUT, xmlContent, 'utf8');
console.log(`✅ Sitemap compiled successfully at ${SITEMAP_OUTPUT} (${finalUrls.length} URLs)`);

// --- OUTPUT 2: Clean llms.txt ---
let llmsContent = `# ${PROJECT_TITLE}\n\n> ${PROJECT_DESC}\n\n## Key Resources\n\n`;
finalUrls.forEach(urlObj => {
  llmsContent += `- [${urlObj.name}](${urlObj.loc}) - ${urlObj.desc}\n`;
});
fs.writeFileSync(LLMS_TXT_OUTPUT, llmsContent, 'utf8');
console.log(`🤖 LLMs manifest compiled successfully at ${LLMS_TXT_OUTPUT}`);

// --- SEO / GEO / AEO Build Verification ---
console.log('\n🔍 Running SEO/GEO/AEO Build Verification...');

let geoCount = 0;
let aeoCount = 0;

staticRoutes.forEach(item => {
  try {
    const fullPath = path.resolve(WEB_ROOT, item.file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasJsonLd = content.includes('application/ld+json');
      if (hasJsonLd) {
        geoCount++;
      } else {
        console.warn(`   ⚠️ [GEO Warning] Missing JSON-LD Entity Schema in ${item.file} (route: ${item.route})`);
      }
    }
  } catch (err) {
    console.error(`   ✕ Error verifying ${item.file}:`, err.message);
  }
});

if (Array.isArray(fallbackBlogs)) {
  fallbackBlogs.forEach(post => {
    const content = post.content || '';
    const hasHeadings = /<h[23][^>]*>/.test(content);
    const hasListsOrTables = /<(ul|ol|table)[^>]*>/.test(content);

    if (hasHeadings && hasListsOrTables) {
      aeoCount++;
    } else {
      let issues = [];
      if (!hasHeadings) issues.push('missing headings (h2/h3)');
      if (!hasListsOrTables) issues.push('missing structured lists/tables');
      console.warn(`   ⚠️ [AEO Warning] Guide "${post.title}" might be less optimized: ${issues.join(' and ')}`);
    }
  });
}

console.log(`\n📊 Triple Threat Search Report:`);
console.log(`   • SEO Sitemap: Compiled ${finalUrls.length} URLs successfully.`);
console.log(`   • GEO Trust:   ${geoCount}/${staticRoutes.length} static pages have JSON-LD Schema.`);
console.log(`   • AEO Layout:  ${aeoCount}/${fallbackBlogs.length} dynamic posts optimized with headings and structured elements.`);

// --- IndexNow Push Notification Logic ---
if (process.argv.includes('--ping')) {
  console.log('📡 Pinging IndexNow API keys...');
  const engines = ['https://www.bing.com/indexnow', 'https://yandex.com/indexnow'];
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
        console.log(`   ✓ Successfully notified ${new URL(endpoint).hostname}`);
      }
    } catch (err) {
      console.error(`   ✕ API Ping Failed for ${new URL(endpoint).hostname}:`, err.message);
    }
  });
}
