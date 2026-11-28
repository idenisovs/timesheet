# ToDo

This file contains a list of _technical_ tasks and considerations.

For a more abstract and high-level perspective, please refer to the [Roadmap](./roadmap.md) file.

- Keep the **Syncing…** badge visible for at least 1 second after sync starts, even if sync finishes sooner.
- Move the **Reset sync** section to **Sync Settings**.
- Check what happens if the sync service suddenly fails.
- Add explanatory text to the **Sync Settings** page with links to the GitHub repositories for the Node.js and Python sync service implementations.
- Add **Start** and **Stop** buttons for the sync service.
- Log sync events, store the entries in IndexedDB, and display them in the **Sync** view.
- Add a badge to the sync status panel that shows whether the sync service is **On** or **Off**.

## Timestamps

When an activity’s `createdAt` is unknown (for example, during migration or export), use the date from `date` and the time from `from`.
