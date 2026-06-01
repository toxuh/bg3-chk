# CLAUDE.MD — Frontend (Claude Code)
<!-- template-version: 1.1 | updated: 2026-02-24 -->

This file is the primary instruction source for **Claude Code** working on the Frontend.
It is fully standalone — no other file is required to be present in the project.

---

## 0) Purpose
This document defines **project structure** and **working agreements** for Claude Code working on the **Frontend** part of this repository.
Scope: **greenfield development from zero**.

Primary goals:
- Consistent architecture and code style across the codebase
- Safe, incremental changes
- No "phantom code": do not invent missing parts
- Stack is configurable via **STACK SWITCHBOARD**

---

## 0.1 Project brief (filled before active development)
Use this section as a boilerplate and update it as project details become clear.

### Project summary
- Name:
- One-line description:
- Target users/audience:
- Primary business goal:

### Scope and boundaries
- In scope (MVP):
- Out of scope:
- Key assumptions:
- Constraints (legal/compliance/perf/budget/time):

### Technology choices (project-specific)
- Frontend framework/version:
- UI stack:
- Data/state stack:
- Auth mode:
- Database/ORM (if fullstack):
- Deployment target:

### Architecture snapshot
- Architecture style (frontend-only / fullstack / hybrid):
- Main modules/features:
- Data flow overview (UI → hooks → services → repositories/api):
- External integrations:
- Critical technical decisions:

### Quality and delivery
- Definition of done overrides (if any):
- Testing focus for this project:
- Performance targets (feature-complete checks):
- Security priorities:
- Accessibility priorities:

### Workflow specifics
- Branch/PR conventions:
- Release cadence:

---

## 1) STACK SWITCHBOARD

### 1.1 Runtime & Framework
- Frontend Framework: **Next.js** (prefer project-defined current stable)
- UI Library: **React** (prefer project-defined current stable)
- Language: **TypeScript** (prefer `strict: true`)

### 1.2 Styling & UI
- CSS: **Tailwind CSS** (prefer project-defined current stable)
- UI Kit: **shadcn/ui**
- Icons: (optional) lucide-react
- Date: **dayjs**
- Reference index for agents: `https://ui.shadcn.com/llms.txt`

### 1.3 Data fetching and state
- HTTP: **axios**
- Server state: **@tanstack/react-query**
- Forms: **react-hook-form**
- Validation: **zod**

### 1.4 Auth (select one)
- Auth Provider: **Clerk** OR **Auth.js** OR **better-auth**
- `AUTH_MODE = "clerk" | "authjs" | "betterauth"`

### 1.5 Data layer (for fullstack apps)
- ORM: **Prisma**
- Database: **PostgreSQL**
- Prefer keeping Prisma schema and migrations as a source of truth for DB contracts

### 1.6 Package Manager (policy)
- Package manager: **npm only**
- Lockfile: `package-lock.json` is source of truth

### 1.7 Deployment targets (contextual)
- Primary: **Vercel**
- Secondary/optional: **DigitalOcean** (only if explicitly required)

---

## 2) Agent rules

### 2.A Communication and language (soft rules)
- Use English for all project artifacts by default: code comments, docs, issues, PR text, commit messages, and UI copy unless a task explicitly requires localization.
- In CLI chat with the user, use Russian.
- If localization is required, keep source/base copy in English and add localized content per project i18n setup.

### 2.1 Do not hallucinate code
If you need more context (a file, a component, a hook, a service), first inspect the repository for a source of truth.
If still ambiguous, **ask for it**. Do not invent missing parts.

### 2.2 Change safety
- Prefer minimal diffs
- Prefer no unrelated refactors
- If touching API contracts, update types + validation + UI handling

### 2.3 "Do not start" restrictions (until explicitly enabled)
Prefer to avoid implementing or modifying the following unless the project has explicit setup and the task requires it:
- Infrastructure provisioning (Terraform/Pulumi) — **not enabled**
- Analytics connectors (GA4/Amplitude/etc.) — **not enabled**
- Observability dashboards (Grafana/Prometheus) — only if a task is about infra-debug
- DO-specific deploy scripts — only if the task is DO-related
- CI/CD pipeline authoring (GitHub Actions/GitLab CI/etc.) — only if explicitly requested

### 2.4 MCP connectors in scope (allowed)
Allowed integrations in this project context:
- GitHub
- GitHub Actions
- Vercel (contextual)
- DigitalOcean (contextual)
- PostgreSQL / Redis (backend-owned, only used for contract checking)
- Sentry (for errors affecting UI)
- Notion (docs/spec)
- Vault (secrets policy)
- OpenAI (vectors policy; usually backend-owned)

