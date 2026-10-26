## 1. Preconditions

- [x] 1.1 `use-portfolio-cv-endpoint` verified in production; `portfolio-data` entry updated and live
- [x] 1.2 Grep consumers of `cv-api.razs.dev` and `/<slug>` (only Hero.jsx and projects.json, both updated). Saved links outside the repos are not checkable; owner accepted the risk
- [x] 1.3 Owner decision: retire per-job `/<slug>` CVs
- [x] 1.4 Owner decision: profile 14 is the source of truth; `import_cv_download.py` now requires explicit `CV_CONTENT_DIR`
- [x] 1.5 Backup tarball of `cv_download` including `.git`: `/Users/razs/backups/cv_download-20261026-1042.tar.gz`, sha256 `db4dde29...ec3f`, verified with `tar -tzf`

## 2. Retire

- [x] 2.1 `pm2 stop cv-download-api` (no observation period, owner decision)
- [x] 2.2 `pm2 delete cv-download-api` then `pm2 save`
- [x] 2.3 Owner removed the `cv-api.razs.dev` ingress block and restarted cloudflared; verified 2026-10-26: `grep -c 'cv-api\|8421' /etc/cloudflared/config.yml` = 0, `https://cv-api.razs.dev/cv` unreachable (curl code 000), `dig` empty
- [x] 2.4 `cv-api.razs.dev` DNS record deleted (CNAME to tunnel, via Cloudflare API)
- [x] 2.5 Deploy workflow disabled, dedicated runner `~/actions-runners/cv_download` unloaded and moved to Trash, GitHub repo archived
- [x] 2.6 `/Users/razs/production/cv_download` moved to Trash after 1.5 verified
- [x] 2.7 `my-portfolio` docs updated (see `use-portfolio-cv-endpoint`)

## 3. Rollback (if needed)

- [x] 3.1 Rollback documented (not exercised, it would cause needless downtime). Per step: `pm2 start`, restore ingress, recreate DNS, unarchive, restore from backup
