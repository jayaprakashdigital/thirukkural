/**
 * Social Posts — one post per kural (all 1330), platform-wise content.
 * Reads KURAL_MEDIA (js/media-data.js) and generates Instagram / YouTube /
 * Facebook / X content per kural: caption, description, hashtags, preview.
 *
 * Statuses are deterministic placeholders until the publishing pipeline exists:
 * kural 1–18 posted (matches the dashboard's "18 published"), 19–42 scheduled, rest draft.
 *
 * NOTE: loaded after dashboard.js — do not redeclare THEME_KEY/ICONS here.
 */

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", short: "IG" },
  { key: "youtube", label: "YouTube", short: "YT" },
  { key: "facebook", label: "Facebook", short: "FB" },
  { key: "x", label: "X (Twitter)", short: "X" },
];

const SOCIAL_HOOKS = [
  "✨ Daily Tamil Wisdom",
  "🌟 2,000 years old — still true today",
  "📖 One Kural a day",
  "🙏 Timeless wisdom from Thiruvalluvar",
  "💡 Ancient wisdom for modern life",
];

function socialEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function chapterTag(chEn) {
  return "#" + chEn.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1)).join("");
}

function buildPost(k) {
  const hook = SOCIAL_HOOKS[k.n % SOCIAL_HOOKS.length];
  const baseTags = ["#Thirukkural", "#Kural" + k.n, chapterTag(k.chEn), "#Thiruvalluvar", "#TamilWisdom"];
  const igTags = baseTags.concat(["#TamilCulture", "#TamilQuotes", "#Reels", "#DailyWisdom", "#Tamil"]);
  const fbTags = baseTags.slice(0, 4);
  const xTags = ["#Thirukkural", "#Kural" + k.n, "#TamilWisdom"];
  const ytTags = baseTags.concat(["#Shorts", "#TamilShorts"]);

  // X caption must fit 280 chars including tags
  const xTagStr = xTags.join(" ");
  let xText = k.ta + "\n\n" + k.en;
  const xBudget = 280 - xTagStr.length - 2;
  if (xText.length > xBudget) xText = xText.substring(0, xBudget - 1).trim() + "…";

  return {
    ...k,
    status: k.n <= 18 ? "posted" : k.n <= 42 ? "scheduled" : "draft",
    platforms: {
      instagram: {
        caption:
          hook + " — Kural " + k.n + "\n\n" + k.ta + "\n\n\"" + k.en + "\"\n\n" +
          k.ch + " · " + k.chEn + " (" + k.sec + ")\n\nFollow for daily Thirukkural wisdom 🙏",
        tags: igTags.join(" "),
        description: "Kural " + k.n + " from " + k.chEn + " — " + k.sec + " section of the Thirukkural.",
      },
      youtube: {
        caption: "Kural " + k.n + " | " + k.chEn + " | Thirukkural Wisdom #Shorts",
        tags: ytTags.join(" "),
        description:
          k.ta + "\n\n\"" + k.en + "\"\n\nChapter: " + k.ch + " (" + k.chEn + ")\nSection: " + k.sec +
          "\nKural number: " + k.n + " of 1330\n\nThe Thirukkural, written by the poet-saint Thiruvalluvar over 2,000 years ago, is one of the most translated non-religious texts in the world. One short video for every kural — subscribe to follow the whole journey.\n\n" +
          ytTags.join(" "),
      },
      facebook: {
        caption:
          "Kural " + k.n + " — " + k.chEn + "\n\n" + k.ta + "\n\n\"" + k.en + "\"\n\n" +
          "What does this kural mean to you? Share your thoughts below 👇\n\n" + fbTags.join(" "),
        tags: fbTags.join(" "),
        description: "Daily Thirukkural series — Kural " + k.n + " (" + k.chEn + ", " + k.sec + ").",
      },
      x: {
        caption: xText + "\n\n" + xTagStr,
        tags: xTagStr,
        description: "X post for Kural " + k.n + " — auto-trimmed to 280 characters.",
      },
    },
    _search: (k.id + " " + k.n + " " + k.ta + " " + k.en + " " + k.ch + " " + k.chEn + " " + k.sec).toLowerCase(),
  };
}

