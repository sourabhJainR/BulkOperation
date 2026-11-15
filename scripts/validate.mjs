import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const manifest = JSON.parse(fs.readFileSync(path.join(root, "extension/manifest.json"), "utf8"));
if (manifest.manifest_version !== 3) throw new Error("Manifest V3 is required.");
for (const file of [...manifest.content_scripts.flatMap(x => x.js || []), ...manifest.content_scripts.flatMap(x => x.css || []), manifest.background.service_worker, manifest.action.default_popup]) {
  if (!fs.existsSync(path.join(root, "extension", file))) throw new Error("Missing extension asset: " + file);
}
for (const file of ["content.js", "service-worker.js", "popup.js"]) {
  const source = fs.readFileSync(path.join(root, "extension", file), "utf8");
  new vm.Script(source, { filename: file });
}
if ((manifest.permissions || []).includes("webRequest") || (manifest.permissions || []).includes("debugger")) {
  throw new Error("Unexpected high-risk browser permission.");
}
console.log("BulkOperation package validation passed.");