const { sectionHeader, spacing } = require("../styles");

function jobBlock(job) {
  return [
    {
      columns: [
        { text: job.company, style: "itemTitle" },
        { text: job.dates, style: "itemMeta", alignment: "right" },
      ],
    },
    { text: job.role, style: "itemMeta", margin: [0, 0, 0, 3] },
    {
      ul: job.achievements,
      style: "bullet",
      type: "square",
      margin: [10, 0, 0, spacing.itemGap],
    },
  ];
}

function experienceSection(content) {
  return [...sectionHeader("Experience"), ...content.flatMap(jobBlock)];
}

module.exports = experienceSection;
