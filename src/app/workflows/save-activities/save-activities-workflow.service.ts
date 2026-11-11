import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	GetActivitySnapshotsStepService,
} from '@workflows/save-activities/steps/get-activity-snapshots-step.service';
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
import {
	GetAffectedIssuesStepService
} from '@workflows/save-activities/steps/get-affected-issues-step.service';

@Service()
export class SaveActivitiesWorkflowService {
	private readonly snapshot = inject(GetActivitySnapshotsStepService);
	private readonly relink = inject(RelinkActivitiesStepService);
	private readonly getAffectedIssues = inject(GetAffectedIssuesStepService);
	private readonly saveActivities = inject(SaveActivitiesStepService);
	private readonly removeActivities = inject(RemoveActivitiesStepService);
	private readonly updateIssues = inject(UpdateAffectedIssuesStepService);
	private readonly updateProjects = inject(UpdateAffectedProjectsStepService);

	private readonly workflow = new Workflow([
		this.snapshot,
		this.relink,
		this.getAffectedIssues,
		this.saveActivities,
		this.removeActivities,
		this.updateIssues,
		this.updateProjects,
	]);

	public run(activitiesToSave: Activity[], activitiesToRemove: Activity[]) {
		return this.workflow.run({
			activities: {
				toSave: activitiesToSave,
				toRemove: activitiesToRemove,
			},
			snapshots: {
				beforeSave: [],
				beforeRemove: [],
			},
			affectedIssues: [],
		});
	}
}