If a task requires a connector not in the list — pause and ask.

### 2.5 Network access policy (soft rule)
- "Network access" in this rule means: calling external third-party APIs or services **not already part of the project stack** (e.g., scraping external URLs, calling arbitrary public APIs, sending data to external services mid-task).
- Normal project API calls (backend, auth provider, configured MCP connectors) are **not subject to this rule**.
- If a task requires access to an external service outside the project stack — request confirmation in CLI chat immediately before proceeding.

### 2.6 Environment and secrets policy (strict)
- Commit only `.env.example` templates to repository.
- Never commit real secrets, tokens, private keys, or production credentials.
- If a new environment variable is required, add it to `.env.example` with a clear description.

### 2.7 Dependency update policy (strict)
- Avoid unrelated dependency updates in feature/bugfix tasks.
- Prefer targeted updates only for packages required by the current task.
- Major version upgrades must include migration notes and an explicit validation checklist.

### 2.8 Accessibility policy (strict)
- Accessibility checks are required in development, not only post-factum.
- Prefer integrating `eslint-plugin-jsx-a11y` into lint pipeline.
- Run accessibility lint before each push (prefer automated pre-push hook).
- Build UI with keyboard navigation, visible focus states, and semantic/ARIA usage where needed.
- Prefer exposing accessibility lint via `npm run lint:a11y` (or include equivalent checks in `npm run lint`).

### 2.9 Security policy (strict)
- Never expose secrets/tokens in client code, logs, screenshots, or public error payloads.
- Prefer secure defaults for auth/session handling and transport (`https`, `httpOnly`, `secure`, `sameSite` where applicable).
- Sanitize/validate untrusted input at boundaries and avoid rendering unsafe HTML.
- If project uses custom JWT session management, implement a reliable automatic token refresh mechanism (library or equivalent robust implementation).

---

## 2.CC) Claude Code-specific rules

### 2.CC.1 Tool usage policy (strict)
Use dedicated tools instead of Bash equivalents whenever available:
- Read files → `Read` tool (not `cat`, `head`, `tail`)
- Edit files → `Edit` tool (not `sed`, `awk`)
- Create files → `Write` tool (not `echo >`, `cat <<EOF`)
- Find files → `Glob` tool (not `find`, `ls`)
- Search content → `Grep` tool (not `grep`, `rg`)
- Reserve `Bash` exclusively for terminal/system commands that have no dedicated tool (e.g., `git`, `npm`, `docker`)

### 2.CC.2 Plan mode policy (strict)
- For any non-trivial task, enter plan mode (`EnterPlanMode`) before writing code.
- Non-trivial = matches criteria in section 12 (multi-module, new feature, contract change, multi-session scope).
- In plan mode: explore codebase first, design approach, surface it for user approval via `ExitPlanMode`.
- Use `AskUserQuestion` to resolve ambiguity **before** finalizing the plan, not after.
- Do not use `AskUserQuestion` to ask "is the plan okay?" — that is what `ExitPlanMode` is for.

### 2.CC.3 File editing policy (strict)
- Always `Read` a file before editing it. Do not edit blind.
- Prefer `Edit` over `Write` for existing files to avoid accidental overwrites.
- Make targeted, minimal diffs. Do not reformat unrelated code.
- Do not add comments, docstrings, or type annotations to code you did not change.

### 2.CC.4 Parallel tool calls policy
- When multiple independent reads/searches are needed, call them in parallel in a single response.
- When tool calls depend on prior results, call them sequentially.
- Do not use sequential calls for operations that can safely run in parallel.

### 2.CC.5 Git policy (strict)
- **Never commit unless the user explicitly asks.**
- Stage specific files by name — do not use `git add -A` or `git add .`.
- Always pass commit message via HEREDOC:
  ```bash
  git commit -m "$(cat <<'EOF'
  feat: short description of change

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  ```
- Never use `--no-verify`, `--force`, `--amend` unless explicitly instructed.
- Never push to `main`/`master` with `--force`. Warn the user if they request it.
- When a pre-commit hook fails: fix the issue, re-stage, create a **new** commit — never amend.

### 2.CC.6 PR policy
- Use `gh pr create` for all pull requests.
- Always include: Summary (bullet points) + Test plan (checklist) + Claude Code attribution footer.
- Return the PR URL to the user after creation.

