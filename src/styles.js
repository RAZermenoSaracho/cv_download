// Shared pdfmake constants (colors, fonts, spacing) so every section renders consistently.

const colors = {
  heading: "#0f172a", // near-black navy for name and section titles
  accent: "#2563eb", // blue accent for links and highlights
  text: "#1f2937", // main body text
  muted: "#64748b", // secondary text (dates, locations, meta)
  divider: "#cbd5e1", // light gray divider lines
};

// pdfkit's built-in standard fonts, referenced by name so no TTF files need to
// be bundled with the project.
const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const spacing = {
  sectionGapBefore: 16,
  sectionGapAfter: 6,
  itemGap: 6,
};

const namedStyles = {
  name: { fontSize: 22, bold: true, color: colors.heading },
  titleLine: { fontSize: 12, color: colors.accent, margin: [0, 2, 0, 4] },
  contactLine: { fontSize: 9, color: colors.muted },
  sectionTitle: {
    fontSize: 12,
    bold: true,
    color: colors.heading,
    margin: [0, spacing.sectionGapBefore, 0, spacing.sectionGapAfter],
  },
  itemTitle: { fontSize: 10.5, bold: true, color: colors.text },
  itemMeta: { fontSize: 9, color: colors.muted, italics: true },
  bullet: { fontSize: 9.5, color: colors.text },
  body: { fontSize: 9.5, color: colors.text },
};

// A divider line drawn under each section title, kept as a canvas element so it
// can be reused by every section without duplicating the geometry.
function sectionDivider() {
  return {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 515,
        y2: 0,
        lineWidth: 0.75,
        lineColor: colors.divider,
      },
    ],
    margin: [0, 0, 0, spacing.sectionGapAfter],
  };
}

// Standard section header block: title text + divider, used at the top of
// every section file for a consistent look.
function sectionHeader(title) {
  return [{ text: title.toUpperCase(), style: "sectionTitle" }, sectionDivider()];
}

module.exports = {
  colors,
  fonts,
  spacing,
  namedStyles,
  sectionHeader,
};
