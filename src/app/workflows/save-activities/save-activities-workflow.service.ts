import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	GetActivitySnapshotsStepService,
	RelinkActivitiesStepService,
	SaveChangesStepService,
	UpdateAffectedIssuesStepService,
	SaveActivitiesStepService,
} from '@workflows/save-activities/steps';
import { Activity } from '@entities';
import {
	SaveActivitiesContext
} from '@workflows/save-activities/save-activities-context';

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
		});
	}
}
