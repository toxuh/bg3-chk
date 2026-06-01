# AGENTS.md - BG3 Checklist
<!-- project-specific instructions | updated: 2026-06-01 -->

## 0) Project brief

### Summary
- Name: **BG3 Act 1 Checklist**
- Description: static browser-based checklist for a Baldur's Gate 3 Act 1 playthrough.
- Audience: players who want to track quests, items, and locations during a personal run.
- Primary goal: keep the checklist fast, usable on desktop and mobile, and deployable as a static GitHub Pages site.

### Current scope
- Act 1 checklist only. Acts 2 and 3 are visible as locked navigation placeholders.
- Search across checklist item names, descriptions, and group paths.
- Completion progress, collapsed groups, and the "hide completed" preference persisted in the browser.
- Desktop and mobile embedded maps, item details dialog, wiki links, and tooltip metadata.
- Checklist data extracted from the Gamestegy Act 1 checklist and committed as generated JSON.

### Out of scope unless explicitly requested
- Accounts, authentication, backend APIs, databases, cross-device sync, analytics, and infrastructure provisioning.
- Server-side runtime features. The production target is a static export.
- Changes to `.github/workflows/deploy-pages.yml` unless the task is deployment-related.

## 1) Actual stack

- Framework: **Next.js 16.2.6** with App Router.
- UI runtime: **React 19.2.4** and TypeScript with `strict: true`.
- Styling: **Tailwind CSS 4**, `tw-animate-css`, and shadcn/ui primitives.
- UI primitives: generated shadcn components in `components/ui/`, backed by `radix-ui`.
- Icons: `lucide-react`.
- Fonts: Geist, Geist Mono, DM Sans, and Roboto Slab through `next/font/google`.
- State: React hooks plus browser `localStorage`; there is no server state layer.
- Data: committed locale-specific JSON in `locales/en/checklist-data.json`; there is no API, ORM, or database.
- Internationalization: `next-intl` with ICU messages in `locales/<locale>/messages.json`.
- Package manager: **npm only**. `package-lock.json` is the source of truth.
- Deployment: static export to **GitHub Pages** through `.github/workflows/deploy-pages.yml`.

Do not introduce axios, React Query, zod, Prisma, auth providers, or a backend layer unless a new requirement actually needs them.

## 2) Repository map

- `app/(default)/layout.tsx` and `app/(default)/page.tsx` - unprefixed default-locale route.
- `app/[locale]/` - statically generated prefixed routes for additional locales.
- `app/root-document.tsx` - shared fonts, root document, and `NextIntlClientProvider`.
- `components/checklist-app.tsx` - top-level interactive checklist composition.
- `components/ui/` - shadcn-generated reusable UI primitives.
- `features/checklist/` - checklist feature components, types, generated-data adapter, and persistence hooks.
- `i18n/` - `next-intl` routing, request config, and message-key typing.
- `locales/<locale>/messages.json` - localized UI messages.
- `locales/<locale>/checklist-data.json` - generated and committed locale-specific checklist dataset.
- `lib/utils.ts` - shared `cn()` class utility.
- `scripts/extract-checklist.mjs` - parses a locally downloaded source HTML file into checklist JSON.
- `scripts/enrich-item-tooltips.mjs` - enriches item entries by fetching linked wiki pages.
- `next.config.ts` - static export configuration and GitHub Pages `basePath`.
- `.github/workflows/deploy-pages.yml` - build and deploy workflow for GitHub Pages.

Keep checklist-specific code in `features/checklist/`. Keep `components/ui/` limited to reusable primitives.

## 3) Architecture and data flow

### Rendering
- Route-level `page.tsx` files stay small Server Components.
- `components/checklist-app.tsx` is the client boundary because the checklist is interactive and browser-persisted.
- Push new client-only logic down to the smallest practical component or hook.
- Preserve `output: "export"` compatibility: do not add runtime server dependencies without changing the deployment design explicitly.

### Checklist data
- Treat `locales/<locale>/checklist-data.json` as generated content, not as a hand-maintained source file.
- UI-facing data access goes through `features/checklist/data.ts`.
- Shared item and group contracts live in `features/checklist/types.ts`.
- If the generated JSON shape changes, update the extraction script, TypeScript interfaces, adapter, and affected UI together.
- The dataset currently originates from `https://gamestegy.com/post/bg3/1633/act-1-checklist`.

