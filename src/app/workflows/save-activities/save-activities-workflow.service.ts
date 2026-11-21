import { inject, Service } from '@angular/core';
import { Workflow } from '@workflows/Workflow';
import {
	TimestampsStepService,
	GetActivitySnapshotsStepService,
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
	private readonly timestamps = inject(TimestampsStepService);
	private readonly snapshots = inject(GetActivitySnapshotsStepService);
	private readonly save = inject(SaveActivitiesStepService);
	private readonly changes = inject(SaveChangesStepService);
	private readonly issues = inject(UpdateAffectedIssuesStepService);

	private readonly workflow = new Workflow<SaveActivitiesContext>([
		this.timestamps,
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
