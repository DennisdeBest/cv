import fs from "fs";
import path from "path";
import ts from "typescript";

export function loadClientScript(root: string): string {
  const source = fs.readFileSync(path.join(root, "src/client/script.ts"), "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  });
  return result.outputText;
}
