# Database

Timesheet App uses [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) to store the data and [Dexie.js](https://dexie.org/) lib to access it.

Dexie docs is pretty messy, so use this [reference](./dexie.md) in order to see the most important articles.

## Entities

### Week

Week is used to group Days and Activities by specific calendar Week. That's helps for week specific calculations.

### Day

Day is used to group Activities by specific Date. That's helps for date specific calculations.

### Activity

Activity is the base entity for Timesheet App, since it holds the record for some small piece of work, done in specific date within specific time interval. Let's say, in 15-th of March 2024 you are done casual walking between 12:00 and 14:00 (2h).

```json
{
  "id": "63ed672b-63ad-4c38-90a4-24eaf5c3d395",
  "name": "Casual Walking",
  "date": "2024-08-23T16:37:03.761Z",
  "from": "12:00",
  "till": "14:00",
  "duration": "2h",
  "weekId": "ea6b2523-ce4f-40d3-a3bd-d62372ff1547",
  "dayId": "b015da44-854b-4b99-ae33-b971a8b9e29d"
}
```

### Issue

Used to group the activities that share the same _Issue Key_.

### Activity

Activity is some object within the `sheet` entity, stored in `activities` field.

Activity have the following properties:

1. `name` - `ABC-123: Setup for the project`
2. `from` - `12:00`
3. `till` - `12:45`
4. `duration` - `45m`

#### Issue Number

Activity might be associated with some issue. In order to do so you should specify activity name according to the following pattern:

```
<issue key>: <issue description>
```

For example, if some activity has the name like `TSA-456: Make Greeting Text green`, then `TSA-456` is the issue key.



