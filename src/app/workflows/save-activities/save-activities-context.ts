import { Activity, Issue } from '@entities';
import { Snapshot } from '@workflows/Snapshot';

export interface SaveActivitiesContext {
	activities: {
		toSave: Activity[];
		toRemove: Activity[];
	};
	snapshots: Snapshot<Activity>[];
}
