# Development

Edit public/index.html, public/styles.css and the JavaScript modules in public/. These are the deployable source files, not generated output. No build or bundler is involved. Keep local links relative so the site works at both / and /sherwood/.

## Optional tests

Node 22+ and npm are development tools only:

```sh
npm ci
npm run check
npm test
npm run check:static
npx playwright install chromium
npm run test:browser
```

The browser checks serve public/ at /sherwood/, use authored County responses, intercept map tiles, and reject application API calls. They cover lookup, missing/error states, consent, Withdraw/Delete, reload clearing, linked map selection and narrow layouts. A live-source check is separate from deterministic CI. GitHub Actions installs its own test dependencies and uploads the same checked public/ folder only on manual dispatch from main.

`npm start` remains an optional Node-based static preview convenience; Python or any other static file server works equally well. Old src/ server and synthetic fixture tests are historical implementation coverage and are not deployed. render.yaml is historical hosting preparation, not the current Pages setup.

Product decisions: [PRD](PRD.md). Technical history: [architecture](ARCHITECTURE.md). Work status: [backlog](BACKLOG.md). Verification: [worklog](../worklog.md). FEAT-010 remains blocked pending the separate design discussion. Applicable public source-use and hosted smoke checks remain release prerequisites.
