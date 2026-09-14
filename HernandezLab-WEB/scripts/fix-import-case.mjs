import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SCAN_DIRS = ['src'];
const FILE_EXTENSIONS = new Set(['.js', '.jsx']);
const RESOLVE_EXTENSIONS = ['.jsx', '.js', '.module.css', '.css'];
const IMPORT_RE = /(?:\bfrom\s+|\brequire\(\s*|\bimport\(\s*|\bimport\s+)(['"])(\.[^'"]+)\1/g;

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (FILE_EXTENSIONS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
};

const fixSpecifier = (fileDir, spec) => {
  const parts = spec.split('/');
  let currentDir = fileDir;
  const fixedParts = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (part === '.' || part === '..' || part === '') {
      fixedParts.push(part);
      currentDir = path.resolve(currentDir, part || '.');
      continue;
    }

    let entries;
    try {
      entries = fs.readdirSync(currentDir);
    } catch {
      fixedParts.push(part);
      continue;
    }

    if (entries.includes(part)) {
      fixedParts.push(part);
      currentDir = path.join(currentDir, part);
      continue;
    }

    const exactCaseInsensitive = entries.find((e) => e.toLowerCase() === part.toLowerCase());
    if (exactCaseInsensitive) {
      fixedParts.push(exactCaseInsensitive);
      currentDir = path.join(currentDir, exactCaseInsensitive);
      continue;
    }

    if (isLast) {
      let found = null;
      for (const ext of RESOLVE_EXTENSIONS) {
        const candidate = (part + ext).toLowerCase();
        const match = entries.find((e) => e.toLowerCase() === candidate);
        if (match) {
          found = { match, ext };
          break;
        }
      }
      if (found) {
        fixedParts.push(found.match.slice(0, found.match.length - found.ext.length));
        continue;
      }
    }

    // No match on disk at all (broken import, unrelated to casing) — leave untouched.
    fixedParts.push(part);
  }

  return fixedParts.join('/');
};

let filesChanged = 0;
let fixesApplied = 0;

for (const scanDir of SCAN_DIRS) {
  const absScanDir = path.join(ROOT, scanDir);
  if (!fs.existsSync(absScanDir)) continue;

  for (const file of walk(absScanDir)) {
    const original = fs.readFileSync(file, 'utf8');
    const fileDir = path.dirname(file);
    let changed = false;

    const updated = original.replace(IMPORT_RE, (match, quote, spec) => {
      const fixed = fixSpecifier(fileDir, spec);
      if (fixed !== spec) {
        changed = true;
        fixesApplied++;
        console.log(`fix: ${path.relative(ROOT, file)}\n  "${spec}" -> "${fixed}"`);
        return match.replace(spec, fixed);
      }
      return match;
    });

    if (changed) {
      fs.writeFileSync(file, updated);
      filesChanged++;
    }
  }
}

console.log(`\n${fixesApplied} import(s) fixed across ${filesChanged} file(s).`);
