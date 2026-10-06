import {mkdir, readFile, writeFile, copyFile, rm} from 'node:fs/promises';
const files = ['styles.css','live.js','live-handoff.js','simulation.js','cookviewer.js','live-details.js','live-metrics.js','property-map.js','map-layout.js'];
await rm('dist',{recursive:true,force:true}); await mkdir('dist');
for (const file of files) await copyFile(`public/${file}`,`dist/${file}`);
let html = await readFile('public/live.html','utf8');
html = html.replace('<head>', `<head><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://tile.openstreetmap.org; connect-src https://gis.cookcountyil.gov; object-src 'none'; base-uri 'self'; form-action 'none'"><meta name="referrer" content="no-referrer">`);
await writeFile('dist/index.html',html);await writeFile('dist/.nojekyll','');
console.log(`Built static gallery: ${files.length + 2} allowlisted files.`);
