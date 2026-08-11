# PhD Planner

A calm, local-first research operating system for planning a PhD: a big calendar, daily checks,
project tracking, a research library with a daily paper/video pick, a progress log, supervisor
meeting notes, research questions, and a quick-capture inbox — all in one place, all on your own
machine.

## Local-first, by design

Everything lives in **IndexedDB in your browser**. There is no account, no login, no server, no
analytics, and no telemetry. Nothing you enter is ever sent anywhere. Closing the tab doesn't lose
anything; clearing your browser's site data for this app does.

Back up or move your data any time from **Settings → Backup and portability**: export everything
to a single JSON file, or import a backup to restore it (which replaces whatever's currently
there). There's also a one-click "reset" if you want to start over, and a "load sample data"
button if you just want to explore the app with fictional example content first.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Development

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

### Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) for styling, with a small custom design system
  (`components/ui`) built on [Radix UI](https://www.radix-ui.com) primitives
- [Dexie](https://dexie.org) over IndexedDB for persistence, with reactive reads via
  [`dexie-react-hooks`](https://dexie.org/docs/dexie-react-hooks/dexie-react-hooks)
- [Zustand](https://github.com/pmndrs/zustand) for the small amount of UI-only state (selected
  calendar day, command palette open, etc.) — everything else is read live from IndexedDB
- [Zod](https://zod.dev) to validate imported backup files, since that's the one place external
  data enters the app
- [Framer Motion](https://www.framer.com/motion/) for the small, deliberate bits of motion

### Structure

```
src/
  app/            # routes (one folder per screen)
  components/
    ui/           # small design-system primitives
    shell/        # navigation, command palette
    dashboard/    # Today dashboard widgets
    calendar/     # month/week grid, day drawer
    projects/     # project list/detail
    learnings/    # research library, Daily Learning Pick
    settings/     # routines, preferences, backup/reset
    shared/       # pieces reused across screens (e.g. the daily checklist)
  lib/
    db/           # Dexie schema (db.ts, types.ts) and one module per entity
                   # (CRUD + live-query hooks), plus seed.ts (fictional demo data)
    daily-pick.ts     # Daily Learning Pick selection algorithm
    export-import.ts  # backup export/import/reset
    calendar-items.ts # normalizes tasks/events/milestones for calendar rendering
    dates.ts, constants.ts, utils.ts, id.ts
  store/          # zustand UI store
```

The IndexedDB schema is versioned from the start (`db.ts`), so future changes can be added as
additive Dexie migrations rather than breaking existing installs.

## Contributing / forking

If you fork or clone this: your own data stays local to your own browser the moment you run it —
there's nothing to configure. `lib/db/seed.ts` contains only fictional example content used by the
in-app "load sample data" button; no real data is ever committed to this repository.
