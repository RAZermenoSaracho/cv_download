// Name, title, and contact info block at the top of the CV.

function headerSection() {
  return [
    { text: "Ricardo Arturo Zermeño Saracho", style: "name" },
    { text: "Software Engineer — DeFi & Quantitative Systems", style: "titleLine" },
    {
      text: [
        "+52 55 3360 9029  ·  ",
        "ricardozs_96@hotmail.com",
        "  ·  ",
        { text: "razs.vercel.app", link: "https://razs.dev" },
        "  ·  ",
        {
          text: "linkedin.com/in/ricardo-zermeno",
          link: "https://linkedin.com/in/ricardo-zermeno",
        },
      ],
      style: "contactLine",
    },
    {
      text: "Mexico City, Mexico · Open to Remote",
      style: "contactLine",
      margin: [0, 2, 0, 8],
    },
  ];
}

module.exports = headerSection;