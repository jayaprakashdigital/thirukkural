(function () {
/**
 * Character Detail — per-kural deep character profile + 3D reference viewer.
 * Pulls from Kural DB (media-data.js), Story Library (kural-characters.js,
 * derived via character-derive.js) and, when available, the Script Page
 * (scripts-data.js, kurals 1-10 only) so all four surfaces agree on the
 * same character for a given kural.
 */

var currentKuralNumber = 1;
var currentCharIndex = 0;
var currentChars = [];

function getParams() {
  var params = new URLSearchParams(window.location.search);
  var n = parseInt(params.get("kural"), 10);
  var c = parseInt(params.get("c"), 10);
  if (!n || n < 1 || n > TOTAL_KURALS) n = 1;
  if (!(c >= 0)) c = 0;
  return { kuralNumber: n, charIndex: c };
}

function setQuery(kuralNumber, charIndex) {
  var url = new URL(window.location.href);
  url.searchParams.set("kural", kuralNumber);
  url.searchParams.set("c", charIndex);
  window.history.replaceState(null, "", url);
}

function mediaFor(kuralNumber) {
  return (typeof KURAL_MEDIA !== "undefined") ? KURAL_MEDIA[kuralNumber - 1] : null;
}

function loadCharacters(kuralNumber) {
  var derived = deriveKuralCharacters(kuralNumber);
  var store = loadCharStore();
  return derived.map(function (c) { return Object.assign({}, c, store[c.id] || {}); });
}

/* ===== HEADER ===== */
function renderHeader(kuralNumber, c) {
  var media = mediaFor(kuralNumber);
  document.getElementById("breadcrumb-kural").textContent = c.kuralId;
  document.getElementById("cd-kural-id").textContent = c.kuralId;
  document.getElementById("cd-theme").textContent = (media && media.chEn) ? media.chEn : (c.storyContext.theme || "—");
  document.getElementById("cd-consistency").textContent = c.legacy ? "Legacy / Symbolic" : "Story-derived — matches all 4 pages";
  document.getElementById("cd-name").textContent = c.name;
  document.getElementById("cd-role-meta").innerHTML = "<strong>" + esc(c.role || "Character") + "</strong>";
  document.getElementById("cd-gender-meta").textContent = c.gender || "—";
  document.getElementById("cd-age-meta").textContent = c.age ? (c.age + " yrs · " + c.ageGroup) : c.ageGroup;
  document.title = c.name + " — " + c.kuralId + " — Character Detail";

  document.getElementById("cd-link-script").href = (typeof MVP_KURAL_NUMBERS !== "undefined" && MVP_KURAL_NUMBERS.includes(kuralNumber)) ?
    "script-detail.html?kural=" + kuralNumber : "prompts.html";
  document.getElementById("cd-edit-link").href = "characters.html?open=" + encodeURIComponent(c.id);
}

function renderSwitcher(chars, activeIndex) {
  var box = document.getElementById("cd-switcher");
  if (chars.length < 2) { box.innerHTML = ""; return; }
  box.innerHTML = chars.map(function (c, i) {
    return '<button type="button" class="cd-switcher-btn' + (i === activeIndex ? " active" : "") + '" data-idx="' + i + '">' + esc(c.name) + "</button>";
  }).join("");
  box.querySelectorAll(".cd-switcher-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentCharIndex = parseInt(btn.getAttribute("data-idx"), 10);
      setQuery(currentKuralNumber, currentCharIndex);
      renderAll();
    });
  });
}

/* ===== 3D VIEWER ===== */
function faceContent(c, face, seedOffset) {
  var urlField = face === "front" ? c.frontView : (face === "side" ? c.sideView : c.backView);
  if (urlField) return '<img src="' + esc(urlField) + '" alt="' + esc(c.name) + " — " + face + ' view">';
  var seed = hashStr(c.id + ":" + face + ":" + seedOffset);
  return buildAvatarSVG(c.name, seed, face);
}

function renderViewer(c) {
  document.getElementById("cd-face-front").innerHTML = faceContent(c, "front", 0);
  document.getElementById("cd-face-side").innerHTML = faceContent(c, "side", 1);
  document.getElementById("cd-face-back").innerHTML = faceContent(c, "back", 2);
  document.getElementById("cd-front-view").value = c.frontView || "";
  document.getElementById("cd-side-view").value = c.sideView || "";
  document.getElementById("cd-back-view").value = c.backView || "";

  var card = document.getElementById("cd-card");
  card.setAttribute("data-view", "front");
  document.querySelectorAll("#cd-turnaround .ui-btn").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-view") === "front");
  });
}

