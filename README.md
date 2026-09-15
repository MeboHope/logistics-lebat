# logistics-lebat

**Lebat Maritime** — a responsive marketing + operations website for port import logistics.
Serif (Fraunces) and sans (Inter) are paired for an elegant editorial style, and the layout
adapts from small phones to wide desktop screens.

## Run it

No build step, no dependencies:

```bash
npm start          # serves on http://0.0.0.0:3000 (PORT env optional)
```

or simply `node server.mjs`.

## What's inside

| Section        | Notes                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Hero           | Full-bleed port photography, quick shipment-track hand-off             |
| Stats          | Animated counters (TEU, dwell, first-pass rate, berths)                |
| Services       | Six import services: stevedoring → customs → CFS → bonded → reefer → haulage |
| Process        | Five-step import timeline with scroll-highlighted milestones           |
| Tracking       | Working demo tracker — container or B/L numbers, milestone timeline    |
| Vessel board   | Terminal schedule board with live port clock (UTC+7)                   |
| Cold chain     | Feature split section with reefer photography                          |
| Haulage        | Reverse split section on final-mile delivery                           |
| Rates          | Published rate card table                                              |
| Quote          | Validated quote-request form with success reference                    |

### Demo tracking references

- `LBTU 482913-7` or B/L `LB-20419` — in customs
- `MSCU 771204-5` — discharging (reefer)
- `LBTU 109226-8` — delivered
- `ONEU 330811-4` — at sea

## Stack

- Hand-written semantic HTML, CSS custom properties, vanilla JS (no frameworks).
- Self-hosted variable fonts: **Fraunces** (serif display) + **Inter** (sans UI),
  served as `woff2` from `assets/fonts/` — no CDN required.
- `server.mjs` is a zero-dependency static server (correct MIME types, 404 page).
- Mobile-first responsive breakpoints (nav collapses under 920 px, grids reflow,
  tables scroll horizontally on narrow screens), `prefers-reduced-motion` respected.

## Structure

```
index.html            single-page site
server.mjs            static file server
assets/
  css/styles.css      design tokens + all styles
  js/main.js          clocks, nav, reveals, counters, tracker, quote form
  fonts/              self-hosted Fraunces & Inter variable woff2
  img/                photography + favicon
```

## Testing

```bash
npm i && npm test
```

`tests/smoke.mjs` is a jsdom smoke test that executes the real `assets/js/main.js`
against the real `index.html`. It covers the shipment tracker lookups (container +
B/L refs, error state), quote-form validation and success reference, port clocks,
the mobile nav toggle and the hero→tracker hand-off.
