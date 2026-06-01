# BG3 Act 1 Checklist

Static browser-based checklist for a Baldur's Gate 3 Act 1 playthrough. The site uses Next.js App Router, exports static files for GitHub Pages, and stores progress in browser `localStorage`.

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
3. Add a locale-specific generated dataset at `locales/<locale>/checklist-data.json`.
4. Register that dataset in `features/checklist/data.ts`.
5. Run lint and build.

Generated English data can be refreshed from a locally downloaded source page:

```bash
node scripts/extract-checklist.mjs /tmp/bg3-act1.html locales/en/checklist-data.json
node scripts/enrich-item-tooltips.mjs locales/en/checklist-data.json
```

The enrichment command fetches external wiki pages.
