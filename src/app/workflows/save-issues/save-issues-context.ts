import { Issue } from '@entities';
import { Snapshot } from '@workflows/Snapshot';

export interface SaveIssuesContext {
	issues: {
		toSave: Issue[];
		toRemove: Issue[];
	};
	snapshots: Snapshot<Issue>[];
}
