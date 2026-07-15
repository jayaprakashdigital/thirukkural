/**
 * Character Library - Table View
 * Displays all 1330 kurals with their characters in table format
 */

const THEME_KEY = "thirukkural-theme";

function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    btn.innerHTML = theme === "dark" ? SUN : MOON;
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

  if (!sidebar || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay?.classList.add("visible");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay?.classList.remove("visible");
    document.body.style.overflow = "";
  });

  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("open");
      overlay?.classList.remove("visible");
      document.body.style.overflow = "";
    }
  });
}

function showToast(message) {
  let toast = document.querySelector(".ui-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "ui-toast";
    toast.innerHTML = `<span class="ui-toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span class="ui-toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".ui-toast-text").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// ===== CHARACTER TABLE LOGIC =====
let allCharactersCache = [];

function debounce(fn, ms) {
  let timer;
  return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), ms); };
}

function buildAllCharactersList() {
  const result = [];

  // Check if database exists
  if (typeof COMPREHENSIVE_CHARACTER_DATABASE === 'undefined') {
    console.error('Character database not loaded');
    return result;
  }

  // Iterate through all kurals in database
  for (const [kuralNum, characters] of Object.entries(COMPREHENSIVE_CHARACTER_DATABASE)) {
    const kuralNumInt = parseInt(kuralNum);
    if (Array.isArray(characters)) {
      characters.forEach(char => {
        result.push({
          ...char,
          kuralNumber: kuralNumInt,
          kuralId: `TK-${String(kuralNumInt).padStart(4, '0')}`
        });
      });
    }
  }

  return result.sort((a, b) => a.kuralNumber - b.kuralNumber);
}

function renderCharacterRow(character) {
  const storyLink = character.story ?
    `<a href="stories.html" class="story-link">${character.story}</a>` :
    `<span class="no-story">—</span>`;

  const genderClass = {
    Male: "gender-male",
    Female: "gender-female",
    Divine: "gender-divine",
    "Gender-neutral": "gender-neutral"
  }[character.gender] || "gender-neutral";

  return `
    <tr data-char-id="${character.id}" data-kural="${character.kuralNumber}">
      <td class="kural-cell">
        <span class="kural-badge">${character.kuralId}</span>
      </td>
      <td class="name-cell">
        <span class="char-name">${character.name}</span>
        <span class="char-trans">${character.transliteration}</span>
      </td>
      <td class="gender-cell">
        <span class="gender-badge ${genderClass}">${character.gender}</span>
      </td>
      <td class="role-cell">${character.role}</td>
      <td class="consistency-cell">${character.consistency}</td>
      <td class="story-cell">${storyLink}</td>
      <td class="action-cell">
        <button class="view-btn" data-char-id="${character.id}" title="View details">Details</button>
      </td>
    </tr>
  `;
}

function renderCharacterTable(characters) {
  const tbody = document.getElementById("table-body");
  const countEl = document.getElementById("table-count");

  if (!tbody) return;

  if (characters.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No characters found</td></tr>';
    countEl.textContent = "0 records";
    return;
  }

  tbody.innerHTML = characters.map(char => renderCharacterRow(char)).join("");
  countEl.textContent = `${characters.length} record${characters.length !== 1 ? 's' : ''}`;
}

/* Delegated click handler: one listener on the tbody instead of one per row. */
function bindTableEvents() {
  const tbody = document.getElementById("table-body");
  if (!tbody || tbody.dataset.bound === "1") return;
  tbody.dataset.bound = "1";
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;
    const charId = btn.getAttribute("data-char-id");
    const character = allCharactersCache.find(c => c.id === charId);
    if (character) showCharacterDetail(character);
  });
}

function showCharacterDetail(character) {
  const modal = document.getElementById("character-modal");
  const body = document.getElementById("modal-body");

  const storyLink = character.story ?
    `<p><strong>Story:</strong> <a href="stories.html">${character.story}</a></p>` :
    `<p><strong>Story:</strong> <span style="color: var(--text-tertiary);">No story assigned</span></p>`;

  body.innerHTML = `
    <div class="detail-header">
      <div>
        <h2 style="margin: 0 0 0.5rem 0;">${character.name}</h2>
        <p style="margin: 0; color: var(--text-secondary);">${character.transliteration}</p>
      </div>
      <span class="detail-badge">${character.kuralId}</span>
    </div>

    <div class="detail-content">
      <div class="detail-row">
        <label>Gender:</label>
        <span>${character.gender}</span>
      </div>
      <div class="detail-row">
        <label>Role:</label>
        <span>${character.role}</span>
      </div>
      <div class="detail-row">
        <label>Character Consistency:</label>
        <span>${character.consistency}</span>
      </div>
      <div class="detail-row">
        <label>Character Details:</label>
        <p>${character.details}</p>
      </div>
      ${storyLink}
    </div>

    <div class="detail-actions">
      <button class="ui-btn ui-btn-primary" id="edit-btn">Edit</button>
      <button class="ui-btn" id="close-btn">Close</button>
    </div>
  `;

  modal.classList.add("visible");

  document.getElementById("edit-btn")?.addEventListener("click", () => {
    showToast("Character editing coming soon");
  });

  document.getElementById("close-btn")?.addEventListener("click", () => {
    modal.classList.remove("visible");
  });
}

function updateStats(totalChars, kuralsWithChars, storyChars) {
  const totalEl = document.getElementById("total-chars");
  const kuralsEl = document.getElementById("kurals-covered");
  const storyEl = document.getElementById("story-chars");

  if (totalEl) totalEl.textContent = totalChars;
  if (kuralsEl) kuralsEl.textContent = kuralsWithChars;
  if (storyEl) storyEl.textContent = storyChars;
}

function filterCharacters() {
  const searchText = document.getElementById("search-input")?.value.toLowerCase() || "";
  const genderFilter = document.getElementById("gender-filter")?.value || "";
  const storyFilter = document.getElementById("story-filter")?.value || "";
  const sortBy = document.getElementById("sort-filter")?.value || "kural-asc";

  let filtered = allCharactersCache.filter(char => {
    const matchesSearch = !searchText ||
      char.name.toLowerCase().includes(searchText) ||
      char.transliteration.toLowerCase().includes(searchText) ||
      char.kuralId.toLowerCase().includes(searchText) ||
      char.role.toLowerCase().includes(searchText) ||
      char.consistency.toLowerCase().includes(searchText);

    const matchesGender = !genderFilter || char.gender === genderFilter;
    const matchesStory = !storyFilter || (storyFilter === "with-story" ? char.story : !char.story);

    return matchesSearch && matchesGender && matchesStory;
  });

  // Sort
  if (sortBy === "kural-asc") {
    filtered.sort((a, b) => a.kuralNumber - b.kuralNumber);
  } else if (sortBy === "kural-desc") {
    filtered.sort((a, b) => b.kuralNumber - a.kuralNumber);
  } else if (sortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderCharacterTable(filtered);

  // Update stats for filtered view
  if (filtered.length > 0) {
    const kuralsWithChars = new Set(filtered.map(c => c.kuralNumber)).size;
    const storyChars = filtered.filter(c => c.story).length;
    updateStats(filtered.length, kuralsWithChars, storyChars);
  }
}

function initCharacterTable() {
  allCharactersCache = buildAllCharactersList();
  renderCharacterTable(allCharactersCache);

  // Calculate stats
  const totalChars = allCharactersCache.length;
  const kuralsWithChars = new Set(allCharactersCache.map(c => c.kuralNumber)).size;
  const storyChars = allCharactersCache.filter(c => c.story).length;
  updateStats(totalChars, kuralsWithChars, storyChars);

  document.getElementById("search-input")?.addEventListener("input", debounce(filterCharacters, 200));
  document.getElementById("gender-filter")?.addEventListener("change", filterCharacters);
  document.getElementById("story-filter")?.addEventListener("change", filterCharacters);
  document.getElementById("sort-filter")?.addEventListener("change", filterCharacters);

  bindTableEvents();

  document.getElementById("export-btn")?.addEventListener("click", () => {
    // Export as CSV
    let csv = "Kural,Character Name,Transliteration,Gender,Role,Consistency,Story\n";
    allCharactersCache.forEach(char => {
      csv += `"${char.kuralId}","${char.name}","${char.transliteration}","${char.gender}","${char.role}","${char.consistency}","${char.story}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "character-library-1330-kurals.csv";
    a.click();
    showToast("Character data exported as CSV");
  });

  const modal = document.getElementById("character-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");

  closeBtn?.addEventListener("click", () => modal?.classList.remove("visible"));
  overlay?.addEventListener("click", () => modal?.classList.remove("visible"));
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  try {
    initTheme();
    initSidebar();

    // Check if database is loaded
    if (typeof COMPREHENSIVE_CHARACTER_DATABASE === 'undefined') {
      console.error('Character database not found');
      const tbody = document.getElementById("table-body");
      if (tbody) tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Error: Character database not loaded. Please refresh the page.</td></tr>';
      return;
    }

    initCharacterTable();
    console.log('Character Library initialized successfully');
  } catch (error) {
    console.error('Error initializing Character Library:', error);
    const tbody = document.getElementById("table-body");
    if (tbody) tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Error loading characters. Check console for details.</td></tr>';
  }
});
