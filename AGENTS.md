# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Copilot, etc.) working in this repository.
Read this file completely before touching any code.

## 1. Project overview

**Croffle Poll** is a poll / survey platform for Team Croffle.

- **Framework**: Nuxt 4 (Vue 3, fullstack, Nitro `node-server` preset)
- **UI**: Nuxt UI v4, Tailwind CSS v4, Lucide / Simple Icons via Iconify
- **Auth**: `nuxt-auth-utils` generic OIDC provider (`server/routes/auth/oidc.get.ts`), IdP-agnostic (currently Dex with GitHub, Google planned). Admin role is granted from `NUXT_OIDC_ADMIN_GROUPS` (groups claim) or `NUXT_OIDC_ADMIN_EMAILS`; see `server/utils/oidc.ts`.
- **Database**: PostgreSQL via Drizzle ORM (`postgres` driver). Migrations live in `drizzle/` and run automatically on server start (`server/plugins/migrations.ts`).
- **Validation / DTOs**: Zod schemas in `shared/dto/`.
- **Package manager**: Yarn 4 (Berry, `nodeLinker: node-modules`). Always use `yarn`, never `npm` or `pnpm`.
- **Deployment**: Docker multi-stage build (`Dockerfile`, `.docker/`), GitHub Actions.

### Directory map

| Path | Purpose |
| --- | --- |
| `app/` | Nuxt app layer: pages, components, layouts, client middleware, client types |
| `server/api/` | H3 API handlers (file name encodes the HTTP method, e.g. `index.post.ts`) |
| `server/middleware/` | Server-side auth / admin guards |
| `server/plugins/` | Nitro plugins (DB migration on boot) |
| `server/utils/` | DB client and Drizzle schema (`server/utils/schema/`) |
| `server/routes/` | Non-API routes (OAuth callback, metrics) |
| `shared/` | Code shared by client and server: Zod DTOs, ambient types |
| `drizzle/` | Generated SQL migrations and snapshots. Do not hand-edit. |
| `docs/` | **Public** documentation: public roadmap, reference docs, supporting evidence |
| `.ai/` | **Local-only** agent workspace: working roadmap and work history. Never committed. |

### Common commands

```bash
yarn install          # install deps (runs `nuxt prepare`)
yarn dev              # dev server, loads .env.development.local
yarn lint             # eslint
yarn typecheck        # nuxt typecheck (vue-tsc)
yarn build            # production build to .output/
yarn db:generate      # generate a Drizzle migration from schema changes
yarn db:push          # push schema directly (dev only)
yarn db:studio        # Drizzle Studio
```

Run `yarn lint` and `yarn typecheck` before every commit. A change that breaks either is not done.

## 2. Workflow: roadmap first

**Before starting any task, read `.ai/ROADMAP.md` and work according to it.**

- `.ai/ROADMAP.md` is the working roadmap. It lists what is planned, what is in progress, and what is done, in the order it should be tackled.
- If the requested task is not on the roadmap, add it there first (with a short rationale), then start.
- If `.ai/ROADMAP.md` does not exist yet, create it from the current state of `docs/ROADMAP.md` and the request at hand before doing anything else.
- Do not silently reorder or drop roadmap items. If the plan needs to change, change the file and say why in the history entry (section 4).

## 3. Commit discipline: one unit of work, one commit

When a task involves several pieces of work, **commit after each unit**. The goal is that if the agent hallucinates or goes off track, the user can always roll back to the last good state with `git revert` / `git reset` at a clean boundary.

Rules:

- One logical change per commit. Schema change, migration, API handler, UI, docs update are separate commits when they can stand on their own.
- Never bundle unrelated fixes into a feature commit.
- Never commit with lint or typecheck failing.
- Do not commit `.ai/`, `.env*` (except `.env.example`), `.output/`, `.nuxt/`, or `node_modules/`.
- Do not amend or force-push existing commits unless explicitly asked.

### Commit message format

Every commit message must contain three parts: a **title**, a **one-line summary**, and **bullets**.

```
<type>: <title in imperative mood, under 72 chars>

<one-line summary of what changed and why>

- <bullet: concrete change 1>
- <bullet: concrete change 2>
- <bullet: notes on migration, breaking change, or follow-up if any>
```

`<type>` follows the existing history: `feat`, `fix`, `refactor`, `chore`, `docs`, `remove`, `test`.

Example:

