# BG3 Checklist

Static browser-based checklist for a Baldur's Gate 3 playthrough. The site uses Next.js App Router, exports static files for GitHub Pages, and stores progress in browser `localStorage`.

## Development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm run build
```

## Internationalization

The app uses `next-intl`. English is the default locale and is exported at both `/` and `/en`.

To add another locale:

1. Add the locale to `i18n/routing.ts`.
2. Add `locales/<locale>/messages.json`.
3. Add the locale-specific generated datasets under `locales/<locale>/`.
4. Register that dataset in `features/checklist/data.ts`.
5. Run lint and build.

Generated English data can be refreshed from a locally downloaded source page:

```bash
node scripts/extract-checklist.mjs /tmp/bg3-act1.html locales/en/checklist-data.json
node scripts/enrich-item-tooltips.mjs locales/en/checklist-data.json
node scripts/extract-checklist.mjs /tmp/bg3-act2.html locales/en/act-2-checklist-data.json https://gamestegy.com/post/bg3/1639/act-2-checklist
node scripts/enrich-item-tooltips.mjs locales/en/act-2-checklist-data.json
node scripts/extract-checklist.mjs /tmp/bg3-act3.html locales/en/act-3-checklist-data.json https://gamestegy.com/post/bg3/1641/act-3-checklist
node scripts/enrich-item-tooltips.mjs locales/en/act-3-checklist-data.json
```

The enrichment command fetches external wiki pages.
