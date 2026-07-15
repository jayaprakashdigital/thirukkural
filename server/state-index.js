/**
 * Kural Studio — generation-state index.
 * A single small JSON file mapping kuralId -> { character, scene } generation
 * records. Lives outside the repo checkout (STUDIO_INDEX_PATH, e.g. a Docker
 * named volume) so `git reset --hard` deploys never touch it and it's never
 * committed. Whole-file read-modify-write — tiny (a few hundred kurals max
 * in the MVP), so this is simpler and safer than a real database here.
 */
const fs = require("fs");
const path = require("path");

function createStateIndex(indexPath) {
  function readIndex() {
    try {
      const raw = fs.readFileSync(indexPath, "utf8");
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  function writeIndex(index) {
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    const tmpPath = indexPath + ".tmp";
    fs.writeFileSync(tmpPath, JSON.stringify(index, null, 2));
    fs.renameSync(tmpPath, indexPath);
  }

  function getEntry(kuralId) {
    const index = readIndex();
    return index[kuralId] || { character: null, scene: null };
  }

  function setResult(kuralId, kind, record) {
    const index = readIndex();
    if (!index[kuralId]) index[kuralId] = { character: null, scene: null };
    index[kuralId][kind] = record;
    writeIndex(index);
    return index[kuralId];
  }

  function setFolderId(kuralId, folderId) {
    const index = readIndex();
    if (!index[kuralId]) index[kuralId] = { character: null, scene: null };
    index[kuralId].folderId = folderId;
    writeIndex(index);
  }

  return { readIndex, writeIndex, getEntry, setResult, setFolderId };
}

module.exports = { createStateIndex };
