import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	RelinkActivitiesStepService
} from '@workflows/save-activities/relink-activities-step.service';
import { Activity } from '@entities';

@Service()
export class SaveActivitiesWorkflowService {
	private readonly relink = inject(RelinkActivitiesStepService);

	private readonly workflow = new Workflow([
		this.relink
	]);

	public run(activities: Activity[]) {
		return this.workflow.run({
			activities
		});
	}
}
