# Dexie

- [Schema Definition in Dexie](https://dexie.org/docs/Version/Version.stores()) - for autoincrement, unique, multi-entry fields;

## Database Versioning

https://dexie.org/docs/Tutorial/Design#database-versioning

If you have 50 tables and only need to add an index to one table, you do not need to repeat all tables in the new version.  Just define the updated schema for the table you are changing. 

But the table schema should have all required indexes. If some are missing from the schema definition, they will be removed.
