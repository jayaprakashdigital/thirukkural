# Architecture Overview

This document describes the runtime architecture of the **Thirukkural Portal** at a glance. For the planned Script Module V2 redesign, see [`ARCHITECTURE.md`](ARCHITECTURE.md); for project goals and phasing, see [`PROJECT.md`](PROJECT.md).

## 1. High-Level Topology

```
            ┌────────────────────────────┐
            │      End User (Browser)    │
            └──────────────┬─────────────┘
                           │ HTTP :80
                           ▼
            ┌────────────────────────────┐
            │   nginx (nginx:alpine)     │   ← serves static HTML/CSS/JS
            │   - gzip, caching headers  │     + SPA fallback to index.html
            │   - /webhook/* → webhook   │
            │   - /health    → webhook   │
            └──────────────┬─────────────┘
                           │ internal :3600
                           ▼
            ┌────────────────────────────┐
            │  Node.js webhook receiver  │   ← deploy-webhook.js
            │  (Express, verifies HMAC)  │
            │  runs `git fetch` + reset  │
            └──────────────┬─────────────┘
                           │ git
                           ▼
            ┌────────────────────────────┐
            │   Local repo clone (/repo)  │
            │   = same files nginx serves │
            └────────────────────────────┘
                           ▲
                           │ GitHub push event
            ┌──────────────┴─────────────┐
            │   GitHub (master branch)    │
            │   + GitHub Actions CI        │
            └────────────────────────────┘
```

## 2. Components

### 2.1 Static Frontend
- Pure HTML5 pages (one per module) — no build step, no framework.
- Each page loads `css/styles.css` + a page-specific stylesheet, then `js/shared.js` (theme/toast/sidebar helpers), `js/nav.js`, and a page-specific script.
- Data is embedded/loaded from JSON files (`thirukkural.json`, `detail.json`, `all_stories_final.json`) or generated data modules under `js/` (e.g. `js/scripts-data.js`, `js/prompts-data.js`, `js/media-data.js`).

### 2.2 Webhook Deployment Server (`deploy-webhook.js`)
- Node.js + Express service that:
  1. Verifies the `X-Hub-Signature-256` HMAC using `WEBHOOK_SECRET` (never hardcoded — read from env, fails fast if missing).
  2. Confirms the event is a `push` to `master`.
  3. Runs `git fetch origin && git reset --hard origin/master` inside `REPO_PATH`.
  4. Writes a structured entry to `LOG_FILE` (default `/var/log/thirukkural-deploy.log`).
- Exposes:
  - `POST /webhook/deploy` — webhook receiver.
  - `GET /health` — liveness probe (`{"status":"ok","timestamp":...}`).
- Configuration (all via environment variables):
  | Variable         | Default                              | Purpose                          |
  |------------------|--------------------------------------|----------------------------------|
  | `WEBHOOK_SECRET` | _(none, required)_                  | GitHub webhook HMAC secret       |
  | `PORT`           | `3600`                               | HTTP listen port                 |
  | `REPO_PATH`      | `process.cwd()`                      | Path to the repo clone           |
  | `LOG_FILE`       | `/var/log/thirukkural-deploy.log`    | Deploy log path                  |

### 2.3 nginx (`nginx.conf`)
- Listens on `:80`, serves `/usr/share/nginx/html` (read-only mount of the repo).
- Reverse-proxies `/webhook/` and `/health` to `http://webhook:3600`.
- Adds gzip compression, static-asset caching (`1h`), and security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- SPA-style fallback: `try_files $uri $uri/ /index.html`.

### 2.4 CI/CD (`.github/workflows/ci.yml`)
Three jobs on push/PR to `master`:
1. **test** — `npm ci`, `node --check deploy-webhook.js`, `npm test`.
2. **validate-infra** — `docker compose config` validation + `Dockerfile` build.
3. **deploy** (master push only) — triggers the VPS webhook via `curl` using the `VPS_DEPLOY_WEBHOOK_URL` secret.