### Internationalization
- Keep user-facing UI copy in `locales/<locale>/messages.json` and use `next-intl` translations in feature components.
- The unprefixed `/` route is the default locale. Additional locales are statically generated with locale prefixes.
- Add each new locale to `i18n/routing.ts`, then add both `messages.json` and `checklist-data.json` under its locale directory.
- Keep locale routing compatible with `output: "export"`: do not add middleware-dependent redirects for production behavior.

### Browser persistence
The hooks under `features/checklist/` own the local persistence contract:

| State | Storage key |
| --- | --- |
| Completed items | `bg3-act-1-checklist-progress` |
| Collapsed groups | `bg3-act-1-checklist-collapsed-groups` |
| Hide completed | `bg3-act-1-checklist-hide-completed` |

- Keep persisted values backward-compatible where practical.
- Validate restored item and group IDs against the current generated dataset.
- Preserve the custom browser events used to synchronize same-tab updates.
- Use `useSyncExternalStore` with a server snapshot for browser-backed state.
- Keep the mounted-state fallback to avoid hydration mismatches.

### External content
- The UI embeds and links to external Gamestegy pages. Keep iframe titles and external-link attributes accessible.
- `scripts/enrich-item-tooltips.mjs` performs external network requests. Ask the user immediately before running it.
- `scripts/extract-checklist.mjs` reads local HTML by default and does not fetch the source page itself.

## 4) Code style

- Use English for code, comments, docs, UI copy, issues, PRs, and commit messages unless localization is explicitly requested.
- Use Russian in CLI chat with the user.
- Prefer minimal diffs and no unrelated refactors.
- Use `const`; use `let` only when reassignment is needed.
- Prefer arrow functions for new functions and components. Existing Next.js framework exports may keep their current function declarations.
- Follow the existing import layout: external dependencies, blank line, then internal `@/` imports.
- Reuse the `@/*` alias configured in `tsconfig.json`.
- Follow the formatting style of the file being edited. Do not reformat unrelated code.
- Define non-trivial component props with `interface Props` and consume them as `Readonly<Props>`.

## 5) UI and accessibility

- Prefer existing shadcn primitives from `components/ui/` before adding a new primitive.
- Before adding a custom replacement for a common control, check `https://ui.shadcn.com/llms.txt`.
- Preserve the current dark stone-and-amber visual language unless a redesign is requested.
- Keep keyboard access, semantic controls, visible focus states, iframe titles, and descriptive `aria-label` text.
- Test desktop and mobile behavior when touching toolbar layout, item details, or maps.
- Do not expose secrets, unsafe HTML, raw errors, or internal-only details in the UI.

## 6) Data refresh workflow

Run extraction only when checklist source content needs to be refreshed:

```bash
node scripts/extract-checklist.mjs /tmp/bg3-act1.html locales/en/checklist-data.json
node scripts/enrich-item-tooltips.mjs locales/en/checklist-data.json
```

- The first command requires a source HTML file downloaded separately.
- The second command accesses external linked pages and requires user confirmation immediately before execution.
- Review the resulting JSON diff. Do not assume source markup or item IDs are stable.
- Run lint and build after regenerating the dataset.

## 7) Commands

Only document and invoke scripts that actually exist in `package.json`:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

- Use `npm ci` for clean CI-style installs.
- `npm run build` writes the static export to `out/`.
- `PAGES_BASE_PATH` is supplied by the GitHub Pages workflow during deployment.
- There is currently no dedicated `typecheck`, test, coverage, accessibility-lint, E2E, Docker, or bundle-analysis command.
- Do not claim tests passed when a test harness does not exist.

## 8) Definition of done

For every code change:
1. Inspect the affected feature files before editing.
2. Keep the change scoped to the requested behavior.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Verify generated output remains compatible with static export.
6. For UI behavior changes, manually verify the affected desktop and mobile flow when a browser is available.
7. Report missing automated coverage honestly; add test tooling only when explicitly requested or justified by task scope.

For feature-complete UI work, also report relevant performance checks if tooling is available. Do not invent Lighthouse or bundle results.

## 9) Safety and workflow

- Inspect before editing. Do not invent missing modules, APIs, or requirements.
- Preserve unrelated user changes in a dirty worktree.
- Never commit, push, open a PR, or modify deployment configuration unless the user explicitly asks.
- Commit only `.env.example` templates. Never commit secrets, tokens, credentials, or private keys.
- Avoid unrelated dependency changes. Major upgrades require migration notes and a validation checklist.
- Keep durable architecture or contract decisions in repository docs when new complexity is introduced.
