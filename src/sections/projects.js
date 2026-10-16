const { sectionHeader, colors, spacing } = require("../styles");

function projectBlock(project) {
  const lines = [{ text: `${project.name}\n`, style: "itemTitle" }];
  if (project.description) lines.push({ text: `${project.description}\n` });
  lines.push({ text: `Tech: ${project.tech}`, fontSize: 9, color: colors.muted });
  return { text: lines, margin: [0, 0, 0, spacing.itemGap] };
}

function projectsSection(content) {
  return [...sectionHeader("Projects"), ...content.map(projectBlock)];
}

module.exports = projectsSection;
