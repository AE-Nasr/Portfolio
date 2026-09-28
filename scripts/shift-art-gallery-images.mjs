/*
 * Shift numbered art gallery images from a starting number to the end.
 *
 * Usage:
 *   npm run gallery:shift -- 5 --dry-run
 *   npm run gallery:shift -- 5
 */

import { existsSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("..", import.meta.url)));
const DIRECTORY = join(
  ROOT,
  "public",
  "Assets",
  "art-gallery",
  "Images",
  "image_display_thumb",
);
const [startArgument, ...options] = process.argv.slice(2);
const start = Number(startArgument);
const dryRun = options.includes("--dry-run");

if (!existsSync(DIRECTORY)) {
  console.error(`Directory not found: ${DIRECTORY}`);
  process.exit(1);
}

if (!Number.isInteger(start) || start < 1) {
  console.error("Usage: npm run gallery:shift -- <start-number> [--dry-run]");
  process.exit(1);
}

const files = readdirSync(DIRECTORY)
  .map((name) => {
    const match = /^(\d+)\.webp$/i.exec(name);
    return match ? { name, number: Number(match[1]) } : null;
  })
  .filter((file) => file && file.number >= start)
  .sort((left, right) => right.number - left.number);

if (files.length === 0) {
  console.log(`No numbered .webp files found from ${start} onward.`);
  process.exit(0);
}

const changes = files.map(({ name, number }) => ({
  from: name,
  to: `${number + 1}.webp`,
}));

for (const { from, to } of changes) console.log(`${from} -> ${to}`);

if (dryRun) {
  console.log("Dry run only. No files were changed.");
  process.exit(0);
}

const temporaryChanges = changes.map(({ from, to }, index) => ({
  from,
  temporary: `.__shift-art-gallery-${index}-${from}`,
  to,
}));

for (const { from, temporary } of temporaryChanges)
  renameSync(join(DIRECTORY, from), join(DIRECTORY, temporary));
for (const { temporary, to } of temporaryChanges)
  renameSync(join(DIRECTORY, temporary), join(DIRECTORY, to));

console.log(
  `Renamed ${changes.length} image${changes.length === 1 ? "" : "s"}.`,
);
