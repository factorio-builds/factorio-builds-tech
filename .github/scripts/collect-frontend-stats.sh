#!/bin/bash
set -e

# Collect dependency stats for the frontend package.
# Outputs a single JSON file at .github/stats/frontend.json
#
# Run from the repo root:
#   ./.github/scripts/collect-frontend-stats.sh

STATS_DIR=".github/stats"
FRONTEND_DIR="frontend"
mkdir -p "$STATS_DIR"

# Run npm audit (may exit 1 when vulns exist — capture stdout regardless).
AUDIT_JSON=$(cd "$FRONTEND_DIR" && npm audit --json 2>/dev/null || true)

# Build the stats JSON in a single Node pass so we don't depend on bc/jq.
AUDIT_JSON="$AUDIT_JSON" node > "$STATS_DIR/frontend.json" <<'NODE'
const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = 'frontend';
const pkg = require(path.resolve(FRONTEND_DIR, 'package.json'));
const lock = require(path.resolve(FRONTEND_DIR, 'package-lock.json'));

// Lockfile total package count.
// - lockfileVersion >= 2: flat `packages` map keyed by path; skip the root "" entry.
// - lockfileVersion 1: walk nested `dependencies` tree.
function countLockfilePackages(lock) {
  if (lock.packages) {
    return Object.keys(lock.packages).filter((k) => k.startsWith('node_modules/')).length;
  }
  let total = 0;
  const walk = (deps) => {
    if (!deps) return;
    for (const name of Object.keys(deps)) {
      total += 1;
      walk(deps[name].dependencies);
    }
  };
  walk(lock.dependencies);
  return total;
}

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      total += dirSize(p);
    } else if (entry.isFile()) {
      try {
        total += fs.statSync(p).size;
      } catch {}
    }
  }
  return total;
}

function humanSize(bytes) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + 'G';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'M';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + 'K';
  return bytes + 'B';
}

const deps = Object.keys(pkg.dependencies || {}).sort();
const devDeps = Object.keys(pkg.devDependencies || {}).sort();

const nmBytes = dirSize(path.join(FRONTEND_DIR, 'node_modules'));
const nextDir = path.join(FRONTEND_DIR, '.next');
const nextTotal = dirSize(nextDir);
const nextCache = dirSize(path.join(nextDir, 'cache'));
const buildBytes = Math.max(0, nextTotal - nextCache);

const emptyVulns = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
let vulns = emptyVulns;
const auditRaw = process.env.AUDIT_JSON || '';
if (auditRaw.trim()) {
  try {
    const v = JSON.parse(auditRaw).metadata?.vulnerabilities || {};
    vulns = {
      info: v.info || 0,
      low: v.low || 0,
      moderate: v.moderate || 0,
      high: v.high || 0,
      critical: v.critical || 0,
    };
  } catch (err) {
    process.stderr.write(`Warning: failed to parse npm audit JSON: ${err.message}\n`);
  }
}

const stats = {
  packageCount: countLockfilePackages(lock),
  lockfileVersion: lock.lockfileVersion || 1,
  dependencyCount: deps.length,
  devDependencyCount: devDeps.length,
  dependencies: deps,
  devDependencies: devDeps,
  nodeModulesSize: humanSize(nmBytes),
  nodeModulesSizeBytes: nmBytes,
  buildSize: humanSize(buildBytes),
  buildSizeBytes: buildBytes,
  vulnerabilities: vulns,
};

process.stdout.write(JSON.stringify(stats, null, 2) + '\n');
NODE

# Echo a summary to the workflow log.
node -e "
  const s = require('./$STATS_DIR/frontend.json');
  console.log('Frontend stats:');
  console.log('  ' + s.packageCount + ' total packages in lockfile (v' + s.lockfileVersion + ')');
  console.log('  ' + s.dependencyCount + ' direct deps + ' + s.devDependencyCount + ' devDeps');
  console.log('  node_modules: ' + s.nodeModulesSize);
  console.log('  build (.next minus cache): ' + s.buildSize);
  const v = s.vulnerabilities;
  console.log('  vulns: ' + v.critical + ' crit / ' + v.high + ' high / ' + v.moderate + ' mod / ' + v.low + ' low / ' + v.info + ' info');
"
