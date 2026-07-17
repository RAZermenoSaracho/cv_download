module.exports = {
  apps: [
    {
      name: "cv-download-api",
      cwd: "/Users/razs/production/cv_download",
      script: "node",
      args: "src/server.js",
      interpreter: "none",
      env: {
        PORT: 8421,
      },
      autorestart: true,
      watch: false,
    },
  ],
};
