import { getAllSpecies } from "./services/speciesService.js";
import {
  createMonster,
  generatePrompt,
  getRandomOption,
} from "./services/monsterService.js";
import {
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  toggleFavorite,
} from "./services/historyService.js";

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

/* ── Relative time helper ─────────────────────────────────────────────── */
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
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

  /* Save to history */
  addToHistory(monster, prompt);
  renderHistory();
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

/* ── History ──────────────────────────────────────────────────────────── */
let activeHistoryId = null;

function renderHistory() {
  const history = getHistory();
  const list = qs("historyList");
  const count = qs("historyCount");
  count.textContent = history.length;
  if (history.length === 0) {
    list.innerHTML = `<div class="history__empty"><span class="history__empty-icon">⚡</span><p>Generate a monster &mdash; your history will appear here</p></div>`;
    return;
  }
  list.innerHTML = history.map(e => {
    const el = e.monster.element;
    const rar = e.monster.rarity.toLowerCase();
    const c = monsterColors[el]?.hex || "#9CA3AF";
    const rc = rarityColors[e.monster.rarity]?.hex || "#9CA3AF";
    const fav = e.favorite ? "is-fav" : "";
    const act = e.id === activeHistoryId ? "is-active" : "";
    return `<div class="history__entry ${act}" data-id="${e.id}">
      <span class="history__entry-dot" style="background:${c}"></span>
      <div class="history__entry-info">
        <span class="history__entry-name">${e.monster.name}</span>
        <div class="history__entry-meta">
          <span class="history__entry-badge" style="color:${rc};background:color-mix(in srgb, ${rc} 15%, transparent)">${e.monster.rarity}</span>
          <span>${e.monster.species}</span><span>·</span><span>${el}</span><span>·</span>
          <span class="history__entry-date">${timeAgo(e.timestamp)}</span>
        </div>
      </div>
      <div class="history__entry-actions">
        <button class="history__entry-action ${fav}" data-fav="${e.id}" title="Favorite">★</button>
        <button class="history__entry-action--delete" data-del="${e.id}" title="Delete">✕</button>
      </div></div>`;
  }).join("");
}

function restoreFromHistory(id) {
  const history = getHistory();
  const entry = history.find(e => e.id === id);
  if (!entry) return;
  activeHistoryId = id;
  const m = entry.monster;
  qs("species").value = m.species;
  qs("element").value = m.element;
  qs("rarity").value = m.rarity;
  qs("pose").value = m.pose;
  qs("background").value = m.background;
  const monster = createMonster(m.species, m.element, m.rarity, m.pose, m.background, monsterColors);
  qs("monsterDisplay").innerHTML = `<span style="color:${monsterColors[m.element]?.hex || "#fff"}">⚡</span> ${monster.name}`;
  const hl = jsonHighlight(monster);
  qs("jsonDisplay").innerHTML = hl;
  qs("heroJsonPreview").innerHTML = hl;
  qs("promptDisplay").value = generatePrompt(monster);
  renderHistory();
  window.scrollTo({ top: qs("historySection").offsetTop - 100, behavior: "smooth" });
}

function initHistory() {
  renderHistory();
  qs("historyList").addEventListener("click", (e) => {
    const entry = e.target.closest(".history__entry");
    if (!entry || e.target.closest("[data-fav]") || e.target.closest("[data-del]")) return;
    restoreFromHistory(entry.dataset.id);
  });
  qs("historyList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return; e.stopPropagation();
    toggleFavorite(btn.dataset.fav); renderHistory();
  });
  qs("historyList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-del]");
    if (!btn) return; e.stopPropagation();
    if (activeHistoryId === btn.dataset.del) activeHistoryId = null;
    removeFromHistory(btn.dataset.del); renderHistory(); showToast("🗑️ Entry removed");
  });
  qs("btnClearHistory").addEventListener("click", () => {
    if (getHistory().length === 0) return;
    clearHistory(); activeHistoryId = null; renderHistory(); showToast("🗑️ History cleared");
  });
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
  initHistory();
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
  if (action === "history") {
    toggleCmdk(false);
    const section = qs("historySection");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }
});

/* Filter command palette items on input */
qs("cmdkInput")?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".cmdk__item").forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});
