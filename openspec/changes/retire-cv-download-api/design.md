## Context

- `src/server.js` serves `/cv` plus one `GET /<slug>` per directory under `src/content/` excluding `base/` (about 75 job-specific slugs, filename `Ricardo_Zermeno_CV_<slug>.pdf`).
- Grep of `/Users/razs/production` (excluding node_modules, .git) found no consumer of `cv-api` apart from `my-portfolio` `Hero.jsx` and `portfolio-data/projects.json`. `razs_jobs` references `cv_download` only for the one-off content import (script path, CSS comment, specs). Consumers outside these repos (saved links in sent applications, emails, the owner's notes) cannot be grepped and must be checked by the owner.
- A push to `master` triggers `.github/workflows/deploy.yml` on the self-hosted runner, which does `git reset --hard` and `pm2 restart cv-download-api`. After `pm2 delete`, any push would fail at the restart step, so the runner is disabled at step 5.

## Decisions

0. **Owner decisions (final):** no observation period; per-job `/<slug>` endpoints retired; `job.profile` 14 is the single source of truth, so `src/content/base` is not copied into razs_jobs. It survives only in the backup tarball and the archived GitHub repo, and `import_cv_download.py` requires an explicit `CV_CONTENT_DIR`. Items 1-3 below are superseded by this.
1. **(Superseded) Preserve `src/content/base` first.** Before step 1, the owner decides its new home. Recommendation: copy to `razs_jobs/data/cv_base_content/` (inside the module's wrapper repo, committed) and change the default `CONTENT_DIR` in `import_cv_download.py` to it, so the script survives the Trash step. Alternative: keep it only in the archived GitHub repo and clone when needed (weaker, since the script defaults to a local path). Verify by running the script with `CV_CONTENT_DIR` set to the new path against a disposable DB or in dry mode.
2. **Per-job `/<slug>` CVs: owner decision.** Options: (a) drop them; tailored CVs now live in Odoo as `job.job` attachments (recommended, since they are no longer served anywhere and the archived repo keeps the sources); (b) keep serving them, which means keeping the service and defeats retirement. During the N-day observation, count requests to `/<slug>` in `~/.pm2/logs` of `cv-download-api` (the service must be running for this; if stopped, check Cloudflare analytics for `cv-api.razs.dev`). Zero hits supports (a).
3. **Stop before delete.** `pm2 stop` is reversible with `pm2 start cv-download-api`; `pm2 delete` + `pm2 save` removes it from the dump, so do it only after the observation window.
4. **Tunnel and DNS are owner steps.** Order matters: remove ingress first (hostname returns 502/404), then DNS. Removing DNS first would leave a dangling ingress; harmless but untidy.
5. **Archive, never delete,** the GitHub repo; trash the directory only after a verified backup (tarball of the directory including `.git`, checksum noted).

## Rollback

Rollback is the reverse of rollout:
1. If `cv_download` is already retired, restore it first: `pm2 start` (`ecosystem.config.cjs`, then `pm2 save`), owner restores the tunnel ingress, owner recreates the DNS record.
2. Point the frontend back to `cv-api.razs.dev` (revert `use-portfolio-cv-endpoint`).
3. Revert the `portfolio-api` `/cv` route and restart `portfolio-api`.
4. Revoke the key (delete it) and downgrade the Odoo route (revert the module change, `-u razs_jobs`, restart `odoo`), archive `cv-service`, remove the config parameter.

Within retirement: before step 2 `pm2 start cv-download-api` is enough; after the ingress is removed the owner restores the block (`hostname: cv-api.razs.dev`, `service: http://localhost:8421`) and runs `sudo launchctl kickstart -k system/com.cloudflare.cloudflared`; after the GitHub archive, unarchive; after Trash, restore from backup.
