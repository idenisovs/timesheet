# Activity Categorization

## Activity

Every single record in Timesheet, regardless of its type, is an activity.

The most important properties of an activity are:

1. **Name**
2. **Date** – `2026-05-01`
3. **From** (time) – `09:00`
4. **Till** (time) – `10:30`

The name of an activity determines its **type** (or, let's say a **scope**):

1. **Simple** activity with no scope. Can have one or many entries. It has no external grouping or parent entity. Imagine a name like _Learning Bayes theorem_.
2. **Categorized** activity. Something you are doing recurrently. Relates to some **category** or **group**. Imagine a name like _Housekeeping: Cooking_.
3. **Work Item** activity. Represents an activity associated with a larger **unit of work**. Imagine names like `ABC-1234: Update FE with recent changes.`, `ABC-1234: Store user settings in a JSONB column` and `ABC-1234: Update userinfo object`. 

### Simple Activities

**The basic unit of work**. Like you can fix a coffee machine once a year or attend a meeting with Wayne Enterprises representatives.

```
2026-05-01
----------
09:00–10:30 - Meeting with Wayne Enterprises (1h 30m)
10:30–11:00 - Coffee machine fix (30m)
11:00–12:00 - Breakfast (1h)
12:00–13:00 - Coffee machine fix (1h)
```

### Categorized Activities

Imagine activity names like _Housekeeping: Cooking_, _Housekeeping: Dishwashing_ or _Code Review: Fix for broken Dashboard page_. 

Those activities are scoped to some **category** or **group**, like _Housekeeping_ or _Code Review_.

```
2026-05-01
----------
09:00–10:30 - Meeting: Wayne Enterprises (1h 30m)
10:30-11:00 - ABC-1234: 
11:00–11:30 - Meditation (30m) 
11:30–14:30 - Meeting: McDuck Industries (2h 30m)
```

### Work Item Activities

The [task management systems](https://en.wikipedia.org/wiki/Category:Task_management_software) tend to use a term **ticket** or **issue** to refer to a single **unit of work**. The **unit of work** usually has a name, scope, terms, goal and **lifecycle**.

All **activities** under name like **ABC-1234** relate to the same single **unit of work** - **ABC-1234** and basically are steps that you are doing to complete your part of the job under the given task/ticket/issue. 

The **ABC-1234** in its turn can be defined like _ABC-1234: Apply system setting changes to the new design_ and relates to the **Project** that owns the key **ABC**.


```
2026-05-01
----------
09:00–10:30 - Meeting: Wayne Enterprises. (1h 30m)
10:30–12:00 - ABC-1234: Update FE with recent changes. (1h 30m)
12:00–13:00 - Dinner (1h)
13:00–13:30 - ABC-1234: Update FE with recent changes. (30m)
13:30–16:30 - ABC-1234: Update userinfo object. (3h)
```

## Worklog

At the moment I have the view named as **Issues**, which is a list of issues (big chunks of work) and is not a good fit for categorized activities, like `Housekeeping: Cooking`.

Since I need to have some meaningful overview of the work I do, I thought that I could make a view named **Worklog**.

Ideally, such a view can allow seeing both _issues_, _categorized activities_ and _one-off_ (ad-hoc) activities in a single **timeline**.
