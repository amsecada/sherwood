# Sherwood

**A closer look at your Cook County property assessment.**

Sherwood lets you look up a home, explore nearby comparison properties, and see how their recorded County values differ. It demonstrates a complete journey from live public records to a simple explanation and an optional fictional request for help.

## What you can do

1. **Find your property.** Enter a Cook County street address or parcel identification number (PIN).
2. **Explore the comparison.** Sherwood searches up to 60 records using consistent matching rules, then shows five matches with lower County values first. Choose **Show all matches** to inspect the full group. The summary always includes all accepted matches, including higher values. Hover over a marker or table row to see which property it represents. Select **Details** to open a compact comparison beneath the table; details never open on hover. On phones, the table keeps the key values visible and puts secondary facts in Details.
3. **Understand the differences.** Compare recorded values, building sizes and ages, then read a short summary of the values shown.
4. **Try the next step.** Create a simulated request to a fictional organization. Withdraw or delete it whenever you like.

Try **202 W STATION ST** or PIN **01011000250000**. Address lookup uses the County’s spelling and abbreviations; leave out the city and ZIP code. If an address does not resolve, try its PIN.

## Real records, simulated handoff

Property records come directly from [Cook County’s CookViewer API](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0). The map always shows an OpenStreetMap street background when tiles are available. The comparison summary describes the displayed data; it is not a tax-savings estimate or a promise of an appeal outcome.

The organization and handoff are fictional. Nothing is sent or filed, and no account or contact information is required. Your comparison and simulated request stay in the current page’s memory. Refreshing or closing the page clears them. A simulated request also expires after one hour.

## A plain static website

Everything needed to serve Sherwood is in **[`public/`](public/)**: HTML, CSS and JavaScript. There is **no build step, npm installation, Node server, database or API key required to host the site**. Upload the contents of that folder to a static web host.

To preview locally without npm, use any static web server. If Python is installed, run this from the project folder:

```sh
python3 -m http.server 3100 --bind 127.0.0.1 --directory public
```

Then open [localhost:3100](http://127.0.0.1:3100/). Serve the files over HTTP or HTTPS rather than double-clicking `index.html`, because browser modules need a web origin. An internet connection is needed for live County records and map tiles.

## GitHub Pages

The included workflow tests the exact files in `public/` and checks outgoing links before publication. Select **GitHub Actions** as the source in **Settings → Pages**, then pushes to `main` publish automatically after both static tests and outgoing-link checks pass. Pull requests run checks without publishing. You can also run **Static checks and Pages** manually from the Actions tab. No `gh-pages` branch is needed.

Node/npm are used only by the optional development tests and automated checks, not by the website itself. See the [development guide](docs/DEVELOPMENT.md) for test commands and project details.
