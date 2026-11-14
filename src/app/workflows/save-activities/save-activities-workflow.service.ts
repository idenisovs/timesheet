import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	RelinkActivitiesStepService,
} from '@workflows/save-activities/steps/relink-activities-step.service';
import { Activity } from '@entities';
import { CalculateChangesStepService } from '@workflows/save-activities/steps/calculate-changes-step.service';
import {
	SaveChangesStepService,
} from '@workflows/save-activities/steps/save-changes-step.service';
import {
	UpdateAffectedIssuesStepService,
} from '@workflows/save-activities/steps/update-affected-issues-step.service';
import {
	UpdateAffectedProjectsStepService,
} from '@workflows/save-activities/steps/update-affected-projects-step.service';
import {
	GetAffectedIssuesStepService
} from '@workflows/save-activities/steps/get-affected-issues-step.service';
import {
	SaveActivitiesContext
} from '@workflows/save-activities/save-activities-context';

@Service()
export class SaveActivitiesWorkflowService {
	private readonly relinkActivities = inject(RelinkActivitiesStepService);
	private readonly calculateChanges = inject(CalculateChangesStepService);
	private readonly saveChanges = inject(SaveChangesStepService);
	private readonly getAffectedIssues = inject(GetAffectedIssuesStepService);
	private readonly updateIssues = inject(UpdateAffectedIssuesStepService);
	private readonly updateProjects = inject(UpdateAffectedProjectsStepService);

	private readonly workflow = new Workflow<SaveActivitiesContext>([
		this.relinkActivities,
		this.calculateChanges,
		this.saveChanges,
		this.getAffectedIssues,
		this.updateIssues,
		this.updateProjects,
	]);

	public run(activitiesToSave: Activity[], activitiesToRemove: Activity[]) {
		return this.workflow.run({
			activities: {
				toSave: activitiesToSave,
				toRemove: activitiesToRemove,
			},
			changes: [],
			affectedIssues: [],
		});
	}
}
