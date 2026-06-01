import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SOURCE_URL = "https://gamestegy.com/post/bg3/1633/act-1-checklist";
const inputPath = resolve(process.argv[2] ?? "/tmp/bg3-act1.html");
const outputPath = resolve(process.argv[3] ?? "locales/en/checklist-data.json");
const html = readFileSync(inputPath, "utf8");
const articleStart = html.indexOf('<div id="post-body-text"');
const articleEnd = html.indexOf('<div class="reactions-panel"', articleStart);

if (articleStart === -1 || articleEnd === -1) {
  throw new Error("Could not locate the checklist article in the source HTML.");
}

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
    .replace(/&gt;/g, ">");

const stripTags = (value) =>
  decodeEntities(
    value
      .replace(/<img\b[^>]*>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|li|ul|ol|div)>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const absoluteUrl = (value) => {
  if (!value) {
    return null;
  }

  return new URL(decodeEntities(value), SOURCE_URL).toString();
};

const attribute = (value, name) => {
  const match = value.match(new RegExp(`${name}="([^"]+)"`, "i"));
  return match?.[1] ?? null;
};

const tokens = html
  .slice(articleStart, articleEnd)
  .match(/<h[234]\b[\s\S]*?<\/h[234]>|<table\b[\s\S]*?<\/table>/gi);

if (!tokens) {
  throw new Error("No checklist tables were found in the source HTML.");
}

const headingPath = [];
const groups = [];

for (const token of tokens) {
  const headingMatch = token.match(/^<h([234])\b[^>]*>([\s\S]*?)<\/h\1>$/i);

  if (headingMatch) {
    const level = Number(headingMatch[1]) - 2;
    const title = stripTags(headingMatch[2]);

    if (title) {
      headingPath[level] = title;
      headingPath.length = level + 1;
    }

    continue;
  }

  const rows = [...token.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const items = rows
    .map((row) => {
      const cells = [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
        (cell) => cell[1],
      );
      const id = attribute(row[1], "data-checklist-item-found-id");

      if (!id || cells.length < 3) {
        return null;
      }

      const nameCell = cells[1];
      const infoCell = cells[2];
      const locationCell = cells[3] ?? "";
      const itemAnchor = nameCell.match(
        /<a\b[^>]*data-bg3-type="(?:equipment|other-item)"[^>]*>/i,
      );
      const image = nameCell.match(/<img\b[^>]*class="[^"]*bg3-icon-block[^"]*"[^>]*>/i);
      const mapAnchor = locationCell.match(/<a\b[^>]*class="[^"]*bg3-map-marker[^"]*"[^>]*>/i);
      const name = stripTags(nameCell);

      return {
        id,
        name,
        description: stripTags(infoCell),
        imageUrl: absoluteUrl(image ? attribute(image[0], "src") : null),
        itemUrl: absoluteUrl(itemAnchor ? attribute(itemAnchor[0], "href") : null),
        mapUrl: absoluteUrl(mapAnchor ? attribute(mapAnchor[0], "href") : null),
      };
    })
    .filter(Boolean);

  if (items.length > 0) {
    groups.push({
      id: `group-${groups.length + 1}`,
      path: [...headingPath],
      title: headingPath.at(-1) ?? "Checklist",
      items,
    });
  }
}

const output = {
  sourceUrl: SOURCE_URL,
  extractedAt: new Date().toISOString(),
  groups,
};

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

const totalItems = groups.reduce((total, group) => total + group.items.length, 0);
console.log(`Extracted ${totalItems} items across ${groups.length} groups to ${outputPath}`);
