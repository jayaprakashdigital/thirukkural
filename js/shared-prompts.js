/**
 * Shared deterministic AI prompt templates — used by the browser (Script/Prompts
 * pages, Kural Studio) and by the Node Kural Studio backend (studio-server.js).
 * Pure functions only — no DOM, no localStorage — so this file works unchanged
 * via <script src> in the browser (classic-script global scope, like the rest
 * of this codebase) and via require() in Node.
 */
var STUDIO_STYLE = {
  artStyle: "cinematic realism, Tamil heritage aesthetic, warm earthy palette",
  imageQuality: "4K, high detail, sharp focus, professional cinematography",
  videoQuality: "24fps, color graded, smooth motion, cinematic",
  audio: "high quality 48kHz stereo, traditional Indian instruments (bansuri, veena, tabla)",
  negative: "blurry, low quality, distorted faces, extra limbs, watermark, text artifacts, oversaturated"
};

function autoGenImagePrompt(narration, location, emotion, characters) {
  if (!narration) return "";
  var parts = [narration.trim()];
  if (location) parts.push("Setting: " + location);
  if (emotion) parts.push("Mood: " + emotion.toLowerCase());
  if (characters && characters.length) parts.push("Characters: " + characters.join(", "));
  parts.push("Style: " + STUDIO_STYLE.artStyle + ", " + STUDIO_STYLE.imageQuality);
  parts.push("Negative: " + STUDIO_STYLE.negative);
  return parts.join(". ") + ".";
}
function autoGenVideoPrompt(narration, transition) {
  if (!narration) return "";
  var t = (transition || "cut").toLowerCase();
  return narration.trim() + ". Smooth " + t + " transition. Camera: gentle tracking shot. " + STUDIO_STYLE.videoQuality + ".";
}
function autoGenBackgroundPrompt(location, timeOfDay, weather) {
  if (!location && !timeOfDay && !weather) return "";
  var parts = [];
  if (location) parts.push(location);
  if (timeOfDay) parts.push("at " + timeOfDay.toLowerCase());
  var bg = parts.length ? parts.join(" ") : "Scene background";
  if (weather && weather !== "Clear") bg += ", " + weather.toLowerCase() + " weather";
  return bg + ". Detailed background, beautiful composition, cinematic atmosphere, " + STUDIO_STYLE.imageQuality + ".";
}
function autoGenLightingPrompt(timeOfDay, weather) {
  if (!timeOfDay && !weather) return "";
  var parts = [];
  if (timeOfDay) parts.push(timeOfDay + " lighting");
  if (weather && weather !== "Clear") parts.push(weather.toLowerCase() + " atmosphere");
  var tone = (timeOfDay && /night|dusk|dawn/i.test(timeOfDay)) ? "cool blue tones" : "warm natural tones";
  return parts.join(", ") + ". Cinematic light rays, volumetric lighting, " + tone + ".";
}
function autoGenCharacterPrompt(characters, expression, location) {
  if (!characters || !characters.length) return "";
  var parts = ["Characters: " + characters.join(", ")];
  parts.push("Expression: " + (expression || "Natural"));
  if (location) parts.push("Setting: " + location);
  parts.push("Detailed features, portrait lighting, sharp focus, " + STUDIO_STYLE.imageQuality);
  return parts.join(". ") + ".";
}
function autoGenMusicPrompt(emotion, location) {
  if (!emotion) return "";
  var parts = [emotion + " background instrumental music"];
  if (location) parts.push("for " + location + " scene");
  parts.push(STUDIO_STYLE.audio + ", gentle tempo, cinematic orchestration");
  return parts.join(" ") + ".";
}
function autoGenSFXPrompt(weather, environment) {
  var sounds = [];
  if (weather && weather !== "Clear") sounds.push(weather.toLowerCase());
  if (environment) sounds.push(environment.toLowerCase());
  if (!sounds.length) return "";
  return "Sound effects: " + sounds.join(", ") + ". " + STUDIO_STYLE.audio + ".";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STUDIO_STYLE,
    autoGenImagePrompt, autoGenVideoPrompt, autoGenBackgroundPrompt,
    autoGenLightingPrompt, autoGenCharacterPrompt, autoGenMusicPrompt, autoGenSFXPrompt
  };
}
