# Trajectory Action Tester

Standalone single-file HTML React app for testing any Trajectory Action Container REST implementation.

## Status

Phase 4-01 scaffold — empty three-pane shell, single-file build pipeline.

## Requirements

- Node 20 or later

## Setup

```bash
npm install
```

## Develop

```bash
npm run dev
```

Opens a Vite dev server on a free port; visit the printed URL.

## Build single-file artifact

```bash
npm run build
```

Produces `dist/index.html` — a single HTML file with all JS and CSS inlined. Open it directly in any browser (no server needed).

## Test

```bash
npm test         # vitest run
npm run lint     # eslint
```

## Spec

`docs/specs/2026-05-11-trajectory-action-tester-v2-design.md` in the Trajectory Action Container monorepo (`C:\TrajectoryActions\`).
