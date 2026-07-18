const { sectionHeader, colors, spacing } = require("../styles");

function projectBlock(project) {
  return {
    text: [
      { text: `${project.name}\n`, style: "itemTitle" },
      { text: `Tech: ${project.tech}`, fontSize: 9, color: colors.muted },
    ],
    margin: [0, 0, 0, spacing.itemGap],
  };
}

function projectsSection(content) {
  return [...sectionHeader("Projects"), ...content.map(projectBlock)];
}

module.exports = projectsSection;
