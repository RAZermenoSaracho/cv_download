# cv_download

Fastify API that generates Ricardo Arturo Zermeño Saracho's general CV as a PDF on demand using pdfmake, 
for the "Download CV" button on the portfolio.

## Language Policy
All repository content must always be written in English. This includes source code, comments,
documentation, README files, logs, commit messages, PR descriptions, tests, examples,
configuration, and API fields. There are no exceptions.

## User Interaction
The user may communicate with Claude in Spanish. Regardless of the language used in
conversation, every repository artifact (code, comments, documentation, commit messages, PR
descriptions, etc.) must always be written in English.

## Goal
- Single endpoint: GET /cv
- Generates the PDF in memory with pdfmake and returns it as a stream/buffer
- Headers: Content-Type: application/pdf, Content-Disposition: attachment; filename="Ricardo-Zermeno-CV.pdf"

## Expected structure
- src/server.js (or index.js) — Fastify server, routing only
- src/cv-content.js — pdfmake docDefinition, fully separated from the server so the CV content can be 
  updated later without touching server logic (the CV will change as Ricardo's career evolves)

## CV content
The source content lives in the resume PDF originally attached to the project
(RicardoArturoZermenoSarachoResume_1.pdf) and the agreed positioning decisions:
- Title: "Web3 Software Engineer"
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

## Content/tailoring system (per-job CV variants)

This is the system that lets a single prompt like "Generate versions of my CV
that meet what the jobs in this Excel file are asking for" be executed
without re-explaining the architecture.

### Structure

- `src/content/base/` — one file per section, each exporting only data
  (arrays/objects/strings), never pdfmake markup: `header.js`, `summary.js`,
  `skills.js`, `experience.js`, `projects.js`, `education.js`,
  `certifications.js`, `languages.js`. This is the single source of truth for
  Ricardo's real experience.
- `src/content/<slug>/` — one directory per job, created only when
  tailoring for a specific job. Each directory may export any subset of the
  same section files; any file it doesn't export falls back to `base/`.
- `src/content/index.js` exports `loadContent(slug)`:
  - `loadContent()` or `loadContent("base")` → base content, unmodified.
  - `loadContent(slug)` for an existing `src/content/<slug>/` → merges
    file-by-file: if `<slug>/<section>.js` exists, its value is used **whole**
    (never merged field-by-field with base's value); otherwise base's value
    for that section is used. **Exception: `header.js`** is merged
    field-by-field (`{ ...base.header, ...override }`), since a job
    override only ever sets `title` and must keep inheriting
    `name`/`phone`/`email`/`website`/`linkedin`/`location` from base.
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

- Format: `{company}_{short_role}`, all lowercase, snake_case.
  Example: `bitmart_on_chain_quant_dev`.
- The slug is used as BOTH the directory name under `src/content/` and the
  Fastify route name (`GET /{slug}`) — they must always match.

### Routing

- `server.js` reads `listContentSlugs()` at startup and registers one
  `GET /{slug}` route per directory found under `src/content/` (excluding
  `base/`), automatically. **Never edit `server.js` by hand to add a job
  route** — creating the directory is enough.
- The existing `GET /cv` route (generic CV, `loadContent("base")`) is
  untouched and always present.
- Each per-job route loads content with `loadContent(slug)`, builds the
  PDF the same way as `/cv`, and serves it as
  `attachment; filename="Ricardo_Zermeno_CV_{slug}.pdf"`.
- A slug with no matching directory is simply never registered as a route, so
  it naturally 404s.

### Ground truth — do not invent

Everything below is copied verbatim from `src/content/base/`. Tailoring for a
job may reorder, re-emphasize, or rephrase this content — it must never
add technologies, employers, results, or experience not already listed here.
Note on `AI-Assisted Development`: Ricardo is working toward a Claude Code
certification but has not yet obtained it — never phrase this as a
certification held, only as familiarity with the listed tools.

Note on Java/Spring Boot: this is Ricardo's current working stack at Capital One
and real shipped experience, but it is **not** a mastery area — he navigates it
with heavy AI assistance (Claude Code, Gemini). Python remains his strongest
language, which is why it leads the Backend list and the summary's stack line.
Never position Ricardo as a Java specialist, never lead a tailored CV with Java,
and never tailor toward senior/staff Java-first roles as though Java were a
strength.

Note on Capital One work: keep it at the domain level (features, workflows,
practices) and never describe internal architecture, systems, timelines, or
other non-public detail. The Discover network integration is only the area
Ricardo is **onboarding onto** — never claim results, delivered work, or
specifics there. Ricardo's team is *about to* adopt the BMAD method but has not
yet, so BMAD must not appear as experience.

Note on client regions: the regions of Ricardo's Odoo support clients are
unspecified — never describe them as "international" or name any region.

**header.js**
```js
{
  name: "Ricardo Arturo Zermeño Saracho",
  title: "Web3 Software Engineer",
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
technologies. Currently at Capital One Mexico, developing backend features in Java and Spring
Boot on AWS. Previous experience at Odoo (functional and technical support) and a background
in civil engineering project management. Stack: Python, PostgreSQL, JavaScript/TypeScript,
React, Java, Spring Boot, Solidity, Foundry. Particular interest in the intersection of
software engineering, financial markets, quantitative research, and DeFi.
```

**skills.js**
```js
[
  {
    category: "Backend",
    items:
      "Python, REST APIs, Authentication, PostgreSQL, SQL, Database Design, FastAPI, Fastify, Prisma, Java, Spring Boot",
  },
  { category: "Frontend", items: "React, TypeScript, Tailwind CSS, Vite" },
  {
    category: "Blockchain",
    items:
      "Solidity, Foundry, OpenZeppelin, Chainlink Price Feeds, Uniswap V2, viem, wagmi, Echidna, Slither, ERC-20, ERC-1155, EVM, Smart Contracts, DeFi Fundamentals",
  },
  {
    category: "Quant / Trading Systems",
    items: "Python, Backtesting, Algorithmic Trading, Trading Systems Architecture",
  },
  {
    category: "Cloud & DevOps",
    items:
      "AWS (EC2, IAM, Lambda), Git, CI/CD, GitHub Actions, Vercel, Railway, Render, pm2, Cloudflare Tunnels",
  },
  { category: "Enterprise Systems", items: "Odoo ERP, Odoo Studio, ORM, XML, QWeb, Workflow Automation" },
  {
    category: "AI-Assisted Development",
    items: "Claude Code, Codex, Gemini, OpenSpec (spec-driven development), MCP",
  },
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
      "Develop backend features in Java and Spring Boot for customer-facing account workflows on the Recoveries team, deployed on AWS",
      "Shipped account-servicing features including cancellation of Discover offers and cancellation of multiple payments in a single operation",
      "Remediated security vulnerabilities across multiple repositories, including insecure direct object reference (IDOR) issues",
      "Resolved accessibility issues in customer-facing flows",
      "Deliver changes through a Git pull-request and CI/CD workflow with automated testing on every change",
      "Use agentic development with Claude Code daily, including spec-driven development with OpenSpec",
      "Currently onboarding onto the Discover network integration following Capital One's acquisition of Discover",
    ],
  },
  {
    company: "Odoo",
    role: "Functional & Technical Support Engineer",
    dates: "12/2023 – 04/2026",
    achievements: [
      "Resolved 1,000+ support tickets, diagnosing production issues through SQL analysis, log investigation, and business process validation",
      "Served as the support team's subject-matter expert for Odoo Studio: custom fields, views, automated actions, reports, and no-code customizations",
      "Held the highest support rating on the team and resolved the highest volume of expert tickets — escalations from other engineers' tickets that required specialist support",
      "Developed and customized ERP solutions using Python, PostgreSQL, XML, and QWeb",
      "Collaborated with developers and consultants to deliver scalable solutions for clients",
    ],
  },
  {
    company: "VIVE RAMZSA SA DE CV",
    role: "Project Manager",
    dates: "2021 – 2023",
    achievements: [
      "Managed construction and real estate projects end to end, covering budgeting, scheduling, and execution",
      "Coordinated stakeholders across every project phase, from initial planning through final delivery",
      "Led multidisciplinary teams of up to 20 people, including engineers, architects, contractors, and suppliers",
    ],
  },
]
```

**projects.js**

Each entry may carry an optional `description` (rendered between the name and the
`Tech:` line). The descriptions below are the approved wording — see the
"Project claim limits" note under this block before rephrasing any of them.

```js
[
  {
    name: "OrderKeeper — Decentralized Limit-Order Keeper Bot for EVM Chains",
    description:
      "Trustless limit-order keeper: users deposit funds with a price condition, and a keeper bot monitors Chainlink price feeds to trigger on-chain execution through Uniswap V2 once the condition is met. Four services: Foundry contracts, an order indexer, the keeper bot, and a web frontend. Deployed and Etherscan-verified on Sepolia testnet with 100% contract coverage and passing fork tests; open source, live demo at orderkeeper.razs.dev. Metana bootcamp capstone.",
    tech:
      "Solidity, Foundry, OpenZeppelin, Chainlink Price Feeds, Uniswap V2, TypeScript, Node, Fastify, viem, wagmi, React, Vite, PostgreSQL, Prisma",
  },
  {
    name: "QuantLab — Algorithmic Trading & Quantitative Research Platform",
    description:
      "Personal algorithmic trading platform built and used to design and test my own trading strategies. Single user, not a public product.",
    tech: "Python, PostgreSQL, REST APIs, Backend Architecture, Trading Systems, Quantitative Research",
  },
  {
    name: "FlowLedger — Personal Finance SaaS Platform",
    description:
      "Personal finance SaaS platform, deployed and currently in a testing phase with a small circle of family and friends.",
    tech: "React, TypeScript, PostgreSQL, REST APIs, Authentication, SaaS",
  },
  {
    name: "odoo_bim — BIM/IFC Integration for Odoo 19 Community",
    description: "Open-source module bringing BIM/IFC integration to Odoo 19 Community.",
    tech: "Odoo 19, Python",
  },
  {
    name: "odooers_forum — Community Q&A Forum Module for Odoo 19",
    description: "Open-source community Q&A forum module for Odoo 19.",
    tech: "Odoo 19, Python",
  },
  {
    name: "odoo_mcp — MCP Integration for Odoo",
    description: "Open-source MCP integration for Odoo.",
    tech: "Odoo, MCP",
  },
  {
    name: "many2many_razs_widget — Custom many2many Tags Widget for Odoo",
    description: "Open-source custom many2many tags widget for Odoo.",
    tech: "Odoo",
  },
  {
    name: "DeFi Staking Protocol — staking + auto-compounding vault + wrapped token",
    description: "Metana bootcamp project.",
    tech: "Solidity, Foundry, ERC-20",
  },
  {
    name: "DAO Governance System — on-chain governance with treasury and participation-based voting",
    description: "Metana bootcamp project.",
    tech: "Solidity, Foundry",
  },
  {
    name: "Upgradeable Game Economy — ERC-1155 game economy with UUPS proxy",
    description: "Metana bootcamp project.",
    tech: "Solidity, Foundry, ERC-1155, UUPS Proxy",
  },
]
```

**Project claim limits — never exceed these:**
- `OrderKeeper` is a Sepolia **testnet demo**. Never describe it as a production
  product and never cite user numbers.
- `QuantLab` is single-user (Ricardo only) and not a public product.
- `FlowLedger` is **in a testing phase**, used only by Ricardo plus close family
  and friends. Never call it launched; never give user numbers beyond that.
- The three Solidity projects (staking protocol, DAO governance, ERC-1155 game
  economy) are **Metana bootcamp projects** and were **not audited by any third
  party** — never use the word "audited", and never state a deployment status.
- The four `odoo_*` repos are public open-source work on Ricardo's GitHub. The
  Odoo **support** period (12/2023 – 04/2026) involved fixing issues directly in
  client databases, **not** repository contributions — never present that period
  as open-source contribution.

**education.js**
```js
[
  {
    institution: "Metana",
    program: "Full Stack & Web3 Solidity Bootcamp (Cohort Sol81)",
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

### Tailoring rules per job

When creating/updating a `src/content/<slug>/` directory for a specific job:

- **header.js**: SHOULD be overridden per job, but only the `title`
  field — never `name`, `phone`, `email`, `website`, `linkedin`, or
  `location`, which never change. The override file exports only
  `{ title: "..." }`, so the rest of `header` still falls back to `base/`.
  The new title must:
  - Keep the "Web3 Software Engineer" framing — never swap in another career
    title (e.g. never "Security Researcher", "Investment Analyst", "Trader"
    on its own). Ricardo positions as a software engineer even for
    research/security/trading roles.
  - Follow the same format as base's title: `"Web3 Software Engineer —
    {job domain}"`, e.g. `"Web3 Software Engineer — Smart Contract
    Security"`, `"Software Engineer — Quantitative Trading Systems"`,
    `"Web3 Software Engineer — DeFi Research"`. The domain comes from the real
    job listing (Job Title + Tags + Job Description), never an invented one.
  - Follow the same Ground truth constraint as every other section: base
    the domain phrase on what the job listing asks for, not on technologies
    Ricardo doesn't have.
- **skills.js / projects.js**: reorder/prioritize entries so the most
  relevant items to that job come first. Only reorder — never add
  technologies, tools, or projects that aren't in `base/`.
  - **Web3 roles**: `OrderKeeper` (the flagship, most recent web3 project —
    a decentralized limit-order keeper bot built directly on Chainlink Price
    Feeds and Uniswap) must be the first project listed, ahead of any other
    reordering.
- **summary.js**: rewrite as 2-4 lines reflecting the language/domain of the
  job (e.g. lead with "quant" framing for a trading role, "on-chain"
  framing for a protocol role), always grounded in experience already present
  in `base/`.
- **experience.js / education.js**: normally omitted from the override
  (falls back to base) unless a specific bullet needs rephrasing to surface
  something already true — never to add new claims.
- **certifications.js / languages.js**: normally omitted from the override
  (falls back to base) — these don't vary by job.
- Beyond `header.js`'s `title` (always expected) and `summary.js`/`skills.js`/
  `projects.js` (expected whenever they differ from base), a section file
  should only be created in `<slug>/` if it actually differs from base;
  omitting it is the correct default.

### How to process a job listings Excel file

Triggered by a prompt such as "Generate versions of my CV that meet what the
jobs in this Excel file are asking for", with an Excel file attached.

**Expected Excel format** (as exported by `job_scraper`): columns `Job Title`,
`Company Name`, `Job Description`, `Job Location`, `Job Url`, `Tags`, `Notes`.

**Process, per row:**
1. Derive `slug` = `{company}_{short_role}` in snake_case from `Company Name`
   and `Job Title`.
2. If `src/content/<slug>/` already exists, skip that row (don't overwrite
   existing tailoring).
3. Otherwise, create `src/content/<slug>/` with the section-file overrides
   needed per the tailoring rules above, derived from `Job Description` and
   `Tags` — grounded strictly in the "Ground truth" block. This always
   includes `header.js` (`title` only, per the rule above) alongside
   `summary.js`, `skills.js`, and `projects.js`.
4. No changes to `server.js` are needed — the route is picked up automatically
   next server start.

**When done:** list every new slug/route created (`GET /{slug}` →
`src/content/{slug}/`), and confirm each one serves its PDF as
`Ricardo_Zermeno_CV_{slug}.pdf`.
