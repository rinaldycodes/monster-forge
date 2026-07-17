import { generateMonsterName } from "./nameGeneratorService.js";

export function createMonster(species, element, rarity, pose, background, colors) {
  return {
    name: generateMonsterName(species, element, rarity),
    species,
    element,
    rarity,
    pose,
    background,
    color: colors[element],
  };
}

export function generatePrompt(monster) {
  return `Create a full body fantasy monster.

Species: ${monster.species}
Element: ${monster.element}
Rarity: ${monster.rarity}
Main Color: ${monster.color}
Pose: ${monster.pose}

Style:
Cute fantasy RPG creature.  
Original creature design.
Large expressive eyes.
Soft fluffy fur.
Glowing elemental effects.
Highly detailed.
Game asset.
Centered composition.
Background: ${monster.background}
No text.
No watermark.
`;
}

export function getRandomOption(selectId) {
  const s = document.getElementById(selectId);
  return s.options[Math.floor(Math.random() * s.options.length)].value;
}
