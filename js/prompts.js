/**
 * Prompt Library - Video Script Management
 * Kural-wise scripts with timing, explanations, and AI prompts
 */

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
    toast.innerHTML = `<span class="ui-toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span><span class="ui-toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".ui-toast-text").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// ===== PROMPT LIBRARY LOGIC =====
let allPromptsCache = [];

function buildAllPromptsList() {
  const result = [];
  const kuralsWithPrompts = getKuralsWithPrompts();

  kuralsWithPrompts.forEach(kuralNum => {
    const prompt = getPromptForKural(kuralNum);
    if (prompt) {
      result.push(prompt);
    }
  });

  return result.sort((a, b) => a.kuralNumber - b.kuralNumber);
}

function renderPromptCard(prompt) {
  const storyBadge = prompt.story ?
    `<span class="prompt-story-badge">${prompt.story}</span>` :
    `<span class="prompt-empty-badge">No Story</span>`;

  return `
    <div class="prompt-card" data-prompt-id="${prompt.kuralNumber}">
      <div class="prompt-card-header">
        <div class="prompt-kural">
          <span class="kural-badge">${prompt.kuralId}</span>
        </div>
        <span class="prompt-category-badge">${prompt.category}</span>
      </div>
      <div class="prompt-card-content">
        <h3 class="prompt-title">${prompt.title}</h3>
        <p class="prompt-preview">${prompt.scriptText.substring(0, 100)}...</p>
        <div class="prompt-meta">
          <span class="prompt-duration">${prompt.timing.mainNarration}</span>
          ${storyBadge}
        </div>
      </div>
      <div class="prompt-card-footer">
        <button class="prompt-action-btn" data-kural="${prompt.kuralNumber}">View Script</button>
        <button class="prompt-copy-btn" data-kural="${prompt.kuralNumber}">Copy Prompt</button>
      </div>
    </div>
  `;
}

function renderPromptDetail(prompt) {
  const modal = document.getElementById("prompt-modal");
  const body = document.getElementById("modal-body");

  const storyLink = prompt.story ?
    `<div class="prompt-section"><strong>Story:</strong> <a href="stories.html" style="color: var(--accent-color);">${prompt.story}</a></div>` :
    `<div class="prompt-section"><strong>Story:</strong> <span style="color: var(--text-tertiary);">No story assigned</span></div>`;

  const timingDetails = `
    <div class="timing-grid">
      <div class="timing-item">
        <span class="timing-label">Intro:</span>
        <span>${prompt.timing.intro}</span>
      </div>
      <div class="timing-item">
        <span class="timing-label">Narration:</span>
        <span>${prompt.timing.mainNarration}</span>
      </div>
      <div class="timing-item">
        <span class="timing-label">Explanation:</span>
        <span>${prompt.timing.explanation}</span>
      </div>
      <div class="timing-item">
        <span class="timing-label">Outro:</span>
        <span>${prompt.timing.outro}</span>
      </div>
    </div>
  `;

  const keyPointsList = prompt.keyPoints.map(point => `<li>${point}</li>`).join("");

  body.innerHTML = `
    <div class="modal-header">
      <div>
        <h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 600;">${prompt.title}</h2>
        <p style="margin: 0; color: var(--text-secondary);">${prompt.kuralId}</p>
      </div>
      <span class="modal-category-badge">${prompt.category}</span>
    </div>

    <div class="modal-sections">
      <section class="script-section">
        <h3>Script Text</h3>
        <div class="script-box">${prompt.scriptText}</div>
      </section>

      <section class="timing-section">
        <h3>Timing</h3>
        ${timingDetails}
      </section>

      <section class="explanation-section">
        <h3>Detailed Explanation</h3>
        <p>${prompt.detailedExplanation}</p>
      </section>

      <section class="narration-section">
        <h3>Narration Script</h3>
        <div class="narration-box">"${prompt.narrationScript}"</div>
      </section>

      <section class="generation-section">
        <h3>AI Generation Prompts</h3>

        <div class="generation-item">
          <h4>📷 Image Prompt</h4>
          <div class="prompt-box">${prompt.imagePrompt}</div>
          <button class="copy-prompt-btn" data-text="${prompt.imagePrompt}">Copy</button>
        </div>

        <div class="generation-item">
          <h4>👤 Character Prompt</h4>
          <div class="prompt-box">${prompt.characterPrompt}</div>
          <button class="copy-prompt-btn" data-text="${prompt.characterPrompt}">Copy</button>
        </div>

        <div class="generation-item">
          <h4>🎬 Video Prompt</h4>
          <div class="prompt-box">${prompt.videoPrompt}</div>
          <button class="copy-prompt-btn" data-text="${prompt.videoPrompt}">Copy</button>
        </div>
      </section>

      <section class="key-points-section">
        <h3>Key Points</h3>
        <ul class="key-points">${keyPointsList}</ul>
      </section>

      <section class="generation-notes-section">
        <h3>Generation Notes</h3>
        <p>${prompt.generationNotes}</p>
      </section>

      ${storyLink}
    </div>

    <div class="modal-actions">
      <button class="ui-btn ui-btn-primary" id="edit-script-btn">Edit Script</button>
      <button class="ui-btn" id="export-script-btn">Export</button>
    </div>
  `;

  modal.classList.add("visible");

  // Copy buttons
  body.querySelectorAll(".copy-prompt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-text");
      navigator.clipboard.writeText(text).then(() => {
        showToast("Prompt copied to clipboard!");
      });
    });
  });

  document.getElementById("edit-script-btn")?.addEventListener("click", () => {
    showToast("Script editing coming soon");
  });

  document.getElementById("export-script-btn")?.addEventListener("click", () => {
    showToast("Script exported");
  });
}

function renderPromptsList(prompts) {
  const list = document.getElementById("prompts-list");
  const emptyState = document.getElementById("empty-state");

  if (!list) return;

  if (prompts.length === 0) {
    list.innerHTML = "";
    emptyState?.classList.add("visible");
    return;
  }

  emptyState?.classList.remove("visible");
  list.innerHTML = prompts.map(prompt => renderPromptCard(prompt)).join("");

  // Add event listeners
  list.querySelectorAll(".prompt-action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const kuralNum = parseInt(btn.getAttribute("data-kural"));
      const prompt = allPromptsCache.find(p => p.kuralNumber === kuralNum);
      if (prompt) renderPromptDetail(prompt);
    });
  });
}

function updateStats(totalScripts, kuralsWithScripts) {
  const totalEl = document.getElementById("total-scripts");
  const kuralsEl = document.getElementById("kurals-covered");
  const remainingEl = document.getElementById("kurals-remaining");

  if (totalEl) totalEl.textContent = totalScripts;
  if (kuralsEl) kuralsEl.textContent = kuralsWithScripts;
  if (remainingEl) remainingEl.textContent = Math.max(0, 1330 - kuralsWithScripts);
}

function filterPrompts() {
  const searchText = document.getElementById("search-input")?.value.toLowerCase() || "";
  const categoryFilter = document.getElementById("category-filter")?.value || "";
  const storyFilter = document.getElementById("story-filter")?.value || "";

  let filtered = allPromptsCache.filter(prompt => {
    const matchesSearch = !searchText ||
      prompt.title.toLowerCase().includes(searchText) ||
      prompt.kuralId.toLowerCase().includes(searchText) ||
      prompt.scriptText.toLowerCase().includes(searchText);

    const matchesCategory = !categoryFilter || prompt.category === categoryFilter;
    const matchesStory = !storyFilter || (storyFilter === "with-story" ? prompt.story : !prompt.story);

    return matchesSearch && matchesCategory && matchesStory;
  });

  renderPromptsList(filtered);
  const kuralsWithScripts = new Set(filtered.map(p => p.kuralNumber)).size;
  updateStats(filtered.length, kuralsWithScripts);
}

function initPromptLibrary() {
  allPromptsCache = buildAllPromptsList();
  renderPromptsList(allPromptsCache);
  updateStats(getTotalPromptCount(), getKuralsWithPrompts().length);

  document.getElementById("search-input")?.addEventListener("input", filterPrompts);
  document.getElementById("category-filter")?.addEventListener("change", filterPrompts);
  document.getElementById("story-filter")?.addEventListener("change", filterPrompts);

  document.getElementById("create-prompt-btn")?.addEventListener("click", () => {
    showToast("Script creation form coming soon");
  });

  const modal = document.getElementById("prompt-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");

  closeBtn?.addEventListener("click", () => modal?.classList.remove("visible"));
  overlay?.addEventListener("click", () => modal?.classList.remove("visible"));
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSidebar();
  initPromptLibrary();
});
