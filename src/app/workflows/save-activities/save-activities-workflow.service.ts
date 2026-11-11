import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	RelinkActivitiesStepService,
} from '@workflows/save-activities/steps/relink-activities-step.service';
import { Activity } from '@entities';
import {
	RemoveActivitiesStepService,
} from '@workflows/save-activities/steps/remove-activities-step.service';
import {
	SaveActivitiesStepService,
} from '@workflows/save-activities/steps/save-activities-step.service';
import {
	UpdateAffectedIssuesStepService,
} from '@workflows/save-activities/steps/update-affected-issues-step.service';
import {
	UpdateAffectedProjectsStepService,
} from '@workflows/save-activities/steps/update-affected-projects-step.service';

@Service()
export class SaveActivitiesWorkflowService {
	private readonly relink = inject(RelinkActivitiesStepService);
	private readonly saveActivities = inject(SaveActivitiesStepService);
	private readonly removeActivities = inject(RemoveActivitiesStepService);
	private readonly updateIssues = inject(UpdateAffectedIssuesStepService);
	private readonly updateProjects = inject(UpdateAffectedProjectsStepService);

	private readonly workflow = new Workflow([
		this.relink,
		this.saveActivities,
		this.removeActivities,
		this.updateIssues,
		this.updateProjects,
	]);

	public run(activitiesToSave: Activity[], activitiesToRemove: Activity[]) {
		return this.workflow.run({
			activitiesToSave,
			activitiesToRemove,
			affectedIssueIds: [],
		});
	}
}
