# Thirukkural Portal

A digital home for the **Tirukkuṟaḷ** (திருக்குறள்) — 1,330 timeless Tamil couplets on virtue, wealth, and love, authored by the sage **Thiruvalluvar** over two millennia ago. This repo provides the Thirukkural as structured JSON, alongside a static web portal for browsing kurals, stories, characters, prompts, media, and an admin dashboard.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker](#docker)
- [Usage](#usage)
- [Data Files](#data-files)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Thirukkural is a classic Tamil Sangam literature work divided into 1,330 couplets (kurals) across three main sections — **Aram** (virtue), **Porul** (wealth), and **Kamam** (love). This project makes the couplets available as JSON and provides a rich, browser-based studio for exploring and producing content around each kural.

## Features

- **Kural Database** (`kurals.html`) — Browse, search, and filter all 1,330 kurals with section/chapter metadata.
- **Stories** (`stories.html`) — Narrative adaptations of kurals.
- **Characters** (`characters.html`, `characters-table.html`) — Character library for productions.
- **Prompts** (`prompts.html`) — AI prompt library for image/video generation.
- **Script Detail** (`script-detail.html`) — Scene-based script editor per kural.
- **Media Libraries** (`images.html`, `videos.html`) — Image and video library tracking.
- **Socials** (`socials.html`) — Social post scheduling.
- **Admin Dashboard** (`dashboard.html`) — Overview of production status across modules.
- **Webhook Deployment** (`deploy-webhook.js`) — Auto-deploy on every push to `master`.
- **Docker Stack** — nginx + Node webhook receiver via `docker-compose.yml`.

## Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| Frontend     | Static HTML5, CSS3, vanilla JavaScript (ES2022) |
| Fonts        | Google Fonts (DM Sans, Noto Sans Tamil, Playfair Display) |
| Webhook      | Node.js 20, Express                          |
| Web Server   | nginx (alpine)                               |
| Container    | Docker, Docker Compose                       |
| CI/CD        | GitHub Actions                               |
| Process Mgr  | PM2 (recommended for bare-metal VPS)         |

## Project Structure

```
thirukkural/
├── index.html              # Landing page
├── kurals.html             # Kural database browser
├── dashboard.html          # Admin dashboard
├── stories.html            # Stories module
├── characters.html         # Character library (cards)
├── characters-table.html   # Character library (table)
├── prompts.html            # AI prompts library
├── script-detail.html      # Scene-based script editor
├── images.html             # Image library
├── videos.html             # Video library
├── socials.html            # Social posts
├── css/                    # Per-page + shared stylesheets
├── js/                     # Page scripts + data modules
│   ├── shared.js           # Theme, toast, sidebar helpers (DRY)
│   ├── nav.js              # Navigation bootstrap
│   ├── kurals.js           # Kural DB logic
│   ├── dashboard.js        # Dashboard logic
│   ├── stories.js          # Stories data + render
│   ├── characters*.js      # Character library
│   ├── prompts*.js         # Prompt library
│   ├── script-detail.js    # Scene editor
│   ├── socials.js          # Social posts
│   └── media-data.js       # Shared media metadata
├── thirukkural.json        # All 1330 kurals (primary dataset)
├── detail.json             # Chapter/group/section metadata
├── all_stories_final.json  # Story adaptations
├── deploy-webhook.js       # GitHub webhook receiver
├── Dockerfile              # Webhook image
├── docker-compose.yml      # web (nginx) + webhook stack
├── nginx.conf              # Site + webhook reverse-proxy config
├── start-server.bat        # Windows local dev server
├── .github/workflows/ci.yml# Lint, test, validate, deploy
└── docs/                   # Architecture, project, standards
```

## Getting Started

### Prerequisites

- **Node.js 20+** (only needed for the webhook server)
- **Python 3** (for the simple local dev server) — _or_ any static file server
- **Docker & Docker Compose** (for the containerized stack)

### Local Development

The site is fully static — serve the root folder with any HTTP server.

**Windows (one-click):**
```bat
start-server.bat
```
This script locates a free port (8080, 5500, 3000, …), starts `python -m http.server`, and opens the browser.

**Any OS — Python:**
```bash
python -m http.server 8080
# open http://localhost:8080/
```

**Any OS — Node:**
```bash
npx serve .    # or: npx http-server -p 8080
```

### Docker

```bash
# 1. Configure secrets
cp .env.example .env
#   then edit .env and set WEBHOOK_SECRET

# 2. Build and run
docker compose up -d --build
```

This starts:
- `web` (nginx:alpine) on **port 80** — serves the static site and reverse-proxies `/webhook/*` and `/health` to the webhook service.
- `webhook` (Node 20) on **port 3600** — receives GitHub push events and deploys.

## Usage

| URL                                  | Page                  |
|--------------------------------------|-----------------------|
| `/`                                  | Home / Kural of the day |
| `/kurals.html`                       | Kural database        |
| `/dashboard.html`                     | Admin dashboard       |
| `/stories.html`                       | Stories               |
| `/characters.html`                    | Characters (cards)    |
| `/characters-table.html`              | Characters (table)    |
| `/prompts.html`                       | AI prompts            |
| `/script-detail.html`                 | Script scene editor   |
| `/images.html`                        | Image library         |
| `/videos.html`                        | Video library         |
| `/socials.html`                       | Social posts          |
| `http://<host>:3600/health`           | Webhook health check  |

**Theme toggle** is available in the navbar; the preference is stored under the `thirukkural-theme` localStorage key (see `js/shared.js`).

## Data Files

- **`thirukkural.json`** (~2.3 MB) — Primary dataset: all 1,330 kurals with Tamil text, transliteration, and translations.
- **`detail.json`** (~50 KB) — Chapter (Adhigaram), chapter-group (Iyal), and section (Paal) metadata.
- **`all_stories_final.json`** (~2.5 MB) — Narrative adaptations of kurals.

## Deployment

The repo auto-deploys to the VPS on every push to `master` via a GitHub webhook + `deploy-webhook.js`. See:
- `QUICK_SETUP.md` — 15-minute VPS setup.
- `VPS_DEPLOYMENT_GUIDE.md` — Full deployment walkthrough (SSH, PM2, nginx, firewall, GitHub webhook).
- `.github/workflows/ci.yml` — CI pipeline (lint, test, validate infra, trigger VPS webhook).

## Testing

```bash
npm test          # node --test (built-in test runner)
```

CI also runs:
- `node --check deploy-webhook.js` — syntax check on the webhook server.
- `docker compose config` validation and a `Dockerfile` build.

## Contributing

Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** before opening a pull request, and review the coding standards in `docs/CODING_STANDARDS.md`.

## License

See [LICENSE](LICENSE) for the project's license terms.
