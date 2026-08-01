# README.md

This file is related to the Day component tree.

The purpose of Day component is to retrieve and display the day information and also the daily activity information.

## Activity Loading

It is performed in `day.component.ts` by the `loadActivities()` method.

The `loadActivities()` method is taking activities by the current `day` (the day of current Day component).

```typescript
await this.activityRepository.getByDay(this.day());
```

If there is no `Activities`, then create `Activity` and add to `activities` list.

### Activities Signal

It is set in the two places here:

1. `saveActivities` method, which:
	- Accepts the `updatedActivities` list;
	- Run workflows against the received list;
	- Sets the `activities` signal;
	- Emits the `changes` event;
2. `loadActivities` method. which:
	- Retrieves the activities from repository and makes a new activity, if there is no activities for that day;
	- Sets the `activities` signal;

### The Changes event propagation

1. The **Week** components receives the `changes` event from **Day** component:
	- The `changes` event got handled by `recalculateActivitySummary()`;
2. The **Day** component receives the `changes` event from **Day Mobile** and **Day Desktop** components:
	- The `changes` event got handled by `saveActivities()` method;
	- The `saveActivities` event receives the updated `activity` list, updates the `activities()` signal, and **emits the changes** event;
3. The **Day Desktop** component emits the `changes` event on **Save** button click:
	- It processes the Activity Form Array and makes a new list of Activities out of it;
	- Then it emits the `changes` event with a new list of activities in it;
	- The **Day Desktop** component operates with **Daily Activity Item**; (`app-daily-activity-item`) component. It emits `add`, `remove` and `save` events instead of `changes`;
4. The **Day Mobile** component emits the `changes` event on `save` method calls (defined in **Day Desktop** parent component);
