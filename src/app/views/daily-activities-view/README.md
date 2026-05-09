# Daily Activities Page

## Sequence

### Basic Sequence

1. Prepare for today – create a new `Week` and `Day` records in DB;
2. Load current `Week` with `loadNextWeek()` method;
    - The `loadNextWeek()` method retrieves week from the latest down to the earliest through the offset counter;
3. Create _Infinite Scroll_ handler:
	- It will load the next week when the bottom of the page is reached;

### Preload Weeks

1. Run `preloadWeeks()` method once view is initialized;
2. Read the `weekListHeight`, `windowHeight` and `numberOfWeeks` params;
3. If bottom is not reached and there is weeks to preload, then load the next week with `loadNextWeek()` and repeat (call `preloadWeeks()` recursively);
