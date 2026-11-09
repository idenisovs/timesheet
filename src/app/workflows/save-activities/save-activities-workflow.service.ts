import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	RelinkActivitiesStepService,
} from '@workflows/save-activities/steps/relink-activities-step.service';
import { Activity } from '@entities';
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
	private readonly updateIssues = inject(UpdateAffectedIssuesStepService);
	private readonly updateProjects = inject(UpdateAffectedProjectsStepService);

	private readonly workflow = new Workflow([
		this.relink,
		this.saveActivities,
		this.updateIssues,
		this.updateProjects,
	]);

	public run(activities: Activity[]) {
		return this.workflow.run({
			activities,
			affectedIssueIds: [],
		});
	}
}
