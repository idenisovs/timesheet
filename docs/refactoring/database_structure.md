# Refactoring Database Structure

Previously I had a lot of troubles while implementing the Issues and Projects sections for this application.

That was because of data structure, which wasn't suitable well for such kind of tasks.

I decided to split it and make more conscious. It comes with following steps.

## Redesign of data structure

Previously, there was just one general `sheet` table, which has entries for specific days, each entry having `id`, `date` and `activities` fields.

That means we have to do all `week`, `issue`, `project` data picking and calculations by the hand.

Naturally, we have to split the table `sheet` into the following entities:

1. `week`
2. `day`
3. `activities`

Additionally, keeping in mind the future possibility of data syncing, I decided to replace numeric IDs with UUIDs.

## Data Migration

The data migration task means that application should able to migrate user's data to new structure.

## Rework of Daily Activities view

It should be able to properly perform all required operations with new data structure.

## Rework of Issues view

It should be able to calculate activity metrics from new structure.

## Rework of Projects view

Same here
