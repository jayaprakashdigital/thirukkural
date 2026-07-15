(function () {
/**
 * Script Detail — Production Scene Editor
 * Tabbed scene editor with AI auto-generation.
 */

const SCENE_STATUS_OPTIONS = ["Draft", "Ready", "Final"];
const IMAGE_MODELS = ["DALL-E 3", "Midjourney v6", "Stable Diffusion XL", "Firefly", "Imagen 2"];
const VIDEO_MODELS = ["Runway Gen-3", "Pika 2.0", "Sora", "Kling", "Luma Ray2"];
const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:5", "3:2"];
const VOICE_GENDERS = ["Male", "Female"];
const VOICE_AGES = ["Young (20-35)", "Middle (35-50)", "Mature (50+)"];
const LANGUAGE_OPTIONS = ["Tamil", "English", "Bilingual"];
const CAMERA_ANGLES = ["Wide Shot", "Close Up", "Medium", "Top View", "POV", "Low Angle", "Dutch Angle", "Over Shoulder"];
const CAMERA_MOVEMENTS = ["Static", "Pan", "Tilt", "Dolly", "Tracking", "Zoom", "Handheld", "Drone"];
const LENS_OPTIONS = ["24mm", "35mm", "50mm", "85mm", "135mm", "Wide Angle", "Macro"];
const SHOT_TYPES = ["Establishing", "Master", "Medium Close-Up", "Insert", "Cutaway", "Reaction"];
const COMPOSITION_OPTIONS = ["Rule of Thirds", "Center", "Leading Lines", "Symmetry", "Golden Ratio", "Frame Within Frame"];
const FOCUS_OPTIONS = ["Deep Focus", "Shallow DOF", "Rack Focus", "Soft Focus", "Tilt-Shift"];
const WEATHER_OPTIONS = ["Clear", "Cloudy", "Rain", "Fog", "Storm", "Golden Hour", "Overcast"];
const SEASON_OPTIONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];
const TIME_OF_DAY = ["Dawn", "Morning", "Noon", "Afternoon", "Evening", "Dusk", "Night"];
const LIGHTING_OPTIONS = ["Natural", "Golden Hour", "Soft Diffuse", "Hard Light", "Backlit", "Magic Hour", "Overcast", "Candlelight"];
const VOICE_EMOTIONS = ["Calm", "Warm", "Serious", "Joyful", "Reverent", "Gentle", "Dramatic", "Inspiring"];
const AMBIENT_OPTIONS = ["Forest", "Rain", "Wind", "Temple Bells", "River", "Birds", "Market Crowd", "Waves", "Silence", "City"];
const SFX_LIST = ["Birds Chirping", "Temple Bell", "Footsteps", "Door Creak", "Water Drops", "Wind Gust", "Children Laughing", "Paper Rustle", "Thunder", "Conch Sound"];

let currentKuralNumber = null;

function getKuralFromQuery() {
  var params = new URLSearchParams(window.location.search);
  var n = parseInt(params.get("kural"), 10);
  return MVP_KURAL_NUMBERS.includes(n) ? n : MVP_KURAL_NUMBERS[0];
}

function characterOptionsFor(script) {
  var set = new Set();
  script.scenes.forEach(function (s) {
    (s.characters || []).forEach(function (c) { set.add(c); });
  });
  set.add("Thiruvalluvar");
  return Array.from(set);
}

/* Prompt auto-generation (STUDIO_STYLE, autoGenImagePrompt, etc.) now lives
   in shared.js so scripts-data.js can use it too when generating scenes. */

/* ===== HEADER ===== */
function renderHeader(script) {
  document.getElementById("breadcrumb-kural").textContent = script.kuralId;
  document.getElementById("sd-kural-id").textContent = script.kuralId;
  document.getElementById("sd-open-studio").href = "kural-detail.html?id=" + script.kuralId;
  document.getElementById("sd-theme").textContent = script.theme;
  document.getElementById("sd-title").textContent = script.title;
  document.getElementById("sd-scene-count").textContent = script.scenes.length;
  document.getElementById("sd-duration").textContent = formatDuration(calcTotalDuration(script));
  document.getElementById("sd-updated").textContent = formatUpdated(script.updatedAt);
  var status = computeScriptStatus(script);
  var statusEl = document.getElementById("sd-status");
  statusEl.textContent = status;
  statusEl.className = "ui-badge " + statusBadgeClass(status);
  document.getElementById("sd-story-text").textContent = script.storyPreview;
  document.getElementById("sd-kural-tamil").textContent = script.thirukkural;
  document.getElementById("sd-kural-en").textContent = "\u201c" + script.englishTranslation + "\u201d";
  document.title = script.kuralId + " \u2014 Script Detail \u2014 AI Content Studio";
}

/* ===== SCENE TIMELINE ===== */
function sceneCardHTML(scene, index, total) {
  var characterTags = (scene.characters || []).map(function (c) { return '<span class="scene-tag">' + c + '</span>'; }).join("");
  return '<div class="scene-row" data-scene="' + scene.sceneNumber + '">'
    + '<div class="scene-row-rail"><span class="scene-number">' + scene.sceneNumber + '</span>'
    + (index < total - 1 ? '<div class="scene-row-line"></div>' : '')
    + '</div>'
    + '<div class="scene-row-card">'
    + '<div class="scene-row-card-top">'
    + '<div><h3 class="scene-title">' + (scene.title || "Untitled Scene") + '</h3></div>'
    + '<div class="scene-row-reorder">'
    + '<button type="button" class="scene-reorder-btn" data-action="up" data-scene="' + scene.sceneNumber + '"' + (index === 0 ? ' disabled' : '') + ' aria-label="Move scene earlier"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>'
    + '<button type="button" class="scene-reorder-btn" data-action="down" data-scene="' + scene.sceneNumber + '"' + (index === total - 1 ? ' disabled' : '') + ' aria-label="Move scene later"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg></button>'
    + '<button type="button" class="scene-expand-btn" data-action="expand" data-scene="' + scene.sceneNumber + '" aria-label="Expand/edit scene"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>'
    + '</div></div>'
    + '<div class="scene-row-body">'
    + '<div class="scene-meta"><span class="scene-tag">' + scene.duration + 's</span><span class="scene-tag">' + (scene.location || "") + '</span><span class="scene-tag">' + (scene.status || "Draft") + '</span></div>'
    + '<div class="scene-meta">' + characterTags + '</div>'
    + '<p class="scene-narration-preview">' + (scene.narration || "No narration yet.") + '</p>'
    + '</div>'
    + '<div class="scene-editor-inline" data-scene="' + scene.sceneNumber + '" hidden></div>'
    + '<div class="scene-row-footer">'
    + '<button type="button" class="ui-btn ui-btn-small" data-action="delete" data-scene="' + scene.sceneNumber + '">Delete</button>'
    + '</div></div></div>';
}

function renderTimeline(script) {
  var container = document.getElementById("scene-timeline");
  var total = script.scenes.length;
  var html = "";
  script.scenes.forEach(function (scene, i) {
    html += sceneCardHTML(scene, i, total);
  });
  html += '<button type="button" class="scene-add-row" id="timeline-add-scene"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Scene</button>';
  container.innerHTML = html;

  container.querySelectorAll('[data-action="expand"]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleSceneExpand(parseInt(el.getAttribute("data-scene"), 10));
    });
  });
  container.querySelectorAll('[data-action="delete"]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      handleDeleteScene(parseInt(el.getAttribute("data-scene"), 10));
    });
  });
  container.querySelectorAll('[data-action="up"],[data-action="down"]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      reorderScene(currentKuralNumber, parseInt(el.getAttribute("data-scene"), 10), el.getAttribute("data-action"));
      renderTimeline(getScript(currentKuralNumber));
    });
  });
  var addBtn = document.getElementById("timeline-add-scene");
  if (addBtn) addBtn.addEventListener("click", handleAddScene);
}

