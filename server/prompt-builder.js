/**
 * Kural Studio — AI image prompt builders.
 * Pure functions (no network, no fs) so they're unit-testable in isolation.
 * Mirrors the prompt style already used by the Prompts/Script pages via
 * js/shared-prompts.js, so Kural Studio images stay visually consistent
 * with what those pages already show/copy.
 */
const path = require("path");

function loadSharedPrompts(repoPath) {
  return require(path.join(repoPath, "js/shared-prompts.js"));
}

function describeCharacter(c) {
  const bits = [c.name];
  if (c.gender && c.gender !== "Gender-neutral") bits.push(c.gender);
  if (c.role) bits.push(c.role);
  const label = bits.join(", ");
  return c.details ? label + " — " + c.details : label;
}

/** @param {object} bundle - result of getKuralBundle(n) from kural-bundle.js */
function buildCharacterPrompt(bundle, sharedPrompts) {
  const characters = (bundle.characters || []).map(describeCharacter);
  const location = bundle.story ? bundle.story.location : "";
  const emotion = bundle.story ? bundle.story.emotions : "";
  const expression = emotion ? emotion.split("·")[0].trim() : "Serene";
  return sharedPrompts.autoGenCharacterPrompt(characters, expression, location);
}

/** @param {object} bundle - result of getKuralBundle(n) from kural-bundle.js */
function buildScenePrompt(bundle, sharedPrompts) {
  const story = bundle.story;
  if (!story) return "";
  const narration = story.hook || story.story || "";
  const location = story.location || "";
  const emotion = story.emotions ? story.emotions.split("·")[0].trim() : "";
  const characters = story.characters || [];
  return sharedPrompts.autoGenImagePrompt(narration, location, emotion, characters);
}

module.exports = { loadSharedPrompts, describeCharacter, buildCharacterPrompt, buildScenePrompt };
