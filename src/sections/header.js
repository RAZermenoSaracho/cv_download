// Name, title, and contact info block at the top of the CV.

function headerSection(content) {
  return [
    { text: content.name, style: "name" },
    { text: content.title, style: "titleLine" },
    {
      text: [
        `${content.phone}  ·  `,
        content.email,
        "  ·  ",
        { text: content.website.text, link: content.website.link },
        "  ·  ",
        { text: content.linkedin.text, link: content.linkedin.link },
      ],
      style: "contactLine",
    },
    {
      text: content.location,
      style: "contactLine",
      margin: [0, 2, 0, 8],
    },
  ];
}

module.exports = headerSection;