function handleAddScene() {
  var script = getScript(currentKuralNumber);
  var lastN = script.scenes.length ? script.scenes[script.scenes.length - 1].sceneNumber : 0;
  var scene = {
    sceneId: "TK-" + String(currentKuralNumber).padStart(4, "0") + "-S" + Date.now(),
    sceneNumber: 0, title: "New Scene", duration: 5,
    location: LOCATION_OPTIONS[0], characters: [], narration: "", dialogue: [],
    emotion: EMOTION_OPTIONS[0], camera: CAMERA_OPTIONS[0], transition: TRANSITION_OPTIONS[0],
    music: MUSIC_OPTIONS[0], sfx: SFX_OPTIONS[0], imagePrompt: "", videoPrompt: "", status: "Draft",
    goal: "", notes: "", moral: "", learningObjective: "",
    characterAge: "", costume: "", expression: "", pose: "", action: "", props: [],
    environment: "", weather: WEATHER_OPTIONS[0], season: SEASON_OPTIONS[0], timeOfDay: TIME_OF_DAY[3], lighting: LIGHTING_OPTIONS[0],
    cameraAngle: CAMERA_ANGLES[0], cameraMovement: CAMERA_MOVEMENTS[0], lens: LENS_OPTIONS[0], shotType: SHOT_TYPES[0], composition: COMPOSITION_OPTIONS[0], focus: FOCUS_OPTIONS[0],
    masterImagePrompt: "", characterPrompt: "", backgroundPrompt: "", stylePrompt: "", lightingPrompt: "", negativePrompt: "", imageModel: IMAGE_MODELS[0], imageStatus: "Pending",
    masterVideoPrompt: "", cameraMotionPrompt: "", animationPrompt: "", videoModel: VIDEO_MODELS[0], fps: 24, aspectRatio: "16:9",
    narrationVoice: "Narrator", voiceGender: "Male", voiceAge: VOICE_AGES[1], voiceEmotion: VOICE_EMOTIONS[0], speed: 1.0, pitch: 1.0, language: "Tamil",
    backgroundMusic: "", ambientSound: AMBIENT_OPTIONS[0], soundEffects: [], volume: 0.8, fadeIn: 2, fadeOut: 2,
    generatedBy: "", modelUsed: "", generationTime: "", promptVersion: "",
    directorNotes: "", editorNotes: "", reviewerNotes: "", assetStatus: "Not Generated"
  };
  script.scenes.push(scene);
  renumberScenes(script);
  saveScript(currentKuralNumber, script);
  refreshPage();
  showToast("Scene added");
}