## 3. Frontend Module Map

| Page                  | Script                          | Stylesheet                  | Purpose                          |
|-----------------------|---------------------------------|-----------------------------|----------------------------------|
| `index.html`          | `js/shared.js`, `js/nav.js`     | `css/styles.css`, `css/home.css` | Home, Kural of the Day        |
| `kurals.html`         | `js/kurals.js`                  | `css/kurals.css`            | Kural database (search/filter)   |
| `dashboard.html`      | `js/dashboard.js`               | `css/dashboard.css`         | Admin overview                   |
| `stories.html`        | `js/stories.js`                 | `css/stories.css`           | Story adaptations                |
| `characters.html`     | `js/characters.js`              | `css/characters.css`        | Character cards                  |
| `characters-table.html` | `js/characters-table.js`      | `css/characters-table.css`  | Character table view             |
| `prompts.html`        | `js/prompts.js`                 | `css/prompts.css`           | AI prompt library                |
| `script-detail.html`  | `js/script-detail.js`           | `css/script-detail.css`     | Scene-based script editor        |
| `images.html`         | `js/library.js` (+ `media-data.js`) | `css/library.css`       | Image library                    |
| `videos.html`         | `js/library.js` (+ `media-data.js`) | `css/library.css`       | Video library                    |
| `socials.html`        | `js/socials.js`                  | `css/socials.css`           | Social posts                     |

### Shared Conventions
- `js/shared.js` defines named constants (e.g. `TOTAL_KURALS = 1330`, `THEME_KEY`, `MOBILE_BREAKPOINT_PX`) and helpers (`escapeHtml`, toast, theme toggle, sidebar). Page scripts depend on these being loaded first.
- `js/nav.js` bootstraps the responsive navbar and mobile toggle.
- `js/media-data.js` holds the shared media metadata used by both `images.html` and `videos.html` via `js/library.js`.

## 4. Data Flow

```
thirukkural.json ──┐
detail.json ───────┼──> fetched by page scripts ──> rendered into HTML
all_stories_final.json
js/*-data.js ──────┘   (embedded data modules for scripts/prompts/media)
```

There is no backend database in the current architecture — all data is file-based JSON / JS data modules, which is what makes the site fully static and trivially cacheable.

## 5. Security Posture

- **No secrets in code.** `WEBHOOK_SECRET` is read from the environment; the server refuses to start if it is missing.
- **HMAC verification.** Every webhook request is verified against `X-Hub-Signature-256` before any action is taken.
- **Read-only static mount.** nginx mounts the repo read-only; only the `webhook` container can mutate `/repo`.
- **Security headers** set by nginx (`nosniff`, `SAMEORIGIN`, referrer policy).
- **Input validation.** The webhook validates the event type and branch before executing `git`.

## 6. Local vs. Production

| Concern        | Local                                  | Production (VPS)                       |
|----------------|----------------------------------------|----------------------------------------|
| Static server  | `python -m http.server` / `start-server.bat` | nginx in Docker (or bare-metal nginx) |
| Webhook        | not needed                             | `deploy-webhook.js` via PM2 or Docker  |
| HTTPS          | none                                   | terminate at nginx / reverse proxy     |
| Deploy trigger | manual file edits                      | GitHub push → webhook → `git reset`    |
| Process mgmt   | foreground                             | PM2 (bare-metal) or Docker restart policy |

## 7. Extending the Architecture

- **Add a page:** create `foo.html` + `js/foo.js` + `css/foo.css`, load `js/shared.js` and `js/nav.js` first, and add a nav link in each page's `.nav-menu`.
- **Add a data source:** drop a JSON file in the root (or a `js/foo-data.js` module exporting an array) and fetch/import it from the page script.
- **Add a backend:** the webhook service is the natural place to grow a REST API — Express is already present; expose new routes and proxy them through nginx's `/webhook/` (or a new `/api/`) location block.
