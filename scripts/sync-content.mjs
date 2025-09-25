#!/usr/bin/env node
import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, "..");
  const defaultSource = path.join(
    process.env.HOME ?? "",
    "Jubensha",
    "Pelit",
    "NKL2068",
    "1) Taustavaihe",
  );

  const sourceArg = process.argv[2];
  const sourceDir = path.resolve(sourceArg ?? defaultSource);
  const targetDir = path.join(repoRoot, "content");

  const isMarkdown = (fileName) => fileName.toLowerCase().endsWith(".md");

  try {
    const stats = await stat(sourceDir);
    if (!stats.isDirectory()) {
      throw new Error(`Source path is not a directory: ${sourceDir}`);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error accessing source";
    console.error(`✖ Unable to access source content directory: ${message}`);
    process.exit(1);
  }

  try {
    await rm(targetDir, { recursive: true, force: true });
    await mkdir(targetDir, { recursive: true });

    const entries = await readdir(sourceDir, { withFileTypes: true });
    let copiedCount = 0;

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      if (!isMarkdown(entry.name)) {
        continue;
      }

      if (entry.name.includes(".9")) {
        continue;
      }

      const fromPath = path.join(sourceDir, entry.name);
      const toPath = path.join(targetDir, entry.name);
      await copyFile(fromPath, toPath);
      copiedCount += 1;
    }

    if (copiedCount === 0) {
      console.warn("⚠ No markdown files found to copy");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during copy";
    console.error(`✖ Failed to copy content: ${message}`);
    process.exit(1);
  }

  console.log(`✔ Vault content refreshed from: ${sourceDir}`);
}

main();
