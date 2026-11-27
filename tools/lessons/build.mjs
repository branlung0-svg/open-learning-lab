#!/usr/bin/env node
// Builds lesson pages from lessons/src/<subject>/<slug>.mjs into lessons/<subject>/<slug>.html.
// Math is typeset at build time with KaTeX, so pages need only vendor/katex/katex.min.css and its fonts.
// Usage: node tools/lessons/build.mjs            (all lessons)
//        node tools/lessons/build.mjs --preview DIR   (also writes a self-contained preview copy to DIR)
// Authoring: Markdown with \( inline \) and \[ display \] math. Shortcodes on their own line:
//   {{fig:NAME|caption}}  interactive figure drawn by js/lesson-kit.js
//   {{img:KEY|caption}}   picture from data/commons.json (credited automatically)
//   {{steps}} {{quiz}} {{drills}} {{explain}}   interactive blocks fed by the lesson's data
// Wrap content in <div class="full-only"> ... </div> (blank lines inside) to hide it in the 10-minute refresher.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import katex from 'katex';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = path.join(ROOT, 'lessons', 'src');
const commons = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'commons.json'), 'utf8'));
const warnings = [];
let REL = '';
marked.setOptions({ gfm: true, breaks: false });

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function tex(src, display) {
  try { return katex.renderToString(src, { displayMode: display, throwOnError: true, output: 'htmlAndMathml', strict: 'warn' }); }
  catch (e) { warnings.push('KaTeX: ' + e.message); return `<code class="tex-error">${esc(src)}</code>`; }
}

// Pull math out before Markdown so underscores and asterisks inside TeX are never touched.
function protect(str) {
  const slots = [];
  const put = html => `@@M${slots.push(html) - 1}@@`;
  str = str.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => '\n\n' + put(`<div class="math-display">${tex(t.trim(), true)}</div>`) + '\n\n');
  str = str.replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => put(tex(t.trim(), false)));
  return [str, s => s.replace(/<p>(@@M\d+@@)<\/p>/g, '$1').replace(/@@M(\d+)@@/g, (_, i) => slots[+i])];
}

function picture(key, caption) {
  const c = commons[key];
  if (!c) { warnings.push(`picture ${key} not in data/commons.json yet (skipped)`); return ''; }
  const src = String(c.f).startsWith('http') ? c.f : REL + c.f;
  const who = String(c.artist || '').replace(/\s+/g, ' ').trim().replace(/^(.+?)\s*\1$/, '$1');  // Commons sometimes repeats the name
  const credit = [who, c.license].filter(Boolean).join(' · ');
  return `<figure class="pic"><a href="${esc(c.page)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(caption || c.cap || c.title)}" loading="lazy" width="${c.w || ''}" height="${c.h || ''}"></a>` +
    `<figcaption>${inline(caption || c.cap || c.title)} <span class="credit">${esc(credit)}. <a href="${esc(c.page)}" target="_blank" rel="noopener">Wikimedia Commons</a></span></figcaption></figure>`;
}

let figNo = 0;
function block(str) {
  const [s, restore] = protect(str);
  let out = s.replace(/^\{\{fig:([a-z0-9-]+)\|([\s\S]*?)\}\}$/gm, (_, name, cap) => {
    figNo++;
    return `<figure class="fig" data-fig="${name}" id="fig-${name}"><div class="fig-body" aria-live="polite"><noscript>This figure needs JavaScript.</noscript></div><figcaption><b>Figure ${figNo}.</b> ${marked.parseInline(cap)}</figcaption></figure>`;
  });
  out = out.replace(/^\{\{img:([a-z0-9:-]+)\|([\s\S]*?)\}\}$/gm, (_, key, cap) => picture(key, cap));
  out = out.replace(/^\{\{(steps|quiz|drills|explain)\}\}$/gm, (_, k) => `<div class="kit-${k}" data-kit="${k}"></div>`);
  return restore(marked.parse(out));
}
function inline(str) { const [s, restore] = protect(String(str)); return restore(marked.parseInline(s)); }

// Render every string in lesson data (steps, quiz, drills) as inline Markdown with math.
function deep(v) {
  if (typeof v === 'string') return inline(v);
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === 'object') { const o = {}; for (const [k, x] of Object.entries(v)) o[k] = ['answer','type','id','range','key','answers','review','hop','count'].includes(k) ? x : deep(x); return o; }
  return v;
}

function page(L, rel) {
  figNo = 0; REL = rel;
  const secs = L.sections.map((s, i) => {
    const num = s.num != null ? s.num : '';
    return `<section class="sec${s.full ? ' full-only' : ''}" id="${s.id}" data-title="${esc(s.title)}">` +
      `<h2>${num !== '' ? `<span class="num">${num}</span>` : ''}${inline(s.title)}</h2>${s.lede ? `<p class="sec-lede">${inline(s.lede)}</p>` : ''}${block(s.md)}</section>`;
  }).join('\n');
  const toc = L.sections.map(s => `<li${s.full ? ' class="full-only"' : ''}><a href="#${s.id}">${s.num != null ? `<span class="num">${s.num}</span>` : ''}${esc(s.toc || s.title)}</a></li>`).join('');
  const data = JSON.stringify(deep(L.data || {})).replace(/</g, '\\u003c');
  const pre = (L.prereqs || []).map(p => `<a href="${p.href || '#'}">${esc(p.id)} ${esc(p.t)}</a>`).join(', ');
  const nav = (x, dir) => x ? `<a class="pn ${dir}" href="${x.href || '#'}"${x.href ? '' : ' aria-disabled="true"'}><span>${dir === 'prev' ? 'Previous' : 'Next'}</span>${esc(x.id)} ${esc(x.t)}${x.href ? '' : ' <em>(being rebuilt)</em>'}</a>` : '<span></span>';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(L.id)} ${esc(L.title)} · Open Learning Lab</title>
