// Content loader: resolves the data for a CV variant by merging a job-specific
// override directory over src/content/base/, file by file. Each section file
// either exists in the override dir (used whole, replacing base's value) or
// falls back to base/. See CLAUDE.md for the full tailoring workflow.

const fs = require("fs");
const path = require("path");

const SECTION_NAMES = [
  "header",
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "languages",
];

const CONTENT_DIR = __dirname;
const BASE_DIR = path.join(CONTENT_DIR, "base");

class ContentNotFoundError extends Error {
  constructor(slug) {
    super(`No content directory found for slug "${slug}"`);
    this.name = "ContentNotFoundError";
    this.slug = slug;
  }
}

function loadSection(dir, sectionName) {
  const filePath = path.join(dir, `${sectionName}.js`);
  if (!fs.existsSync(filePath)) return undefined;
  return require(filePath);
}

function loadContent(slug) {
  if (!slug || slug === "base") {
    const content = {};
    for (const name of SECTION_NAMES) {
      content[name] = loadSection(BASE_DIR, name);
    }
    return content;
  }

  const slugDir = path.join(CONTENT_DIR, slug);
  if (!fs.existsSync(slugDir) || !fs.statSync(slugDir).isDirectory()) {
    throw new ContentNotFoundError(slug);
  }

  const content = {};
  for (const name of SECTION_NAMES) {
    content[name] = loadSection(slugDir, name) ?? loadSection(BASE_DIR, name);
  }
  return content;
}

// Directory names under src/content/ (excluding base/) — each one becomes a
// GET /{slug} route, registered automatically at server startup.
function listContentSlugs() {
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "base")
    .map((entry) => entry.name);
}

module.exports = { loadContent, listContentSlugs, ContentNotFoundError };
