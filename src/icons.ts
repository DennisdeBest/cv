import fs from "fs";
import path from "path";

export function loadIcons(root: string): Record<string, string> {
  const dir = path.join(root, "src/icons");
  const icons: Record<string, string> = {};
  for (const file of fs.readdirSync(dir)) {
    icons[path.basename(file, ".svg")] = fs
      .readFileSync(path.join(dir, file), "utf8")
      .trim();
  }
  return icons;
}
