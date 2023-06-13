module.exports = {
  apps: [{
    name: "3C Cloud",
    script: "dist/app.js",
    //watch: false,
    ignore_watch: ["node_modules", "**/locales/**", "dist/constants/locales/en.json", "*.json"],
  }]
}
