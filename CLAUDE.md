# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server (http)
npm run start:https # dev server (https, uses local SSL cert)
npm run build      # production build
npm test           # run tests (Karma/Jasmine)
npm run watch      # build in watch mode
```

## What This App Is

A serverless browser-based time tracker. All data lives in IndexedDB (via Dexie.js) — no backend, no auth. Angular 21, Bootstrap 5, Luxon for dates, ng-bootstrap for modals.

## Architecture

### Layers

1. **Store** (`src/app/store/`) — Dexie wrapper (`SheetStoreService`) + raw IndexedDB record interfaces in `records/`. Schema has 10 versions with a migration chain (`migrate-v2` → `migrate-v9`). Tables: `activities`, `issues`, `projects`.

2. **Entities** (`src/app/entities/`) — Rich domain classes (`Activity`, `Issue`, `Project`, `Week`, `Day`) with business logic. Each has static factory methods: `Entity.fromRecord()` and `Entity.fromImport()`. These are distinct from the thin store records.

3. **Repository services** (`src/app/services/`) — `ActivitiesRepositoryService`, `IssueRepositoryService`, `ProjectRepositoryService` query Dexie and map records → entities.

4. **Business logic services** — `ActivitiesService` (calculations), `DurationService` (time math), `WeekService`, `OverviewService`, `IssuesService`.

5. **Workflow services** — `SaveActivitiesWorkflowService`, `ExportWorkflowService`, `RemoveActivitiesWorkflowService` orchestrate multi-step operations across repositories.

6. **Pages** (`src/app/pages/`) — Route-based: daily-activities (main view), issues, projects, analytics, import, settings.

7. **Components** (`src/app/components/`) — Shared UI components used across pages.

### Routing

```
/                   daily-activities (default)
/issues             issues list
/issues/:issueKey   issue detail
/projects           projects list
/projects/:projectId project detail (has resolver)
/import             data import
/settings           settings
```

Navbar action buttons use a named router outlet.

## Code Style

- Tabs for indentation, size 4
- Single quotes in TypeScript files
- Final newline at end of every file, no trailing whitespace
- When changing a component's TypeScript, check its HTML template too — and vice versa
- Getters and setters are OK
- Getters and Setters must follow the PascalCase
- Do not write long one-liners and nested function calls

### Key Conventions

- **Desktop/mobile splits**: some components have a `-mobile` variant (e.g., `daily-activity-item` vs `daily-activity-item-mobile`). `ScreenService` drives which renders.
- **Signals**: use `input()` / `input.required()` and `signal()` for reactivity — not `@Input()`.
- **Global events**: `ActionsService` is an EventEmitter bus for app-wide actions (CreateIssue, AddProject, Export, Import, ToggleMode).
- **Modals**: ng-bootstrap `NgbModal` for dialogs.
- **Styling**: SCSS, Bootstrap 5 utility classes. Default component style is SCSS.
- **Strict TypeScript**: `strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch` are all on.
