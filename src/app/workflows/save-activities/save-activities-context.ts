import { Activity } from '@entities';

export interface SaveActivitiesContext {
	activities: Activity[];
	affectedIssueIds: string[];
}
