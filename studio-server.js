#!/usr/bin/env node
/**
 * Kural Studio API — AI image generation + Google Drive storage backend.
 *
 * Sibling service to deploy-webhook.js, run on the same VPS. Assembles
 * prompts from the existing Kural Database / Story Library / Script Page /
 * Character Library data (server/kural-bundle.js), calls Gemini for image
 * generation (server/gemini-client.js), stores results in the user's own
 * Google Drive (server/drive-client.js), and proxies image bytes back to
 * the browser so Drive links/OAuth tokens never reach the client.
 *
 * Configuration (environment variables):
 *   GEMINI_API_KEY             — Google AI Studio API key (REQUIRED)
 *   GEMINI_IMAGE_MODEL         — image-capable Gemini model id (default: gemini-2.5-flash-image)
 *   GOOGLE_OAUTH_CLIENT_ID     — OAuth2 client id for Drive (REQUIRED)
 *   GOOGLE_OAUTH_CLIENT_SECRET — OAuth2 client secret for Drive (REQUIRED)
 *   GOOGLE_OAUTH_REFRESH_TOKEN — OAuth2 refresh token for the target Drive account, see
 *                                server/get-refresh-token.js (REQUIRED)
 *   GOOGLE_DRIVE_FOLDER_ID     — Drive folder id to store generated images under (REQUIRED)
 *   PORT                       — HTTP port to listen on (default 3700)
 *   REPO_PATH                  — absolute path to the site repo checkout (default cwd)
 *   STUDIO_INDEX_PATH          — path to the generation-state JSON index (default ./.data/studio-index.json)
 *   LOG_FILE                   — absolute path to the service log (default /var/log/thirukkural-studio.log)
 */
const express = require("express");
const path = require("path");
const fs = require("fs");

const { kuralId, parseKuralId, createKuralBundleLoader } = require("./server/kural-bundle.js");
const { loadSharedPrompts, buildCharacterPrompt, buildScenePrompt } = require("./server/prompt-builder.js");
const { createStateIndex } = require("./server/state-index.js");
const { createGeminiClient } = require("./server/gemini-client.js");
const { createDriveClient } = require("./server/drive-client.js");

const PORT = parseInt(process.env.PORT || "3700", 10);
const REPO_PATH = process.env.REPO_PATH || process.cwd();
const STUDIO_INDEX_PATH = process.env.STUDIO_INDEX_PATH || path.join(process.cwd(), ".data", "studio-index.json");
const LOG_FILE = process.env.LOG_FILE || "/var/log/thirukkural-studio.log";

// Configuration — read everything from the environment; never hardcode secrets.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "";
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || "";
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
const GOOGLE_OAUTH_REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN || "";
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

const REQUIRED_ENV = {
  GEMINI_API_KEY,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN,
  GOOGLE_DRIVE_FOLDER_ID,
};
for (const [name, value] of Object.entries(REQUIRED_ENV)) {
  if (!value) {
    console.error(`FATAL: ${name} environment variable is not set. Refusing to start.`);
    process.exit(1);
  }
}

function ensureLogFile() {
  try {
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, "");
  } catch (e) {
    console.error(`Warning: could not create log file at ${LOG_FILE}: ${e.message}`);
  }
}
ensureLogFile();

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trimEnd());
  try {
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (e) {
    // Logging must never take down the server — swallow write errors.
  }
}

const { getKuralBundle } = createKuralBundleLoader(REPO_PATH);
const sharedPrompts = loadSharedPrompts(REPO_PATH);
const stateIndex = createStateIndex(STUDIO_INDEX_PATH);
const gemini = createGeminiClient({ apiKey: GEMINI_API_KEY, model: GEMINI_IMAGE_MODEL || undefined });
const drive = createDriveClient({
  clientId: GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  refreshToken: GOOGLE_OAUTH_REFRESH_TOKEN,
  rootFolderId: GOOGLE_DRIVE_FOLDER_ID,
});

// Guards against a double-click firing two generations for the same kural/kind at once.
const inFlight = new Set();

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  log(`${req.method} ${req.url}`);
  next();
});

function readKuralIdParam(req, res) {
  const n = parseKuralId(req.params.kuralId);
  if (n === null) {
    res.status(400).json({ success: false, error: "Invalid kural id — expected TK-0001 format" });
    return null;
  }
  return n;
}

