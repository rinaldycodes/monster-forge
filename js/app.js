function generateMonster() {
  const species = document.getElementById("species").value;
  const element = document.getElementById("element").value;
  const rarity = document.getElementById("rarity").value;
  const pose = document.getElementById("pose").value;
  const background = document.getElementById("background").value;

  const monster = {
    name: element + " " + species,
    species: species,
    element: element,
    rarity: rarity,
    pose: pose,
    background: background,
    color: monsterColors[element],
  };

  document.getElementById("json").textContent = JSON.stringify(
    monster,
    null,
    4,
  );

  document.getElementById("prompt").value = `Create a full body fantasy monster.

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

function randomMonster() {
  const random = (id) => {
    const s = document.getElementById(id);
    s.selectedIndex = Math.floor(Math.random() * s.options.length);
  };

  random("species");
  random("element");
  random("rarity");
  random("pose");
  random("background");

  generateMonster();
}

function copyPrompt() {
  navigator.clipboard.writeText(document.getElementById("prompt").value);
  alert("Prompt copied!");
}

document.addEventListener("DOMContentLoaded", generateMonster);
