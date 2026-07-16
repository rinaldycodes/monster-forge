export async function getAllSpecies() {
  const res = await fetch("./js/data/species.json");
  const species = await res.json();

  return species;
}