### 2.CC.7 Subagent (Task tool) policy
- Use the `Task` tool for: parallel independent research, deep codebase exploration, long-running isolated work.
- Do not duplicate work the subagent is already doing — delegate fully or not at all.
- Prefer `subagent_type=Explore` for broad codebase research.
- Prefer `subagent_type=Bash` for isolated terminal operations.
- Use `run_in_background=true` only when you have genuinely independent parallel work to continue in the meantime.

### 2.CC.8 Permission handling
- If a tool call is denied by the user, do not retry the exact same call.
- Reflect on why it was denied and adjust the approach, or ask the user via `AskUserQuestion`.

### 2.CC.9 Task list policy
- Use `TaskCreate` / `TaskUpdate` / `TaskList` for tasks with 3+ distinct steps.
- Mark a task `in_progress` before starting, `completed` only when fully done (tests pass, no errors).
- Do not mark completed if: tests fail, implementation is partial, unresolved errors remain.

---

## 3) Frontend architecture

### 3.1 App structure (default Next.js App Router)
- `app/` — routes, layouts, pages
- `components/` — reusable UI components
- `services/` — business logic, API clients
- `repositories/` — data-access layer (DB/API persistence adapters; mainly fullstack apps)
- `api/` — API client wrappers (axios) and typed calls
- `hooks/` — React Query hooks (thin, stateless)
- `lib/` — utilities, helpers, constants
- `types/` — shared types and schemas

> If a framework changes: keep `components/`, `services/`, `repositories/`, `api/`, `lib/`, `types/` conceptually stable.

