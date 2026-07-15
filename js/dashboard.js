(function () {
/**
 * Admin Dashboard — placeholder data & UI logic
 * No backend. No AI generation.
 */

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
};

const SIDEBAR_MENU = [
  { section: "Main" },
  { id: "dashboard", label: "Dashboard", href: "dashboard.html", icon: "dashboard", active: true },
  { id: "kurals", label: "Kurals", href: "kurals.html", icon: "kurals" },
  { section: "Content" },
  { id: "stories", label: "Story Library", href: "stories.html", icon: "story" },
  { id: "characters", label: "Character Library", href: "characters.html", icon: "character" },
  { id: "prompts", label: "Script Page", href: "prompts.html", icon: "prompt" },
  { id: "socials", label: "Social Posts", href: "socials.html", icon: "social" },
  { section: "Media" },
  { id: "images", label: "Image Library", href: "images.html", icon: "image" },
  { id: "videos", label: "Video Library", href: "videos.html", icon: "video" },
  { section: "Pipeline" },
  { id: "workflow", label: "Workflow", href: "#", icon: "workflow", placeholder: true },
  { id: "publishing", label: "Publishing", href: "#", icon: "publish", placeholder: true },
  { section: "System" },
  { id: "settings", label: "Settings", href: "#", icon: "settings", placeholder: true },
];

const STATS = [
  { label: "Total Kurals", value: "1,330", icon: "kurals", color: "", trend: "neutral", trendText: "Full collection loaded" },
  { label: "Completed Stories", value: "24", icon: "story", color: "teal", trend: "up", trendText: "+3 this week" },
  { label: "Generated Images", value: "156", icon: "image", color: "blue", trend: "up", trendText: "+12 today" },
  { label: "Generated Videos", value: "42", icon: "video", color: "rose", trend: "up", trendText: "+2 today" },
  { label: "Published Videos", value: "18", icon: "publish", color: "teal", trend: "up", trendText: "+1 this week" },
  { label: "Pending Tasks", value: "7", icon: "task", color: "rose", trend: "down", trendText: "2 overdue" },
];

const ACTIVITY = [
  { type: "story", title: "Story draft created", desc: '"The Blessing of Rain" — Kural #11–20 storyboard saved.', time: "2 hours ago" },
  { type: "character", title: "Character updated", desc: "Thiruvalluvar profile — voice tone and visual style revised.", time: "5 hours ago" },
  { type: "image", title: "Image generated", desc: "Scene illustration for Kural #12 — batch render completed.", time: "Yesterday, 4:32 PM" },
  { type: "video", title: "Video rendered", desc: '"Virtue of Ascetics" — 60s preview exported to Video Library.', time: "Yesterday, 11:15 AM" },
  { type: "publish", title: "Video published", desc: '"Praise of God" (Kural 1–5) uploaded to YouTube draft.', time: "2 days ago" },
  { type: "story", title: "Prompt saved", desc: "Cinematic Tamil narration prompt added to Prompt Library.", time: "3 days ago" },
];

const QUICK_ACTIONS = [
  { id: "create-story", label: "Create Story", icon: "story" },
  { id: "create-character", label: "Create Character", icon: "character" },
  { id: "generate-image", label: "Generate Image", icon: "image" },
  { id: "generate-video", label: "Generate Video", icon: "video" },
  { id: "publish-video", label: "Publish Video", icon: "publish" },
];

const THEME_KEY = "thirukkural-theme";

function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'dashboard.html';
  return filename;
}

function setActiveMenuForCurrentPage() {
  const currentPage = getCurrentPage();

  SIDEBAR_MENU.forEach(item => {
    if (item.section) return;
    item.active = item.href.includes(currentPage);
  });
}

function renderSidebar() {
  const nav = document.getElementById("sidebar-nav");
  if (!nav) return;

  // Set active state based on current page
  setActiveMenuForCurrentPage();

  let html = "";
  let inList = false;

  for (const item of SIDEBAR_MENU) {
    if (item.section) {
      if (inList) html += "</ul>";
      html += `<div class="sidebar-section-label">${item.section}</div><ul class="sidebar-menu">`;
      inList = true;
      continue;
    }
    const active = item.active ? " active" : "";
    const placeholder = item.placeholder ? ' data-placeholder="true"' : "";
    html += `
      <li>
        <a href="${item.href}" class="sidebar-link${active}"${placeholder}>
          ${ICONS[item.icon]}
          ${item.label}
        </a>
      </li>`;
  }
  if (inList) html += "</ul>";
  nav.innerHTML = html;

  nav.querySelectorAll('[data-placeholder="true"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`${link.textContent.trim()} — coming soon`);
    });
  });
}

function renderStats() {
  const grid = document.getElementById("stats-grid");
  if (!grid) return;

  grid.innerHTML = STATS.map((s) => `
    <article class="ui-stat-card">
      <div class="ui-stat-icon ${s.color}">${ICONS[s.icon]}</div>
      <div class="ui-stat-content">
        <span class="ui-stat-value">${s.value}</span>
        <span class="ui-stat-label">${s.label}</span>
        <span class="ui-stat-trend ${s.trend}">${s.trendText}</span>
      </div>
    </article>
  `).join("");
}

function activityIcon(type) {
  const map = { story: "story", character: "character", image: "image", video: "video", publish: "publish" };
  return `<div class="ui-timeline-dot ${type}">${ICONS[map[type] || "story"]}</div>`;
}

function renderActivity() {
  const list = document.getElementById("activity-timeline");
  if (!list) return;

  list.innerHTML = ACTIVITY.map((a) => `
    <li class="ui-timeline-item">
      ${activityIcon(a.type)}
      <div class="ui-timeline-body">
        <p class="ui-timeline-title">${a.title}</p>
        <p class="ui-timeline-desc">${a.desc}</p>
        <time class="ui-timeline-time">${a.time}</time>
      </div>
    </li>
  `).join("");
}

function renderQuickActions() {
  const grid = document.getElementById("quick-actions");
  if (!grid) return;

  grid.innerHTML = QUICK_ACTIONS.map((a) => `
    <button type="button" class="ui-action-btn" data-action="${a.id}">
      <span class="ui-action-icon">${ICONS[a.icon]}</span>
      ${a.label}
    </button>
  `).join("");

  grid.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast(`${btn.textContent.trim()} — AI generation coming soon`);
    });
  });
}

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
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

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
    if (window.innerWidth > 768) close();
  });
}

function initDashboard() {
  renderSidebar();
  renderStats();
  renderActivity();
  renderQuickActions();
  initTheme();
  initSidebar();
}

document.addEventListener("DOMContentLoaded", initDashboard);

})();
