// Follow pages (customisation): a "Follow" button on countries, subjects, case files, story lines and evidence pages,
// saved in this browser only, and a "Your pages" list at the top of the home page.
(function () {
  const h = Lab.h; const KEY = 'lab.follow';
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v.slice(0, 40))); } catch (e) {} };
  const base = (hash) => hash.replace(/^#/, '').split('-').slice(0, 2).join('-');
  Lab.followed = read;
  const btn = (href, title) => { const b = h('button', { class: 'btn sm follow-btn' }); const paint = () => { const on = read().some((x) => x.h === href); b.textContent = on ? '★ Following' : '☆ Follow this page'; b.classList.toggle('primary', on); };
    b.onclick = () => { const v = read(); const i = v.findIndex((x) => x.h === href); if (i >= 0) v.splice(i, 1); else v.unshift({ h: href, t: title }); save(v); paint(); }; paint(); return b; };
  Lab.followList = () => { const v = read(); if (!v.length) return h('p', { class: 'tiny muted', style: { margin: '8px 0 0' } }, 'Tip: tap “☆ Follow this page” on any country, subject, case file or story line to keep it here.');
    return h('div', { style: { marginTop: '10px' } }, h('div', { class: 'tiny muted', style: { marginBottom: '4px' } }, '📌 Your pages'), h('div', { class: 'tn-bar' }, ...v.map((x) => h('a', { class: 'btn sm', href: x.h }, x.t)))); };
  const ROUTES = ['case', 'story', 'path', 'money', 'country', 'power', 'd', 'verify', 'tolls', 'cases', 'lies', 'parliaments', 'oppression'];
  ROUTES.forEach((r) => { const f = Lab.routes[r]; if (!f || f.__fl) return; const g = (app, args) => { const out = f(app, args); const href = '#' + [r, ...(args || [])].filter((x) => x != null && x !== '').join('-');
    let tries = 0; const place = () => { const hero = app.querySelector('.hero'); const t = ((hero && hero.querySelector('h1')) || app.querySelector('h1') || {}).textContent || document.title;
      if (!hero && tries++ < 15) return setTimeout(place, 100); if (app.querySelector('.follow-btn')) return; const title = String(t).trim().slice(0, 48) || 'Saved page';
      const keep = (r === 'country' || r === 'd') ? '#' + base(href.slice(1)) : href; const b = btn(keep, title); b.style.marginTop = '10px';
      const rep = h('button', { class: 'btn sm', style: { marginTop: '10px', marginLeft: '6px' }, title: 'Tell us if something on this page is wrong, misleading or one-sided', onclick: () => Lab.flagError && Lab.flagError() }, '⚑ Report a problem');
      if (hero) hero.append(h('div', null, b, rep)); else app.prepend(h('div', { style: { margin: '6px 0' } }, b, rep)); }; setTimeout(place, 0); return out; }; g.__fl = true; Lab.routes[r] = g; });
})();
