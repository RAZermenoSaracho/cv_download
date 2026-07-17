const { sectionHeader, spacing } = require("../styles");

const education = [
  {
    institution: "Metana",
    program: "Full Stack & Web3 Solidity Bootcamp",
    dates: "In progress, expected completion August 2026",
  },
  {
    institution: "Hybridge Education",
    program: "B.Sc. Software Engineering",
    dates: "In progress",
  },
  {
    institution: "Universidad Nacional Autónoma de México (UNAM)",
    program: "B.Sc. Civil Engineering",
    dates: "2017 – 2021",
  },
];

function educationBlock(entry) {
  return {
    columns: [
      { text: `${entry.institution} — ${entry.program}`, style: "itemTitle" },
      { text: entry.dates, style: "itemMeta", alignment: "right" },
    ],
    margin: [0, 0, 0, spacing.itemGap],
  };
}

function educationSection() {
  return [...sectionHeader("Education"), ...education.map(educationBlock)];
}

module.exports = educationSection;
