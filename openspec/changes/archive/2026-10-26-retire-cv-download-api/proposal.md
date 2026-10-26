## Why

The Download CV button now uses `https://projects.razs.dev/cv`, which proxies the CV stored in Odoo. `cv_download` (PM2 `cv-download-api`, 127.0.0.1:8421, `cv-api.razs.dev`) is redundant. Keeping it means a second CV source that can drift and an extra public hostname to maintain.

## What Changes

Owner decisions: no observation period, per-job `/<slug>` endpoints retired, `job.profile` 14 in Odoo is the single source of truth. Executed right after `use-portfolio-cv-endpoint` was verified in production:

1. Backup tarball, then `pm2 stop` + `pm2 delete` + `pm2 save` of `cv-download-api`.
2. Disable the deploy workflow and retire the dedicated self-hosted runner.
3. Delete the `cv-api.razs.dev` DNS record (Cloudflare API).
4. Owner removes the `cv-api.razs.dev -> localhost:8421` ingress block from `/etc/cloudflared/config.yml` with sudo and restarts cloudflared (never edited by the agent).
5. Archive the GitHub repo (archive, not delete); local directory to Trash after the backup is verified.

## Capabilities

### New Capabilities
- `service-retirement`: ordered, reversible retirement of the CV API with content preserved.

### Modified Capabilities
None.

## Impact

- PM2 process, Cloudflare tunnel ingress and DNS, GitHub repo, local directory, self-hosted runner `~/actions-runners/cv_download`.
- `razs_jobs/scripts/import_cv_download.py` reads `CV_CONTENT_DIR` (default `/Users/razs/production/cv_download/src/content/base`); it now requires an explicit path (no default to this retired repo).

## Out of scope

- Changing `razs_jobs` or `portfolio-api` behaviour.
