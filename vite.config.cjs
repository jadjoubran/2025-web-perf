const { defineConfig } = require("vite");
const { viteStaticCopy } = require("vite-plugin-static-copy");
const path = require("path");

module.exports = defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "header.html", dest: "" },
        { src: "slider.html", dest: "" },
        { src: "content.html", dest: "" },
        { src: "footer.html", dest: "" },
        { src: "img/*", dest: "img/" },
        { src: "css/*", dest: "css/" },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        contentDetails: path.resolve(__dirname, "contentDetails.html"),
      },
    },
  },
});
