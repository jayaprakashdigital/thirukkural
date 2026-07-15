/**
 * Kural Studio — data assembly.
 * Composes a single "bundle" for a kural number from the four existing
 * data sources (Database, Story, Character, Script) so the rest of the
 * Kural Studio backend never re-reads or duplicates them.
 */
const fs = require("fs");
const path = require("path");

function kuralId(n) {
  return "TK-" + String(n).padStart(4, "0");
}

function parseKuralId(id) {
  const m = /^TK-(\d{4})$/.exec(String(id || "").trim());
  return m ? parseInt(m[1], 10) : null;
}

function loadJson(repoPath, file) {
  return JSON.parse(fs.readFileSync(path.join(repoPath, file), "utf8"));
}

/**
 * @param {string} repoPath - absolute path to the repo checkout (REPO_PATH)
 */
function createKuralBundleLoader(repoPath) {
  const thirukkural = loadJson(repoPath, "thirukkural.json").kural;
  const stories = loadJson(repoPath, "all_stories_final.json");
  const storiesById = new Map(stories.map((s) => [s.id, s]));

  const scriptsData = require(path.join(repoPath, "js/scripts-data.js"));
  const charactersData = require(path.join(repoPath, "js/characters-data-comprehensive.js"));

  const scriptsBySource = new Map(
    scriptsData.SCRIPT_SOURCE_STORIES.map((src) => [src.kuralNumber, src])
  );

  function getKuralBundle(n) {
    const id = kuralId(n);
    const kural = thirukkural.find((k) => k.Number === n) || null;
    const story = storiesById.get(id) || null;
    const characters = charactersData.getCharactersForKural(n) || [];
    const scriptSource = scriptsBySource.get(n) || null;
    const script = scriptSource ? scriptsData.buildScriptFromStory(scriptSource) : null;

    return {
      kuralId: id,
      kuralNumber: n,
      available: script !== null,
      kural,
      story,
      characters,
      script,
    };
  }

  return { getKuralBundle };
}

module.exports = { kuralId, parseKuralId, createKuralBundleLoader };
