// @ts-check

const fs = require("fs");
const { minify } = require("terser");
const html = fs.readFileSync(`${__dirname}/../index.html`, "utf8");
const script = fs.readFileSync(`${__dirname}/../avatarIds.js`, "utf8");
minify(script, {
  mangle: true,
  compress: true,
  ecma: 2020,
  format: { quote_style: 1 },
}).then(({ code }) => {
  if (!code) return;
  const bookmarklet = "javascript:" + code;
  fs.mkdirSync(`${__dirname}/../dist`, { recursive: true });
  fs.writeFileSync(
    `${__dirname}/../dist/index.html`,
    html.replaceAll(/javascript:/g, bookmarklet),
  );
});
