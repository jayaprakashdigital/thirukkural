const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");

// studio-server.js fails fast if these are missing (mirrors WEBHOOK_SECRET
// in deploy-webhook.js). Dummy values are fine here — /health and
// /studio/status never touch Gemini or Drive, so no real network call
// happens in this test file.
process.env.GEMINI_API_KEY = "test-gemini-key";
process.env.GOOGLE_OAUTH_CLIENT_ID = "test-client-id";
process.env.GOOGLE_OAUTH_CLIENT_SECRET = "test-client-secret";
process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "test-refresh-token";
process.env.GOOGLE_DRIVE_FOLDER_ID = "test-root-folder";
process.env.PORT = "0";
process.env.STUDIO_INDEX_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "studio-server-test-")), "studio-index.json");
process.env.LOG_FILE = path.join(os.tmpdir(), "studio-server-test.log");

let baseUrl;
let server;

before(() => {
  ({ server } = require("../studio-server.js"));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

test("GET /health returns ok", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("GET /studio/health returns ok (nginx forwards the full /studio/... path)", async () => {
  const res = await fetch(`${baseUrl}/studio/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("GET /studio/status/:kuralId rejects a malformed id", async () => {
  const res = await fetch(`${baseUrl}/studio/status/nonsense`);
  assert.equal(res.status, 400);
});

test("GET /studio/status/:kuralId returns available:true with no records yet for an MVP kural", async () => {
  const res = await fetch(`${baseUrl}/studio/status/TK-0001`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.kuralId, "TK-0001");
  assert.equal(body.available, true);
  assert.equal(body.character.status, "none");
  assert.equal(body.scene.status, "none");
});

test("GET /studio/status/:kuralId returns available:false for a kural outside the MVP script range", async () => {
  const res = await fetch(`${baseUrl}/studio/status/TK-0100`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.available, false);
});

test("POST /studio/generate/character/:kuralId returns 409 for a kural with no script data (no network call made)", async () => {
  const res = await fetch(`${baseUrl}/studio/generate/character/TK-0100`, { method: "POST" });
  assert.equal(res.status, 409);
  const body = await res.json();
  assert.equal(body.available, false);
});

test("GET /studio/image/:kuralId/:kind 404s when nothing has been generated yet", async () => {
  const res = await fetch(`${baseUrl}/studio/image/TK-0002/character`);
  assert.equal(res.status, 404);
});

test("GET /studio/image/:kuralId/:kind rejects an invalid kind", async () => {
  const res = await fetch(`${baseUrl}/studio/image/TK-0001/poster`);
  assert.equal(res.status, 400);
});

test("unknown routes 404 as JSON", async () => {
  const res = await fetch(`${baseUrl}/nope`);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.success, false);
});
