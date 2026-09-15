# logistics-lebat — PRAL · Power Ride Africa Logistics

A responsive marketing + operations website for **PRAL (Power Ride Africa Logistics)** —
port import logistics out of the Port of Mombasa (Kilindini Harbour), Kenya.

Design language: **royal blue + red + white**, taken from the PRAL brand truck
(`assets/img/pral-truck.jpg`), with an elegant serif/sans pairing — **Fraunces** for
display type and **Inter** for UI/body — adapting cleanly from phones to wide desktops.

> **Brand image note:** `assets/img/pral-truck.jpg` is a generated recreation of the PRAL
> truck photo (the original attachment never reached the workspace filesystem). To use the
> original photo, simply overwrite that file — every reference already points at it.

## Run it

No build step:

```bash
npm start          # serves on http://0.0.0.0:3000 (PORT env optional)
```

## What's inside

| Section        | Notes                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Hero           | PRAL truck feature image, slogan headline, quick shipment-track       |
| Stats          | Animated counters (TEU, dwell, first-pass rate, fleet)                |
| Services       | Six import services: stevedoring → customs → CFS → bonded → reefer → haulage |
| Process        | Five-step import timeline with scroll-highlighted milestones          |
| Tracking       | Working demo tracker — container or B/L numbers, milestone timeline   |
| Vessel board   | Kilindini schedule board with live port clock (UTC+3)                 |
| Cold chain     | Feature split section with reefer photography                         |
| Haulage        | Reverse split section on final-mile delivery                          |
| Rates          | Published rate card table                                             |
| Quote          | Validated quote-request form with success reference                   |

### Demo tracking references

- `LBTU 482913-7` or B/L `LB-20419` — in customs
- `MSCU 771204-5` — discharging (reefer)
- `LBTU 109226-8` — delivered
- `ONEU 330811-4` — at sea

## Stack

- Hand-written semantic HTML, CSS custom properties, vanilla JS (no frameworks).
- Self-hosted variable fonts: **Fraunces** (serif) + **Inter** (sans) in `assets/fonts/`.
- `server.mjs` — zero-dependency static server (correct MIME types, 404 page).
- Responsive breakpoints: nav collapses under 920 px, grids reflow, tables scroll
  horizontally on narrow screens; `prefers-reduced-motion` respected.

## Structure

```
index.html            single-page site
server.mjs            static file server
assets/
  css/styles.css      design tokens (PRAL palette) + all styles
  js/main.js          clocks (UTC+3), nav, reveals, counters, tracker, quote form
  fonts/              self-hosted Fraunces & Inter variable woff2
  img/                pral-truck.jpg (brand feature), hero-port.jpg, reefer.jpg,
                      haulage.jpg, favicon.svg
tests/smoke.mjs       jsdom smoke test
```

## Testing

```bash
npm i && npm test
```

`tests/smoke.mjs` executes the real `assets/js/main.js` against the real `index.html`
in jsdom: tracker lookups (container + B/L refs, error state), quote-form validation
and success reference, port clocks, mobile nav toggle, hero→tracker hand-off.
