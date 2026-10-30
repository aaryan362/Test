"use strict";

const fs = require("fs");
const path = require("path");

const projectRoot = __dirname;
const distDirectory = path.resolve(projectRoot, "dist");
const publicDirectory = path.resolve(projectRoot, "public");
const siteFiles = ["index.html", "styles.css", "script.js"];

if (!distDirectory.startsWith(projectRoot + path.sep)) {
  throw new Error("The build output must stay inside the project directory.");
}

fs.rmSync(distDirectory, { recursive: true, force: true });
fs.mkdirSync(distDirectory, { recursive: true });

siteFiles.forEach((file) => {
  const source = path.join(projectRoot, file);
  if (!fs.existsSync(source)) {
    throw new Error("Required site file is missing: " + file);
  }
  fs.copyFileSync(source, path.join(distDirectory, file));
});

if (!fs.existsSync(publicDirectory)) {
  throw new Error("Required public directory is missing.");
}

fs.cpSync(publicDirectory, distDirectory, { recursive: true });
console.log("Static site built in dist/.");
