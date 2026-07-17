const { sectionHeader, colors, spacing } = require("../styles");

const projects = [
  {
    name: "QuantLab — Algorithmic Trading & Quantitative Research Platform",
    tech: "Python, PostgreSQL, REST APIs, Backend Architecture, Trading Systems, Quantitative Research",
  },
  {
    name: "FlowLedger — Personal Finance SaaS Platform",
    tech: "React, TypeScript, PostgreSQL, REST APIs, Authentication, SaaS",
  },
  {
    name: "DeFi Staking Protocol — staking + auto-compounding vault + wrapped token",
    tech: "Solidity, Foundry, ERC-20",
  },
  {
    name: "DAO Governance System — on-chain governance with treasury and participation-based voting",
    tech: "Solidity, Foundry",
  },
  {
    name: "Upgradeable Game Economy — ERC-1155 game economy with UUPS proxy",
    tech: "Solidity, Foundry, ERC-1155, UUPS Proxy",
  },
];

function projectBlock(project) {
  return {
    text: [
      { text: `${project.name}\n`, style: "itemTitle" },
      { text: `Tech: ${project.tech}`, fontSize: 9, color: colors.muted },
    ],
    margin: [0, 0, 0, spacing.itemGap],
  };
}

function projectsSection() {
  return [...sectionHeader("Projects"), ...projects.map(projectBlock)];
}

module.exports = projectsSection;