### 3.2 MVC-ish separation (project policy)
- **api/**: transport layer (requests, DTOs)
- **repositories/**: data access and persistence operations
- **services/**: business logic (composition, mapping, rules)
- **components/**: presentation only
- Hooks: prefer thin glue; avoid heavy business logic in hooks

---

## 4) Code style (strict)

### 4.1 Functions
- **Arrow functions everywhere**
- `let` only if necessary; prefer `const`

### 4.2 Imports
- Imports separated by empty line:
    1) external libs
    2) internal modules/components
    3) styles (last)
- Order is enforced via `eslint-plugin-import` (rule `import/order`) or `@trivago/prettier-plugin-sort-imports`.
- Prefer whichever is already configured in the project; do not add both.

### 4.3 Components props policy
Prefer declaring props as:
```ts
interface Props {
  // ...
}

const ComponentName = (props: Readonly<Props>) => {
  // ...
};
```
Allowed exceptions:
- Generic components where `type` aliases are clearer
- `forwardRef` wrappers where React utility types improve readability
- Tiny local components where explicit props typing is still clear and safe

### 4.4 Formatting
- Prettier is the source of truth
- Don't fight formatting; apply project config

### 4.5 UI components policy (strict)
- Prefer `shadcn/ui` components by default for UI implementation.
- Do not build custom replacement components when an equivalent exists in `shadcn/ui`.
- Custom components are allowed only when:
  - no suitable `shadcn/ui` component exists, and
  - no widely adopted, production-ready external solution fits the requirement.
- Before creating a custom component, check `https://ui.shadcn.com/llms.txt` to verify current component availability and relevant docs links.

---

## 5) Data fetching conventions (React Query)
- Prefer a stateless approach with a cached server state
- Prefer one primary hook per endpoint shape:
  - useXQuery, useYMutation
- Query keys: stable and centrally defined (e.g., lib/queryKeys.ts)
- Axios client: single instance in api/http.ts
- Zod schemas: **validate server responses at API boundary** (required; skip only if the project has an explicit decision to use TypeScript types alone, documented in section 0.1)

---

## 6) Routing & rendering
- Keep SSR/CSR choices explicit:
  - default: Server Components for layout & static parts
  - Client Components only when needed (forms, interaction)
- Avoid mixing heavy client logic into server components

---

## 7) Error handling & observability (UI side)
- Wrap critical route segments and async boundaries with React `ErrorBoundary` (or Next.js `error.tsx`).
- Always show user-safe error messages; never expose raw server errors, stack traces, or internal IDs in the UI.
- Provide recoverable states where possible: retry button, fallback UI, or redirect — not a blank screen.
- If Sentry is enabled:
  - Add contextual breadcrumbs for key user flows
  - Capture errors at boundary level with `Sentry.captureException`
  - Tag errors with relevant context (route, user role, feature flag) where available
- Do not add Grafana/Prom metrics from frontend unless explicitly asked

---

## 8) Definition of Done (frontend)
A change is done when:
- TypeScript passes (tsc or Next build)
- Lint passes (if configured)
- Tests for affected behavior are added/updated and pass (if test setup exists)
- UI is consistent with shadcn/tailwind conventions
- Data fetching is typed and cached properly
- No broken routes/components
- For feature-complete tasks, performance checks are executed and results are included in the task summary.

## 8.1 Performance checks (feature-complete gate)
- Performance checks are required after full feature implementation, not on every small step.
- Prefer running bundle/performance validation for the completed feature scope before the final merge / release.
- Default baseline thresholds (override in section 0.1 if a project has stricter targets):
  - Lighthouse Performance score: **≥ 85** (mobile)
  - LCP (Largest Contentful Paint): **< 2.5s**
  - CLS (Cumulative Layout Shift): **< 0.1**
  - INP / TBT (Interaction to Next Paint / Total Blocking Time): **< 200ms**
  - JS bundle size increases per feature: **flag if > 50 kB gzipped**
- Preferred tools: Lighthouse CI, `next build` bundle analysis (`ANALYZE=true`), web-vitals library for runtime tracking.
- Include results (screenshot or report link) in the task summary before marking the work done.

---

## 9) Testing policy

### 9.1 Testing stack (preferred)
- Unit/integration runner: **Vitest**
- Component/UI tests: **@testing-library/react** + **@testing-library/user-event**
- API/network mocking: **MSW**
- E2E tests: **Playwright**
- API payload validation: **zod** schemas at boundaries (required; see section 5)

### 9.2 Test types and locations
- Unit tests: colocated as `*.test.ts` / `*.test.tsx` near source files
- Integration tests: `tests/integration/**` (cross-module behavior)
- E2E tests: `tests/e2e/**` (critical user flows, routing, auth, forms)
- Prefer deterministic tests; avoid real external network calls in CI/local test runs

### 9.3 Coverage policy
- Coverage tool: Vitest coverage provider (`v8`)
- Minimum thresholds (preferred baseline): `lines 80%`, `statements 80%`, `functions 80%`, `branches 70%`
- Coverage reports:
  - Console summary on run
  - HTML report in `coverage/`
  - LCOV report in `coverage/lcov.info`
- For greenfield projects, prefer not to lower thresholds; raise them over time for critical domains

### 9.CC.1 Running tests (Claude Code)
- Run tests with `npm run test` (Vitest) before marking a task done.
- Run `npm run test:e2e` only for feature-complete tasks or when E2E coverage is part of the task scope.
- If tests fail: fix the root cause. Do not skip or comment out failing tests without explicit user instruction.
- If the test setup does not exist yet, note it in the task summary.

---

## 10) Commands (npm-only policy and Docker)
- Install: `npm ci` (CI) / `npm install` (local)
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Accessibility lint: `npm run lint:a11y` (or covered by `npm run lint`)
- Typecheck: `npm run typecheck` (if exists)
- Unit/integration tests: `npm run test` (Vitest)
- Coverage: `npm run test:coverage`
- E2E: `npm run test:e2e` (Playwright)
- Docker build: `docker compose build`
- Docker start: `docker compose up -d`
- Docker stop: `docker compose down`
- Docker logs: `docker compose logs -f`

**Claude Code note**: do not run `npm run dev` or any long-running watch processes unless the user explicitly asks — they block the session.

---

## 11) Agent workflow
When implementing a task:

1. Read this file (`CLAUDE.md`) on session start
2. For non-trivial tasks: enter plan mode (`EnterPlanMode`), explore codebase, surface plan, get approval
3. Read all files relevant to the task before touching anything
4. Identify impacted feature module(s)
5. Implement in order: types/schemas → api → services → hooks → UI → tests
6. Run `npm run lint` and `npm run typecheck`
7. Run `npm run test`
8. For feature-complete tasks: run performance checks and include results in the task summary
9. Ensure minimal surface area changes
10. Provide concise summary with file list

---

## 12) API contract versioning policy
- Any API contract change must be versioned and documented in-repo when a durable reference is needed.
- For breaking changes, provide migration notes and transition plan before implementation is marked done.
- Keep frontend types/schemas synchronized with contract versions.

---

## 13) Documentation policy
- Keep durable project docs in-repo (for versioning and code coupling), at minimum:
  - `README.md` (setup/run/build/test basics)
  - agent policy docs (`AGENTS.md`, `CLAUDE.md`)
  - API/contract docs that must evolve with code
  - short architecture decisions (ADR-style notes when needed)
