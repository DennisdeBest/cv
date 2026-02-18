import fs from "fs";
import path from "path";
import { loadCVData } from "./src/data.js";
import { loadIcons } from "./src/icons.js";
import { loadClientScript } from "./src/transpile.js";
import { createCVTemplate } from "./src/templates.js";

const ROOT = import.meta.dirname;
const read = (file: string): string => fs.readFileSync(path.join(ROOT, file), "utf8");

const enData = loadCVData(ROOT, "data/en.yaml");
const frData = loadCVData(ROOT, "data/fr.yaml");
const icons = loadIcons(ROOT);
const clientJs = loadClientScript(ROOT);
const cvTemplate = createCVTemplate(ROOT);

const templateData = (data: typeof enData) => ({ ...data, icons });
const cvEn = cvTemplate(templateData(enData));
const cvFr = cvTemplate(templateData(frData));

const output = read("src/template.html")
  .replace("{{CSS}}", read("style.css"))
  .replace("{{JS}}", clientJs)
  .replace("{{CV_EN}}", cvEn)
  .replace("{{CV_FR}}", cvFr);

const distDir = path.join(ROOT, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.writeFileSync(path.join(distDir, "index.html"), output);
fs.copyFileSync(
  path.join(ROOT, enData.avatar),
  path.join(distDir, enData.avatar),
);

console.log("Build complete: dist/index.html");
