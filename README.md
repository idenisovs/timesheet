# Timesheet

There is plenty of time tracking apps, and most of them unfortunately have long-standing usability and complexity issues. That the reason why I finally decided to write my own Timesheet application.

[Online version of Timesheet App](https://time.e-dreams.lv/).

## Goals

1. Make the time tracking task as simple as possible;
2. Make it serverless first. All the data stored in browser;
3. Make it free and open-source;

## Prerequisites

* [Node.js and NPM](https://nodejs.org/en)

## Setup

```bash
npm install
npm start
```

## Documentation

* [Database](./docs/database.md)
  * [Dexie](./docs/dexie.md)
* Features:
  * [To Do](./docs/todo.md)
  * [Completed](./docs/completed.md)
* Refactorings:
  * [Database Structure](./docs/refactoring/database_structure.md)
* Views
  * [Daily Activities View](./docs/views/daily_activity.md)
  * [Issues View](./docs/views/issues.md)
    * [Accuracy Points](./docs/accuracy_points.md)

## Versions

- `2.4.0` - Application got the Projects view;
- `2.3.0` - Daily Overview showing the predefined issue name;
- `2.2.0` - Issues section got possibility to remove Issue;
- `2.1.0` - Application got the basic Edit Issue view;
- `2.0.0` - Application got the basic Issues view;
- `1.3.0` - Added the following:
  1. Added the _Copy to Clipboard_ button;
  2. Added the buttons allowed to set the current time for `From` and `Till` fields;
- `1.2.0` - Added possibility to add missing days;
- `1.1.0` - Daily summary;
- `1.0.0` - Basic functionality;
