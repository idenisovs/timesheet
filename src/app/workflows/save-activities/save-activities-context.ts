import { Activity, Issue } from '@entities';

export interface ActivitySnapshots {
	before: Activity | null;
	after: Activity | null;
}

export interface SaveActivitiesContext {
	activities: {
		toSave: Activity[];
		toRemove: Activity[];
	};
	snapshots: ActivitySnapshots[];
	affectedIssues: Issue[];
}