let ALL_POSTS = [];

function debounce(fn, ms) {
  let timer;
  return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), ms); };
}

function renderPostRow(p) {
  const platformBadges = SOCIAL_PLATFORMS.map(
    (pl) => `<span class="platform-chip platform-${pl.key}" title="${pl.label}">${pl.short}</span>`
  ).join("");
  return `
    <tr data-n="${p.n}">
      <td class="kural-cell"><span class="kural-badge">${p.id}</span></td>
      <td class="post-cell">
        <span class="post-tamil" lang="ta">${socialEsc(p.ta)}</span>
        <span class="post-chapter">Kural ${p.n} · ${socialEsc(p.chEn)} · ${socialEsc(p.sec)}</span>
      </td>
      <td class="platforms-cell">${platformBadges}</td>
      <td class="status-cell"><span class="status-badge status-${p.status}">${p.status}</span></td>
      <td class="action-cell"><button class="view-btn" data-n="${p.n}">View Post</button></td>
    </tr>
  `;
}

function renderPostsTable(posts) {
  const tbody = document.getElementById("table-body");
  const countEl = document.getElementById("table-count");
  if (!tbody) return;

  if (!posts.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No posts match your filters</td></tr>';
    if (countEl) countEl.textContent = "0 posts";
    return;
  }
  tbody.innerHTML = posts.map(renderPostRow).join("");
  if (countEl) {
    countEl.textContent =
      posts.length === ALL_POSTS.length ? ALL_POSTS.length + " posts" : posts.length + " of " + ALL_POSTS.length + " posts";
  }
}

function copyText(text, label) {
  navigator.clipboard.writeText(text).then(
    () => showToast(label + " copied to clipboard"),
    () => showToast("Copy failed — select and copy manually")
  );
}

function renderPlatformPane(p, key) {
  const pl = p.platforms[key];
  const isYt = key === "youtube";
  return `
    <div class="post-preview">
      <div class="preview-head">
        <span class="preview-avatar">தி</span>
        <span class="preview-name">Thirukkural Daily<span class="preview-handle">@thirukkural_daily</span></span>
      </div>
      <div class="preview-media" lang="ta"><span>${socialEsc(p.ta)}</span></div>
      <div class="preview-caption">${socialEsc(pl.caption)}</div>
      <div class="preview-actions">♥ ␣ ↺ ␣ ➦</div>
    </div>
    <div class="post-fields">
      <div class="post-field">
        <div class="post-field-head">
          <label>${isYt ? "Title" : "Caption"}</label>
          <button class="copy-btn" data-copy-kind="caption" data-platform="${key}">Copy</button>
        </div>
        <pre>${socialEsc(pl.caption)}</pre>
      </div>
      <div class="post-field">
        <div class="post-field-head">
          <label>Description</label>
          <button class="copy-btn" data-copy-kind="description" data-platform="${key}">Copy</button>
        </div>
        <pre>${socialEsc(pl.description)}</pre>
      </div>
      <div class="post-field">
        <div class="post-field-head">
          <label>Hashtags</label>
          <button class="copy-btn" data-copy-kind="tags" data-platform="${key}">Copy</button>
        </div>
        <pre>${socialEsc(pl.tags)}</pre>
      </div>
    </div>
  `;
}

