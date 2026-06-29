import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

function git(command, fallback) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

const commitCount = git("git rev-list --count HEAD", "0");
const shortHash = git("git rev-parse --short HEAD", "local");
const version = `1.0.${commitCount}+${shortHash}`;
const generatedAt = new Date().toISOString();

mkdirSync("apps/web/lib", { recursive: true });
writeFileSync(
  "apps/web/lib/version.generated.ts",
  `// Plik generowany automatycznie. Nie edytuj ręcznie.\nexport const APP_VERSION = ${JSON.stringify(version)};\nexport const APP_BUILD_DATE = ${JSON.stringify(generatedAt)};\n`,
);

console.log(`Wygenerowano wersję ${version}`);
