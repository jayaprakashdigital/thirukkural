(function () {
/**
 * Kural Studio — unified per-kural page.
 * Assembles Kural Database + Story Library + Script Page + Character Library
 * data client-side (reusing getScript()/getCharactersForKural() — no data
 * duplication), then talks to the Kural Studio API (studio-server.js, proxied
 * at /studio/*) to generate and display the character/scene images.
 */

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40; // ~2 minutes

function getKuralNumberFromQuery() {
  var params = new URLSearchParams(window.location.search);
  var idParam = params.get("id");
  if (idParam) {
    var m = /^TK-(\d{4})$/i.exec(idParam.trim());
    if (m) return parseInt(m[1], 10);
  }
  var n = parseInt(params.get("kural"), 10);
  return Number.isInteger(n) && n >= 1 && n <= TOTAL_KURALS ? n : 1;
}

function isMvpKural(n) {
  return typeof MVP_KURAL_NUMBERS !== "undefined" && MVP_KURAL_NUMBERS.includes(n);
}

/* ===== FALLBACK DATA (kurals outside the MVP script range, 11-1330) ===== */
function fetchFallbackKuralAndStory(n) {
  return Promise.all([
    fetch("thirukkural.json").then(function (r) { return r.json(); }),
    fetch("all_stories_final.json").then(function (r) { return r.json(); }),
  ]).then(function (results) {
    var kuralData = results[0], stories = results[1];
    var kural = (kuralData.kural || []).find(function (k) { return k.Number === n; }) || null;
    var story = stories.find(function (s) { return s.id === kuralId(n); }) || null;
    return { kural: kural, story: story };
  });
}

/* ===== HEADER ===== */
function renderHeader(n, id, script, fallbackStory) {
  document.getElementById("breadcrumb-kural").textContent = id;
  document.getElementById("kd-kural-id").textContent = id;
  document.title = id + " — Kural Studio — AI Content Studio";

  var theme = script ? script.theme : (fallbackStory && fallbackStory.theme) || "";
  document.getElementById("kd-theme").textContent = theme || "—";
  document.getElementById("kd-title").textContent = (script && script.title) || (fallbackStory && fallbackStory.title) || id;

  var availabilityEl = document.getElementById("kd-availability");
  if (!isMvpKural(n)) {
    availabilityEl.hidden = false;
    availabilityEl.textContent = "Script/scenes not available yet";
  } else {
    availabilityEl.hidden = true;
  }
}

/* ===== KURAL TEXT & STORY ===== */
function renderKuralAndStory(script, fallback) {
  var tamilEl = document.getElementById("kd-kural-tamil");
  var enEl = document.getElementById("kd-kural-en");
  var storyEl = document.getElementById("kd-story-text");

  if (script) {
    tamilEl.textContent = script.thirukkural;
    enEl.textContent = "“" + script.englishTranslation + "”";
    storyEl.textContent = script.storyPreview;
    return;
  }

  var kural = fallback && fallback.kural;
  var story = fallback && fallback.story;
  tamilEl.textContent = kural ? (kural.Line1 + " " + kural.Line2) : "—";
  enEl.textContent = kural ? "“" + kural.Translation + "”" : "";
  storyEl.textContent = story ? story.story : "No story drafted for this kural yet.";
}

/* ===== CHARACTERS ===== */
function renderCharacters(characters) {
  var list = document.getElementById("kd-character-list");
  if (!characters || !characters.length) {
    list.innerHTML = '<p class="sd-story-text">No characters mapped for this kural yet.</p>';
    return;
  }
  list.innerHTML = characters.map(function (c) {
    return (
      '<div class="kd-character-item">' +
      '<div class="kd-character-name">' + esc(c.name) + "</div>" +
      '<div class="kd-character-meta">' + esc(c.role || "") + (c.gender ? " · " + esc(c.gender) : "") + "</div>" +
      '<div class="kd-character-details">' + esc(c.details || "") + "</div>" +
      "</div>"
    );
  }).join("");
}

/* ===== SCENES ===== */
function renderScenes(script) {
  var timeline = document.getElementById("kd-scene-timeline");
  if (!script) {
    timeline.innerHTML =
      '<p class="sd-story-text">No script/scenes for this kural yet — the Script Page currently ' +
      "covers TK-0001–TK-0010. Kural Studio image generation is available once scenes exist.</p>";
    return;
  }
  timeline.innerHTML = script.scenes.map(function (scene, i) {
    var isLast = i === script.scenes.length - 1;
    return (
      '<div class="scene-row">' +
      '<div class="scene-row-rail"><div class="scene-number">' + scene.sceneNumber + "</div>" +
      (isLast ? "" : '<div class="scene-row-line"></div>') +
      "</div>" +
      '<div class="scene-row-card ui-card">' +
      '<div class="ui-card-body">' +
      "<h4>" + esc(scene.title) + "</h4>" +
      '<p class="sd-story-text">' + esc(scene.narration || "") + "</p>" +
      '<p class="kd-scene-meta">' + esc(scene.location || "") + " · " + esc(scene.emotion || "") + "</p>" +
      "</div></div></div>"
    );
  }).join("");
}

/* ===== KURAL STUDIO IMAGES ===== */
var pollTimers = {};

function setImageState(kind, record) {
  var img = document.getElementById("kd-" + kind + "-image");
  var placeholder = document.getElementById("kd-" + kind + "-placeholder");
  var statusEl = document.getElementById("kd-" + kind + "-status");
  var status = (record && record.status) || "none";

  var labels = { none: "Not generated", processing: "Generating…", completed: "Completed", error: "Failed — try again" };
  statusEl.textContent = labels[status] || status;
  statusEl.className = "ui-badge " + (status === "completed" ? "ui-badge-success" : status === "error" ? "ui-badge-warning" : "ui-badge-muted");

  if (status === "completed") {
    img.src = "/studio/image/" + currentKuralId + "/" + kind + "?t=" + Date.now();
    img.hidden = false;
    placeholder.hidden = true;
  } else {
    img.hidden = true;
    placeholder.hidden = false;
    placeholder.textContent = status === "processing" ? "Generating…" : status === "error" ? "Generation failed" : "No image yet";
  }
}

function setStudioUnavailable(message) {
  ["character", "scene"].forEach(function (kind) {
    var statusEl = document.getElementById("kd-" + kind + "-status");
    statusEl.textContent = message;
    statusEl.className = "ui-badge ui-badge-warning";
    document.getElementById("kd-generate-" + kind).disabled = true;
  });
}

function refreshStudioStatus() {
  return fetch("/studio/status/" + currentKuralId)
    .then(function (res) {
      if (!res.ok) throw new Error("status " + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data.available) {
        setStudioUnavailable("Not available for this kural yet");
        return data;
      }
      setImageState("character", data.character);
      setImageState("scene", data.scene);
      return data;
    })
    .catch(function () {
      setStudioUnavailable("Studio backend unavailable");
      return null;
    });
}

function pollUntilDone(kind, attempt) {
  attempt = attempt || 0;
  clearTimeout(pollTimers[kind]);
  pollTimers[kind] = setTimeout(function () {
    refreshStudioStatus().then(function (data) {
      var record = data && data[kind];
      var status = record && record.status;
      if (status === "processing" && attempt < MAX_POLL_ATTEMPTS) {
        pollUntilDone(kind, attempt + 1);
      } else if (status === "completed") {
        showToast((kind === "character" ? "Character" : "Scene") + " image ready");
      } else if (status === "error") {
        showToast((kind === "character" ? "Character" : "Scene") + " image generation failed");
      }
    });
  }, POLL_INTERVAL_MS);
}

function generateImage(kind) {
  document.getElementById("kd-" + kind + "-status").textContent = "Generating…";
  fetch("/studio/generate/" + kind + "/" + currentKuralId, { method: "POST" })
    .then(function (res) {
      if (res.status === 409) {
        showToast("Not available for this kural yet");
        return null;
      }
      if (!res.ok && res.status !== 202) throw new Error("generate failed (" + res.status + ")");
      return res.json();
    })
    .then(function () {
      pollUntilDone(kind, 0);
    })
    .catch(function () {
      showToast("Could not reach the Kural Studio backend");
      refreshStudioStatus();
    });
}

/* ===== BOOT ===== */
var currentKuralId = null;

function boot() {
  // Theme/sidebar/nav init already happens via dashboard.js's own
  // DOMContentLoaded handler (loaded on every admin page) — no need to
  // repeat it here.
  var n = getKuralNumberFromQuery();
  var id = kuralId(n);
  currentKuralId = id;

  var script = (typeof getScript === "function") ? getScript(n) : null;
  var characters = (typeof getCharactersForKural === "function") ? getCharactersForKural(n) : [];

  renderHeader(n, id, script, null);
  renderCharacters(characters);
  renderScenes(script);

  if (script) {
    renderKuralAndStory(script, null);
  } else {
    fetchFallbackKuralAndStory(n).then(function (fallback) {
      renderHeader(n, id, null, fallback.story);
      renderKuralAndStory(null, fallback);
    }).catch(function () {
      renderKuralAndStory(null, null);
    });
  }

  refreshStudioStatus();

  document.getElementById("kd-generate-character").addEventListener("click", function () { generateImage("character"); });
  document.getElementById("kd-generate-scene").addEventListener("click", function () { generateImage("scene"); });
}

document.addEventListener("DOMContentLoaded", boot);

})();
