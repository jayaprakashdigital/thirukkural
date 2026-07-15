const { test } = require("node:test");
const assert = require("node:assert/strict");
const { PassThrough, Readable } = require("stream");
const { createDriveClient, escapeDriveQueryValue } = require("../server/drive-client.js");

function makeFakeDriveApi({ existingFolders = {}, existingFiles = {} } = {}) {
  let nextId = 1;
  const created = [];
  const updated = [];

  const driveApi = {
    files: {
      async list({ q }) {
        // Folder lookups query for mimeType=folder; file lookups don't.
        const isFolderQuery = q.includes("application/vnd.google-apps.folder");
        const nameMatch = /name='([^']*)'/.exec(q);
        const name = nameMatch ? nameMatch[1] : "";
        if (isFolderQuery) {
          const id = existingFolders[name];
          return { data: { files: id ? [{ id, name }] : [] } };
        }
        const id = existingFiles[name];
        return { data: { files: id ? [{ id }] : [] } };
      },
      async create({ requestBody, media }) {
        const id = "new-" + nextId++;
        created.push({ id, requestBody, media });
        return { data: { id } };
      },
      async update({ fileId, media }) {
        updated.push({ fileId, media });
        return { data: { id: fileId } };
      },
      async get({ fileId, alt }) {
        if (alt === "media") {
          return { data: Readable.from(Buffer.from("bytes-for-" + fileId)) };
        }
        return { data: { mimeType: "image/png" } };
      },
    },
  };

  return { driveApi, created, updated };
}

test("escapeDriveQueryValue escapes single quotes", () => {
  assert.equal(escapeDriveQueryValue("TK-0001"), "TK-0001");
  assert.equal(escapeDriveQueryValue("O'Brien"), "O\\'Brien");
});

test("getKuralFolderId creates 'Kural Studio' and the per-kural folder when neither exists", async () => {
  const { driveApi, created } = makeFakeDriveApi();
  const client = createDriveClient({ rootFolderId: "root-1", driveApi });

  const folderId = await client.getKuralFolderId("TK-0001");

  assert.equal(created.length, 2);
  assert.equal(created[0].requestBody.name, "Kural Studio");
  assert.equal(created[0].requestBody.parents[0], "root-1");
  assert.equal(created[1].requestBody.name, "TK-0001");
  assert.equal(folderId, created[1].id);
});

test("getKuralFolderId reuses existing folders instead of creating duplicates", async () => {
  const { driveApi, created } = makeFakeDriveApi({
    existingFolders: { "Kural Studio": "studio-folder", "TK-0001": "kural-folder" },
  });
  const client = createDriveClient({ rootFolderId: "root-1", driveApi });

  const folderId = await client.getKuralFolderId("TK-0001");

  assert.equal(folderId, "kural-folder");
  assert.equal(created.length, 0);
});

test("uploadImage creates a new file when none exists yet", async () => {
  const { driveApi, created } = makeFakeDriveApi();
  const client = createDriveClient({ rootFolderId: "root-1", driveApi });

  const { fileId, folderId } = await client.uploadImage("TK-0001", "character", Buffer.from("png-bytes"), "image/png");

  assert.ok(fileId);
  assert.ok(folderId);
  const fileCreate = created.find((c) => c.requestBody.name === "character.png");
  assert.ok(fileCreate, "should have created character.png");
});

test("uploadImage overwrites (update) an existing file on regenerate", async () => {
  const { driveApi, created, updated } = makeFakeDriveApi({
    existingFolders: { "Kural Studio": "studio-folder", "TK-0001": "kural-folder" },
    existingFiles: { "scene.png": "existing-scene-file" },
  });
  const client = createDriveClient({ rootFolderId: "root-1", driveApi });

  const { fileId } = await client.uploadImage("TK-0001", "scene", Buffer.from("new-bytes"), "image/png");

  assert.equal(fileId, "existing-scene-file");
  assert.equal(updated.length, 1);
  assert.equal(updated[0].fileId, "existing-scene-file");
  assert.equal(created.length, 0, "should not create a duplicate file");
});

test("streamImage sets headers and pipes the file bytes to the response", async () => {
  const { driveApi } = makeFakeDriveApi();
  const client = createDriveClient({ rootFolderId: "root-1", driveApi });

  const res = new PassThrough();
  const headers = {};
  res.setHeader = (k, v) => { headers[k] = v; };

  const chunks = [];
  res.on("data", (c) => chunks.push(c));
  const done = new Promise((resolve) => res.on("end", resolve));

  await client.streamImage("some-file-id", res);
  await done;

  assert.equal(headers["Content-Type"], "image/png");
  assert.ok(headers["Cache-Control"].includes("max-age"));
  assert.equal(Buffer.concat(chunks).toString(), "bytes-for-some-file-id");
});
