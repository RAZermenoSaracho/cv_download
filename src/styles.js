// Shared pdfmake constants (colors, fonts, spacing) so every section renders
// consistently. Styled after the classic "Harvard" resume look: serif type,
// black/charcoal text, no color accents, hierarchy via size/weight/caps.

const colors = {
  heading: "#000000", // pure black for name and section titles
  text: "#1a1a1a", // main body text, near-black
  muted: "#3f3f3f", // secondary text (dates, locations, meta) — dark gray, not blue
  divider: "#000000", // section divider lines are black, thin
};

// pdfkit's built-in standard fonts, referenced by name so no TTF files need to
// be bundled with the project.
const fonts = {
  Times: {
    normal: "Times-Roman",
    bold: "Times-Bold",
    italics: "Times-Italic",
    bolditalics: "Times-BoldItalic",
  },
};

const spacing = {
  sectionGapBefore: 10,
  sectionGapAfter: 3,
  itemGap: 7,
};

const namedStyles = {
  name: {
    fontSize: 20,
    bold: true,
    color: colors.heading,
    alignment: "center",
    characterSpacing: 1,
  },
  titleLine: {
    fontSize: 10.5,
    italics: true,
    color: colors.muted,
    alignment: "center",
    margin: [0, 3, 0, 3],
  },
  contactLine: {
    fontSize: 9,
    color: colors.muted,
    alignment: "center",
  },
  sectionTitle: {
    fontSize: 10.5,
    bold: true,
    color: colors.heading,
    characterSpacing: 0.8,
    margin: [0, spacing.sectionGapBefore, 0, 2],
  },
  itemTitle: { fontSize: 10, bold: true, color: colors.text },
  itemMeta: { fontSize: 9.5, italics: true, color: colors.muted },
  bullet: { fontSize: 9.5, color: colors.text, lineHeight: 1.15 },
  body: { fontSize: 9.5, color: colors.text, lineHeight: 1.25 },
};

// A thin black rule drawn under each section title — the classic Harvard-style
// section divider, spanning the full text width (A4 with 40pt margins = 515pt).
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

// Standard section header block: uppercase title + divider, used at the top of
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