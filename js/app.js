import { getAllSpecies } from "./services/speciesService.js";
import {
  createMonster,
  generatePrompt,
  getRandomOption,
} from "./services/monsterService.js";

function generateMonster() {
  const species = document.getElementById("species").value;
  const element = document.getElementById("element").value;
  const rarity = document.getElementById("rarity").value;
  const pose = document.getElementById("pose").value;
  const background = document.getElementById("background").value;

  const monster = createMonster(
    species,
    element,
    rarity,
    pose,
    background,
    monsterColors,
  );

  document.getElementById("json").textContent = JSON.stringify(
    monster,
    null,
    4,
  );
  document.getElementById("prompt").value = generatePrompt(monster);
}

function randomMonster() {
  const ids = ["species", "element", "rarity", "pose", "background"];
  ids.forEach(function (id) {
    document.getElementById(id).value = getRandomOption(id);
  });
  generateMonster();
}

function copyPrompt() {
  navigator.clipboard.writeText(document.getElementById("prompt").value);
  alert("Prompt copied!");
}

async function populateSpecies() {
  const species = await getAllSpecies();
  const select = document.getElementById("species");
  species.forEach(function (s) {
    const opt = document.createElement("option");
    opt.textContent = s;
    select.appendChild(opt);
  });
  generateMonster();
}

document.addEventListener("DOMContentLoaded", function () {
  populateSpecies();
});
document
  .getElementById("btnGenerate")
  .addEventListener("click", generateMonster);

document.getElementById("btnRandom").addEventListener("click", randomMonster);

document.getElementById("btnCopyPrompt").addEventListener("click", copyPrompt);
