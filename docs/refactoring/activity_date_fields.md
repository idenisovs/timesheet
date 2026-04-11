# Activity Date Fields Refactoring

Previously, the Activity had a single `date` field (of type `Date`).

The goal is to make the `date` field store the string representation of a date (e.g. `2026-04-11`), representing when the activity was performed.

The `createdAt` and `updatedAt` fields should store a JS Date value pointing to the actual creation and modification time.

## Example

Today is **11 April 2026**. You navigate back in the time and update the name of an activity, which has been performed in the past, e.g. on **5 April 2026**.

So, the date field will have value `2026-04-05`, while `createdAt` and `updatedAt` will have value of `2026-04-11T12:00:00.000Z` (or whatever time it is when you update the activity).

## Previous structure of Activity

```ts
export class Activity {
	id = crypto.randomUUID() as string;
	name = '';
	date = new Date();
	from = '';
	till = '';
	duration = '';
	weekId = '';
	dayId = '';
	issueId?: string;
}
```
