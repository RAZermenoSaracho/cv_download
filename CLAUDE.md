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
