/**
 * Character Library — Master Character Database
 * Single source of truth for all character data across the AI pipeline.
 */

/* Storage layer, defaultExtendedFields(), autoGenCharPrompts(), saveChar(),
   and deleteCharFromStore() now live in js/character-derive.js, shared with
   character-detail.html. */
var charCache = [];
var editingCharId = null;
var charActiveTab = "general";
var CHAR_PAGE_SIZE = 60;
var charPage = 1;

/* ===== MERGE: story-derived characters (primary) + legacy allegorical
   characters (kept as extra, clearly-labeled cards — see character-derive.js
   for why the primary source changed) + any user-added characters ===== */
function getMergedCharacters() {
  var store = loadCharStore();
  var base = [];
  var seenIds = {};
  var kurals = getKuralsWithCharacters ? getKuralsWithCharacters() : [];
  kurals.forEach(function (kn) {
    var chars = getCharactersForKural ? getCharactersForKural(kn) : [];
    if (Array.isArray(chars)) {
      chars.forEach(function (ch) {
        var merged = Object.assign({}, defaultExtendedFields(), ch, store[ch.id] || {});
        base.push(merged);
        seenIds[merged.id] = true;
      });
    }
  });
  if (typeof CHARACTER_DATABASE === "object" && CHARACTER_DATABASE) {
    Object.keys(CHARACTER_DATABASE).forEach(function (kn) {
      (CHARACTER_DATABASE[kn] || []).forEach(function (ch) {
        if (seenIds[ch.id]) return;
        var merged = Object.assign({}, defaultExtendedFields(), ch, {
          kuralNumber: Number(kn),
          kuralId: "TK-" + String(kn).padStart(4, "0"),
          legacy: true
        }, store[ch.id] || {});
        base.push(merged);
        seenIds[merged.id] = true;
      });
    });
  }
  Object.keys(store).forEach(function (id) {
    if (!seenIds[id]) {
      var sc = store[id];
      if (sc && !sc.archived) {
        base.push(Object.assign({}, defaultExtendedFields(), sc, { id: id }));
        seenIds[id] = true;
      }
    }
  });
  return base;
}

function getCharById(id) {
  return charCache.find(function (c) { return c.id === id; });
}

/* ===== STATS ===== */
function renderStats() {
  var total = charCache.length;
  var active = charCache.filter(function (c) { return c.status === "Active"; }).length;
  var locked = charCache.filter(function (c) { return c.lockFace || c.lockHair || c.lockCostume; }).length;
  var archived = charCache.filter(function (c) { return c.status === "Archived"; }).length;
  var unused = charCache.filter(function (c) { return !c.storiesUsed || c.storiesUsed.length === 0; }).length;
  var recent = charCache.filter(function (c) {
    if (!c.modifiedAt) return false;
    var d = new Date(c.modifiedAt);
    return (Date.now() - d.getTime()) < 86400000;
  }).length;

  var stats = [
    { label: "Total", value: total },
    { label: "Active", value: active },
    { label: "Locked", value: locked },
    { label: "Archived", value: archived },
    { label: "Unused", value: unused },
    { label: "Recent (24h)", value: recent }
  ];
  document.getElementById("char-stats-grid").innerHTML = stats.map(function (s) {
    return '<div class="char-stat-card"><span class="char-stat-value">' + s.value + '</span><span class="char-stat-label">' + s.label + '</span></div>';
  }).join("");
}

/* ===== FILTER DROPDOWN POPULATION ===== */
function populateFilters() {
  var roles = {};
  charCache.forEach(function (c) { if (c.role) roles[c.role] = true; });
  var roleSel = document.getElementById("role-filter");
  Object.keys(roles).sort().forEach(function (r) {
    roleSel.innerHTML += '<option value="' + esc(r) + '">' + esc(r) + "</option>";
  });
}

