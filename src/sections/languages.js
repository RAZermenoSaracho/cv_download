const { sectionHeader } = require("../styles");

function languagesSection(content) {
  const text = content.map((entry) => `${entry.language} (${entry.level})`).join("  ·  ");

  return [...sectionHeader("Languages"), { text, style: "body" }];
}

module.exports = languagesSection;
