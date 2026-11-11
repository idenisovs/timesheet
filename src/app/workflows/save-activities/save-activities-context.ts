import { Activity } from '@entities';

export interface SaveActivitiesContext {
	activitiesToSave: Activity[];
	activitiesToRemove: Activity[];
	affectedIssueIds: string[];
}
