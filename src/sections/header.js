// Name, title, and contact info block at the top of the CV.

const { colors } = require("../styles");

function headerSection() {
  return [
    { text: "Ricardo Arturo Zermeño Saracho", style: "name" },
    { text: "Software Engineer — DeFi & Quantitative Systems", style: "titleLine" },
    {
      text: [
        "+52 55 3360 9029  |  ",
        { text: "ricardozs_96@hotmail.com", color: colors.accent },
        "  |  ",
        { text: "razs.vercel.app", color: colors.accent, link: "https://razs.vercel.app" },
        "  |  ",
        {
          text: "linkedin.com/in/ricardo-zermeno",
          color: colors.accent,
          link: "https://linkedin.com/in/ricardo-zermeno",
        },
      ],
      style: "contactLine",
    },
    {
      text: "Mexico City, Mexico · Open to Remote",
      style: "contactLine",
      margin: [0, 2, 0, 0],
    },
  ];
}

module.exports = headerSection;
