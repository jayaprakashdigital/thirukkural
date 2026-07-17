/**
 * Character Image Generation — Frontend Client
 * 
 * Manages master image generation, caching, and display for characters.
 * Backend runs at /api/image/ (port 3701, proxied through nginx).
 */

var IMAGE_API = "/api/image";
var imageCache = {};
var imageGenerating = {};

// ===== API HELPERS =====
function imageApiGet(path) {
  return fetch(IMAGE_API + path).then(function(r) { return r.json(); });
}

function imageApiPost(path, body) {
  return fetch(IMAGE_API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(function(r) { return r.json(); });
}

// ===== GET MASTER IMAGE =====
function getMasterImage(characterId) {
  if (imageCache[characterId]) {
    return Promise.resolve(imageCache[characterId]);
  }
  return imageApiGet("/" + encodeURIComponent(characterId)).then(function(res) {
    if (res.success && res.image) {
      imageCache[characterId] = res.image;
      return res.image;
    }
    return null;
  }).catch(function() { return null; });
}

// ===== GENERATE IMAGE =====
function generateCharacterImage(characterId, characterData, force) {
  if (imageGenerating[characterId]) {
    return Promise.resolve({ success: false, error: "Already generating" });
  }
  imageGenerating[characterId] = true;
  return imageApiPost("/generate", {
    characterId: characterId,
    characterData: characterData,
    force: !!force
  }).then(function(res) {
    imageGenerating[characterId] = false;
    if (res.success && res.image) {
      imageCache[characterId] = res.image;
    }
    return res;
  }).catch(function(err) {
    imageGenerating[characterId] = false;
    return { success: false, error: err.message || "Network error" };
  });
}

// ===== PRELOAD ALL IMAGES FOR VISIBLE CARDS =====
function preloadImages(characters) {
  var ids = characters.map(function(c) { return c.id; }).filter(function(id) { return !imageCache[id]; });
  if (!ids.length) return;
  // Batch fetch from registry
  imageApiGet("/registry").then(function(res) {
    if (res.success && res.images) {
      Object.keys(res.images).forEach(function(id) {
        if (res.images[id].status === "completed") {
          imageCache[id] = res.images[id];
        }
      });
      // Trigger re-render of visible cards
      if (typeof refreshImageCards === "function") refreshImageCards();
    }
  }).catch(function() { /* ignore */ });
}

// ===== RENDER IMAGE ON CARD =====
function renderCardImage(c) {
  var img = imageCache[c.id];
  if (img && img.status === "completed" && img.imageUrl) {
    return '<div class="char-card-image"><img src="' + img.imageUrl + '" alt="' + esc(c.name) + '" loading="lazy"><span class="char-card-image-badge">v' + (img.version || 1) + '</span></div>';
  }
  // Placeholder with generate button
  var initials = (c.name || "?").split(" ").map(function(w) { return w.charAt(0); }).join("").substring(0, 2).toUpperCase();
  return '<div class="char-card-image char-card-image-empty">' +
    '<div class="char-card-placeholder">' + initials + '</div>' +
    '<button type="button" class="char-card-gen-btn" data-char-id="' + esc(c.id) + '" title="Generate Image">&#10024;</button>' +
    '</div>';
}

// ===== GENERATE BUTTON HANDLER ON CARD =====
function wireCardGenButtons() {
  document.querySelectorAll(".char-card-gen-btn").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      e.preventDefault();
      var charId = btn.getAttribute("data-char-id");
      handleGenerateFromCard(charId, btn);
    });
  });
}

