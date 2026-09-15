/* =========================================================
   LEBAT MARITIME — front-end behaviour
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Data: shipments ---------------- */
  const SHIPMENTS = [
    {
      containers: ["LBTU4829137"],
      bl: "LB20419",
      refLabel: "LBTU 482913-7",
      vessel: "MV Selandia Star",
      voyage: "v.118W",
      service: "Asia Express",
      origin: "Shanghai, CN",
      equipment: "1 × 40′ HC",
      cargo: "Machine parts",
      eta: "Delivery est. 17 Sep, 12:00",
      status: { label: "In customs", cls: "work" },
      progress: 50,
      timeline: [
        { label: "Manifest & pre-clearance received", time: "12 Sep · 09:20", state: "done" },
        { label: "Discharged — Berth 3, Bay 12", time: "14 Sep · 06:55", state: "done" },
        { label: "Customs clearance — inspection booked", time: "15 Sep · in progress", state: "now" },
        { label: "Devan, sort & stage at CFS", time: "expected 16 Sep", state: "next" },
        { label: "Gate-out & final-mile delivery", time: "expected 17 Sep", state: "next" }
      ]
    },
    {
      containers: ["MSCU7712045"],
      bl: "MSC88121",
      refLabel: "MSCU 771204-5",
      vessel: "MV Kestrel Bay",
      voyage: "v.093W",
      service: "Reefer Loop",
      origin: "Busan, KR",
      equipment: "1 × 40′ Reefer, +4 °C",
      cargo: "Pharmaceuticals",
      eta: "Discharge est. today, 23:40",
      status: { label: "Discharging", cls: "work" },
      progress: 30,
      timeline: [
        { label: "Manifest & pre-clearance received", time: "10 Sep · 14:05", state: "done" },
        { label: "Discharging — Berth 5, reefer priority", time: "15 Sep · in progress", state: "now" },
        { label: "Customs clearance", time: "expected 16 Sep", state: "next" },
        { label: "Reefer plug-in & QC at cold store", time: "expected 16 Sep", state: "next" },
        { label: "Priority delivery, pharma lane", time: "expected 17 Sep", state: "next" }
      ]
    },
    {
      containers: ["LBTU1092268"],
      bl: "LB20377",
      refLabel: "LBTU 109226-8",
      vessel: "MV Nordwind Trader",
      voyage: "v.407W",
      service: "Feeder North",
      origin: "Haiphong, VN",
      equipment: "2 × 20′ GP",
      cargo: "Apparel, on pallets",
      eta: "Delivered 13 Sep · POD signed",
      status: { label: "Delivered", cls: "done" },
      progress: 100,
      timeline: [
        { label: "Manifest & pre-clearance received", time: "08 Sep · 11:40", state: "done" },
        { label: "Discharged — Berth 1", time: "11 Sep · 05:30", state: "done" },
        { label: "Customs cleared, green lane", time: "11 Sep · 16:10", state: "done" },
        { label: "Devanned & staged at CFS", time: "12 Sep · 10:25", state: "done" },
        { label: "Delivered — consignee signed", time: "13 Sep · 09:15", state: "done" }
      ]
    },
    {
      containers: ["ONEU3308114"],
      bl: "ONE55210",
      refLabel: "ONEU 330811-4",
      vessel: "MV Coral Meridian",
      voyage: "v.022E",
      service: "Reefer Loop",
      origin: "Kaohsiung, TW",
      equipment: "1 × 40′ Reefer, −18 °C",
      cargo: "Frozen seafood",
      eta: "Vessel ETA today, 14:15",
      status: { label: "At sea", cls: "eta" },
      progress: 10,
      timeline: [
        { label: "Manifest & pre-clearance received", time: "15 Sep · in progress", state: "now" },
        { label: "Berth & discharge — Berth 7", time: "expected today 14:15", state: "next" },
        { label: "Customs clearance", time: "expected today", state: "next" },
        { label: "Reefer plug-in at cold store", time: "expected 16 Sep", state: "next" },
        { label: "Frozen-chain delivery", time: "expected 16 Sep", state: "next" }
      ]
    }
  ];

  function scrollToEl(el, block) {
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: block || "start" });
    }
  }

  const norm = (s) => (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  function findShipment(raw) {
    const key = norm(raw);
    if (!key) return null;
    return (
      SHIPMENTS.find(
        (s) => s.containers.some((c) => c === key || key === norm(s.refLabel)) || norm(s.bl) === key
      ) || null
    );
  }

  /* ---------------- Port clock (UTC+7) ---------------- */
  function portTime() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 7 * 3600 * 1000);
  }
  const two = (n) => String(n).padStart(2, "0");
  function tickClock() {
    const t = portTime();
    const str = `${two(t.getHours())}:${two(t.getMinutes())}:${two(t.getSeconds())}`;
    const a = document.getElementById("port-clock");
    const b = document.getElementById("board-clock");
    if (a) { a.textContent = str; a.setAttribute("datetime", t.toISOString()); }
    if (b) b.textContent = str;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------------- Header state ---------------- */
  const head = document.getElementById("site-head");
  function onScroll() {
    head.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  const nav = document.getElementById("site-nav");
  const navToggle = document.getElementById("nav-toggle");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  navToggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) setNav(false);
  });

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            ro.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => ro.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------------- Animated counters ---------------- */
  function formatCount(value, el) {
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (el.dataset.format === "compact") {
      return value >= 1000 ? Math.round(value / 1000) + "k" : String(Math.round(value));
    }
    return decimals ? value.toFixed(decimals) : String(Math.round(value));
  }
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dur = 1500;
    const start = performance.now();
    function frame(t) {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(target * eased, el);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const countEls = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animateCount(en.target);
            co.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => co.observe(el));
  } else {
    countEls.forEach((el) => (el.textContent = formatCount(parseFloat(el.dataset.count), el)));
  }

  /* ---------------- Process step highlight ---------------- */
  const steps = document.querySelectorAll("[data-step]");
  if ("IntersectionObserver" in window && steps.length) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => en.target.classList.toggle("is-active", en.isIntersecting));
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    steps.forEach((s) => so.observe(s));
  }

  /* ---------------- Shipment tracking ---------------- */
  const trackInput = document.getElementById("track-input");
  const trackResult = document.getElementById("track-result");
  const trackForm = document.getElementById("track-form");

  function shipHTML(s) {
    const rows = s.timeline
      .map(
        (m) =>
          `<li class="is-${m.state}"><span class="t">${m.time}</span><span class="l">${m.label}</span></li>`
      )
      .join("");
    return `
      <article class="ship">
        <header class="ship__head">
          <p class="ship__ref">${s.refLabel}</p>
          <span class="status status--${s.status.cls}">${s.status.label}</span>
        </header>
        <dl class="ship__meta">
          <div><dt>Vessel / voyage</dt><dd>${s.vessel} · ${s.voyage}</dd></div>
          <div><dt>Service</dt><dd>${s.service}</dd></div>
          <div><dt>Origin</dt><dd>${s.origin}</dd></div>
          <div><dt>Equipment</dt><dd>${s.equipment}</dd></div>
          <div><dt>Cargo</dt><dd>${s.cargo}</dd></div>
          <div><dt>Next milestone</dt><dd>${s.eta}</dd></div>
        </dl>
        <div class="ship__progress">
          <div class="ship__progress-label"><span>Journey</span><span>${s.progress}%</span></div>
          <div class="ship__bar"><div class="ship__bar-fill" data-w="${s.progress}"></div></div>
        </div>
        <ol class="ship__timeline">${rows}</ol>
      </article>`;
  }

  function renderTrack(raw) {
    const s = findShipment(raw);
    if (!s) {
      trackResult.innerHTML =
        `<p class="track__error">No shipment found for “${escapeHTML(raw)}”. ` +
        `Check the container or B/L number, or try one of the samples above.</p>`;
      return;
    }
    trackResult.innerHTML = shipHTML(s);
    const fill = trackResult.querySelector(".ship__bar-fill");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { fill.style.width = fill.dataset.w + "%"; });
    });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  trackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    renderTrack(trackInput.value.trim());
  });
  document.querySelectorAll(".chip[data-ref]").forEach((chip) => {
    chip.addEventListener("click", () => {
      trackInput.value = chip.dataset.ref;
      renderTrack(chip.dataset.ref);
    });
  });

  /* Hero quick track → hand off to main tracker */
  const heroForm = document.getElementById("hero-track");
  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("hero-track-input").value.trim();
    trackInput.value = val;
    renderTrack(val);
    scrollToEl(document.getElementById("tracking"));
  });

  /* ---------------- Quote form ---------------- */
  const quoteForm = document.getElementById("quote-form");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setInvalid(field, invalid) {
    const wrap = field.closest(".field");
    const err = wrap.querySelector(".field__error");
    wrap.classList.toggle("is-invalid", invalid);
    if (err) err.hidden = !invalid;
    return !invalid;
  }

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("q-name");
    const company = document.getElementById("q-company");
    const email = document.getElementById("q-email");
    const cargo = document.getElementById("q-cargo");
    const units = document.getElementById("q-units");

    let ok = true;
    ok = setInvalid(name, name.value.trim().length < 2) && ok;
    ok = setInvalid(company, company.value.trim().length < 2) && ok;
    ok = setInvalid(email, !emailRe.test(email.value.trim())) && ok;
    ok = setInvalid(cargo, !cargo.value) && ok;
    const n = parseInt(units.value, 10);
    ok = setInvalid(units, !(n >= 1 && n <= 2000)) && ok;

    const success = document.getElementById("quote-success");
    if (!ok) {
      success.hidden = true;
      const firstInvalid = quoteForm.querySelector(".is-invalid input, .is-invalid select");
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    const ref = "Q-2026-" + String(Math.floor(1000 + Math.random() * 9000));
    document.getElementById("quote-ref").textContent = ref;
    success.hidden = false;
    quoteForm.reset();
    scrollToEl(success, "nearest");
  });

  /* Clear invalid state while typing */
  quoteForm.addEventListener("input", (e) => {
    const wrap = e.target.closest(".field");
    if (wrap && wrap.classList.contains("is-invalid")) {
      wrap.classList.remove("is-invalid");
      const err = wrap.querySelector(".field__error");
      if (err) err.hidden = true;
    }
  });

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
