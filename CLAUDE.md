# CLAUDE.md - BG3 Checklist
<!-- Claude Code companion instructions | updated: 2026-06-01 -->

This file is the Claude Code entry point. Read `AGENTS.md` before making changes: it is the project source of truth for architecture, scope, commands, persistence keys, generated data, and definition of done.

## Project snapshot

- Static **Next.js 16.2.6** App Router site for a Baldur's Gate 3 Act 1 checklist.
- **React 19.2.4**, strict TypeScript, Tailwind CSS 4, shadcn/ui, `radix-ui`, and `lucide-react`.
- Interactive feature code lives in `features/checklist/` and `components/checklist-app.tsx`.
- Browser state is stored in `localStorage`; there is no backend, API layer, database, auth, or server-state library.
- Generated checklist content lives in `lib/checklist-data.json`.
- Production uses `output: "export"` and deploys `out/` to GitHub Pages through `.github/workflows/deploy-pages.yml`.
- Use npm only. The available validation commands are `npm run lint` and `npm run build`.

## Claude Code rules

### Tools
- Use dedicated tools when available: `Read` for file reads, `Edit` for targeted changes, `Write` for new files, `Glob` for file discovery, and `Grep` for content search.
- Reserve Bash for terminal operations such as `git`, `npm`, and `node`.
- Read files before editing them.
- Run independent reads and searches in parallel where practical.

### Planning and edits
- For non-trivial work, inspect the repository and enter plan mode before writing code.
- Prefer targeted edits over full-file rewrites.
- Do not reformat unrelated code or add commentary to code you did not change.
- Do not invent missing requirements, modules, or infrastructure.
- Preserve unrelated user changes in a dirty worktree.

### Git
- Never commit, push, or create a pull request unless the user explicitly asks.
- Stage files by name; do not use `git add .` or `git add -A`.
- Never use `--no-verify`, `--force`, or `--amend` unless explicitly instructed.
- Never force-push `main` or `master`.

### Generated data and network access
- Treat `lib/checklist-data.json` as generated content.
- Use `node scripts/extract-checklist.mjs /tmp/bg3-act1.html lib/checklist-data.json` for extraction from local HTML.
- Ask the user immediately before running `node scripts/enrich-item-tooltips.mjs lib/checklist-data.json`; it fetches external wiki pages.
- Review generated JSON diffs and validate with lint and build.

### Validation
- Run `npm run lint` and `npm run build` after code changes.
- Do not invoke nonexistent scripts such as `npm run typecheck`, `npm run test`, `npm run test:e2e`, or Docker commands.
- State clearly that automated tests are not configured if coverage would otherwise be expected.
- Do not run `npm run dev` or another watch process unless browser verification or the user request needs it.

### Task tracking
- Use task tracking for work with three or more distinct steps.
- Mark work complete only after required validation passes or any unresolved blocker is reported clearly.
