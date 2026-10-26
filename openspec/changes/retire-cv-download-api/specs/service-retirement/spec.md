## ADDED Requirements

### Requirement: Retire only after production verification
`cv-download-api` SHALL NOT be stopped until the Download CV button on `https://razs.dev` has been verified against `https://projects.razs.dev/cv` in production and `portfolio-data` no longer links to `cv-api.razs.dev`.

#### Scenario: Frontend not verified
- **WHEN** the production check has not passed
- **THEN** no retirement step runs

### Requirement: Ordered, observed retirement
Retirement SHALL proceed in this order: `pm2 stop`, an observation period of N days, `pm2 delete` and `pm2 save`, owner removal of the tunnel ingress with sudo and cloudflared restart, owner deletion of the `cv-api.razs.dev` DNS record, GitHub archive, local directory to Trash after a backup. The agent SHALL NOT edit `/etc/cloudflared/config.yml`.

#### Scenario: Problem during observation
- **WHEN** a broken download or an unexpected `/<slug>` request is found while stopped
- **THEN** `pm2 start cv-download-api` restores service and later steps wait

### Requirement: Base content preserved
`src/content/base` SHALL be copied to its new location and the Odoo import script's default path updated and checked before the directory is deleted.

#### Scenario: Import script after the move
- **WHEN** `import_cv_download.py` runs with its default path after the directory is trashed
- **THEN** it reads the preserved content and succeeds

### Requirement: Per-job CV fate recorded
The owner's decision on the `/<slug>` CVs SHALL be recorded in this change before step 1, after grepping for consumers.

#### Scenario: Decision recorded
- **WHEN** step 1 is about to run
- **THEN** tasks 1.2 and 1.3 are checked
