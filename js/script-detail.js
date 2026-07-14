/**
 * Script Detail Page — Scene Timeline & Scene Editor (MVP Prototype)
 * Scope: TK-0001 to TK-0010 only. No backend, no API — localStorage prototype.
 */

const SCENE_STATUS_OPTIONS = ["Draft", "Ready", "Final"];

let currentKuralNumber = null;
let editingSceneNumber = null;

function getKuralFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const n = parseInt(params.get("kural"), 10);
  return MVP_KURAL_NUMBERS.includes(n) ? n : MVP_KURAL_NUMBERS[0];
}

// computeScriptStatus, statusBadgeClass, formatUpdated live in scripts-data.js
// (shared with the Script List page to avoid duplicating status logic).

// ===== HEADER + STORY PREVIEW =====

function renderHeader(script) {
  document.getElementById("breadcrumb-kural").textContent = script.kuralId;
  document.getElementById("sd-kural-id").textContent = script.kuralId;
  document.getElementById("sd-theme").textContent = script.theme;
  document.getElementById("sd-title").textContent = script.title;
  document.getElementById("sd-scene-count").textContent = script.scenes.length;
  document.getElementById("sd-duration").textContent = formatDuration(calcTotalDuration(script));
  document.getElementById("sd-updated").textContent = formatUpdated(script.updatedAt);

  const status = computeScriptStatus(script);
  const statusEl = document.getElementById("sd-status");
  statusEl.textContent = status;
  statusEl.className = `ui-badge ${statusBadgeClass(status)}`;

  document.getElementById("sd-story-text").textContent = script.storyPreview;
  document.getElementById("sd-kural-tamil").textContent = script.thirukkural;
  document.getElementById("sd-kural-en").textContent = `"${script.englishTranslation}"`;

  document.title = `${script.kuralId} — Script Detail — AI Content Studio`;
}

// ===== SCENE TIMELINE =====

function sceneCardHTML(scene, index, total) {
  const characterTags = scene.characters.map(c => `<span class="scene-tag">${c}</span>`).join("");
  return `
    <div class="scene-card" data-scene="${scene.sceneNumber}">
      <div class="scene-card-header">
        <span class="scene-number">${scene.sceneNumber}</span>
        <div class="scene-card-reorder">
          <button type="button" class="scene-reorder-btn" data-action="up" data-scene="${scene.sceneNumber}" ${index === 0 ? "disabled" : ""} aria-label="Move scene earlier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
          <button type="button" class="scene-reorder-btn" data-action="down" data-scene="${scene.sceneNumber}" ${index === total - 1 ? "disabled" : ""} aria-label="Move scene later">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </button>
        </div>
      </div>
      <div class="scene-card-body" data-action="edit" data-scene="${scene.sceneNumber}">
        <h3 class="scene-title">${scene.title || "Untitled Scene"}</h3>
        <div class="scene-meta">
          <span class="scene-tag">${scene.duration}s</span>
          <span class="scene-tag">${scene.location}</span>
          <span class="scene-tag">${scene.status}</span>
        </div>
        <div class="scene-meta">${characterTags}</div>
        <p class="scene-narration-preview">${scene.narration || "No narration yet."}</p>
      </div>
      <div class="scene-card-footer">
        <button type="button" class="ui-btn" data-action="edit" data-scene="${scene.sceneNumber}">Edit</button>
        <button type="button" class="ui-btn" data-action="delete" data-scene="${scene.sceneNumber}">Delete</button>
      </div>
    </div>
  `;
}

function connectorHTML() {
  return `<div class="scene-timeline-connector"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>`;
}

function renderTimeline(script) {
  const container = document.getElementById("scene-timeline");
  const total = script.scenes.length;

  let html = "";
  script.scenes.forEach((scene, i) => {
    html += sceneCardHTML(scene, i, total);
    html += connectorHTML();
  });
  html += `
    <button type="button" class="scene-add-card" id="timeline-add-scene">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Scene
    </button>
  `;
  container.innerHTML = html;

  container.querySelectorAll('[data-action="edit"]').forEach(el => {
    el.addEventListener("click", () => openSceneEditor(parseInt(el.getAttribute("data-scene"), 10)));
  });
  container.querySelectorAll('[data-action="delete"]').forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteScene(parseInt(el.getAttribute("data-scene"), 10));
    });
  });
  container.querySelectorAll('[data-action="up"], [data-action="down"]').forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const sceneNum = parseInt(el.getAttribute("data-scene"), 10);
      const direction = el.getAttribute("data-action");
      reorderScene(currentKuralNumber, sceneNum, direction);
      refreshPage();
    });
  });
  document.getElementById("timeline-add-scene")?.addEventListener("click", handleAddScene);
}

