# Database

Timesheet App uses [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) to store the data and [Dexie.js](https://dexie.org/) lib to access it.

Use this [reference](./dexie.md) to have quick links to the Dexie docs.

## Entities

### Activity

Activity is the base entity for Timesheet App, since it holds the record for some small piece of work, done in a specific date within a specific time interval.
Let's say, in 15th of March 2024 you are done casual walking between `12:00` and `14:00` (**2h**).

```json
{
  "id": "63ed672b-63ad-4c38-90a4-24eaf5c3d395",
  "name": "Casual Walking",
  "date": "2024-08-23",
  "from": "12:00",
  "till": "14:00",
  "duration": "2h"
}
```



