const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { createKuralBundleLoader } = require("../server/kural-bundle.js");
const { loadSharedPrompts, buildCharacterPrompt, buildScenePrompt } = require("../server/prompt-builder.js");

const REPO_PATH = path.join(__dirname, "..");

test("buildCharacterPrompt includes character names, location, and the studio style/negative prompt", () => {
  const { getKuralBundle } = createKuralBundleLoader(REPO_PATH);
  const sharedPrompts = loadSharedPrompts(REPO_PATH);
  const bundle = getKuralBundle(1);

  const prompt = buildCharacterPrompt(bundle, sharedPrompts);
  assert.ok(prompt.includes("Characters:"));
  assert.ok(prompt.includes(bundle.story.location));
  assert.ok(prompt.includes(sharedPrompts.STUDIO_STYLE.imageQuality));
});

test("buildScenePrompt includes the story hook, location, and negative prompt", () => {
  const { getKuralBundle } = createKuralBundleLoader(REPO_PATH);
  const sharedPrompts = loadSharedPrompts(REPO_PATH);
  const bundle = getKuralBundle(1);

  const prompt = buildScenePrompt(bundle, sharedPrompts);
  assert.ok(prompt.length > 0);
  assert.ok(prompt.includes(bundle.story.location));
  assert.ok(prompt.includes(sharedPrompts.STUDIO_STYLE.negative));
});

test("buildScenePrompt returns empty string when the kural has no story (defensive)", () => {
  const sharedPrompts = loadSharedPrompts(REPO_PATH);
  const prompt = buildScenePrompt({ story: null }, sharedPrompts);
  assert.equal(prompt, "");
});
