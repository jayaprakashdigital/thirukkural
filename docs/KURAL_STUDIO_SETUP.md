# Kural Studio Setup — AI Image Generation + Google Drive Storage

Kural Studio (`kural-detail.html`, backed by `studio-server.js`) generates a
"final character image" and a "scene image" per kural using Gemini, and
stores them in **your own Google Drive** instead of the VPS disk. This doc
walks through the one-time setup. None of these credentials can be created
or obtained by an AI agent — they require you to sign in to your own Google
account.

Scope today: image generation only works for kurals that have script/scene
data, currently **TK-0001 through TK-0010** (see `js/scripts-data.js`). Other
kurals show kural text, story, and characters, but the "Generate" buttons are
disabled with a "not available yet" message.

## Why Google Drive, and what that trades off

Drive is not a CDN — hotlinking files straight from Drive to site visitors is
slow and Google has clamped down on the old `uc?export=view` tricks people
used for that. Kural Studio avoids that problem: the browser never talks to
Drive directly. `studio-server.js` holds the Drive credentials and **proxies**
image bytes through `/studio/image/:kuralId/:kind` — the browser only ever
requests your own domain. That's what makes storing on Drive (instead of a
purpose-built object store + CDN) an acceptable choice at this scale.

## 1. Get a Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and sign in.
2. Create an API key.
3. Set it as `GEMINI_API_KEY` in your `.env` (see `.env.example`).

The default model, `GEMINI_IMAGE_MODEL=gemini-2.5-flash-image`, is Google's
current low-cost image-generation model. Override the env var if Google
renames or replaces it later — `studio-server.js` doesn't need a code change.

## 2. Create an OAuth 2.0 Client for Drive

Kural Studio writes to **your own Drive account**, not a service account's
separate Drive — that requires an OAuth2 client + a one-time consent flow,
not a service account key.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or reuse one) and enable the **Google Drive API**
   (APIs & Services → Library → search "Google Drive API" → Enable).
3. Go to APIs & Services → Credentials → **Create Credentials** → **OAuth
   client ID**.
   - If prompted, configure the OAuth consent screen first — "External" user
     type is fine for personal use; you don't need to submit it for
     verification since only you will use it.
   - Application type: **Desktop app**.
4. Copy the generated **Client ID** and **Client Secret**.
5. Set them as `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` in
   your `.env`.

## 3. Get a refresh token (one-time, run locally)

Run this on your own machine — never inside the VPS container, and never
commit the output anywhere:

```bash
npm install   # if you haven't already, so googleapis is available
GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_CLIENT_SECRET=... node server/get-refresh-token.js
```

The script prints a Google consent URL. Open it, sign in with the Google
account whose Drive you want images stored in, and approve the
`drive.file` scope (this scope only lets the app see/manage files **it**
creates — not your whole Drive). Google shows you an authorization code;
paste it back into the terminal. The script prints:

```
GOOGLE_OAUTH_REFRESH_TOKEN=1//0g...
```

Set that in your VPS `.env`. You only need to do this once — refresh tokens
don't expire from normal use (only if you revoke access, change your Google
password, or leave the OAuth client unused for 6 months as a "testing" app).

## 4. Pick (or create) a Drive folder

1. In Google Drive, create a folder (e.g. "Thirukkural") or pick an existing
   one, wherever you'd like generated images archived.
2. Open it and copy the folder id from the URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART`**
3. Set it as `GOOGLE_DRIVE_FOLDER_ID` in your `.env`.

Kural Studio creates a `Kural Studio/<kural id>/{character,scene}.png`
structure inside that folder automatically — you don't need to create the
subfolders yourself.

## 5. Run the service

**Docker Compose** (recommended — see root `docker-compose.yml`):

```bash
cp .env.example .env   # fill in WEBHOOK_SECRET + the 6 vars above
docker compose up -d --build
```

This starts a third `studio` container (Kural Studio API on :3700 internally,
reverse-proxied at `/studio/*` by nginx) alongside the existing `web` and
`webhook` containers.

**Bare-metal / PM2** (matching the pattern in `VPS_DEPLOYMENT_GUIDE.md`):

```bash
pm2 start studio-server.js --name "thirukkural-studio" \
  --env production
pm2 save
```
(Export the same env vars in your shell profile or a `.env`-loading wrapper
first — `studio-server.js` fails fast at boot if any are missing, the same
way `deploy-webhook.js` does for `WEBHOOK_SECRET`.)

## 6. Verify

- `curl http://localhost:3700/health` (or `https://<your-domain>/studio/…`
  through nginx) → `{"status":"ok",...}`.
- Open `kural-detail.html?id=TK-0001`, click **Generate Character Image** —
  the status pill should go to "Generating…" then "Completed" and the image
  should appear, sourced from `/studio/image/TK-0001/character`.
- Check your Drive folder — you should see `Kural Studio/TK-0001/character.png`.

## Troubleshooting

- **Service exits immediately with `FATAL: ... is not set`** — one of the six
  required env vars is missing; check `.env` against `.env.example`.
- **"No refresh_token was returned" from `get-refresh-token.js`** — this
  Google account already granted this OAuth client consent before, and
  Google only returns a refresh token on first consent. Revoke access at
  https://myaccount.google.com/permissions and re-run the script.
- **404 from `/studio/image/...`** — that image hasn't been generated yet
  (or generation failed) for that kural/kind; check `GET /studio/status/:id`.
- **`docker compose config` complains a var "must be set in .env"** — same
  fail-fast behavior as `WEBHOOK_SECRET`; fill in `.env` and re-run.
