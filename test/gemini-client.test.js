const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createGeminiClient, DEFAULT_MODEL } = require("../server/gemini-client.js");

function fakeFetch(responseBody, { ok = true, status = 200 } = {}) {
  return async (url, options) => {
    fakeFetch.lastUrl = url;
    fakeFetch.lastOptions = options;
    return {
      ok,
      status,
      json: async () => responseBody,
      text: async () => JSON.stringify(responseBody),
    };
  };
}

test("createGeminiClient throws without an apiKey", () => {
  assert.throws(() => createGeminiClient({}), /apiKey is required/);
});

test("generateImage posts the prompt and decodes the inline base64 image", async () => {
  const pngBase64 = Buffer.from("fake-png-bytes").toString("base64");
  const fetchImpl = fakeFetch({
    candidates: [{ content: { parts: [{ inlineData: { data: pngBase64, mimeType: "image/png" } }] } }],
  });
  const client = createGeminiClient({ apiKey: "test-key", fetchImpl });

  const result = await client.generateImage("a serene temple at dawn");

  assert.equal(client.model, DEFAULT_MODEL);
  assert.equal(result.mimeType, "image/png");
  assert.equal(result.buffer.toString(), "fake-png-bytes");
  assert.ok(fakeFetch.lastUrl.includes(DEFAULT_MODEL));
  assert.ok(fakeFetch.lastUrl.includes("key=test-key"));
  assert.equal(JSON.parse(fakeFetch.lastOptions.body).contents[0].parts[0].text, "a serene temple at dawn");
});

test("generateImage throws a descriptive error on a non-OK response", async () => {
  const fetchImpl = fakeFetch({ error: "quota exceeded" }, { ok: false, status: 429 });
  const client = createGeminiClient({ apiKey: "test-key", fetchImpl });

  await assert.rejects(() => client.generateImage("prompt"), /Gemini image generation failed \(429\)/);
});

test("generateImage throws when the response has no inline image data", async () => {
  const fetchImpl = fakeFetch({ candidates: [{ content: { parts: [{ text: "no image, sorry" }] } }] });
  const client = createGeminiClient({ apiKey: "test-key", fetchImpl });

  await assert.rejects(() => client.generateImage("prompt"), /did not contain an inline image part/);
});

test("createGeminiClient honors a custom model id", async () => {
  const fetchImpl = fakeFetch({
    candidates: [{ content: { parts: [{ inlineData: { data: "YQ==", mimeType: "image/png" } }] } }],
  });
  const client = createGeminiClient({ apiKey: "k", model: "imagen-4.0-generate-001", fetchImpl });
  await client.generateImage("prompt");
  assert.ok(fakeFetch.lastUrl.includes("imagen-4.0-generate-001"));
});