```
feat: add optionType to polls table for timeline selection

Introduce a per-poll option type so polls can offer date/time slots instead of plain text.

- Add `option_type` enum column to `polls` schema and generate migration 0001
- Extend `AddNewPollRequest` Zod DTO with `optionType`
- Default existing rows to `TEXT` to keep current polls unchanged
```

## 4. Work history: always record in `.ai/history/`

**Every work session must be recorded in `.ai/history/`.** This is the audit trail the user reads to understand what an agent did and why.

- One file per task or session: `.ai/history/YYYY-MM-DD-<short-slug>.md` (use today's real date).
- Write the entry as you go, not only at the end. Update it after each commit.
- Each entry should contain:
  - **Goal**: the request, in one or two sentences
  - **Roadmap item(s)**: which `.ai/ROADMAP.md` entries this touches
  - **Steps taken**: chronological, with the commit hash for each unit of work
  - **Decisions and assumptions**: anything not obvious from the diff
  - **Verification**: what was run (`yarn lint`, `yarn typecheck`, manual checks) and the result
  - **Left undone / follow-ups**: anything skipped and why
- If a task is abandoned or reverted, record that too. Do not delete history entries.

## 5. Public roadmap: `docs/ROADMAP.md`

`docs/ROADMAP.md` is the **public, version-based roadmap** (grouped by release version, readable by end users and contributors).

- **After finishing a task**, review what actually changed and update `docs/ROADMAP.md` accordingly: mark items done, move items between versions, add newly discovered items.
- Keep `docs/ROADMAP.ko.md` in sync (see section 7).
- `docs/ROADMAP.md` is not the working plan. Day-to-day ordering and in-progress notes belong in `.ai/ROADMAP.md`.
- Commit the roadmap update as its own `docs:` commit.

## 6. Folder conventions

### `.ai/` is local-only

- Contains `ROADMAP.md`, `history/`, and any scratch notes an agent needs.
- It is listed in `.gitignore` and must never be committed or pushed.
- Do not put anything in `.ai/` that other people need; that belongs in `docs/`.

### `docs/` is public

- Public roadmap (`docs/ROADMAP.md`), reference documents, and supporting evidence (design notes, benchmarks, links to specs) go here.
- Everything in `docs/` is committed and may be published. Do not put secrets, internal URLs, or personal data here.

## 7. Language policy

- **English is the default** for all files under `docs/`, `README.md`, and every roadmap.
- For each English document, also provide a **Korean version** with the `.ko.md` suffix and **link the two to each other** at the top of each file.
  - `README.md` <-> `README.ko.md`
  - `docs/ROADMAP.md` <-> `docs/ROADMAP.ko.md`
  - `docs/<name>.md` <-> `docs/<name>.ko.md`
- When you change an English document, update its `.ko.md` counterpart in the same commit.
- **Exceptions**: agent instruction files such as `AGENTS.md` and `CLAUDE.md`, and everything inside `.ai/`. These do not need a `.ko.md` twin. `AGENTS.md` itself is always written in English.
- Code comments and commit messages are in English.

## 8. Coding conventions

- TypeScript everywhere. No `any` unless justified in a comment.
- Follow the existing ESLint / Prettier config (`eslint.config.mjs`, `.prettierrc.yaml`): no trailing commas, 1TBS braces, Tailwind class sorting via `prettier-plugin-tailwindcss`.
- Put request / response shapes in `shared/dto/` as Zod schemas and infer types from them. Do not duplicate types by hand.
- Schema changes go in `server/utils/schema/`, then `yarn db:generate`. Commit the generated migration together with the schema change. Never edit files under `drizzle/` manually.
- Server handlers must validate input with the Zod DTO and rely on `server/middleware/auth-guard.ts` / `admin-guard.ts` for access control. Do not reimplement auth checks ad hoc.
- Use Nuxt auto-imports; do not add explicit imports for composables and components that Nuxt already provides.
- Keep UI on Nuxt UI components before reaching for custom markup.

## 9. Per-task checklist

1. Read `.ai/ROADMAP.md`; add or locate the task there.
2. Create `.ai/history/YYYY-MM-DD-<slug>.md` with the goal.
3. Implement in small units. After each unit: `yarn lint`, `yarn typecheck`, commit with title + summary + bullets, append the hash to the history entry.
4. When done, update `docs/ROADMAP.md` and `docs/ROADMAP.ko.md`; commit as `docs:`.
5. Update any other affected docs (`README.md` + `README.ko.md`, `docs/*`).
6. Finalize the history entry with verification results and follow-ups.
7. Confirm `git status` shows nothing from `.ai/` or `.env*` staged.