function wireTurnaround() {
  var card = document.getElementById("cd-card");
  document.querySelectorAll("#cd-turnaround .ui-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var view = btn.getAttribute("data-view");
      card.setAttribute("data-view", view);
      document.querySelectorAll("#cd-turnaround .ui-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
    });
  });
}

function wireTilt() {
  var stage = document.getElementById("cd-stage");
  var card = document.getElementById("cd-card");
  var baseTransform = "";

  function applyTilt(x, y, rect) {
    var px = (x - rect.left) / rect.width - 0.5;
    var py = (y - rect.top) / rect.height - 0.5;
    var rotY = px * 16;
    var rotX = -py * 16;
    card.style.transform = baseTransform + " rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
  }

  stage.addEventListener("mousemove", function (e) {
    baseTransform = getBaseRotation();
    applyTilt(e.clientX, e.clientY, stage.getBoundingClientRect());
  });
  stage.addEventListener("mouseleave", function () {
    card.style.transform = "";
  });
  stage.addEventListener("touchmove", function (e) {
    if (!e.touches || !e.touches[0]) return;
    baseTransform = getBaseRotation();
    applyTilt(e.touches[0].clientX, e.touches[0].clientY, stage.getBoundingClientRect());
  }, { passive: true });
  stage.addEventListener("touchend", function () { card.style.transform = ""; });

  function getBaseRotation() {
    var view = card.getAttribute("data-view");
    if (view === "side") return "rotateY(-90deg)";
    if (view === "back") return "rotateY(-180deg)";
    return "rotateY(0deg)";
  }
}

/* ===== DEEP DETAIL SECTIONS ===== */
function item(label, value, full) {
  return '<div class="cd-detail-item' + (full ? " full" : "") + '"><label>' + esc(label) + "</label><span>" + esc(value || "—") + "</span></div>";
}

function renderDetails(c) {
  var body = document.getElementById("cd-details-body");
  body.innerHTML =
    '<div class="cd-detail-section"><h3>Identity</h3><div class="cd-detail-grid">' +
      item("Name", c.name) + item("Role", c.role) + item("Kural", c.kuralId) + item("Status", c.status) +
      item("Description", c.description, true) +
    '</div></div>' +

    '<div class="cd-detail-section"><h3>Appearance</h3><div class="cd-detail-grid">' +
      item("Age", c.age ? c.age + " years" : c.ageGroup) + item("Gender", c.gender) + item("Height", c.height) +
      item("Body Type", c.bodyType) + item("Skin Tone", c.skinTone) + item("Face Shape", c.faceShape) +
      item("Hair Style", c.hairStyle) + item("Hair Color", c.hairColor) + item("Eye Color", c.eyeColor) +
      (c.facialHair ? item("Facial Hair", c.facialHair) : "") +
    '</div></div>' +

    '<div class="cd-detail-section"><h3>Clothing</h3><div class="cd-detail-grid">' +
      item("Default Costume", c.defaultCostume) + item("Footwear", c.footwear) +
      item("Accessories", c.accessories) + item("Jewelry", c.jewelry) +
    '</div></div>' +

    '<div class="cd-detail-section"><h3>Personality &amp; Tone</h3><div class="cd-detail-grid">' +
      item("Traits", c.traits, true) + item("Behaviour", c.behaviour, true) + item("Emotion Style", c.emotionStyle) +
      item("Strengths", c.strengths) + item("Weaknesses", c.weaknesses) +
      item("Speaking Style", c.speakingStyle) + item("Walking Style", c.walkingStyle) +
    '</div></div>' +

    '<div class="cd-detail-section"><h3>Voice</h3><div class="cd-detail-grid">' +
      item("Language", c.language) + item("Accent", c.accent) + item("Voice Gender", c.voiceGender) +
      item("Voice Style", c.voiceStyle) + item("Speaking Speed", c.speakingSpeed + "x") + item("Pitch", c.pitch + "x") +
      item("Voice Emotion", c.voiceEmotion) +
    '</div></div>' +

    '<div class="cd-detail-section"><h3>AI Image Prompts</h3>' +
      promptBlock("Master Prompt", c.masterPrompt) + promptBlock("Face Prompt", c.facePrompt) +
      promptBlock("Body Prompt", c.bodyPrompt) + promptBlock("Costume Prompt", c.costumePrompt) +
      promptBlock("Expression Prompt", c.expressionPrompt) +
    '</div>';

  body.querySelectorAll(".cd-prompt-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ta = document.getElementById(btn.getAttribute("data-target"));
      copyText(ta.value, "Prompt");
    });
  });
}

