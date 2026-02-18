import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export function createCVTemplate(root: string): HandlebarsTemplateDelegate {
  Handlebars.registerHelper("trim", (str: string) => str.trim());

  const dir = path.join(root, "src/partials");
  for (const file of fs.readdirSync(dir)) {
    const name = path.basename(file, ".html");
    Handlebars.registerPartial(name, fs.readFileSync(path.join(dir, file), "utf8"));
  }

  return Handlebars.compile("{{> cv}}");
}
