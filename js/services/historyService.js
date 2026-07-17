/**
 * History Service
 * Manages monster generation history via localStorage.
 */

const STORAGE_KEY = 'monsterForge_history';
const MAX_HISTORY = 50;

/**
 * Get all history entries.
 * @returns {Array<{id: string, monster: object, prompt: string, timestamp: number}>}
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add a monster + prompt to history.
 * @param {object} monster - The monster object
 * @param {string} prompt - The generated prompt
 */
export function addToHistory(monster, prompt) {
  const history = getHistory();

  const entry = {
    id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    monster,
    prompt,
    timestamp: Date.now(),
  };

  history.unshift(entry);

  // Keep only the latest MAX_HISTORY entries
  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
}

/**
 * Remove a history entry by id.
 * @param {string} id
 */
export function removeFromHistory(id) {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Clear all history.
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Toggle favorite status for an entry.
 * @param {string} id
 */
export function toggleFavorite(id) {
  const history = getHistory();
  const entry = history.find(e => e.id === id);
  if (entry) {
    entry.favorite = !entry.favorite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  return entry?.favorite ?? false;
}
