// Assembles the final pdfmake docDefinition by combining every section.
// Update a section's rendering by editing its file under sections/, or its
// data under content/base/ (or a content/<slug>/ override) — this file only
// concerns page-level settings, section ordering, and wiring content to
// sections.

const { fonts, namedStyles } = require("./styles");

const headerSection = require("./sections/header");
const summarySection = require("./sections/summary");
const skillsSection = require("./sections/skills");
const experienceSection = require("./sections/experience");
const projectsSection = require("./sections/projects");
const educationSection = require("./sections/education");
const certificationsSection = require("./sections/certifications");
const languagesSection = require("./sections/languages");

function buildCvDocDefinition(content) {
  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: "Times",
      fontSize: 9.5,
    },
    styles: namedStyles,
    info: {
      title: "Ricardo Zermeno - CV",
      author: "Ricardo Arturo Zermeño Saracho",
    },
    content: [
      ...headerSection(content.header),
      ...summarySection(content.summary),
      ...skillsSection(content.skills),
      ...experienceSection(content.experience),
      ...projectsSection(content.projects),
      ...educationSection(content.education),
      ...certificationsSection(content.certifications),
      ...languagesSection(content.languages),
    ],
  };
}

module.exports = { buildCvDocDefinition, fonts };
