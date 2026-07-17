/**
 * Name Generator Service
 * Generates random fantasy monster names based on species, element, and rarity.
 */

// ── Element-based name pools ────────────────────────────────────────────────
const elementNames = {
  Fire: {
    words: ["Blaze", "Inferno", "Ember", "Cinder", "Pyro", "Flare", "Ignis", "Fury", "Scorch", "Ash"],
    suffixes: ["claw", "mane", "fang", "tail", "bite", "scale", "heart", "storm", "spark", "roar"],
  },
  Water: {
    words: ["Aqua", "Tidal", "Cascade", "Torrent", "Mist", "Wave", "Splash", "Abyss", "Flood", "Ripple"],
    suffixes: ["fin", "wave", "tail", "scale", "bite", "spout", "stream", "rush", "current", "splash"],
  },
  Earth: {
    words: ["Terra", "Gaia", "Rock", "Stone", "Canyon", "Ridge", "Quake", "Ore", "Boulder", "Gorge"],
    suffixes: ["claw", "hide", "back", "horn", "tusk", "foot", "shard", "mound", "stone", "earth"],
  },
  Wind: {
    words: ["Zephyr", "Storm", "Breeze", "Gale", "Cyclone", "Cloud", "Sky", "Aero", "Tempest", "Whirl"],
    suffixes: ["wing", "feather", "gust", "soar", "flight", "plume", "wind", "dash", "swoop", "breeze"],
  },
  Ice: {
    words: ["Frost", "Glacier", "Cryo", "Blizzard", "Snow", "Ice", "Hail", "Chill", "Perma", "Shiver"],
    suffixes: ["fang", "shard", "tail", "scale", "bite", "heart", "claw", "storm", "frost", "snow"],
  },
  Thunder: {
    words: ["Volt", "Storm", "Thunder", "Bolt", "Shock", "Surge", "Static", "Flash", "Pulse", "Spark"],
    suffixes: ["strike", "bolt", "fang", "tail", "roar", "claw", "charge", "zap", "crash", "volt"],
  },
};

// ── Rarity-based title pools ────────────────────────────────────────────────
const rarityTitles = {
  Common:  ["Wild", "Forest", "Plain", "Woodland", "Common", "Verdant"],
  Rare:    ["Shadow", "Mystic", "Feral", "Crystal", "Viper", "Nocturnal", "Scarlet", "Silver"],
  Epic:    ["Ancient", "Elder", "Spectral", "Savage", "Rune", "Soul", "Obsidian", "Warped"],
  Legendary: ["Primordial", "Eternal", "Divine", "Celestial", "Cosmic", "Astral", "Zenith", "Mythic"],
};

// ── Utilities ───────────────────────────────────────────────────────────────
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a random monster name.
 *
 * @param {string} species  - Monster species (e.g. "Wolf", "Dragon")
 * @param {string} element  - Element (Fire, Water, Earth, Wind, Ice, Thunder)
 * @param {string} rarity   - Rarity (Common, Rare, Epic, Legendary)
 * @returns {string} A generated fantasy monster name
 */
export function generateMonsterName(species, element, rarity) {
  const el = elementNames[element];
  const titles = rarityTitles[rarity] || rarityTitles.Common;

  // Pattern definitions with weights
  const patterns = [
    // [patternFn, weight]
    // {ElementWord} {Species}   e.g. "Blaze Wolf"
    [() => `${pick(el.words)} ${species}`, 4],

    // {Title} {Species}         e.g. "Elder Dragon"
    [() => `${pick(titles)} ${species}`, 3],

    // {Species}{Suffix}         e.g. "Wolfclaw"
    [() => `${species}${pick(el.suffixes)}`, 3],

    // {Title} {ElementWord} {Species}   e.g. "Eternal Blaze Phoenix"
    [() => `${pick(titles)} ${pick(el.words)} ${species}`, 2],

    // {ElementWord} {Species}{Suffix}   e.g. "Inferno Wolfclaw"
    [() => `${pick(el.words)} ${species}${pick(el.suffixes)}`, 1],
  ];

  // Weighted random selection
  const totalWeight = patterns.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * totalWeight;
  for (const [patternFn, weight] of patterns) {
    roll -= weight;
    if (roll <= 0) {
      return patternFn();
    }
  }

  // Fallback (should never reach here)
  return `${pick(titles)} ${pick(el.words)} ${species}`;
}
