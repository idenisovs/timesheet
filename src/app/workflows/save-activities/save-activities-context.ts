import { Activity } from '@entities';

export interface SaveActivitiesContext {
	activities: {
		toSave: Activity[];
		toRemove: Activity[];
	};
	snapshots: {
		beforeSave: Activity[];
		beforeRemove: Activity[];
	};
	affectedIssueIds: Set<string>;
}
