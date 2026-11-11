import { Activity } from '@entities';

export interface SaveActivitiesContext {
	activitiesToSave: Activity[];
	affectedIssueIds: string[];
}
