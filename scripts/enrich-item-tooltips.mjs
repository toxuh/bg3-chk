import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const inputPath = resolve(process.argv[2] ?? "lib/checklist-data.json");
const checklist = JSON.parse(readFileSync(inputPath, "utf8"));
const items = checklist.groups.flatMap((group) => group.items);
const wikiItems = items.filter((item) => item.itemUrl);
const rarityPattern = /bg3-tt bg3-tt-([a-z-]+)/i;

const decodeEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const firstMatch = (html, pattern) => {
  const match = html.match(pattern);
  return match ? decodeEntities(match[1]) : null;
};

const parseTooltip = (html) => {
  const stats = [
    ...html.matchAll(/class="bg3-tooltip-information__stats-item"[^>]*>([^<]+)<\/span>/gi),
  ].map((match) => decodeEntities(match[1]));
  const rarity = firstMatch(html, rarityPattern);

  return {
    rarity: rarity ? rarity.replace(/(^|-)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`) : null,
    damage: firstMatch(html, /class="bg3-tooltip-info_damage-explanation"[^>]*>([^<]+)<\/div>/i),
    lore: firstMatch(html, /class="bg3-tooltip-information__lore"[\s\S]*?<span[^>]*>([^<]+)<\/span>/i),
    stats: [...new Set(stats)],
    weight: firstMatch(html, /class="bg3-tooltip-footer__item-weight-number"[^>]*>([^<]+)<\/span>/i),
    imageUrl: firstMatch(html, /class="bg3-tt-icon"[^>]*>\s*<img src="([^"]+)"/i),
  };
};

const enrichItem = async (item) => {
  try {
    const response = await fetch(item.itemUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    item.tooltip = parseTooltip(await response.text());
  } catch (error) {
    console.warn(`Skipped ${item.itemUrl}: ${error.message}`);
  }
};

const concurrency = 12;

for (let index = 0; index < wikiItems.length; index += concurrency) {
  await Promise.all(wikiItems.slice(index, index + concurrency).map(enrichItem));
  console.log(`Processed ${Math.min(index + concurrency, wikiItems.length)} / ${wikiItems.length}`);
}

writeFileSync(inputPath, `${JSON.stringify(checklist, null, 2)}\n`);
console.log(`Saved tooltips for ${wikiItems.filter((item) => item.tooltip).length} items.`);
