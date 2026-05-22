#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env from the same directory as this script
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.trim().split('=');
    if (key && rest.length) process.env[key] = rest.join('=');
  });
}

const repo = process.argv[2];
if (!repo || !repo.includes('/')) {
  console.error('Usage: node report.js <owner>/<repo>');
  process.exit(1);
}
const [owner, repoName] = repo.split('/');

const ENV = { ...process.env };

function swytch(method, inputs = {}) {
  const args = ['exec', method,
    '--input', `owner=${owner}`,
    '--input', `repo=${repoName}`,
    '--json',
  ];
  for (const [k, v] of Object.entries(inputs)) {
    args.push('--input', `${k}=${v}`);
  }

  const result = spawnSync('swytchcode', args, {
    env: ENV,
    encoding: 'utf8',
    timeout: 30000,
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `swytchcode exited with code ${result.status}`);
  return JSON.parse(result.stdout);
}

function daysAgo(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function status(pushedAt) {
  const days = daysAgo(pushedAt);
  if (days <= 30)  return { emoji: '🟢', label: 'Actively maintained', days };
  if (days <= 180) return { emoji: '🟡', label: 'Needs attention',     days };
  return               { emoji: '🔴', label: 'Inactive',               days };
}

function main() {
  console.log(`\nFetching health report for ${owner}/${repoName}...\n`);

  let repoData, contribData, releaseData;

  try { repoData = swytch('repos.repo.get'); }
  catch (err) { console.error('Failed to fetch repo data:', err.message); process.exit(1); }

  try { contribData = swytch('repos.contributor.get'); } catch (_) {}
  try { releaseData = swytch('repos.releas.latest.get'); } catch (_) {}

  const r = repoData.data;
  const contributors = contribData?.data?.length != null ? contribData.data.length + '+' : 'N/A';
  const release = releaseData?.data?.tag_name ?? 'None';

  const { emoji, label, days } = status(r.pushed_at);

  const lines = [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  GitHub Health Report`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  📦 Repo          ${r.full_name}`,
    `  📝 Description   ${r.description ?? 'N/A'}`,
    `  ⭐ Stars         ${r.stargazers_count.toLocaleString()}`,
    `  🐛 Open issues   ${r.open_issues_count.toLocaleString()} (includes PRs)`,
    `  🕐 Last commit   ${formatDate(r.pushed_at)} (${days}d ago)`,
    `  👥 Contributors  ${contributors}`,
    `  🏷️  Latest release ${release}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  ${emoji} ${label}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    '',
  ];

  console.log(lines.join('\n'));
}

main();
