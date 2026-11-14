import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import { GetActivitySnapshotsStepService } from '@workflows/save-activities/steps/get-activity-snapshots-step.service';
import {
	RelinkActivitiesStepService,
} from '@workflows/save-activities/steps/relink-activities-step.service';
import { Activity } from '@entities';
import {
	SaveChangesStepService,
} from '@workflows/save-activities/steps/save-changes-step.service';
import {
	UpdateAffectedIssuesStepService,
} from '@workflows/save-activities/steps/update-affected-issues-step.service';
import {
	SaveActivitiesContext
} from '@workflows/save-activities/save-activities-context';
import {
	SaveActivitiesStepService
} from '@workflows/save-activities/steps/save-activities-step.service';

@Service()
export class SaveActivitiesWorkflowService {
	private readonly relink = inject(RelinkActivitiesStepService);
	private readonly snapshots = inject(GetActivitySnapshotsStepService);
	private readonly save = inject(SaveActivitiesStepService);
	private readonly changes = inject(SaveChangesStepService);
	private readonly issues = inject(UpdateAffectedIssuesStepService);

	private readonly workflow = new Workflow<SaveActivitiesContext>([
		this.relink,
		this.snapshots,
		this.save,
		this.changes,
		this.issues
	]);

	public run(activitiesToSave: Activity[], activitiesToRemove: Activity[]) {
		return this.workflow.run({
			activities: {
				toSave: activitiesToSave,
				toRemove: activitiesToRemove,
			},
			snapshots: [],
			affectedIssues: [],
		});
	}
}
