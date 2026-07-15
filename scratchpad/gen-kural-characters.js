/**
 * Generates js/kural-characters.js from all_stories_final.json.
 * Run once with: node scratchpad/gen-kural-characters.js
 * Regenerate if all_stories_final.json changes.
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "all_stories_final.json");
const OUT = path.join(__dirname, "..", "js", "kural-characters.js");

const stories = JSON.parse(fs.readFileSync(SRC, "utf8"));

const entries = stories.map((s, i) => ({
  n: i + 1,
  id: s.id,
  title: s.title || "",
  theme: s.theme || "",
  emotions: s.emotions || "",
  location: s.location || "",
  characters: Array.isArray(s.characters) ? s.characters : [],
  hook: s.hook || "",
  moral: s.moral || ""
}));

const header = `/**
 * KURAL_CHARACTERS — one entry per kural (all 1330), extracted from all_stories_final.json.
 * Fields: n (number), id (TK-0001), title, theme, emotions, location,
 *         characters (raw name/age strings as written in the story cast),
 *         hook, moral.
 * This is the source of truth for "who appears in this kural's story" —
 * js/character-derive.js turns each raw character string into a full
 * deep-detail profile deterministically.
 * Regenerate with scratchpad/gen-kural-characters.js if all_stories_final.json changes.
 */
const KURAL_CHARACTERS = `;

const footer = ";\n";

fs.writeFileSync(OUT, header + JSON.stringify(entries) + footer, "utf8");
console.log("Wrote " + entries.length + " entries to " + OUT);
