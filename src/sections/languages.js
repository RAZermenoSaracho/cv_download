const { sectionHeader } = require("../styles");

function languagesSection() {
  return [
    ...sectionHeader("Languages"),
    { text: "Spanish (Native)  ·  English (C2 / Professional)", style: "body" },
  ];
}

module.exports = languagesSection;
