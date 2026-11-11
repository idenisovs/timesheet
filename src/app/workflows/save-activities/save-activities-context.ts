import { Activity, Issue } from '@entities';

export interface SaveActivitiesContext {
	activities: {
		toSave: Activity[];
		toRemove: Activity[];
	};
	snapshots: {
		beforeSave: Activity[];
		beforeRemove: Activity[];
	};
	affectedIssues: Issue[];
}
