const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createStateIndex } = require("../server/state-index.js");

function tempIndexPath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "studio-index-test-"));
  return path.join(dir, "nested", "studio-index.json");
}

test("getEntry returns an empty record when the index file does not exist yet", () => {
  const { getEntry } = createStateIndex(tempIndexPath());
  assert.deepEqual(getEntry("TK-0001"), { character: null, scene: null });
});

test("setResult persists a record and getEntry reads it back", () => {
  const indexPath = tempIndexPath();
  const { setResult, getEntry } = createStateIndex(indexPath);

  setResult("TK-0001", "character", { driveFileId: "abc123", status: "completed", generatedAt: "2026-07-15T00:00:00Z" });
  const entry = getEntry("TK-0001");

  assert.equal(entry.character.driveFileId, "abc123");
  assert.equal(entry.character.status, "completed");
  assert.equal(entry.scene, null);
  assert.ok(fs.existsSync(indexPath), "index file should be created, including nested dirs");
});

test("setResult for a second kind on the same kural does not clobber the first", () => {
  const { setResult, getEntry } = createStateIndex(tempIndexPath());
  setResult("TK-0002", "character", { driveFileId: "char-1", status: "completed" });
  setResult("TK-0002", "scene", { driveFileId: "scene-1", status: "completed" });

  const entry = getEntry("TK-0002");
  assert.equal(entry.character.driveFileId, "char-1");
  assert.equal(entry.scene.driveFileId, "scene-1");
});

test("setFolderId stores the folder id alongside generation records", () => {
  const { setFolderId, setResult, getEntry } = createStateIndex(tempIndexPath());
  setResult("TK-0003", "character", { driveFileId: "x", status: "completed" });
  setFolderId("TK-0003", "folder-xyz");

  const entry = getEntry("TK-0003");
  assert.equal(entry.folderId, "folder-xyz");
  assert.equal(entry.character.driveFileId, "x");
});
