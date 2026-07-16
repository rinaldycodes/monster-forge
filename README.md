# 🐲 Monster Forge — AI Prompt Engine

A web app to **generate AI prompts** for fantasy monster characters. Pick species, element, rarity, pose, and background — then get a ready-to-use prompt along with the monster's JSON data.

![Preview](assets/logo/android-chrome-192x192.png)

## ✨ Features

- **Generate Monster** — Create a prompt from selected options
- **Random Monster** — Shuffle all options randomly
- **Copy Prompt** — Copy prompt to clipboard
- **Monster JSON** — View monster data in JSON format

## 🚀 How to Use

1. Open `index.html` in your browser (no server required).
2. Pick monster options from the left panel.
3. Click **🎲 Generate** to create the prompt.
4. Click **📋 Copy Prompt** to copy it.

Or hit **🎲 Random** to get a random monster.

## 📁 Project Structure

```
monster-forge/
├── index.html                  # Main page structure
├── site.webmanifest            # PWA manifest
├── README.md
├── assets/
│   └── logo/                   # Icons & favicon
├── css/
│   └── style.css               # All styles
├── js/
│   ├── app.js                  # Orchestrator / main logic
│   ├── data.js                 # Config data (monsterColors)
│   ├── data/
│   │   └── species.json        # Species data (external JSON)
│   └── services/
│       ├── speciesService.js   # Fetch species from JSON
│       └── monsterService.js   # createMonster, generatePrompt, getRandomOption
```

## 🧱 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Dark theme, responsive grid
- **JavaScript (ES Module)** — Modular, service-based architecture
- **JSON** — Data separated from code

## 📦 Options

| Category | Choices |
|---|---|
| **Species** | 38 species (Wolf, Dragon, Phoenix, Slime, etc.) |
| **Element** | Fire, Water, Earth, Wind, Ice, Thunder |
| **Rarity** | Common, Rare, Epic, Legendary |
| **Pose** | Standing, Walking, Attacking |
| **Background** | Transparent, White, Forest, Dungeon, Volcano |

## 📄 Sample Prompt Output

```
Create a full body fantasy monster.

Species: Dragon
Element: Fire
Rarity: Legendary
Main Color: Red
Pose: Attacking

Style:
Cute fantasy RPG creature.
Original creature design.
Large expressive eyes.
Soft fluffy fur.
Glowing elemental effects.
Highly detailed.
Game asset.
Centered composition.
Background: Volcano
No text.
No watermark.
```

## 🛠️ Development

This is a purely *client-side* project — just open `index.html` in your browser. No build tools or server needed.

### Adding a new species

Edit `js/data/species.json`:

```json
[
  "Wolf",
  "Dragon",
  "NewSpecies"
]
```

### Adding a new element

Edit `js/data.js`:

```js
const monsterColors = {
  ...
  "NewElement": "Color",
};
```

---

Made with ❤️ for RPG fantasy lovers.