/* ===== CARD RENDERING ===== */
function renderCard(c) {
  var initials = (c.name || "?").charAt(0).toUpperCase();
  var locked = c.lockFace || c.lockHair || c.lockCostume;
  var statusClass = c.status === "Archived" ? " archived" : (locked ? " locked" : "");
  var tags = [];
  if (c.gender) tags.push('<span class="char-tag">' + esc(c.gender) + '</span>');
  if (c.role) tags.push('<span class="char-tag gold">' + esc(c.role) + '</span>');
  if (c.legacy) tags.push('<span class="char-tag">Legacy/Symbolic</span>');
  if (locked) tags.push('<span class="char-tag teal">Locked</span>');
  if (c.storiesUsed && c.storiesUsed.length) tags.push('<span class="char-tag blue">' + c.storiesUsed.length + ' stories</span>');

  // Story-derived character ids look like "TK-0001-c0" — the trailing
  // index is which character in that kural's cast this is, used to deep
  // link straight to that character on character-detail.html.
  var idxMatch = /-c(\d+)$/.exec(c.id || "");
  var profileLink = (!c.legacy && c.kuralNumber) ?
    '<a class="char-card-profile-link" data-no-drawer href="character-detail.html?kural=' + c.kuralNumber + '&c=' + (idxMatch ? idxMatch[1] : 0) + '">Open full profile &rarr;</a>' : "";

  return '<div class="char-card' + statusClass + '" data-char-id="' + esc(c.id) + '">' +
    '<div class="char-card-top"><div class="char-avatar">' + initials + '</div><div class="char-card-info">' +
    '<h3 class="char-card-name">' + esc(c.name) + '</h3><span class="char-card-id">' + esc(c.id) + '</span></div></div>' +
    '<div class="char-card-body"><div class="char-card-tags">' + tags.join("") + '</div></div>' +
    '<div class="char-card-footer"><span>Updated: ' + (c.modifiedAt ? c.modifiedAt.slice(0, 10) : '—') + '</span>' +
    '<span>' + (c.kuralId || "") + '</span></div>' + profileLink + '</div>';
}

function renderGrid(chars) {
  var grid = document.getElementById("char-grid");
  var empty = document.getElementById("empty-state");
  if (!chars.length) { grid.innerHTML = ""; empty.classList.add("visible"); return; }
  empty.classList.remove("visible");
  grid.innerHTML = chars.map(renderCard).join("");
  grid.querySelectorAll(".char-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("[data-no-drawer]")) return;
      openDrawer(card.getAttribute("data-char-id"));
    });
  });
}

function renderPager(total, totalPages) {
  var pager = document.getElementById("char-pager");
  if (!pager) return;
  if (total === 0) { pager.innerHTML = ""; return; }
  pager.innerHTML =
    '<button type="button" class="ui-btn" id="char-page-prev"' + (charPage <= 1 ? " disabled" : "") + '>&larr; Prev</button>' +
    '<span class="char-pager-info">Page ' + charPage + ' of ' + totalPages + ' &middot; ' + total + ' characters</span>' +
    '<button type="button" class="ui-btn" id="char-page-next"' + (charPage >= totalPages ? " disabled" : "") + '>Next &rarr;</button>';
  document.getElementById("char-page-prev")?.addEventListener("click", function () { if (charPage > 1) { charPage--; filterChars(); } });
  document.getElementById("char-page-next")?.addEventListener("click", function () { if (charPage < totalPages) { charPage++; filterChars(); } });
}

