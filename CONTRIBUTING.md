# Contributing to Thirukkural Portal

Thank you for your interest in contributing! This guide covers everything you need to get changes merged.

## Code of Conduct

Be respectful and constructive. Disrespectful, harassing, or discriminatory behavior will not be tolerated. We are stewards of a classic Tamil literary work — please be culturally respectful in all discussions and content (see `docs/AI_CONTEXT.md` for domain guidance).

## Ways to Contribute

- **Content** — add narratives, character details, or translations to the JSON datasets.
- **Features** — new pages, modules, or improvements to existing ones.
- **Bug fixes** — see [Issues](https://github.com/jayaprakashdigital/thirukkural/issues).
- **Docs** — improvements to README, `docs/`, or in-code JSDoc.
- **Infra** — Docker, nginx, CI, and webhook improvements.

## Prerequisites

- **Node.js 20+** (for the webhook server and tests)
- **Python 3** (for the local static server) _or_ any static file server
- **Git**
- **Docker & Docker Compose** (only if touching infra)

## Setup

```bash
# 1. Fork & clone
git clone https://github.com/<your-username>/thirukkural.git
cd thirukkural

# 2. Install dependencies
npm install

# 3. Start a local server
python -m http.server 8080
#   Windows: just run start-server.bat
#   open http://localhost:8080/
```

## Development Workflow

1. **Create a branch** from `master`:
   ```bash
   git checkout -b feat/your-feature
   ```
2. **Make changes.** Keep commits atomic and focused.
3. **Test locally.**
   ```bash
   npm test                       # node --test
   node --check deploy-webhook.js # syntax check the webhook server
   ```
4. **If touching infra,** validate:
   ```bash
   docker compose config          # validate docker-compose.yml
   docker build -t thirukkural-webhook:ci .  # validate Dockerfile
   ```
5. **Push and open a Pull Request** against `master`.

## Branch Naming

Follow the prefixes below (matches the project's Git conventions):

| Prefix      | Use for                              |
|-------------|--------------------------------------|
| `feat/`     | New feature                          |
| `fix/`      | Bug fix                              |
| `refactor/` | Code restructuring, no behavior change |
| `test/`     | Test additions/improvements          |
| `docs/`     | Documentation only                   |
| `chore/`    | Tooling, deps, configs               |
| `perf/`     | Performance improvements             |

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short imperative description

optional body explaining why
```

Examples:
```
feat(kurals): add section filter dropdown
fix(webhook): verify HMAC before reading body
docs(readme): add architecture section
chore(deps): bump jsdom to 29.1.1
```

Reference issues when relevant: `Fix #123: kural search returns no results`.

## Coding Standards

See [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md) for the full guide. Highlights:

### JavaScript / CSS / HTML
- Prefer `const` over `let`, never `var`.
- `async/await` over raw promises.
- Named exports over default exports.
- Arrow functions for callbacks; function declarations for top-level.
- Template literals over string concatenation.
- 2-space indentation, semicolons always, double quotes in JSX / single quotes in JS strings.
- Comments explain **why**, not **what** — and stay in sync with the code.

### Naming Conventions
| Element          | Convention     | Example         |
|------------------|----------------|-----------------|
| Files            | kebab-case     | `user-profile.js` |
| Functions/vars   | camelCase      | `getKuralById`  |
| Constants        | UPPER_SNAKE    | `MAX_RETRY_COUNT` |
| CSS classes      | kebab-case     | `.nav-link`     |
| IDs (HTML)       | kebab-case     | `#spotlight`    |

### Shared Helpers
Before introducing a new utility, check `js/shared.js` — theme, toast, sidebar, escaping, and named constants already live there (DRY). Page scripts assume `shared.js` is loaded first.

## Testing

- **Unit:** `npm test` runs the Node built-in test runner (`node --test`).
- **Syntax:** `node --check deploy-webhook.js` for the webhook server.
- **CI:** GitHub Actions runs lint/test + infra validation on every push and PR. Your PR must pass CI to merge.
- When adding a feature, add or update tests alongside it. Aim for >80% coverage on critical paths.

## Pull Requests

- Open against `master`.
- Title: imperative, Conventional Commits style (e.g. `feat(kurals): add section filter`).
- Description should cover:
  - What changed and why.
  - How to test it.
  - Related issue(s) (e.g. `Closes #42`).
  - Screenshots for any UI change.
- **Self-review** before requesting review.
- Keep PRs small and focused — one logical change per PR.

## Review Checklist (Reviewers)

- [ ] Correctness — no obvious bugs.
- [ ] Readability — clear and maintainable.
- [ ] Performance — no obvious regressions.
- [ ] Security — no secrets, input validated, no injection vectors.
- [ ] Tests — adequate coverage, passing.
- [ ] Standards — follows naming/formatting conventions.
- [ ] Cultural respect — content honors the Thirukkural and Tamil culture.

## Security

- **Never commit secrets.** API keys, webhook secrets, and passwords go in environment variables (see `.env.example`).
- `.env` is gitignored — do not remove it from `.gitignore`.
- The webhook server validates HMAC signatures before acting — preserve this when modifying it.
- Validate all inputs on entry points; use parameterized queries if you add a DB.

## Content Contributions (JSON data)

When editing `thirukkural.json`, `detail.json`, or `all_stories_final.json`:
- Preserve the existing schema and key ordering.
- Validate JSON: `node -e "JSON.parse(require('fs').readFileSync('thirukkural.json'))"`.
- Do not alter the original kural Tamil text or numbering.
- For narrative/story content, follow the cultural guidance in `docs/AI_CONTEXT.md`.

## Reporting Bugs

Open an issue with:
- Steps to reproduce.
- Expected vs. actual behavior.
- Browser/OS and version.
- Screenshots or console errors if available.

## Questions?

- Issues: https://github.com/jayaprakashdigital/thirukkural/issues
- Domain context: `docs/AI_CONTEXT.md`
- Architecture: `docs/ARCHITECTURE_OVERVIEW.md` and `docs/ARCHITECTURE.md`

Thank you for helping preserve and share the Thirukkural!
