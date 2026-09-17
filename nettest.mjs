const t = Date.now();
try {
  const r = await fetch('https://registry.npmjs.org/astro/7.3.3');
  console.log('HTTP', r.status, 'in', Date.now() - t, 'ms');
} catch (e) {
  console.log('ERR', e.message, 'in', Date.now() - t, 'ms');
}