function showPostDetail(p) {
  const modal = document.getElementById("post-modal");
  const body = document.getElementById("modal-body");
  if (!modal || !body) return;

  const tabs = SOCIAL_PLATFORMS.map(
    (pl, i) => `<button class="platform-tab${i === 0 ? " active" : ""}" data-platform="${pl.key}">${pl.label}</button>`
  ).join("");

  body.innerHTML = `
    <div class="detail-header">
      <div>
        <h2 lang="ta">${socialEsc(p.ta)}</h2>
        <p>Kural ${p.n} · ${socialEsc(p.chEn)} · ${socialEsc(p.sec)} · <span class="status-badge status-${p.status}">${p.status}</span></p>
      </div>
      <span class="detail-badge">${p.id}</span>
    </div>
    <div class="platform-tabs">${tabs}</div>
    <div class="platform-pane" id="platform-pane">${renderPlatformPane(p, "instagram")}</div>
  `;

  body.querySelectorAll(".platform-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      body.querySelectorAll(".platform-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("platform-pane").innerHTML = renderPlatformPane(p, tab.dataset.platform);
    });
  });

  body.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const pl = p.platforms[btn.dataset.platform];
    copyText(pl[btn.dataset.copyKind], SOCIAL_PLATFORMS.find((x) => x.key === btn.dataset.platform).label + " " + btn.dataset.copyKind);
  });

  modal.classList.add("visible");
}

function filterPosts() {
  const q = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
  const section = document.getElementById("section-filter")?.value || "";
  const status = document.getElementById("status-filter")?.value || "";
  const sortBy = document.getElementById("sort-filter")?.value || "kural-asc";

  let filtered = ALL_POSTS.filter(
    (p) => (!q || p._search.includes(q)) && (!section || p.sec === section) && (!status || p.status === status)
  );
  filtered.sort((a, b) => (sortBy === "kural-desc" ? b.n - a.n : a.n - b.n));
  renderPostsTable(filtered);
}

function updateSocialStats() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("total-posts", ALL_POSTS.length);
  set("posted-count", ALL_POSTS.filter((p) => p.status === "posted").length);
  set("scheduled-count", ALL_POSTS.filter((p) => p.status === "scheduled").length);
}

function exportSocialCsv() {
  let csv = "Kural,Platform,Caption,Hashtags,Description,Status\n";
  const q = (s) => '"' + String(s).replace(/"/g, '""').replace(/\n/g, " / ") + '"';
  ALL_POSTS.forEach((p) => {
    SOCIAL_PLATFORMS.forEach((pl) => {
      const c = p.platforms[pl.key];
      csv += [p.id, pl.label, q(c.caption), q(c.tags), q(c.description), p.status].join(",") + "\n";
    });
  });
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "social-posts-1330-kurals.csv";
  a.click();
  showToast("Exported " + ALL_POSTS.length * SOCIAL_PLATFORMS.length + " platform posts as CSV");
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof KURAL_MEDIA === "undefined") {
    const tbody = document.getElementById("table-body");
    if (tbody) tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Error: media data not loaded — refresh the page.</td></tr>';
    return;
  }

  ALL_POSTS = KURAL_MEDIA.map(buildPost);
  renderPostsTable(ALL_POSTS);
  updateSocialStats();

  document.getElementById("search-input")?.addEventListener("input", debounce(filterPosts, 200));
  document.getElementById("section-filter")?.addEventListener("change", filterPosts);
  document.getElementById("status-filter")?.addEventListener("change", filterPosts);
  document.getElementById("sort-filter")?.addEventListener("change", filterPosts);
  document.getElementById("export-btn")?.addEventListener("click", exportSocialCsv);

  // Delegated: one listener for all 1330 View buttons
  document.getElementById("table-body")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;
    const post = ALL_POSTS.find((p) => p.n === parseInt(btn.dataset.n, 10));
    if (post) showPostDetail(post);
  });

  const modal = document.getElementById("post-modal");
  document.getElementById("modal-close")?.addEventListener("click", () => modal?.classList.remove("visible"));
  document.getElementById("modal-overlay")?.addEventListener("click", () => modal?.classList.remove("visible"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal?.classList.remove("visible"); });
});
