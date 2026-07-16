# 🐲 Monster Forge — AI Prompt Engine

Aplikasi web untuk **men-generate prompt AI** karakter monster fantasi. Pilih species, element, rarity, pose, dan background — lalu dapatkan prompt siap pakai beserta JSON data monsternya.

![Preview](assets/logo/android-chrome-192x192.png)

## ✨ Fitur

- **Generate Monster** — Buat prompt dari pilihan yang tersedia
- **Random Monster** — Kocok acak semua opsi
- **Copy Prompt** — Salin prompt ke clipboard
- **Monster JSON** — Lihat data monster dalam format JSON

## 🚀 Cara Pakai

1. Buka `index.html` di browser (langsung jalan, tanpa server).
2. Pilih opsi monster di panel kiri.
3. Klik **🎲 Generate** untuk membuat prompt.
4. Klik **📋 Copy Prompt** untuk menyalin.

Atau klik **🎲 Random** biar dikocok acak.

## 📁 Struktur Proyek

```
monster-forge/
├── index.html                  # Struktur halaman utama
├── site.webmanifest            # PWA manifest
├── README.md
├── assets/
│   └── logo/                   # Icon & favicon
├── css/
│   └── style.css               # Semua styling
├── js/
│   ├── app.js                  # Orchestrator / main logic
│   ├── data.js                 # Data konfigurasi (monsterColors)
│   ├── data/
│   │   └── species.json        # Data species (JSON eksternal)
│   └── services/
│       ├── speciesService.js   # Fetch species dari JSON
│       └── monsterService.js   # createMonster, generatePrompt, getRandomOption
```

## 🧱 Tech Stack

- **HTML5** — Struktur semantik
- **CSS3** — Dark theme, responsive grid
- **JavaScript (ES Module)** — Modular, service-based architecture
- **JSON** — Data terpisah dari kode

## 📦 Options

| Kategori | Pilihan |
|---|---|
| **Species** | 38 species (Wolf, Dragon, Phoenix, Slime, dll) |
| **Element** | Fire, Water, Earth, Wind, Ice, Thunder |
| **Rarity** | Common, Rare, Epic, Legendary |
| **Pose** | Standing, Walking, Attacking |
| **Background** | Transparent, White, Forest, Dungeon, Volcano |

## 📄 Contoh Output Prompt

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

Proyek ini murni *client-side*, cukup jalankan `index.html` langsung di browser. Tidak perlu build tool atau server.

### Menambahkan species baru

Edit `js/data/species.json`:

```json
[
  "Wolf",
  "Dragon",
  "SpeciesBaru"
]
```

### Menambahkan element baru

Edit `js/data.js`:

```js
const monsterColors = {
  ...
  "ElementBaru": "Warna",
};
```

---

Dibuat dengan ❤️ untuk pecinta fantasi RPG.
