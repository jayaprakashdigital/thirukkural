/**
 * Shared helpers — theme, sidebar, toast, escaping, constants.
 * Loaded once on every page before any page-specific script so that
 * theme/sidebar/toast helpers live in a single place (DRY).
 */

// ===== NAMED CONSTANTS (replaces magic numbers across the codebase) =====
const THEME_KEY = "thirukkural-theme";
const TOAST_DURATION_MS = 3000;
const MOBILE_BREAKPOINT_PX = 768;
const TOTAL_KURALS = 1330;
const X_CHAR_LIMIT = 280;

// Library status thresholds (images)
const IMAGE_COMPLETED_THRESHOLD = 156;
const IMAGE_PROCESSING_THRESHOLD = 168;

// Library status thresholds (videos)
const VIDEO_PUBLISHED_THRESHOLD = 42;
const VIDEO_RENDERING_THRESHOLD = 50;
const VIDEO_SCHEDULED_THRESHOLD = 60;

// Social post status threshold
const SOCIAL_POSTED_THRESHOLD = 18;

// Scene editor defaults
const DEFAULT_SCENE_DURATION = 5;
const DEFAULT_FPS = 24;
const DEFAULT_VOLUME = 0.8;
const DEFAULT_FADE_SECONDS = 2;
const DEFAULT_SPEED = 1.0;
const DEFAULT_PITCH = 1.0;
const MAX_SCENE_DURATION = 300;
const MIN_FPS = 12;
const MAX_FPS = 60;
const DEFAULT_TIME_OF_DAY_INDEX = 3;

// Validation / readiness
const DEGREES_PER_PERCENT = 3.6;
const PERCENT_FULL = 100;

// ===== ICONS (merged from dashboard.js, kurals.js, stories.js) =====
const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  kurals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  story: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  character: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  prompt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  workflow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  publish: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
  task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

// ===== THEME =====
function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

function initTheme() {
  applyTheme(getTheme());
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  });
}

// ===== SIDEBAR (mobile) =====
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("sidebar-open");
  const closeBtn = document.getElementById("sidebar-close");

  function open() {
    sidebar?.classList.add("open");
    overlay?.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function close() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("visible");
    document.body.style.overflow = "";
  }

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT_PX) close();
  });

  // Placeholder sidebar links — show toast
  document.querySelectorAll("[data-placeholder]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`${link.textContent.trim()} — coming soon`);
    });
  });
}

// ===== TOAST =====
function showToast(message) {
  let toast = document.querySelector(".ui-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "ui-toast";
    toast.innerHTML = `<span class="ui-toast-icon">${ICONS.story}</span><span class="ui-toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".ui-toast-text").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), TOAST_DURATION_MS);
}

// ===== HTML ESCAPE (DOM-based, safe for all content) =====
function esc(text) {
  const d = document.createElement("div");
  d.textContent = text == null ? "" : String(text);
  return d.innerHTML;
}

// ===== KURAL ID =====
function kuralId(num) {
  return "TK-" + String(num).padStart(4, "0");
}

// ===== KURAL STUDIO =====
// Script/scene data (js/scripts-data.js MVP_KURAL_NUMBERS) only covers
// TK-0001-TK-0010 so far. Duplicated here (not read from MVP_KURAL_NUMBERS)
// because shared.js loads on pages — stories/characters/library — that don't
// load scripts-data.js; cross-links route to Kural Studio only within this
// range, and toast elsewhere instead of dead-ending.
var KURAL_STUDIO_MVP_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function kuralStudioAvailable(num) {
  return KURAL_STUDIO_MVP_RANGE.includes(num);
}
function openKuralStudio(num) {
  window.location.href = "kural-detail.html?id=" + kuralId(num);
}

// ===== CLIPBOARD =====
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(
    () => showToast(label + " copied to clipboard"),
    () => showToast("Copy failed — select and copy manually")
  );
}

// ===== SCRIPT/SCENE PROMPT AUTO-GENERATION =====
// Moved to js/shared-prompts.js (STUDIO_STYLE, autoGenImagePrompt, autoGenVideoPrompt,
// autoGenBackgroundPrompt, autoGenLightingPrompt, autoGenCharacterPrompt,
// autoGenMusicPrompt, autoGenSFXPrompt) so the Kural Studio Node backend can
// require() the same prompt templates the browser uses. Load shared-prompts.js
// before this file — classic <script> tags share one global scope.

// ===== FILE DOWNLOAD =====
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
