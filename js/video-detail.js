(function () {

var ACTIVE_TAB = 'overview';
var ACTIVE_ASSET_TAB = 'images';

function pad(n) { return String(n).padStart(2, '0'); }

/* ===== URL PARAMS ===== */
function getParams() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || 'TK-0001';
  var n = parseInt(id.replace('TK-', ''), 10);
  if (!n || n < 1) n = 1;
  return { kuralNumber: n, kuralId: kuralId(n) };
}

/* ===== DATA ACCESS ===== */
function getData() {
  if (typeof getProject === 'function') return getProject();
  return null;
}

/* ===== RENDER HEADER ===== */
function renderHeader(p) {
  if (!p) return;
  document.getElementById('vd-breadcrumb').textContent = p.kuralId;
  document.getElementById('vd-action-title').textContent = p.kuralId;
  document.getElementById('vd-kural-id').textContent = p.kuralId;
  document.getElementById('vd-theme-label').textContent = p.kural.chapterEn;
  var badge = document.getElementById('vd-status-badge');
  badge.textContent = p.video.status;
  badge.className = 'ui-badge';
  if (p.video.status === 'published') badge.classList.add('ui-badge-success');
  else if (p.video.status === 'rendering') badge.classList.add('ui-badge-warning');
  else if (p.video.status === 'failed') { badge.textContent = 'Failed'; badge.style.borderColor = '#ef4444'; badge.style.color = '#ef4444'; }
  document.getElementById('vd-title-tamil').textContent = p.kural.tamil;
  document.getElementById('vd-title-en').textContent = p.kural.english;
  document.getElementById('vd-section-label').textContent = p.kural.section;
  document.getElementById('vd-chapter-label').textContent = p.kural.chapterEn;
  document.title = p.kuralId + ' — Video Detail — AI Content Studio';
}

/* ===== RENDER PREVIEW META ===== */
function renderPreviewMeta(p) {
  if (!p) return;
  document.getElementById('vd-preview-subtitle').textContent = p.kuralId + ' · ' + p.video.duration;
  var box = document.getElementById('vd-preview-meta');
  var items = [
    { label: 'Duration', value: p.video.duration },
    { label: 'Resolution', value: p.video.resolution },
    { label: 'FPS', value: String(p.video.fps) },
    { label: 'Codec', value: p.video.codec },
    { label: 'Bitrate', value: p.video.bitrate },
    { label: 'File Size', value: p.video.fileSize },
    { label: 'Provider', value: p.video.provider },
    { label: 'Model', value: p.video.model },
    { label: 'Created', value: p.video.createdAt },
    { label: 'Updated', value: p.video.updatedAt }
  ];
  box.innerHTML = items.map(function (i) {
    return '<div class=\"vd-preview-meta-item\"><label>' + esc(i.label) + '</label><span>' + esc(i.value) + '</span></div>';
  }).join('');
}

/* ===== RENDER KURAL INFO ===== */
function renderKuralInfo(p) {
  if (!p) return;
  var box = document.getElementById('vd-kural-info');
  box.innerHTML = '<div class=\"vd-kural-info-grid\">' +
    '<div class=\"vd-kural-info-item full\"><label>Tamil</label><span class=\"vd-tamil-text\" lang=\"ta\">' + esc(p.kural.tamil) + '</span></div>' +
    '<div class=\"vd-kural-info-item full\"><label>English</label><span>' + esc(p.kural.english) + '</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Kural</label><span>' + esc(p.kural.id) + '</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Chapter</label><span>' + esc(p.kural.chapter) + ' (' + esc(p.kural.chapterEn) + ')</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Chapter No.</label><span>' + p.kural.chapterNo + '</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Section</label><span>' + esc(p.kural.section) + '</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Characters</label><span>' + p.characters.length + '</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Scenes</label><span>' + (p.script.scenes ? p.script.scenes.length : 0) + '</span></div>' +
    '<div class=\"vd-kural-info-item\"><label>Images</label><span>' + p.images.length + '</span></div>' +
  '</div>';
}

/* ===== RENDER PIPELINE ===== */
function renderPipeline(p) {
  if (!p) return;
  var pipe = document.getElementById('vd-pipeline');
  var steps = [
    { key: 'draft', label: 'Draft', icon: '<circle cx=\"12\" cy=\"12\" r=\"10\"/>' },
    { key: 'storyReady', label: 'Story', icon: '<path d=\"M4 19.5A2.5 2.5 0 016.5 17H20\"/><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z\"/>' },
    { key: 'scriptReady', label: 'Script', icon: '<polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/>' },
    { key: 'charactersReady', label: 'Characters', icon: '<path d=\"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>' },
    { key: 'imagesReady', label: 'Images', icon: '<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"/><path d=\"M21 15l-5-5L5 21\"/>' },
    { key: 'voiceReady', label: 'Voice', icon: '<path d=\"M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z\"/><path d=\"M19 10v2a7 7 0 01-14 0v-2\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"/>' },
    { key: 'animationReady', label: 'Animation', icon: '<polygon points=\"23 7 16 12 23 17 23 7\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\"/>' },
    { key: 'rendering', label: 'Render', icon: '<path d=\"M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8\"/><polyline points=\"16 6 12 2 8 6\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"/>' },
    { key: 'completed', label: 'Complete', icon: '<polyline points=\"20 6 9 17 4 12\"/>' }
  ];

  pipe.innerHTML = steps.map(function (s) {
    var val = p.pipeline[s.key];
    var cls = val ? 'done' : 'pending';
    var ts = val && p.pipelineTimestamps[s.key] ? '<div class=\"vd-pipeline-step-time\">' + (p.pipelineTimestamps[s.key] ? p.pipelineTimestamps[s.key].split('T')[0] : '') + '</div>' : '';
    return '<div class=\"vd-pipeline-step ' + cls + '\"><div class=\"vd-pipeline-step-icon ' + cls + '\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">' + s.icon + '</svg></div><div class=\"vd-pipeline-step-label\">' + s.label + '</div>' + ts + '</div>';
  }).join('');
}

/* ===== RENDER STORY ===== */
function renderStory(p) {
  if (!p) return;
  var textEl = document.getElementById('vd-story-text');
  var tamilEl = document.getElementById('vd-story-tamil');
  var enEl = document.getElementById('vd-story-en');
  if (p.story.exists) {
    textEl.textContent = (p.story.hook || '') + (p.story.moral ? ' — ' + p.story.moral : '');
    tamilEl.textContent = p.kural.tamil;
    enEl.textContent = '\u201C' + p.kural.english + '\u201D';
  } else {
    textEl.textContent = 'No story generated for ' + p.kuralId + ' yet.';
    tamilEl.textContent = '';
    enEl.textContent = '';
  }
}

/* ===== RENDER SCRIPT ===== */
function renderScript(p) {
  if (!p) return;
  var body = document.getElementById('vd-script-body');
  var textEl = document.getElementById('vd-script-text');
  if (p.script && p.script.scenes && p.script.scenes.length) {
    var sceneCount = p.script.scenes.length;
    var totalDur = p.script.scenes.reduce(function (sum, s) { return sum + (s.duration || 0); }, 0);
    var durStr = Math.floor(totalDur / 60) + ':' + pad(totalDur % 60) + ' min';
    textEl.textContent = sceneCount + ' scenes · ' + durStr + ' · Status: ' + p.script.status;
    body.innerHTML = '<p class=\"sd-story-text\" id=\"vd-script-text\">' + esc(textEl.textContent) + '</p><div class=\"sd-kural-box\" id=\"vd-script-scenes\">' +
      p.script.scenes.map(function (s) {
        return '<div style=\"padding:0.4rem 0;border-bottom:1px solid var(--border);font-size:0.82rem;color:var(--text-secondary);\">' +
          '<strong>Scene ' + s.sceneNumber + ':</strong> ' + esc(s.title || '') +
          ' <span style=\"color:var(--muted);\">(' + (s.duration || '—') + 's)</span></div>';
      }).join('') +
      '</div><button type=\"button\" class=\"ui-btn ui-btn-primary\" id=\"vd-link-script\" style=\"margin-top:0.75rem;\">Open Script Page</button>';
  } else {
    textEl.textContent = 'No script generated yet.';
    body.innerHTML = '<p class=\"sd-story-text\" id=\"vd-script-text\">No script generated yet.</p><button type=\"button\" class=\"ui-btn ui-btn-primary\" id=\"vd-link-script\">Open Script Page</button>';
  }
}

/* ===== RENDER CHARACTERS ===== */
function renderCharacters(p) {
  if (!p) return;
  var grid = document.getElementById('vd-char-grid');
  if (!grid) return;
  if (!p.characters || !p.characters.length) {
    grid.innerHTML = '<p class="sd-story-text" style="text-align:center;color:var(--muted);">No characters derived for this kural.</p>';
    return;
  }
  grid.innerHTML = p.characters.map(function (c) {
    var initials = (c.name || '?').charAt(0).toUpperCase();
    var tags = [];
    if (c.role) tags.push('<span class="ui-badge ui-badge-muted" style="font-size:0.7rem;">' + esc(c.role) + '</span>');
    if (c.gender) tags.push('<span class="ui-badge ui-badge-muted" style="font-size:0.7rem;">' + esc(c.gender) + '</span>');
    if (c.ageGroup) tags.push('<span class="ui-badge ui-badge-muted" style="font-size:0.7rem;">' + esc(c.ageGroup) + '</span>');
    var idxMatch = /-c(\d+)$/.exec(c.id || '');
    var profileHref = 'character-detail.html?kural=' + p.kuralNumber + '&c=' + (idxMatch ? idxMatch[1] : '0');
    if (c.id && c.id.indexOf('-tv') !== -1) profileHref = 'characters.html?open=' + encodeURIComponent(c.id);
    return '<div class="vd-char-card"><div class="vd-char-avatar">' + initials + '</div>' +
      '<div class="vd-char-info"><div class="vd-char-name">' + esc(c.name) + '</div>' +
      '<div class="vd-char-tags">' + tags.join('') + '</div></div>' +
      '<a class="ui-btn" style="font-size:0.7rem;padding:0.25rem 0.5rem;" href="' + profileHref + '">Profile</a></div>';
  }).join('');
}

/* ===== RENDER IMAGES ===== */
function renderImages(p) {
  if (!p) return;
  var box = document.getElementById('vd-assets-body');
  if (!box) return;
  if (!p.images || !p.images.length) {
    box.innerHTML = '<div class="vd-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg><h3>No images yet</h3><p>Images will be generated from the script scenes.</p></div>';
    return;
  }
  box.innerHTML = '<div class="vd-img-grid">' + p.images.map(function (img) {
    var statusClass = img.status === 'completed' ? 'ui-badge-success' : (img.status === 'generating' ? 'ui-badge-warning' : 'ui-badge-muted');
    return '<div class="vd-img-card"><div class="vd-img-preview">' +
      (img.url ? '<img src="' + esc(img.url) + '" alt="' + esc(img.id) + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">' :
        '<div class="vd-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>') +
      '</div><div class="vd-img-meta"><div class="vd-img-id">' + esc(img.id) + '</div>' +
      '<div class="vd-img-scene">Scene ' + img.sceneNumber + ': ' + esc(img.sceneTitle) + '</div>' +
      (img.characterName ? '<div class="vd-img-char">' + esc(img.characterName) + '</div>' : '') +
      '<div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin-top:0.35rem;"><span class="ui-badge ' + statusClass + '" style="font-size:0.65rem;">' + esc(img.status) + '</span>' +
      '<span class="ui-badge ui-badge-muted" style="font-size:0.65rem;">' + esc(img.resolution) + '</span></div></div></div>';
  }).join('') + '</div>';
}

/* ===== RENDER TIMELINE ===== */
function renderTimeline(p) {
  if (!p) return;
  var box = document.getElementById('vd-timeline');
  if (!p.activity || !p.activity.length) {
    box.innerHTML = '<p class=\"sd-story-text\" style=\"text-align:center;color:var(--muted);\">No activity recorded yet.</p>';
    return;
  }
  var colors = { Created: '#a0a0b8', 'Story Generated': '#3b82f6', 'Script Written': '#a855f7', 'Characters Derived': '#22c55e', 'Images Queued': '#f59e0b', Rendered: '#f97316', Published: '#22c55e' };
  box.innerHTML = p.activity.map(function (a) {
    var d = new Date(a.time);
    var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return '<div class=\"vd-timeline-item\"><div class=\"vd-timeline-dot\" style=\"background:' + (colors[a.action] || 'var(--gold)') + '\"></div><div class=\"vd-timeline-body\"><div class=\"vd-timeline-action\">' + esc(a.action) + '</div><div class=\"vd-timeline-detail\">' + esc(a.detail) + '</div></div><div class=\"vd-timeline-time\">' + dateStr + '</div></div>';
  }).join('');
}

/* ===== RENDER SCENES ===== */
function renderScenes(p) {
  if (!p) return;
  var box = document.getElementById('vd-scenes-body');
  if (!p.script.scenes || !p.script.scenes.length) {
    box.innerHTML = '<div class=\"vd-empty-state\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M8 21h8M12 17v4\"/></svg><h3>No scenes yet</h3><p>Scenes will appear once generated from the script.</p></div>';
    return;
  }
  box.innerHTML = p.script.scenes.map(function (s) {
    return '<div class=\"ui-card\" style=\"margin-bottom:0.75rem;\"><div class=\"ui-card-body\"><div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;\">' +
      '<div><strong style=\"color:var(--gold);\">Scene ' + s.sceneNumber + ':</strong> <span style=\"color:var(--text);\">' + esc(s.title || '') + '</span></div>' +
      '<div style=\"display:flex;gap:0.5rem;align-items:center;\"><span class=\"ui-badge ui-badge-muted\">' + (s.duration || '—') + 's</span>' +
      '<button type=\"button\" class=\"ui-btn\" style=\"font-size:0.7rem;padding:0.25rem 0.5rem;\">Preview</button></div></div>' +
      (s.narration ? '<p style=\"font-size:0.82rem;color:var(--text-secondary);margin-top:0.5rem;\">' + esc(s.narration) + '</p>' : '') +
      (s.characters && s.characters.length ? '<div style=\"display:flex;gap:0.35rem;flex-wrap:wrap;margin-top:0.35rem;\">' + s.characters.map(function (ch) { return '<span class=\"ui-badge ui-badge-muted\" style=\"font-size:0.7rem;\">' + esc(ch) + '</span>'; }).join('') + '</div>' : '') +
    '</div></div>';
  }).join('');
}

/* ===== RENDER VERSIONS ===== */
function renderVersions(p) {
  if (!p) return;
  var box = document.getElementById('vd-versions-body');
  if (!p.versions || !p.versions.length) {
    box.innerHTML = '<div class=\"vd-empty-state\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/></svg><h3>No version history yet</h3></div>';
    return;
  }
  box.innerHTML = p.versions.map(function (v) {
    return '<div style=\"display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0.75rem;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:0.5rem;background:var(--surface);gap:0.5rem;flex-wrap:wrap;\">' +
      '<div><strong style=\"color:var(--text);\">v' + esc(v.version) + '</strong> <span style=\"color:var(--muted);font-size:0.78rem;\">' + esc(v.provider) + ' · ' + esc(v.model) + '</span></div>' +
      '<div style=\"display:flex;gap:0.75rem;align-items:center;font-size:0.78rem;color:var(--text-secondary);\">' +
      '<span>' + esc(v.duration) + '</span><span>' + esc(v.resolution) + '</span><span>' + esc(v.cost) + '</span>' +
      '<span class=\"ui-badge ui-badge-success\">' + esc(v.status) + '</span></div></div>';
  }).join('');
}

/* ===== RENDER PUBLISHING ===== */
function renderPublishing(p) {
  if (!p) return;
  var box = document.getElementById('vd-publishing-body');
  var platforms = p.publishing && p.publishing.platforms ? p.publishing.platforms : [];
  if (!platforms.length) {
    box.innerHTML = '<div class=\"vd-empty-state\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8\"/><polyline points=\"16 6 12 2 8 6\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"/></svg><h3>Not yet published</h3></div>';
    return;
  }
  box.innerHTML = '<div style=\"margin-bottom:0.75rem;\"><strong style=\"font-size:0.9rem;color:var(--text);\">' + esc(p.publishing.title || '') + '</strong></div>' +
    '<div class=\"vd-grid-2col\" style=\"margin:0 0 0.75rem 0;\">' +
    platforms.map(function (pl) { return '<div style=\"padding:0.6rem 0.75rem;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);display:flex;justify-content:space-between;align-items:center;\"><span>' + esc(pl.name) + '</span><span class=\"ui-badge ' + (pl.status === 'published' ? 'ui-badge-success' : 'ui-badge-muted') + '\">' + esc(pl.status) + '</span></div>'; }).join('') +
    '</div>' +
    '<div style=\"display:flex;flex-wrap:wrap;gap:0.35rem;\">' + (p.publishing.tags || []).map(function (t) { return '<span class=\"ui-badge ui-badge-muted\" style=\"font-size:0.7rem;\">#' + esc(t) + '</span>'; }).join('') + '</div>';
}

/* ===== RENDER DEVELOPER ===== */
function renderDeveloper(p) {
  if (!p) return;
  var box = document.getElementById('vd-dev-output');
  if (box) box.textContent = JSON.stringify(p, null, 2);
}

/* ===== RENDER ALL ===== */
function renderAll() {
  var p = getData();
  if (!p) {
    document.getElementById('vd-root').innerHTML = '<div class=\"ui-card\"><div class=\"ui-card-body\"><p style=\"text-align:center;color:var(--muted);\">Project data not available. Ensure all scripts are loaded.</p></div></div>';
    return;
  }
  renderHeader(p);
  renderPreviewMeta(p);
  renderKuralInfo(p);
  renderPipeline(p);
  renderStory(p);
  renderScript(p);
  renderCharacters(p);
  renderTimeline(p);
  renderScenes(p);
  renderVersions(p);
  renderPublishing(p);
  renderDeveloper(p);
}

/* ===== FORMAT NUMBER ===== */
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

/* ===== WIRE TAB SWITCHING ===== */
function wireTabs() {
  document.querySelectorAll('.vd-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var tabName = this.getAttribute('data-tab');
      if (!tabName || tabName === ACTIVE_TAB) return;
      ACTIVE_TAB = tabName;
      document.querySelectorAll('.vd-tab').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.vd-tab-panel').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      var panel = document.querySelector('.vd-tab-panel[data-tab=\"' + tabName + '\"]');
      if (panel) panel.classList.add('active');

      /* Lazy render some tabs */
      var p = getData();
      if (tabName === 'scenes') renderScenes(p);
      if (tabName === 'versions') renderVersions(p);
      if (tabName === 'publishing') renderPublishing(p);
      if (tabName === 'assets') renderImages(p);
    });
  });
}

