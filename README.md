# cv_download

Fastify API that generates Ricardo Arturo Zermeño Saracho's CV as a PDF on demand using
[pdfmake](https://github.com/bpampuch/pdfmake), for the "Download CV" button on the
[razs.dev](https://razs.dev) portfolio.

Every response is built in memory at request time — there are no pre-rendered PDF files on
disk.

## Requirements

- Node.js 24+
- npm

## Install

```bash
npm install
```

## Run

```bash
npm start
```

The server listens on `HOST` (default `127.0.0.1`) and `PORT` (default `8421`), both
overridable via environment variables.

## Endpoints

- `GET /cv` — the generic CV (`src/content/base/`), served as
  `attachment; filename="Ricardo-Zermeno-CV.pdf"`.
- `GET /{slug}` — one route per tailored CV variant under `src/content/`, auto-registered at
  startup from the directories present there (see [Content/tailoring system](#contenttailoring-system)
  below). Served as `attachment; filename="Ricardo_Zermeno_CV_{slug}.pdf"`.

All routes are `GET`-only and CORS-restricted to `https://razs.dev` and
`http://localhost:5173` (see `src/server.js`).

## Project structure

```
src/
  server.js          Fastify server: registers /cv plus one route per content/ directory
  cv-content.js       buildCvDocDefinition(content) — wires content into pdfmake sections
  styles.js           Shared pdfmake styles
  sections/           Pure pdfmake rendering logic, one file per CV section
  content/
    index.js          loadContent(slug) / listContentSlugs() — content resolution & merging
    base/             Source of truth: Ricardo's real experience, one file per section
    <slug>/            Per-job overrides (e.g. skills.js, summary.js) layered on top of base/
```

## Content/tailoring system

A single CV generator serves many tailored variants without duplicating Ricardo's real
experience:

- `src/content/base/` holds the ground truth (header, summary, skills, experience, projects,
  education, certifications, languages).
- `src/content/<slug>/` holds job-specific overrides — only the sections that differ from
  `base/` (typically `header.js` for the title, plus `summary.js`, `skills.js`, `projects.js`).
  Anything not overridden falls back to `base/`.
- `loadContent(slug)` merges the two, and `listContentSlugs()` drives automatic route
  registration — creating a new `src/content/<slug>/` directory is enough to expose a new
  `GET /{slug}` route; `server.js` never needs to be edited by hand.

See `CLAUDE.md` / `AGENTS.md` for the full tailoring rules (what may and may not change per
job) and the workflow for generating new variants from a job listing.

## Deployment

Runs under `pm2` via `ecosystem.config.cjs` and is exposed through a Cloudflare Tunnel. See
`CLAUDE.md` / `AGENTS.md` for infra conventions (port/subdomain allocation, tunnel restart,
GitHub Actions runner).

## Language Policy

All repository content — code, comments, documentation, commit messages, PR descriptions,
tests, examples, configuration, and API fields — must always be written in English, regardless
of the language used in conversation while working on this project.
