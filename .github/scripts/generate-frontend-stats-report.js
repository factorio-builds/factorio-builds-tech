#!/usr/bin/env node

/**
 * Generate a markdown report comparing current frontend dependency stats
 * with a baseline (typically the main branch).
 *
 * Usage:
 *   node generate-frontend-stats-report.js <current-stats-dir> [baseline-stats-dir]
 *
 * Each directory should contain frontend.json (produced by collect-frontend-stats.sh).
 * The report is printed to stdout.
 */

const fs = require("fs");
const path = require("path");

const COMMENT_MARKER = "<!-- frontend-dependency-stats-report -->";

function readStats(dir) {
  if (!dir) return null;
  const file = path.join(dir, "frontend.json");
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function formatSize(bytes) {
  if (!bytes) return "0 KB";
  const mb = bytes / 1048576;
  if (mb < 0.1) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${mb.toFixed(1)} MB`;
}

function diffSize(current, baseline) {
  const cur = formatSize(current);
  if (baseline === null || baseline === undefined) return cur;
  const delta = current - baseline;
  if (delta === 0) return `${cur} (=)`;
  const sign = delta > 0 ? "+" : "-";
  return `${cur} (${sign}${formatSize(Math.abs(delta))})`;
}

function diffCount(current, baseline) {
  if (baseline === null || baseline === undefined) return String(current);
  const delta = current - baseline;
  if (delta === 0) return `${current} (=)`;
  const sign = delta > 0 ? "+" : "";
  return `${current} (${sign}${delta})`;
}

function vulnTotal(v) {
  if (!v) return 0;
  return (v.critical || 0) + (v.high || 0) + (v.moderate || 0) + (v.low || 0) + (v.info || 0);
}

function formatVulns(current, baseline) {
  const total = vulnTotal(current);
  if (total === 0) {
    if (baseline && vulnTotal(baseline) > 0) {
      return `0 (-${vulnTotal(baseline)}) ✅`;
    }
    return "0 ✅";
  }
  const parts = [];
  if (current.critical) parts.push(`${current.critical} critical`);
  if (current.high) parts.push(`${current.high} high`);
  if (current.moderate) parts.push(`${current.moderate} mod`);
  if (current.low) parts.push(`${current.low} low`);
  if (current.info) parts.push(`${current.info} info`);
  let out = parts.join(", ");
  if (baseline) {
    const delta = total - vulnTotal(baseline);
    if (delta !== 0) {
      out += ` (${delta > 0 ? "+" : ""}${delta})`;
    }
  }
  const icon = current.critical || current.high ? " ⚠️" : current.moderate || current.low ? " ⚠️" : "";
  return out + icon;
}

function diffDepList(currentDeps, baselineDeps) {
  if (!baselineDeps) return { added: [], removed: [] };
  const cur = new Set(currentDeps);
  const base = new Set(baselineDeps);
  return {
    added: [...cur].filter((d) => !base.has(d)).sort(),
    removed: [...base].filter((d) => !cur.has(d)).sort(),
  };
}

function generate(currentDir, baselineDir) {
  const current = readStats(currentDir);
  if (!current) {
    console.error(`Error: no frontend.json in ${currentDir}`);
    process.exit(1);
  }
  const baseline = readStats(baselineDir);
  const hasBaseline = baseline !== null;

  let md = `${COMMENT_MARKER}\n`;
  md += `## Frontend Dependency Stats\n\n`;
  if (!hasBaseline) {
    md += `> **Note:** No baseline found. Showing current stats only.\n\n`;
  }

  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Packages (lockfile) | ${diffCount(current.packageCount, baseline?.packageCount)} |\n`;
  md += `| Direct Dependencies | ${diffCount(current.dependencyCount, baseline?.dependencyCount)} |\n`;
  md += `| Dev Dependencies | ${diffCount(current.devDependencyCount, baseline?.devDependencyCount)} |\n`;
  md += `| node_modules Size | ${diffSize(current.nodeModulesSizeBytes, baseline?.nodeModulesSizeBytes)} |\n`;
  md += `| Build Output Size (.next minus cache) | ${diffSize(current.buildSizeBytes, baseline?.buildSizeBytes)} |\n`;
  md += `| Vulnerabilities | ${formatVulns(current.vulnerabilities, baseline?.vulnerabilities)} |\n`;
  md += `\n`;

  if (hasBaseline) {
    const depsDiff = diffDepList(current.dependencies, baseline.dependencies);
    const devDepsDiff = diffDepList(current.devDependencies, baseline.devDependencies);
    const hasChanges =
      depsDiff.added.length || depsDiff.removed.length || devDepsDiff.added.length || devDepsDiff.removed.length;

    if (hasChanges) {
      md += `### Dependency Changes\n\n`;
      md += `<details>\n<summary>Click to expand</summary>\n\n`;
      if (depsDiff.added.length) {
        md += `**Added dependencies:**\n`;
        for (const d of depsDiff.added) md += `- \`${d}\`\n`;
        md += `\n`;
      }
      if (depsDiff.removed.length) {
        md += `**Removed dependencies:**\n`;
        for (const d of depsDiff.removed) md += `- \`${d}\`\n`;
        md += `\n`;
      }
      if (devDepsDiff.added.length) {
        md += `**Added devDependencies:**\n`;
        for (const d of devDepsDiff.added) md += `- \`${d}\`\n`;
        md += `\n`;
      }
      if (devDepsDiff.removed.length) {
        md += `**Removed devDependencies:**\n`;
        for (const d of devDepsDiff.removed) md += `- \`${d}\`\n`;
        md += `\n`;
      }
      md += `</details>\n\n`;
    }
  }

  md += `---\n*Generated at ${new Date().toISOString()}*\n`;
  return md;
}

const [currentDir, baselineDir] = process.argv.slice(2);
if (!currentDir) {
  console.error("Usage: node generate-frontend-stats-report.js <current-stats-dir> [baseline-stats-dir]");
  process.exit(1);
}
process.stdout.write(generate(currentDir, baselineDir || null));
