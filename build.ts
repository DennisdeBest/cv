import fs from "fs";
import path from "path";
import { loadCVData } from "./src/data.js";
import { loadIcons } from "./src/icons.js";
import { loadClientScript } from "./src/transpile.js";
import { createCVTemplate } from "./src/templates.js";

const ROOT = import.meta.dirname;
const read = (file: string): string => fs.readFileSync(path.join(ROOT, file), "utf8");

const enDevData = loadCVData(ROOT, "data/en_dev.yaml");
const frDevData = loadCVData(ROOT, "data/fr_dev.yaml");
const enDevopsData = loadCVData(ROOT, "data/en_devops.yaml");
const frDevopsData = loadCVData(ROOT, "data/fr_devops.yaml");
const icons = loadIcons(ROOT);
const clientJs = loadClientScript(ROOT);
const cvTemplate = createCVTemplate(ROOT);

const templateData = (data: typeof enDevData) => ({ ...data, icons });
const cvEnDev = cvTemplate(templateData(enDevData));
const cvFrDev = cvTemplate(templateData(frDevData));
const cvEnDevops = cvTemplate(templateData(enDevopsData));
const cvFrDevops = cvTemplate(templateData(frDevopsData));

const output = read("src/template.html")
  .replace("{{CSS}}", read("style.css"))
  .replace("{{JS}}", clientJs)
  .replace("{{CV_EN_DEV}}", cvEnDev)
  .replace("{{CV_FR_DEV}}", cvFrDev)
  .replace("{{CV_EN_DEVOPS}}", cvEnDevops)
  .replace("{{CV_FR_DEVOPS}}", cvFrDevops);

const distDir = path.join(ROOT, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.writeFileSync(path.join(distDir, "index.html"), output);
fs.copyFileSync(
  path.join(ROOT, enDevData.avatar),
  path.join(distDir, enDevData.avatar),
);

console.log("Build complete: dist/index.html");
