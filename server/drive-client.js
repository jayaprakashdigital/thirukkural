/**
 * Kural Studio — Google Drive storage client.
 * OAuth2 refresh-token flow against the user's own Drive (not a service
 * account — a service account has its own separate Drive). Images are
 * uploaded under <rootFolderId>/Kural Studio/<kuralId>/{character,scene}.png
 * and read back only through streamImage() — the browser never receives a
 * Drive link or OAuth token directly (see studio-server.js's /studio/image
 * route), which is what makes "Drive, not a CDN" an acceptable tradeoff.
 *
 * driveApi is injectable so tests can stub the network entirely.
 */
const { google } = require("googleapis");
const { Readable } = require("stream");

const STUDIO_FOLDER_NAME = "Kural Studio";

function escapeDriveQueryValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function createOAuth2Client({ clientId, clientSecret, refreshToken }) {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

function createDriveClient({ clientId, clientSecret, refreshToken, rootFolderId, driveApi }) {
  if (!rootFolderId) throw new Error("createDriveClient: rootFolderId is required");
  const drive = driveApi || google.drive({ version: "v3", auth: createOAuth2Client({ clientId, clientSecret, refreshToken }) });

  const folderCache = new Map();

  async function findOrCreateFolder(name, parentId) {
    const cacheKey = parentId + "/" + name;
    if (folderCache.has(cacheKey)) return folderCache.get(cacheKey);

    const q =
      `name='${escapeDriveQueryValue(name)}' and '${parentId}' in parents ` +
      `and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const list = await drive.files.list({ q, fields: "files(id,name)", spaces: "drive" });

    let folderId;
    if (list.data.files && list.data.files.length > 0) {
      folderId = list.data.files[0].id;
    } else {
      const created = await drive.files.create({
        requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: [parentId] },
        fields: "id",
      });
      folderId = created.data.id;
    }
    folderCache.set(cacheKey, folderId);
    return folderId;
  }

  async function getKuralFolderId(kuralId) {
    const studioFolderId = await findOrCreateFolder(STUDIO_FOLDER_NAME, rootFolderId);
    return findOrCreateFolder(kuralId, studioFolderId);
  }

  /**
   * Uploads (or overwrites, on regenerate) the image for a kural/kind.
   * @returns {Promise<{ fileId: string, folderId: string }>}
   */
  async function uploadImage(kuralId, kind, buffer, mimeType) {
    const folderId = await getKuralFolderId(kuralId);
    const ext = mimeType && mimeType.includes("jpeg") ? "jpg" : "png";
    const filename = `${kind}.${ext}`;
    const media = { mimeType: mimeType || "image/png", body: Readable.from(buffer) };

    const existing = await drive.files.list({
      q: `name='${escapeDriveQueryValue(filename)}' and '${folderId}' in parents and trashed=false`,
      fields: "files(id)",
    });

    if (existing.data.files && existing.data.files.length > 0) {
      const fileId = existing.data.files[0].id;
      await drive.files.update({ fileId, media });
      return { fileId, folderId };
    }

    const created = await drive.files.create({
      requestBody: { name: filename, parents: [folderId] },
      media,
      fields: "id",
    });
    return { fileId: created.data.id, folderId };
  }

  /** Streams a Drive file's bytes into an Express response (proxy read-back). */
  async function streamImage(fileId, res) {
    const meta = await drive.files.get({ fileId, fields: "mimeType" });
    res.setHeader("Content-Type", meta.data.mimeType || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    const download = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
    download.data.pipe(res);
  }

  return { findOrCreateFolder, getKuralFolderId, uploadImage, streamImage };
}

module.exports = { createDriveClient, createOAuth2Client, escapeDriveQueryValue, STUDIO_FOLDER_NAME };
