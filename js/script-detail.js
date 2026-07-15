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
let editingSceneNumber = null;
let activeTab = "general";

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
    + '<div class="scene-row-card-top" data-action="edit" data-scene="' + scene.sceneNumber + '">'
    + '<h3 class="scene-title">' + (scene.title || "Untitled Scene") + '</h3>'
    + '<div class="scene-row-reorder">'
    + '<button type="button" class="scene-reorder-btn" data-action="up" data-scene="' + scene.sceneNumber + '"' + (index === 0 ? ' disabled' : '') + ' aria-label="Move scene earlier"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>'
    + '<button type="button" class="scene-reorder-btn" data-action="down" data-scene="' + scene.sceneNumber + '"' + (index === total - 1 ? ' disabled' : '') + ' aria-label="Move scene later"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg></button>'
    + '</div></div>'
    + '<div class="scene-row-body" data-action="edit" data-scene="' + scene.sceneNumber + '">'
    + '<div class="scene-meta"><span class="scene-tag">' + scene.duration + 's</span><span class="scene-tag">' + (scene.location || "") + '</span><span class="scene-tag">' + (scene.status || "Draft") + '</span></div>'
    + '<div class="scene-meta">' + characterTags + '</div>'
    + '<p class="scene-narration-preview">' + (scene.narration || "No narration yet.") + '</p>'
    + '</div>'
    + '<div class="scene-row-footer">'
    + '<button type="button" class="ui-btn" data-action="edit" data-scene="' + scene.sceneNumber + '">Edit</button>'
    + '<button type="button" class="ui-btn" data-action="delete" data-scene="' + scene.sceneNumber + '">Delete</button>'
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

  container.querySelectorAll('[data-action="edit"]').forEach(function (el) {
    el.addEventListener("click", function () { openSceneEditor(parseInt(el.getAttribute("data-scene"), 10)); });
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
      /* Reorder only changes scene order — re-render the timeline alone
         instead of the full 5-panel refreshPage(). */
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

/* ===== TABS ===== */
var SCENE_TABS = [
  { id: "general", label: "General", icon: "\u2699" },
  { id: "story", label: "Story", icon: "\uD83D\uDCD6" },
  { id: "characters", label: "Characters", icon: "\uD83D\uDC64" },
  { id: "location", label: "Location", icon: "\uD83D\uDCCD" },
  { id: "camera", label: "Camera", icon: "\uD83C\uDFAC" },
  { id: "image-ai", label: "Image AI", icon: "\uD83D\uDDBC" },
  { id: "video-ai", label: "Video AI", icon: "\uD83C\uDFAC" },
  { id: "voice", label: "Voice", icon: "\uD83C\uDF99" },
  { id: "audio", label: "Audio", icon: "\uD83C\uDFB5" },
  { id: "assets", label: "Assets", icon: "\uD83D\uDCC1" },
  { id: "ai", label: "AI", icon: "\uD83E\uDD16" },
  { id: "notes", label: "Notes", icon: "\uD83D\uDCDD" }
];

function renderTabsHTML() {
  return SCENE_TABS.map(function (tab) {
    return '<button type="button" class="sf-tab' + (tab.id === activeTab ? " active" : "") + '" data-tab="' + tab.id + '">' + tab.icon + " " + tab.label + '</button>';
  }).join("");
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll(".sf-tab").forEach(function (t) {
    t.classList.toggle("active", t.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".sf-tab-panel").forEach(function (p) {
    p.classList.toggle("active", p.getAttribute("data-panel") === tabId);
  });
}

/* ===== HELPER ===== */
function sel(list, current) {
  return list.map(function (v) {
    return '<option value="' + v + '"' + (v === current ? " selected" : "") + '>' + v + '</option>';
  }).join("");
}

function esc(val) {
  return (val || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ===== SCENE EDITOR HTML ===== */
function sceneEditorHTML(scene, script) {
  var charOpts = characterOptionsFor(script);
  var charChips = charOpts.map(function (c) {
    return '<span class="sf-chip' + ((scene.characters || []).indexOf(c) >= 0 ? " selected" : "") + '" data-character="' + c + '">' + c + '</span>';
  }).join("");

  var dRows = (scene.dialogue && scene.dialogue.length ? scene.dialogue : [{ character: "", line: "" }]);
  var dialogueHTML = dRows.map(function (d, i) {
    return '<div class="sf-dialogue-row"><input type="text" class="sf-dialogue-character" placeholder="Character" value="' + esc(d.character) + '"><input type="text" class="sf-dialogue-line" placeholder="Dialogue line" value="' + esc(d.line) + '"><button type="button" class="sf-dialogue-remove" aria-label="Remove line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>';
  }).join("");

  var sfxChips = SFX_LIST.map(function (s) {
    return '<span class="sf-chip' + ((scene.soundEffects || []).indexOf(s) >= 0 ? " selected" : "") + '" data-sfx="' + s + '">' + s + '</span>';
  }).join("");

  return '<div class="sf-header"><h2>Scene ' + scene.sceneNumber + " \u2014 " + script.kuralId + '</h2>'
    + '<div class="sf-scene-nav"><button type="button" class="sf-nav-btn" id="sf-prev-scene" aria-label="Previous scene"' + (scene.sceneNumber <= 1 ? ' disabled' : '') + '>&#8592;</button>'
    + '<button type="button" class="sf-nav-btn" id="sf-next-scene" aria-label="Next scene"' + (scene.sceneNumber >= script.scenes.length ? ' disabled' : '') + '>&#8594;</button></div></div>'
    + '<div class="sf-validation-strip" id="sf-validation-strip"></div>'
    + '<div class="sf-error-banner" id="sf-error-banner" hidden></div>'
    + '<div class="sf-tabs" id="sf-tabs">' + renderTabsHTML() + '</div>'
    + '<div class="sf-body-scroll">'

    // GENERAL
    + '<div class="sf-tab-panel active" data-panel="general">'
    + '<div class="sf-grid">'
    + sfField("sf-title", "Scene Title", '<input type="text" id="sf-title" required value="' + esc(scene.title) + '">', true)
    + sfField("sf-duration", "Duration (seconds)", '<input type="number" id="sf-duration" min="1" max="300" value="' + (scene.duration || 5) + '">', false)
    + sfField("sf-status", "Status", '<select id="sf-status">' + sel(SCENE_STATUS_OPTIONS, scene.status) + '</select>', false)
    + sfField("sf-goal", "Scene Goal", '<input type="text" id="sf-goal" value="' + esc(scene.goal) + '" placeholder="What does this scene achieve?">', false)
    + '</div>'
    + sfField("sf-notes", "Scene Notes", '<textarea id="sf-notes" rows="2">' + esc(scene.notes) + '</textarea>', true)
    + '</div>'

    // STORY
    + '<div class="sf-tab-panel" data-panel="story">'
    + '<div class="sf-field full" style="margin-bottom:1rem"><label for="sf-narration">Narration</label><textarea id="sf-narration" rows="4">' + esc(scene.narration) + '</textarea></div>'
    + '<label style="font-size:0.75rem;font-weight:600;color:var(--text-secondary);margin-bottom:0.5rem;display:block">Dialogue</label>'
    + '<div class="sf-dialogue-list" id="sf-dialogue-list">' + dialogueHTML + '</div>'
    + '<button type="button" class="ui-btn sf-add-dialogue" id="sf-add-dialogue">+ Add Line</button>'
    + '<hr class="sf-divider">'
    + '<div class="sf-grid">'
    + sfField("sf-emotion", "Emotion", '<select id="sf-emotion">' + sel(EMOTION_OPTIONS, scene.emotion) + '</select>', false)
    + sfField("sf-moral", "Moral", '<input type="text" id="sf-moral" value="' + esc(scene.moral) + '">', false)
    + sfField("sf-learning-objective", "Learning Objective", '<input type="text" id="sf-learning-objective" value="' + esc(scene.learningObjective) + '">', true)
    + '</div></div>'

    // CHARACTERS
    + '<div class="sf-tab-panel" data-panel="characters">'
    + '<label style="font-size:0.75rem;font-weight:600;color:var(--text-secondary);margin-bottom:0.5rem;display:block">Characters Used</label>'
    + '<div class="sf-multiselect" id="sf-characters">' + charChips + '</div>'
    + '<div class="sf-grid" style="margin-top:1rem">'
    + sfField("sf-character-age", "Character Age", '<input type="text" id="sf-character-age" value="' + esc(scene.characterAge) + '" placeholder="e.g. 7-10">', false)
    + sfField("sf-costume", "Costume", '<input type="text" id="sf-costume" value="' + esc(scene.costume) + '" placeholder="e.g. Traditional attire">', false)
    + sfField("sf-expression", "Expression", '<input type="text" id="sf-expression" value="' + esc(scene.expression) + '" placeholder="e.g. Wonder, Joy">', false)
    + sfField("sf-pose", "Pose", '<input type="text" id="sf-pose" value="' + esc(scene.pose) + '" placeholder="e.g. Standing">', false)
    + sfField("sf-action", "Action", '<input type="text" id="sf-action" value="' + esc(scene.action) + '" placeholder="e.g. Walking">', false)
    + '</div></div>'

    // LOCATION
    + '<div class="sf-tab-panel" data-panel="location">'
    + '<button type="button" class="sf-ai-btn" id="sf-reuse-location" style="margin-bottom:0.75rem">↻ Reuse Previous Scene Location</button>'
    + '<div class="sf-grid">'
    + sfField("sf-location", "Location", '<select id="sf-location">' + sel(LOCATION_OPTIONS, scene.location) + '</select>', false)
    + sfField("sf-environment", "Environment", '<input type="text" id="sf-environment" value="' + esc(scene.environment) + '" placeholder="e.g. Lush garden">', false)
    + sfField("sf-weather", "Weather", '<select id="sf-weather">' + sel(WEATHER_OPTIONS, scene.weather || "Clear") + '</select>', false)
    + sfField("sf-season", "Season", '<select id="sf-season">' + sel(SEASON_OPTIONS, scene.season || "Spring") + '</select>', false)
    + sfField("sf-time-of-day", "Time of Day", '<select id="sf-time-of-day">' + sel(TIME_OF_DAY, scene.timeOfDay || "Afternoon") + '</select>', false)
    + sfField("sf-lighting", "Lighting", '<select id="sf-lighting">' + sel(LIGHTING_OPTIONS, scene.lighting || "Natural") + '</select>', false)
    + '</div></div>'

    // CAMERA
    + '<div class="sf-tab-panel" data-panel="camera">'
    + '<div class="sf-grid">'
    + sfField("sf-camera-angle", "Camera Angle", '<select id="sf-camera-angle">' + sel(CAMERA_ANGLES, scene.cameraAngle || "Wide Shot") + '</select>', false)
    + sfField("sf-camera-movement", "Movement", '<select id="sf-camera-movement">' + sel(CAMERA_MOVEMENTS, scene.cameraMovement || "Static") + '</select>', false)
    + sfField("sf-lens", "Lens", '<select id="sf-lens">' + sel(LENS_OPTIONS, scene.lens || "50mm") + '</select>', false)
    + sfField("sf-shot-type", "Shot Type", '<select id="sf-shot-type">' + sel(SHOT_TYPES, scene.shotType || "Master") + '</select>', false)
    + sfField("sf-composition", "Composition", '<select id="sf-composition">' + sel(COMPOSITION_OPTIONS, scene.composition || "Rule of Thirds") + '</select>', false)
    + sfField("sf-focus", "Focus", '<select id="sf-focus">' + sel(FOCUS_OPTIONS, scene.focus || "Deep Focus") + '</select>', false)
    + sfField("sf-transition", "Transition", '<select id="sf-transition">' + sel(TRANSITION_OPTIONS, scene.transition) + '</select>', false)
    + '</div></div>'

    // IMAGE AI
    + '<div class="sf-tab-panel" data-panel="image-ai">'
    + '<button type="button" class="sf-gen-complete-btn" id="sf-gen-complete">✨ Generate Complete Scene</button>'
    + '<div class="sf-ai-actions" style="margin-bottom:1rem"><button type="button" class="sf-ai-btn" data-ai="regenerate-image">Auto-Generate Prompts</button><button type="button" class="sf-ai-btn" data-ai="copy-all-image">Copy All</button></div>'
    + '<div class="sf-grid">'
    + sfPromptField("sf-master-image-prompt", "Master Image Prompt", scene.masterImagePrompt)
    + sfPromptField("sf-character-prompt", "Character Prompt", scene.characterPrompt)
    + sfPromptField("sf-background-prompt", "Background Prompt", scene.backgroundPrompt)
    + sfPromptField("sf-lighting-prompt", "Lighting Prompt", scene.lightingPrompt)
    + sfPromptField("sf-style-prompt", "Style Prompt", scene.stylePrompt)
    + sfPromptField("sf-negative-prompt", "Negative Prompt", scene.negativePrompt)
    + sfField("sf-image-model", "Image Model", '<select id="sf-image-model">' + sel(IMAGE_MODELS, scene.imageModel || "DALL-E 3") + '</select>', false)
    + '</div></div>'

    // VIDEO AI
    + '<div class="sf-tab-panel" data-panel="video-ai">'
    + '<div class="sf-ai-actions" style="margin-bottom:1rem"><button type="button" class="sf-ai-btn" data-ai="regenerate-video">Auto-Generate Prompts</button><button type="button" class="sf-ai-btn" data-ai="copy-all-video">Copy All</button></div>'
    + '<div class="sf-grid">'
    + sfPromptField("sf-master-video-prompt", "Master Video Prompt", scene.masterVideoPrompt)
    + sfPromptField("sf-camera-motion-prompt", "Camera Motion", scene.cameraMotionPrompt)
    + sfPromptField("sf-animation-prompt", "Animation", scene.animationPrompt)
    + sfField("sf-video-model", "Video Model", '<select id="sf-video-model">' + sel(VIDEO_MODELS, scene.videoModel || "Runway Gen-3") + '</select>', false)
    + sfField("sf-fps", "FPS", '<input type="number" id="sf-fps" value="' + (scene.fps || 24) + '" min="12" max="60">', false)
    + sfField("sf-aspect-ratio", "Aspect Ratio", '<select id="sf-aspect-ratio">' + sel(ASPECT_RATIOS, scene.aspectRatio || "16:9") + '</select>', false)
    + '</div></div>'

    // VOICE
    + '<div class="sf-tab-panel" data-panel="voice">'
    + '<div class="sf-ai-actions" style="margin-bottom:1rem"><button type="button" class="sf-ai-btn" data-ai="regenerate-voice">Auto-Generate Voice Spec</button></div>'
    + '<div class="sf-grid">'
    + sfField("sf-narration-voice", "Narration Voice", '<input type="text" id="sf-narration-voice" value="' + esc(scene.narrationVoice) + '">', false)
    + sfField("sf-voice-gender", "Gender", '<select id="sf-voice-gender">' + sel(VOICE_GENDERS, scene.voiceGender || "Male") + '</select>', false)
    + sfField("sf-voice-age", "Age", '<select id="sf-voice-age">' + sel(VOICE_AGES, scene.voiceAge || "Middle (35-50)") + '</select>', false)
    + sfField("sf-voice-emotion", "Emotion", '<select id="sf-voice-emotion">' + sel(VOICE_EMOTIONS, scene.voiceEmotion || "Calm") + '</select>', false)
    + sfField("sf-voice-accent", "Accent", '<input type="text" id="sf-voice-accent" value="' + esc(scene.voiceAccent || "") + '" placeholder="e.g. Tamil Nadu">', false)
    + sfField("sf-speed", "Speed", '<input type="number" id="sf-speed" value="' + (scene.speed || 1.0) + '" min="0.5" max="2.0" step="0.1">', false)
    + sfField("sf-pitch", "Pitch", '<input type="number" id="sf-pitch" value="' + (scene.pitch || 1.0) + '" min="0.5" max="2.0" step="0.1">', false)
    + sfField("sf-language", "Language", '<select id="sf-language">' + sel(LANGUAGE_OPTIONS, scene.language || "Tamil") + '</select>', false)
    + '</div></div>'

    // AUDIO
    + '<div class="sf-tab-panel" data-panel="audio">'
    + '<div class="sf-ai-actions" style="margin-bottom:1rem"><button type="button" class="sf-ai-btn" data-ai="regenerate-audio">Auto-Generate Audio Spec</button></div>'
    + '<div class="sf-grid">'
    + sfField("sf-background-music", "Background Music", '<input type="text" id="sf-background-music" value="' + esc(scene.backgroundMusic) + '">', true)
    + sfField("sf-ambient-sound", "Ambient Sound", '<select id="sf-ambient-sound">' + sel(AMBIENT_OPTIONS, scene.ambientSound || "Silence") + '</select>', false)
    + '</div>'
    + '<label style="font-size:0.75rem;font-weight:600;color:var(--text-secondary);margin:0.75rem 0 0.5rem;display:block">Sound Effects</label>'
    + '<div class="sf-multiselect" id="sf-sfx-chips">' + sfxChips + '</div>'
    + '<div class="sf-grid" style="margin-top:0.75rem">'
    + sfField("sf-volume", "Volume", '<input type="number" id="sf-volume" value="' + (scene.volume || 0.8) + '" min="0" max="1" step="0.1">', false)
    + sfField("sf-fade-in", "Fade In (s)", '<input type="number" id="sf-fade-in" value="' + (scene.fadeIn || 2) + '" min="0" max="10">', false)
    + sfField("sf-fade-out", "Fade Out (s)", '<input type="number" id="sf-fade-out" value="' + (scene.fadeOut || 2) + '" min="0" max="10">', false)
    + '</div></div>'

    // ASSETS
    + '<div class="sf-tab-panel" data-panel="assets">'
    + '<div class="sf-asset-grid">'
    + '<div class="sf-asset-card"><h4>Image</h4><div class="sf-preview-box" id="sf-asset-image">No image generated</div><div class="sf-asset-status" id="sf-asset-image-status">Pending</div><div class="sf-asset-actions"><button type="button" class="ui-btn sf-asset-retry" data-retry="image">Retry</button><button type="button" class="ui-btn sf-asset-download" data-download="image" disabled>Download</button></div></div>'
    + '<div class="sf-asset-card"><h4>Video</h4><div class="sf-preview-box" id="sf-asset-video">No video generated</div><div class="sf-asset-status" id="sf-asset-video-status">Pending</div><div class="sf-asset-actions"><button type="button" class="ui-btn sf-asset-retry" data-retry="video">Retry</button><button type="button" class="ui-btn sf-asset-download" data-download="video" disabled>Download</button></div></div>'
    + '<div class="sf-asset-card"><h4>Voice</h4><div class="sf-preview-box" id="sf-asset-voice">No audio generated</div><div class="sf-asset-status" id="sf-asset-voice-status">Pending</div><div class="sf-asset-actions"><button type="button" class="ui-btn sf-asset-retry" data-retry="voice">Retry</button><button type="button" class="ui-btn sf-asset-download" data-download="voice" disabled>Download</button></div></div>'
    + '</div></div>'

    // AI HISTORY
    + '<div class="sf-tab-panel" data-panel="ai">'
    + '<div class="sf-grid">'
    + sfField("sf-generated-by", "Provider", '<input type="text" id="sf-generated-by" value="' + esc(scene.generatedBy) + '" placeholder="e.g. OpenAI, Anthropic">', false)
    + sfField("sf-model-used", "Model", '<input type="text" id="sf-model-used" value="' + esc(scene.modelUsed) + '" placeholder="e.g. gpt-4, claude-sonnet">', false)
    + sfField("sf-prompt-version", "Prompt Version", '<input type="text" id="sf-prompt-version" value="' + esc(scene.promptVersion) + '" placeholder="e.g. v2.0">', false)
    + sfField("sf-tokens", "Tokens Used", '<input type="number" id="sf-tokens" value="' + (scene.tokens || "") + '" placeholder="e.g. 1500">', false)
    + sfField("sf-cost", "Cost (USD)", '<input type="number" id="sf-cost" value="' + (scene.cost || "") + '" step="0.01" placeholder="e.g. 0.03">', false)
    + sfField("sf-generation-time", "Generation Time", '<input type="text" id="sf-generation-time" value="' + esc(scene.generationTime) + '" placeholder="e.g. 2.3s">', false)
    + '</div>'
    + '<div class="sf-version-history" style="margin-top:1rem">'
    + '<div class="sf-section-title">Version History</div>'
    + '<div id="sf-version-list">' + renderVersionHistory(scene) + '</div>'
    + '</div></div>'

    // NOTES
    + '<div class="sf-tab-panel" data-panel="notes">'
    + '<div class="sf-review-status" id="sf-review-status">'
    + '<span class="sf-review-badge' + (scene.status === "Draft" ? " active" : "") + '" data-review="Draft">Draft</span>'
    + '<span class="sf-review-badge' + (scene.status === "Ready" ? " active" : "") + '" data-review="Ready">In Review</span>'
    + '<span class="sf-review-badge' + (scene.status === "Final" ? " approved" : "") + '" data-review="Final">Approved</span>'
    + '</div>'
    + sfField("sf-director-notes", "Director Notes", '<textarea id="sf-director-notes" class="sf-notes-field">' + esc(scene.directorNotes) + '</textarea>', true)
    + sfField("sf-editor-notes", "Editor Notes", '<textarea id="sf-editor-notes" class="sf-notes-field">' + esc(scene.editorNotes) + '</textarea>', true)
    + sfField("sf-reviewer-notes", "Reviewer Notes", '<textarea id="sf-reviewer-notes" class="sf-notes-field">' + esc(scene.reviewerNotes) + '</textarea>', true)
    + '</div>'

    + '</div>'
    + '<div class="sf-bottom-bar">'
    + '<button type="button" class="ui-btn" id="sf-prev-scene-btn">&#8592; Prev</button>'
    + '<button type="button" class="ui-btn" id="sf-validate-btn">Validate</button>'
    + '<button type="button" class="ui-btn" id="sf-preview-btn">Preview</button>'
    + '<button type="button" class="ui-btn sf-gen-complete-btn" id="sf-gen-complete-bottom">✨ Generate Complete</button>'
    + '<button type="button" class="ui-btn" id="sf-next-scene-btn">Next &#8594;</button>'
    + '<button type="button" class="ui-btn ui-btn-primary" id="sf-save">Save Scene</button>'
    + '</div>';
}

function sfField(id, label, inputHTML, full) {
  return '<div class="sf-field' + (full ? " full" : "") + '"><label for="' + id + '">' + label + '</label>' + inputHTML + '</div>';
}

function sfPromptField(id, label, value) {
  return '<div class="sf-field full prompt-field"><label for="' + id + '">' + label + ' <span class="sf-auto-label">auto</span></label>'
    + '<textarea class="sf-prompt-area" id="' + id + '">' + esc(value) + '</textarea>'
    + '<button type="button" class="sf-copy-btn" data-copy="' + id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</button></div>';
}

function renderVersionHistory(scene) {
  var history = scene.versionHistory || [];
  if (!history.length) return '<p style="color:var(--muted);font-size:0.8rem;">No version history yet. Save to create a version.</p>';
  return history.map(function (v) {
    return '<div class="sf-version-row"><span class="sf-version-num">v' + (v.version || 1) + '</span>'
      + '<span class="sf-version-date">' + (v.date || "") + '</span>'
      + '<span class="sf-version-info">' + (v.model || "") + ' &middot; ' + (v.tokens || 0) + ' tokens</span>'
      + '<button type="button" class="sf-version-restore" data-version="' + (v.version || 1) + '">Restore</button></div>';
  }).join("");
}

function renderValidationStrip(scene) {
  var score = sceneValidationScore(scene);
  var missing = [];
  var required = ["title", "narration", "masterImagePrompt", "masterVideoPrompt", "backgroundMusic", "cameraAngle", "location", "emotion"];
  required.forEach(function (f) {
    if (!scene[f] || !String(scene[f]).trim()) missing.push(f.replace(/([A-Z])/g, " $1").replace(/^./, function (c) { return c.toUpperCase(); }));
  });
  if (!scene.characters || !scene.characters.length) missing.push("Characters");
  if (!scene.dialogue || !scene.dialogue.length) missing.push("Dialogue");

  var cls = score >= 80 ? "ok" : (score >= 50 ? "warn" : "err");
  var html = '<div class="sf-val-score ' + cls + '"><span class="sf-val-pct">' + score + '%</span><span class="sf-val-label">Ready</span></div>';
  if (missing.length) {
    html += '<div class="sf-val-missing"><strong>Missing:</strong> ' + missing.slice(0, 5).join(", ");
    if (missing.length > 5) html += " +" + (missing.length - 5) + " more";
    html += '</div>';
  } else {
    html += '<div class="sf-val-missing ok">All fields complete</div>';
  }
  return html;
}

/* ===== SCENE EDITOR LOGIC ===== */
function openSceneEditor(sceneNumber) {
  var script = getScript(currentKuralNumber);
  var scene = script.scenes.find(function (s) { return s.sceneNumber === sceneNumber; });
  if (!scene) return;
  editingSceneNumber = sceneNumber;
  activeTab = "general";
  var body = document.getElementById("scene-editor-body");
  body.innerHTML = sceneEditorHTML(scene, script);
  var strip = document.getElementById("sf-validation-strip");
  if (strip) strip.innerHTML = renderValidationStrip(scene);
  wireEvents();
  document.getElementById("scene-editor-modal").classList.add("visible");
}

function navigateScene(direction) {
  var script = getScript(currentKuralNumber);
  var nextNum = editingSceneNumber + direction;
  if (nextNum < 1 || nextNum > script.scenes.length) return;
  saveScene(true);
  openSceneEditor(nextNum);
}

function validateCurrentScene() {
  var f = readFormFields();
  var tempScene = Object.assign({}, getScene(editingSceneNumber), f);
  var strip = document.getElementById("sf-validation-strip");
  if (strip) strip.innerHTML = renderValidationStrip(tempScene);
  var score = sceneValidationScore(tempScene);
  showToast("Scene " + score + "% ready");
}

function previewCurrentScene() {
  var f = readFormFields();
  var lines = ["Scene " + editingSceneNumber + " — " + f.title, ""];
  if (f.narration) lines.push("NARRATION: " + f.narration);
  (f.dialogue || []).forEach(function (d) { if (d.line) lines.push((d.character || "?").toUpperCase() + ": " + d.line); });
  lines.push("");
  lines.push("Location: " + f.location + " | Camera: " + f.cameraAngle + " | Duration: " + f.duration + "s");
  if (f.masterImagePrompt) lines.push("", "Image Prompt: " + f.masterImagePrompt.slice(0, 100) + "...");
  alert(lines.join("\n"));
}

function reusePreviousLocation() {
  var script = getScript(currentKuralNumber);
  var prev = script.scenes.find(function (s) { return s.sceneNumber === editingSceneNumber - 1; });
  if (!prev) { showToast("No previous scene"); return; }
  var set = function (id, v) { var el = document.getElementById(id); if (el) el.value = v || ""; };
  set("sf-location", prev.location);
  set("sf-environment", prev.environment);
  set("sf-weather", prev.weather);
  set("sf-season", prev.season);
  set("sf-time-of-day", prev.timeOfDay);
  set("sf-lighting", prev.lighting);
  showToast("Location copied from Scene " + prev.sceneNumber);
}

function handleAssetRetry(type) {
  showToast(type + " generation retry queued");
}

function handleAssetDownload(type) {
  showToast(type + " download started");
}

function restoreVersion(version) {
  var script = getScript(currentKuralNumber);
  var scene = script.scenes.find(function (s) { return s.sceneNumber === editingSceneNumber; });
  if (!scene || !scene.versionHistory) { showToast("No version to restore"); return; }
  var v = scene.versionHistory.find(function (vh) { return vh.version === version; });
  if (!v) { showToast("Version not found"); return; }
  Object.assign(scene, v.data);
  saveScript(currentKuralNumber, script);
  openSceneEditor(editingSceneNumber);
  showToast("Restored v" + version);
}

function getScene(num) {
  var script = getScript(currentKuralNumber);
  return script.scenes.find(function (s) { return s.sceneNumber === num; });
}

function wireEvents() {
  document.querySelectorAll(".sf-tab").forEach(function (tab) {
    tab.addEventListener("click", function () { switchTab(tab.getAttribute("data-tab")); });
  });
  document.querySelectorAll(".sf-chip[data-character]").forEach(function (c) {
    c.addEventListener("click", function () { c.classList.toggle("selected"); });
  });
  document.querySelectorAll(".sf-chip[data-sfx]").forEach(function (c) {
    c.addEventListener("click", function () { c.classList.toggle("selected"); });
  });
  document.querySelectorAll(".sf-dialogue-remove").forEach(function (btn) {
    btn.addEventListener("click", function () { btn.closest(".sf-dialogue-row").remove(); });
  });
  var addDlg = document.getElementById("sf-add-dialogue");
  if (addDlg) addDlg.addEventListener("click", function () {
    var list = document.getElementById("sf-dialogue-list");
    var row = document.createElement("div");
    row.className = "sf-dialogue-row";
    row.innerHTML = '<input type="text" class="sf-dialogue-character" placeholder="Character"><input type="text" class="sf-dialogue-line" placeholder="Dialogue line"><button type="button" class="sf-dialogue-remove" aria-label="Remove line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    row.querySelector(".sf-dialogue-remove").addEventListener("click", function () { row.remove(); });
    list.appendChild(row);
  });

  document.querySelectorAll(".sf-copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var el = document.getElementById(btn.getAttribute("data-copy"));
      if (el) navigator.clipboard.writeText(el.value);
    });
  });

  document.querySelectorAll(".sf-ai-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { handleAIAction(btn.getAttribute("data-ai")); });
  });

  var genComplete = document.getElementById("sf-gen-complete");
  if (genComplete) genComplete.addEventListener("click", handleGenerateComplete);
  var genCompleteBottom = document.getElementById("sf-gen-complete-bottom");
  if (genCompleteBottom) genCompleteBottom.addEventListener("click", handleGenerateComplete);

  var reuseLoc = document.getElementById("sf-reuse-location");
  if (reuseLoc) reuseLoc.addEventListener("click", reusePreviousLocation);

  var validateBtn = document.getElementById("sf-validate-btn");
  if (validateBtn) validateBtn.addEventListener("click", validateCurrentScene);
  var previewBtn = document.getElementById("sf-preview-btn");
  if (previewBtn) previewBtn.addEventListener("click", previewCurrentScene);

  var prevNav = document.getElementById("sf-prev-scene");
  if (prevNav) prevNav.addEventListener("click", function () { navigateScene(-1); });
  var nextNav = document.getElementById("sf-next-scene");
  if (nextNav) nextNav.addEventListener("click", function () { navigateScene(1); });
  var prevBar = document.getElementById("sf-prev-scene-btn");
  if (prevBar) prevBar.addEventListener("click", function () { navigateScene(-1); });
  var nextBar = document.getElementById("sf-next-scene-btn");
  if (nextBar) nextBar.addEventListener("click", function () { navigateScene(1); });

  document.querySelectorAll(".sf-asset-retry").forEach(function (btn) {
    btn.addEventListener("click", function () { handleAssetRetry(btn.getAttribute("data-retry")); });
  });
  document.querySelectorAll(".sf-asset-download").forEach(function (btn) {
    btn.addEventListener("click", function () { handleAssetDownload(btn.getAttribute("data-download")); });
  });
  document.querySelectorAll(".sf-version-restore").forEach(function (btn) {
    btn.addEventListener("click", function () { restoreVersion(parseInt(btn.getAttribute("data-version"), 10)); });
  });

  document.querySelectorAll(".sf-review-badge").forEach(function (badge) {
    badge.addEventListener("click", function () {
      document.querySelectorAll(".sf-review-badge").forEach(function (b) { b.classList.remove("active", "approved"); });
      var val = badge.getAttribute("data-review");
      badge.classList.add(val === "Final" ? "approved" : "active");
      var statusSel = document.getElementById("sf-status");
      if (statusSel) statusSel.value = val;
    });
  });

  var cancelBtn = document.getElementById("sf-cancel");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  var saveBtn = document.getElementById("sf-save");
  if (saveBtn) saveBtn.addEventListener("click", saveScene);
}

function handleAIAction(action) {
  var f = readFormFields();
  if (action === "regenerate-image") {
    f.masterImagePrompt = autoGenImagePrompt(f.narration, f.location, f.emotion, f.characters);
    f.characterPrompt = autoGenCharacterPrompt(f.characters, f.expression, f.location);
    f.backgroundPrompt = autoGenBackgroundPrompt(f.location, f.timeOfDay, f.weather);
    f.lightingPrompt = autoGenLightingPrompt(f.timeOfDay, f.weather);
    f.stylePrompt = STUDIO_STYLE.artStyle + ", " + STUDIO_STYLE.imageQuality;
    f.negativePrompt = STUDIO_STYLE.negative;
    showToast("Image prompts generated");
  } else if (action === "regenerate-video") {
    f.masterVideoPrompt = autoGenVideoPrompt(f.narration, f.transition);
    f.cameraMotionPrompt = "Smooth " + (f.cameraMovement || "static").toLowerCase() + " with " + (f.transition || "cut").toLowerCase() + " transition. " + STUDIO_STYLE.videoQuality + ".";
    f.animationPrompt = "Subtle natural motion, " + (f.emotion || "calm").toLowerCase() + " mood pacing, gentle ambient movement. " + STUDIO_STYLE.videoQuality + ".";
    showToast("Video prompts generated");
  } else if (action === "regenerate-voice") {
    f.voiceEmotion = f.emotion || "Calm";
    showToast("Voice specs generated");
  } else if (action === "regenerate-audio") {
    f.backgroundMusic = autoGenMusicPrompt(f.emotion, f.location);
    f.ambientSound = f.environment || "Silence";
    var sfxPrompt = autoGenSFXPrompt(f.weather, f.environment);
    if (sfxPrompt && (!f.soundEffects || !f.soundEffects.length)) {
      f.soundEffects = SFX_LIST.filter(function (s) {
        return sfxPrompt.toLowerCase().indexOf(s.toLowerCase()) >= 0;
      });
    }
    showToast("Audio specs generated");
  } else if (action === "copy-all-image") {
    var txt = [f.masterImagePrompt, f.characterPrompt, f.backgroundPrompt, f.lightingPrompt].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(txt);
    showToast("Copied");
  } else if (action === "copy-all-video") {
    var txt2 = [f.masterVideoPrompt, f.cameraMotionPrompt, f.animationPrompt].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(txt2);
    showToast("Copied");
  }
  writeFormFields(f);
}

function readFormFields() {
  var g = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
  return {
    title: g("sf-title"), duration: parseInt(g("sf-duration"), 10) || 5, status: g("sf-status"),
    goal: g("sf-goal"), notes: g("sf-notes"),
    narration: g("sf-narration"), emotion: g("sf-emotion"), moral: g("sf-moral"), learningObjective: g("sf-learning-objective"),
    dialogue: Array.from(document.querySelectorAll(".sf-dialogue-row")).map(function (r) {
      return { character: (r.querySelector(".sf-dialogue-character") || {}).value || "", line: (r.querySelector(".sf-dialogue-line") || {}).value || "" };
    }).filter(function (d) { return d.character || d.line; }),
    characters: Array.from(document.querySelectorAll(".sf-chip[data-character].selected")).map(function (c) { return c.getAttribute("data-character"); }),
    characterAge: g("sf-character-age"), costume: g("sf-costume"), expression: g("sf-expression"), pose: g("sf-pose"), action: g("sf-action"),
    location: g("sf-location"), environment: g("sf-environment"), weather: g("sf-weather"), season: g("sf-season"), timeOfDay: g("sf-time-of-day"), lighting: g("sf-lighting"),
    cameraAngle: g("sf-camera-angle"), cameraMovement: g("sf-camera-movement"), lens: g("sf-lens"), shotType: g("sf-shot-type"), composition: g("sf-composition"), focus: g("sf-focus"), transition: g("sf-transition"),
    camera: g("sf-camera-angle"),
    masterImagePrompt: g("sf-master-image-prompt"), characterPrompt: g("sf-character-prompt"), backgroundPrompt: g("sf-background-prompt"), stylePrompt: g("sf-style-prompt"), lightingPrompt: g("sf-lighting-prompt"), negativePrompt: g("sf-negative-prompt"), imageModel: g("sf-image-model"),
    masterVideoPrompt: g("sf-master-video-prompt"), cameraMotionPrompt: g("sf-camera-motion-prompt"), animationPrompt: g("sf-animation-prompt"), videoModel: g("sf-video-model"), fps: parseInt(g("sf-fps"), 10) || 24, aspectRatio: g("sf-aspect-ratio"),
    narrationVoice: g("sf-narration-voice"), voiceGender: g("sf-voice-gender"), voiceAge: g("sf-voice-age"), voiceEmotion: g("sf-voice-emotion"), voiceAccent: g("sf-voice-accent"), speed: parseFloat(g("sf-speed")) || 1.0, pitch: parseFloat(g("sf-pitch")) || 1.0, language: g("sf-language"),
    backgroundMusic: g("sf-background-music"), ambientSound: g("sf-ambient-sound"),
    soundEffects: Array.from(document.querySelectorAll(".sf-chip[data-sfx].selected")).map(function (c) { return c.getAttribute("data-sfx"); }),
    music: g("sf-background-music"), sfx: g("sf-ambient-sound"), volume: parseFloat(g("sf-volume")) || 0.8, fadeIn: parseInt(g("sf-fade-in"), 10) || 2, fadeOut: parseInt(g("sf-fade-out"), 10) || 2,
    generatedBy: g("sf-generated-by"), modelUsed: g("sf-model-used"), generationTime: g("sf-generation-time"), promptVersion: g("sf-prompt-version"), tokens: parseInt(g("sf-tokens"), 10) || 0, cost: parseFloat(g("sf-cost")) || 0,
    directorNotes: g("sf-director-notes"), editorNotes: g("sf-editor-notes"), reviewerNotes: g("sf-reviewer-notes"),
    imagePrompt: g("sf-master-image-prompt"), videoPrompt: g("sf-master-video-prompt"), imageStatus: "Pending", assetStatus: "Not Generated"
  };
}

function writeFormFields(f) {
  var s = function (id, v) { var el = document.getElementById(id); if (el) el.value = v || ""; };
  s("sf-master-image-prompt", f.masterImagePrompt);
  s("sf-character-prompt", f.characterPrompt);
  s("sf-background-prompt", f.backgroundPrompt);
  s("sf-lighting-prompt", f.lightingPrompt);
  s("sf-style-prompt", f.stylePrompt);
  s("sf-negative-prompt", f.negativePrompt);
  s("sf-master-video-prompt", f.masterVideoPrompt);
  s("sf-camera-motion-prompt", f.cameraMotionPrompt);
  s("sf-animation-prompt", f.animationPrompt);
  s("sf-background-music", f.backgroundMusic);
}

function closeModal() {
  document.getElementById("scene-editor-modal").classList.remove("visible");
  editingSceneNumber = null;
  activeTab = "general";
}

function saveScene(silent) {
  var banner = document.getElementById("sf-error-banner");
  if (banner) { banner.hidden = true; banner.innerHTML = ""; }
  var f = readFormFields();
  if (!f.title) {
    if (silent) return;
    if (banner) { banner.innerHTML = "<strong>Scene title is required.</strong>"; banner.hidden = false; }
    return;
  }
  f.lastUpdated = new Date().toISOString();
  f.version = (editingSceneNumber || 0) + 1;
  updateScene(currentKuralNumber, editingSceneNumber, f);
  if (!silent) {
    closeModal();
    refreshPage();
    showToast("Scene saved");
  }
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

/* ===== SESSION 12: GENERATE COMPLETE SCENE ===== */
function handleGenerateComplete() {
  var f = readFormFields();
  var narration = f.narration || (f.dialogue.length ? f.dialogue[0].line : "");
  f.masterImagePrompt = autoGenImagePrompt(narration, f.location, f.emotion, f.characters);
  f.characterPrompt = autoGenCharacterPrompt(f.characters, f.expression, f.location);
  f.backgroundPrompt = autoGenBackgroundPrompt(f.location, f.timeOfDay, f.weather);
  f.lightingPrompt = autoGenLightingPrompt(f.timeOfDay, f.weather);
  f.stylePrompt = STUDIO_STYLE.artStyle + ", " + STUDIO_STYLE.imageQuality;
  f.negativePrompt = STUDIO_STYLE.negative;
  f.masterVideoPrompt = autoGenVideoPrompt(narration, f.transition);
  f.cameraMotionPrompt = "Smooth " + (f.cameraMovement || "static").toLowerCase() + " with " + (f.transition || "cut").toLowerCase() + " transition. " + (f.fps || 24) + "fps, " + STUDIO_STYLE.videoQuality + ".";
  f.animationPrompt = "Subtle natural motion, " + (f.emotion || "calm").toLowerCase() + " mood pacing, gentle ambient movement. " + STUDIO_STYLE.videoQuality + ".";
  f.backgroundMusic = autoGenMusicPrompt(f.emotion, f.location);
  var sfxPrompt = autoGenSFXPrompt(f.weather, f.environment);
  if (sfxPrompt && (!f.soundEffects || !f.soundEffects.length)) {
    f.soundEffects = SFX_LIST.filter(function (s) {
      return sfxPrompt.toLowerCase().indexOf(s.toLowerCase()) >= 0;
    });
  }
  writeFormFields(f);
  showToast("Complete scene generated");
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

  var modalClose = document.getElementById("scene-modal-close");
  if (modalClose) modalClose.addEventListener("click", closeModal);
  var modalOverlay = document.getElementById("scene-modal-overlay");
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  document.getElementById("export-json-btn")?.addEventListener("click", function () { handleExport("json"); });
  document.getElementById("export-md-btn")?.addEventListener("click", function () { handleExport("md"); });
  document.getElementById("export-script-btn")?.addEventListener("click", function () { handleExport("script"); });
  document.getElementById("copy-json-btn")?.addEventListener("click", function () { handleExport("copy"); });

  document.querySelectorAll(".sd-export-tab").forEach(function (tab) {
    tab.addEventListener("click", function () { switchExportTab(tab.getAttribute("data-export-tab")); });
  });

  var editorModal = document.getElementById("scene-editor-modal");
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && editorModal && editorModal.classList.contains("visible")) closeModal();
  });
}

document.addEventListener("DOMContentLoaded", initScriptDetail);

})();
