# `Week` Class Usage

## Summary of `Week` consumers

| File                                                                          | Role                                       |
|-------------------------------------------------------------------------------|--------------------------------------------|
| `entities/Week.ts`                                                            | Definition                                 |
| `store/records/week-record.ts`                                                | DB record interface                        |
| `repository/weeks-repository.service.ts`                                      | DB CRUD                                    |
| `workflows/prepare-for-today-workflow.service.ts`                             | Create week for today                      |
| `workflows/save-activities-workflow.service.ts`                               | Create/resolve week when saving activities |
| `pages/daily-activities-page/daily-activities-page.component.ts`              | Display list of weeks                      |
| `components/daily-activities-week/daily-activities-week.component.ts`         | Render a single week                       |
| `components/daily-activities-week/daily-activities-week-header/…component.ts` | Week header with date range                |
| `components/daily-activities-week/weekly-overview-modal/…component.ts`        | Weekly overview popup                      |
| `pages/analytics-page/analytics-page-filter/…component.ts`                    | "Current week" filter shortcut             |
| `services/days.service.ts`                                                    | Fill missing days using week boundaries    |
| `repository/days-repository.service.ts`                                       | ~~Query days by week~~                     |
| `repository/activities-repository.service.ts`                                 | ~~Query activities by week~~               |
| `store/migrate-v5/index.ts`                                                   | Legacy migration (v5)                      |
| `store/migrate-v9/index.ts`                                                   | Date format migration (v9)                 |

## Definition

**File:** `src/app/entities/Week.ts`

```ts
export class Week {
	id: string = crypto.randomUUID();
	from: string;  // ISO date string (Monday)
	till: string;  // ISO date string (Sunday)

	constructor(date = getCurrentDateIso()) { ...
	}

	static fromRecord(record: WeekRecord): Week { ...
	}

	static toRecord(source: Week): WeekRecord { ...
	}
}
```

The `Week` entity represents a calendar week. Its `from` and `till` fields are ISO date strings (e.g. `"2026-04-13"`, `"2026-04-19"`). On construction, they are set to the Monday and Sunday of the given date using `getMonday` / `getSunday` utilities.

The backing store type is `WeekRecord` (`src/app/store/records/week-record.ts`):

```ts
export interface WeekRecord {
	id: string;
	from: string;
	till: string;
}
```

---

## Persistence

### `WeeksRepositoryService` — `src/app/repository/weeks-repository.service.ts`

The primary CRUD layer. All database access goes through this service.

| Method                | Description                                                    |
|-----------------------|----------------------------------------------------------------|
| `getById(weekId)`     | Look up a week by its UUID                                     |
| `getByDate(date)`     | Find the week whose `from` equals the Monday of the given date |
| `getAll()`            | Return all weeks ordered by `till` descending                  |
| `getByOffset(offset)` | Pagination helper — returns the nth most-recent week           |
| `getCount()`          | Returns the total number of persisted weeks                    |
| `save(week)`          | Upsert a week record via `db.weeks.put`                        |

---

## Creation

Weeks are created at two points in business logic — never by the user directly.

### `PrepareForTodayWorkflowService` — `src/app/workflows/prepare-for-today-workflow.service.ts`

Called on app start (daily-activities page `ngOnInit`). Ensures a `Week` and a `Day` exist for today:

```ts
let currentWeek = await this.weeksRepo.getByDate(today);
if (!currentWeek) {
	currentWeek = new Week(today);
	await this.weeksRepo.save(currentWeek);
}
```

### `SaveActivitiesWorkflowService` — `src/app/workflows/save-activities-workflow.service.ts`

When saving activities, `processWeekLink` resolves or creates the week for each activity's date:

```ts
week = new Week(activity.date);
await this.weekRepo.save(week);
activity.weekId = week.id;
```

---

## Display / UI

### `DailyActivitiesPageComponent` — `src/app/pages/daily-activities-page/daily-activities-page.component.ts`

Holds the `weeks: Week[]` array displayed on the main page. Loads weeks via `WeeksRepositoryService.getByOffset` with infinite-scroll pagination.

### `DailyActivitiesWeekComponent` — `src/app/components/daily-activities-week/daily-activities-week.component.ts`

Receives a `Week` as `@Input`. Uses it to:

- load its days via `DaysRepositoryService.getByWeek(week)`
- load its activities via `ActivitiesRepositoryService.getByWeek(week)`

### `DailyActivitiesWeekHeaderComponent` — `src/app/components/daily-activities-week/daily-activities-week-header/daily-activities-week-header.component.ts`

Receives `week` as `@Input` (default: `new Week()`). Uses `week.from` / `week.till` for date display. Passes the week to `DaysService.addMissingDays` and opens `WeeklyOverviewModalComponent` with it.

### `WeeklyOverviewModalComponent` — `src/app/components/daily-activities-week/weekly-overview-modal/weekly-overview-modal.component.ts`

Receives `week` as `@Input`. Calls `ActivitiesRepositoryService.getByWeek(week)` to build the weekly overview.

---

## Analytics

### `AnalyticsPageFilterComponent` — `src/app/pages/analytics-page/analytics-page-filter/analytics-page-filter.component.ts`

Uses `new Week()` in `selectCurrentWeek()` to populate the date-from / date-till filter controls with the current week's Monday and Sunday:

```ts
const week = new Week();
this.filtersForm.get('dateFrom')?.setValue(this.service.getDayFromDate(week.from));
this.filtersForm.get('dateTill')?.setValue(this.service.getDayFromDate(week.till));
```

---

## Related Services

### `DaysService` — `src/app/services/days.service.ts`

`addMissingDays(week, days)` uses `week.till` as the starting date when filling gaps in a week's day list.

### `DaysRepositoryService` — `src/app/repository/days-repository.service.ts`

`getByWeek(week)` queries days by `weekId`.

### `ActivitiesRepositoryService` — `src/app/repository/activities-repository.service.ts`

`getByWeek(week)` queries activities by `weekId`.

---

## Migrations

### `migrateV5` — `src/app/store/migrate-v5/index.ts`

Uses a legacy `Week` class (defined in `src/app/store/migrate-v5/types.ts`) with `Date`-typed `from`/`till` fields. Groups historical sheet records into weeks and persists them. This is the original creation path for all pre-v5 data.

### `migrateV9` — `src/app/store/migrate-v9/index.ts`

Converts persisted `WeekRecord.from` and `WeekRecord.till` values from `Date` / ISO datetime strings to plain ISO date strings (`YYYY-MM-DD`). This aligns stored data with the current `Week` entity which uses `string` (ISO date) instead of `Date`.

---


