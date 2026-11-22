# AGENTS.md

This file provides guidance to AI agents working with code in this repository.

## Commands

```bash
npm start      # HTTP dev server
npm run build  # production build
npm test       # run Vitest once
```

## Architecture

Timesheet is a browser-based time tracker. It stores data locally in IndexedDB through Dexie, with optional sync.

Repository services query the store and map raw records to domain entities. Workflow services coordinate multi-step operations across repositories.

## Code Style

- Start with the simplest implementation that meets the requirements. Prefer direct code and add complexity only when it solves a concrete problem or improves readability.
- Prioritize readability for humans when writing and organizing code and templates.
- Separate independent code blocks with one blank line, including sibling control-flow blocks in templates.
- Tabs for indentation, size 4
- Single quotes in TypeScript files
- Final newline at end of every file, no trailing whitespace
- When changing a component's TypeScript, check its HTML template too — and vice versa
- Getters and setters are OK
- Getters and Setters must follow the PascalCase
- Do not write long one-liners and nested function calls
- Don't skip the braces in early return if statements

### Key Conventions

- **Desktop/mobile splits**: some components have a `-mobile` variant (e.g., `daily-activity-item` vs `daily-activity-item-mobile`). `ScreenService` drives which renders.
- **Signals**: use `input()` / `input.required()` and `signal()` for reactivity — not `@Input()`.
- **Global events**: `ActionsService` is an EventEmitter bus for app-wide actions (CreateIssue, AddProject, Export, Import, ToggleMode).
- Use the named `page-actions` router outlet for page-specific header actions such as Add Project.
- **Modals**: ng-bootstrap `NgbModal` for dialogs.
- **Styling**: SCSS, Bootstrap 5 utility classes. Default component style is SCSS. Prefer Bootstrap 5 utility classes over custom CSS — only write custom SCSS when Bootstrap has no equivalent utility.
- **Strict TypeScript**: `strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch` are all on.
