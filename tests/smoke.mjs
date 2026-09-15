/* Smoke test: executes the site's real assets/js/main.js against the real index.html in jsdom.
   Run: npm test   (requires `npm i` first for the jsdom devDependency) */
import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const js = readFileSync(path.join(root, "assets/js/main.js"), "utf8");

const virtualConsole = new VirtualConsole();
const jsdomErrors = [];
virtualConsole.on("jsdomError", (e) => jsdomErrors.push(String(e.message || e)));
virtualConsole.on("error", (...a) => jsdomErrors.push(a.join(" ")));

const dom = new JSDOM(html, {
  url: "http://localhost:3000/",
  pretendToBeVisual: true,
  runScripts: "outside-only",
  virtualConsole
});
const { window } = dom;
const { document } = window;

const failures = [];
const check = (name, cond) => {
  console.log((cond ? "PASS" : "FAIL") + "  " + name);
  if (!cond) failures.push(name);
};

/* Execute the real site script */
window.eval(js);

/* 1. Clocks */
const clock = document.getElementById("port-clock");
check("port clock element exists", !!clock);
check("board clock element exists", !!document.getElementById("board-clock"));
await new Promise((r) => setTimeout(r, 1200));
check("port clock ticks (not placeholder)", clock && /\d{2}:\d{2}:\d{2}/.test(clock.textContent));

/* 2. Nav toggle */
const toggle = document.getElementById("nav-toggle");
const nav = document.getElementById("site-nav");
toggle.click();
check("nav opens on toggle click", nav.classList.contains("is-open") && toggle.getAttribute("aria-expanded") === "true");
toggle.click();
check("nav closes on second click", !nav.classList.contains("is-open"));

/* 3. Tracker: sample chip renders shipment */
document.querySelector('.chip[data-ref="LBTU 482913-7"]').click();
const result = document.getElementById("track-result");
check("tracker renders vessel for container ref", result.textContent.includes("MV Selandia Star"));
check("tracker shows customs status", result.textContent.includes("In customs"));
check("timeline has 5 milestones", result.querySelectorAll(".ship__timeline li").length === 5);
check("progress fill width set from data", result.querySelector(".ship__bar-fill").dataset.w === "50");

/* 4. Tracker: B/L number resolves same shipment */
const input = document.getElementById("track-input");
input.value = "lb-20419";
document.getElementById("track-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
check("B/L reference resolves shipment", result.textContent.includes("LBTU 482913-7"));

/* 5. Tracker: unknown ref shows error */
input.value = "XXXX 000000-0";
document.getElementById("track-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
check("unknown ref shows error state", result.querySelector(".track__error") !== null);

/* 6. Quote form validation: invalid email flagged */
const qForm = document.getElementById("quote-form");
const emailField = document.getElementById("q-email");
document.getElementById("q-name").value = "Ada Mariner";
document.getElementById("q-company").value = "Meridian Trade Co.";
emailField.value = "not-an-email";
document.getElementById("q-cargo").value = "Dry goods (FCL)";
document.getElementById("q-units").value = "4";
qForm.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
check("invalid email flagged", emailField.closest(".field").classList.contains("is-invalid"));
check("success hidden while invalid", document.getElementById("quote-success").hidden === true);

/* 7. Quote form: valid submit shows reference */
emailField.value = "ada@meridian.example";
qForm.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
const success = document.getElementById("quote-success");
const ref = document.getElementById("quote-ref").textContent;
check("valid submit shows success", success.hidden === false);
check("reference format Q-2026-####", /^Q-2026-\d{4}$/.test(ref));

/* 8. Footer year */
check("footer year set", document.getElementById("year").textContent === String(new Date().getFullYear()));

/* 9. Hero form hands off to tracker */
document.getElementById("hero-track-input").value = "MSCU 771204-5";
document.getElementById("hero-track").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
check("hero track hands off to tracker", result.textContent.includes("MV Kestrel Bay"));

const relevantErrors = jsdomErrors.filter((e) => !/Not implemented/.test(e));
check("no unexpected jsdom runtime errors", relevantErrors.length === 0);
if (relevantErrors.length) console.log(relevantErrors.join("\n"));

console.log(failures.length === 0 ? "\nALL CHECKS PASSED" : `\n${failures.length} CHECK(S) FAILED`);
process.exit(failures.length === 0 ? 0 : 1);
