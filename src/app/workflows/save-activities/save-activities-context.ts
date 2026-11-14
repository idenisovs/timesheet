import { Activity, Change, Issue } from '@entities';

export interface SaveActivitiesContext {
	activities: {
		toSave: Activity[];
		toRemove: Activity[];
	};
	changes: Change[];
	affectedIssues: Issue[];
}