/* ===== WIRE ACTIONS ===== */
function wireActions(p) {
  if (!p) return;
  var actions = [
    { id: 'vd-action-generate', msg: 'Generate video for ' + p.kuralId + '... (placeholder)' },
    { id: 'vd-action-render', msg: 'Render ' + p.kuralId + '... (placeholder)' },
    { id: 'vd-action-publish', msg: 'Publish ' + p.kuralId + '... (placeholder)' },
    { id: 'vd-action-download', msg: 'Download ' + p.kuralId + '... (placeholder)' },
    { id: 'vd-action-share', msg: 'Share ' + p.kuralId + '... (placeholder)' },
    { id: 'vd-action-delete', msg: 'Delete ' + p.kuralId + '? (placeholder)' }
  ];
  actions.forEach(function (a) {
    var el = document.getElementById(a.id);
    if (!el) return;
    el.addEventListener('click', function () {
      if (a.id === 'vd-action-delete' && !confirm('Delete video ' + p.kuralId + '? This cannot be undone.')) return;
      showToast(a.msg);
    });
  });

  var storyBtn = document.getElementById('vd-link-story');
  if (storyBtn) storyBtn.addEventListener('click', function () { window.location.href = 'stories.html?kural=' + p.kuralNumber; });

  var scriptBtn = document.getElementById('vd-link-script');
  if (scriptBtn) scriptBtn.addEventListener('click', function () { window.location.href = 'script-detail.html?kural=' + p.kuralNumber; });

  var openStory = document.getElementById('vd-open-story');
  if (openStory) openStory.addEventListener('click', function () { window.location.href = 'stories.html?kural=' + p.kuralNumber; });

  var openScript = document.getElementById('vd-open-script');
  if (openScript) openScript.addEventListener('click', function () { window.location.href = 'script-detail.html?kural=' + p.kuralNumber; });

  var openChars = document.getElementById('vd-open-characters');
  if (openChars) openChars.addEventListener('click', function () { window.location.href = 'character-detail.html?kural=' + p.kuralNumber; });

  var openCharLib = document.getElementById('vd-open-char-lib');
  if (openCharLib) openCharLib.addEventListener('click', function () { window.location.href = 'characters.html'; });

  /* ===== Asset sub-tab switching ===== */
  document.querySelectorAll('.vd-asset-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.vd-asset-tab').forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      var atab = this.getAttribute('data-atab');
      var body = document.getElementById('vd-assets-body');
      if (atab === 'images') { renderImages(p); return; }
      body.innerHTML = '<div class="vd-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><h3>' + this.textContent.trim() + '</h3><p>No ' + this.textContent.trim().toLowerCase() + ' assets generated yet.</p></div>';
    });
  });
}

/* ===== INIT ===== */
function initVideoDetail() {
  initSidebar();
  initTheme();

  var params = getParams();
  var project = buildProjectData(params.kuralNumber);

  if (project) {
    renderAll();
    wireTabs();
    wireActions(project);
  } else {
    document.getElementById('vd-root').innerHTML = '<div class=\"ui-card\"><div class=\"ui-card-body\"><p style=\"text-align:center;color:var(--muted);\">Error: Project data could not be built. Ensure media-data.js and project-data.js are loaded.</p></div></div>';
  }
}

document.addEventListener('DOMContentLoaded', initVideoDetail);

})();
