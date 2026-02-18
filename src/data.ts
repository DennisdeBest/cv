import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { cvDataSchema, type CVData } from "./schema.js";

export function loadCVData(root: string, file: string): CVData {
  const raw = yaml.load(fs.readFileSync(path.join(root, file), "utf8"));
  const result = cvDataSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`${file}: invalid CV data\n${issues}`);
  }
  return result.data;
}
