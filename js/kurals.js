(function () {
/* ============================================================
   Thirukkural Database — kurals.js
   Data logic + theme toggle + sidebar (admin layout)
   ============================================================ */

const THEME_KEY = "thirukkural-theme";

const ICONS = {
  sun:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
};

/* ============================================================
   Theme
   ============================================================ */
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

/* ============================================================
   Sidebar (mobile)
   ============================================================ */
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
  window.addEventListener("resize", () => { if (window.innerWidth > 768) close(); });

  /* Placeholder sidebar links — show toast */
  document.querySelectorAll("[data-placeholder]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`${link.textContent.trim()} — coming soon`);
    });
  });
}

/* ============================================================
   Toast
   ============================================================ */
function showToast(message) {
  let toast = document.querySelector(".ui-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "ui-toast";
    toast.innerHTML = `<span class="ui-toast-icon">${ICONS.moon}</span><span class="ui-toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".ui-toast-text").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ============================================================
   Table columns definition
   ============================================================ */
/* Unique kural ID — shared across all pages */
function kuralId(num) { return 'TK-' + String(num).padStart(4, '0'); }

const COLUMNS = [
  {
    key: "Number",
    label: "#",
    className: "col-num",
    render: (r) => `<span class="num-badge">${r.Number}</span>`,
  },
  {
    key: "paal",
    label: "Paal",
    className: "col-meta",
    render: (r) =>
      `<span class="tag tag-gold">${esc(r.paal)}</span><br><span class="tag">${esc(r.paalEn)}</span>`,
  },
  {
    key: "iyal",
    label: "Iyal",
    className: "col-meta",
    render: (r) =>
      `<span class="tag">${esc(r.iyal)}</span><br><span class="tag">${esc(r.iyalEn)}</span>`,
  },
  {
    key: "adhigaram",
    label: "Adhigaram",
    className: "col-meta",
    render: (r) =>
      `<span class="tag tag-gold">${esc(r.adhigaram)}</span><br><span class="tag">${esc(r.adhigaramEn)}</span>`,
  },
  {
    key: "kural",
    label: "Kural",
    className: "col-tamil",
    render: (r) =>
      `<div class="kural-lines"><span>${esc(r.Line1)}</span><span>${esc(r.Line2)}</span></div>`,
  },
  { key: "Translation",    label: "Translation",    className: "col-text" },
  {
    key: "transliteration",
    label: "Transliteration",
    className: "col-meta",
    render: (r) =>
      `<span class="tag">${esc(r.transliteration1)}</span><br><span class="tag">${esc(r.transliteration2)}</span>`,
  },
  { key: "couplet",     label: "Couplet",     className: "col-text" },
  { key: "explanation", label: "Explanation", className: "col-text" },
  {
    key: "mv",
    label: "Mu. Varadarasanar",
    className: "col-commentary",
    render: (r) => commentaryCell("Mu. Varadarasanar", r.mv),
  },
  {
    key: "sp",
    label: "Salomon Pappaiah",
    className: "col-commentary",
    render: (r) => commentaryCell("Salomon Pappaiah", r.sp),
  },
  {
    key: "mk",
    label: "M. Karunanidhi",
    className: "col-commentary",
    render: (r) => commentaryCell("M. Karunanidhi", r.mk),
  },
];

/* ============================================================
   Data helpers
   ============================================================ */
let allRows = [];
const PAGE_SIZE = 50;
let currentPage = 1;
let currentFiltered = [];
let currentQuery = "";

function debounce(fn, ms) {
  let timer;
  return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), ms); };
}

function esc(text) {
  return String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function commentaryCell(label, text) {
  return `<span class="commentary-label">${esc(label)}</span>${esc(text)}`;
}

function buildChapterMap(detail) {
  const map = {};
  for (const section of detail[0].section.detail) {
    const paal = { name: section.name, translation: section.translation };
    for (const iyal of section.chapterGroup.detail) {
      const iyalInfo = { name: iyal.name, translation: iyal.translation };
      for (const chapter of iyal.chapters.detail) {
        for (let n = chapter.start; n <= chapter.end; n++) {
          map[n] = {
            paal:        paal.name,
            paalEn:      paal.translation,
            iyal:        iyalInfo.name,
            iyalEn:      iyalInfo.translation,
            adhigaram:   chapter.name,
            adhigaramEn: chapter.translation,
          };
        }
      }
    }
  }
  return map;
}

function mergeData(kurals, chapterMap) {
  return kurals.map((k) => {
    const merged = {
      ...k,
      ...(chapterMap[k.Number] || {
        paal: "", paalEn: "", iyal: "", iyalEn: "", adhigaram: "", adhigaramEn: "",
      }),
    };
    merged._search = searchableText(merged);
    return merged;
  });
}

function cellHtml(col, row) {
  if (col.render) return col.render(row);
  return esc(String(row[col.key] ?? ""));
}

function searchableText(row) {
  return [
    row.Number, row.paal, row.paalEn, row.iyal, row.iyalEn,
    row.adhigaram, row.adhigaramEn, row.Line1, row.Line2,
    row.Translation, row.transliteration1, row.transliteration2,
    row.couplet, row.explanation, row.mv, row.sp, row.mk,
  ].join(" ").toLowerCase();
}

/* ============================================================
   Render
   ============================================================ */
function renderTable(rows) {
  if (!rows.length) {
    return `
      <div class="kurals-state">
        <div class="kurals-empty">
          <div class="kurals-empty-icon">No matches</div>
          <p>No kurals match your search.</p>
        </div>
      </div>`;
  }

  const head = COLUMNS.map((c) =>
    `<th class="${c.className || ""}">${esc(c.label)}</th>`
  ).join("");

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(startIdx, startIdx + PAGE_SIZE);

  const body = pageRows.map((row) => {
    const cells = COLUMNS.map((c) =>
      `<td class="${c.className || ""}">${cellHtml(c, row)}</td>`
    ).join("");
    return `<tr data-kural-id="${kuralId(row.Number)}">${cells}</tr>`;
  }).join("");

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pagination = totalPages > 1 ? `
    <div class="pagination" style="display:flex;gap:8px;align-items:center;justify-content:center;padding:12px;flex-wrap:wrap;">
      <button class="page-btn" data-page="1" ${currentPage === 1 ? "disabled" : ""}>&laquo; First</button>
      <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>&lsaquo; Prev</button>
      <span class="page-info">Page ${currentPage} of ${totalPages} (${rows.length} kurals)</span>
      <button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next &rsaquo;</button>
      <button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? "disabled" : ""}>Last &raquo;</button>
    </div>` : "";

  return `
    <div class="table-scroll">
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${pagination}`;
}

function filterRows(query) {
  const q = query.trim().toLowerCase();
  return q ? allRows.filter((row) => row._search.includes(q)) : allRows;
}

function setStats(count, total, query) {
  const el = document.getElementById("stats")?.querySelector("span");
  if (!el) return;
  el.textContent = query.trim()
    ? `${count} of ${total} kurals`
    : `${total} kurals loaded`;
}

function updateView(query = "") {
  currentQuery = query;
  currentFiltered = filterRows(query);
  const totalPages = Math.ceil(currentFiltered.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = 1;
  document.getElementById("content").innerHTML = renderTable(currentFiltered);
  setStats(currentFiltered.length, allRows.length, query);
}

function showError(msg) {
  document.getElementById("content").innerHTML = `
    <div class="kurals-state">
      <div class="kurals-error">${msg}</div>
    </div>`;
  const el = document.getElementById("stats")?.querySelector("span");
  if (el) el.textContent = "Failed to load";
}

/* ============================================================
   Init — fetch data
   ============================================================ */
async function initData() {
  try {
    const [kuralRes, detailRes] = await Promise.all([
      fetch("thirukkural.json"),
      fetch("detail.json"),
    ]);
    if (!kuralRes.ok || !detailRes.ok) throw new Error("fetch failed");

    const kuralData  = await kuralRes.json();
    const detailData = await detailRes.json();

    allRows = mergeData(kuralData.kural, buildChapterMap(detailData));
    updateView();

    const search = document.getElementById("search");
    search.disabled = false;
    search.focus?.();
    const debouncedSearch = debounce((value) => { currentPage = 1; updateView(value); }, 200);
    search.addEventListener("input", (e) => debouncedSearch(e.target.value));

    document.getElementById("content").addEventListener("click", (e) => {
      const btn = e.target.closest(".page-btn");
      if (!btn || btn.disabled) return;
      currentPage = parseInt(btn.dataset.page, 10);
      document.getElementById("content").innerHTML = renderTable(currentFiltered);
    });
  } catch {
    showError(`
      Could not load data. Open this page through a local web server.<br><br>
      Run in this folder:<br>
      <code>python -m http.server 8080</code><br>
      Then open <code>http://localhost:8080/kurals.html</code>
    `);
  }
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSidebar();
  initData();
});

})();
