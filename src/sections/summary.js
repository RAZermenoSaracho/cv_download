const { sectionHeader } = require("../styles");

function summarySection(content) {
  return [
    ...sectionHeader("Summary"),
    {
      text: content,
      style: "body",
      alignment: "justify",
    },
  ];
}

module.exports = summarySection;
