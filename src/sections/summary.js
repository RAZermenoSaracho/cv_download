const { sectionHeader } = require("../styles");

function summarySection() {
  return [
    ...sectionHeader("Summary"),
    {
      text:
        "Software Engineer with experience in backend financial systems, REST APIs, and quantitative " +
        "technologies. Currently at Capital One Mexico. Previous experience at Odoo (functional and " +
        "technical support) and a background in civil engineering project management. Stack: Python, " +
        "PostgreSQL, JavaScript/TypeScript, React, Solidity, Foundry. Particular interest in the " +
        "intersection of software engineering, financial markets, quantitative research, and DeFi.",
      style: "body",
      alignment: "justify",
    },
  ];
}

module.exports = summarySection;
