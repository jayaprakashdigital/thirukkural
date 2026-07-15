/**
 * Kural Studio — Gemini image generation client.
 * Uses the Gemini API's generateContent endpoint with an image-output model
 * (default: gemini-2.5-flash-image). Auth is a plain API key (no OAuth/service
 * account needed for this half of the pipeline — Drive is the other half).
 *
 * fetchImpl is injectable so tests can stub the network call.
 */
const DEFAULT_MODEL = "gemini-2.5-flash-image";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function createGeminiClient({ apiKey, model, fetchImpl }) {
  if (!apiKey) throw new Error("createGeminiClient: apiKey is required");
  const resolvedModel = model || DEFAULT_MODEL;
  const doFetch = fetchImpl || fetch;

  /**
   * @param {string} prompt
   * @returns {Promise<{ buffer: Buffer, mimeType: string }>}
   */
  async function generateImage(prompt) {
    if (!prompt) throw new Error("generateImage: prompt is required");

    const url = `${API_BASE}/${resolvedModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await doFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => "");
      throw new Error(`Gemini image generation failed (${res.status}): ${bodyText.slice(0, 500)}`);
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData || p.inline_data);
    const inline = imagePart && (imagePart.inlineData || imagePart.inline_data);

    if (!inline || !inline.data) {
      throw new Error("Gemini response did not contain an inline image part");
    }

    return {
      buffer: Buffer.from(inline.data, "base64"),
      mimeType: inline.mimeType || inline.mime_type || "image/png",
    };
  }

  return { generateImage, model: resolvedModel };
}

module.exports = { createGeminiClient, DEFAULT_MODEL };