function handleAddScene() {
  const script = getScript(currentKuralNumber);
  const lastSceneNumber = script.scenes.length ? script.scenes[script.scenes.length - 1].sceneNumber : 0;
  addScene(currentKuralNumber, lastSceneNumber);
  const updated = getScript(currentKuralNumber);
  refreshPage();
  openSceneEditor(updated.scenes[updated.scenes.length - 1].sceneNumber);
  showToast("Scene added");
}

function handleDeleteScene(sceneNumber) {
  if (!confirm(`Delete Scene ${sceneNumber}? This cannot be undone.`)) return;
  deleteScene(currentKuralNumber, sceneNumber);
  refreshPage();
  showToast("Scene deleted");
}

// ===== SCENE EDITOR =====

function characterOptionsFor(script) {
  const set = new Set();
  script.scenes.forEach(s => s.characters.forEach(c => set.add(c)));
  set.add("Thiruvalluvar");
  return Array.from(set);
}

function sceneEditorHTML(scene, script) {
  const characterOptions = characterOptionsFor(script);

  const characterChips = characterOptions.map(c => `
    <span class="sf-chip ${scene.characters.includes(c) ? "selected" : ""}" data-character="${c}">${c}</span>
  `).join("");

  const dialogueRows = (scene.dialogue.length ? scene.dialogue : [{ character: "", line: "" }]).map((d, i) => `
    <div class="sf-dialogue-row" data-index="${i}">
      <input type="text" class="sf-dialogue-character" placeholder="Character" value="${(d.character || "").replace(/"/g, "&quot;")}">
      <input type="text" class="sf-dialogue-line" placeholder="Dialogue line" value="${(d.line || "").replace(/"/g, "&quot;")}">
      <button type="button" class="sf-dialogue-remove" data-index="${i}" aria-label="Remove line">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join("");

  const opt = (list, current) => list.map(v => `<option value="${v}" ${v === current ? "selected" : ""}>${v}</option>`).join("");

  return `
    <h2 style="margin: 0 0 1.25rem 0; font-size: 1.35rem; font-weight: 600;">Scene ${scene.sceneNumber} — ${script.kuralId}</h2>
    <div class="sf-error-banner" id="sf-error-banner" hidden></div>
    <form class="scene-editor-form" id="scene-editor-form">
      <div class="sf-row">
        <div class="sf-field">
          <label for="sf-title">Scene Title <span aria-hidden="true">*</span></label>
          <input type="text" id="sf-title" required aria-required="true" value="${(scene.title || "").replace(/"/g, "&quot;")}">
        </div>
        <div class="sf-field">
          <label for="sf-duration">Duration (seconds) <span aria-hidden="true">*</span></label>
          <input type="number" id="sf-duration" required aria-required="true" min="1" max="120" value="${scene.duration}">
        </div>
        <div class="sf-field">
          <label for="sf-status">Status</label>
          <select id="sf-status">${opt(SCENE_STATUS_OPTIONS, scene.status)}</select>
        </div>
      </div>

      <div class="sf-row">
        <div class="sf-field">
          <label for="sf-location">Location</label>
          <select id="sf-location">${opt(LOCATION_OPTIONS, scene.location)}</select>
        </div>
        <div class="sf-field">
          <label for="sf-emotion">Emotion</label>
          <select id="sf-emotion">${opt(EMOTION_OPTIONS, scene.emotion)}</select>
        </div>
        <div class="sf-field">
          <label for="sf-camera">Camera</label>
          <select id="sf-camera">${opt(CAMERA_OPTIONS, scene.camera)}</select>
        </div>
        <div class="sf-field">
          <label for="sf-transition">Transition</label>
          <select id="sf-transition">${opt(TRANSITION_OPTIONS, scene.transition)}</select>
        </div>
      </div>

      <div class="sf-row">
        <div class="sf-field">
          <label for="sf-music">Music</label>
          <select id="sf-music">${opt(MUSIC_OPTIONS, scene.music || MUSIC_OPTIONS[0])}</select>
        </div>
        <div class="sf-field">
          <label for="sf-sfx">SFX</label>
          <select id="sf-sfx">${opt(SFX_OPTIONS, scene.sfx || SFX_OPTIONS[0])}</select>
        </div>
      </div>

      <div class="sf-field">
        <label>Characters</label>
        <div class="sf-multiselect" id="sf-characters">${characterChips}</div>
      </div>

      <div class="sf-field">
        <label for="sf-narration">Narration</label>
        <textarea id="sf-narration">${scene.narration || ""}</textarea>
      </div>

      <div class="sf-field">
        <label>Dialogue</label>
        <div class="sf-dialogue-list" id="sf-dialogue-list">${dialogueRows}</div>
        <button type="button" class="ui-btn sf-add-dialogue" id="sf-add-dialogue">+ Add Line</button>
      </div>

      <div class="sf-row">
        <div class="sf-field">
          <label for="sf-image-prompt">Image Prompt</label>
          <textarea id="sf-image-prompt">${scene.imagePrompt || ""}</textarea>
        </div>
        <div class="sf-field">
          <label for="sf-video-prompt">Video Prompt</label>
          <textarea id="sf-video-prompt">${scene.videoPrompt || ""}</textarea>
        </div>
      </div>

      <div class="sf-section-label">AI Actions</div>
      <div class="sf-ai-actions">
        <button type="button" class="sf-ai-btn" data-ai="regenerate">✨ Generate Scene</button>
        <button type="button" class="sf-ai-btn" data-ai="dialogue">💬 Improve Dialogue</button>
        <button type="button" class="sf-ai-btn" data-ai="narration">📝 Improve Narration</button>
        <button type="button" class="sf-ai-btn" data-ai="image">🖼️ Generate Image Prompt</button>
        <button type="button" class="sf-ai-btn" data-ai="video">🎬 Generate Video Prompt</button>
      </div>

      <div class="sf-form-actions">
        <button type="button" class="ui-btn" id="sf-cancel">Cancel</button>
        <button type="button" class="ui-btn ui-btn-primary" id="sf-save">Save Scene</button>
      </div>
    </form>
  `;
}

function openSceneEditor(sceneNumber) {
  const script = getScript(currentKuralNumber);
  const scene = script.scenes.find(s => s.sceneNumber === sceneNumber);
  if (!scene) return;

  editingSceneNumber = sceneNumber;
  const body = document.getElementById("scene-editor-body");
  body.innerHTML = sceneEditorHTML(scene, script);

  body.querySelectorAll(".sf-chip").forEach(chip => {
    chip.addEventListener("click", () => chip.classList.toggle("selected"));
  });

  body.querySelectorAll(".sf-dialogue-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".sf-dialogue-row")?.remove();
    });
  });

  document.getElementById("sf-add-dialogue")?.addEventListener("click", () => {
    const list = document.getElementById("sf-dialogue-list");
    const row = document.createElement("div");
    row.className = "sf-dialogue-row";
    row.innerHTML = `
      <input type="text" class="sf-dialogue-character" placeholder="Character">
      <input type="text" class="sf-dialogue-line" placeholder="Dialogue line">
      <button type="button" class="sf-dialogue-remove" aria-label="Remove line">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    row.querySelector(".sf-dialogue-remove").addEventListener("click", () => row.remove());
    list.appendChild(row);
  });

  // AI action buttons — UI only. TODO(Phase 3A): wire to Claude API prompt-crafting backend.
  body.querySelectorAll(".sf-ai-btn").forEach(btn => {
    btn.addEventListener("click", () => showToast("AI actions are coming in a future phase — this is a UI preview only."));
  });

  document.getElementById("sf-cancel")?.addEventListener("click", closeSceneEditor);
  document.getElementById("sf-save")?.addEventListener("click", saveSceneFromForm);

  document.getElementById("scene-editor-modal").classList.add("visible");
}

