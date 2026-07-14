/**
 * Image & Video Library — one entry per kural (all 1330).
 * Reads KURAL_MEDIA (js/media-data.js) and renders a per-kural card grid
 * with search, status filter, and sorting.
 *
 * Statuses are deterministic placeholders until the AI pipeline exists:
 *   images: kural 1–156 completed, 157–168 processing, rest draft
 *   videos: kural 1–42 published, 43–50 rendering, 51–60 scheduled, rest draft
 * (matching the dashboard's headline stats).
 */

function getLibraryType() {
  return window.location.pathname.includes("images") ? "images" : "videos";
}

function buildItems() {
  const isImages = getLibraryType() === "images";
  return KURAL_MEDIA.map((k) => {
    let status, size, downloads, duration, views, likes;
    if (isImages) {
      status = k.n <= 156 ? "completed" : k.n <= 168 ? "processing" : "draft";
      size = status === "completed" ? (1.5 + (k.n % 10) * 0.12).toFixed(1) + " MB" : "—";
      downloads = status === "completed" ? (k.n * 7) % 12 : 0;
    } else {
      status = k.n <= 42 ? "published" : k.n <= 50 ? "rendering" : k.n <= 60 ? "scheduled" : "draft";
      duration = status === "rendering" ? "—" : 60 + (k.n % 31) + "s";
      views = status === "published" ? 40 + ((k.n * 97) % 460) : 0;
      likes = status === "published" ? 5 + ((k.n * 13) % 75) : 0;
    }
    return {
      ...k,
      status,
      size,
      downloads,
      duration,
      views,
      likes,
      _search: (k.id + " " + k.n + " " + k.ta + " " + k.en + " " + k.ch + " " + k.chEn).toLowerCase(),
    };
  });
}

let ALL_ITEMS = [];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderImageCard(item) {
  return `
    <div class="library-item" data-n="${item.n}">
      <div class="library-item-preview">
        <div class="library-item-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
        <span class="library-item-badge ${item.status}">${item.status}</span>
        <span class="library-item-id">${item.id}</span>
      </div>
      <div class="library-item-content">
        <h3 class="library-item-title library-item-tamil" lang="ta">${esc(item.ta)}</h3>
        <div class="library-item-meta">
          <span>Kural ${item.n} · ${esc(item.chEn)}</span>
        </div>
        <div class="library-item-stats">
          <div class="library-item-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><polyline points="12 15 12 3"/>
            </svg>
            ${item.downloads}
          </div>
          <div class="library-item-stat">${item.size}</div>
        </div>
      </div>
    </div>
  `;
}

function renderVideoCard(item) {
  return `
    <div class="library-item" data-n="${item.n}">
      <div class="library-item-preview">
        <div class="library-item-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
        </div>
        <div class="library-item-overlay">
          <div class="library-item-play">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        <span class="library-item-badge ${item.status}">${item.status}</span>
        <span class="library-item-id">${item.id}</span>
      </div>
      <div class="library-item-content">
        <h3 class="library-item-title library-item-tamil" lang="ta">${esc(item.ta)}</h3>
        <div class="library-item-meta">
          <span>Kural ${item.n} · ${esc(item.chEn)}</span>
          <span class="library-item-duration">${item.duration}</span>
        </div>
        <div class="library-item-stats">
          <div class="library-item-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            ${item.views}
          </div>
          <div class="library-item-stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 01-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 01-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 010-7.78z"/>
            </svg>
            ${item.likes}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLibrary(items) {
  const isImages = getLibraryType() === "images";
  const grid = document.getElementById(isImages ? "images-grid" : "videos-grid");
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="library-empty" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <h3>No items found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map((item) => (isImages ? renderImageCard(item) : renderVideoCard(item))).join("");
}

function filterLibrary() {
  const searchText = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("status-filter")?.value || "";
  const sortBy = document.getElementById("sort-filter")?.value || "kural-asc";

  let filtered = ALL_ITEMS.filter((item) => {
    const matchesSearch = !searchText || item._search.includes(searchText);
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === "kural-desc") return b.n - a.n;
    if (sortBy === "name") return a.chEn.localeCompare(b.chEn) || a.n - b.n;
    if (sortBy === "popular") return (b.downloads || b.views || 0) - (a.downloads || a.views || 0);
    if (sortBy === "duration") return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
    return a.n - b.n; // kural-asc (default)
  });

  renderLibrary(filtered);

  const isImages = getLibraryType() === "images";
  const countEl = document.getElementById(isImages ? "image-count" : "video-count");
  if (countEl) {
    countEl.textContent =
      filtered.length === ALL_ITEMS.length ? String(ALL_ITEMS.length) : filtered.length + " of " + ALL_ITEMS.length;
  }
}

function initLibrary() {
  if (typeof KURAL_MEDIA === "undefined") {
    const grid = document.getElementById(getLibraryType() === "images" ? "images-grid" : "videos-grid");
    if (grid) grid.innerHTML = '<div class="library-empty" style="grid-column:1/-1;"><h3>Media data failed to load</h3><p>js/media-data.js is missing — refresh the page.</p></div>';
    return;
  }

  ALL_ITEMS = buildItems();
  filterLibrary();

  document.getElementById("search-input")?.addEventListener("input", filterLibrary);
  document.getElementById("status-filter")?.addEventListener("change", filterLibrary);
  document.getElementById("sort-filter")?.addEventListener("change", filterLibrary);

  // One delegated click handler instead of 1330 listeners
  const grid = document.getElementById(getLibraryType() === "images" ? "images-grid" : "videos-grid");
  grid?.addEventListener("click", (e) => {
    const card = e.target.closest(".library-item");
    if (!card) return;
    const item = ALL_ITEMS.find((i) => i.n === parseInt(card.dataset.n, 10));
    if (item) showToast(item.id + " — " + item.chEn + " (" + item.status + ")");
  });

  document.getElementById("generate-btn")?.addEventListener("click", () => {
    const type = getLibraryType() === "images" ? "Image" : "Video";
    showToast(type + " generation coming soon — AI pipeline in progress");
  });
}

document.addEventListener("DOMContentLoaded", initLibrary);
