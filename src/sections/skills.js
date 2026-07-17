const { sectionHeader, colors, spacing } = require("../styles");

const skillGroups = [
  { category: "Backend", items: "REST APIs, Authentication, PostgreSQL, SQL, Database Design, FastAPI" },
  { category: "Frontend", items: "React, TypeScript, Tailwind CSS, Vite" },
  {
    category: "Blockchain",
    items: "Solidity, Foundry, OpenZeppelin, ERC-20, ERC-1155, EVM, Smart Contracts, DeFi Fundamentals",
  },
  {
    category: "Quant / Trading Systems",
    items: "Python, Backtesting, Algorithmic Trading, Trading Systems Architecture",
  },
  {
    category: "Cloud & DevOps",
    items: "AWS (EC2, IAM, Lambda), Vercel, Railway, Render, GitHub Actions, pm2, Cloudflare Tunnels",
  },
  { category: "Enterprise Systems", items: "Odoo ERP, ORM, XML, QWeb, Workflow Automation" },
];

function skillsSection() {
  const rows = skillGroups.map((group) => ({
    text: [
      { text: `${group.category}: `, bold: true, color: colors.text },
      { text: group.items, color: colors.text },
    ],
    style: "bullet",
    margin: [0, 0, 0, spacing.itemGap - 2],
  }));

  return [...sectionHeader("Skills"), ...rows];
}

module.exports = skillsSection;
