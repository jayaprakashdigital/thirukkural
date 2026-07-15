const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { kuralId, parseKuralId, createKuralBundleLoader } = require("../server/kural-bundle.js");

const REPO_PATH = path.join(__dirname, "..");

test("kuralId formats a kural number as TK-000N", () => {
  assert.equal(kuralId(1), "TK-0001");
  assert.equal(kuralId(42), "TK-0042");
  assert.equal(kuralId(1330), "TK-1330");
});

test("parseKuralId parses a well-formed id and rejects malformed input", () => {
  assert.equal(parseKuralId("TK-0001"), 1);
  assert.equal(parseKuralId("TK-1330"), 1330);
  assert.equal(parseKuralId("tk-0001"), null);
  assert.equal(parseKuralId("TK-1"), null);
  assert.equal(parseKuralId("nonsense"), null);
  assert.equal(parseKuralId(""), null);
});

test("getKuralBundle assembles kural + story + characters + script for an MVP kural", () => {
  const { getKuralBundle } = createKuralBundleLoader(REPO_PATH);
  const bundle = getKuralBundle(1);

  assert.equal(bundle.kuralId, "TK-0001");
  assert.equal(bundle.available, true);
  assert.equal(bundle.kural.Number, 1);
  assert.ok(bundle.kural.Line1.length > 0);
  assert.equal(bundle.story.id, "TK-0001");
  assert.ok(Array.isArray(bundle.characters) && bundle.characters.length > 0);
  assert.ok(bundle.script && Array.isArray(bundle.script.scenes) && bundle.script.scenes.length > 0);
});

test("getKuralBundle marks kurals outside the MVP script range as unavailable, but still returns kural/story/character data", () => {
  const { getKuralBundle } = createKuralBundleLoader(REPO_PATH);
  const bundle = getKuralBundle(100);

  assert.equal(bundle.kuralId, "TK-0100");
  assert.equal(bundle.available, false);
  assert.equal(bundle.script, null);
  assert.ok(bundle.kural, "kural text should still be present for non-MVP kurals");
  assert.ok(bundle.story, "story should still be present for non-MVP kurals");
});
