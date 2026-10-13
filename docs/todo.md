# ToDo

This file contains a list of _technical_ tasks and considerations.

For a more abstract and high-level perspective, please refer to the [Roadmap](./roadmap.md) file.

## Sync Service

Implement the changes required to synchronize the Timesheet Activities with a remote service.

1. Add a new table named `sync`.
2. Add a pop-up window that displays the synchronization progress.
3. Implement a service that calls the remote API and pushes the changes to it.
4. Add an option to configure the remote service URL in `config`.

## Complexity Points

Add an option to assign complexity points to an issue so that we can gather statistics and measure the time required to complete issues of a given complexity.

## Tags

I need some option to set the tags for `Activities` or `Issues`.
