const { sectionHeader, colors, spacing } = require("../styles");

function skillsSection(content) {
  const rows = content.map((group) => ({
    text: [
      { text: `${group.category}: `, bold: true, color: colors.text },
      { text: group.items, color: colors.text },
    ],
    style: "bullet",
    margin: [0, 0, 0, spacing.itemGap - 2],
  }));

  return [...sectionHeader("Skills"), ...rows];
}

module.exports = skillsSection;
