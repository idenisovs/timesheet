import { inject, Injectable } from '@angular/core';

import { SaveActivitiesWorkflowService } from '@workflows/save-activities/save-activities-workflow.service';
import { Activity } from '@entities';

@Injectable({
	providedIn: 'root',
})
export class ImportActivitiesService {
	private activitySaveWorkflow = inject(SaveActivitiesWorkflowService);

	async save(activity: Activity): Promise<void> {
		await this.activitySaveWorkflow.run([activity], []);
	}

	async remove(activities: Activity[]): Promise<void> {
		await this.activitySaveWorkflow.run([], activities);
	}
}