function filterChars(resetPage) {
  if (resetPage) charPage = 1;
  var search = (document.getElementById("search-input").value || "").toLowerCase();
  var role = document.getElementById("role-filter").value;
  var gender = document.getElementById("gender-filter").value;
  var age = document.getElementById("age-filter").value;
  var status = document.getElementById("status-filter").value;
  var sort = document.getElementById("sort-filter").value;

  var filtered = charCache.filter(function (c) {
    if (search && !(c.name || "").toLowerCase().includes(search) && !(c.id || "").toLowerCase().includes(search) && !(c.kuralId || "").toLowerCase().includes(search)) return false;
    if (role && c.role !== role) return false;
    if (gender && c.gender !== gender) return false;
    if (age && c.ageGroup !== age) return false;
    if (status && c.status !== status) return false;
    return true;
  });

  if (sort === "name") filtered.sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
  else if (sort === "kural") filtered.sort(function (a, b) { return (a.kuralNumber || 0) - (b.kuralNumber || 0); });
  else filtered.sort(function (a, b) { return (b.modifiedAt || "").localeCompare(a.modifiedAt || ""); });

  var totalPages = Math.max(1, Math.ceil(filtered.length / CHAR_PAGE_SIZE));
  if (charPage > totalPages) charPage = totalPages;
  var pageItems = filtered.slice((charPage - 1) * CHAR_PAGE_SIZE, charPage * CHAR_PAGE_SIZE);
  renderGrid(pageItems);
  renderPager(filtered.length, totalPages);
}

/* ===== DRAWER TABS ===== */
var CHAR_TABS = [
  { id: "general", label: "General" },
  { id: "appearance", label: "Appearance" },
  { id: "clothing", label: "Clothing" },
  { id: "personality", label: "Personality" },
  { id: "voice", label: "Voice" },
  { id: "prompts", label: "AI Prompts" },
  { id: "references", label: "References" },
  { id: "image-lock", label: "Image Lock" },
  { id: "video-lock", label: "Video Lock" },
  { id: "voice-lock", label: "Voice Lock" },
  { id: "usage", label: "Usage" },
  { id: "relationships", label: "Relationships" },
  { id: "history", label: "History" }
];

function renderTabs() {
  return CHAR_TABS.map(function (t) {
    return '<button type="button" class="char-tab' + (t.id === charActiveTab ? " active" : "") + '" data-tab="' + t.id + '">' + t.label + '</button>';
  }).join("");
}

function field(id, label, val, full) {
  return '<div class="char-field' + (full ? " full" : "") + '"><label for="' + id + '">' + label + '</label><input type="text" id="' + id + '" value="' + esc(val) + '"></div>';
}
function selectField(id, label, options, current, full) {
  var opts = options.map(function (o) { return '<option value="' + o + '"' + (o === current ? " selected" : "") + ">" + o + "</option>"; }).join("");
  return '<div class="char-field' + (full ? " full" : "") + '"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts + "</select></div>";
}
function areaField(id, label, val, full, isPrompt) {
  return '<div class="char-field' + (full ? " full" : "") + '"><label for="' + id + '">' + label + '</label><textarea id="' + id + '"' + (isPrompt ? ' class="prompt-area"' : "") + ">" + esc(val) + "</textarea></div>";
}
function lockField(id, label, locked) {
  return '<label class="char-lock-toggle' + (locked ? " locked" : "") + '"><input type="checkbox" id="' + id + '"' + (locked ? " checked" : "") + ">" + label + '</label>';
}

