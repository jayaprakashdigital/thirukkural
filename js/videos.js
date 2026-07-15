(function () {

var ALL_VIDEOS = [];
var SELECTED = {};
var VIEW_MODE = 'grid';
var CURRENT_VIDEO = null;

function pad(n) { return String(n).padStart(2, '0'); }

function formatDuration(seconds) {
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return pad(m) + ':' + pad(s);
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function getStatus(n) {
  if (n <= 42) return 'published';
  if (n <= 50) return 'rendering';
  if (n <= 60) return 'scheduled';
  if (n === 7 || n === 13 || n === 25) return 'failed';
  return 'draft';
}

function esc(s) {
  var d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

function buildVideos() {
  return KURAL_MEDIA.map(function (k) {
    var status = getStatus(k.n);
    var durSec = 45 + (k.n * 7 % 120);
    var d = new Date(2026, 5, Math.min(k.n, 30));
    return {
      n: k.n, id: k.id, ta: k.ta, en: k.en, ch: k.ch, chEn: k.chEn, chNo: k.chNo, sec: k.sec,
      status: status,
      duration: formatDuration(durSec),
      durationSec: durSec,
      views: 100 + (k.n * 47 % 5000),
      likes: 5 + (k.n * 13 % 200),
      shares: k.n * 7 % 50,
      comments: k.n * 3 % 30,
      resolution: '1920x1080',
      fps: 30,
      aspectRatio: '16:9',
      voice: 'Tamil — ' + (k.n % 2 === 0 ? 'Female' : 'Male'),
      music: 'Cinematic Background',
      fileSize: (4.5 + (k.n % 15) * 0.3).toFixed(1) + ' MB',
      createdDate: d.toISOString().split('T')[0],
      updatedDate: new Date(d.getTime() + (k.n * 3600000)).toISOString().split('T')[0],
      renderProgress: status === 'rendering' ? Math.min(95, 30 + (k.n % 60)) : 100,
      watchTime: Math.floor(40 + (k.n * 13 % 20)) * 60,
      ctr: (2.5 + (k.n % 40) * 0.1).toFixed(1) + '%',
      platform: ['YouTube', 'Instagram', 'TikTok'][k.n % 3],
      description: 'Thirukkural ' + k.id + ' — ' + k.chEn + '. ' + k.en,
      renderTime: status === 'published' ? (12 + (k.n % 20)) + ' min' : '—',
      tags: ['thirukkural', k.id, k.chEn.replace(/\\s+/g, ''), 'tamil', 'valluvar'],
      _search: (k.id + ' ' + k.n + ' ' + k.ta + ' ' + k.en + ' ' + k.chEn).toLowerCase()
    };
  });
}

function computeStats() {
  var total = ALL_VIDEOS.length;
  var published = 0, rendering = 0, scheduled = 0, draft = 0, failed = 0;
  var totalViews = 0, totalLikes = 0, totalWatchTime = 0;
  ALL_VIDEOS.forEach(function (v) {
    if (v.status === 'published') published++;
    else if (v.status === 'rendering') rendering++;
    else if (v.status === 'scheduled') scheduled++;
    else if (v.status === 'failed') failed++;
    else draft++;
    totalViews += v.views;
    totalLikes += v.likes;
    totalWatchTime += v.watchTime;
  });
  return { total: total, published: published, rendering: rendering, scheduled: scheduled, draft: draft, failed: failed, totalViews: totalViews, totalLikes: totalLikes, totalWatchTime: totalWatchTime };
}

function renderStats() {
  var s = computeStats();
  var el = document.getElementById('videos-stats');
  if (!el) return;
  var cards = [
    { label: 'Total Videos', value: s.total, sub: s.total + ' kurals', color: 'var(--text-primary)' },
    { label: 'Published', value: s.published, sub: Math.round(s.published / s.total * 100) + '% of total', color: '#22c55e' },
    { label: 'Rendering', value: s.rendering, sub: 'In progress', color: '#3b82f6' },
    { label: 'Scheduled', value: s.scheduled, sub: 'Queued for publish', color: '#a855f7' },
    { label: 'Draft', value: s.draft, sub: 'Awaiting render', color: '#a0a0b8' },
    { label: 'Failed', value: s.failed, sub: 'Needs retry', color: '#ef4444' },
    { label: 'Total Views', value: formatNumber(s.totalViews), sub: 'Across all videos', color: 'var(--text-primary)' },
    { label: 'Total Likes', value: formatNumber(s.totalLikes), sub: formatNumber(Math.round(s.totalLikes / Math.max(s.published, 1))) + ' avg/video', color: 'var(--text-primary)' },
    { label: 'Watch Time', value: Math.round(s.totalWatchTime / 3600) + 'h', sub: 'Total minutes: ' + formatNumber(s.totalWatchTime), color: 'var(--text-primary)' }
  ];
  el.innerHTML = cards.map(function (c) {
    return '<div class=\"videos-stat-card\">' +
      '<div class=\"videos-stat-label\">' + esc(c.label) + '</div>' +
      '<div class=\"videos-stat-value\" style=\"color:' + c.color + '\">' + esc(c.value) + '</div>' +
      '<div class=\"videos-stat-sub\">' + esc(c.sub) + '</div>' +
    '</div>';
  }).join('');
}

function renderGridCard(v) {
  var checked = SELECTED[v.n] ? 'checked' : '';
  var progressHtml = v.status === 'rendering'
    ? '<div class=\"video-card-progress\"><div class=\"video-card-progress-bar\" style=\"width:' + v.renderProgress + '%\"></div></div>'
    : '';
  return '<div class=\"video-card\" data-n=\"' + v.n + '\" role=\"button\" tabindex=\"0\" aria-label=\"Video ' + v.id + '\">' +
    '<input type=\"checkbox\" class=\"video-card-checkbox\" data-select=\"' + v.n + '\" ' + checked + ' aria-label=\"Select ' + v.id + '\">' +
    '<div class=\"video-card-thumb\">' +
      '<div class=\"video-card-thumb-placeholder\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polygon points=\"23 7 16 12 23 17 23 7\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\"/></svg></div>' +
      '<div class=\"video-card-play-overlay\"><div class=\"video-card-play-btn\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg></div></div>' +
      '<span class=\"video-card-duration\">' + v.duration + '</span>' +
      '<span class=\"video-card-res-badge\">' + v.resolution + '</span>' +
      '<span class=\"video-card-status ' + v.status + '\">' + esc(v.status) + '</span>' +
      progressHtml +
    '</div>' +
    '<div class=\"video-card-body\">' +
      '<div class=\"video-card-id\">' + v.id + '</div>' +
      '<div class=\"video-card-title\" lang=\"ta\">' + esc(v.ta) + '</div>' +
      '<div class=\"video-card-meta\">Kural ' + v.n + ' · ' + esc(v.chEn) + '</div>' +
      '<div class=\"video-card-stats\">' +
        '<span class=\"video-card-stat\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>' + formatNumber(v.views) + '</span>' +
        '<span class=\"video-card-stat\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M20.84 4.61a5.5 5.5 0 01-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 01-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 010-7.78z\"/></svg>' + formatNumber(v.likes) + '</span>' +
        '<span class=\"video-card-stat\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8\"/><polyline points=\"16 6 12 2 8 6\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"/></svg>' + formatNumber(v.shares) + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderListCard(v) {
  var checked = SELECTED[v.n] ? 'checked' : '';
  return '<div class=\"video-card list\" data-n=\"' + v.n + '\" role=\"button\" tabindex=\"0\" aria-label=\"Video ' + v.id + '\">' +
    '<input type=\"checkbox\" class=\"video-card-checkbox\" data-select=\"' + v.n + '\" ' + checked + ' aria-label=\"Select ' + v.id + '\">' +
    '<div class=\"video-card-thumb\">' +
      '<div class=\"video-card-thumb-placeholder\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polygon points=\"23 7 16 12 23 17 23 7\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\"/></svg></div>' +
      '<span class=\"video-card-duration\">' + v.duration + '</span>' +
      '<span class=\"video-card-status ' + v.status + '\">' + esc(v.status) + '</span>' +
    '</div>' +
    '<div class=\"video-card-body\">' +
      '<div class=\"video-card-id\">' + v.id + ' · Kural ' + v.n + '</div>' +
      '<div class=\"video-card-title\" lang=\"ta\">' + esc(v.ta) + '</div>' +
      '<div class=\"video-card-meta\">' + esc(v.chEn) + ' · ' + v.resolution + '</div>' +
      '<div class=\"video-card-stats\">' +
        '<span class=\"video-card-stat\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>' + formatNumber(v.views) + '</span>' +
        '<span class=\"video-card-stat\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M20.84 4.61a5.5 5.5 0 01-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 01-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 010-7.78z\"/></svg>' + formatNumber(v.likes) + '</span>' +
        '<span class=\"video-card-stat\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8\"/><polyline points=\"16 6 12 2 8 6\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"/></svg>' + formatNumber(v.shares) + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderCards(items) {
  var grid = document.getElementById('videos-grid');
  var empty = document.getElementById('videos-empty');
  if (!grid) return;
  if (!items || items.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';
  var fn = VIEW_MODE === 'list' ? renderListCard : renderGridCard;
  grid.innerHTML = items.map(fn).join('');
  grid.className = 'videos-grid' + (VIEW_MODE === 'list' ? ' list-view' : '');
}

function filterAndSort() {
  var searchText = (document.getElementById('search-input') ? document.getElementById('search-input').value : '').toLowerCase().trim();
  var statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : '';
  var sortBy = document.getElementById('sort-filter') ? document.getElementById('sort-filter').value : 'kural-asc';

  var filtered = ALL_VIDEOS.filter(function (v) {
    var ms = !searchText || v._search.indexOf(searchText) !== -1;
    var mf = !statusFilter || v.status === statusFilter;
    return ms && mf;
  });

  filtered.sort(function (a, b) {
    if (sortBy === 'kural-desc') return b.n - a.n;
    if (sortBy === 'updated') return b.n - a.n;
    if (sortBy === 'duration') return b.durationSec - a.durationSec;
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'likes') return b.likes - a.likes;
    return a.n - a.n;
  });

  renderCards(filtered);
  updateBulkUI();
}

function updateBulkUI() {
  var el = document.getElementById('bulk-actions');
  var countEl = document.getElementById('selected-count');
  var count = Object.keys(SELECTED).length;
  if (!el || !countEl) return;
  if (count > 0) {
    el.style.display = 'flex';
    countEl.textContent = count + ' selected';
  } else {
    el.style.display = 'none';
  }
  document.querySelectorAll('.video-card').forEach(function (card) {
    var n = parseInt(card.dataset.n, 10);
    card.classList.toggle('selected', !!SELECTED[n]);
    var cb = card.querySelector('.video-card-checkbox');
    if (cb) cb.checked = !!SELECTED[n];
  });
}

function openModal(v) {
  CURRENT_VIDEO = v;
  var modal = document.getElementById('video-modal');
  var meta = document.getElementById('modal-meta');
  var actions = document.getElementById('modal-actions');
  if (!modal || !meta || !actions) return;

  var metaHtml =
    '<div class=\"videos-modal-meta-item videos-modal-meta-full\"><div class=\"videos-modal-meta-label\">Title</div><div class=\"videos-modal-meta-value\" lang=\"ta\">' + esc(v.ta) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Kural</div><div class=\"videos-modal-meta-value\">' + v.id + ' (Kural ' + v.n + ')</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Status</div><div class=\"videos-modal-meta-value\" style=\"color:' + (v.status === 'published' ? '#22c55e' : v.status === 'rendering' ? '#3b82f6' : v.status === 'scheduled' ? '#a855f7' : v.status === 'failed' ? '#ef4444' : '#a0a0b8') + '\">' + v.status.charAt(0).toUpperCase() + v.status.slice(1) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Theme</div><div class=\"videos-modal-meta-value\">' + esc(v.chEn) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Description</div><div class=\"videos-modal-meta-value\">' + esc(v.description) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Duration</div><div class=\"videos-modal-meta-value\">' + v.duration + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Resolution</div><div class=\"videos-modal-meta-value\">' + v.resolution + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">FPS</div><div class=\"videos-modal-meta-value\">' + v.fps + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Aspect Ratio</div><div class=\"videos-modal-meta-value\">' + v.aspectRatio + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Voice</div><div class=\"videos-modal-meta-value\">' + esc(v.voice) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Music</div><div class=\"videos-modal-meta-value\">' + esc(v.music) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Created</div><div class=\"videos-modal-meta-value\">' + v.createdDate + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Updated</div><div class=\"videos-modal-meta-value\">' + v.updatedDate + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Views</div><div class=\"videos-modal-meta-value\">' + formatNumber(v.views) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Likes</div><div class=\"videos-modal-meta-value\">' + formatNumber(v.likes) + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Shares</div><div class=\"videos-modal-meta-value\">' + v.shares + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">Comments</div><div class=\"videos-modal-meta-value\">' + v.comments + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">File Size</div><div class=\"videos-modal-meta-value\">' + v.fileSize + '</div></div>' +
    '<div class=\"videos-modal-meta-item\"><div class=\"videos-modal-meta-label\">CTR</div><div class=\"videos-modal-meta-value\">' + v.ctr + '</div></div>';

  meta.innerHTML = metaHtml;

  var publishDisabled = v.status === 'rendering' ? 'disabled' : '';
  var actionsHtml =
    '<button type=\"button\" class=\"ui-btn ui-btn-primary\" id=\"modal-download\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><polyline points=\"12 15 12 3\"/></svg> Download</button>' +
    '<button type=\"button\" class=\"ui-btn\" id=\"modal-publish\" ' + publishDisabled + '><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8\"/><polyline points=\"16 6 12 2 8 6\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"15\"/></svg> Publish to YouTube</button>' +
    '<button type=\"button\" class=\"ui-btn\" id=\"modal-schedule\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/></svg> Schedule</button>' +
    '<button type=\"button\" class=\"ui-btn\" id=\"modal-copy-meta\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1\"/></svg> Copy Metadata</button>' +
    '<button type=\"button\" class=\"ui-btn\" id=\"modal-copy-desc\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1\"/></svg> Copy Description</button>' +
    '<button type=\"button\" class=\"ui-btn\" id=\"modal-copy-tags\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1\"/></svg> Copy Tags</button>' +
    '<button type=\"button\" class=\"ui-btn ui-btn-danger\" id=\"modal-delete\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2\"/></svg> Delete</button>';

  actions.innerHTML = actionsHtml;

  document.getElementById('modal-download').addEventListener('click', function () { showToast('Downloading ' + v.id + '... (placeholder)'); });
  document.getElementById('modal-publish').addEventListener('click', function () { showToast('Publishing ' + v.id + ' to YouTube... (placeholder)'); });
  document.getElementById('modal-schedule').addEventListener('click', function () { showToast('Scheduling ' + v.id + '... (placeholder)'); });
  document.getElementById('modal-copy-meta').addEventListener('click', function () { copyText(JSON.stringify({ id: v.id, title: v.ta, theme: v.chEn, duration: v.duration, resolution: v.resolution }), 'Metadata'); });
  document.getElementById('modal-copy-desc').addEventListener('click', function () { copyText(v.description, 'Description'); });
  document.getElementById('modal-copy-tags').addEventListener('click', function () { copyText(v.tags.join(', '), 'Tags'); });
  document.getElementById('modal-delete').addEventListener('click', function () { if (confirm('Delete video ' + v.id + '?')) { showToast(v.id + ' deleted (placeholder)'); closeModal(); } });

  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var modal = document.getElementById('video-modal');
  if (modal) modal.classList.remove('visible');
  document.body.style.overflow = '';
  CURRENT_VIDEO = null;
}

function toggleSelect(n) {
  if (SELECTED[n]) delete SELECTED[n];
  else SELECTED[n] = true;
  updateBulkUI();
}

function selectAll() {
  var searchText = (document.getElementById('search-input') ? document.getElementById('search-input').value : '').toLowerCase().trim();
  var statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : '';
  var filtered = ALL_VIDEOS.filter(function (v) {
    var ms = !searchText || v._search.indexOf(searchText) !== -1;
    var mf = !statusFilter || v.status === statusFilter;
    return ms && mf;
  });
  filtered.forEach(function (v) { SELECTED[v.n] = true; });
  updateBulkUI();
}

function clearSelection() {
  SELECTED = {};
  updateBulkUI();
}

function initVideos() {
  if (typeof KURAL_MEDIA === 'undefined') {
    var grid = document.getElementById('videos-grid');
    if (grid) grid.innerHTML = '<div class=\"videos-empty\"><h3>Media data failed to load</h3><p>js/media-data.js is missing — refresh the page.</p></div>';
    return;
  }

  ALL_VIDEOS = buildVideos();
  renderStats();
  filterAndSort();

  // Search
  var searchInput = document.getElementById('search-input');
  if (searchInput) {
    var debouncedSearch = (function () {
      var timer;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(filterAndSort, 200);
      };
    })();
    searchInput.addEventListener('input', debouncedSearch);
  }

  document.getElementById('status-filter').addEventListener('change', filterAndSort);
  document.getElementById('sort-filter').addEventListener('change', filterAndSort);

  // View toggle
  document.getElementById('view-grid').addEventListener('click', function () {
    VIEW_MODE = 'grid';
    document.getElementById('view-grid').classList.add('active');
    document.getElementById('view-list').classList.remove('active');
    filterAndSort();
  });
  document.getElementById('view-list').addEventListener('click', function () {
    VIEW_MODE = 'list';
    document.getElementById('view-list').classList.add('active');
    document.getElementById('view-grid').classList.remove('active');
    filterAndSort();
  });

  // Bulk actions
  document.getElementById('select-all').addEventListener('click', selectAll);
  document.getElementById('clear-selection').addEventListener('click', clearSelection);
  document.getElementById('bulk-publish').addEventListener('click', function () {
    var count = Object.keys(SELECTED).length;
    showToast('Publishing ' + count + ' video(s)... (placeholder)');
    clearSelection();
  });
  document.getElementById('bulk-download').addEventListener('click', function () {
    var count = Object.keys(SELECTED).length;
    showToast('Downloading ' + count + ' video(s)... (placeholder)');
    clearSelection();
  });
  document.getElementById('bulk-schedule').addEventListener('click', function () {
    var count = Object.keys(SELECTED).length;
    showToast('Scheduling ' + count + ' video(s)... (placeholder)');
    clearSelection();
  });
  document.getElementById('bulk-copy').addEventListener('click', function () {
    var meta = Object.keys(SELECTED).map(function (n) { return ALL_VIDEOS.find(function (v) { return v.n === parseInt(n, 10); }); }).filter(Boolean);
    var text = meta.map(function (v) { return v.id + ' — ' + v.en + ' — ' + v.duration + ' — ' + v.status; }).join('\n');
    copyText(text, 'Metadata');
    clearSelection();
  });
  document.getElementById('bulk-delete').addEventListener('click', function () {
    var count = Object.keys(SELECTED).length;
    if (confirm('Delete ' + count + ' selected video(s)?')) {
      showToast('Deleted ' + count + ' video(s) (placeholder)');
      clearSelection();
    }
  });

  // Publish All / Download All
  document.getElementById('publish-all-btn').addEventListener('click', function () { showToast('Publishing all published videos... (placeholder)'); });
  document.getElementById('download-all-btn').addEventListener('click', function () { showToast('Downloading all published videos... (placeholder)'); });

  // Event delegation on grid
  var grid = document.getElementById('videos-grid');
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.video-card');
    if (!card) return;
    var n = parseInt(card.dataset.n, 10);

    // Checkbox click
    if (e.target.closest('.video-card-checkbox')) {
      toggleSelect(n);
      e.stopPropagation();
      return;
    }

    var v = ALL_VIDEOS.find(function (x) { return x.n === n; });
    if (v) window.location.href = 'video-detail.html?id=' + v.id;
  });

  // Modal close
  document.getElementById('modal-overlay').addEventListener('click', closeModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var modal = document.getElementById('video-modal');
      if (modal && modal.classList.contains('visible')) { closeModal(); return; }
    }
  });
}

document.addEventListener('DOMContentLoaded', initVideos);

})();
