# Refactoring Database Structure

Previously, I encountered numerous challenges while implementing the Issues and Projects sections of this application.

These difficulties arose due to a data structure that wasn't well-suited for these tasks.

To address this, I decided to reorganize the data structure to be more efficient and logical. This process involved the following steps:

## Redesign of data structure

Previously, there was just one general `sheet` table, which has entries for specific days, each entry having `id`, `date` and `activities` fields.

That means we have to do all `week`, `issue`, `project` data picking and calculations by the hand, with iterating through the list of all sheets.

Naturally, we have to split the table `sheet` into the following entities:

1. `week`
2. `day`
3. `activities`

Additionally, keeping in mind the future possibility of data syncing, I decided to replace numeric IDs with UUIDs.

## Data Migration

We had `sheets` table, with `date` and `activities` fields. We should iterate through all `sheet` items, take activities and move them to `activities` table.

- If there is no instance of `day` for the `date`, then we should make it.
- If there is no instance of `week` for given `day`, then we should make it.

## Rework of Daily Activities view

It should be able to properly perform all required operations with new data structure:

- Add and remove activity form items;
- Save changes;
- Display daily summaries;
- Display weekly summaries;
- Give the daily overview;
- Display missing days feature;

## Rework of Issues view

It should be able to calculate activity metrics from new structure.

## Rework of Projects view

Projects view is ok, as it uses just Issues View. 
