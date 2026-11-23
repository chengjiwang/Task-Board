# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Solution to the devChallenges "My Task Board" challenge, extended with multi-board support (an All Boards home page and a board edit/delete drawer). Original challenge requirements and the dev spec (in Chinese) live in [resources/Requirements.md](resources/Requirements.md) and [resources/SPEC.md](resources/SPEC.md).

Stack: Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript (strict), MongoDB + Mongoose, Tailwind CSS v4, shadcn/ui (new-york style, Radix, lucide icons).

## Commands

Package manager is **pnpm**.

```bash
pnpm install
pnpm dev      # next dev
pnpm build    # next build (also type-checks)
pnpm start    # serve production build
pnpm lint     # eslint (flat config, eslint-config-next)
```

There is no test suite.

Requires `MONGODB_URI` in `.env.local` (`.env*` is gitignored). `connectDB()` throws if it is missing.

## Architecture

**No API routes — all data access goes through Server Actions** in [lib/actions/](lib/actions/) (`'use server'`). Server Components call them directly to read (`getBoards`, `getBoard`); Client Components import and call them to mutate.

- Every action starts with `await connectDB()` ([lib/mongodb.ts](lib/mongodb.ts)), which caches the Mongoose connection on `global.mongoose` to survive hot reload / serverless reuse.
- Results returned to the client are passed through `JSON.parse(JSON.stringify(...))` to strip ObjectIds/Dates into plain serializable values. Keep doing this for anything returned from an action or passed from a Server to a Client Component.
- After mutations, actions call `revalidatePath` for `/board/${boardId}` and/or `/`. When adding a mutation, revalidate every page whose data it affects (the home page shows board info, so board/task count changes revalidate `/` too).
- `deleteBoard` cascades to delete its tasks and then `redirect('/')`.

**Data model** ([models/](models/), types in [types/index.ts](types/index.ts)): the Board↔Task relation is stored **in both directions** — `Task.boardId` and `Board.tasks: ObjectId[]`. `getBoard` uses `.populate('tasks')`, so `board.tasks` is actually `ITask[]` at runtime (cast in `BoardMain`). Task add/delete must keep `Board.tasks` in sync (`$push` / `$pull`). Models use the `mongoose.models.X || mongoose.model(...)` pattern to avoid recompilation errors.

Task `icon` and `status` are string enums defined in three places that must stay consistent: the Mongoose schema enum, the TS union types, and the `ICONS` / `STATUS_OPTIONS` arrays in [components/task/TaskDrawer.tsx](components/task/TaskDrawer.tsx).

**Routing / UI flow:**
- `/` → [app/page.tsx](app/page.tsx) fetches boards → `BoardListPage`.
- `/board/[boardId]` → server page fetches the board (`notFound()` if missing) → `BoardMain` (client), which owns drawer state for `BoardEditDrawer` and `TaskDrawer`.
- `/board` permanently redirects to `/` ([next.config.ts](next.config.ts)).
- `TaskDrawer` is shared for `mode="create" | "edit"`; in create mode `TaskList` uses `useOptimistic` to show the new task immediately.
- `BoardEditDrawer` calls `router.prefetch('/')` + `router.refresh()` after saving so both the board page and the home page reflect changes (recent commits were fixing stale data here).

**Styling:** Tailwind v4 with theme tokens in [app/globals.css](app/globals.css) (`@theme inline`), including custom status colors like `bg-in-progress-icon`, `bg-completed-icon`, `bg-wont-do-icon`, `bg-page`. shadcn primitives are in [components/ui/](components/ui/); add more via the `shadcn` CLI (config in [components.json](components.json)). Path alias `@/*` maps to the repo root.
