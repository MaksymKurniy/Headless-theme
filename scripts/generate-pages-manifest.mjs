#!/usr/bin/env node
// Regenerates app/editor/pages.generated.json: every statically-navigable
// route this theme actually has, derived straight from the same filename
// convention @react-router/fs-routes uses for app/routes/*.tsx — so the list
// always matches reality instead of a hand-maintained one that silently
// drifts (forgetting a route someone just added, e.g. /basex-preview).
//
// Rules applied per filename (see React Router's flat-routes docs):
//   - '.' separates path segments (flat file naming, no nested folders yet)
//   - '_index' contributes no segment (it's the parent's index route)
//   - '(segment)' is optional (e.g. `($locale)`) — omitted for the default path
//   - a segment starting with '$' is dynamic/splat — needs real data we don't
//     have here, so the WHOLE route is skipped (e.g. products.$handle)
//   - a trailing '_' on a segment only escapes layout nesting, not the URL —
//     stripped from the segment, kept in the path (e.g. account_.login -> /account/login)
//   - '[...]' escapes its contents as a literal (e.g. '[sitemap.xml]') — these
//     are resource routes (xml/txt/json), not pages, so skipped entirely
//
// Routes with 2+ path segments are additionally grouped by their first
// segment (e.g. /collections/all groups under "collections") purely because
// they share that prefix — nothing here is a curated/hardcoded list, so a
// sibling route added later (e.g. pages.about-us.tsx, alongside the
// unlistable pages.$handle.tsx) shows up automatically under "pages" without
// this script needing to know about it by name.
import {readdirSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = path.join(__dirname, '..', 'app', 'routes');
const outFile = path.join(__dirname, '..', 'app', 'editor', 'pages.generated.json');

function filenameToPath(filename) {
  const name = filename.replace(/\.[jt]sx?$/, '');
  if (name.includes('[')) return null;

  const parts = [];
  for (const raw of name.split('.')) {
    if (raw === '' || raw === '_index') continue;
    if (raw.startsWith('(') && raw.endsWith(')')) continue;
    if (raw.startsWith('$')) return null;
    parts.push(raw.endsWith('_') ? raw.slice(0, -1) : raw);
  }
  return `/${parts.join('/')}`;
}

const seen = new Set();
const pages = [];

for (const entry of readdirSync(routesDir, {withFileTypes: true})) {
  if (!entry.isFile()) continue;
  const routePath = filenameToPath(entry.name);
  if (routePath === null || seen.has(routePath)) continue;
  seen.add(routePath);

  const segments = routePath.split('/').filter(Boolean);
  pages.push({
    path: routePath,
    group: segments.length > 1 ? segments[0] : null,
  });
}

pages.sort((a, b) => a.path.localeCompare(b.path));

await mkdir(path.dirname(outFile), {recursive: true});
await writeFile(outFile, `${JSON.stringify(pages, null, 2)}\n`);
console.log(`[basex] wrote ${pages.length} known pages to app/editor/pages.generated.json`);