<meta name="description" content="${esc(L.description)}">
<meta property="og:title" content="${esc(L.title)}">
<meta property="og:description" content="${esc(L.description)}">
<link rel="stylesheet" href="${rel}vendor/katex/katex.min.css">
<link rel="stylesheet" href="${rel}css/lesson.css?v=${L.stamp}">
<script>try{var t=localStorage.getItem('lesson-theme');if(t)document.documentElement.dataset.theme=t;if(localStorage.getItem('lesson-mode')==='short')document.documentElement.classList.add('short')}catch(e){}</script>
</head>
<body>
<a class="skip" href="#main">Skip to the lesson</a>
<header class="bar">
  <a class="brand" href="${rel}index.html#home">Open Learning Lab</a>
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${rel}index.html#d-math">Mathematics</a><span>›</span><a href="${rel}index.html#path-math">Tier ${L.tier}</a><span>›</span><span>${esc(L.unit)} ${esc(L.unitTitle)}</span></nav>
  <div class="bar-tools">
    <div class="mode" role="group" aria-label="Lesson length"><button type="button" data-mode="full"><span class="ll">Full lesson</span><span class="sl">Full</span></button><button type="button" data-mode="short"><span class="ll">${L.shortMinutes}-minute refresher</span><span class="sl">${L.shortMinutes} min</span></button></div>
    <button type="button" class="theme" aria-label="Switch between light and dark"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg></button>
  </div>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>
<div class="layout">
<nav class="toc" aria-label="Contents"><p class="toc-h">Contents</p><ol>${toc}</ol></nav>
<main id="main">
<header class="title">
  <p class="kicker">Lesson ${esc(L.id)} · Tier ${L.tier} · ${esc(L.unitTitle)}</p>
  <h1>${inline(L.title)}</h1>
  <p class="dek">${inline(L.dek)}</p>
  <p class="meta"><span>About ${L.minutes} minutes</span><span class="full-only">Refresher: ${L.shortMinutes} minutes</span><span>Needs: ${pre}</span><span>Updated ${esc(L.updated)}</span>${L.checked ? `<span>Fact-checked ${esc(L.checked)} (<a href="${rel}index.html#changes">corrections</a>)</span>` : ""}</p>
</header>
${L.summary ? `<aside class="summary" aria-label="The rules in one minute"><p class="summary-h">${inline(L.summary.title)}</p>${block(L.summary.md)}</aside>` : ''}
${secs}
<nav class="prevnext" aria-label="More lessons">${nav(L.prev, 'prev')}${nav(L.next, 'next')}</nav>
</main>
</div>
<footer class="foot">
  <p><a href="${rel}index.html#path-math">All math lessons</a> · <a href="https://github.com/branlung0-svg/open-learning-lab/issues/new?title=${encodeURIComponent('Lesson ' + L.id + ': ')}" target="_blank" rel="noopener">Report a problem with this lesson</a> · <a href="${rel}index.html#changes">Corrections log</a></p>
  <p>Free for everyone. Text CC BY-SA 4.0; pictures carry their own credits and licenses. Math typeset with KaTeX (MIT license).</p>
</footer>
<script type="application/json" id="lesson-data">${data}</script>
<script src="${rel}js/lesson-kit.js?v=${L.stamp}"></script>
</body>
</html>
`;
}

function* walk(dir) { for (const f of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, f.name); if (f.isDirectory()) yield* walk(p); else if (f.name.endsWith('.mjs')) yield p; } }

const args = process.argv.slice(2);
const previewDir = args.includes('--preview') ? path.resolve(args[args.indexOf('--preview') + 1]) : null;
const stamp = Math.floor(Date.now() / 1000);
const built = [];
for (const file of walk(SRC)) {
  const L = (await import(pathToFileURL(file).href + '?t=' + stamp)).default;
  L.stamp = stamp;
  const rel = path.relative(SRC, file);              // math/2-1-3.mjs
  const out = path.join(ROOT, 'lessons', rel.replace(/\.mjs$/, '.html'));
  const depth = rel.split(path.sep).length;          // lessons/math/x.html → ../../
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(L, '../'.repeat(depth)));
  built.push({ id: L.id, title: L.title, subject: L.subject, tier: L.tier, unit: L.unit, href: 'lessons/' + rel.replace(/\.mjs$/, '.html').split(path.sep).join('/'), minutes: L.minutes, updated: L.updated, checked: L.checked || null });
  if (previewDir) {
    fs.mkdirSync(previewDir, { recursive: true });
    fs.writeFileSync(path.join(previewDir, 'index.html'), page(L, ''));
  }
}
built.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
fs.writeFileSync(path.join(ROOT, 'data', 'lessons.json'), JSON.stringify(built, null, 1) + '\n');
for (const w of warnings) console.warn('WARN', w);
console.log(`built ${built.length} lesson(s)`);
