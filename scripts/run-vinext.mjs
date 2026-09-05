import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const command = process.argv[2];
if (!command) throw new Error("Usage: node scripts/run-vinext.mjs <dev|build|start> [...args]");

const cliPath = fileURLToPath(new URL("../node_modules/vinext/dist/cli.js", import.meta.url));
const child = spawn(process.execPath, [cliPath, command, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH ?? ".wrangler/wrangler.log",
  },
});

child.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
