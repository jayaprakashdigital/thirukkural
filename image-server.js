#!/usr/bin/env node
/**
 * Character Image Generation API — OpenAI GPT Image 1
 * 
 * Standalone microservice that generates character images using OpenAI's API.
 * Runs on port 3701, proxied through nginx at /api/image/
 *
 * Endpoints:
 *   POST /api/image/generate      — Generate a master character image
 *   GET  /api/image/:characterId  — Get the master image for a character
 *   GET  /api/image/registry      — Get all registered images
 */
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

const PORT = parseInt(process.env.PORT || "3701", 10);
const REPO_PATH = process.env.REPO_PATH || "/root/thirukkural";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const REGISTRY_PATH = path.join(REPO_PATH, ".data", "image-registry.json");
const IMAGES_DIR = path.join(REPO_PATH, ".data", "images");

// Ensure directories exist
function ensureDirs() {
  const dataDir = path.join(REPO_PATH, ".data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
ensureDirs();

// ===== IMAGE REGISTRY =====
function loadRegistry() {
  try {
    if (fs.existsSync(REGISTRY_PATH)) {
      return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
    }
  } catch (e) { /* ignore */ }
  return {};
}

function saveRegistry(registry) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
}

// ===== OPENAI API CALL =====
async function callOpenAI(prompt, size) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: size || "1024x1024",
      quality: "high"
    });

    const options = {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/images/generations",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Length": Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || "OpenAI API error"));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error("Failed to parse OpenAI response: " + data.substring(0, 200)));
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error("OpenAI request timed out"));
    });
    req.write(body);
    req.end();
  });
}

// ===== BUILD OPTIMIZED PROMPT =====
function buildCharacterPrompt(charData) {
  var parts = [];

  // Core identity
  parts.push("Cinematic portrait of");
  parts.push(charData.name || "a character");

  // Physical appearance
  if (charData.gender) parts.push(charData.gender.toLowerCase() + " character");
  if (charData.age) parts.push(charData.age + " years old");
  if (charData.skinTone) parts.push(charData.skinTone + " skin");
  if (charData.faceShape) parts.push(charData.faceShape + " face");
  if (charData.eyeColor) parts.push(charData.eyeColor + " eyes");

  // Hair
  if (charData.hairStyle && charData.hairColor) {
    parts.push(charData.hairColor + " " + charData.hairStyle + " hair");
  } else if (charData.hairStyle) {
    parts.push(charData.hairStyle + " hair");
  }

  // Body
  if (charData.height) parts.push(charData.height);
  if (charData.bodyType) parts.push(charData.bodyType + " build");

  // Clothing
  if (charData.defaultCostume) parts.push("wearing " + charData.defaultCostume);
  if (charData.accessories) parts.push("with " + charData.accessories);
  if (charData.jewelry) parts.push("and " + charData.jewelry);

  // Expression and pose
  if (charData.expressionPrompt) parts.push(charData.expressionPrompt);
  else if (charData.emotionStyle) parts.push(charData.emotionStyle + " expression");

  // Style
  if (charData.stylePrompt) {
    parts.push(charData.stylePrompt);
  } else {
    parts.push("Traditional Tamil cultural aesthetic, cinematic lighting, golden hour, warm color palette, highly detailed, professional portrait photography, shallow depth of field, 4K");
  }

  // Negative prompt context
  parts.push("No text, no watermarks, no logos");

  return parts.join(". ");
}

// ===== STREAM IMAGE AS BASE64 =====
async function downloadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImageAsBase64(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString("base64"));
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

// ===== EXPRESS APP =====
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Health check
app.get("/api/image/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!OPENAI_API_KEY,
    registrySize: Object.keys(loadRegistry()).length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/image/registry — list all registered images
app.get("/api/image/registry", (req, res) => {
  const registry = loadRegistry();
  res.json({ success: true, images: registry });
});

// GET /api/image/:characterId — get master image for a character
app.get("/api/image/:characterId", (req, res) => {
  const registry = loadRegistry();
  const entry = registry[req.params.characterId];
  if (!entry || entry.status !== "completed") {
    return res.status(404).json({ success: false, error: "No image found", status: entry ? entry.status : "none" });
  }
  res.json({ success: true, image: entry });
});

// GET /api/image/:characterId/file — serve the actual image file
app.get("/api/image/:characterId/file", (req, res) => {
  const registry = loadRegistry();
  const entry = registry[req.params.characterId];
  if (!entry || entry.status !== "completed" || !entry.filePath) {
    return res.status(404).json({ success: false, error: "No image file found" });
  }
  const filePath = path.join(REPO_PATH, entry.filePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: "Image file missing from disk" });
  }
  res.setHeader("Content-Type", entry.mimeType || "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400");
  fs.createReadStream(filePath).pipe(res);
});

// POST /api/image/generate — generate a master character image
app.post("/api/image/generate", async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ success: false, error: "OPENAI_API_KEY not configured" });
  }

  const { characterId, characterData, force } = req.body;
  if (!characterId || !characterData) {
    return res.status(400).json({ success: false, error: "characterId and characterData required" });
  }

  const registry = loadRegistry();

  // Check if image already exists (unless force regenerate)
  if (!force && registry[characterId] && registry[characterId].status === "completed") {
    return res.json({
      success: true,
      cached: true,
      image: registry[characterId]
    });
  }

  // Mark as processing
  const version = registry[characterId] ? (registry[characterId].version || 0) + 1 : 1;
  registry[characterId] = {
    characterId: characterId,
    status: "processing",
    version: version,
    prompt: "",
    generatedAt: null,
    filePath: null,
    mimeType: null,
    metadata: {}
  };
  saveRegistry(registry);

  try {
    // Build prompt from character data
    const prompt = buildCharacterPrompt(characterData);
    registry[characterId].prompt = prompt;
    saveRegistry(registry);

    console.log(`[${new Date().toISOString()}] Generating image for ${characterId}...`);

    // Call OpenAI
    const result = await callOpenAI(prompt, "1024x1024");

    // Handle b64_json response
    let imageBase64;
    if (result.data && result.data[0]) {
      if (result.data[0].b64_json) {
        imageBase64 = result.data[0].b64_json;
      } else if (result.data[0].url) {
        imageBase64 = await downloadImageAsBase64(result.data[0].url);
      }
    }

    if (!imageBase64) {
      throw new Error("No image data in OpenAI response");
    }

    // Save image to disk
    const filename = characterId.replace(/[^a-zA-Z0-9-_]/g, "_") + "_v" + version + ".png";
    const filePath = path.join(IMAGES_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(imageBase64, "base64"));

    // Update registry
    const relativePath = ".data/images/" + filename;
    registry[characterId] = {
      characterId: characterId,
      status: "completed",
      version: version,
      prompt: prompt,
      generatedAt: new Date().toISOString(),
      filePath: relativePath,
      mimeType: "image/png",
      imageUrl: "/api/image/" + characterId + "/file",
      metadata: {
        model: "gpt-image-1",
        size: "1024x1024",
        quality: "high"
      }
    };
    saveRegistry(registry);

    console.log(`[${new Date().toISOString()}] Image generated for ${characterId} -> ${relativePath}`);

    res.json({
      success: true,
      cached: false,
      image: registry[characterId]
    });

  } catch (err) {
    console.error(`[${new Date().toISOString()}] Generation failed for ${characterId}: ${err.message}`);
    registry[characterId].status = "error";
    registry[characterId].error = err.message;
    saveRegistry(registry);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Character Image API listening on port ${server.address().port}`);
});

module.exports = { app, server };