function handleDeleteScene(sceneNumber) {
  if (!confirm("Delete Scene " + sceneNumber + "? This cannot be undone.")) return;
  deleteScene(currentKuralNumber, sceneNumber);
  refreshPage();
  showToast("Scene deleted");
}

/* ===== HELPER ===== */
function sel(list, current) {
  return list.map(function (v) {
    return '<option value="' + v + '"' + (v === current ? " selected" : "") + '>' + v + '</option>';
  }).join("");
}

/* ===== SCENE EDITOR INLINE ===== */
function toggleSceneExpand(sceneNumber) {
  var script = getScript(currentKuralNumber);
  var scene = script.scenes.find(function (s) { return s.sceneNumber === sceneNumber; });
  if (!scene) return;
  var row = document.querySelector('.scene-row[data-scene="' + sceneNumber + '"]');
  var editor = row.querySelector('.scene-editor-inline');
  var expandBtn = row.querySelector('[data-action="expand"]');

  if (!editor.hasAttribute("hidden")) {
    // Collapse
    editor.setAttribute("hidden", "");
    expandBtn.classList.remove("active");
  } else {
    // Expand
    editor.removeAttribute("hidden");
    editor.innerHTML = sceneInlineEditorHTML(scene, script);
    expandBtn.classList.add("active");
    wireInlineEvents(sceneNumber);
  }
}