function closeSceneEditor() {
  document.getElementById("scene-editor-modal").classList.remove("visible");
  editingSceneNumber = null;
}

function clearFieldErrors() {
  document.querySelectorAll(".sf-field-invalid").forEach(el => el.classList.remove("sf-field-invalid"));
  const banner = document.getElementById("sf-error-banner");
  banner.hidden = true;
  banner.innerHTML = "";
}

function markFieldInvalid(id) {
  document.getElementById(id)?.classList.add("sf-field-invalid");
}

function showFormErrors(errors) {
  const banner = document.getElementById("sf-error-banner");
  banner.innerHTML = `<strong>Please fix the following:</strong><ul>${errors.map(e => `<li>${e.message}</li>`).join("")}</ul>`;
  banner.hidden = false;
  errors.forEach(e => e.field && markFieldInvalid(e.field));
  banner.scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateSceneForm(fields) {
  const errors = [];

  if (!fields.title) {
    errors.push({ field: "sf-title", message: "Scene title is required." });
  }

  if (!Number.isFinite(fields.duration) || fields.duration < 1 || fields.duration > 120) {
    errors.push({ field: "sf-duration", message: "Duration must be between 1 and 120 seconds." });
  }

  if (!fields.narration && fields.dialogue.length === 0) {
    errors.push({ field: "sf-narration", message: "Add narration or at least one dialogue line — this scene can't be empty." });
  }

  const incompleteDialogue = fields.dialogue.some(d => !d.character || !d.line);
  if (incompleteDialogue) {
    errors.push({ message: "Every dialogue line needs both a character and text — remove or complete incomplete lines." });
  }

  return errors;
}

function saveSceneFromForm() {
  clearFieldErrors();

  const selectedCharacters = Array.from(document.querySelectorAll(".sf-chip.selected"))
    .map(chip => chip.getAttribute("data-character"));

  const dialogue = Array.from(document.querySelectorAll(".sf-dialogue-row")).map(row => ({
    character: row.querySelector(".sf-dialogue-character").value.trim(),
    line: row.querySelector(".sf-dialogue-line").value.trim()
  })).filter(d => d.character || d.line);

  const durationRaw = document.getElementById("sf-duration").value;

  const updatedFields = {
    title: document.getElementById("sf-title").value.trim(),
    duration: parseInt(durationRaw, 10),
    status: document.getElementById("sf-status").value,
    location: document.getElementById("sf-location").value,
    emotion: document.getElementById("sf-emotion").value,
    camera: document.getElementById("sf-camera").value,
    transition: document.getElementById("sf-transition").value,
    music: document.getElementById("sf-music").value,
    sfx: document.getElementById("sf-sfx").value,
    characters: selectedCharacters,
    narration: document.getElementById("sf-narration").value.trim(),
    dialogue,
    imagePrompt: document.getElementById("sf-image-prompt").value.trim(),
    videoPrompt: document.getElementById("sf-video-prompt").value.trim()
  };

  const errors = validateSceneForm(updatedFields);
  if (errors.length > 0) {
    showFormErrors(errors);
    return;
  }

  updateScene(currentKuralNumber, editingSceneNumber, updatedFields);
  closeSceneEditor();
  refreshPage();
  showToast("Scene saved");
}

// ===== PAGE LIFECYCLE =====

function refreshPage() {
  const script = getScript(currentKuralNumber);
  renderHeader(script);
  renderTimeline(script);
}

function initScriptDetail() {
  currentKuralNumber = getKuralFromQuery();
  refreshPage();

  document.getElementById("add-scene-btn")?.addEventListener("click", handleAddScene);

  document.getElementById("generate-script-btn")?.addEventListener("click", () => {
    if (!confirm("Regenerate this script from the source story? Any manual edits to scenes will be lost.")) return;
    const source = SCRIPT_SOURCE_STORIES.find(s => s.kuralNumber === currentKuralNumber);
    if (!source) return;
    const fresh = buildScriptFromStory(source);
    saveScript(currentKuralNumber, fresh);
    refreshPage();
    showToast("Script regenerated from story");
  });

  document.getElementById("scene-modal-close")?.addEventListener("click", closeSceneEditor);
  document.getElementById("scene-modal-overlay")?.addEventListener("click", closeSceneEditor);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("scene-editor-modal").classList.contains("visible")) {
      closeSceneEditor();
    }
  });
}

// dashboard.js's own DOMContentLoaded handler already wires up the sidebar
// and theme toggle on every admin page — only page-specific init lives here.
document.addEventListener("DOMContentLoaded", initScriptDetail);