app.get("/studio/status/:kuralId", (req, res) => {
  const n = readKuralIdParam(req, res);
  if (n === null) return;
  const id = kuralId(n);
  const bundle = getKuralBundle(n);
  const entry = stateIndex.getEntry(id);
  res.json({
    kuralId: id,
    available: bundle.available,
    character: entry.character || { status: "none" },
    scene: entry.scene || { status: "none" },
  });
});

async function handleGenerate(kind, req, res) {
  const n = readKuralIdParam(req, res);
  if (n === null) return;
  const id = kuralId(n);
  const bundle = getKuralBundle(n);

  if (!bundle.available) {
    res.status(409).json({ success: false, available: false, error: `No script/scene data for ${id} yet` });
    return;
  }

  const flightKey = `${id}:${kind}`;
  if (inFlight.has(flightKey)) {
    res.status(202).json({ success: true, status: "processing", kuralId: id, kind });
    return;
  }

  const prompt = kind === "character" ? buildCharacterPrompt(bundle, sharedPrompts) : buildScenePrompt(bundle, sharedPrompts);
  if (!prompt) {
    res.status(422).json({ success: false, error: `Could not build a ${kind} prompt for ${id}` });
    return;
  }

  inFlight.add(flightKey);
  stateIndex.setResult(id, kind, { status: "processing", prompt, generatedAt: null });

  try {
    log(`Generating ${kind} image for ${id}`);
    const { buffer, mimeType } = await gemini.generateImage(prompt);
    const { fileId, folderId } = await drive.uploadImage(id, kind, buffer, mimeType);
    stateIndex.setFolderId(id, folderId);
    stateIndex.setResult(id, kind, {
      status: "completed",
      driveFileId: fileId,
      mimeType,
      prompt,
      generatedAt: new Date().toISOString(),
    });
    log(`Generated ${kind} image for ${id} -> Drive file ${fileId}`);
    res.json({ success: true, status: "completed", kuralId: id, kind, url: `/studio/image/${id}/${kind}` });
  } catch (err) {
    log(`Generation failed for ${id} (${kind}): ${err.message}`);
    stateIndex.setResult(id, kind, { status: "error", error: err.message, prompt, generatedAt: new Date().toISOString() });
    res.status(502).json({ success: false, error: "Image generation failed", detail: err.message });
  } finally {
    inFlight.delete(flightKey);
  }
}

app.post("/studio/generate/character/:kuralId", (req, res) => handleGenerate("character", req, res));
app.post("/studio/generate/scene/:kuralId", (req, res) => handleGenerate("scene", req, res));

app.get("/studio/image/:kuralId/:kind", async (req, res) => {
  const n = readKuralIdParam(req, res);
  if (n === null) return;
  const { kind } = req.params;
  if (kind !== "character" && kind !== "scene") {
    res.status(400).json({ success: false, error: "kind must be 'character' or 'scene'" });
    return;
  }
  const id = kuralId(n);
  const entry = stateIndex.getEntry(id);
  const record = entry[kind];
  if (!record || record.status !== "completed" || !record.driveFileId) {
    res.status(404).json({ success: false, error: `No completed ${kind} image for ${id}` });
    return;
  }
  try {
    await drive.streamImage(record.driveFileId, res);
  } catch (err) {
    log(`Failed to stream ${kind} image for ${id}: ${err.message}`);
    if (!res.headersSent) res.status(502).json({ success: false, error: "Failed to fetch image from Drive" });
  }
});

// Health check endpoint (same shape as deploy-webhook.js's). Registered at
// both paths: /health for direct port access (curl :3700/health), and
// /studio/health because nginx's /studio/ location forwards the full
// original URI to this service (see nginx.conf) rather than stripping the
// prefix — mirrors how /studio/status/... etc. are registered.
function healthCheck(req, res) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
app.get("/health", healthCheck);
app.get("/studio/health", healthCheck);

// 404 catch-all (registered after all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

// Global Express error handler
app.use((err, req, res, _next) => {
  log(`Unhandled error: ${err.message}`);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Catch process-level failures so the server stays observable.
process.on("unhandledRejection", (reason) => {
  log(`Unhandled promise rejection: ${reason}`);
});
process.on("uncaughtException", (err) => {
  log(`Uncaught exception: ${err.message}`);
});

const server = app.listen(PORT, () => {
  log(`Kural Studio server listening on port ${server.address().port}`);
});

module.exports = { app, server };