function sceneInlineEditorHTML(scene, script) {
  var charOpts = characterOptionsFor(script);
  var charChips = charOpts.map(function (c) {
    return '<span class="sf-chip' + ((scene.characters || []).indexOf(c) >= 0 ? " selected" : "") + '" data-character="' + c + '">' + c + '</span>';
  }).join("");

  return '<div class="scene-editor-panel">'
    + '<div class="scene-editor-preview">'
    + '<strong>⚡ Quick Preview</strong>'
    + '<div class="scene-preview-item"><span class="scene-preview-label">Narration:</span> <span>' + (scene.narration ? scene.narration.slice(0, 80) + (scene.narration.length > 80 ? "..." : "") : "No narration") + '</span></div>'
    + '<div class="scene-preview-item"><span class="scene-preview-label">Camera:</span> <span>' + (scene.cameraAngle || "—") + ', ' + (scene.cameraMovement || "—") + '</span></div>'
    + '<div class="scene-preview-item"><span class="scene-preview-label">Image Prompt:</span> <span>' + (scene.masterImagePrompt ? scene.masterImagePrompt.slice(0, 60) + "..." : "—") + '</span></div>'
    + '<div class="scene-preview-item"><span class="scene-preview-label">Video Prompt:</span> <span>' + (scene.masterVideoPrompt ? scene.masterVideoPrompt.slice(0, 60) + "..." : "—") + '</span></div>'
    + '</div>'
    + '<div class="scene-editor-form">'
    + '<details class="scene-editor-details" open>'
    + '<summary>🎬 Scene Setup</summary>'
    + '<input type="text" class="scene-editor-field" data-field="title" value="' + esc(scene.title) + '" placeholder="Scene title">'
    + '<textarea class="scene-editor-field" data-field="narration" placeholder="Narration text" rows="2">' + esc(scene.narration) + '</textarea>'
    + '<input type="number" class="scene-editor-field" data-field="duration" min="1" max="300" value="' + (scene.duration || 5) + '" placeholder="Duration (seconds)">'
    + '<select class="scene-editor-field" data-field="status"><option value="Draft"' + (scene.status === "Draft" ? " selected" : "") + '>Draft</option><option value="Ready"' + (scene.status === "Ready" ? " selected" : "") + '>Ready</option><option value="Final"' + (scene.status === "Final" ? " selected" : "") + '>Final</option></select>'
    + '</details>'
    + '<details class="scene-editor-details">'
    + '<summary>👥 Characters & Location</summary>'
    + '<div class="sf-multiselect" data-field="characters">' + charChips + '</div>'
    + '<select class="scene-editor-field" data-field="location"><option>—</option>' + LOCATION_OPTIONS.map(function (o) { return '<option' + (o === scene.location ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'
    + '<select class="scene-editor-field" data-field="timeOfDay"><option>—</option>' + TIME_OF_DAY.map(function (o) { return '<option' + (o === scene.timeOfDay ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'
    + '</details>'
    + '<details class="scene-editor-details">'
    + '<summary>📷 Camera & Visuals</summary>'
    + '<select class="scene-editor-field" data-field="cameraAngle"><option>—</option>' + CAMERA_ANGLES.map(function (o) { return '<option' + (o === scene.cameraAngle ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'
    + '<select class="scene-editor-field" data-field="cameraMovement"><option>—</option>' + CAMERA_MOVEMENTS.map(function (o) { return '<option' + (o === scene.cameraMovement ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'
    + '<input type="text" class="scene-editor-field" data-field="masterImagePrompt" value="' + esc(scene.masterImagePrompt) + '" placeholder="Image generation prompt">'
    + '</details>'
    + '<details class="scene-editor-details">'
    + '<summary>🎥 Video & Motion</summary>'
    + '<input type="text" class="scene-editor-field" data-field="masterVideoPrompt" value="' + esc(scene.masterVideoPrompt) + '" placeholder="Video generation prompt">'
    + '<select class="scene-editor-field" data-field="videoModel"><option>—</option>' + VIDEO_MODELS.map(function (o) { return '<option' + (o === scene.videoModel ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'
    + '</details>'
    + '<details class="scene-editor-details">'
    + '<summary>🎙️ Voice & Audio</summary>'
    + '<input type="text" class="scene-editor-field" data-field="narrationVoice" value="' + esc(scene.narrationVoice) + '" placeholder="Voice name">'
    + '<select class="scene-editor-field" data-field="voiceGender"><option>—</option><option' + (scene.voiceGender === "Male" ? " selected" : "") + '>Male</option><option' + (scene.voiceGender === "Female" ? " selected" : "") + '>Female</option></select>'
    + '<input type="text" class="scene-editor-field" data-field="backgroundMusic" value="' + esc(scene.backgroundMusic) + '" placeholder="Background music">'
    + '<select class="scene-editor-field" data-field="ambientSound"><option>—</option>' + AMBIENT_OPTIONS.map(function (o) { return '<option' + (o === scene.ambientSound ? " selected" : "") + '>' + o + '</option>'; }).join("") + '</select>'
    + '</details>'
    + '</div>'
    + '</div>';
}

function wireInlineEvents(sceneNumber) {
  var row = document.querySelector('.scene-row[data-scene="' + sceneNumber + '"]');
  var editor = row.querySelector('.scene-editor-inline');

  editor.querySelectorAll('details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      d.classList.toggle('open', d.open);
    });
  });

  editor.querySelectorAll('.scene-editor-field').forEach(function (field) {
    field.addEventListener('change', function () {
      handleInlineFieldChange(sceneNumber, field);
    });
    if (field.tagName === 'TEXTAREA' || (field.tagName === 'INPUT' && field.type !== 'number')) {
      field.addEventListener('blur', function () {
        handleInlineFieldChange(sceneNumber, field);
      });
    }
  });

  editor.querySelectorAll('.sf-chip[data-character]').forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      e.stopPropagation();
      chip.classList.toggle('selected');
      handleInlineCharacterChange(sceneNumber, editor);
    });
  });
}

function handleInlineFieldChange(sceneNumber, field) {
  var script = getScript(currentKuralNumber);
  var scene = script.scenes.find(function (s) { return s.sceneNumber === sceneNumber; });
  if (!scene) return;

  var fieldName = field.getAttribute('data-field');
  var value = field.value;

  if (field.type === 'number') {
    scene[fieldName] = parseInt(value, 10);
  } else {
    scene[fieldName] = value;
  }

  saveScript(currentKuralNumber, script);
  showToast("Scene " + sceneNumber + " saved");
}

function handleInlineCharacterChange(sceneNumber, editor) {
  var script = getScript(currentKuralNumber);
  var scene = script.scenes.find(function (s) { return s.sceneNumber === sceneNumber; });
  if (!scene) return;

  scene.characters = Array.from(editor.querySelectorAll('.sf-chip[data-character].selected')).map(function (c) {
    return c.getAttribute('data-character');
  });

  saveScript(currentKuralNumber, script);
  showToast("Characters updated");
}

/* ===== PER-SCENE VALIDATION SCORE (used by scene editor strip) ===== */
function sceneValidationScore(scene) {
  var fields = ["narration", "title", "masterImagePrompt", "masterVideoPrompt", "backgroundMusic", "cameraAngle", "location", "emotion"];
  var present = 0;
  fields.forEach(function (f) {
    if (scene[f] && String(scene[f]).trim()) present++;
  });
  if (scene.characters && scene.characters.length > 0) present++;
  if (scene.dialogue && scene.dialogue.length > 0) present++;
  return Math.round((present / (fields.length + 2)) * 100);
}

/* ===== EXPORT CENTER ===== */
function downloadFile(filename, content, mime) {
  var blob = new Blob([content], { type: mime || "text/plain" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 100);
}

function buildExportJSON(script) {
  return JSON.stringify(script, null, 2);
}

function buildExportMarkdown(script) {
  var md = "# " + script.title + "\n\n## Story Preview\n" + script.storyPreview + "\n\n";
  md += "## Thirukkural\n" + script.thirukkural + "\n\n*" + script.englishTranslation + "*\n\n## Scenes\n";
  script.scenes.forEach(function (s) {
    md += "\n### Scene " + s.sceneNumber + " — " + (s.title || "") + "\n- **Duration:** " + s.duration + "s\n- **Location:** " + (s.location || "") + "\n- **Emotion:** " + (s.emotion || "") + "\n- **Camera:** " + (s.cameraAngle || s.camera || "") + "\n- **Narration:** " + (s.narration || "") + "\n- **Image Prompt:** " + (s.masterImagePrompt || s.imagePrompt || "") + "\n- **Video Prompt:** " + (s.masterVideoPrompt || s.videoPrompt || "") + "\n";
  });
  return md;
}

function buildExportScript(script) {
  var txt = "SCRIPT: " + script.title + "\n" + script.kuralId + "\n" + "=".repeat(60) + "\n\n";
  script.scenes.forEach(function (s) {
    txt += "SCENE " + s.sceneNumber + " — " + (s.title || "") + "\nDuration: " + s.duration + "s | Location: " + (s.location || "") + " | Camera: " + (s.cameraAngle || s.camera || "") + "\n\n";
    if (s.narration) txt += "NARRATION: " + s.narration + "\n\n";
    (s.dialogue || []).forEach(function (d) { if (d.character && d.line) txt += d.character.toUpperCase() + ": " + d.line + "\n"; });
    txt += "\n" + "-".repeat(40) + "\n\n";
  });
  return txt;
}

var activeExportTab = "json";

function renderExportPreview(script) {
  var preview = document.getElementById("sd-export-preview");
  if (!preview) return;
  var content = activeExportTab === "md" ? buildExportMarkdown(script)
    : activeExportTab === "script" ? buildExportScript(script)
    : buildExportJSON(script);
  preview.textContent = content;
}

function switchExportTab(tabId) {
  activeExportTab = tabId;
  document.querySelectorAll(".sd-export-tab").forEach(function (t) {
    t.classList.toggle("active", t.getAttribute("data-export-tab") === tabId);
  });
  renderExportPreview(getScript(currentKuralNumber));
}

function handleExport(type) {
  var script = getScript(currentKuralNumber);
  var kid = script.kuralId || "TK-0000";
  if (type === "json") {
    downloadFile("script-" + kid + ".json", buildExportJSON(script), "application/json");
    showToast("JSON exported");
  } else if (type === "md") {
    downloadFile("script-" + kid + ".md", buildExportMarkdown(script), "text/markdown");
    showToast("Markdown exported");
  } else if (type === "script") {
    downloadFile("script-" + kid + ".txt", buildExportScript(script), "text/plain");
    showToast("Script exported");
  } else if (type === "copy") {
    navigator.clipboard.writeText(buildExportJSON(script));
    showToast("JSON copied to clipboard");
  }
}

/* ===== PAGE LIFECYCLE ===== */
function refreshPage() {
  var script = getScript(currentKuralNumber);
  renderHeader(script);
  renderTimeline(script);
  renderExportPreview(script);
}

function initScriptDetail() {
  currentKuralNumber = getKuralFromQuery();
  initSidebar();
  initTheme();
  refreshPage();

  var addBtn = document.getElementById("add-scene-btn");
  if (addBtn) addBtn.addEventListener("click", handleAddScene);

  var genBtn = document.getElementById("generate-script-btn");
  if (genBtn) genBtn.addEventListener("click", function () {
    if (!confirm("Regenerate this script from the source story?")) return;
    var source = SCRIPT_SOURCE_STORIES.find(function (s) { return s.kuralNumber === currentKuralNumber; });
    if (!source) return;
    saveScript(currentKuralNumber, buildScriptFromStory(source));
    refreshPage();
    showToast("Script regenerated");
  });

  document.getElementById("export-json-btn")?.addEventListener("click", function () { handleExport("json"); });
  document.getElementById("export-md-btn")?.addEventListener("click", function () { handleExport("md"); });
  document.getElementById("export-script-btn")?.addEventListener("click", function () { handleExport("script"); });
  document.getElementById("copy-json-btn")?.addEventListener("click", function () { handleExport("copy"); });

  document.querySelectorAll(".sd-export-tab").forEach(function (tab) {
    tab.addEventListener("click", function () { switchExportTab(tab.getAttribute("data-export-tab")); });
  });
}

document.addEventListener("DOMContentLoaded", initScriptDetail);

})();
