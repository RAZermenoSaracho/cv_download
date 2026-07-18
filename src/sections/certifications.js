const { sectionHeader, spacing } = require("../styles");

function certificationsSection(content) {
  const rows = content.map((cert) => ({
    text: `${cert.name} — ${cert.issuer}`,
    style: "bullet",
    margin: [0, 0, 0, spacing.itemGap - 2],
  }));

  return [...sectionHeader("Certifications"), ...rows];
}

module.exports = certificationsSection;
