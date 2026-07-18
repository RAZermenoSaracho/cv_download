const { sectionHeader, spacing } = require("../styles");

function educationBlock(entry) {
  return {
    columns: [
      { text: `${entry.institution} — ${entry.program}`, style: "itemTitle" },
      { text: entry.dates, style: "itemMeta", alignment: "right" },
    ],
    margin: [0, 0, 0, spacing.itemGap],
  };
}

function educationSection(content) {
  return [...sectionHeader("Education"), ...content.map(educationBlock)];
}

module.exports = educationSection;
