// Assembles the final pdfmake docDefinition by combining every section.
// Update a section by editing its file under sections/ — this file only
// concerns page-level settings and section ordering.

const { fonts, namedStyles } = require("./styles");

const headerSection = require("./sections/header");
const summarySection = require("./sections/summary");
const skillsSection = require("./sections/skills");
const experienceSection = require("./sections/experience");
const projectsSection = require("./sections/projects");
const educationSection = require("./sections/education");
const certificationsSection = require("./sections/certifications");
const languagesSection = require("./sections/languages");

function buildCvDocDefinition() {
  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: "Helvetica",
      fontSize: 9.5,
    },
    styles: namedStyles,
    info: {
      title: "Ricardo Zermeno - CV",
      author: "Ricardo Arturo Zermeño Saracho",
    },
    content: [
      ...headerSection(),
      ...summarySection(),
      ...skillsSection(),
      ...experienceSection(),
      ...projectsSection(),
      ...educationSection(),
      ...certificationsSection(),
      ...languagesSection(),
    ],
  };
}

module.exports = { buildCvDocDefinition, fonts };
