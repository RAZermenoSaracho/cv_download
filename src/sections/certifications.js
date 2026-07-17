const { sectionHeader, spacing } = require("../styles");

const certifications = [
  { name: "IBM Data Science Professional Certificate", issuer: "IBM" },
  { name: "Autodesk Revit Structure Certified Professional", issuer: "Autodesk" },
  { name: "EF SET English Proficiency (C2)", issuer: "EF SET" },
];

function certificationsSection() {
  const rows = certifications.map((cert) => ({
    text: `${cert.name} — ${cert.issuer}`,
    style: "bullet",
    margin: [0, 0, 0, spacing.itemGap - 2],
  }));

  return [...sectionHeader("Certifications"), ...rows];
}

module.exports = certificationsSection;
