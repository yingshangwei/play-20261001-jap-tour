import { readFile } from "node:fs/promises";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const isConfig = (url) => ["guides/", "app/guide-core/"].some((path) => url.startsWith(new URL(path, root).href));

// Load the actual typed configuration without a browser or an additional test dependency.
export async function resolve(specifier, context, nextResolve) {
  const url = specifier.startsWith("@/")
    ? new URL(specifier.slice(2), root)
    : specifier.startsWith(".") && context.parentURL ? new URL(specifier, context.parentURL) : null;
  if (!url || !isConfig(url.href)) return nextResolve(specifier, context);
  if (!/\.(?:ts|json)$/.test(url.pathname)) url.pathname += ".ts";
  return { url: url.href, shortCircuit: true };
}

export async function load(url, context, nextLoad) {
  if (!isConfig(url) || !/\.(?:ts|json)$/.test(url)) return nextLoad(url, context);
  const source = await readFile(new URL(url), "utf8");
  return {
    format: "module",
    source: url.endsWith(".json") ? `export default ${source};` : ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    shortCircuit: true,
  };
}
