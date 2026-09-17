const w = await (await fetch('https://registry.npmjs.org/wrangler')).json();
const vers = Object.keys(w.versions).filter(v => /^4\.13[0-9]\./.test(v)).sort();
console.log('Candidate wrangler 4.13x versions:', vers.slice(-12).join(', '));
for (const v of vers.slice(-12)) {
  const dep = w.versions[v].dependencies?.miniflare;
  if (!dep) { console.log(v, 'no miniflare dep'); continue; }
  // check if that miniflare version is published
  let ok = '?';
  try {
    const r = await fetch('https://registry.npmjs.org/miniflare/' + encodeURIComponent(dep));
    ok = r.status === 200 ? 'OK' : ('MISSING:' + r.status);
  } catch (e) { ok = 'ERR:' + e.message; }
  console.log(v, '-> miniflare', dep, '=>', ok);
}
