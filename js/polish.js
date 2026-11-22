// The DOM's own append/prepend/replaceChildren/before/after print null, undefined and false as text ("null"). Many
// views pass optional parts as `cond ? el : null`, so skip those values everywhere instead of auditing every call.
(function () { const keep = (x) => x != null && x !== false;
  [Element.prototype, DocumentFragment.prototype, Document.prototype].forEach((P) => ['append', 'prepend', 'replaceChildren', 'before', 'after'].forEach((m) => {
    const o = Object.prototype.hasOwnProperty.call(P, m) ? P[m] : null; if (!o || o.__labSafe) return;
    const f = function (...a) { return o.apply(this, a.filter(keep)); }; f.__labSafe = true; P[m] = f; })); })();
/* Presentation polish (plan/DESIGN.md): headings, tabs and section titles drop decorative leading emoji,
   so pages read like a reference work. Emoji stay inside labs, chips and body text, where they carry meaning. */
(function () {
  const EMO = /^\s*(?:(?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|‍|\p{Emoji_Modifier}|\p{Extended_Pictographic})*\s*)+/u;
  const SEL = 'h1, h2, h3, .tab, .card > b:first-child, .card > div > b:first-child, summary';
  const clean = (root) => root.querySelectorAll(SEL).forEach((el) => {
    const t = el.firstChild; if (!t || t.nodeType !== 3) return;
    const v = t.nodeValue; const m = v.match(EMO); if (m && m[0].trim() && v.length > m[0].length) t.nodeValue = v.slice(m[0].length);
  });
  const app = () => document.getElementById('app') || document.body;
  let q = 0; const run = () => { q = 0; try { clean(app()); } catch (e) {} };
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(run); }).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', run);
})();
