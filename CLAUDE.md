# cv_download

API Fastify que genera el CV general de Ricardo Arturo Zermeño Saracho en PDF on-demand usando pdfmake, 
para el botón "Download CV" del portafolio.

## Objetivo
- Endpoint único: GET /cv
- Genera el PDF en memoria con pdfmake y lo regresa como stream/buffer
- Headers: Content-Type: application/pdf, Content-Disposition: attachment; filename="Ricardo-Zermeno-CV.pdf"

## Estructura esperada
- src/server.js (o index.js) — servidor Fastify, solo routing
- src/cv-content.js — docDefinition de pdfmake, separado del server para poder actualizar el CV sin 
  tocar lógica del servidor (el CV cambiará conforme evolucione la carrera de Ricardo)

## Contenido del CV
El contenido fuente vive en el resume PDF adjunto al proyecto Claude 
(RicardoArturoZermenoSarachoResume_1.pdf) y en las decisiones de posicionamiento acordadas:
- Título: "Software Engineer — DeFi & Quantitative Systems"
- Roles objetivo: web3 / DeFi / quantitative trading

## Infra (mismo patrón que job_scraper y job_scraper_frontend)
- pm2 vía ecosystem.config.cjs (CommonJS, .cjs obligatorio bajo Node 24)
- Self-hosted GitHub Actions runner registrado específicamente para este repo bajo ~/actions-runners/
- Antes de asignar puerto/subdominio, revisar /etc/cloudflared/config.yml y los ecosystem.config.cjs 
  existentes para no chocar con puertos en uso:
  - job_scraper → 8420 → api-jobs.razs.dev
  - job_scraper_frontend → 5180 → jobs.razs.dev
- El archivo /etc/cloudflared/config.yml es root-owned: mostrar el diff propuesto, Ricardo lo aplica 
  manualmente con sudo
- Restart del tunnel: sudo launchctl kickstart -k system/com.cloudflare.cloudflared

## Convenciones
- No incluir instrucciones de testing en los prompts de trabajo — Ricardo prueba de forma independiente
- Mostrar plan (puerto, subdominio, estructura de carpetas) antes de generar código, esperar confirmación