function renderDrawerContent(c) {
  var G = ["General", "Active", "Locked", "Archived"];
  var ageGroups = ["", "Child (0-12)", "Teen (13-19)", "Young (20-35)", "Middle (35-50)", "Mature (50+)"];
  var langs = ["Tamil", "English", "Bilingual"];

  return '<div class="char-drawer-header"><h2 class="char-drawer-title">' + esc(c.name) + '</h2><p class="char-drawer-subtitle">' + esc(c.id) + " &middot; " + esc(c.kuralId || "") + "</p></div>" +
    '<div class="char-tabs" id="char-tabs">' + renderTabs() + '</div>' +

    '<div class="char-tab-panel active" data-panel="general">' +
    '<div class="char-field-grid">' + field("d-name", "Name", c.name) + field("d-nickname", "Nickname", c.nickname) +
    selectField("d-status", "Status", G, c.status || "Active") + field("d-role", "Role", c.role) +
    field("d-id", "Character ID", c.id, true) + areaField("d-desc", "Description", c.description, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="appearance">' +
    '<div class="char-field-grid">' + field("d-age", "Age", c.age) + selectField("d-gender", "Gender", ["", "Male", "Female", "Divine", "Gender-neutral"], c.gender) +
    field("d-height", "Height", c.height) + field("d-weight", "Weight", c.weight) + field("d-body-type", "Body Type", c.bodyType) +
    field("d-skin-tone", "Skin Tone", c.skinTone) + field("d-face-shape", "Face Shape", c.faceShape) +
    field("d-hair-style", "Hair Style", c.hairStyle) + field("d-hair-color", "Hair Color", c.hairColor) +
    field("d-eye-color", "Eye Color", c.eyeColor) + field("d-facial-hair", "Facial Hair", c.facialHair) +
    field("d-special-marks", "Special Marks", c.specialMarks, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="clothing">' +
    '<div class="char-field-grid">' + field("d-costume", "Default Costume", c.defaultCostume) + field("d-footwear", "Footwear", c.footwear) +
    field("d-accessories", "Accessories", c.accessories) + field("d-jewelry", "Jewelry", c.jewelry) +
    field("d-props", "Props", c.props) + field("d-seasonal", "Seasonal Outfit", c.seasonalOutfit) +
    field("d-festival", "Festival Outfit", c.festivalOutfit, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="personality">' +
    '<div class="char-field-grid">' + areaField("d-traits", "Traits", c.traits) + areaField("d-behaviour", "Behaviour", c.behaviour) +
    field("d-emotion-style", "Emotion Style", c.emotionStyle) + areaField("d-strengths", "Strengths", c.strengths) +
    areaField("d-weaknesses", "Weaknesses", c.weaknesses) + field("d-speaking-style", "Speaking Style", c.speakingStyle) +
    field("d-walking-style", "Walking Style", c.walkingStyle, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="voice">' +
    '<div class="char-field-grid">' + selectField("d-language", "Language", langs, c.language || "Tamil") +
    field("d-accent", "Accent", c.accent) + selectField("d-voice-gender", "Voice Gender", ["", "Male", "Female"], c.voiceGender) +
    field("d-voice-style", "Voice Style", c.voiceStyle) + field("d-speed", "Speaking Speed", c.speakingSpeed) +
    field("d-pitch", "Pitch", c.pitch) + selectField("d-voice-emotion", "Emotion", ["Calm", "Warm", "Serious", "Joyful", "Reverent", "Dramatic"], c.voiceEmotion || "Calm") +
    '</div></div>' +

    '<div class="char-tab-panel" data-panel="prompts">' +
    '<button type="button" class="char-ai-gen" id="ai-gen-btn">✨ Auto-Generate All AI Prompts</button>' +
    '<div class="char-field-grid">' + areaField("d-master-prompt", "Master Prompt", c.masterPrompt, true, true) +
    areaField("d-face-prompt", "Face Prompt", c.facePrompt, true, true) + areaField("d-body-prompt", "Body Prompt", c.bodyPrompt, true, true) +
    areaField("d-costume-prompt", "Costume Prompt", c.costumePrompt, true, true) + areaField("d-expr-prompt", "Expression Prompt", c.expressionPrompt, true, true) +
    areaField("d-pose-prompt", "Pose Prompt", c.posePrompt, true, true) + areaField("d-negative-prompt", "Negative Prompt", c.negativePrompt, true, true) +
    areaField("d-style-prompt", "Style Prompt", c.stylePrompt, true, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="references">' +
    '<div class="char-field-grid">' + field("d-front-view", "Front View URL", c.frontView) + field("d-side-view", "Side View URL", c.sideView) +
    field("d-back-view", "Back View URL", c.backView) + field("d-expr-sheet", "Expression Sheet URL", c.expressionSheet) +
    field("d-pose-sheet", "Pose Sheet URL", c.poseSheet) + field("d-costume-sheet", "Costume Sheet URL", c.costumeSheet, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="image-lock">' +
    '<div class="char-lock-grid">' + lockField("d-lock-face", "Lock Face", c.lockFace) + lockField("d-lock-hair", "Lock Hair", c.lockHair) +
    lockField("d-lock-skin", "Lock Skin", c.lockSkin) + lockField("d-lock-costume", "Lock Costume", c.lockCostume) +
    lockField("d-lock-height", "Lock Height", c.lockHeight) + lockField("d-lock-accessories", "Lock Accessories", c.lockAccessories) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="video-lock">' +
    '<div class="char-field-grid">' + field("d-v-walk", "Walking Style", c.videoWalkingStyle) + field("d-v-hand", "Hand Movement", c.handMovement) +
    field("d-v-eye", "Eye Movement", c.eyeMovement) + field("d-v-smile", "Smile", c.smile) +
    field("d-v-idle", "Idle Pose", c.idlePose) + field("d-v-anim", "Animation Style", c.animationStyle, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="voice-lock">' +
    '<div class="char-field-grid">' + field("d-vl-lock", "Voice Lock", c.voiceLock ? "Locked" : "Unlocked") +
    field("d-vl-range", "Emotion Range", c.emotionRange) + field("d-vl-default", "Default Voice", c.defaultVoice) +
    field("d-vl-ref", "Voice Reference", c.voiceReference, true) + '</div></div>' +

    '<div class="char-tab-panel" data-panel="usage">' +
    '<div class="char-usage-grid">' +
    '<div class="char-usage-item"><span class="char-usage-value">' + (c.storiesUsed || []).length + '</span><span class="char-usage-label">Stories</span></div>' +
    '<div class="char-usage-item"><span class="char-usage-value">' + (c.scriptsUsed || []).length + '</span><span class="char-usage-label">Scripts</span></div>' +
    '<div class="char-usage-item"><span class="char-usage-value">' + (c.scenesUsed || []).length + '</span><span class="char-usage-label">Scenes</span></div>' +
    '<div class="char-usage-item"><span class="char-usage-value">' + (c.imagesGenerated || 0) + '</span><span class="char-usage-label">Images</span></div>' +
    '<div class="char-usage-item"><span class="char-usage-value">' + (c.videosGenerated || 0) + '</span><span class="char-usage-label">Videos</span></div>' +
    '</div></div>' +

    '<div class="char-tab-panel" data-panel="relationships">' +
    '<div class="char-rel-list">' +
    '<div class="char-rel-row"><label>Father</label><input type="text" id="d-rel-father" value="' + esc((c.relationships || {}).father) + '"></div>' +
    '<div class="char-rel-row"><label>Mother</label><input type="text" id="d-rel-mother" value="' + esc((c.relationships || {}).mother) + '"></div>' +
    '<div class="char-rel-row"><label>Teacher</label><input type="text" id="d-rel-teacher" value="' + esc((c.relationships || {}).teacher) + '"></div>' +
    '<div class="char-rel-row"><label>Friend</label><input type="text" id="d-rel-friend" value="' + esc((c.relationships || {}).friend) + '"></div>' +
    '<div class="char-rel-row"><label>Villain</label><input type="text" id="d-rel-villain" value="' + esc((c.relationships || {}).villain) + '"></div>' +
    '<div class="char-rel-row"><label>Animal</label><input type="text" id="d-rel-animal" value="' + esc((c.relationships || {}).animal) + '"></div>' +
    '<div class="char-rel-row"><label>Village</label><input type="text" id="d-rel-village" value="' + esc((c.relationships || {}).village) + '"></div>' +
    '<div class="char-rel-row"><label>Family</label><input type="text" id="d-rel-family" value="' + esc((c.relationships || {}).familyMembers) + '"></div>' +
    '</div></div>' +

    '<div class="char-tab-panel" data-panel="history">' +
    ((c.versionHistory || []).length ? (c.versionHistory || []).map(function (v) {
      return '<div class="char-version-row"><span class="char-version-num">v' + (v.version || 1) + '</span><span class="char-version-date">' + (v.date || "") + '</span><button type="button" class="char-version-restore">Restore</button></div>';
    }).join("") : '<p style="color:var(--muted);font-size:0.8rem;">No version history yet.</p>') + '</div>' +

    '<div class="char-drawer-actions">' +
    '<button type="button" class="ui-btn ui-btn-primary" id="d-save">Save</button>' +
    '<button type="button" class="ui-btn" id="d-duplicate">Duplicate</button>' +
    '<button type="button" class="ui-btn" id="d-archive">Archive</button>' +
    '<button type="button" class="ui-btn" id="d-delete">Delete</button>' +
    '<button type="button" class="ui-btn" id="d-export">Export JSON</button>' +
    '<button type="button" class="ui-btn" id="d-copy-prompt">Copy AI Prompt</button>' +
    '</div>';
}

function openDrawer(id) {
  var c = getCharById(id);
  if (!c) return;
  editingCharId = id;
  charActiveTab = "general";
  var body = document.getElementById("drawer-body");
  body.innerHTML = renderDrawerContent(c);
  document.getElementById("char-drawer").classList.add("visible");
  wireDrawerEvents();
}

function wireDrawerEvents() {
  document.querySelectorAll(".char-tab").forEach(function (t) {
    t.addEventListener("click", function () {
      charActiveTab = t.getAttribute("data-tab");
      document.querySelectorAll(".char-tab").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      document.querySelectorAll(".char-tab-panel").forEach(function (p) { p.classList.remove("active"); });
      document.querySelector('[data-panel="' + charActiveTab + '"]').classList.add("active");
    });
  });

  document.getElementById("ai-gen-btn")?.addEventListener("click", function () {
    var c = getCharById(editingCharId);
    if (!c) return;
    c = autoGenCharPrompts(Object.assign({}, c));
    var merged = Object.assign({}, c);
    ["masterPrompt", "facePrompt", "bodyPrompt", "costumePrompt", "expressionPrompt", "posePrompt", "negativePrompt", "stylePrompt"].forEach(function (p) {
      var el = document.getElementById("d-" + p.replace(/([A-Z])/g, "-$1").toLowerCase().replace("master-prompt", "master-prompt").replace("face-prompt", "face-prompt").replace("body-prompt", "body-prompt").replace("costume-prompt", "costume-prompt").replace("expression-prompt", "expr-prompt").replace("pose-prompt", "pose-prompt").replace("negative-prompt", "negative-prompt").replace("style-prompt", "style-prompt"));
      if (el && merged[p]) el.value = merged[p];
    });
    showToast("AI prompts generated");
  });

  document.getElementById("d-save")?.addEventListener("click", saveFromDrawer);
  document.getElementById("d-duplicate")?.addEventListener("click", duplicateChar);
  document.getElementById("d-archive")?.addEventListener("click", archiveChar);
  document.getElementById("d-delete")?.addEventListener("click", deleteChar);
  document.getElementById("d-export")?.addEventListener("click", exportSingleChar);
  document.getElementById("d-copy-prompt")?.addEventListener("click", copyAIPrompt);
}

function readDrawer() {
  var g = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
  var chk = function (id) { var el = document.getElementById(id); return el ? el.checked : false; };
  var c = getCharById(editingCharId) || defaultExtendedFields();
  return Object.assign({}, c, {
    name: g("d-name"), nickname: g("d-nickname"), status: g("d-status"), role: g("d-role"), description: g("d-desc"),
    age: g("d-age"), gender: g("d-gender"), height: g("d-height"), weight: g("d-weight"), bodyType: g("d-body-type"),
    skinTone: g("d-skin-tone"), faceShape: g("d-face-shape"), hairStyle: g("d-hair-style"), hairColor: g("d-hair-color"),
    eyeColor: g("d-eye-color"), facialHair: g("d-facial-hair"), specialMarks: g("d-special-marks"),
    defaultCostume: g("d-costume"), footwear: g("d-footwear"), accessories: g("d-accessories"), jewelry: g("d-jewelry"),
    props: g("d-props"), seasonalOutfit: g("d-seasonal"), festivalOutfit: g("d-festival"),
    traits: g("d-traits"), behaviour: g("d-behaviour"), emotionStyle: g("d-emotion-style"), strengths: g("d-strengths"),
    weaknesses: g("d-weaknesses"), speakingStyle: g("d-speaking-style"), walkingStyle: g("d-walking-style"),
    language: g("d-language"), accent: g("d-accent"), voiceGender: g("d-voice-gender"), voiceStyle: g("d-voice-style"),
    speakingSpeed: g("d-speed"), pitch: g("d-pitch"), voiceEmotion: g("d-voice-emotion"),
    masterPrompt: g("d-master-prompt"), facePrompt: g("d-face-prompt"), bodyPrompt: g("d-body-prompt"),
    costumePrompt: g("d-costume-prompt"), expressionPrompt: g("d-expr-prompt"), posePrompt: g("d-pose-prompt"),
    negativePrompt: g("d-negative-prompt"), stylePrompt: g("d-style-prompt"),
    frontView: g("d-front-view"), sideView: g("d-side-view"), backView: g("d-back-view"),
    expressionSheet: g("d-expr-sheet"), poseSheet: g("d-pose-sheet"), costumeSheet: g("d-costume-sheet"),
    lockFace: chk("d-lock-face"), lockHair: chk("d-lock-hair"), lockSkin: chk("d-lock-skin"),
    lockCostume: chk("d-lock-costume"), lockHeight: chk("d-lock-height"), lockAccessories: chk("d-lock-accessories"),
    videoWalkingStyle: g("d-v-walk"), handMovement: g("d-v-hand"), eyeMovement: g("d-v-eye"),
    smile: g("d-v-smile"), idlePose: g("d-v-idle"), animationStyle: g("d-v-anim"),
    voiceLock: g("d-vl-lock") === "Locked", emotionRange: g("d-vl-range"), defaultVoice: g("d-vl-default"), voiceReference: g("d-vl-ref"),
    relationships: {
      father: g("d-rel-father"), mother: g("d-rel-mother"), teacher: g("d-rel-teacher"),
      friend: g("d-rel-friend"), villain: g("d-rel-villain"), animal: g("d-rel-animal"),
      village: g("d-rel-village"), familyMembers: g("d-rel-family")
    }
  });
}

function saveFromDrawer() {
  var c = readDrawer();
  if (!c.name) { showToast("Name is required"); return; }
  saveChar(c);
  charCache = getMergedCharacters();
  renderStats();
  filterChars();
  showToast("Character saved");
  closeDrawer();
}

function duplicateChar() {
  var c = readDrawer();
  var dup = Object.assign({}, c, { id: "char-dup-" + Date.now(), name: c.name + " (Copy)", createdAt: "", modifiedAt: "", version: 1, versionHistory: [] });
  saveChar(dup);
  charCache = getMergedCharacters();
  renderStats();
  filterChars();
  showToast("Character duplicated");
  closeDrawer();
}

function archiveChar() {
  var c = readDrawer();
  c.status = "Archived";
  saveChar(c);
  charCache = getMergedCharacters();
  renderStats();
  filterChars();
  showToast("Character archived");
  closeDrawer();
}

function deleteChar() {
  if (!confirm("Delete this character?")) return;
  deleteCharFromStore(editingCharId);
  charCache = getMergedCharacters();
  renderStats();
  filterChars();
  showToast("Character deleted");
  closeDrawer();
}

function exportSingleChar() {
  var c = readDrawer();
  downloadJSON(c.id + ".json", c);
  showToast("Exported JSON");
}

function copyAIPrompt() {
  var c = readDrawer();
  var prompt = c.masterPrompt || "";
  if (!prompt) { showToast("No master prompt. Generate first."); return; }
  navigator.clipboard.writeText(prompt);
  showToast("AI prompt copied");
}

function downloadJSON(filename, data) {
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  document.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(url); }, 100);
}

function closeDrawer() {
  document.getElementById("char-drawer").classList.remove("visible");
  editingCharId = null;
  charActiveTab = "general";
}

/* ===== ADD CHARACTER ===== */
function handleAddCharacter() {
  var newId = "char-new-" + Date.now();
  var c = Object.assign({}, defaultExtendedFields(), {
    id: newId, name: "New Character", status: "Active", role: "", kuralNumber: 0, kuralId: ""
  });
  saveChar(c);
  charCache = getMergedCharacters();
  renderStats();
  filterChars();
  openDrawer(newId);
}

/* ===== IMPORT/EXPORT ===== */
function handleImport(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = JSON.parse(e.target.result);
      var store = loadCharStore();
      var count = 0;
      if (Array.isArray(data)) {
        data.forEach(function (c) { if (c.id) { store[c.id] = Object.assign({}, defaultExtendedFields(), c); count++; } });
      } else if (data.id) {
        store[data.id] = Object.assign({}, defaultExtendedFields(), data);
        count = 1;
      }
      saveCharStore(store);
      charCache = getMergedCharacters();
      renderStats();
      populateFilters();
      filterChars();
      showToast(count + " character(s) imported");
    } catch (err) { showToast("Import failed: invalid JSON"); }
  };
  reader.readAsText(file);
}

function handleExportAll() {
  downloadJSON("characters-export.json", charCache);
  showToast("Exported " + charCache.length + " characters");
}

function handleBulkLock() {
  var store = loadCharStore();
  charCache.forEach(function (c) {
    if (store[c.id]) {
      store[c.id].lockFace = true; store[c.id].lockHair = true; store[c.id].lockCostume = true;
    }
  });
  saveCharStore(store);
  charCache = getMergedCharacters();
  renderStats();
  filterChars();
  showToast("All characters locked");
}

/* ===== INIT ===== */
function initCharacterLibrary() {
  charCache = getMergedCharacters();
  renderStats();
  populateFilters();
  filterChars();

  // Deep link from character-detail.html's "Edit in Character Library" button.
  var openId = new URLSearchParams(window.location.search).get("open");
  if (openId && getCharById(openId)) openDrawer(openId);

  var debounceTimer;
  document.getElementById("search-input").addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () { filterChars(true); }, 200);
  });
  ["role-filter", "gender-filter", "age-filter", "status-filter", "sort-filter"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", function () { filterChars(true); });
  });

  document.getElementById("add-character-btn").addEventListener("click", handleAddCharacter);
  document.getElementById("export-all-btn").addEventListener("click", handleExportAll);
  document.getElementById("bulk-lock-btn").addEventListener("click", handleBulkLock);
  document.getElementById("import-btn").addEventListener("click", function () { document.getElementById("import-file").click(); });
  document.getElementById("import-file").addEventListener("change", function (e) { if (e.target.files[0]) handleImport(e.target.files[0]); });

  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof THEME_KEY !== "undefined" || typeof THEME_KEY === "string") {
    // THEME_KEY from dashboard.js
  }
  // Theme & sidebar init from shared infrastructure
  if (typeof applyTheme === "function") applyTheme(localStorage.getItem("thirukkural-theme") || "dark");
  document.getElementById("theme-toggle")?.addEventListener("click", function () {
    var t = (localStorage.getItem("thirukkural-theme") || "dark") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("thirukkural-theme", t);
    location.reload();
  });

  var sb = document.getElementById("sidebar");
  var ov = document.getElementById("sidebar-overlay");
  document.getElementById("sidebar-open")?.addEventListener("click", function () { sb.classList.add("open"); ov?.classList.add("visible"); });
  document.getElementById("sidebar-close")?.addEventListener("click", function () { sb.classList.remove("open"); ov?.classList.remove("visible"); });
  ov?.addEventListener("click", function () { sb.classList.remove("open"); ov.classList.remove("visible"); });

  initCharacterLibrary();
});