function handleGenerateFromCard(charId, btn) {
  var charData = getCharById(charId);
  if (!charData) return;

  btn.classList.add("generating");
  btn.innerHTML = '<span class="gen-spinner"></span>';
  btn.disabled = true;

  generateCharacterImage(charId, charData, false).then(function(res) {
    btn.classList.remove("generating");
    btn.disabled = false;
    if (res.success) {
      // Update card image
      var card = btn.closest(".char-card");
      if (card) {
        var imgContainer = card.querySelector(".char-card-image");
        if (imgContainer && res.image) {
          imgContainer.outerHTML = renderCardImage(charData);
        }
      }
      if (typeof showToast === "function") showToast("Image generated for " + charData.name);
    } else {
      btn.innerHTML = "&#10024;";
      if (typeof showToast === "function") showToast("Generation failed: " + (res.error || "Unknown error"));
    }
  });
}

// ===== DRAWER IMAGE SECTION =====
function renderDrawerImageSection(c) {
  var img = imageCache[c.id];
  var hasImage = img && img.status === "completed";
  var isGenerating = img && img.status === "processing";

  var html = '<div class="char-image-section">';
  html += '<h3 class="char-image-title">Master Image</h3>';

  if (hasImage) {
    html += '<div class="char-image-preview">';
    html += '<img src="' + img.imageUrl + '" alt="' + esc(c.name) + '">';
    html += '<div class="char-image-meta">';
    html += '<span class="char-image-status completed">Generated</span>';
    html += '<span>Version: ' + (img.version || 1) + '</span>';
    html += '<span>' + (img.generatedAt ? new Date(img.generatedAt).toLocaleDateString() : "Unknown") + '</span>';
    html += '</div>';
    html += '<div class="char-image-actions">';
    html += '<button type="button" class="ui-btn ui-btn-primary" id="drawer-regenerate-btn" data-char-id="' + esc(c.id) + '">&#10024; Regenerate</button>';
    html += '<button type="button" class="ui-btn" id="drawer-view-prompt-btn" data-char-id="' + esc(c.id) + '">View Prompt</button>';
    html += '</div>';
    html += '</div>';
  } else if (isGenerating) {
    html += '<div class="char-image-generating">';
    html += '<div class="gen-spinner-large"></div>';
    html += '<p>Generating image...</p>';
    html += '</div>';
  } else {
    html += '<div class="char-image-empty">';
    html += '<div class="char-image-empty-icon">&#127912;</div>';
    html += '<p>No image generated yet</p>';
    html += '<button type="button" class="ui-btn ui-btn-primary" id="drawer-generate-btn" data-char-id="' + esc(c.id) + '">&#10024; Generate Master Image</button>';
    html += '</div>';
  }

  // Prompt preview (if exists)
  if (img && img.prompt) {
    html += '<div class="char-image-prompt-preview" style="display:none;" id="prompt-preview-box">';
    html += '<label>Last used prompt:</label>';
    html += '<textarea readonly>' + esc(img.prompt) + '</textarea>';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function wireDrawerImageButtons(c) {
  var genBtn = document.getElementById("drawer-generate-btn");
  var regenBtn = document.getElementById("drawer-regenerate-btn");
  var promptBtn = document.getElementById("drawer-view-prompt-btn");

  function handleGenerate(force) {
    var btn = force ? regenBtn : genBtn;
    if (!btn) return;
    var origText = btn.innerHTML;
    btn.innerHTML = '<span class="gen-spinner"></span> Generating...';
    btn.disabled = true;

    generateCharacterImage(c.id, c, force).then(function(res) {
      btn.disabled = false;
      if (res.success) {
        if (typeof showToast === "function") showToast("Image " + (force ? "regenerated" : "generated") + " for " + c.name);
        // Re-render drawer
        if (typeof openDrawer === "function") openDrawer(c.id);
      } else {
        btn.innerHTML = origText;
        if (typeof showToast === "function") showToast("Failed: " + (res.error || "Unknown"));
      }
    });
  }

  if (genBtn) genBtn.addEventListener("click", function() { handleGenerate(false); });
  if (regenBtn) regenBtn.addEventListener("click", function() { handleGenerate(true); });
  if (promptBtn) {
    promptBtn.addEventListener("click", function() {
      var box = document.getElementById("prompt-preview-box");
      if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    });
  }
}
