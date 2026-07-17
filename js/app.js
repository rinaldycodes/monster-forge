import { getAllSpecies } from "./services/speciesService.js";
import {
  createMonster,
  generatePrompt,
  getRandomOption,
} from "./services/monsterService.js";

/* ── Helpers ──────────────────────────────────────────────────────────── */

function qs(id) { return document.getElementById(id); }

/* ── JSON syntax highlighter ──────────────────────────────────────────── */
function jsonHighlight(obj) {
  const json = JSON.stringify(obj, null, 4);
  return json.replace(/("(?:[^"\\]|\\.)*")(?=\s*[:,}\]]|\s*$)|(\b(?:true|false|null)\b)/g, (m, str, kw) => {
    if (str) return `<span class="hl-str">${str}</span>`;
    return `<span class="hl-key">${kw}</span>`;
  });
}

/* ── Toast ────────────────────────────────────────────────────────────── */
function showToast(msg) {
  const t = qs("toast");
  t.textContent = msg;
  t.classList.add("is-visible");
  setTimeout(() => t.classList.remove("is-visible"), 2200);
}

/* ── Generate ─────────────────────────────────────────────────────────── */
function generateMonster() {
  const species = qs("species").value;
  const element = qs("element").value;
  const rarity = qs("rarity").value;
  const pose = qs("pose").value;
  const background = qs("background").value;

  const monster = createMonster(species, element, rarity, pose, background, monsterColors);

  /* Update monster name display */
  qs("monsterDisplay").innerHTML =
    `<span style="color:${monsterColors[element]?.hex || "#fff"}">⚡</span> ${monster.name}`;

  /* Update JSON code card with syntax highlighting */
  const highlighted = jsonHighlight(monster);
  qs("jsonDisplay").innerHTML = highlighted;

  /* Update hero preview as well */
  qs("heroJsonPreview").innerHTML = highlighted;

  /* Update prompt textarea */
  const prompt = generatePrompt(monster);
  qs("promptDisplay").value = prompt;
}

/* ── Random ───────────────────────────────────────────────────────────── */
function randomMonster() {
  ["species", "element", "rarity", "pose", "background"].forEach(id => {
    qs(id).value = getRandomOption(id);
  });
  generateMonster();
}

/* ── Copy prompt ──────────────────────────────────────────────────────── */
function copyPrompt() {
  const text = qs("promptDisplay").value;
  if (!text) { showToast("Nothing to copy — generate a monster first"); return; }
  navigator.clipboard.writeText(text).then(() => showToast("📋 Prompt copied!"));
}

/* ── Reset to defaults ────────────────────────────────────────────────── */
function resetDefaults() {
  qs("species").selectedIndex = 0;
  qs("element").selectedIndex = 0;
  qs("rarity").selectedIndex = 0;
  qs("pose").selectedIndex = 0;
  qs("background").selectedIndex = 0;
  generateMonster();
}

/* ── ⌘K Command Palette ───────────────────────────────────────────────── */
let cmdkOpen = false;

function toggleCmdk(open) {
  cmdkOpen = open !== undefined ? open : !cmdkOpen;
  qs("cmdk").classList.toggle("is-open", cmdkOpen);
  if (cmdkOpen) { qs("cmdkInput").focus(); qs("cmdkInput").value = ""; }
}

/* ── Nav frost-on-scroll ──────────────────────────────────────────────── */
function handleScroll() {
  qs("nav").classList.toggle("is-scrolled", window.scrollY > 10);
}

/* ── Page-load reveals (IntersectionObserver) ─────────────────────────── */
function initReveals() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-in"); });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
}

/* ── Populate species ─────────────────────────────────────────────────── */
async function populateSpecies() {
  const species = await getAllSpecies();
  const select = qs("species");
  species.forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s;
    select.appendChild(opt);
  });
  generateMonster();
}

/* ═════════════════════════════════════════════════════════════════════════
   INIT
   ═════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  populateSpecies();
  initReveals();
  handleScroll(); /* set initial state */
});

window.addEventListener("scroll", handleScroll, { passive: true });

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  /* ⌘K / Ctrl+K to toggle palette */
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    toggleCmdk();
  }
  /* Escape to close palette */
  if (e.key === "Escape" && cmdkOpen) toggleCmdk(false);
});

/* ── Button listeners ─────────────────────────────────────────────────── */

/* Generate buttons */
["btnGenerate", "btnGenerateHero", "btnGenerateWb"].forEach(id => {
  qs(id)?.addEventListener("click", generateMonster);
});

/* Random buttons */
["btnRandomHero", "btnRandomWb"].forEach(id => {
  qs(id)?.addEventListener("click", randomMonster);
});

/* Copy prompt */
qs("btnCopyPrompt")?.addEventListener("click", copyPrompt);

/* Command palette toggle */
qs("btnCmdkToggle")?.addEventListener("click", () => toggleCmdk());
qs("cmdkBackdrop")?.addEventListener("click", () => toggleCmdk(false));

/* Command palette actions */
qs("cmdkResults")?.addEventListener("click", (e) => {
  const item = e.target.closest(".cmdk__item");
  if (!item) return;
  const action = item.dataset.action;
  if (action === "generate") { generateMonster(); toggleCmdk(false); }
  if (action === "random")   { randomMonster();   toggleCmdk(false); }
  if (action === "copy")     { copyPrompt();      toggleCmdk(false); }
  if (action === "reset")    { resetDefaults();   toggleCmdk(false); }
});

/* Filter command palette items on input */
qs("cmdkInput")?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".cmdk__item").forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});
