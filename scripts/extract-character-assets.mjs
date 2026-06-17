/**
 * Extract hero PNGs from the 2×3 character sheet into /public/characters/.
 * Run: npm run extract-assets
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const out = (p) => path.join(root, "public", p);

const CHARACTER_SHEET = path.join(
  root,
  "public/images/character-sheet.png"
);

const COLS = 3;
const ROWS = 2;

/** Skip name labels at the bottom of each cell; keep full character silhouette. */
const CELL_INSET = {
  top: 0,
  bottom: 0.24,
  left: 0.06,
  right: 0.06,
};

/** Usable grid — title banner is ~8% of sheet height. */
const SHEET_CONTENT = { top: 0.06, bottom: 0.99 };

const heroes = [
  { file: "characters/uncle-eugene.png", col: 0, row: 0 },
  { file: "characters/trace.png", col: 1, row: 0 },
  { file: "characters/hr-recruiter.png", col: 2, row: 0 },
  { file: "characters/young-founder.png", col: 0, row: 1 },
  { file: "characters/architect.png", col: 1, row: 1 },
  { file: "characters/reliability-guardian.png", col: 2, row: 1 },
];

function clampExtract(imgW, imgH, left, top, width, height) {
  const l = Math.max(0, Math.min(Math.floor(left), imgW - 1));
  const t = Math.max(0, Math.min(Math.floor(top), imgH - 1));
  const w = Math.max(1, Math.min(Math.floor(width), imgW - l));
  const h = Math.max(1, Math.min(Math.floor(height), imgH - t));
  return { left: l, top: t, width: w, height: h };
}

await mkdir(out("characters"), { recursive: true });

const meta = await sharp(CHARACTER_SHEET).metadata();
const W = meta.width ?? 682;
const H = meta.height ?? 1024;

const contentTop = Math.floor(H * SHEET_CONTENT.top);
const contentBottom = Math.floor(H * SHEET_CONTENT.bottom);
const contentH = contentBottom - contentTop;
const colWidth = W / COLS;
const rowHeight = contentH / ROWS;

for (const { file, col, row } of heroes) {
  const cellLeft = col * colWidth;
  const cellRight = col === COLS - 1 ? W : (col + 1) * colWidth;
  const cellTop = contentTop + row * rowHeight;
  const cellBottom = row === ROWS - 1 ? contentBottom : contentTop + (row + 1) * rowHeight;

  const rawW = cellRight - cellLeft;
  const rawH = cellBottom - cellTop;

  const region = clampExtract(
    W,
    H,
    cellLeft + rawW * CELL_INSET.left,
    cellTop + rawH * CELL_INSET.top,
    rawW * (1 - CELL_INSET.left - CELL_INSET.right),
    rawH * (1 - CELL_INSET.top - CELL_INSET.bottom)
  );

  await sharp(CHARACTER_SHEET)
    .extract(region)
    .png()
    .toFile(out(file));

  console.log("Wrote", file, region);
}

console.log("Hero extraction complete.");
