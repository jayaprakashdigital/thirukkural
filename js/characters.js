/**
 * Character Library - Dynamic character management
 * Kural-wise character listing with filtering and search
 */

// ===== THEME & SIDEBAR HELPERS =====
// THEME_KEY is declared in dashboard.js (loaded before this file);
// redeclaring it with const throws and kills this whole script.

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

// ===== CHARACTER LIBRARY LOGIC =====
let allCharactersCache = [];

function buildAllCharactersList() {
  const result = [];
  const kuralsWithCharacters = getKuralsWithCharacters();

  kuralsWithCharacters.forEach(kuralNum => {
    const characters = getCharactersForKural(kuralNum);
    if (Array.isArray(characters)) {
      characters.forEach(char => {
        result.push({
          ...char,
          kuralNumber: kuralNum,
          kuralId: `TK-${String(kuralNum).padStart(4, '0')}`
        });
      });
    }
  });

  return result.sort((a, b) => a.kuralNumber - b.kuralNumber);
}

function renderCharacterCard(character) {
  const genderColor = {
    Male: "gender-male",
    Female: "gender-female",
    Divine: "gender-divine",
    "Gender-neutral": "gender-neutral"
  }[character.gender] || "gender-neutral";

  const storyBadge = character.story ?
    `<span class="char-story-badge">${character.story}</span>` :
    `<span class="char-empty-badge">No Story</span>`;

  return `
    <div class="character-card" data-char-id="${character.id}" data-kural="${character.kuralNumber}">
      <div class="character-card-header">
        <div class="character-kural"><span class="kural-badge">${character.kuralId}</span></div>
        <span class="character-gender-badge ${genderColor}">${character.gender}</span>
      </div>
      <div class="character-card-content">
        <h3 class="character-name">${character.name}</h3>
        <p class="character-transliteration">${character.transliteration}</p>
        <div class="character-role"><span class="role-label">Role:</span> <span class="role-value">${character.role}</span></div>
        <div class="character-consistency"><span class="consistency-label">Consistency:</span> <span class="consistency-value">${character.consistency}</span></div>
      </div>
      <div class="character-card-footer">
        ${storyBadge}
        <button class="char-action-btn" data-char-id="${character.id}">Details</button>
      </div>
    </div>
  `;
}

function renderCharacterList(characters) {
  const list = document.getElementById("character-list");
  const emptyState = document.getElementById("empty-state");

  if (!list) return;

  if (characters.length === 0) {
    list.innerHTML = "";
    emptyState?.classList.add("visible");
    return;
  }

  emptyState?.classList.remove("visible");
  list.innerHTML = characters.map(char => renderCharacterCard(char)).join("");

  // Add event listeners
  list.querySelectorAll(".char-action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const charId = btn.getAttribute("data-char-id");
      const character = allCharactersCache.find(c => c.id === charId);
      if (character) showCharacterDetail(character);
    });
  });
}

function showCharacterDetail(character) {
  const modal = document.getElementById("character-modal");
  const body = document.getElementById("modal-body");

  if (!modal || !body) return;

  const storyLink = character.story ?
    `<p><strong>Story:</strong> <a href="stories.html" style="color: var(--accent-color);">${character.story}</a></p>` :
    `<p><strong>Story:</strong> <span style="color: var(--text-tertiary);">No story assigned yet</span></p>`;

  body.innerHTML = `
    <div class="modal-character-header">
      <div><h2 style="margin: 0 0 0.5rem 0;">${character.name}</h2><p style="margin: 0; color: var(--text-secondary); font-style: italic;">${character.transliteration}</p></div>
      <span class="modal-kural-badge">${character.kuralId}</span>
    </div>
    <div class="modal-character-details">
      <div class="detail-group"><label>Gender</label><p>${character.gender}</p></div>
      <div class="detail-group"><label>Role</label><p>${character.role}</p></div>
      <div class="detail-group"><label>Character Consistency</label><p>${character.consistency}</p></div>
      <div class="detail-group"><label>Character Details</label><p>${character.details}</p></div>
      ${storyLink}
    </div>
    <div class="modal-actions">
      <button class="ui-btn ui-btn-primary" id="edit-char-btn">Edit Character</button>
      <button class="ui-btn" id="delete-char-btn">Delete</button>
    </div>
  `;

  modal.classList.add("visible");

  document.getElementById("edit-char-btn")?.addEventListener("click", () => {
    showToast("Character editing coming soon");
  });

  document.getElementById("delete-char-btn")?.addEventListener("click", () => {
    showToast(`Character "${character.name}" deleted`);
    modal.classList.remove("visible");
  });
}

function updateStats(totalChars, kuralsWithChars) {
  const totalEl = document.getElementById("total-chars");
  const kuralsEl = document.getElementById("kurals-covered");
  const emptyEl = document.getElementById("empty-kurals");

  if (totalEl) totalEl.textContent = totalChars;
  if (kuralsEl) kuralsEl.textContent = kuralsWithChars;
  if (emptyEl) emptyEl.textContent = Math.max(0, 1330 - kuralsWithChars);
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
      char.role.toLowerCase().includes(searchText);

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

  renderCharacterList(filtered);

  const kuralsWithChars = new Set(filtered.map(c => c.kuralNumber)).size;
  updateStats(filtered.length, kuralsWithChars);
}

function initCharacterLibrary() {
  allCharactersCache = buildAllCharactersList();
  renderCharacterList(allCharactersCache);
  updateStats(getTotalCharacterCount(), getKuralsWithCharacters().length);

  document.getElementById("search-input")?.addEventListener("input", filterCharacters);
  document.getElementById("gender-filter")?.addEventListener("change", filterCharacters);
  document.getElementById("story-filter")?.addEventListener("change", filterCharacters);
  document.getElementById("sort-filter")?.addEventListener("change", filterCharacters);

  document.getElementById("add-character-btn")?.addEventListener("click", () => {
    showToast("Character creation form coming soon");
  });

  const modal = document.getElementById("character-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");

  closeBtn?.addEventListener("click", () => modal?.classList.remove("visible"));
  overlay?.addEventListener("click", () => modal?.classList.remove("visible"));
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSidebar();
  initCharacterLibrary();
});
