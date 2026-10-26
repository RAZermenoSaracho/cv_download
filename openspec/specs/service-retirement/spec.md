# service-retirement Specification

## Purpose
Define how a deployed service is retired safely: verify the replacement in production first, then stop, delete, remove ingress and DNS, archive the repo and trash the directory after a backup.

## Requirements

### Requirement: Retire only after production verification
`cv-download-api` SHALL NOT be stopped until the Download CV button on `https://razs.dev` has been verified against `https://projects.razs.dev/cv` in production and `portfolio-data` no longer links to `cv-api.razs.dev`.

#### Scenario: Frontend not verified
- **WHEN** the production check has not passed
- **THEN** no retirement step runs

### Requirement: Ordered retirement without an observation period
There SHALL be no observation period: retirement runs right after the production E2E verification, in this order: `pm2 stop`, `pm2 delete` and `pm2 save`, owner removal of the tunnel ingress with sudo and cloudflared restart, deletion of the `cv-api.razs.dev` DNS record, GitHub archive, local directory to Trash after a backup. Per-job `/<slug>` CV endpoints are retired with the service. The agent SHALL NOT edit `/etc/cloudflared/config.yml`.

#### Scenario: Problem after retirement
- **WHEN** a broken download is found after a step
- **THEN** the rollback in the tasks restores service (`pm2 start`, ingress, DNS, unarchive, backup)

### Requirement: Base content not depended on
`job.profile` 14 in Odoo SHALL be the single source of truth for the CV, and `import_cv_download.py` SHALL require an explicit `CV_CONTENT_DIR` instead of a default path into the retired directory.

#### Scenario: Import script without a path
- **WHEN** `import_cv_download.py` runs without `CV_CONTENT_DIR`
- **THEN** it exits with a clear error

### Requirement: Per-job CV fate recorded
The owner's decision on the `/<slug>` CVs SHALL be recorded in this change before step 1, after grepping for consumers.

#### Scenario: Decision recorded
- **WHEN** step 1 is about to run
- **THEN** tasks 1.2 and 1.3 are checked