function promptBlock(label, value) {
  var id = "cd-prompt-" + label.toLowerCase().replace(/\s+/g, "-");
  return '<div class="cd-prompt-block"><label>' + esc(label) + '<button type="button" class="ui-btn cd-prompt-copy" style="float:right;padding:0.15rem 0.6rem;font-size:0.7rem;" data-target="' + id + '">Copy</button></label>' +
    '<textarea id="' + id + '" readonly>' + esc(value) + "</textarea></div>";
}

/* ===== STORY CONTEXT ===== */
function renderStory(kuralNumber, c) {
  var media = mediaFor(kuralNumber);
  var ctx = c.storyContext || {};
  var text = ctx.hook ? (ctx.hook + (ctx.moral ? " " + ctx.moral : "")) : "";
  document.getElementById("cd-story-text").textContent =
    (ctx.title ? ctx.title + " — " : "") + (ctx.location ? ctx.location + ". " : "") + text;
  document.getElementById("cd-kural-tamil").textContent = media ? media.ta : "";
  document.getElementById("cd-kural-en").textContent = media ? "“" + media.en + "”" : "";
}

/* ===== SCRIPT SECTION ===== */
function renderScript(kuralNumber) {
  var subtitle = document.getElementById("cd-script-subtitle");
  var body = document.getElementById("cd-script-body");
  var hasScript = typeof MVP_KURAL_NUMBERS !== "undefined" && MVP_KURAL_NUMBERS.includes(kuralNumber) && typeof getScript === "function";
  var script = hasScript ? getScript(kuralNumber) : null;

  if (!script) {
    subtitle.textContent = "No script generated yet for this kural";
    body.innerHTML = '<p class="cd-script-empty">Scripts currently exist for TK-0001 – TK-0010. <a href="prompts.html">Browse the Script Page</a> to see what is available.</p>';
    return;
  }
  subtitle.textContent = script.scenes.length + " scenes · " + script.title;
  body.innerHTML = '<div class="cd-script-scenes">' + script.scenes.map(function (s) {
    return '<div class="cd-script-scene"><strong>Scene ' + s.sceneNumber + ':</strong> ' + esc(s.title || "") + "</div>";
  }).join("") + '</div><div style="margin-top:0.85rem;"><a class="ui-btn ui-btn-primary" href="script-detail.html?kural=' + kuralNumber + '">Open Full Script &rarr;</a></div>';
}

/* ===== REFERENCE IMAGE SAVE =====
 * Re-assigning .onclick (rather than addEventListener) on every render
 * keeps this idempotent across character-switcher re-renders, so a stale
 * closure from a previously-shown character never double-fires. */
function wireRefSave(c) {
  document.getElementById("cd-save-refs").onclick = function () {
    var updated = Object.assign({}, c, {
      frontView: document.getElementById("cd-front-view").value.trim(),
      sideView: document.getElementById("cd-side-view").value.trim(),
      backView: document.getElementById("cd-back-view").value.trim()
    });
    saveChar(updated);
    currentChars[currentCharIndex] = updated;
    renderViewer(updated);
    showToast("Reference images saved");
  };
  document.getElementById("cd-copy-prompt").onclick = function () {
    copyText(c.masterPrompt || "", "AI image prompt");
  };
}

/* ===== MAIN RENDER ===== */
function renderAll() {
  currentChars = loadCharacters(currentKuralNumber);
  if (!currentChars.length) currentChars = [Object.assign({}, defaultExtendedFields(), { id: "TK-" + String(currentKuralNumber).padStart(4, "0") + "-c0", name: "No characters recorded", kuralId: kuralId(currentKuralNumber), kuralNumber: currentKuralNumber, storyContext: {} })];
  if (currentCharIndex >= currentChars.length) currentCharIndex = 0;
  var c = currentChars[currentCharIndex];

  renderHeader(currentKuralNumber, c);
  renderSwitcher(currentChars, currentCharIndex);
  renderViewer(c);
  renderDetails(c);
  renderStory(currentKuralNumber, c);
  renderScript(currentKuralNumber);
  wireRefSave(c);
}

function initCharacterDetail() {
  var params = getParams();
  currentKuralNumber = params.kuralNumber;
  currentCharIndex = params.charIndex;

  initSidebar();
  initTheme();
  renderAll();
  wireTurnaround();
  wireTilt();
}

document.addEventListener("DOMContentLoaded", initCharacterDetail);
})();
