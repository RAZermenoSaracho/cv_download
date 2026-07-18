# cv_download

Fastify API that generates Ricardo Arturo Zermeño Saracho's general CV as a PDF on demand using pdfmake, 
for the "Download CV" button on the portfolio.

## Goal
- Single endpoint: GET /cv
- Generates the PDF in memory with pdfmake and returns it as a stream/buffer
- Headers: Content-Type: application/pdf, Content-Disposition: attachment; filename="Ricardo-Zermeno-CV.pdf"

## Expected structure
- src/server.js (or index.js) — Fastify server, routing only
- src/cv-content.js — pdfmake docDefinition, fully separated from the server so the CV content can be 
  updated later without touching server logic (the CV will change as Ricardo's career evolves)

## CV content
The source content lives in the resume PDF attached to the Claude project 
(RicardoArturoZermenoSarachoResume_1.pdf) and the agreed positioning decisions:
- Title: "Software Engineer — DeFi & Quantitative Systems"
- Target roles: web3 / DeFi / quantitative trading

## Infra (same pattern as job_scraper and job_scraper_frontend)
- pm2 via ecosystem.config.cjs (CommonJS, .cjs required under Node 24)
- Self-hosted GitHub Actions runner registered specifically for this repo under ~/actions-runners/
- Before assigning a port/subdomain, check /etc/cloudflared/config.yml and existing ecosystem.config.cjs 
  files to avoid colliding with ports already in use:
  - job_scraper → 8420 → api-jobs.razs.dev
  - job_scraper_frontend → 5180 → jobs.razs.dev
- /etc/cloudflared/config.yml is root-owned: show the proposed diff, Ricardo applies it manually with sudo
- Tunnel restart: sudo launchctl kickstart -k system/com.cloudflare.cloudflared

## Conventions
- Do not include testing instructions in work prompts — Ricardo tests independently
- Show the plan (port, subdomain, folder structure) before generating code, wait for confirmation

## Content/tailoring system (per-vacante CV variants)

This is the system that lets a single prompt like "Generame versiones de mi CV
que cumplan con lo que piden los trabajos en este Excel" be executed without
re-explaining the architecture.

### Structure

- `src/content/base/` — one file per section, each exporting only data
  (arrays/objects/strings), never pdfmake markup: `header.js`, `summary.js`,
  `skills.js`, `experience.js`, `projects.js`, `education.js`,
  `certifications.js`, `languages.js`. This is the single source of truth for
  Ricardo's real experience.
- `src/content/<slug>/` — one directory per vacante, created only when
  tailoring for a specific job. Each directory may export any subset of the
  same section files; any file it doesn't export falls back to `base/`.
- `src/content/index.js` exports `loadContent(slug)`:
  - `loadContent()` or `loadContent("base")` → base content, unmodified.
  - `loadContent(slug)` for an existing `src/content/<slug>/` → merges
    file-by-file: if `<slug>/<section>.js` exists, its value is used **whole**
    (never merged field-by-field with base's value); otherwise base's value
    for that section is used.
  - `loadContent(slug)` for a slug with no matching directory → throws
    `ContentNotFoundError` (importable from the same module), which the route
    layer turns into a 404.
  - `listContentSlugs()` returns the directory names under `src/content/`
    excluding `base/` — this drives route registration.
- `src/sections/*.js` hold only pdfmake rendering logic. Every section
  function takes the section's content as its single parameter (e.g.
  `skillsSection(content.skills)`) — sections never import content directly.
- `src/cv-content.js` (`buildCvDocDefinition(content)`) wires a full content
  object into the ordered list of rendered sections.

### Slug convention

- Format: `{empresa}_{puesto_corto}`, all lowercase, snake_case.
  Example: `bitmart_on_chain_quant_dev`.
- The slug is used as BOTH the directory name under `src/content/` and the
  Fastify route name (`GET /{slug}`) — they must always match.

### Routing

- `server.js` reads `listContentSlugs()` at startup and registers one
  `GET /{slug}` route per directory found under `src/content/` (excluding
  `base/`), automatically. **Never edit `server.js` by hand to add a vacante
  route** — creating the directory is enough.
- The existing `GET /cv` route (generic CV, `loadContent("base")`) is
  untouched and always present.
- Each per-vacante route loads content with `loadContent(slug)`, builds the
  PDF the same way as `/cv`, and serves it as
  `attachment; filename="Ricardo_Zermeno_CV_{slug}.pdf"`.
- A slug with no matching directory is simply never registered as a route, so
  it naturally 404s.

### Ground truth — no inventar

Everything below is copied verbatim from `src/content/base/`. Tailoring for a
vacante may reorder, re-emphasize, or rephrase this content — it must never
add technologies, employers, results, or experience not already listed here.

**header.js**
```js
{
  name: "Ricardo Arturo Zermeño Saracho",
  title: "Software Engineer — DeFi & Quantitative Systems",
  phone: "+52 55 3360 9029",
  email: "ricardozs_96@hotmail.com",
  website: { text: "razs.dev", link: "https://razs.dev" },
  linkedin: {
    text: "linkedin.com/in/ricardo-zermeno",
    link: "https://linkedin.com/in/ricardo-zermeno",
  },
  location: "Mexico City, Mexico · Open to Remote",
}
```

**summary.js**
```
Software Engineer with experience in backend financial systems, REST APIs, and quantitative
technologies. Currently at Capital One Mexico. Previous experience at Odoo (functional and
technical support) and a background in civil engineering project management. Stack: Python,
PostgreSQL, JavaScript/TypeScript, React, Solidity, Foundry. Particular interest in the
intersection of software engineering, financial markets, quantitative research, and DeFi.
```

**skills.js**
```js
[
  { category: "Backend", items: "REST APIs, Authentication, PostgreSQL, SQL, Database Design, FastAPI" },
  { category: "Frontend", items: "React, TypeScript, Tailwind CSS, Vite" },
  {
    category: "Blockchain",
    items: "Solidity, Foundry, OpenZeppelin, ERC-20, ERC-1155, EVM, Smart Contracts, DeFi Fundamentals",
  },
  {
    category: "Quant / Trading Systems",
    items: "Python, Backtesting, Algorithmic Trading, Trading Systems Architecture",
  },
  {
    category: "Cloud & DevOps",
    items: "AWS (EC2, IAM, Lambda), Vercel, Railway, Render, GitHub Actions, pm2, Cloudflare Tunnels",
  },
  { category: "Enterprise Systems", items: "Odoo ERP, ORM, XML, QWeb, Workflow Automation" },
]
```

**experience.js**
```js
[
  {
    company: "Capital One",
    role: "Software Engineer",
    dates: "2026 – Present",
    achievements: [
      "Develop backend software in a fintech environment, contributing to APIs, financial systems, and cloud engineering",
      "Collaborate on delivering production-grade software with modern practices: testing, CI/CD, code reviews, Agile",
      "Apply backend, database, API, and systems-thinking expertise to build reliable and scalable financial software",
    ],
  },
  {
    company: "Odoo",
    role: "Functional & Technical Support Engineer",
    dates: "12/2023 – 04/2026",
    achievements: [
      "Developed and customized ERP solutions using Python, PostgreSQL, XML, and QWeb",
      "Diagnosed and resolved complex production issues through SQL analysis, log investigation, and business process validation",
      "Collaborated with developers and consultants to deliver scalable solutions for international clients",
    ],
  },
  {
    company: "VIVE RAMZSA SA DE CV",
    role: "Project Manager",
    dates: "2021 – 2023",
    achievements: [
      "Managed construction and real estate projects: budgeting, scheduling, execution, and stakeholder coordination",
      "Led multidisciplinary teams of up to 20 people (engineering, architecture, contractors, suppliers)",
    ],
  },
]
```

**projects.js**
```js
[
  {
    name: "QuantLab — Algorithmic Trading & Quantitative Research Platform",
    tech: "Python, PostgreSQL, REST APIs, Backend Architecture, Trading Systems, Quantitative Research",
  },
  {
    name: "FlowLedger — Personal Finance SaaS Platform",
    tech: "React, TypeScript, PostgreSQL, REST APIs, Authentication, SaaS",
  },
  {
    name: "DeFi Staking Protocol — staking + auto-compounding vault + wrapped token",
    tech: "Solidity, Foundry, ERC-20",
  },
  {
    name: "DAO Governance System — on-chain governance with treasury and participation-based voting",
    tech: "Solidity, Foundry",
  },
  {
    name: "Upgradeable Game Economy — ERC-1155 game economy with UUPS proxy",
    tech: "Solidity, Foundry, ERC-1155, UUPS Proxy",
  },
]
```

**education.js**
```js
[
  {
    institution: "Metana",
    program: "Full Stack & Web3 Solidity Bootcamp",
    dates: "In progress, expected completion August 2026",
  },
  {
    institution: "Hybridge Education",
    program: "B.Sc. Software Engineering",
    dates: "In progress",
  },
  {
    institution: "Universidad Nacional Autónoma de México (UNAM)",
    program: "B.Sc. Civil Engineering",
    dates: "2017 – 2021",
  },
]
```

**certifications.js**
```js
[
  { name: "IBM Data Science Professional Certificate", issuer: "IBM" },
  { name: "Autodesk Revit Structure Certified Professional", issuer: "Autodesk" },
  { name: "EF SET English Proficiency (C2)", issuer: "EF SET" },
]
```

**languages.js**
```js
[
  { language: "Spanish", level: "Native" },
  { language: "English", level: "C2 / Professional" },
]
```

### Tailoring rules per vacante

When creating/updating a `src/content/<slug>/` directory for a specific job:

- **skills.js / projects.js**: reorder/prioritize entries so the most
  relevant items to that vacante come first. Only reorder — never add
  technologies, tools, or projects that aren't in `base/`.
- **summary.js**: rewrite as 2-4 lines reflecting the language/domain of the
  vacante (e.g. lead with "quant" framing for a trading role, "on-chain"
  framing for a protocol role), always grounded in experience already present
  in `base/`.
- **experience.js / education.js**: normally omitted from the override
  (falls back to base) unless a specific bullet needs rephrasing to surface
  something already true — never to add new claims.
- **header.js / certifications.js / languages.js**: normally omitted from the
  override (falls back to base) — these don't vary by vacante.
- A section file should only be created in `<slug>/` if it actually differs
  from base; omitting it is the correct default.

### Cómo procesar un Excel de vacantes

Triggered by a prompt such as "Generame versiones de mi CV que cumplan con lo
que piden los trabajos en este Excel", with an Excel attached.

**Expected Excel format** (as exported by `job_scraper`): columns `Job Title`,
`Company Name`, `Job Description`, `Job Location`, `Job Url`, `Tags`, `Notes`.

**Process, per row:**
1. Derive `slug` = `{empresa}_{puesto_corto}` in snake_case from `Company Name`
   and `Job Title`.
2. If `src/content/<slug>/` already exists, skip that row (don't overwrite
   existing tailoring).
3. Otherwise, create `src/content/<slug>/` with only the section-file
   overrides needed per the tailoring rules above, derived from `Job
   Description` and `Tags` — grounded strictly in the "Ground truth" block.
4. No changes to `server.js` are needed — the route is picked up automatically
   next server start.

**When done:** list every new slug/route created (`GET /{slug}` →
`src/content/{slug}/`), and confirm each one serves its PDF as
`Ricardo_Zermeno_CV_{slug}.pdf`.
