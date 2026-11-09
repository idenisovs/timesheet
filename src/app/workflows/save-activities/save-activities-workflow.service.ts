import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	RelinkActivitiesStepService
} from '@workflows/save-activities/relink-activities-step.service';
import { Activity } from '@entities';
import {
	SaveActivitiesStepService
} from '@workflows/save-activities/save-activities-step.service';

@Service()
export class SaveActivitiesWorkflowService {
	private readonly relink = inject(RelinkActivitiesStepService);
	private readonly saveActivities = inject(SaveActivitiesStepService);

	private readonly workflow = new Workflow([
		this.relink, this.saveActivities
	]);

	public run(activities: Activity[]) {
		return this.workflow.run({
			activities,
			affectedIssueIds: []
		});
	}
}
